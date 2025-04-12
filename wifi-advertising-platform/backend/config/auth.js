//backend/config/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Token verification function
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
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
  verifyToken,
  authorizeRole
};
