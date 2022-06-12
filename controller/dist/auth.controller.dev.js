"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.protect = exports.logout = exports.checkLogin = exports.login = exports.signUp = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _httpStatus = _interopRequireDefault(require("http-status"));

var _models = _interopRequireDefault(require("../models"));

var _appError = _interopRequireDefault(require("../utils/appError"));

var _token = _interopRequireDefault(require("../utils/token"));

var _email = _interopRequireDefault(require("../utils/email"));

var _dotenv = require("dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _dotenv.config)(); // Extract models from db export

var User = _models["default"].User,
    Token = _models["default"].Token;

var signUp = function signUp(req, res, next) {
  var _req$body, first_name, last_name, email, password, existedUser, salt, hashedPassword, newUser;

  return regeneratorRuntime.async(function signUp$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, first_name = _req$body.first_name, last_name = _req$body.last_name, email = _req$body.email, password = _req$body.password;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email
            }
          }));

        case 4:
          existedUser = _context.sent;

          if (!existedUser) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(500).json({
            status: _httpStatus["default"][500],
            message: "E-mail is already taken, please try again with another one"
          }));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(_bcrypt["default"].genSalt(12));

        case 9:
          salt = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(password, salt));

        case 12:
          hashedPassword = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword
          }));

        case 15:
          newUser = _context.sent;
          // CREATE TOKEN FOR REGISTERED USER
          (0, _token["default"])(newUser, 201, "User created!", res);
          _context.next = 22;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            status: _httpStatus["default"][500],
            message: "Internal Server Error - Please try again...",
            err: process.env.NODE_ENV === 'development' ? _context.t0 : null
          }));

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.signUp = signUp;

var login = function login(req, res, next) {
  var _req$body2, email, password, user;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password; // CHECK IF EMAIL AND PASSWORD EXISTS

          if (!(!email || !password)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", next(new _appError["default"]("Please provide email and password, then try again...", 400)));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email
            }
          }));

        case 6:
          user = _context2.sent;
          _context2.t0 = !user;

          if (_context2.t0) {
            _context2.next = 12;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap(user.checkPwdValidation(password, user.password));

        case 11:
          _context2.t0 = !_context2.sent;

        case 12:
          if (!_context2.t0) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", next(new _appError["default"]("Incorect email or password, please try again...", 401)));

        case 14:
          // IF EVERYTHING IS OK, SEND JWT TOKEN TO CLIENT
          (0, _token["default"])(user, 201, "User logged in!", res);
          _context2.next = 20;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t1 = _context2["catch"](3);
          return _context2.abrupt("return", res.status(500).json({
            status: _httpStatus["default"][500],
            message: "Internal Server Error - Please try again...",
            err: process.env.NODE_ENV === 'development' ? _context2.t1 : null
          }));

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 17]]);
};

exports.login = login;

var checkLogin = function checkLogin(req, res, next) {
  var token, tokenMatch, user, isChanged;
  return regeneratorRuntime.async(function checkLogin$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          token = null; // GET THE JWT TOKEN AND CHECK IT

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
          }

          if (token) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", next(new _appError["default"]("You are not logged in, please login to get access...", 401)));

        case 4:
          _context3.prev = 4;
          tokenMatch = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_DATE
          });

          if (tokenMatch) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", next(new _appError["default"]("You are not logged in, your session expired", 401)));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              id: tokenMatch.id
            }
          }));

        case 10:
          user = _context3.sent;

          if (user) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", next(new _appError["default"]("Session expired, please log in again.", 401)));

        case 13:
          // CHECK IF USER CHANGED PASSWORD AFTER JWT TOKEN WAS GENERATED
          isChanged = user.changedPwdAfterCheck(tokenMatch.iat); // ACCES FORBIDDEN

          if (!isChanged) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", next(new _appError["default"]("User recently changed password, please log in again!", 401)));

        case 16:
          (0, _token["default"])(user, 200, "Token verified!", res);
          _context3.next = 22;
          break;

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](4);
          return _context3.abrupt("return", res.status(500).json({
            status: "Bad request",
            message: "Invalid session, please log in again..."
          }));

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 19]]);
};

exports.checkLogin = checkLogin;

var logout = function logout(req, res, _) {
  return regeneratorRuntime.async(function logout$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          res.cookie('jwt', 'User Logged Out', {
            expires: new Date(Date.now() + 1 * 1000),
            httpOnly: true,
            secure: false
          });
          res.status(200).json({
            status: 'success',
            message: 'User Logged Out'
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.logout = logout;

var protect = function protect(req, res, next) {
  var token, tokenMatch, user, isChanged;
  return regeneratorRuntime.async(function protect$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          token = null; // GET THE JWT TOKEN AND CHECK IT

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
          }

          if (token) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", next(new _appError["default"]("You are not logged in, please login to get access...", 401)));

        case 4:
          _context5.prev = 4;
          tokenMatch = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_DATE
          });

          if (tokenMatch) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", next(new _appError["default"]("You are not logged in, your session expired", 401)));

        case 8:
          _context5.next = 10;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              id: tokenMatch.id
            }
          }));

        case 10:
          user = _context5.sent;

          if (user) {
            _context5.next = 13;
            break;
          }

          return _context5.abrupt("return", next(new _appError["default"]("The user belonging to this token does no longer exists.", 401)));

        case 13:
          // CHECK IF USER CHANGED PASSWORD AFTER JWT TOKEN WAS GENERATED
          isChanged = user.changedPwdAfterCheck(tokenMatch.iat); // ACCES FORBIDDEN

          if (!isChanged) {
            _context5.next = 16;
            break;
          }

          return _context5.abrupt("return", next(new _appError["default"]("User recently changed password, please log in again!", 401)));

        case 16:
          // GRANT ACCESS TO PROTECTED ROUTE
          // PASS THE USER WITH JWT TOKEN TO THE NEXT MIDDLEWEAR
          req.user = user;
          next();
          _context5.next = 23;
          break;

        case 20:
          _context5.prev = 20;
          _context5.t0 = _context5["catch"](4);
          return _context5.abrupt("return", res.status(500).json({
            status: "Bad request",
            message: "Invalid signature: JWT TOKEN, please log in again..."
          }));

        case 23:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 20]]);
};

exports.protect = protect;

var restrictTo = function restrictTo() {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function _callee(req, res, next) {
    return regeneratorRuntime.async(function _callee$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (roles.includes(req.user.role)) {
              _context6.next = 2;
              break;
            }

            return _context6.abrupt("return", next(new _appError["default"]("You do not have permission to perform this action...", 403)));

          case 2:
            next();

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    });
  };
};

exports.restrictTo = restrictTo;

var forgotPassword = function forgotPassword(req, res, next) {
  var email, user, resetToken, expirationDate, resetPwdToken, resetURL, message;
  return regeneratorRuntime.async(function forgotPassword$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          email = req.body.email;
          _context7.prev = 1;
          _context7.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email
            }
          }));

        case 4:
          user = _context7.sent;

          if (user) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", next(new _appError["default"]("The email does not exists.", 401)));

        case 7:
          // GENERATE A RANDOM TOKEN
          resetToken = _jsonwebtoken["default"].sign({
            id: user.id
          }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_PWD_TOKEN
          });
          expirationDate = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
          _context7.next = 11;
          return regeneratorRuntime.awrap(Token.create({
            userId: user.id,
            reset_token: resetToken,
            token_generated_at: new Date(Date.now()).toUTCString(),
            token_expiration_date: expirationDate
          }));

        case 11:
          resetPwdToken = _context7.sent;
          // SEND BACK AS EMAIL
          resetURL = "".concat(req.protocol, "://127.0.0.1:3000/reset-password/").concat(resetPwdToken.reset_token);
          message = "Forgot your password? Submit a request with your new password and password confirm to: ".concat(resetURL, "\nIf you did not perform this request, please ignore this e-mail!");
          _context7.prev = 14;
          _context7.next = 17;
          return regeneratorRuntime.awrap((0, _email["default"])({
            email: user.email,
            subject: 'Your password reset token is valid for 60 minutes.',
            message: message
          }));

        case 17:
          return _context7.abrupt("return", res.status(200).json({
            status: "success",
            message: "Token sent to e-mail!",
            resetToken: resetToken
          }));

        case 20:
          _context7.prev = 20;
          _context7.t0 = _context7["catch"](14);
          return _context7.abrupt("return", next(new _appError["default"]("The request can not be resolved, please try again...", 500)));

        case 23:
          _context7.next = 28;
          break;

        case 25:
          _context7.prev = 25;
          _context7.t1 = _context7["catch"](1);
          return _context7.abrupt("return", res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again..."
          }));

        case 28:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[1, 25], [14, 20]]);
};

exports.forgotPassword = forgotPassword;

var resetPassword = function resetPassword(req, res, next) {
  var hashedToken, user, salt, hashedPassword;
  return regeneratorRuntime.async(function resetPassword$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          hashedToken = _jsonwebtoken["default"].verify(req.params.token, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_DATE
          });

          if (hashedToken) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", next(new _appError["default"]("You are not logged in, your session expired", 401)));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              id: hashedToken.id
            }
          }));

        case 6:
          user = _context8.sent;

          if (user) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", next(new _appError["default"]("Token is invalid or has expired...", 400)));

        case 9:
          _context8.next = 11;
          return regeneratorRuntime.awrap(_bcrypt["default"].genSalt(12));

        case 11:
          salt = _context8.sent;
          _context8.next = 14;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(req.body.password, salt));

        case 14:
          hashedPassword = _context8.sent;
          user.password = hashedPassword;
          user.password_changed_at = new Date(Date.now()).toUTCString();
          _context8.next = 19;
          return regeneratorRuntime.awrap(user.save());

        case 19:
          // LOG THE USER IN, SEND JWT TO CLIENT
          (0, _token["default"])(user, 200, "Password updated!", res);
          _context8.next = 25;
          break;

        case 22:
          _context8.prev = 22;
          _context8.t0 = _context8["catch"](0);
          return _context8.abrupt("return", res.status(400).json({
            status: _context8.t0.name,
            message: "".concat(_context8.t0.message, " at ").concat(_context8.t0.expiredAt)
          }));

        case 25:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

exports.resetPassword = resetPassword;