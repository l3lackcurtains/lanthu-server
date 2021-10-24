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
    removeLog: function () {
      var _removeLog = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, args) {
        var _id, logDb;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _id = args._id;
                _context.prev = 1;
                _context.next = 4;
                return _db.LogModal.findOne({
                  _id: _id
                });

              case 4:
                logDb = _context.sent;

                if (!(logDb !== null)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 8;
                return _db.LogModal.deleteOne({
                  _id: _id
                });

              case 8:
                return _context.abrupt("return", {
                  message: "Log removed",
                  result: logDb
                });

              case 9:
                return _context.abrupt("return", {
                  error: "Error on log remove."
                });

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](1);
                return _context.abrupt("return", {
                  error: "Error on log remove."
                });

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 12]]);
      }));

      function removeLog(_x, _x2) {
        return _removeLog.apply(this, arguments);
      }

      return removeLog;
    }()
  }
};
exports["default"] = _default;
//# sourceMappingURL=mutation.resolver.js.map