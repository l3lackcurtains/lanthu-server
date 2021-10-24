"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require('dotenv').config();

var express = require('express');

var _require = require('../utils/db'),
    DeviceModal = _require.DeviceModal;

var router = express.Router();
router.post('/devices', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var token, deviceInDB, newDevice;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.body.token;
            _context.prev = 1;
            _context.next = 4;
            return DeviceModal.findOne({
              token: token
            });

          case 4:
            deviceInDB = _context.sent;

            if (deviceInDB === null) {
              newDevice = new DeviceModal({
                token: token
              });
              newDevice.save();
              res.json({
                success: true,
                message: "Device added"
              });
            }

            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            res.json({
              success: false,
              message: "Error on device add."
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 8]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/devices/:token', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var token, device;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            token = req.params.token;
            _context2.prev = 1;
            _context2.next = 4;
            return DeviceModal.findOne({
              token: token
            });

          case 4:
            device = _context2.sent;
            res.json({
              success: true,
              message: device
            });
            _context2.next = 11;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            res.json({
              success: false,
              message: "Error on device fetch."
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 8]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
module.exports = {
  router: router
};
//# sourceMappingURL=index.js.map