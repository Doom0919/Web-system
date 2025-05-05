const express = require('express');
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Fetching users failed.' });
  }
});

// Create a new user
router.post('/signup', [
  check('name').not().isEmpty(),
  check('email').isEmail(),
  check('password').isLength({ min: 6 })
], async (req, res) => {
  const { name, email, password, imgLink } = req.body;
  try {
    const newUser = new User({ name, email, password, imgLink });
    await newUser.save();
    res.status(201).json({ user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Creating user failed.' });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser || existingUser.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    res.status(200).json({
      userId: existingUser._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.' });
  }
});

// Authentication route to verify user token
router.get('/auth', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, 'your_jwt_secret_key'); // Replace with a secure key in production
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      u_id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

module.exports = router;