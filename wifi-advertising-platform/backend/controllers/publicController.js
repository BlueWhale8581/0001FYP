// backend/controllers/publicController.js

/**
 * Handles functionality for non-logged-in users including Wi-Fi access, ad viewing, 
 * and registration for different roles.
 */

const WiFiAccessModel = require('../models/WiFiAccess');
const WiFiSettingsModel = require('../models/WiFiSettings');
const AdModel = require('../models/Ad');
const AdImpressionModel = require('../models/AdImpression');
const MerchantModel = require('../models/Merchant');
const QRCodeModel = require('../models/QRCode');
const UserModel = require('../models/User');
const AdvertiserModel = require('../models/Advertiser');
const AgentModel = require('../models/Agent');
const NotificationService = require('../services/notificationService');
const TransactionService = require('../services/transactionService');

const wifiService = require('../services/wifiService');
const adService = require('../services/adService');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const notificationService = require('../services/notificationService');
const auditService = require('../services/auditService');

/**
 * Get Wi-Fi details based on merchant QR code
 */
exports.getWiFiDetails = async (req, res) => {
  try {
    const { qrCodeId } = req.params;
    
    // Validate QR code and get merchant information
    const qrCode = await QRCodeModel.findById(qrCodeId);
    if (!qrCode || qrCode.activation_status !== 'active') {
      return res.status(404).json({ success: false, message: 'Invalid QR code' });
    }
    
    // Get merchant and WiFi settings
    const merchant = await MerchantModel.findWithWiFiSettings(qrCode.merchant_id);
    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found' });
    }
    
    // Return Wi-Fi details excluding sensitive information like password
    return res.status(200).json({
      success: true,
      data: {
        merchantId: merchant.id,
        businessName: merchant.business_name,
        ssid: merchant.wifi_settings.ssid,
        requiresAds: merchant.wifi_settings.ads_before_access,
        termsAndConditions: merchant.wifi_settings.terms_and_conditions,
        sessionDuration: merchant.wifi_settings.session_duration
      }
    });
  } catch (error) {
    console.error('Error getting Wi-Fi details:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Connect to merchant Wi-Fi
 */
exports.connectToWiFi = async (req, res) => {
  try {
    const { merchantId } = req.params;
    const { deviceMac, userAgent, acceptTerms } = req.body;
    
    // Validate request data
    if (!deviceMac || !userAgent || !acceptTerms) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required information or terms not accepted' 
      });
    }
    
    // Check if Wi-Fi settings exist for the merchant
    const wifiSettings = await WiFiSettingsModel.findByMerchantId(merchantId);
    if (!wifiSettings) {
      return res.status(404).json({ success: false, message: 'Wi-Fi not available for this merchant' });
    }
    
    // Check if connection limit is reached
    const isLimitReached = await WiFiSettingsModel.isConnectionLimitReached(merchantId);
    if (isLimitReached) {
      return res.status(429).json({ success: false, message: 'Connection limit reached' });
    }
    
    // Create Wi-Fi session
    const userId = req.user ? req.user.id : null; // If user is logged in
    const ipAddress = req.ip;
    
    const sessionInfo = await wifiService.connectDevice(merchantId, {
      deviceMac,
      userAgent,
      ipAddress,
      userId
    });
    
    // Get ads to view if required
    let adsToView = [];
    if (wifiSettings.ads_before_access) {
      adsToView = await adService.serveAds(merchantId, req.user, {
        deviceMac,
        userAgent,
        ipAddress
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        sessionId: sessionInfo.id,
        requiresAds: wifiSettings.ads_before_access,
        adsToView: adsToView.map(ad => ({
          id: ad.id,
          title: ad.title,
          mediaUrl: ad.media_url,
          type: ad.type,
          duration: ad.duration
        })),
        sessionDuration: wifiSettings.session_duration,
        connectionInfo: {
          ssid: wifiSettings.ssid,
          password: wifiSettings.password // This should be encrypted in a real app
        }
      }
    });
  } catch (error) {
    console.error('Error connecting to Wi-Fi:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Track when an ad starts playing
 */
exports.trackAdView = async (req, res) => {
  try {
    const { sessionId, adId } = req.params;
    
    // Mark ad as started
    await wifiService.recordAdView(sessionId, adId, {
      viewStarted: true,
      startTime: new Date()
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking ad view:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Mark ad as completely viewed
 */
exports.completeAdView = async (req, res) => {
  try {
    const { sessionId, adId } = req.params;
    const { viewDuration } = req.body;
    
    // Find the session
    const session = await WiFiAccessModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    // Record ad view completion
    await wifiService.recordAdView(sessionId, adId, {
      completed: true,
      viewDuration
    });
    
    // Update ads viewed count
    await WiFiAccessModel.updateAdsViewed(sessionId);
    
    // Record ad impression
    const userId = session.user_id;
    const merchantId = session.merchant_id;
    
    await adService.recordImpression(adId, merchantId, userId, {
      viewDuration,
      completed: true,
      deviceInfo: {
        deviceMac: session.device_mac,
        userAgent: session.user_agent,
        ipAddress: session.ip_address
      }
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error completing ad view:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Redirect user after viewing all required ads
 */
exports.redirectAfterAds = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Find the session
    const session = await WiFiAccessModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    // Get merchant and WiFi settings
    const wifiSettings = await WiFiSettingsModel.findByMerchantId(session.merchant_id);
    if (!wifiSettings) {
      return res.status(404).json({ success: false, message: 'WiFi settings not found' });
    }
    
    // Return redirect URL if configured, otherwise return success
    return res.status(200).json({ 
      success: true, 
      redirectUrl: wifiSettings.redirect_url || null,
      sessionDuration: wifiSettings.session_duration
    });
  } catch (error) {
    console.error('Error redirecting after ads:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get ads that need to be viewed
 */
exports.getAdsToView = async (req, res) => {
  try {
    const { merchantId } = req.params;
    
    // Check if merchant requires ads before access
    const wifiSettings = await WiFiSettingsModel.findByMerchantId(merchantId);
    if (!wifiSettings || !wifiSettings.ads_before_access) {
      return res.status(200).json({
        success: true,
        data: {
          requiresAds: false,
          ads: []
        }
      });
    }
    
    // Get ads for the merchant
    const deviceInfo = {
      deviceMac: req.body.deviceMac || 'unknown',
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    };
    
    const ads = await adService.serveAds(merchantId, req.user, deviceInfo);
    
    return res.status(200).json({
      success: true,
      data: {
        requiresAds: true,
        ads: ads.map(ad => ({
          id: ad.id,
          title: ad.title,
          mediaUrl: ad.media_url,
          type: ad.type,
          duration: ad.duration
        }))
      }
    });
  } catch (error) {
    console.error('Error getting ads to view:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Record an ad impression without being connected to Wi-Fi
 */
exports.recordAdImpression = async (req, res) => {
  try {
    const { adId, merchantId } = req.params;
    const { viewDuration, completed } = req.body;
    
    // Validate inputs
    if (!adId || !merchantId || viewDuration === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }
    
    // Record the impression
    const userId = req.user ? req.user.id : null;
    
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    };
    
    await adService.recordImpression(adId, merchantId, userId, {
      viewDuration,
      completed: completed || false,
      deviceInfo
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error recording ad impression:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Register as an advertiser
 */
exports.registerAsAdvertiser = async (req, res) => {
  try {
    const { 
      username, email, password, firstName, lastName, phone,
      companyName, companyAddress, companyPhone, companyEmail, industry
    } = req.body;
    
    // Validate required fields
    if (!username || !email || !password || !companyName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required information' 
      });
    }
    
    // Register user
    const userData = {
      username,
      email,
      password,
      role: 'advertiser',
      first_name: firstName,
      last_name: lastName,
      phone,
      status: 'pending' // Requires admin approval
    };
    
    const newUser = await authService.register(userData, 'advertiser');
    
    // Create advertiser profile
    const advertiserData = {
      user_id: newUser.id,
      company_name: companyName,
      company_address: companyAddress,
      company_phone: companyPhone || phone,
      company_email: companyEmail || email,
      industry
    };
    
    await AdvertiserModel.create(advertiserData);
    
    // Notify admins
    await notificationService.notifyUsersByRole('admin', 
      'New Advertiser Registration', 
      `${companyName} has registered as an advertiser`
    );
    
    // Send welcome email
    await emailService.sendWelcomeEmail(newUser);
    
    // Log the registration
    await auditService.logActivity({
      action: 'user_registration',
      entityType: 'user',
      entityId: newUser.id,
      values: { role: 'advertiser' },
      ipAddress: req.ip
    });
    
    return res.status(201).json({
      success: true,
      message: 'Advertiser registration successful',
      userId: newUser.id
    });
  } catch (error) {
    console.error('Error registering advertiser:', error);
    if (error.code === 'DUPLICATE_ENTRY') {
      return res.status(409).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Register as a merchant
 */
exports.registerAsMerchant = async (req, res) => {
  try {
    const { 
      username, email, password, firstName, lastName, phone,
      businessName, businessAddress, businessPhone, businessEmail, 
      businessCategory, taxId, agentId
    } = req.body;
    
    // Validate required fields
    if (!username || !email || !password || !businessName || !businessAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required information' 
      });
    }
    
    // Validate agent if provided
    if (agentId) {
      const agent = await AgentModel.findByUserId(agentId);
      if (!agent) {
        return res.status(404).json({ success: false, message: 'Invalid agent ID' });
      }
    }
    
    // Register user
    const userData = {
      username,
      email,
      password,
      role: 'merchant',
      first_name: firstName,
      last_name: lastName,
      phone,
      status: 'pending' // Requires approval
    };
    
    const newUser = await authService.register(userData, 'merchant');
    
    // Create merchant profile
    const merchantData = {
      user_id: newUser.id,
      business_name: businessName,
      business_address: businessAddress,
      business_phone: businessPhone || phone,
      business_email: businessEmail || email,
      business_category: businessCategory,
      tax_id: taxId,
      agent_id: agentId,
      approval_status: 'pending'
    };
    
    const merchant = await MerchantModel.create(merchantData);
    
    // Initialize default WiFi settings
    await wifiService.initializeWiFiSettings(merchant.id, {
      ssid: `${businessName.replace(/\s+/g, '-')}-WiFi`, // Create default SSID
      password: Math.random().toString(36).substring(2, 10), // Random password
      connection_limit: 50,
      session_duration: 60,
      ads_before_access: true
    });
    
    // Notify admins and agent
    await notificationService.notifyUsersByRole('admin', 
      'New Merchant Registration', 
      `${businessName} has registered as a merchant`
    );
    
    if (agentId) {
      await notificationService.createNotification(
        agentId,
        'New Merchant Registration',
        `${businessName} has registered as a merchant under your agency`,
        'info'
      );
    }
    
    // Send welcome email
    await emailService.sendWelcomeEmail(newUser);
    
    // Log the registration
    await auditService.logActivity({
      action: 'user_registration',
      entityType: 'user',
      entityId: newUser.id,
      values: { role: 'merchant' },
      ipAddress: req.ip
    });
    
    return res.status(201).json({
      success: true,
      message: 'Merchant registration successful. Your account is pending approval.',
      userId: newUser.id,
      merchantId: merchant.id
    });
  } catch (error) {
    console.error('Error registering merchant:', error);
    if (error.code === 'DUPLICATE_ENTRY') {
      return res.status(409).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Register as an agent
 */
exports.registerAsAgent = async (req, res) => {
  try {
    const { 
      username, email, password, firstName, lastName, phone,
      territory
    } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required information' 
      });
    }
    
    // Register user
    const userData = {
      username,
      email,
      password,
      role: 'agent',
      first_name: firstName,
      last_name: lastName,
      phone,
      status: 'pending' // Requires admin approval
    };
    
    const newUser = await authService.register(userData, 'agent');
    
    // Create agent profile
    const agentData = {
      user_id: newUser.id,
      commission_rate: 0.00, // Default commission rate, will be set by admin
      territory: territory
    };
    
    await AgentModel.create(agentData);
    
    // Notify admins
    await notificationService.notifyUsersByRole('admin', 
      'New Agent Registration', 
      `${firstName} ${lastName} has registered as an agent`
    );
    
    // Send welcome email
    await emailService.sendWelcomeEmail(newUser);
    
    // Log the registration
    await auditService.logActivity({
      action: 'user_registration',
      entityType: 'user',
      entityId: newUser.id,
      values: { role: 'agent' },
      ipAddress: req.ip
    });
    
    return res.status(201).json({
      success: true,
      message: 'Agent registration successful. Your account is pending approval.',
      userId: newUser.id
    });
  } catch (error) {
    console.error('Error registering agent:', error);
    if (error.code === 'DUPLICATE_ENTRY') {
      return res.status(409).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get user dashboard data
 * @route   GET /api/user/dashboard
 * @access  Private (Any logged-in user)
 */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from the token by the verifyToken middleware

    // Use DashboardService to get comprehensive dashboard data for the user
    const dashboardData = await DashboardService.getUserDashboard(userId);

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user profile information
 * @route   GET /api/user/profile
 * @access  Private (Any logged-in user)
 */
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
};

/**
 * @desc    Update user profile information
 * @route   PUT /api/user/profile
 * @access  Private (Any logged-in user)
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to update user profile' });
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/user/password
 * @access  Private (Any logged-in user)
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findById(userId);
    if (!user || !(await user.comparePassword(oldPassword))) {
      return res.status(400).json({ success: false, message: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};

/**
 * @desc    Get user notifications
 * @route   GET /api/user/notifications
 * @access  Private (Any logged-in user)
 */
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await NotificationService.getNotificationsForUser(userId);
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/user/notifications/:id/read
 * @access  Private (Any logged-in user)
 */
exports.markNotificationRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const updatedNotification = await NotificationService.markAsRead(notificationId);
    if (!updatedNotification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/user/notifications/read-all
 * @access  Private (Any logged-in user)
 */
exports.markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await NotificationService.markAllAsRead(userId);
    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ success: false, message: 'Failed to mark all notifications as read' });
  }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/user/notifications/:id
 * @access  Private (Any logged-in user)
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const deletedNotification = await NotificationService.deleteNotification(notificationId);
    if (!deletedNotification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
};

/**
 * @desc    Get user transaction history
 * @route   GET /api/user/transactions
 * @access  Private (Any logged-in user)
 */
exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await TransactionService.getTransactionsForUser(userId);
    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
};

/**
 * @desc    Get specific transaction details
 * @route   GET /api/user/transactions/:id
 * @access  Private (Any logged-in user)
 */
exports.getTransactionDetails = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const transaction = await TransactionService.getTransactionById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    return res.status(200).json({ success: true, transaction });
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch transaction details' });
  }
};

/**
 * @desc    Update user settings and preferences
 * @route   PUT /api/user/settings
 * @access  Private (Any logged-in user)
 */
exports.updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;

    // Update user settings in the database
    const updatedSettings = await UserModel.findByIdAndUpdate(
      userId,
      { settings },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings: updatedSettings.settings,
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user settings',
      error: error.message,
    });
  }
};

/**
 * @desc    Submit user feedback
 * @route   POST /api/user/feedback
 * @access  Private (Any logged-in user)
 */
exports.submitFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { feedback } = req.body;

    if (!feedback || feedback.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Feedback cannot be empty',
      });
    }

    // Save feedback to the database or send it to a service
    await FeedbackService.saveFeedback({ userId, feedback });

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message,
    });
  }
};

module.exports = exports;