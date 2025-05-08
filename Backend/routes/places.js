const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const Place = require('../models/Place');
const router = express.Router();

// Get all places for a user
router.get('/user/:uid', async (req, res) => {
  const userId = req.params.uid;
  console.log('GET /api/places/user/:uid userId:', userId);
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid or missing user ID.' });
  }

  try {
    const places = await Place.find({ creator: userId });
    res.json({ places });
  } catch (err) {
    console.error('Error fetching places:', err);
    res.status(500).json({ message: `Fetching places failed for user ID: ${userId}` });
  }
});

// Get place by ID
router.get('/:pid', async (req, res) => {
  const placeId = req.params.pid;
  if (!mongoose.Types.ObjectId.isValid(placeId)) {
    return res.status(400).json({ message: 'Invalid place ID format.' });
  }

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found.' });
    }
    res.json({ place });
  } catch (err) {
    res.status(500).json({ message: 'Fetching place failed.' });
  }
});

// Test authentication
router.get('/test-auth', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Create a new place
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, imgLink, location, loc_x, loc_y } = req.body;
  console.log('POST /api/places req.body:', req.body);

  const creator = req.user.userId; // Ensure req.user.userId is populated by authenticateToken
  if (!creator) {
    return res.status(400).json({ message: 'Creator ID is missing.' });
  }

  try {
    const newPlace = new Place({ title, description, location, loc_x, loc_y, imgLink, creator });
    await newPlace.save();
    res.status(201).json({ place: newPlace });
  } catch (err) {
    console.error('Error creating place:', err);
    res.status(500).json({ message: 'Creating place failed.' });
  }
});

router.patch('/:pid', async (req, res) => {
  const { title, description, location, loc_x, loc_y, imgLink } = req.body;
  
  try {
    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.pid,
      { title, description, location, loc_x, loc_y, imgLink },
      { new: true }
    );
    if (!updatedPlace) {
      return res.status(404).json({ message: 'Place not found.' });
    }
    res.json({ place: updatedPlace });
  } catch (err) {
    res.status(500).json({ message: 'Updating place failed.' });
  }
});

router.delete('/:pid', async (req, res) => {
  const placeId = req.params.pid;

  try {
    const deletedPlace = await Place.findByIdAndDelete(placeId);
    if (!deletedPlace) {
      return res.status(404).json({ message: 'Place not found.' });
    }

    res.json({ message: 'Place deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting place failed.' });
  }
});

module.exports = router;