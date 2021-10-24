"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTokenPriceAndBalance = exports.getCurrentPrice = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _units = require("@ethersproject/units");

var _sdk = require("@pancakeswap/sdk");

var _ethers = require("ethers");

var _wallet = require("./wallet");

require('dotenv').config();

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

var getTokenPriceAndBalance = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(token) {
    var tokenContract, bnbContract, bnbBalance, busdContract, busdBalance, balance, pairBUSD, routeBUSD, bnbInUsd, price, TOKEN, pairBNB, routeBNB, currentPrice;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tokenContract = new _ethers.ethers.Contract(token.address, tokenABI, _wallet.wallet);
            bnbContract = new _ethers.ethers.Contract(_sdk.WETH[_wallet.chainID].address, tokenABI, _wallet.wallet);
            _context.next = 4;
            return bnbContract.balanceOf(_wallet.wallet.address);

          case 4:
            bnbBalance = _context.sent;
            busdContract = new _ethers.ethers.Contract(_wallet.BUSD.address, tokenABI, _wallet.wallet);
            _context.next = 8;
            return busdContract.balanceOf(_wallet.wallet.address);

          case 8:
            busdBalance = _context.sent;
            _context.next = 11;
            return tokenContract.balanceOf(_wallet.wallet.address);

          case 11:
            balance = _context.sent;
            _context.next = 14;
            return _sdk.Fetcher.fetchPairData(_wallet.BUSD, _sdk.WETH[_wallet.chainID], _wallet.provider);

          case 14:
            pairBUSD = _context.sent;
            routeBUSD = new _sdk.Route([pairBUSD], _sdk.WETH[_wallet.chainID]);
            bnbInUsd = routeBUSD.midPrice.toSignificant(6);
            price = 0;

            if (!(token.name !== 'BNB')) {
              _context.next = 28;
              break;
            }

            TOKEN = new _sdk.Token(_wallet.chainID, token.address, token.decimal, token.name);
            _context.next = 22;
            return _sdk.Fetcher.fetchPairData(_sdk.WETH[_wallet.chainID], TOKEN, _wallet.provider);

          case 22:
            pairBNB = _context.sent;
            routeBNB = new _sdk.Route([pairBNB], TOKEN);
            currentPrice = routeBNB.midPrice.toSignificant(6);
            price = currentPrice * bnbInUsd;
            _context.next = 29;
            break;

          case 28:
            price = bnbInUsd;

          case 29:
            return _context.abrupt("return", {
              balance: parseFloat((0, _units.formatUnits)(balance, token.decimal)),
              price: parseFloat(price),
              bnbPrice: parseFloat(bnbInUsd),
              bnbBalance: parseFloat((0, _units.formatEther)(bnbBalance)),
              busdBalance: parseFloat((0, _units.formatEther)(busdBalance))
            });

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getTokenPriceAndBalance(_x) {
    return _ref.apply(this, arguments);
  };
}(); // ********************************************
// Get Current Price
// ********************************************


exports.getTokenPriceAndBalance = getTokenPriceAndBalance;

var getCurrentPrice = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(coin) {
    var TOKEN, currentPrice, pairBNB, routeBNB, currentPriceBNB, pairBUSD, routeBUSD, currentPriceBUSD, _pairBUSD, _routeBUSD, _currentPriceBUSD, currentPriceConversion, pairTokenBUSD, routeTokenBUSD, currentPriceTokenBUSD, _pairBNB, _routeBNB, _currentPriceBNB;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            TOKEN = new _sdk.Token(_wallet.chainID, coin.address, coin.decimal, coin.name);
            currentPrice = 0; // GET BNB to TOKEN Price

            if (!(coin.name !== 'BNB')) {
              _context2.next = 16;
              break;
            }

            _context2.next = 5;
            return _sdk.Fetcher.fetchPairData(_sdk.WETH[_wallet.chainID], TOKEN, _wallet.provider);

          case 5:
            pairBNB = _context2.sent;
            routeBNB = new _sdk.Route([pairBNB], TOKEN);
            currentPriceBNB = routeBNB.midPrice.toSignificant(6); // GET BNB to BUSD Price

            _context2.next = 10;
            return _sdk.Fetcher.fetchPairData(_wallet.BUSD, _sdk.WETH[_wallet.chainID], _wallet.provider);

          case 10:
            pairBUSD = _context2.sent;
            routeBUSD = new _sdk.Route([pairBUSD], _sdk.WETH[_wallet.chainID]);
            currentPriceBUSD = routeBUSD.midPrice.toSignificant(6);
            currentPrice = currentPriceBNB * currentPriceBUSD;
            _context2.next = 22;
            break;

          case 16:
            _context2.next = 18;
            return _sdk.Fetcher.fetchPairData(_wallet.BUSD, _sdk.WETH[_wallet.chainID], _wallet.provider);

          case 18:
            _pairBUSD = _context2.sent;
            _routeBUSD = new _sdk.Route([_pairBUSD], _sdk.WETH[_wallet.chainID]);
            _currentPriceBUSD = _routeBUSD.midPrice.toSignificant(6);
            currentPrice = _currentPriceBUSD;

          case 22:
            // GET BUSD to TOKEN Price
            currentPriceConversion = 0;

            if (!(coin.base === 'BUSD')) {
              _context2.next = 32;
              break;
            }

            _context2.next = 26;
            return _sdk.Fetcher.fetchPairData(_wallet.BUSD, TOKEN, _wallet.provider);

          case 26:
            pairTokenBUSD = _context2.sent;
            routeTokenBUSD = new _sdk.Route([pairTokenBUSD], TOKEN);
            currentPriceTokenBUSD = routeTokenBUSD.midPrice.toSignificant(6);
            currentPriceConversion = currentPriceTokenBUSD;
            _context2.next = 38;
            break;

          case 32:
            _context2.next = 34;
            return _sdk.Fetcher.fetchPairData(_sdk.WETH[_wallet.chainID], TOKEN, _wallet.provider);

          case 34:
            _pairBNB = _context2.sent;
            _routeBNB = new _sdk.Route([_pairBNB], TOKEN);
            _currentPriceBNB = _routeBNB.midPrice.toSignificant(6);
            currentPriceConversion = _currentPriceBNB;

          case 38:
            return _context2.abrupt("return", {
              currentPrice: currentPrice,
              currentPriceConversion: currentPriceConversion
            });

          case 39:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getCurrentPrice(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getCurrentPrice = getCurrentPrice;
//# sourceMappingURL=helpers.js.map