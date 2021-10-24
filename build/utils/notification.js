"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodeGcm = _interopRequireDefault(require("node-gcm"));

var _db = require("./db");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

require('dotenv').config(); // Set up the sender with your GCM/FCM API key (declare this once for multiple messages)


var sender = new _nodeGcm["default"].Sender(process.env.FB_KEY);

var sendMessage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(title, body) {
    var message, devices, registeredDevices, _iterator, _step, device;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            message = new _nodeGcm["default"].Message({
              notification: {
                title: title,
                icon: 'ic_launcher',
                body: body
              }
            });
            _context.next = 3;
            return _db.DeviceModal.find();

          case 3:
            devices = _context.sent;
            registeredDevices = [];
            _iterator = _createForOfIteratorHelper(devices);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                device = _step.value;
                registeredDevices.push(device.token);
              } // Send the message

            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            sender.send(message, {
              registrationTokens: registeredDevices
            }, function (err, response) {
              if (err) console.error(err);else console.log('Notification sent.');
            });

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendMessage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  sendMessage: sendMessage
};
//# sourceMappingURL=notification.js.map