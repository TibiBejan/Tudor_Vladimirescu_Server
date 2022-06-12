"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _errorController = _interopRequireDefault(require("../controller/error.controller.js"));

var _index = _interopRequireDefault(require("../routes/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// =================== Modules Imports =================== //
// =================== Routes Imports =================== //
// =================== App Init =================== //
var app = (0, _express["default"])(); // =================== Global Middlewares =================== //

app.use((0, _cors["default"])());
app.use((0, _helmet["default"])());
app.use((0, _cookieParser["default"])());
app.use(_bodyParser["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _morgan["default"])('combined')); // Cors

app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://tudor-vladimirescu.netlify.app/");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(function (req, res, next) {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
}); // This middleware takes care of the origin when the origin is undefined. Origin is undefined when request is local

app.use(function (req, _, next) {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
}); // =================== Routes =================== //

app.get('/api/v1', function (req, res) {
  res.send('Hello World!');
});
app.use('/api/v1', _index["default"]); // =================== Error Middlewares =================== //

app.all('*', function (req, res, next) {
  next(new AppError("Can't find ".concat(req.originalUrl, " on this server!"), 404));
});
app.use(_errorController["default"]);
var _default = app;
exports["default"] = _default;