"use strict";

var express = require('express');

var _require = require('express-validator'),
    check = _require.check,
    validationResult = _require.validationResult;

var mongoose = require('mongoose');

var _require2 = require('../middleware/auth'),
    authenticateToken = _require2.authenticateToken;

var Place = require('../models/Place');

var router = express.Router(); // Get all places for a user

router.get('/user/:uid', function _callee(req, res) {
  var userId, places;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = req.params.uid;
          console.log('GET /api/places/user/:uid userId:', userId);

          if (!(!userId || !mongoose.Types.ObjectId.isValid(userId))) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Invalid or missing user ID.'
          }));

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(Place.find({
            creator: userId
          }));

        case 7:
          places = _context.sent;
          res.json({
            places: places
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](4);
          console.error('Error fetching places:', _context.t0);
          res.status(500).json({
            message: "Fetching places failed for user ID: ".concat(userId)
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 11]]);
}); // Get place by ID

router.get('/:pid', function _callee2(req, res) {
  var placeId, place;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          placeId = req.params.pid;

          if (mongoose.Types.ObjectId.isValid(placeId)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Invalid place ID format.'
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Place.findById(placeId));

        case 6:
          place = _context2.sent;

          if (place) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Place not found.'
          }));

        case 9:
          res.json({
            place: place
          });
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](3);
          res.status(500).json({
            message: 'Fetching place failed.'
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 12]]);
}); // Test authentication

router.get('/test-auth', authenticateToken, function (req, res) {
  res.json({
    user: req.user
  });
}); // Create a new place

router.post('/', authenticateToken, function _callee3(req, res) {
  var _req$body, title, description, imgLink, location, loc_x, loc_y, creator, newPlace;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, title = _req$body.title, description = _req$body.description, imgLink = _req$body.imgLink, location = _req$body.location, loc_x = _req$body.loc_x, loc_y = _req$body.loc_y;
          console.log('POST /api/places req.body:', req.body);
          creator = req.user.userId; // Ensure req.user.userId is populated by authenticateToken

          if (creator) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Creator ID is missing.'
          }));

        case 5:
          _context3.prev = 5;
          newPlace = new Place({
            title: title,
            description: description,
            location: location,
            loc_x: loc_x,
            loc_y: loc_y,
            imgLink: imgLink,
            creator: creator
          });
          _context3.next = 9;
          return regeneratorRuntime.awrap(newPlace.save());

        case 9:
          res.status(201).json({
            place: newPlace
          });
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](5);
          console.error('Error creating place:', _context3.t0);
          res.status(500).json({
            message: 'Creating place failed.'
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[5, 12]]);
});
router.patch('/:pid', function _callee4(req, res) {
  var _req$body2, title, description, location, loc_x, loc_y, imgLink, updatedPlace;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description, location = _req$body2.location, loc_x = _req$body2.loc_x, loc_y = _req$body2.loc_y, imgLink = _req$body2.imgLink;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Place.findByIdAndUpdate(req.params.pid, {
            title: title,
            description: description,
            location: location,
            loc_x: loc_x,
            loc_y: loc_y,
            imgLink: imgLink
          }, {
            "new": true
          }));

        case 4:
          updatedPlace = _context4.sent;

          if (updatedPlace) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Place not found.'
          }));

        case 7:
          res.json({
            place: updatedPlace
          });
          _context4.next = 13;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            message: 'Updating place failed.'
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
router["delete"]('/:pid', function _callee5(req, res) {
  var placeId, deletedPlace;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          placeId = req.params.pid;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Place.findByIdAndDelete(placeId));

        case 4:
          deletedPlace = _context5.sent;

          if (deletedPlace) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Place not found.'
          }));

        case 7:
          res.json({
            message: 'Place deleted successfully.'
          });
          _context5.next = 13;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          res.status(500).json({
            message: 'Deleting place failed.'
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
module.exports = router;