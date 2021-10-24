"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _db = require("../../utils/db");

var _default = {
  Mutation: {
    removeTrade: function () {
      var _removeTrade = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args) {
        var _id, tradeInDB;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _id = args._id;
                _context.prev = 1;
                _context.next = 4;
                return _db.TradeModal.findOne({
                  _id: _id
                });

              case 4:
                tradeInDB = _context.sent;

                if (!(tradeInDB !== null)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 8;
                return _db.TradeModal.deleteOne({
                  _id: _id
                });

              case 8:
                return _context.abrupt("return", {
                  result: tradeInDB,
                  message: 'Trade removed.'
                });

              case 9:
                return _context.abrupt("return", {
                  error: "Error on trade remove."
                });

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](1);
                return _context.abrupt("return", {
                  error: "Error on trade remove."
                });

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 12]]);
      }));

      function removeTrade(_x, _x2) {
        return _removeTrade.apply(this, arguments);
      }

      return removeTrade;
    }(),
    addTrade: function () {
      var _addTrade = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args) {
        var tokenId, amount, buyLimit, sellLimit, stopLossLimit, status, tokenDb, newTrade;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                tokenId = args.tokenId;
                amount = args.amount && parseFloat(args.amount);
                buyLimit = args.buyLimit && parseFloat(args.buyLimit);
                sellLimit = args.sellLimit && parseFloat(args.sellLimit);
                stopLossLimit = args.stopLossLimit && parseFloat(args.stopLossLimit);
                status = args.status || 'INIT';
                _context2.prev = 6;
                _context2.next = 9;
                return _db.TokenModal.findOne({
                  _id: tokenId
                });

              case 9:
                tokenDb = _context2.sent;

                if (!(tokenDb !== null)) {
                  _context2.next = 16;
                  break;
                }

                newTrade = (0, _db.TradeModal)({
                  tokenId: tokenId,
                  amount: amount,
                  buyLimit: buyLimit,
                  sellLimit: sellLimit,
                  stopLossLimit: stopLossLimit,
                  status: status
                });
                newTrade.save();
                return _context2.abrupt("return", {
                  result: newTrade,
                  message: "Trade added."
                });

              case 16:
                return _context2.abrupt("return", {
                  error: 'Set the coin first.'
                });

              case 17:
                _context2.next = 22;
                break;

              case 19:
                _context2.prev = 19;
                _context2.t0 = _context2["catch"](6);
                return _context2.abrupt("return", {
                  error: 'Error on token add.'
                });

              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[6, 19]]);
      }));

      function addTrade(_x3, _x4) {
        return _addTrade.apply(this, arguments);
      }

      return addTrade;
    }(),
    updateTrade: function () {
      var _updateTrade = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args) {
        var _id, tokenId, amount, buyLimit, sellLimit, stopLossLimit, status, tokenDb, tradeDb, updated;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _id = args._id;
                tokenId = args.tokenId;
                amount = args.amount && parseFloat(args.amount);
                buyLimit = args.buyLimit && parseFloat(args.buyLimit);
                sellLimit = args.sellLimit && parseFloat(args.sellLimit);
                stopLossLimit = args.stopLossLimit && parseFloat(args.stopLossLimit);
                status = args.status;
                _context3.prev = 7;
                _context3.next = 10;
                return _db.TokenModal.findOne({
                  _id: tokenId
                });

              case 10:
                tokenDb = _context3.sent;

                if (!(!tokenId || tokenDb !== null)) {
                  _context3.next = 25;
                  break;
                }

                _context3.next = 14;
                return _db.TradeModal.findOne({
                  _id: _id
                });

              case 14:
                tradeDb = _context3.sent;
                if (amount) tradeDb.amount = amount;
                if (buyLimit) tradeDb.buyLimit = buyLimit;
                if (sellLimit) tradeDb.sellLimit = sellLimit;
                if (stopLossLimit) tradeDb.stopLossLimit = stopLossLimit;
                if (status) tradeDb.status = status;
                if (tokenId) tradeDb.tokenId = tokenId;
                _context3.next = 23;
                return tradeDb.save();

              case 23:
                updated = _context3.sent;
                return _context3.abrupt("return", {
                  message: "trade updated.",
                  result: updated
                });

              case 25:
                return _context3.abrupt("return", {
                  error: 'Set the coin first.'
                });

              case 28:
                _context3.prev = 28;
                _context3.t0 = _context3["catch"](7);
                return _context3.abrupt("return", {
                  error: '`Error on trade update.'
                });

              case 31:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[7, 28]]);
      }));

      function updateTrade(_x5, _x6) {
        return _updateTrade.apply(this, arguments);
      }

      return updateTrade;
    }()
  }
};
exports["default"] = _default;
//# sourceMappingURL=mutation.resolver.js.map