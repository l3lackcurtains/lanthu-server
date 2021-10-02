const { TradeModal, TokenModal, LogModal } = require("./common/db");
const { provider, chainID, BUSD } = require("./common/wallet");
const { Fetcher, Route, Token, WETH } = require("@pancakeswap/sdk");
const { buyToken } = require("./trade/buy");
const { sellToken } = require("./trade/sell");

const startTheBot = async () => {
  const trades = await TradeModal.find();

  for (let trade of trades) {
    // Skip success trades..
    if (trade.success || trade.error) continue;

    const tokenName = trade.token.toUpperCase();
    const coin = await TokenModal.findOne({ name: tokenName });

    const TOKEN = new Token(chainID, coin.address, coin.decimal, coin.name);

    try {
      // ********************************************
      // Get Current Price
      // ********************************************
      let currentPrice = 0;
      // GET BNB to TOKEN Price
      if (coin.name !== "BNB") {
        const pairBNB = await Fetcher.fetchPairData(
          WETH[chainID],
          TOKEN,
          provider
        );
        const routeBNB = new Route([pairBNB], TOKEN);
        const currentPriceBNB = routeBNB.midPrice.toSignificant(6);

        // GET BNB to BUSD Price
        const pairBUSD = await Fetcher.fetchPairData(
          BUSD,
          WETH[chainID],
          provider
        );
        const routeBUSD = new Route([pairBUSD], WETH[chainID]);
        const currentPriceBUSD = routeBUSD.midPrice.toSignificant(6);

        currentPrice = currentPriceBNB * currentPriceBUSD;
      } else {
        // GET BNB to BUSD Price
        const pairBUSD = await Fetcher.fetchPairData(
          BUSD,
          WETH[chainID],
          provider
        );
        const routeBUSD = new Route([pairBUSD], WETH[chainID]);
        const currentPriceBUSD = routeBUSD.midPrice.toSignificant(6);

        currentPrice = currentPriceBUSD;
      }
      // ********************************************

      // GET BUSD to TOKEN Price
      let currentPriceConversion = 0;
      if (coin.swapWith === "BUSD") {
        const pairTokenBUSD = await Fetcher.fetchPairData(
          BUSD,
          TOKEN,
          provider
        );
        const routeTokenBUSD = new Route([pairTokenBUSD], TOKEN);
        const currentPriceTokenBUSD = routeTokenBUSD.midPrice.toSignificant(6);
        currentPriceConversion = currentPriceTokenBUSD;
      } else {
        const pairBNB = await Fetcher.fetchPairData(
          WETH[chainID],
          TOKEN,
          provider
        );
        const routeBNB = new Route([pairBNB], TOKEN);
        const currentPriceBNB = routeBNB.midPrice.toSignificant(6);
        currentPriceConversion = currentPriceBNB;
      }
      const tokenAmount = parseFloat(trade.amount);
      const swapAmount = parseFloat(trade.amount * currentPriceConversion);

      // ********************************************
      // EXECUTE Transaction
      // ********************************************
      if (
        trade.type === "BUY" &&
        trade.limit > 0 &&
        currentPrice < trade.limit
      ) {
        console.log(
          `Start buying ${tokenAmount} ${TOKEN.symbol} (${swapAmount} ${coin.swapWith}) `
        );
        await buyToken(trade, coin, swapAmount, tokenAmount, currentPrice);
      } else if (
        trade.type === "SELL" &&
        trade.limit > 0 &&
        currentPrice > trade.limit
      ) {
        console.log(
          `Start selling ${tokenAmount} ${TOKEN.symbol} (${swapAmount} ${coin.swapWith}) `
        );
        await sellToken(trade, coin, swapAmount, tokenAmount, currentPrice);
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
