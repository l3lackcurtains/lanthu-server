const {
  Fetcher,
  Percent,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
} = require("@pancakeswap/sdk");

const { ethers } = require("ethers");
const { parseEther, formatEther } = require("ethers/lib/utils");
const tokenABI = require("./abi/token.json");
const { BUSD, TradeModal, LogModal } = require("./common/db");

const {
  provider,
  wallet,
  pancakeSwapContract,
  pancakeSwapContractAddress,
  chainID,
  maxAllowance,
  gasLimit,
  slippage,
  GWEI,
} = require("./common/wallet");

const buyToken = async (trade, coin, amount, tokenAmount) => {
  try {
    const amountOut = parseEther(amount.toString());

    const to = wallet.address;

    const tokenContract = new ethers.Contract(BUSD.address, tokenABI, wallet);

    const allowance = await tokenContract.allowance(
      to,
      pancakeSwapContractAddress
    );

    if (allowance.lte(amountOut)) {
      const approved = await tokenContract.approve(
        pancakeSwapContractAddress,
        new ethers.BigNumber.from(maxAllowance),
        {
          gasLimit: gasLimit,
        }
      );

      await provider.once(approved.hash, () => {
        console.log("Approved...");
      });
    }

    const balance = await tokenContract.balanceOf(to);
    if (balance.lte(amountOut)) {
      console.log(
        `Low balance ${formatEther(balance)} < ${formatEther(
          amountOut
        )} for this trade.`
      );
      return;
    }

    const TOKEN = new Token(chainID, coin.address, 18, coin.name);

    const pair = await Fetcher.fetchPairData(BUSD, TOKEN, provider);

    const route = new Route([pair], BUSD, TOKEN);

    const tradeData = new Trade(
      route,
      new TokenAmount(BUSD, amountOut),
      TradeType.EXACT_INPUT
    );

    const slippageTolerance = new Percent(slippage.toString(), "100");

    const amountOutMin = tradeData.minimumAmountOut(slippageTolerance).raw;

    const path = [];

    for (let px of route.path) {
      path.push(px.address);
    }

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const value = tradeData.inputAmount.raw;

    const bought = await pancakeSwapContract.swapExactTokensForTokens(
      new ethers.BigNumber.from(String(value)),
      new ethers.BigNumber.from(String(amountOutMin)),
      path,
      to,
      deadline,
      {
        gasLimit: gasLimit,
      }
    );

    await bought.wait();

    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = false;
    tradeInDB.success = true;
    await tradeInDB.save();

    console.log(`Buy completed.`);
  } catch (e) {
    const msg = `Error on token buy! ${coin.name}: ${trade.amount} USD @ ${trade.limit} USD (${tokenAmount} ${coin.name})}`;
    const newLog = new LogModal({ message: msg, details: e.toString() });
    newLog.save();
    console.log(msg);
    console.log(e);

    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = true;
    tradeInDB.success = false;
    await tradeInDB.save();
  }
};

const sellToken = async (trade, coin, amount, tokenAmount) => {
  try {
    const amountIn = parseEther(amount.toString());

    const to = wallet.address;

    const tokenContract = new ethers.Contract(coin.address, tokenABI, wallet);

    const allowance = await tokenContract.allowance(
      to,
      pancakeSwapContractAddress
    );

    if (allowance.lte(amountIn)) {
      const approved = await tokenContract.approve(
        pancakeSwapContractAddress,
        new ethers.BigNumber.from(maxAllowance),
        {
          gasPrice: 10 * GWEI,
          gasLimit: gasLimit,
        }
      );

      await provider.once(approved.hash, () => {
        console.log("Approved...");
      });
    }

    const balance = await tokenContract.balanceOf(to);
    const tokenBalance = parseEther(tokenAmount.toString());

    if (balance.lte(tokenBalance)) {
      console.log(
        `Low balance ${formatEther(balance)} < ${formatEther(
          tokenBalance
        )} for this trade.`
      );
      return;
    }

    const TOKEN = new Token(chainID, coin.address, 18, coin.name);

    const pair = await Fetcher.fetchPairData(TOKEN, BUSD, provider);

    const route = new Route([pair], TOKEN, BUSD);

    const tradeData = new Trade(
      route,
      new TokenAmount(BUSD, amountIn),
      TradeType.EXACT_OUTPUT
    );

    const slippageTolerance = new Percent(slippage.toString(), "100");

    const amountInMax = tradeData.maximumAmountIn(slippageTolerance).raw;

    const path = [];

    for (let px of route.path) {
      path.push(px.address);
    }

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const value = tradeData.inputAmount.raw;

    const sold = await pancakeSwapContract.swapTokensForExactTokens(
      new ethers.BigNumber.from(String(value)),
      new ethers.BigNumber.from(String(amountInMax)),
      path,
      to,
      deadline,
      {
        gasLimit: gasLimit,
      }
    );

    await sold.wait();

    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = false;
    tradeInDB.success = true;
    await tradeInDB.save();

    console.log(`Sell completed.`);
  } catch (e) {
    const msg = `Error on token sell! ${coin.name}: ${coin.address}`;
    const newLog = new LogModal({ message: msg, details: e.toString() });
    newLog.save();
    console.log(e);
    console.log(msg);

    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = true;
    tradeInDB.success = false;
    await tradeInDB.save();
  }
};

module.exports = { buyToken, sellToken };
