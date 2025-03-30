const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { testConnection } = require('./config/database');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const agentRoutes = require('./routes/agent');
const advertiserRoutes = require('./routes/advertiser');
const merchantRoutes = require('./routes/merchant');
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin resource sharing
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // HTTP request logger

// Test database connection
testConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/advertiser', advertiserRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;