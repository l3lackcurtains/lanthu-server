"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSchema = void 0;

var _schema = require("@graphql-tools/schema");

var _merge = require("@graphql-tools/merge");

var _loadFiles = require("@graphql-tools/load-files");

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var getSchema = function getSchema() {
  var typesArray = (0, _loadFiles.loadFilesSync)(path.join(__dirname, '../graphql/**/*.graphql'), {
    recursive: true
  });
  var resolversArray = (0, _loadFiles.loadFilesSync)(path.join(__dirname, '../graphql/**/*.resolver.*'), {
    recursive: true
  });
  var typeDefs = (0, _merge.mergeTypeDefs)(typesArray);
  var resolvers = (0, _merge.mergeResolvers)(resolversArray);
  var executableSchema = (0, _schema.makeExecutableSchema)({
    typeDefs: typeDefs,
    resolvers: resolvers
  });
  return executableSchema;
};

exports.getSchema = getSchema;
//# sourceMappingURL=getSchema.js.map