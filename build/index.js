"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _getSchema = require("./utils/getSchema");

var _apolloServerExpress = require("apollo-server-express");

var _apolloServerCore = require("apollo-server-core");

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _bot = require("./bot");

var _db = require("./utils/db");

var _helmet = _interopRequireDefault(require("helmet"));

var _path = _interopRequireDefault(require("path"));

var _api = require("./api");

var PORT = process.env.PORT || 8000;
var HOST = 'localhost';

function startApolloServer() {
  return _startApolloServer.apply(this, arguments);
}

function _startApolloServer() {
  _startApolloServer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var app, httpServer, corsOptions, server;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            app = (0, _express["default"])();
            app.use(_express["default"].json({
              limit: '50mb'
            }));
            app.use(_express["default"].urlencoded({
              limit: '50mb',
              extended: false,
              parameterLimit: 50000
            }));
            app.use((0, _helmet["default"])());
            app.use('/', _express["default"]["static"](_path["default"].join(__dirname, 'public')));
            app.use('/', _api.router);
            httpServer = _http["default"].createServer(app);
            corsOptions = {
              origin: "http://".concat(HOST, ":").concat(PORT),
              credentials: true
            };
            server = new _apolloServerExpress.ApolloServer({
              schema: (0, _getSchema.getSchema)(),
              plugins: [(0, _apolloServerCore.ApolloServerPluginDrainHttpServer)({
                httpServer: httpServer
              })],
              playground: true,
              introspection: true,
              cors: corsOptions
            });
            _context2.next = 11;
            return server.start();

          case 11:
            server.applyMiddleware({
              app: app,
              path: '/graphql'
            }); // Modified server startup

            _context2.next = 14;
            return new Promise(function (resolve) {
              return httpServer.listen({
                port: PORT
              }, resolve);
            });

          case 14:
            console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(PORT).concat(server.graphqlPath));
            _context2.next = 17;
            return (0, _db.startDB)();

          case 17:
            _context2.next = 19;
            return runBot();

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _startApolloServer.apply(this, arguments);
}

var runBot = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!1) {
              _context.next = 5;
              break;
            }

            _context.next = 3;
            return (0, _bot.startTheBot)();

          case 3:
            _context.next = 0;
            break;

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function runBot() {
    return _ref.apply(this, arguments);
  };
}();

startApolloServer();
//# sourceMappingURL=index.js.map