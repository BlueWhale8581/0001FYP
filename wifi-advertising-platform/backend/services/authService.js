// backend/services/authService.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/auth');
const Merchant = require('../models/Merchant');
const Advertiser = require('../models/Advertiser');
const Agent = require('../models/Agent');

/**
 * AuthService handles authentication-related business logic
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user object
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const existingUsername = await User.findByUsername(userData.username);
      if (existingUsername) {
        throw new Error('Username is already taken');
      }

      // Create the user
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
      });

      // Remove the password from the returned user object
      const userResponse = { ...user };
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login a user with email/username and password
   * @param {string} identifier - Email or username
   * @param {string} password - User's password
   * @returns {Object} User and token
   */
  async login(identifier, password) {
    try {
      // Check if identifier is an email or username
      const user = identifier.includes('@')
        ? await User.findByEmail(identifier)
        : await User.findByUsername(identifier);

      if (!user) {
        throw new Error('This email or username is not registered');
      }

      // Check if user is active
      if (user.status !== 'Active') {
        throw new Error('Account is not active. Please contact support.');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await User.update(user.id, { last_login: new Date() });

      // Generate JWT token
      const token = config.generateToken(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        '1h'
      );

      // Remove password from response
      const userResponse = { ...user };
      delete userResponse.password;

      return {
        user: userResponse,
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Verify token and get user data
   * @param {string} token - JWT token
   * @returns {Promise<Object>} User data
   */
  async verifyToken(token) {
    try {
      const decoded = config.verifyToken(token);
      const user = await User.findById(decoded.id);

      if (!user) {
        throw new Error('User not found');
      }

      // Remove password from response
      const userResponse = { ...user };
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset token info
   */
  async requestPasswordReset(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('User not found with this email');
      }

      // Generate reset token (expires in 1 hour)
      const resetToken = config.generateToken(
        { id: user.id, action: 'reset_password' },
        process.env.JWT_SECRET,
        '1h'
      );

      return {
        userId: user.id,
        email: user.email,
        resetToken
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password using token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async resetPassword(token, newPassword) {
    try {
      const decoded = config.verifyToken(token);
      
      if (!decoded || decoded.action !== 'reset_password') {
        throw new Error('Invalid or expired reset token');
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await User.updatePassword(user.id, hashedPassword);

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   * @param {number} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await User.updatePassword(userId, hashedPassword);

      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();