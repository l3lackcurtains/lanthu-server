const {
  ChainId,
  Fetcher,
  Percent,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
} = require("@uniswap/sdk");

const { ethers } = require("ethers");
const { parseEther, formatEther } = require("ethers/lib/utils");
const tokenABI = require("./abi/token.json");
const { BUSD, TradeModal } = require("./db");

const GWEI = 1000 * 1000 * 1000;

const {
  provider,
  wallet,
  pancakeSwapContract,
  pancakeSwapContractAddress,
} = require("./wallet");

const buyToken = async (trade, amount) => {
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
        "1000000000000000000000000",
        {
          gasPrice: 10 * GWEI,
          gasLimit: 6738966,
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

    const TOKEN = new Token(ChainId.ROPSTEN, trade.address, 18, trade.token);

    const pair = await Fetcher.fetchPairData(BUSD, TOKEN, provider);

    const route = new Route([pair], BUSD, TOKEN);

    const tradeData = new Trade(
      route,
      new TokenAmount(BUSD, amountOut),
      TradeType.EXACT_INPUT
    );

    const slippageTolerance = new Percent("2", "100");

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
        gasLimit: 5000000,
      }
    );

    await bought.wait();

    await TradeModal.deleteOne({ id: trade.id });

    console.log(`Buy completed.`);
  } catch (e) {
    console.log("Error on token buy!");
    console.log(e);
    await TradeModal.deleteOne({ id: trade.id });
  }
};

const sellToken = async (trade, amount, tokenAmount) => {
  try {
    const amountIn = parseEther(amount.toString());

    const to = wallet.address;

    const tokenContract = new ethers.Contract(trade.address, tokenABI, wallet);

    const allowance = await tokenContract.allowance(
      to,
      pancakeSwapContractAddress
    );

    if (allowance.lte(amountIn)) {
      const approved = await tokenContract.approve(
        pancakeSwapContractAddress,
        "1000000000000000000000000",
        {
          gasLimit: 8500000,
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

    const TOKEN = new Token(ChainId.ROPSTEN, trade.address, 18, trade.token);

    const pair = await Fetcher.fetchPairData(TOKEN, BUSD, provider);

    const route = new Route([pair], TOKEN, BUSD);

    const tradeData = new Trade(
      route,
      new TokenAmount(BUSD, amountIn),
      TradeType.EXACT_OUTPUT
    );

    const slippageTolerance = new Percent("2", "100");

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
        gasLimit: 6700000,
      }
    );

    await sold.wait();

    await TradeModal.deleteOne({ id: trade.id });

    console.log(`Sell completed.`);
  } catch (e) {
    console.log("Error on token sell!");
    console.log(e);
    await TradeModal.deleteOne({ id: trade.id });
  }
};

module.exports = { buyToken, sellToken };
