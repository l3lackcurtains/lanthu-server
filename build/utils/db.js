"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

require('dotenv').config();

var dbUser = process.env.DB_USER;
var dbPassword = process.env.DB_PASSWORD;

var startDB = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var connected;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _mongoose["default"].connect("mongodb+srv://".concat(dbUser, ":").concat(dbPassword, "@bot.bpetg.mongodb.net/botv2?retryWrites=true&w=majority"), {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useFindAndModify: false,
              useCreateIndex: true
            });

          case 3:
            _mongoose["default"].connection.on('error', function (err) {
              console.log(err);
            });

            connected = _mongoose["default"].connection.readyState;

            if (connected === 1) {
              console.log('Connected to Database.');
            } else if (connected === 2) {
              console.log('Connecting to Database.');
            }

            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function startDB() {
    return _ref.apply(this, arguments);
  };
}();

var Schema = _mongoose["default"].Schema;
var tradeSchema = new Schema({
  status: {
    type: String,
    "enum": ['INIT', 'BOUGHT', 'SOLD', 'ERROR'],
    "default": 'INIT'
  },
  tokenId: {
    type: String,
    required: true
  },
  amount: Number,
  buyLimit: Number,
  sellLimit: Number,
  stopLossLimit: Number
}, {
  timestamps: true
});

var TradeModal = _mongoose["default"].model('Trade', tradeSchema);

var tokenSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  address: String,
  decimal: {
    type: Number,
    "default": 18
  },
  slug: String,
  base: {
    type: String,
    "enum": ['BNB', 'BUSD'],
    "default": 'BNB'
  }
}, {
  timestamps: true
});

var TokenModal = _mongoose["default"].model('Token', tokenSchema);

var historySchema = new Schema({
  tradeId: {
    type: String,
    required: true
  },
  bought: Number,
  sold: Number,
  profit: Number
}, {
  timestamps: true
});

var HistoryModal = _mongoose["default"].model('History', historySchema);

var logSchema = new Schema({
  message: String,
  details: String
}, {
  timestamps: true
});

var LogModal = _mongoose["default"].model('Log', logSchema);

var deviceSchema = new Schema({
  token: String
}, {
  timestamps: true
});

var DeviceModal = _mongoose["default"].model('Device', deviceSchema);

module.exports = {
  TradeModal: TradeModal,
  TokenModal: TokenModal,
  LogModal: LogModal,
  startDB: startDB,
  DeviceModal: DeviceModal,
  HistoryModal: HistoryModal
};
//# sourceMappingURL=db.js.map