const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { Token, ChainId } = require("@uniswap/sdk");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({
  trades: [
    {
      tokenAddress: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      token: "BNB",
      toBuy: 1,
      toSell: 0,
      buyLimit: 180,
      sellLimit: 0,
    },
  ],
  config: {},
  chatIds: [],
  notifications: [],
}).write();

const BUSD = new Token(
  ChainId.ROPSTEN,
  "0xc2118d4d90b274016cB7a54c03EF52E6c537D957",
  18,
  "DAI",
  "DAI"
);

module.exports = { db, BUSD };
