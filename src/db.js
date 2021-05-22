const mongoose = require("mongoose");
require("dotenv").config();
const { Token, ChainId } = require("@uniswap/sdk");

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@cluster0.93hh2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

const Schema = mongoose.Schema;

const tradeSchema = new Schema({
  id: Number,
  address: String,
  type: {
    type: String,
    enum: ["BUY", "SELL"],
    default: "BUY",
  },
  token: String,
  amount: Number,
  limit: Number,
});

const TradeModal = mongoose.model("Trade", tradeSchema);

const tokenSchema = new Schema({
  name: String,
  address: String,
});

const TokenModal = mongoose.model("Token", tokenSchema);

const BUSD = new Token(
  ChainId.ROPSTEN,
  "0xc2118d4d90b274016cB7a54c03EF52E6c537D957",
  18,
  "DAI",
  "DAI"
);

module.exports = { BUSD, TradeModal, TokenModal };
