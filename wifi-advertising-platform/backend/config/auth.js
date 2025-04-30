//backend/config/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Generate a JWT token
 * @param {Object} payload - Data to encode in the token
 * @param {string} expiresIn - Token expiration time (e.g., '1h', '7d')
 * @returns {string} Signed JWT token
 */
function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT token
 * @param {string} token - Token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If the token is invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Role-based authorization middleware
function authorizeRole(allowedRole) {
  return (req, res, next) => {
    // Check if user exists and has the correct role
    if (!req.user || req.user.role !== allowedRole) {
      return res.status(403).render('error', { 
        message: 'Access denied', 
        error: { status: 403, stack: '' } 
      });
    }
    next();
  };
}

module.exports = {
  generateToken,
  verifyToken,
  authorizeRole
};
