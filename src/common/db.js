const mongoose = require("mongoose");
require("dotenv").config();
const { Token } = require("@pancakeswap/sdk");
const { chainID } = require("./wallet");

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const startDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@bot.bpetg.mongodb.net/trading?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    );

    mongoose.connection.on("error", (err) => {
      console.log(err);
    });

    const connected = mongoose.connection.readyState;
    if (connected === 1) {
      console.log("Connected to Database.");
    } else if (connected === 2) {
      console.log("Connecting to Database.");
    }
  } catch (e) {
    console.log(e);
  }
};

const Schema = mongoose.Schema;

const tradeSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true, // `email` must be unique
    },
    type: {
      type: String,
      enum: ["BUY", "SELL"],
      default: "BUY",
    },
    token: String,
    amount: Number,
    limit: Number,
    success: Boolean,
    error: Boolean,
  },
  {
    timestamps: true,
  }
);

const TradeModal = mongoose.model("Trade", tradeSchema);

const tokenSchema = new Schema(
  {
    name: {
      type: String,
      unique: true, // `email` must be unique
    },
    address: String,
    decimal: {
      type: Number,
      default: 18,
    },
    slug: String,
    swapWith: {
      type: String,
      enum: ["BNB", "BUSD"],
      default: "BNB",
    },
  },
  {
    timestamps: true,
  }
);

const TokenModal = mongoose.model("Token", tokenSchema);

const logSchema = new Schema(
  {
    message: String,
    details: String,
  },
  {
    timestamps: true,
  }
);

const LogModal = mongoose.model("Log", logSchema);

const deviceSchema = new Schema(
  {
    token: String,
  },
  {
    timestamps: true,
  }
);

const DeviceModal = mongoose.model("Device", deviceSchema);

module.exports = {
  TradeModal,
  TokenModal,
  LogModal,
  startDB,
  DeviceModal,
};
