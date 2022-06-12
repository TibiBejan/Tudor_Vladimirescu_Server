"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = require("dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _dotenv.config)(); // GENERATE JWT TOKEN

var signToken = function signToken(id) {
  return _jsonwebtoken["default"].sign({
    id: id
  }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_DATE
  });
}; // CREATE TOKEN AND HTTP ONLY COOKIE.


var createToken = function createToken(user, statusCode, message, res) {
  var token = signToken(user.id); // GENERATE HTTP_ONLY COOCKIE FOR CLIENT SIDE

  res.cookie('jwt', token, {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.JWT_EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  });
  return res.status(statusCode).json({
    status: 200,
    message: message,
    data: {
      user: user,
      token: token
    }
  });
};

var _default = createToken;
exports["default"] = _default;