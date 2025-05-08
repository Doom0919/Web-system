const express = require('express');
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'someVerySecretKeyThatIsHardToGuess';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'someVerySecretKeyThatIsHardToGuess';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'; // e.g., 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'; // e.g., 7 days

// This is a demo store for refresh tokens (for production use a DB)
let refreshTokensStore = [];

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
    // Create tokens
    const accessToken = jwt.sign(
      { userId: existingUser._id },
       ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
        REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
    refreshTokensStore.push(refreshToken);
    
    res.status(200).json({
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      tokenType: 'Bearer'
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.' });
  }
});

// Endpoint to get the logged-in user's ID
router.get('/loginu', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from the decoded token
    res.json({ userId });
    console.log('User ID:', userId); // Log the userId for debugging
  } catch (err) {
    console.error('Error fetching user ID:', err);
    res.status(500).json({ message: 'Failed to fetch user ID.' });
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
    // Use the same ACCESS_TOKEN_SECRET as everywhere else
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
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

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required.' });
  }
  if (!refreshTokensStore.includes(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token.' });
  }
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }
    const newAccessToken = jwt.sign(
      { userId: userData.userId, email: userData.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
    res.status(200).json({
      accessToken: newAccessToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      tokenType: 'Bearer'
    });
  });
});

module.exports = router;