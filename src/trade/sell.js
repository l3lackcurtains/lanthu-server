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
const { formatEther } = require("ethers/lib/utils");
const tokenABI = require("../abi/token.json");
const { TradeModal, LogModal } = require("../common/db");
const { sendMessage } = require("../common/notification");

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
  BUSD,
} = require("../common/wallet");

const sellToken = async (trade, coin, swapAmount, tokenAmount) => {
  try {
    // Check the SWAP TOKEN
    let SWAPTOKEN = null;
    if (coin.swapWith === "BUSD") {
      SWAPTOKEN = BUSD;
    } else {
      SWAPTOKEN = WETH[chainID];
    }

    const to = wallet.address;
    const tokenContract = new ethers.Contract(coin.address, tokenABI, wallet);

    // Get amount to sell
    const amountIn = ethers.utils.parseUnits(
      tokenAmount.toString(),
      coin.decimal
    );

    // Check Allowance
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
          gasPrice: 5 * GWEI,
        }
      );
      await provider.once(approved.hash, () => {
        console.log("Approved...");
      });
    }

    // Check Balance
    const balance = await tokenContract.balanceOf(to);
    const tokenBalance = ethers.utils.parseUnits(
      tokenAmount.toString(),
      coin.decimal
    );

    if (balance.lte(tokenBalance)) {
      console.log(
        `Low balance ${formatEther(balance)} < ${formatEther(
          tokenBalance
        )} for this trade.`
      );
      return;
    }

    const TOKEN = new Token(chainID, coin.address, coin.decimal, coin.name);

    const pair = await Fetcher.fetchPairData(TOKEN, SWAPTOKEN, provider);

    const route = new Route([pair], TOKEN, SWAPTOKEN);

    const tradeData = new Trade(
      route,
      new TokenAmount(TOKEN, amountIn),
      TradeType.EXACT_INPUT
    );

    const slippageTolerance = new Percent(slippage.toString(), "100");

    const amountOutMin = tradeData.minimumAmountOut(slippageTolerance).raw;

    const path = [];

    for (let px of route.path) {
      path.push(px.address);
    }

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    const value = tradeData.inputAmount.raw;

    const sold = await pancakeSwapContract.swapExactTokensForTokens(
      new ethers.BigNumber.from(String(value)),
      new ethers.BigNumber.from(String(amountOutMin)),
      path,
      to,
      deadline,
      {
        gasLimit: gasLimit,
        gasPrice: 5 * GWEI,
      }
    );

    await sold.wait();

    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = false;
    tradeInDB.success = true;
    await tradeInDB.save();

    const msg = `Sold ${tokenAmount} ${coin.name} at ${trade.limit} ${coin.name}`;
    console.log(msg);
    await sendMessage("Token Sell completed!", msg);
  } catch (e) {
    const msg = `Error on token sell! ${tokenAmount} ${coin.name} at ${trade.limit} ${coin.name}`;
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

module.exports = { sellToken };
