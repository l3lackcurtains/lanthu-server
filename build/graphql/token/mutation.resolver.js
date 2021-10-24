"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _db = require("../../utils/db");

var _excluded = ["_id"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _default = {
  Mutation: {
    removeToken: function () {
      var _removeToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args) {
        var _id, tokenDb;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _id = args._id;
                _context.prev = 1;
                _context.next = 4;
                return _db.TokenModal.findOne({
                  _id: _id
                });

              case 4:
                tokenDb = _context.sent;

                if (!(tokenDb !== null)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 8;
                return _db.TokenModal.deleteOne({
                  _id: _id
                });

              case 8:
                return _context.abrupt("return", {
                  message: "Token removed",
                  result: tokenDb
                });

              case 9:
                return _context.abrupt("return", {
                  error: "Error on token remove."
                });

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](1);
                return _context.abrupt("return", {
                  error: "Error on token remove."
                });

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 12]]);
      }));

      function removeToken(_x, _x2) {
        return _removeToken.apply(this, arguments);
      }

      return removeToken;
    }(),
    addToken: function () {
      var _addToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, args) {
        var name, address, slug, base, newToken;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                name = args.name, address = args.address, slug = args.slug, base = args.base;

                if (!(address.length !== 42 || address.substr(0, 2) !== '0x')) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return", {
                  error: "Address wrong."
                });

              case 3:
                _context2.prev = 3;
                newToken = new _db.TokenModal({
                  name: name,
                  address: address,
                  slug: slug,
                  base: base
                });
                newToken.save();
                return _context2.abrupt("return", {
                  message: "Token added",
                  result: newToken
                });

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](3);
                return _context2.abrupt("return", {
                  error: "Error on token add."
                });

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[3, 9]]);
      }));

      function addToken(_x3, _x4) {
        return _addToken.apply(this, arguments);
      }

      return addToken;
    }(),
    updateToken: function () {
      var _updateToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, args) {
        var _id, rest, tokenDb, updated;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _id = args._id, rest = (0, _objectWithoutProperties2["default"])(args, _excluded);

                if (!(rest.address && (rest.address.length !== 42 || rest.address.substr(0, 2) !== '0x'))) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return", {
                  message: "Address wrong."
                });

              case 3:
                _context3.prev = 3;
                _context3.next = 6;
                return _db.TokenModal.findOne({
                  _id: _id
                });

              case 6:
                tokenDb = _context3.sent;
                tokenDb.set(_objectSpread({}, rest));
                _context3.next = 10;
                return tokenDb.save();

              case 10:
                updated = _context3.sent;
                return _context3.abrupt("return", {
                  message: "Token updated.",
                  result: updated
                });

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3["catch"](3);
                return _context3.abrupt("return", {
                  error: "Error on token update."
                });

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[3, 14]]);
      }));

      function updateToken(_x5, _x6) {
        return _updateToken.apply(this, arguments);
      }

      return updateToken;
    }()
  }
};
exports["default"] = _default;
//# sourceMappingURL=mutation.resolver.js.map