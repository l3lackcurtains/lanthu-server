"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _helpers = require("../../utils/helpers");

var _db = require("../../utils/db");

var _default = {
  Query: {
    getTokenInfo: function () {
      var _getTokenInfo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, ctx) {
        var tokenId, token, _yield$getTokenPriceA, balance, price, bnbBalance, bnbPrice, busdBalance, data;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                tokenId = args.tokenId;
                _context.prev = 1;
                _context.next = 4;
                return _db.TokenModal.findOne({
                  _id: tokenId
                });

              case 4:
                token = _context.sent;

                if (!(token !== null)) {
                  _context.next = 18;
                  break;
                }

                _context.next = 8;
                return (0, _helpers.getTokenPriceAndBalance)(token);

              case 8:
                _yield$getTokenPriceA = _context.sent;
                balance = _yield$getTokenPriceA.balance;
                price = _yield$getTokenPriceA.price;
                bnbBalance = _yield$getTokenPriceA.bnbBalance;
                bnbPrice = _yield$getTokenPriceA.bnbPrice;
                busdBalance = _yield$getTokenPriceA.busdBalance;
                data = {
                  token: token.name,
                  address: token.address,
                  balance: balance,
                  bnbBalance: bnbBalance,
                  busdBalance: busdBalance,
                  price: price,
                  bnbPrice: bnbPrice
                };
                return _context.abrupt("return", {
                  result: data
                });

              case 18:
                return _context.abrupt("return", {
                  message: 'No token found.'
                });

              case 19:
                _context.next = 24;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](1);
                return _context.abrupt("return", {
                  error: "Error on token fetch."
                });

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 21]]);
      }));

      function getTokenInfo(_x, _x2, _x3) {
        return _getTokenInfo.apply(this, arguments);
      }

      return getTokenInfo;
    }()
  }
};
exports["default"] = _default;
//# sourceMappingURL=query.resolver.js.map