require("dotenv").config();
const express = require("express");
const { TokenModal, TradeModal } = require("../common/db");
const router = express.Router();

router.post("/tokens", async (req, res) => {
  const name = req.body.name;
  const address = req.body.address;

  if (address.length !== 42 || address.substr(0, 2) !== "0x") {
    res.json({ success: false, message: `Address wrong.` });
    return;
  }

  try {
    const coinInDB = await TokenModal.findOne({ name });

    if (coinInDB !== null) {
      coinInDB.address = address;
      coinInDB.save();
      res.json({ success: true, message: `Token updated.` });
    } else {
      const newToken = new TokenModal({ name, address });
      newToken.save();
      res.json({ success: true, message: `Token added` });
    }
  } catch (e) {
    res.json({ success: false, message: `Error on token add.` });
  }
});

router.delete("/token/:name", async (req, res) => {
  const name = req.params.name.toUpperCase();

  try {
    const coinInDB = await TokenModal.findOne({ name });
    if (coinInDB !== null) {
      await TokenModal.deleteOne({ name });
      res.json({ success: true, message: `Token removed` });
    }
  } catch (e) {
    res.json({ success: false, message: `Error on token remove.` });
  }
});

router.get("/tokens", async (req, res) => {
  try {
    const tokens = await TokenModal.find();
    res.json({ success: true, message: tokens });
  } catch (e) {
    res.json({ success: false, message: `Error on tokens fetch.` });
  }
});

router.post("/trades", async (req, res) => {
  const name = rer.body.name.toUpperCase();
  const limit = parseFloat(req.body.limit);
  const amount = parseFloat(req.body.amount);
  const type = req.body.type;

  try {
    const coinInDB = await TokenModal.findOne({ name });
    if (coinInDB !== null) {
      const newTrade = TradeModal({
        id: Math.floor(Math.random() * 99999),
        type: type,
        address: coinInDB.address,
        token: name,
        amount: amount,
        limit: limit,
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

router.get("/trades", async (req, res) => {
  try {
    const trades = await TradeModal.find();
    res.json({ success: true, message: trades });
  } catch (e) {
    res.json({ success: false, message: `Error on trades fetch.` });
  }
});

router.delete("/trade/:id", async (req, res) => {
  const id = req.params.id;

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

module.exports = { router };
