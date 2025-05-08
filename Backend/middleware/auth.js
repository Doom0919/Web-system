const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'someVerySecretKeyThatIsHardToGuess';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Access token is missing or invalid.' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Access token is expired or invalid.' });
    }
    console.log('Decoded user:', user); 
    req.user = user; 
    next();
  });
}

module.exports = { authenticateToken };