require("dotenv").config();
const { formatEther } = require("@ethersproject/units");
const { Route, Token, Fetcher, WETH } = require("@pancakeswap/sdk");
const { ethers } = require("ethers");
const express = require("express");

const tokenABI = require("../abi/token.json");
const {
  TokenModal,
  TradeModal,
  DeviceModal,
  LogModal,
} = require("../common/db");
const { wallet, chainID, provider } = require("../common/wallet");
const router = express.Router();

const getTokenPriceAndBalance = async (token) => {
  const tokenContract = new ethers.Contract(token.address, tokenABI, wallet);

  const balance = await tokenContract.balanceOf(wallet.address);

  const bnbContract = new ethers.Contract(
    WETH[chainID].address,
    tokenABI,
    wallet
  );
  const bnbBalance = await bnbContract.balanceOf(wallet.address);

  const TOKEN = new Token(chainID, token.address, 18, token.name);

  const pair = await Fetcher.fetchPairData(WETH[chainID], TOKEN, provider);

  const route = new Route([pair], TOKEN);

  const price = route.midPrice.toSignificant(8);

  return {
    balance: parseFloat(formatEther(balance)).toFixed(8),
    price: parseFloat(price).toFixed(8),
    bnbBalance: parseFloat(formatEther(bnbBalance)).toFixed(8),
  };
};

router.post("/devices", async (req, res) => {
  const token = req.body.token;
  try {
    const deviceInDB = await DeviceModal.findOne({ token });
    if (deviceInDB === null) {
      const newDevice = new DeviceModal({ token });
      newDevice.save();
      res.json({ success: true, message: `Device added` });
    }
  } catch (e) {
    res.json({ success: false, message: `Error on device add.` });
  }
});

router.get("/devices/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const device = await DeviceModal.findOne({ token });
    res.json({ success: true, message: device });
  } catch (e) {
    res.json({ success: false, message: `Error on device fetch.` });
  }
});

router.post("/tokens", async (req, res) => {
  const name = req.body.name;
  const address = req.body.address;
  const slug = req.body.slug;

  if (address.length !== 42 || address.substr(0, 2) !== "0x") {
    res.json({ success: false, message: `Address wrong.` });
    return;
  }

  try {
    const newToken = new TokenModal({ name, address, slug });
    newToken.save();
    res.json({ success: true, message: `Token added` });
  } catch (e) {
    res.json({ success: false, message: `Error on token add.` });
  }
});

router.put("/tokens/:name", async (req, res) => {
  const name = req.params.name;
  const address = req.body.address;
  const slug = req.body.slug;
  const newName = req.body.name;

  if (address.length !== 42 || address.substr(0, 2) !== "0x") {
    res.json({ success: false, message: `Address wrong.` });
    return;
  }

  try {
    await TokenModal.updateOne(
      { name },
      {
        name: newName,
        address: address,
        slug: slug,
      }
    );
    res.json({ success: true, message: `Token updated.` });
  } catch (e) {
    res.json({ success: false, message: `Error on token add.` });
  }
});

router.delete("/tokens/:name", async (req, res) => {
  const name = req.params.name.toUpperCase();

  try {
    const tokenDb = await TokenModal.findOne({ name });
    if (tokenDb !== null) {
      await TokenModal.deleteOne({ name });
      res.json({ success: true, message: `Token removed` });
    }
  } catch (e) {
    res.json({ success: false, message: `Error on token remove.` });
  }
});

router.get("/tokens", async (req, res) => {
  try {
    const tokens = await TokenModal.find().sort({ updatedAt: -1 });

    res.json({ success: true, message: tokens });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: `Error on tokens fetch.` });
  }
});

router.get("/tokens/:name", async (req, res) => {
  const name = req.params.name.toUpperCase();

  try {
    const token = await TokenModal.findOne({ name });

    if (token !== null) {
      res.json({ success: true, message: token });
    } else {
      res.json({ success: false, message: "No token." });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: `Error on token fetch.` });
  }
});

router.get("/tokeninfo/:name", async (req, res) => {
  const name = req.params.name.toUpperCase();

  try {
    const token = await TokenModal.findOne({ name });

    if (token !== null) {
      const { balance, price, busdBalance } = await getTokenPriceAndBalance(
        token
      );

      const data = {
        token: token.name,
        address: token.address,
        balance,
        busdBalance,
        price,
      };

      res.json({ success: true, message: data });
    } else {
      res.json({ success: false, message: "No token." });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: `Error on token fetch.` });
  }
});

router.post("/trades", async (req, res) => {
  const token = req.body.token.toString().toUpperCase();
  const limit = parseFloat(req.body.limit);
  const amount = parseFloat(req.body.amount);
  const type = req.body.type;
  const success = req.body.success;
  const error = req.body.error;

  try {
    const tokenDb = await TokenModal.findOne({ name: token });
    if (tokenDb !== null) {
      const newTrade = TradeModal({
        id: Math.floor(Math.random() * 99999),
        type: type,
        address: tokenDb.address,
        token: token,
        amount: amount,
        limit: limit,
        success: success,
        error: error,
      });
      newTrade.save();
      res.json({ success: true, message: `${type}: trade added.` });
    } else {
      res.json({ success: false, message: "Set the coin first." });
    }
  } catch (e) {
    res.json({ success: false, message: "`Error on token buy." });
  }
});

router.put("/trades/:id", async (req, res) => {
  const id = req.params.id;
  const token = req.body.token.toString().toUpperCase();
  const limit = parseFloat(req.body.limit);
  const amount = parseFloat(req.body.amount);
  const type = req.body.type;
  const success = req.body.success;
  const error = req.body.error;

  try {
    const tokenDb = await TokenModal.findOne({ name: token });
    if (tokenDb !== null) {
      await TradeModal.updateOne(
        { id },
        {
          token: token,
          limit: limit,
          amount: amount,
          type: type,
          success: success,
          error: error,
        }
      );

      res.json({ success: true, message: `${type}: trade added.` });
    } else {
      res.json({ success: false, message: "Set the coin first." });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: "`Error on token buy." });
  }
});

router.get("/trades", async (req, res) => {
  try {
    const trades = await TradeModal.find().sort({ updatedAt: -1 });
    res.json({ success: true, message: trades });
  } catch (e) {
    res.json({ success: false, message: `Error on trades fetch.` });
  }
});

router.delete("/trades/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const tradeInDB = await TradeModal.findOne({ id });
    if (tradeInDB !== null) {
      await TradeModal.deleteOne({ id });
      res.json({ success: true, message: `trade removed` });
    }
  } catch (e) {
    res.json({ success: false, message: `Error on trade remove.` });
  }
});

router.delete("/logs/:id", async (req, res) => {
  const id = req.params.id.toString();
  try {
    const logInDB = await LogModal.findOne({ _id: id });
    if (logInDB !== null) {
      await LogModal.deleteOne({ _id: id });
      res.json({ success: true, message: `Log removed` });
    }
  } catch (e) {
    res.json({ success: false, message: `Error on token remove.` });
  }
});

router.get("/logs", async (req, res) => {
  try {
    const logs = await LogModal.find().sort({ updatedAt: -1 });
    res.json({ success: true, message: logs });
  } catch (e) {
    res.json({ success: false, message: `Error on logs fetch.` });
  }
});

module.exports = { router };
