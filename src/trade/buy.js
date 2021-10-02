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

const buyToken = async (trade, coin, swapAmount, tokenAmount) => {
  try {
    let SWAPTOKEN = null;
    if (coin.swapWith === "BUSD") {
      SWAPTOKEN = BUSD;
    } else {
      SWAPTOKEN = WETH[chainID];
    }

    const amountIn = ethers.utils.parseUnits(swapAmount.toString(), 18);

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

    const balance = await tokenContract.balanceOf(to);
    if (balance.lte(amountIn)) {
      console.log(
        `Low balance ${formatEther(balance)} < ${formatEther(
          amountIn
        )} for this trade.`
      );
      return;
    }

    const TOKEN = new Token(chainID, coin.address, coin.decimal, coin.name);

    const pair = await Fetcher.fetchPairData(SWAPTOKEN, TOKEN, provider);

    const route = new Route([pair], SWAPTOKEN, TOKEN);

    const tradeData = new Trade(
      route,
      new TokenAmount(SWAPTOKEN, amountIn),
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

    const bought = await pancakeSwapContract.swapExactTokensForTokens(
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

    await bought.wait();

    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = false;
    tradeInDB.success = true;
    await tradeInDB.save();

    const msg = `Bought ${tokenAmount} ${coin.name} at ${trade.limit} ${coin.name}`;
    console.log(msg);
    // Send notification
    await sendMessage("Token Buy completed!", msg);
  } catch (e) {
    // ERROR Handling

    const msg = `Error on token buy! ${tokenAmount} ${coin.name} at ${trade.limit} ${coin.name}`;

    // Save the log
    const newLog = new LogModal({ message: msg, details: e.toString() });
    newLog.save();

    // Update Trade
    const tradeInDB = await TradeModal.findOne({ id: trade.id });
    tradeInDB.error = true;
    tradeInDB.success = false;
    await tradeInDB.save();

    // Send notification
    await sendMessage("Error on token buy!", msg);

    console.log(msg);
    console.log(e);
  }
};

module.exports = { buyToken };
