const { db, BUSD } = require("./db");
const { provider } = require("./wallet");
const { ChainId, Fetcher, Route, Token } = require("@uniswap/sdk");
const { buyToken, sellToken } = require("./trade");

const startTheBot = async () => {
  const trades = db.get("trades").value();

  for (let trade of trades) {
    const TOKEN = new Token(
      ChainId.ROPSTEN,
      trade.tokenAddress,
      18,
      trade.token
    );

    const pair = await Fetcher.fetchPairData(BUSD, TOKEN, provider);

    const route = new Route([pair], TOKEN);

    const currentPrice = route.midPrice.toSignificant(6);
    console.log(`Current ${TOKEN.symbol} Price: ${currentPrice}`);

    if (trade.buyLimit && trade.buyLimit > 0 && currentPrice < trade.buyLimit) {
      const amountUSD = parseFloat(trade.toBuy).toFixed(8);
      const amount = parseFloat(trade.toBuy / currentPrice).toFixed(8);
      console.log(`Start buying ${amount} ${TOKEN.symbol} (${amountUSD} USD) `);
      await buyToken(trade, amountUSD);
    } else if (
      trade.sellLimit &&
      trade.sellLimit > 0 &&
      currentPrice > trade.sellLimit
    ) {
      const amountUSD = parseFloat(trade.toSell).toFixed(8);
      const amount = parseFloat(trade.toSell / currentPrice).toFixed(8);
      console.log(
        `Start selling ${amount} ${TOKEN.symbol} (${amountUSD} USD) `
      );
      await sellToken(trade, amountUSD);
    }
  }
};

module.exports = { startTheBot };
