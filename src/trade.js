const {
  Fetcher,
  Percent,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  WETH,
} = require("@pancakeswap/sdk");

const { ethers } = require("ethers");
const { parseEther, formatEther } = require("ethers/lib/utils");
const tokenABI = require("./abi/token.json");
const { TradeModal, LogModal } = require("./common/db");
const { sendMessage } = require("./notification");

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

const buyToken = async (trade, coin, amountBNB, tokenAmount, swapWith) => {
  try {
    let SWAPTOKEN = null;
    if (swapWith === "BUSD") {
      SWAPTOKEN = BUSD;
    } else {
      SWAPTOKEN = WETH[chainID];
    }

    const amountOut = parseEther(amountBNB.toString());

    const to = wallet.address;

    const tokenContract = new ethers.Contract(
      SWAPTOKEN.address,
      tokenABI,
      wallet
    );

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
          gasPrice: 10 * GWEI,
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

    const pair = await Fetcher.fetchPairData(SWAPTOKEN, TOKEN, provider);

    const route = new Route([pair], SWAPTOKEN, TOKEN);

    const tradeData = new Trade(
      route,
      new TokenAmount(SWAPTOKEN, amountOut),
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
        gasPrice: 10 * GWEI,
      }
    );

    await bought.wait();

    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = false;
    tradeInDB.success = true;
    await tradeInDB.save();

    const msg = `Bought ${tokenAmount} ${coin.name} at ${trade.limit} ${coin.name})}`;
    console.log(msg);
    await sendMessage("Token Buy completed!", msg);
  } catch (e) {
    const msg = `Error on token buy! ${tokenAmount} ${coin.name} at ${trade.limit} ${coin.name})}`;

    const newLog = new LogModal({ message: msg, details: e.toString() });
    newLog.save();

    console.log(msg);
    console.log(e);

    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = true;
    tradeInDB.success = false;
    await tradeInDB.save();

    await sendMessage("Error on token buy!", msg);
  }
};

const sellToken = async (trade, coin, amountBNB, tokenAmount, swapWith) => {
  try {
    let SWAPTOKEN = null;
    if (swapWith === "BUSD") {
      SWAPTOKEN = BUSD;
    } else {
      SWAPTOKEN = WETH[chainID];
    }

    const amountIn = parseEther(amountBNB.toString());

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
          gasLimit: gasLimit,
          gasPrice: 20 * GWEI,
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

    const pair = await Fetcher.fetchPairData(TOKEN, SWAPTOKEN, provider);

    const route = new Route([pair], TOKEN, SWAPTOKEN);

    const tradeData = new Trade(
      route,
      new TokenAmount(SWAPTOKEN, amountIn),
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
        gasPrice: 10 * GWEI,
      }
    );

    await sold.wait();

    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = false;
    tradeInDB.success = true;
    await tradeInDB.save();

    const msg = `Sold ${tokenAmount} ${coin.name} at ${trade.limit} ${coin.name})}`;
    console.log(msg);
    await sendMessage("Token Sell completed!", msg);
  } catch (e) {
    const msg = `Error on token sell! ${tokenAmount} ${coin.name} at ${trade.limit} ${coin.name})}`;
    const newLog = new LogModal({ message: msg, details: e.toString() });
    newLog.save();
    console.log(e);
    console.log(msg);

    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = true;
    tradeInDB.success = false;
    await tradeInDB.save();

    await sendMessage("Error on token sell!", msg);
  }
};

module.exports = { buyToken, sellToken };
