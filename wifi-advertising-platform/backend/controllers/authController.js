// backend/controllers/authController.js

const AuthService = require('../services/authService');
const UserModel = require('../models/User');
const NotificationService = require('../services/notificationService');
const AuditService = require('../services/auditService');
const jwt = require('jsonwebtoken');
const config = require('../config/auth');

/**
 * User registration controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.register = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email) || await UserModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email or username already exists' 
      });
    }
    
    // Register user using AuthService
    const result = await AuthService.register(
      { email, username, password, first_name: firstName, last_name: lastName, phone, role },
      role
    );
    
    // Log the registration
    await AuditService.logCreation({
      userId: result.user.id,
      entityType: 'user',
      entityId: result.user.id,
      values: { username, email, role },
      ipAddress: req.ip
    });
    
    // Create welcome notification
    await NotificationService.createNotification(
      result.user.id,
      'Welcome to the platform',
      `Thank you for registering as a ${role}. Complete your profile to get started.`,
      'info'
    );
    
    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      userId: result.user.id,
      token: result.token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Registration failed',
      error: error.message 
    });
  }
};

/**
 * User login controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    // Authenticate user
    const result = await AuthService.login(emailOrUsername, password);
    
    if (!result.success) {
      // Log failed login attempt
      await AuditService.logLoginAttempt({
        username: emailOrUsername,
        success: false,
        ipAddress: req.ip
      });
      
      return res.status(401).json({ 
        success: false, 
        message: result.message || 'Invalid credentials' 
      });
    }
    
    // Update last login timestamp
    await UserModel.update(result.user.id, { last_login: new Date() });
    
    // Log successful login
    await AuditService.logLoginAttempt({
      userId: result.user.id,
      username: emailOrUsername,
      success: true,
      ipAddress: req.ip
    });
    
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
        firstName: result.user.first_name,
        lastName: result.user.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Login failed',
      error: error.message 
    });
  }
};

/**
 * User logout controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.logout = async (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    // If user ID is available from request (auth middleware adds user), log the logout
    if (req.user && req.user.id) {
      await AuditService.logActivity({
        userId: req.user.id,
        action: 'logout',
        entityType: 'user',
        entityId: req.user.id,
        ipAddress: req.ip
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Logout failed',
      error: error.message 
    });
  }
};

/**
 * Email verification controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify the token
    const decoded = await config.verifyToken(token, process.env.EMAIL_VERIFICATION_SECRET);
    
    if (!decoded || !decoded.userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
    
    // Update user status to active
    const user = await UserModel.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.status === 'active') {
      return res.status(200).json({
        success: true,
        message: 'Email already verified'
      });
    }
    
    await UserModel.update(decoded.userId, { status: 'active' });
    
    // Log the verification
    await AuditService.logActivity({
      userId: decoded.userId,
      action: 'email_verification',
      entityType: 'user',
      entityId: decoded.userId,
      ipAddress: req.ip
    });
    
    // Create notification
    await NotificationService.createNotification(
      decoded.userId,
      'Email Verified',
      'Your email has been successfully verified. You can now access all platform features.',
      'success'
    );
    
    return res.status(200).json({
      success: true,
      message: 'Email verification successful'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Email verification failed',
      error: error.message 
    });
  }
};

/**
 * Forgot password controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Request password reset through AuthService
    const result = await AuthService.requestPasswordReset(email);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
    // For security reasons, always return success even if email doesn't exist
    return res.status(200).json({
      success: true,
      message: 'If the email exists in our system, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    // For security reasons, don't expose the error
    return res.status(200).json({ 
      success: true, 
      message: 'If the email exists in our system, a password reset link has been sent'
    });
  }
};

/**
 * Reset password controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Reset password through AuthService
    const result = await AuthService.resetPassword(token, newPassword);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Password reset failed'
      });
    }
    
    // Log the password reset
    await AuditService.logPasswordChange({
      userId: result.userId,
      ipAddress: req.ip
    });
    
    // Notify user
    await NotificationService.createNotification(
      result.userId,
      'Password Changed',
      'Your password has been successfully reset.',
      'info'
    );
    
    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Password reset failed',
      error: error.message 
    });
  }
};

/**
 * Refresh token controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found'
      });
    }
    
    // Verify refresh token
    const decoded = await config.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    if (!decoded || !decoded.userId) {
      // Clear invalid refresh token
      res.clearCookie('refreshToken');
      
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
    
    // Get user data
    const user = await UserModel.findById(decoded.userId);
    
    if (!user || user.status !== 'active') {
      // Clear refresh token if user not found or inactive
      res.clearCookie('refreshToken');
      
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    // Generate new tokens
    const token = config.generateToken(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      '1h' // Short-lived access token
    );
    
    const newRefreshToken = config.generateToken(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      '7d' // Longer-lived refresh token
    );
    
    // Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Token refresh failed',
      error: error.message 
    });
  }
};

/**
 * Change password controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { currentPassword, newPassword } = req.body;
    
    // Change password through AuthService
    const result = await AuthService.changePassword(userId, currentPassword, newPassword);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Password change failed'
      });
    }
    
    // Log the password change
    await AuditService.logPasswordChange({
      userId: userId,
      ipAddress: req.ip
    });
    
    // Notify user
    await NotificationService.createNotification(
      userId,
      'Password Changed',
      'Your password has been successfully changed.',
      'info'
    );
    
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Password change failed',
      error: error.message 
    });
  }
};

/**
 * Get user profile controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    // Get user profile data
    const profileData = await UserModel.getProfileData(userId);
    
    if (!profileData) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      profile: profileData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve profile',
      error: error.message 
    });
  }
};

/**
 * Update user profile controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { firstName, lastName, phone } = req.body;
    
    // Get current user data for audit log
    const currentUser = await UserModel.findById(userId);
    
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prepare update data
    const updateData = {
      first_name: firstName,
      last_name: lastName,
      phone: phone
    };
    
    // Update user profile
    await UserModel.update(userId, updateData);
    
    // Log the profile update
    await AuditService.logUpdate({
      userId: userId,
      entityType: 'user',
      entityId: userId,
      oldValues: {
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        phone: currentUser.phone
      },
      newValues: updateData,
      ipAddress: req.ip
    });
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        ...currentUser,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile',
      error: error.message 
    });
  }
};

module.exports = exports;