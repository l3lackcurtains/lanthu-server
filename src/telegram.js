process.env.NTBA_FIX_319 = 1;

const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const { db } = require("./db");

let bot;
const token = process.env.BOT_API;

if (process.env.NODE_ENV === "production") {
  bot = new TelegramBot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new TelegramBot(token, { polling: true });
}

bot.on("message", (msg) => {
  console.log(msg);
  const chatId = msg.chat.id;
  if (msg.text === "subscribe") {
    const cid = db.get("chatIds").find({ id: chatId }).value();
    if (!cid) {
      db.get("chatIds").push({ id: chatId }).write();
    }
    bot.sendMessage(chatId, "Subscribed to the notification.");
  }

  if (msg.text === "unsubscribe") {
    db.get("chatIds").remove({ id: chatId }).write();
    bot.sendMessage(chatId, "UnSubscribed to the notification.");
  }

  setInterval(() => {
    const notifications = db.get("notifications").value() || [];

    notifications.forEach((notif) => {
      if (notif.sent) return;
      const chatIds = db.get("chatIds").value() || [];
      chatIds.forEach((cid) => {
        bot.sendMessage(cid.id, notif.message);
      });

      db.get("notifications").remove({ id: notif.id }).write();
    });
  }, 10000);
});

module.exports = { bot };
