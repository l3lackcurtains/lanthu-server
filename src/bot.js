const { TradeModal, BUSD } = require("./db");
const { provider } = require("./wallet");
const { ChainId, Fetcher, Route, Token } = require("@uniswap/sdk");
const { buyToken, sellToken } = require("./trade");

const startTheBot = async () => {
  const trades = await TradeModal.find();

  for (let trade of trades) {
    try {
      const TOKEN = new Token(ChainId.ROPSTEN, trade.address, 18, trade.token);

      const pair = await Fetcher.fetchPairData(BUSD, TOKEN, provider);

      const route = new Route([pair], TOKEN);

      const currentPrice = route.midPrice.toSignificant(6);
      console.log(`Current ${TOKEN.symbol} Price: ${currentPrice}`);

      if (
        trade.type === "BUY" &&
        trade.limit > 0 &&
        currentPrice < trade.limit
      ) {
        const amountUSD = parseFloat(trade.amount).toFixed(8);
        const tokenAmount = parseFloat(trade.amount / currentPrice).toFixed(8);
        console.log(
          `Start buying ${tokenAmount} ${TOKEN.symbol} (${amountUSD} USD) `
        );
        await buyToken(trade, amountUSD, tokenAmount);
      } else if (
        trade.type === "SELL" &&
        trade.limit > 0 &&
        currentPrice > trade.limit
      ) {
        const amountUSD = parseFloat(trade.amount).toFixed(8);
        const tokenAmount = parseFloat(trade.amount / currentPrice).toFixed(8);
        console.log(
          `Start selling ${tokenAmount} ${TOKEN.symbol} (${amountUSD} USD) `
        );
        await sellToken(trade, amountUSD, tokenAmount);
      }
    } catch (e) {
      console.log(`Error on token parse! ${trade.token}: ${trade.address}`);
      console.log(`Deleting trade...`);
      await TradeModal.deleteOne({ id: trade.id });
    }
  }
};

module.exports = { startTheBot };
