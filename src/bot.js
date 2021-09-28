const { TradeModal, BUSD, TokenModal, LogModal } = require("./common/db");
const { provider, chainID } = require("./common/wallet");
const { Fetcher, Route, Token } = require("@pancakeswap/sdk");
const { buyToken, sellToken } = require("./trade");

const startTheBot = async () => {
  const trades = await TradeModal.find();

  for (let trade of trades) {
    // Skip success trades..
    if (trade.success || trade.error) continue;

    const tokenName = trade.token.toUpperCase();
    const coin = await TokenModal.findOne({ name: tokenName });

    try {
      const TOKEN = new Token(chainID, coin.address, 18, coin.name);

      const pair = await Fetcher.fetchPairData(BUSD, TOKEN, provider);

      const route = new Route([pair], TOKEN);

      const currentPrice = route.midPrice.toSignificant(8);

      if (
        trade.type === "BUY" &&
        trade.limit > 0 &&
        currentPrice < trade.limit
      ) {
        const tokenAmount = parseFloat(trade.amount).toFixed(18);
        const amountUSD = parseFloat(trade.amount * currentPrice).toFixed(18);
        console.log(
          `Start buying ${tokenAmount} ${TOKEN.symbol} (${amountUSD} USD) `
        );
        await buyToken(trade, coin, amountUSD, tokenAmount);
      } else if (
        trade.type === "SELL" &&
        trade.limit > 0 &&
        currentPrice > trade.limit
      ) {
        const tokenAmount = parseFloat(trade.amount).toFixed(18);
        const amountUSD = parseFloat(trade.amount * currentPrice).toFixed(18);
        console.log(
          `Start selling ${tokenAmount} ${TOKEN.symbol} (${amountUSD} USD) `
        );
        await sellToken(trade, coin, amountUSD, tokenAmount);
      }
    } catch (e) {
      const msg = `Error on token parse! ${coin.name}: ${coin.address}`;
      const newLog = new LogModal({ message: msg, details: e.toString() });
      newLog.save();

      console.log(e);
      console.log(msg);

      const tradeInDB = await TradeModal.findOne({ id: trade.id });
      tradeInDB.error = true;
      tradeInDB.success = false;
      await tradeInDB.save();
    }
  }
};

module.exports = { startTheBot };
