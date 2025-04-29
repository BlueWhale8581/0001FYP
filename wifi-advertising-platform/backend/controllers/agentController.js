//backend/controllers/agentController.js
const Agent = require('../models/Agent');
const Merchant = require('../models/Merchant');
const QRCode = require('../models/QRCode');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Notification = require('../models/Notification');
const WiFiSettings = require('../models/WiFiSettings');

const qrCodeService = require('../services/qrCodeService');
const dashboardService = require('../services/dashboardService');
const notificationService = require('../services/notificationService');
const auditService = require('../services/auditService');
const transactionService = require('../services/transactionService');
const reportingService = require('../services/reportingService');

/**
 * Get dashboard statistics for the agent
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const agentId = req.user.id; // From auth middleware
    const dashboardData = await dashboardService.getAgentDashboard(agentId);
    
    return res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching agent dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

exports.getNotifications = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Unauthorized access' });
        }

        const { limit = 10, page = 1 } = req.query;
        const offset = (page - 1) * limit;

        const notifications = await Notification.getByUserId(req.user.id, { limit, offset });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({ message: 'Error retrieving notifications' });
    }
};

/**
 * Get merchants onboarded by agent
 */
exports.getMerchantsOnboarded = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    
    const merchants = await Merchant.findByAgentId(agentId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status: status
    });
    
    const total = await Merchant.countByStatus({ agentId });
    
    return res.status(200).json({
      success: true,
      data: merchants,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching merchants:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch merchants',
      error: error.message
    });
  }
};

/**
 * Get commissions for the agent
 */
exports.getCommissions = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;
    
    const commissions = await Transaction.findByAgentId(agentId, {
      type: 'agent_commission',
      startDate,
      endDate,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    // Calculate total earnings in the period
    const commissionStats = await reportingService.generateAgentPerformanceReport({
      agentId,
      startDate,
      endDate,
      metrics: ['total_commission', 'merchants_count']
    });
    
    return res.status(200).json({
      success: true,
      data: commissions,
      stats: commissionStats
    });
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch commission data',
      error: error.message
    });
  }
};

/**
 * Get agent notifications
 */
exports.getAgentNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, unreadOnly = false } = req.query;
    
    const notifications = await Notification.getByUserId(userId, {
      unreadOnly: unreadOnly === 'true',
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    const unreadCount = await Notification.getUnreadCount(userId);
    
    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

/**
 * Get all merchants
 */
exports.getAllMerchants = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { page = 1, limit = 10, search, status } = req.query;
    
    const merchants = await Merchant.findByAgentId(agentId, {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      status
    });
    
    const total = await Merchant.countByStatus({ agentId, status });
    
    return res.status(200).json({
      success: true,
      data: merchants,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching merchants:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch merchants',
      error: error.message
    });
  }
};

/**
 * Get merchant by ID
 */
exports.getMerchantById = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { merchantId } = req.params;
    
    // Verify the merchant belongs to this agent
    const merchant = await Merchant.findById(merchantId);
    
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }
    
    if (merchant.agent_id !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this merchant'
      });
    }
    
    // Get merchant with associated WiFi settings and user data
    const merchantWithDetails = await Merchant.findWithWiFiSettings(merchantId);
    
    return res.status(200).json({
      success: true,
      data: merchantWithDetails
    });
  } catch (error) {
    console.error('Error fetching merchant details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch merchant details',
      error: error.message
    });
  }
};

/**
 * Register a new merchant
 */
exports.registerMerchant = async (req, res) => {
  try {
    const agentId = req.user.id;
    const merchantData = req.body;
    
    // First create user account for merchant with merchant role
    const userData = {
      username: merchantData.username,
      email: merchantData.email,
      password: merchantData.password,
      role: 'merchant',
      first_name: merchantData.first_name,
      last_name: merchantData.last_name,
      phone: merchantData.phone,
      status: 'Active'
    };
    
    // Create user
    const newUser = await User.create(userData);
    
    // Now create merchant profile
    const merchantProfile = {
      user_id: newUser.id,
      business_name: merchantData.business_name,
      business_address: merchantData.business_address,
      business_phone: merchantData.business_phone || merchantData.phone,
      business_email: merchantData.business_email || merchantData.email,
      business_category: merchantData.business_category,
      tax_id: merchantData.tax_id,
      logo_url: null, // Will be updated later
      agent_id: agentId,
      approval_status: 'pending'
    };
    
    const newMerchant = await Merchant.create(merchantProfile);
    
    // Initialize default WiFi settings
    await WiFiSettings.create({
      merchant_id: newMerchant.id,
      ssid: `${merchantData.business_name.replace(/\s+/g, '_')}_WiFi`,
      password: '',
      connection_limit: 50,
      session_duration: 60,
      ads_before_access: true,
      redirect_url: null,
      terms_and_conditions: 'Standard terms and conditions apply.'
    });
    
    // Log this action
    await auditService.logCreation({
      userId: agentId,
      entityType: 'merchant',
      entityId: newMerchant.id,
      values: merchantProfile,
      ipAddress: req.ip
    });
    
    // Create notification for admin to review merchant
    await notificationService.notifyUsersByRole('admin', 
      'New Merchant Registration', 
      `Agent ${req.user.username} has registered a new merchant: ${merchantData.business_name}. Please review.`,
      'info'
    );
    
    return res.status(201).json({
      success: true,
      data: {
        merchant: newMerchant,
        message: 'Merchant registered successfully and pending admin approval'
      }
    });
  } catch (error) {
    console.error('Error registering merchant:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register merchant',
      error: error.message
    });
  }
};

/**
 * Update merchant details
 */
exports.updateMerchant = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { merchantId } = req.params;
    const updateData = req.body;
    
    // Verify the merchant belongs to this agent
    const merchant = await Merchant.findById(merchantId);
    
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }
    
    if (merchant.agent_id !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this merchant'
      });
    }
    
    // Capture old values for audit
    const oldValues = { ...merchant };
    
    // Update merchant profile
    const updatedMerchant = await Merchant.update(merchantId, updateData);
    
    // If user data needs to be updated
    if (updateData.user_data) {
      await User.update(merchant.user_id, updateData.user_data);
    }
    
    // Log this action
    await auditService.logUpdate({
      userId: agentId,
      entityType: 'merchant',
      entityId: merchantId,
      oldValues,
      newValues: updatedMerchant,
      ipAddress: req.ip
    });
    
    return res.status(200).json({
      success: true,
      data: updatedMerchant,
      message: 'Merchant updated successfully'
    });
  } catch (error) {
    console.error('Error updating merchant:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update merchant',
      error: error.message
    });
  }
};

/**
 * Approve merchant application (change status only)
 */
exports.approveMerchantApplication = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { merchantId } = req.params;
    
    // Verify the merchant belongs to this agent
    const merchant = await Merchant.findById(merchantId);
    
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }
    
    if (merchant.agent_id !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to approve this merchant'
      });
    }
    
    // Update merchant status
    const updatedMerchant = await Merchant.updateApprovalStatus(merchantId, 'approved');
    
    // Update user status to active
    await User.update(merchant.user_id, { status: 'active' });
    
    // Log this action
    await auditService.logStatusChange({
      userId: agentId,
      entityType: 'merchant',
      entityId: merchantId,
      oldStatus: merchant.approval_status,
      newStatus: 'approved',
      ipAddress: req.ip
    });
    
    // Create notification for the merchant
    await notificationService.createNotification(
      merchant.user_id,
      'Application Approved',
      'Your merchant application has been approved. You can now start setting up your WiFi.',
      'success'
    );
    
    return res.status(200).json({
      success: true,
      data: updatedMerchant,
      message: 'Merchant application approved successfully'
    });
  } catch (error) {
    console.error('Error approving merchant application:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to approve merchant application',
      error: error.message
    });
  }
};

/**
 * Reject merchant application
 */
exports.rejectMerchantApplication = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { merchantId } = req.params;
    const { rejectionReason } = req.body;
    
    // Verify the merchant belongs to this agent
    const merchant = await Merchant.findById(merchantId);
    
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }
    
    if (merchant.agent_id !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reject this merchant'
      });
    }
    
    // Update merchant status
    const updatedMerchant = await Merchant.updateApprovalStatus(merchantId, 'rejected');
    
    // Update user status
    await User.update(merchant.user_id, { status: 'inactive' });
    
    // Log this action
    await auditService.logStatusChange({
      userId: agentId,
      entityType: 'merchant',
      entityId: merchantId,
      oldStatus: merchant.approval_status,
      newStatus: 'rejected',
      ipAddress: req.ip
    });
    
    // Create notification for the merchant
    await notificationService.createNotification(
      merchant.user_id,
      'Application Rejected',
      `Your merchant application has been rejected. Reason: ${rejectionReason || 'Not specified'}`,
      'error'
    );
    
    return res.status(200).json({
      success: true,
      data: updatedMerchant,
      message: 'Merchant application rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting merchant application:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject merchant application',
      error: error.message
    });
  }
};

/**
 * Generate QR code for merchant
 */
exports.generateQRCode = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { merchantId } = req.params;
    
    // Verify the merchant belongs to this agent
    const merchant = await Merchant.findById(merchantId);
    
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }
    
    if (merchant.agent_id !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to generate QR code for this merchant'
      });
    }
    
    // Generate QR code
    const newQRCode = await qrCodeService.generateQRCode(merchantId, agentId);
    
    // Log this action
    await auditService.logCreation({
      userId: agentId,
      entityType: 'qr_code',
      entityId: newQRCode.id,
      values: { merchant_id: merchantId },
      ipAddress: req.ip
    });
    
    // Create notification for the merchant
    await notificationService.createNotification(
      merchant.user_id,
      'QR Code Generated',
      'A new QR code has been generated for your business.',
      'info'
    );
    
    return res.status(201).json({
      success: true,
      data: newQRCode,
      message: 'QR code generated successfully'
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    });
  }
};

/**
 * Regenerate QR code for merchant
 */
exports.regenerateQRCode = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { merchantId } = req.params;
    
    // Verify the merchant belongs to this agent
    const merchant = await Merchant.findById(merchantId);
    
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }
    
    if (merchant.agent_id !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to regenerate QR code for this merchant'
      });
    }
    
    // Deactivate existing QR codes
    await qrCodeService.deactivateExistingQRCodes(merchantId);
    
    // Generate new QR code
    const newQRCode = await qrCodeService.generateQRCode(merchantId, agentId);
    
    // Log this action
    await auditService.logCreation({
      userId: agentId,
      entityType: 'qr_code',
      entityId: newQRCode.id,
      values: { merchant_id: merchantId, regenerated: true },
      ipAddress: req.ip
    });
    
    // Create notification for the merchant
    await notificationService.createNotification(
      merchant.user_id,
      'QR Code Regenerated',
      'Your QR code has been regenerated. Previous QR codes are now inactive.',
      'info'
    );
    
    return res.status(201).json({
      success: true,
      data: newQRCode,
      message: 'QR code regenerated successfully'
    });
  } catch (error) {
    console.error('Error regenerating QR code:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to regenerate QR code',
      error: error.message
    });
  }
};

/**
 * Download QR code
 */
exports.downloadQRCode = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { qrCodeId } = req.params;
    
    // Verify the QR code belongs to a merchant managed by this agent
    const qrCode = await QRCode.findById(qrCodeId);
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found'
      });
    }
    
    const merchant = await Merchant.findById(qrCode.merchant_id);
    
    if (merchant.agent_id !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to download this QR code'
      });
    }
    
    // The QR code image URL is stored in the database
    return res.status(200).json({
      success: true,
      data: {
        url: qrCode.code_image_url,
        merchant: merchant.business_name
      }
    });
  } catch (error) {
    console.error('Error downloading QR code:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to download QR code',
      error: error.message
    });
  }
};

/**
 * Get QR codes by merchant
 */
exports.getQRCodesByMerchant = async (req, res) => {
  try {
    const { merchantId } = req.params;

    // Debugging: Log the merchantId
    console.log('Received merchantId:', merchantId);

    // Validate the merchantId
    if (!merchantId || isNaN(Number(merchantId))) {
      console.error('Invalid merchantId:', merchantId);
      return res.status(400).json({ error: "Invalid 'merchantId' parameter. It must be a valid number." });
    }

    // Proceed with fetching QR codes
    const qrCodes = await QRCode.findByMerchantId(Number(merchantId));
    return res.status(200).json({ success: true, data: qrCodes });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
};

/**
 * Get all QR codes created by the agent
 */
exports.getAllQRCodes = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    
    const qrCodes = await QRCode.findByAgentId(agentId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status
    });
    
    return res.status(200).json({
      success: true,
      data: qrCodes
    });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch QR codes',
      error: error.message
    });
  }
};

/**
 * Get commission reports
 */
exports.getCommissionReports = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    // Generate agent performance report
    const reportData = await reportingService.generateAgentPerformanceReport({
      agentId,
      startDate,
      endDate,
      groupBy
    });
    
    return res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('Error generating commission report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate commission report',
      error: error.message
    });
  }
};

/**
 * Get transaction history
 */
exports.getTransactionHistory = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { startDate, endDate, page = 1, limit = 10, type } = req.query;
    
    const transactions = await Transaction.findByAgentId(agentId, {
      startDate,
      endDate,
      page: parseInt(page),
      limit: parseInt(limit),
      type
    });
    
    return res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history',
      error: error.message
    });
  }
};

/**
 * Get earnings summary
 */
exports.getEarningsSummary = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { period = 'month' } = req.query;
    
    // Calculate start and end dates based on period
    let startDate, endDate = new Date();
    const now = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    // Get revenue summary
    const summary = await Transaction.getRevenueSummary({
      agentId,
      startDate,
      endDate,
      groupBy: period === 'week' ? 'day' : period === 'month' ? 'day' : 'month'
    });
    
    return res.status(200).json({
      success: true,
      data: summary,
      period
    });
  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch earnings summary',
      error: error.message
    });
  }
};

/**
 * Get commission by period
 */
exports.getCommissionByPeriod = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { startDate, endDate, groupBy = 'month' } = req.query;
    
    // Get agent commission data
    const commissionData = await Transaction.getRevenueSummary({
      agentId,
      type: 'agent_commission',
      startDate,
      endDate,
      groupBy
    });
    
    return res.status(200).json({
      success: true,
      data: commissionData
    });
  } catch (error) {
    console.error('Error fetching commission by period:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch commission data',
      error: error.message
    });
  }
};

/**
 * Get agent profile
 */
exports.getAgentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get agent data with user information
    const agent = await Agent.findWithUserData(userId);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent profile not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error('Error fetching agent profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch agent profile',
      error: error.message
    });
  }
};

/**
 * Update agent profile
 */
exports.updateAgentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const agentData = req.body;
    
    // Update user data
    if (agentData.userData) {
      const userData = agentData.userData;
      delete agentData.userData;
      
      await User.update(userId, userData);
    }
    
    // Update agent-specific data
    const agent = await Agent.findByUserId(userId);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent profile not found'
      });
    }
    
    const updatedAgent = await Agent.update(agent.id, agentData);
    
    // Log this update
    await auditService.logUpdate({
      userId,
      entityType: 'agent',
      entityId: agent.id,
      oldValues: agent,
      newValues: updatedAgent,
      ipAddress: req.ip
    });
    
    // Get updated profile with user data
    const completeProfile = await Agent.findWithUserData(userId);
    
    return res.status(200).json({
      success: true,
      data: completeProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating agent profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update agent profile',
      error: error.message
    });
  }
};

/**
 * Get help resources
 */
exports.getHelpResources = async (req, res) => {
  try {
    // This could fetch help resources from a CMS or database
    // For now, returning static resources
    const helpResources = [
      {
        id: 1,
        title: 'Agent Onboarding Guide',
        description: 'Learn how to onboard merchants effectively',
        url: '/resources/agent-onboarding-guide'
      },
      {
        id: 2,
        title: 'QR Code Management',
        description: 'Step-by-step guide to manage QR codes',
        url: '/resources/qr-code-management'
      },
      {
        id: 3,
        title: 'Commission Structure',
        description: 'Understanding your commission structure',
        url: '/resources/commission-structure'
      },
      {
        id: 4,
        title: 'Common Merchant Questions',
        description: 'FAQs from merchants and how to address them',
        url: '/resources/merchant-faqs'
      }
    ];
    
    return res.status(200).json({
      success: true,
      data: helpResources
    });
  } catch (error) {
    console.error('Error fetching help resources:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch help resources',
      error: error.message
    });
  }
};

/**
 * Mark notification as read
 */
exports.markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    
    await Notification.markAsRead(notificationId, userId);
    
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

module.exports = exports;