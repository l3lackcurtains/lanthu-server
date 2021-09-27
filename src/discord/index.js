const Discord = require("discord.js");
require("dotenv").config();
const { TokenModal, TradeModal } = require("../common/db");
const dBot = new Discord.Client();

dBot.login(process.env.BOT_API);

dBot.on("ready", () => {
  console.log(`Logged in as ${dBot.user.tag}!`);
});

const prefix = "/";
dBot.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "token:add") {
    const subCommand = args.map((x) => x);
    if (subCommand.length !== 2) return;

    const name = subCommand[0].toUpperCase();
    const address = subCommand[1];

    if (address.length !== 42 || address.substr(0, 2) !== "0x") {
      message.reply(`Address wrong.`);
      return;
    }

    const coinInDB = await TokenModal.findOne({ name });

    if (coinInDB !== null) {
      coinInDB.address = address;
      coinInDB.save();
      message.reply(`Token updated.`);
    } else {
      const newToken = new TokenModal({ name, address });
      newToken.save();
      message.reply(`Token added.`);
    }
  }

  if (command === "token:remove") {
    const subCommand = args.map((x) => x);
    if (subCommand.length !== 1) return;
    const name = subCommand[0].toUpperCase();
    const coinInDB = await TokenModal.findOne({ name });
    if (coinInDB !== null) {
      await TokenModal.deleteOne({ name });
      message.reply(`Token removed.`);
    }
  }

  if (command === "tokens") {
    const tokens = await TokenModal.find();
    let tokensText = "";
    for (let tkn of tokens) {
      tokensText += `${tkn.name}: ${tkn.address} \n`;
    }
    message.reply(`\n${tokensText}`);
  }

  if (command === "buy") {
    const subCommand = args.map((x) => x);
    if (subCommand.length !== 3) return;

    const name = subCommand[0].toUpperCase();
    const limit = parseFloat(subCommand[1]);
    const amount = parseFloat(subCommand[2]);

    const coinInDB = await TokenModal.findOne({ name });

    if (coinInDB !== null) {
      const newTrade = TradeModal({
        id: Math.floor(Math.random() * 99999),
        type: "BUY",
        address: coinInDB.address,
        token: name,
        amount: amount,
        limit: limit,
      });
      newTrade.save();
      message.reply(`Buy trade added.`);
    } else {
      message.reply(`Set the coin first.`);
    }
  }

  if (command === "sell") {
    const subCommand = args.map((x) => x);
    if (subCommand.length !== 3) return;

    const name = subCommand[0].toUpperCase();
    const limit = parseFloat(subCommand[1]);
    const amount = parseFloat(subCommand[2]);

    const coinInDB = await TokenModal.findOne({ name });

    if (coinInDB !== null) {
      const newTrade = TradeModal({
        id: Math.floor(Math.random() * 99999999),
        type: "SELL",
        address: coinInDB.address,
        token: name,
        amount: amount,
        limit: limit,
      });
      newTrade.save();
      message.reply(`Sell trade added.`);
    } else {
      message.reply(`Set the coin first.`);
    }
  }

  if (command === "trades") {
    const trades = await TradeModal.find();
    let tradeText = "";
    for (let td of trades) {
      tradeText += `#${td.id}: ${td.type} ${td.amount} ${td.token} in ${td.limit}\n`;
    }
    message.reply(`\n${tradeText}`);
  }

  if (command === "remove") {
    const subCommand = args.map((x) => x);
    if (subCommand.length !== 1) return;
    const id = parseInt(subCommand[0]);
    const trade = await TradeModal.findOne({ id });
    if (trade !== null) {
      await TradeModal.deleteOne({ id });
      message.reply(`Trade removed.`);
    }
  }

  if (command === "purge") {
    await TradeModal.deleteMany();
    message.reply(`All Trades removed.`);
  }
});

module.exports = { dBot };
