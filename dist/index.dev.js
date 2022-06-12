"use strict";

var _sequelize = require("sequelize");

var _expressConfig = _interopRequireDefault(require("./config/express.config.js"));

var _index = _interopRequireDefault(require("./constants/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// =================== Modules Imports =================== //
// =================== DB Init =================== //
var sequelize = new _sequelize.Sequelize(_index["default"].MYSQL_DB_NAME, _index["default"].MYSQL_USER, _index["default"].MYSQL_PWD, {
  host: _index["default"].MYSQL_HOST,
  dialect: 'mysql',
  port: 3306
}); // =================== Server Init =================== //

var port = _index["default"].port || 3001;

_expressConfig["default"].listen(port, function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Server App running on ".concat(_index["default"].env, " mode with port ").concat(port || '3001', "..."));
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(sequelize.authenticate());

        case 4:
          // await sequelize.sync({force: true})
          console.log('Connection has been established successfully.');
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          console.error('Unable to connect to the database:', _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
});