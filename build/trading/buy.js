"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sdk = require("@pancakeswap/sdk");

var _ethers = require("ethers");

var _utils = require("ethers/lib/utils");

var _db = require("../utils/db");

var _notification = require("../utils/notification");

var _wallet = require("../utils/wallet");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var tokenABI = [{
  constant: true,
  inputs: [],
  name: "name",
  outputs: [{
    name: "",
    type: "string"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: false,
  inputs: [{
    name: "_spender",
    type: "address"
  }, {
    name: "_value",
    type: "uint256"
  }],
  name: "approve",
  outputs: [{
    name: "",
    type: "bool"
  }],
  payable: false,
  stateMutability: "nonpayable",
  type: "function"
}, {
  constant: true,
  inputs: [],
  name: "totalSupply",
  outputs: [{
    name: "",
    type: "uint256"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: false,
  inputs: [{
    name: "_from",
    type: "address"
  }, {
    name: "_to",
    type: "address"
  }, {
    name: "_value",
    type: "uint256"
  }],
  name: "transferFrom",
  outputs: [{
    name: "",
    type: "bool"
  }],
  payable: false,
  stateMutability: "nonpayable",
  type: "function"
}, {
  constant: true,
  inputs: [],
  name: "decimals",
  outputs: [{
    name: "",
    type: "uint8"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: true,
  inputs: [{
    name: "_owner",
    type: "address"
  }],
  name: "balanceOf",
  outputs: [{
    name: "balance",
    type: "uint256"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: true,
  inputs: [],
  name: "symbol",
  outputs: [{
    name: "",
    type: "string"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: false,
  inputs: [{
    name: "_to",
    type: "address"
  }, {
    name: "_value",
    type: "uint256"
  }],
  name: "transfer",
  outputs: [{
    name: "",
    type: "bool"
  }],
  payable: false,
  stateMutability: "nonpayable",
  type: "function"
}, {
  constant: true,
  inputs: [{
    name: "_owner",
    type: "address"
  }, {
    name: "_spender",
    type: "address"
  }],
  name: "allowance",
  outputs: [{
    name: "",
    type: "uint256"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  payable: true,
  stateMutability: "payable",
  type: "fallback"
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: "owner",
    type: "address"
  }, {
    indexed: true,
    name: "spender",
    type: "address"
  }, {
    indexed: false,
    name: "value",
    type: "uint256"
  }],
  name: "Approval",
  type: "event"
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: "from",
    type: "address"
  }, {
    indexed: true,
    name: "to",
    type: "address"
  }, {
    indexed: false,
    name: "value",
    type: "uint256"
  }],
  name: "Transfer",
  type: "event"
}];

var buyToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(trade, coin, swapAmount, tokenAmount, currentPrice) {
    var SWAPTOKEN, amountIn, to, tokenContract, allowance, approved, balance, msg, TOKEN, pair, route, tradeData, slippageTolerance, amountOutMin, path, _iterator, _step, px, deadline, value, bought, _msg;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            SWAPTOKEN = null;

            if (coin.base === 'BUSD') {
              SWAPTOKEN = _wallet.BUSD;
            } else {
              SWAPTOKEN = _sdk.WETH[_wallet.chainID];
            }

            amountIn = _ethers.ethers.utils.parseUnits(swapAmount.toString(), 18);
            to = _wallet.wallet.address;
            tokenContract = new _ethers.ethers.Contract(SWAPTOKEN.address, tokenABI, _wallet.wallet);
            _context.next = 8;
            return tokenContract.allowance(to, _wallet.pancakeSwapContractAddress);

          case 8:
            allowance = _context.sent;

            if (!allowance.lte(amountIn)) {
              _context.next = 15;
              break;
            }

            _context.next = 12;
            return tokenContract.approve(_wallet.pancakeSwapContractAddress, new _ethers.ethers.BigNumber.from(_wallet.maxAllowance), {
              gasLimit: _wallet.gasLimit,
              gasPrice: 5 * _wallet.GWEI
            });

          case 12:
            approved = _context.sent;
            _context.next = 15;
            return _wallet.provider.once(approved.hash, function () {
              console.log('Approved...');
            });

          case 15:
            _context.next = 17;
            return tokenContract.balanceOf(to);

          case 17:
            balance = _context.sent;

            if (!balance.lte(amountIn)) {
              _context.next = 23;
              break;
            }

            msg = "Low balance ".concat((0, _utils.formatEther)(balance), " < ").concat((0, _utils.formatEther)(amountIn), " for this trade.");
            _context.next = 22;
            return updateErrorStatus(trade, msg);

          case 22:
            return _context.abrupt("return");

          case 23:
            TOKEN = new _sdk.Token(_wallet.chainID, coin.address, coin.decimal, coin.name);
            _context.next = 26;
            return _sdk.Fetcher.fetchPairData(SWAPTOKEN, TOKEN, _wallet.provider);

          case 26:
            pair = _context.sent;
            route = new _sdk.Route([pair], SWAPTOKEN, TOKEN);
            tradeData = new _sdk.Trade(route, new _sdk.TokenAmount(SWAPTOKEN, amountIn), _sdk.TradeType.EXACT_INPUT);
            slippageTolerance = new _sdk.Percent(_wallet.slippage.toString(), '100');
            amountOutMin = tradeData.minimumAmountOut(slippageTolerance).raw;
            path = [];
            _iterator = _createForOfIteratorHelper(route.path);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                px = _step.value;
                path.push(px.address);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            deadline = Math.floor(Date.now() / 1000) + 60 * 10;
            value = tradeData.inputAmount.raw;
            _context.next = 38;
            return _wallet.pancakeSwapContract.swapExactTokensForTokens(new _ethers.ethers.BigNumber.from(String(value)), new _ethers.ethers.BigNumber.from(String(amountOutMin)), path, to, deadline, {
              gasLimit: _wallet.gasLimit,
              gasPrice: 5 * _wallet.GWEI
            });

          case 38:
            bought = _context.sent;
            _context.next = 41;
            return bought.wait();

          case 41:
            _context.next = 43;
            return updateBoughtStatus(trade, coin, tokenAmount, currentPrice);

          case 43:
            _context.next = 50;
            break;

          case 45:
            _context.prev = 45;
            _context.t0 = _context["catch"](0);
            _msg = "Error on token buy! ".concat(tokenAmount, " ").concat(coin.name, " at ").concat(currentPrice, " ").concat(coin.name);
            _context.next = 50;
            return updateErrorStatus(trade, _msg, _context.t0);

          case 50:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 45]]);
  }));

  return function buyToken(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

var updateBoughtStatus = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(trade, coin, tokenAmount, currentPrice) {
    var tradeInDB, history, msg;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _db.TradeModal.findOne({
              _id: trade._id
            });

          case 2:
            tradeInDB = _context2.sent;
            tradeInDB.status = 'BOUGHT';
            _context2.next = 6;
            return tradeInDB.save();

          case 6:
            // Save in history
            history = new _db.HistoryModal({
              tradeId: trade._id,
              bought: currentPrice
            });
            history.save();
            msg = "Bought ".concat(tokenAmount, " ").concat(coin.name, " at ").concat(currentPrice, " ").concat(coin.name);
            _context2.next = 11;
            return (0, _notification.sendMessage)('${coin.name} bought', msg);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function updateBoughtStatus(_x6, _x7, _x8, _x9) {
    return _ref2.apply(this, arguments);
  };
}();

var updateErrorStatus = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(trade, msg) {
    var e,
        newLog,
        tradeInDB,
        _args3 = arguments;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            e = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : '';
            newLog = new _db.LogModal({
              message: msg,
              details: e.toString()
            });
            newLog.save();
            console.log(msg, e); // Update status and send notification

            _context3.next = 6;
            return _db.TradeModal.findOne({
              _id: trade._id
            });

          case 6:
            tradeInDB = _context3.sent;
            tradeInDB.status = 'ERROR';
            _context3.next = 10;
            return tradeInDB.save();

          case 10:
            _context3.next = 12;
            return (0, _notification.sendMessage)('Error on buying ${coin.name}', msg);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function updateErrorStatus(_x10, _x11) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = {
  buyToken: buyToken
};
//# sourceMappingURL=buy.js.map