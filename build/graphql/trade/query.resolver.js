"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _db = require("../../utils/db");

var _helpers = require("../../utils/helpers");

var _default = {
  Query: {
    getTrades: function () {
      var _getTrades = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args, ctx) {
        var token, trades;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                token = args.token;
                _context2.prev = 1;
                _context2.next = 4;
                return _db.TradeModal.find().sort({
                  updatedAt: -1
                });

              case 4:
                trades = _context2.sent;

                if (!(token === 1)) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 8;
                return Promise.all(trades.map( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(trade) {
                    var token;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return _db.TokenModal.findOne({
                              _id: trade.tokenId
                            });

                          case 2:
                            token = _context.sent;
                            trade.token = token;
                            return _context.abrupt("return", trade);

                          case 5:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x4) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 8:
                return _context2.abrupt("return", {
                  result: trades
                });

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](1);
                return _context2.abrupt("return", {
                  error: "No trades found."
                });

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 11]]);
      }));

      function getTrades(_x, _x2, _x3) {
        return _getTrades.apply(this, arguments);
      }

      return getTrades;
    }()
  }
};
exports["default"] = _default;
//# sourceMappingURL=query.resolver.js.map