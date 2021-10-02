const { TradeModal, TokenModal, LogModal } = require("./common/db");
const { provider, chainID } = require("./common/wallet");
const { Fetcher, Route, Token, WETH } = require("@pancakeswap/sdk");
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

      const pair = await Fetcher.fetchPairData(WETH[chainID], TOKEN, provider);

      const route = new Route([pair], TOKEN);

      const currentPrice = route.midPrice.toSignificant(8);

      if (
        trade.type === "BUY" &&
        trade.limit > 0 &&
        currentPrice < trade.limit
      ) {
        const tokenAmount = parseFloat(trade.amount).toFixed(18);
        const amountBNB = parseFloat(trade.amount * currentPrice).toFixed(18);
        console.log(
          `Start buying ${tokenAmount} ${TOKEN.symbol} (${amountBNB} BNB) `
        );
        await buyToken(trade, coin, amountBNB, tokenAmount);
      } else if (
        trade.type === "SELL" &&
        trade.limit > 0 &&
        currentPrice > trade.limit
      ) {
        const tokenAmount = parseFloat(trade.amount).toFixed(18);
        const amountBNB = parseFloat(trade.amount * currentPrice).toFixed(18);
        console.log(
          `Start selling ${tokenAmount} ${TOKEN.symbol} (${amountBNB} BNB) `
        );
        await sellToken(trade, coin, amountBNB, tokenAmount);
      }
    } catch (e) {
      const errStr = e.toString();
      if (errStr.includes("getReserves()")) {
        const msg = `No token pair found for ${coin.name}.`;
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
  }
};

module.exports = { startTheBot };
