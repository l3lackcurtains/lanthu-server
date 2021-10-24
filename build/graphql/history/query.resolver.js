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
  Query: {
    getHistories: function () {
      var _getHistories = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args, ctx) {
        var histories;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _db.HistoryModal.find().sort({
                  updatedAt: -1
                });

              case 3:
                histories = _context.sent;
                return _context.abrupt("return", {
                  result: histories
                });

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", {
                  error: "No histories found."
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 7]]);
      }));

      function getHistories(_x, _x2, _x3) {
        return _getHistories.apply(this, arguments);
      }

      return getHistories;
    }()
  }
};
exports["default"] = _default;
//# sourceMappingURL=query.resolver.js.map