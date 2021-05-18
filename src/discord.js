const Discord = require("discord.js");
require("dotenv").config();
const { db } = require("./db");
const dBot = new Discord.Client();

dBot.login(process.env.BOT_API);

dBot.on("ready", () => {
  console.log(`Logged in as ${dBot.user.tag}!`);
});

const prefix = "!";
dBot.on("message", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "token:add") {
    const subCommand = args.map((x) => x);
    if (subCommand.length !== 2) return;

    const coin = subCommand[0].toUpperCase();
    const address = subCommand[1];

    if (address.length !== 42 || address.substr(0, 2) !== "0x") {
      message.reply(`Address wrong.`);
      return;
    }

    const coinInDB = db.get("tokens").find({ coin: coin }).value();
    if (coinInDB !== undefined) {
      db.get("tokens").find({ coin: coin }).set("address", address).write();
      message.reply(`Token updated.`);
    } else {
      db.get("tokens").push({ coin, address }).write();
      message.reply(`Token added.`);
    }
  }

  if (command === "token:remove") {
    const subCommand = args.map((x) => x);
    if (subCommand.length !== 1) return;

    const coin = subCommand[0].toUpperCase();

    const coinInDB = db.get("tokens").find({ coin: coin }).value();

    if (coinInDB !== undefined) {
      db.get("tokens").remove({ coin: coin }).write();
      message.reply(`Token removed.`);
    }
  }

  if (command === "token:list") {
    const tokens = db.get("tokens").value();
    let tokensText = "";
    for (let tkn of tokens) {
      tokensText += `${tkn.coin}: ${tkn.address} \n`;
    }

    message.reply(`\n${tokensText}`);
  }

  if (command === "set:buy") {
    const subCommand = args.map((x) => x);
    if (subCommand.length !== 3) return;

    const coin = subCommand[0].toUpperCase();
    const limit = parseFloat(subCommand[1]);
    const price = parseFloat(subCommand[2]);
  }
});

module.exports = { dBot };
