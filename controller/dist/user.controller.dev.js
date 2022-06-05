"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allocateStudent = exports.deleteEnrollment = exports.updateEnrollemnt = exports.getEnrollment = exports.createEnrollment = exports.updatePassword = exports.deleteProfile = exports.updateProfile = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _models = _interopRequireDefault(require("../models"));

var _appError = _interopRequireDefault(require("../utils/appError"));

var _token = _interopRequireDefault(require("../utils/token"));

var _utilityFunctions = require("../utils/utilityFunctions");

var _dotenv = require("dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(0, _dotenv.config)(); // Extract models from db export

var User = _models["default"].User,
    University = _models["default"].University,
    Enrollment = _models["default"].Enrollment,
    StudentMeta = _models["default"].StudentMeta,
    Relatives = _models["default"].Relatives,
    Hall = _models["default"].Hall,
    HallRoom = _models["default"].HallRoom;

var updateProfile = function updateProfile(req, res, next) {
  var filteredBody, updatedUser, user;
  return regeneratorRuntime.async(function updateProfile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!req.body.password) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next(new _appError["default"]("You can not use this route to update your password. Use update password route.", 400)));

        case 2:
          // FILTER BODY AND UPDATE SPECIFIC FIELDS
          filteredBody = (0, _utilityFunctions.filterObjectEntries)(req.body, 'first_name', 'last_name', 'email');
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(User.update(filteredBody, {
            where: {
              id: req.user.id
            }
          }));

        case 6:
          updatedUser = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              id: req.user.id
            }
          }));

        case 9:
          user = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            status: "Success",
            message: "User has been updated!",
            user: user
          }));

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](3);
          return _context.abrupt("return", res.status(500).json({
            status: "Bad Request",
            message: "There is an error updating your info, please try again..."
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 13]]);
};

exports.updateProfile = updateProfile;

var deleteProfile = function deleteProfile(req, res, next) {
  var user;
  return regeneratorRuntime.async(function deleteProfile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              id: req.user.id
            }
          }));

        case 3:
          user = _context2.sent;

          if (user) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", next(new _appError["default"]("User not found", 404)));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(user.destroy());

        case 8:
          return _context2.abrupt("return", res.status(204).json({
            status: "success",
            message: "User has been deleted!"
          }));

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Please try again..."
          }));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.deleteProfile = deleteProfile;

var updatePassword = function updatePassword(req, res, next) {
  var user, salt, hashedPasswordNew;
  return regeneratorRuntime.async(function updatePassword$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              id: req.user.id
            }
          }));

        case 3:
          user = _context3.sent;

          if (user) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", next(new _appError["default"]("The user belonging to this token does no longer exists.", 401)));

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(_bcrypt["default"].genSalt(12));

        case 8:
          salt = _context3.sent;
          _context3.next = 11;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(req.body.password_new, salt));

        case 11:
          hashedPasswordNew = _context3.sent;
          _context3.next = 14;
          return regeneratorRuntime.awrap(user.checkPwdValidation(req.body.password_confirm, user.password));

        case 14:
          if (_context3.sent) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", next(new _appError["default"]("Your current password is wrong.", 401)));

        case 16:
          // UPDATE PASSWORD
          user.password = hashedPasswordNew;
          user.password_changed_at = new Date(Date.now()).toUTCString();
          _context3.next = 20;
          return regeneratorRuntime.awrap(user.save());

        case 20:
          // LOG IN THE USER WITH THE NEW JWT
          (0, _token["default"])(user, 200, "Password updated!", res);
          _context3.next = 26;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again..."
          }));

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

exports.updatePassword = updatePassword;

var createEnrollment = function createEnrollment(req, res, next) {
  var _req$body, university, year_of_study, type_of_study, grade, financial_type, nationality, student_gender, studentUniversity, isEnrolled, newEnrollment;

  return regeneratorRuntime.async(function createEnrollment$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          // GET DATA FROM REQ
          _req$body = req.body, university = _req$body.university, year_of_study = _req$body.year_of_study, type_of_study = _req$body.type_of_study, grade = _req$body.grade, financial_type = _req$body.financial_type, nationality = _req$body.nationality, student_gender = _req$body.student_gender; // GET UNIVERSITY BASED ON ENROLLMENT

          _context4.next = 4;
          return regeneratorRuntime.awrap(University.findOne({
            where: {
              title: university
            }
          }));

        case 4:
          studentUniversity = _context4.sent;

          if (studentUniversity) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", next(new _appError["default"]("The enrollment can not be done, please try again", 400)));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(Enrollment.findOne({
            where: {
              universityId: studentUniversity.id,
              userId: req.user.id
            }
          }));

        case 9:
          isEnrolled = _context4.sent;

          if (!isEnrolled) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", next(new _appError["default"]("You are already enrolled, please try to update current enrollment.", 406)));

        case 12:
          _context4.next = 14;
          return regeneratorRuntime.awrap(Enrollment.create({
            university: university,
            year_of_study: year_of_study,
            type_of_study: type_of_study,
            grade: grade,
            financial_type: financial_type,
            nationality: nationality,
            student_gender: student_gender,
            userId: req.user.id,
            universityId: studentUniversity.id
          }));

        case 14:
          newEnrollment = _context4.sent;
          return _context4.abrupt("return", res.status(200).json({
            status: "Success",
            message: "Enrollment has been created!",
            enrollment: newEnrollment
          }));

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again...."
          }));

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

exports.createEnrollment = createEnrollment;

var getEnrollment = function getEnrollment(req, res, next) {
  var currentEnrollment;
  return regeneratorRuntime.async(function getEnrollment$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Enrollment.findOne({
            where: {
              userId: req.user.id
            }
          }));

        case 3:
          currentEnrollment = _context5.sent;

          if (currentEnrollment) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", next(new _appError["default"]("Enrollment not found, please enroll", 404)));

        case 6:
          return _context5.abrupt("return", res.status(200).json({
            status: "Success",
            message: "Enrollment found!",
            enrollment: currentEnrollment
          }));

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again...."
          }));

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getEnrollment = getEnrollment;

var updateEnrollemnt = function updateEnrollemnt(req, res, next) {
  var currentEnrollment, filteredBody, studentUniversity;
  return regeneratorRuntime.async(function updateEnrollemnt$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Enrollment.findOne({
            where: {
              id: req.params.id,
              userId: req.user.id
            }
          }));

        case 3:
          currentEnrollment = _context6.sent;

          if (currentEnrollment) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", next(new _appError["default"]("Enrollment not found, please enroll", 404)));

        case 6:
          // FILTER BODY AND UPDATE SPECIFIC FIELDS
          filteredBody = (0, _utilityFunctions.filterObjectEntries)(req.body, 'university', 'year_of_study', 'type_of_study', 'grade', 'financial_type', 'nationality', 'student_gender'); // UPDATE ENROLLMENT

          _context6.next = 9;
          return regeneratorRuntime.awrap(University.findOne({
            where: {
              title: req.body.university
            }
          }));

        case 9:
          studentUniversity = _context6.sent;

          if (studentUniversity) {
            _context6.next = 12;
            break;
          }

          return _context6.abrupt("return", next(new _appError["default"]("The enrollment can not be updated, please try again", 400)));

        case 12:
          _context6.next = 14;
          return regeneratorRuntime.awrap(currentEnrollment.update(_objectSpread({}, filteredBody, {
            universityId: studentUniversity.id
          })));

        case 14:
          return _context6.abrupt("return", res.status(200).json({
            status: "Success",
            message: "Enrollment has been updated!",
            enrollment: currentEnrollment
          }));

        case 17:
          _context6.prev = 17;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again...."
          }));

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

exports.updateEnrollemnt = updateEnrollemnt;

var deleteEnrollment = function deleteEnrollment(req, res, next) {
  var currentEnrollment;
  return regeneratorRuntime.async(function deleteEnrollment$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Enrollment.findOne({
            where: {
              id: req.params.id,
              userId: req.user.id
            }
          }));

        case 3:
          currentEnrollment = _context7.sent;

          if (currentEnrollment) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", next(new _appError["default"]("Enrollment not found, please enroll", 404)));

        case 6:
          _context7.next = 8;
          return regeneratorRuntime.awrap(currentEnrollment.destroy());

        case 8:
          return _context7.abrupt("return", res.status(204).json({
            status: "success",
            message: "Enrollment has been deleted!"
          }));

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](0);
          return _context7.abrupt("return", res.status(500).json({
            status: "Bad request",
            message: "The request can not be resolved, please try again...."
          }));

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.deleteEnrollment = deleteEnrollment;

var allocateStudent = function allocateStudent(req, res, next) {
  var studentMetaExists, studentKinsExists, enrollment, _ref, halls, universityHalls, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret;

  return regeneratorRuntime.async(function allocateStudent$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(StudentMeta.findOne({
            where: {
              userId: req.user.id
            }
          }));

        case 3:
          studentMetaExists = _context9.sent;

          if (studentMetaExists) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return", next(new _appError["default"]("In order to be allocated, you must update your student informations.", 404)));

        case 6:
          _context9.next = 8;
          return regeneratorRuntime.awrap(Relatives.findAll({
            where: {
              id: req.user.id
            }
          }));

        case 8:
          studentKinsExists = _context9.sent;

          if (studentKinsExists) {
            _context9.next = 11;
            break;
          }

          return _context9.abrupt("return", next(new _appError["default"]("In order to be allocated, you must update your student informations.", 404)));

        case 11:
          _context9.next = 13;
          return regeneratorRuntime.awrap(Enrollment.findOne({
            where: {
              userId: req.user.id
            }
          }));

        case 13:
          enrollment = _context9.sent;

          if (enrollment) {
            _context9.next = 16;
            break;
          }

          return _context9.abrupt("return", next(new _appError["default"]("In order to be allocated, you must enroll.", 404)));

        case 16:
          _context9.next = 18;
          return regeneratorRuntime.awrap(University.findOne({
            where: {
              id: enrollment.universityId
            },
            attributes: ['halls']
          }));

        case 18:
          _ref = _context9.sent;
          halls = _ref.halls;
          _context9.next = 22;
          return regeneratorRuntime.awrap(Hall.findAll({
            where: {
              hall_name: halls
            },
            order: [['min_grade', 'desc']],
            attributes: ['id', 'hall_number', 'hall_name', 'total_rooms', 'total_students', 'students_in_room', 'min_grade', 'max_grade']
          }));

        case 22:
          universityHalls = _context9.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context9.prev = 26;

          _loop = function _loop() {
            var _step$value, index, hall, studentsLimit, roomsLimit, totalStudentsFromHall, currentUserToAccommodate, rent, i, floor, currentAllocatedStudent, currentRoomMembers, allocateStudentToRoom, existingStudentsInRoom, isMatch, _allocateStudentToRoom;

            return regeneratorRuntime.async(function _loop$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _step$value = _slicedToArray(_step.value, 2), index = _step$value[0], hall = _step$value[1];
                    studentsLimit = hall.total_students;
                    roomsLimit = hall.total_rooms; // Get all students with current hall id

                    _context8.next = 5;
                    return regeneratorRuntime.awrap(User.count({
                      where: {
                        hallId: hall.id
                      }
                    }));

                  case 5:
                    totalStudentsFromHall = _context8.sent;

                    if (!(totalStudentsFromHall > studentsLimit && index === universityHalls.length - 1)) {
                      _context8.next = 8;
                      break;
                    }

                    return _context8.abrupt("return", {
                      v: next(new _appError["default"]("You can not enroll because the limit of students for your university has been reached.", 500))
                    });

                  case 8:
                    if (!(totalStudentsFromHall >= studentsLimit)) {
                      _context8.next = 10;
                      break;
                    }

                    return _context8.abrupt("return", "continue");

                  case 10:
                    if (!(enrollment.grade < hall.min_grade || enrollment.grade > hall.max_grade)) {
                      _context8.next = 12;
                      break;
                    }

                    return _context8.abrupt("return", "continue");

                  case 12:
                    // If there are available spaces in current hall and grade match, enroll student
                    req.user.hallId = hall.id;
                    _context8.next = 15;
                    return regeneratorRuntime.awrap(req.user.save());

                  case 15:
                    _context8.next = 17;
                    return regeneratorRuntime.awrap(User.findOne({
                      where: {
                        id: req.user.id
                      },
                      include: [{
                        model: Enrollment
                      }]
                    }));

                  case 17:
                    currentUserToAccommodate = _context8.sent;
                    // Set room rent price hardcoded
                    rent = 0;

                    if (hall.students_in_room === 2) {
                      rent = 250;
                    } else if (hall.students_in_room === 3) {
                      rent = 200;
                    } else {
                      rent = 150;
                    } // Map all hall rooms


                    i = 0;

                  case 21:
                    if (!(i <= roomsLimit)) {
                      _context8.next = 57;
                      break;
                    }

                    // Set room floor hardcoded
                    floor = 0;

                    if (i > 70 && i < 140) {
                      floor = 1;
                    } else if (i > 140 && i < 210) {
                      floor = 2;
                    } else if (i > 210 && i < 280) {
                      floor = 3;
                    } // Check if student is already allocated


                    _context8.next = 26;
                    return regeneratorRuntime.awrap(HallRoom.findOne({
                      where: {
                        hallId: hall.id,
                        userId: currentUserToAccommodate.id
                      }
                    }));

                  case 26:
                    currentAllocatedStudent = _context8.sent;

                    if (!currentAllocatedStudent) {
                      _context8.next = 29;
                      break;
                    }

                    return _context8.abrupt("return", {
                      v: res.status(500).json({
                        status: _httpStatus["default"][500],
                        message: "You are already allocated in Hall ".concat(hall.hall_name)
                      })
                    });

                  case 29:
                    ; // Fetch students from room with index i

                    _context8.next = 32;
                    return regeneratorRuntime.awrap(HallRoom.findAll({
                      where: {
                        hallId: hall.id,
                        number: i
                      }
                    }));

                  case 32:
                    currentRoomMembers = _context8.sent;

                    if (!(currentRoomMembers.length >= hall.students_in_room)) {
                      _context8.next = 35;
                      break;
                    }

                    return _context8.abrupt("continue", 54);

                  case 35:
                    if (!(currentRoomMembers.length === 0)) {
                      _context8.next = 40;
                      break;
                    }

                    _context8.next = 38;
                    return regeneratorRuntime.awrap(HallRoom.create({
                      number: i,
                      floor: floor,
                      rent_per_month: rent,
                      beds_number: hall.students_in_room,
                      bathroom: hall.bathroom,
                      hallId: currentUserToAccommodate.hallId,
                      userId: currentUserToAccommodate.id
                    }));

                  case 38:
                    allocateStudentToRoom = _context8.sent;
                    return _context8.abrupt("return", {
                      v: res.status(200).json({
                        status: "success",
                        message: "Student has been allocated!"
                      })
                    });

                  case 40:
                    if (!(currentRoomMembers.length < hall.students_in_room)) {
                      _context8.next = 54;
                      break;
                    }

                    _context8.next = 43;
                    return regeneratorRuntime.awrap(HallRoom.findAll({
                      where: {
                        hallId: hall.id,
                        room_number: i
                      },
                      include: [{
                        model: User,
                        include: Enrollment
                      }]
                    }));

                  case 43:
                    existingStudentsInRoom = _context8.sent;
                    isMatch = false;

                    if (!existingStudentsInRoom) {
                      _context8.next = 54;
                      break;
                    }

                    existingStudentsInRoom.forEach(function (s) {
                      if (s.User.Enrollment.student_gender === currentUserToAccommodate.Enrollment.student_gender) {
                        isMatch = true;
                      } else {
                        isMatch = false;
                      }
                    });

                    if (!isMatch) {
                      _context8.next = 52;
                      break;
                    }

                    _context8.next = 50;
                    return regeneratorRuntime.awrap(HallRoom.create({
                      number: i,
                      floor: floor,
                      rent_per_month: rent,
                      beds_number: hall.students_in_room,
                      bathroom: hall.bathroom,
                      hallId: currentUserToAccommodate.hallId,
                      userId: currentUserToAccommodate.id
                    }));

                  case 50:
                    _allocateStudentToRoom = _context8.sent;
                    return _context8.abrupt("return", {
                      v: res.status(200).json({
                        status: "success",
                        message: "Student has been allocated!"
                      })
                    });

                  case 52:
                    if (isMatch) {
                      _context8.next = 54;
                      break;
                    }

                    return _context8.abrupt("continue", 54);

                  case 54:
                    i++;
                    _context8.next = 21;
                    break;

                  case 57:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          };

          _iterator = universityHalls.entries()[Symbol.iterator]();

        case 29:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context9.next = 42;
            break;
          }

          _context9.next = 32;
          return regeneratorRuntime.awrap(_loop());

        case 32:
          _ret = _context9.sent;
          _context9.t0 = _ret;
          _context9.next = _context9.t0 === "continue" ? 36 : 37;
          break;

        case 36:
          return _context9.abrupt("continue", 39);

        case 37:
          if (!(_typeof(_ret) === "object")) {
            _context9.next = 39;
            break;
          }

          return _context9.abrupt("return", _ret.v);

        case 39:
          _iteratorNormalCompletion = true;
          _context9.next = 29;
          break;

        case 42:
          _context9.next = 48;
          break;

        case 44:
          _context9.prev = 44;
          _context9.t1 = _context9["catch"](26);
          _didIteratorError = true;
          _iteratorError = _context9.t1;

        case 48:
          _context9.prev = 48;
          _context9.prev = 49;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 51:
          _context9.prev = 51;

          if (!_didIteratorError) {
            _context9.next = 54;
            break;
          }

          throw _iteratorError;

        case 54:
          return _context9.finish(51);

        case 55:
          return _context9.finish(48);

        case 56:
          _context9.next = 61;
          break;

        case 58:
          _context9.prev = 58;
          _context9.t2 = _context9["catch"](0);
          return _context9.abrupt("return", res.status(400).json({
            status: _context9.t2.name,
            message: "".concat(_context9.t2.message, " at ").concat(_context9.t2.expiredAt)
          }));

        case 61:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 58], [26, 44, 48, 56], [49,, 51, 55]]);
};

exports.allocateStudent = allocateStudent;