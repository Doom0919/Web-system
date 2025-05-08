"use strict";

var express = require('express');

var _require = require('express-validator'),
    check = _require.check;

var jwt = require('jsonwebtoken');

var User = require('../models/User');

var router = express.Router();

var _require2 = require('../middleware/auth'),
    authenticateToken = _require2.authenticateToken;

var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'someVerySecretKeyThatIsHardToGuess';
var REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'someVerySecretKeyThatIsHardToGuess';
var ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'; // e.g., 15 minutes

var REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'; // e.g., 7 days
// This is a demo store for refresh tokens (for production use a DB)

var refreshTokensStore = []; // Get all users

router.get('/', function _callee(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.find());

        case 3:
          users = _context.sent;
          res.json({
            users: users
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: 'Fetching users failed.'
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Create a new user

router.post('/signup', [check('name').not().isEmpty(), check('email').isEmail(), check('password').isLength({
  min: 6
})], function _callee2(req, res) {
  var _req$body, name, email, password, imgLink, newUser;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, imgLink = _req$body.imgLink;
          _context2.prev = 1;
          newUser = new User({
            name: name,
            email: email,
            password: password,
            imgLink: imgLink
          });
          _context2.next = 5;
          return regeneratorRuntime.awrap(newUser.save());

        case 5:
          res.status(201).json({
            user: newUser
          });
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            message: 'Creating user failed.'
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
}); // User login

router.post('/login', function _callee3(req, res) {
  var _req$body2, email, password, existingUser, accessToken, refreshToken;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          existingUser = _context3.sent;

          if (!(!existingUser || existingUser.password !== password)) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(401).json({
            message: 'Invalid email or password.'
          }));

        case 7:
          // Create tokens
          accessToken = jwt.sign({
            userId: existingUser._id
          }, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN
          });
          refreshToken = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email
          }, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
          });
          refreshTokensStore.push(refreshToken);
          res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
            tokenType: 'Bearer'
          });
          _context3.next = 16;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            message: 'Login failed.'
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 13]]);
}); // Endpoint to get the logged-in user's ID

router.get('/loginu', authenticateToken, function (req, res) {
  try {
    var userId = req.user.userId; // Extract userId from the decoded token

    res.json({
      userId: userId
    });
    console.log('User ID:', userId); // Log the userId for debugging
  } catch (err) {
    console.error('Error fetching user ID:', err);
    res.status(500).json({
      message: 'Failed to fetch user ID.'
    });
  }
}); // Authentication route to verify user token

router.get('/auth', function _callee4(req, res) {
  var authHeader, token, decodedToken, user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          authHeader = req.headers.authorization;

          if (!(!authHeader || !authHeader.startsWith('Bearer '))) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
            message: 'Authorization header missing or invalid.'
          }));

        case 3:
          token = authHeader.split(' ')[1];
          _context4.prev = 4;
          // Use the same ACCESS_TOKEN_SECRET as everywhere else
          decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
          _context4.next = 8;
          return regeneratorRuntime.awrap(User.findById(decodedToken.userId));

        case 8:
          user = _context4.sent;

          if (user) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'User not found.'
          }));

        case 11:
          res.status(200).json({
            u_id: user._id,
            name: user.name,
            email: user.email
          });
          _context4.next = 17;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](4);
          res.status(401).json({
            message: 'Invalid or expired token.'
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 14]]);
});
router.post('/refresh', function (req, res) {
  var refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      message: 'Refresh token is required.'
    });
  }

  if (!refreshTokensStore.includes(refreshToken)) {
    return res.status(403).json({
      message: 'Invalid refresh token.'
    });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, function (err, userData) {
    if (err) {
      return res.status(403).json({
        message: 'Invalid refresh token.'
      });
    }

    var newAccessToken = jwt.sign({
      userId: userData.userId,
      email: userData.email
    }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });
    res.status(200).json({
      accessToken: newAccessToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      tokenType: 'Bearer'
    });
  });
});
module.exports = router;