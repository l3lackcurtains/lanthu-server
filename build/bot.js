"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _db = require("./utils/db");

var _helpers = require("./utils/helpers");

var _buy = require("./trading/buy");

var _sell = require("./trading/sell");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var startTheBot = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var trades, _iterator, _step, trade, coin, _yield$getCurrentPric, currentPrice, currentPriceConversion, tokenAmount, swapAmount, errStr, msg, newLog, tradeInDB;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _db.TradeModal.find();

          case 2:
            trades = _context.sent;
            _iterator = _createForOfIteratorHelper(trades);
            _context.prev = 4;

            _iterator.s();

          case 6:
            if ((_step = _iterator.n()).done) {
              _context.next = 51;
              break;
            }

            trade = _step.value;

            if (!(trade.status === 'SOLD' || trade.status === 'ERROR')) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("continue", 49);

          case 10:
            _context.next = 12;
            return _db.TokenModal.findOne({
              _id: trade.tokenId
            });

          case 12:
            coin = _context.sent;
            _context.next = 15;
            return (0, _helpers.getCurrentPrice)(coin);

          case 15:
            _yield$getCurrentPric = _context.sent;
            currentPrice = _yield$getCurrentPric.currentPrice;
            currentPriceConversion = _yield$getCurrentPric.currentPriceConversion;
            _context.prev = 18;
            tokenAmount = parseFloat(trade.amount);
            swapAmount = parseFloat(trade.amount * currentPriceConversion);

            if (!(trade.status === 'INIT' && trade.buyLimit > 0 && currentPrice < trade.buyLimit)) {
              _context.next = 27;
              break;
            }

            console.log("Start buying ".concat(tokenAmount, " ").concat(coin.name, " (").concat(swapAmount, " ").concat(coin.base, ") "));
            _context.next = 25;
            return (0, _buy.buyToken)(trade, coin, swapAmount, tokenAmount, currentPrice);

          case 25:
            _context.next = 31;
            break;

          case 27:
            if (!(trade.status === 'BOUGHT' && (trade.sellLimit > 0 && currentPrice > trade.sellLimit || trade.stopLossLimit > 0 && currentPrice < trade.stopLossLimit))) {
              _context.next = 31;
              break;
            }

            console.log("Start selling ".concat(tokenAmount, " ").concat(coin.name, " (").concat(swapAmount, " ").concat(coin.base, ") "));
            _context.next = 31;
            return (0, _sell.sellToken)(trade, coin, swapAmount, tokenAmount, currentPrice);

          case 31:
            _context.next = 49;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](18);
            errStr = _context.t0.toString();

            if (!errStr.includes('getReserves()')) {
              _context.next = 49;
              break;
            }

            msg = "No token pair found for ".concat(coin.name, ".");
            newLog = new _db.LogModal({
              message: msg,
              details: _context.t0.toString()
            });
            newLog.save();
            console.log(_context.t0);
            console.log(msg);
            _context.next = 44;
            return _db.TradeModal.findOne({
              id: trade.id
            });

          case 44:
            tradeInDB = _context.sent;
            tradeInDB.error = true;
            tradeInDB.success = false;
            _context.next = 49;
            return tradeInDB.save();

          case 49:
            _context.next = 6;
            break;

          case 51:
            _context.next = 56;
            break;

          case 53:
            _context.prev = 53;
            _context.t1 = _context["catch"](4);

            _iterator.e(_context.t1);

          case 56:
            _context.prev = 56;

            _iterator.f();

            return _context.finish(56);

          case 59:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 53, 56, 59], [18, 33]]);
  }));

  return function startTheBot() {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  startTheBot: startTheBot
};
//# sourceMappingURL=bot.js.map