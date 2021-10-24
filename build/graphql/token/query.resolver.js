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
    getTokens: function () {
      var _getTokens = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args, ctx) {
        var info, tokens;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                info = args.info;
                _context2.prev = 1;
                _context2.next = 4;
                return _db.TokenModal.find().sort({
                  updatedAt: -1
                });

              case 4:
                tokens = _context2.sent;

                if (!(info === 1)) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 8;
                return Promise.all(tokens.map( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(token) {
                    var _yield$getTokenPriceA, balance, price, bnbBalance, bnbPrice, busdBalance, info;

                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return (0, _helpers.getTokenPriceAndBalance)(token);

                          case 2:
                            _yield$getTokenPriceA = _context.sent;
                            balance = _yield$getTokenPriceA.balance;
                            price = _yield$getTokenPriceA.price;
                            bnbBalance = _yield$getTokenPriceA.bnbBalance;
                            bnbPrice = _yield$getTokenPriceA.bnbPrice;
                            busdBalance = _yield$getTokenPriceA.busdBalance;
                            info = {
                              token: token.name,
                              address: token.address,
                              balance: balance,
                              bnbBalance: bnbBalance,
                              busdBalance: busdBalance,
                              price: price,
                              bnbPrice: bnbPrice
                            };
                            token.info = info;
                            return _context.abrupt("return", token);

                          case 11:
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
                  result: tokens
                });

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](1);
                return _context2.abrupt("return", {
                  error: "No tokens found."
                });

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 11]]);
      }));

      function getTokens(_x, _x2, _x3) {
        return _getTokens.apply(this, arguments);
      }

      return getTokens;
    }()
  }
};
exports["default"] = _default;
//# sourceMappingURL=query.resolver.js.map