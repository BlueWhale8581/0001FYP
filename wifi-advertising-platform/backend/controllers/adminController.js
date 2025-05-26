// backend/controllers/adminController.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const SystemSettings = require('../models/SystemSettings');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const Merchant = require('../models/Merchant');
const Agent = require('../models/Agent');
const Advertiser = require('../models/Advertiser');
const Campaign = require('../models/Campaign');
const AdImpression = require('../models/AdImpression');
const WiFiAccess = require('../models/WiFiAccess');

const DashboardService = require('../services/dashboardService');
const TransactionService = require('../services/transactionService');
const ReportingService = require('../services/reportingService');
const AuditService = require('../services/auditService');
const NotificationService = require('../services/notificationService');
const EmailService = require('../services/emailService');

/**
 * Dashboard functions
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await DashboardService.getAdminDashboard();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting admin dashboard stats:', error);
    res.status(500).json({ message: 'Error retrieving dashboard statistics' });
  }
};

exports.getSystemMetrics = async (req, res) => {
  try {
    const { timeframe = 'week' } = req.query;
    
    // Get various metrics from different models
    const userCount = await User.countByRole();
    const transactionSummary = await Transaction.getRevenueSummary({ groupBy: 'type' });
    const recentImpressions = await AdImpression.getDailyImpressions(null, timeframe);
    const wifiConnections = await WiFiAccess.getDailyConnectionCounts(null, timeframe);
    
    res.status(200).json({
      userMetrics: userCount,
      financialMetrics: transactionSummary,
      adMetrics: recentImpressions,
      connectionMetrics: wifiConnections
    });
  } catch (error) {
    console.error('Error getting system metrics:', error);
    res.status(500).json({ message: 'Error retrieving system metrics' });
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

exports.getAlerts = async (req, res) => {
  try {
    // Get system alerts like low campaign budgets, high wifi usage, etc.
    const pendingMerchants = await Merchant.countByStatus('PENDING');
    const pendingTransactions = await Transaction.findAll({ status: 'PENDING', limit: 5 });
    
    // Get settings for threshold values
    const settings = await SystemSettings.getMultiple(['alert_low_budget_threshold', 'alert_high_wifi_usage']);
    
    // Get campaigns with low budget
    const lowBudgetCampaigns = await Campaign.findAll({
      where: `budget - spent < ${settings.alert_low_budget_threshold || 50}`,
      limit: 5
    });
    
    res.status(200).json({
      pendingMerchants,
      pendingTransactions,
      lowBudgetCampaigns
    });
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ message: 'Error retrieving system alerts' });
  }
};

/**
 * User & Account Management
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    const offset = (page - 1) * limit;
    
    const filters = {};
    if (role) filters.role = role;
    if (status) filters.status = status;
    if (search) filters.search = search;
    
    const users = await User.findAll({ ...filters, limit, offset });
    const total = await User.countByRole(role);
    
    res.status(200).json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ message: 'Error retrieving user details' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, first_name, last_name, phone, status } = req.body;
    
    // Check if username or email already exists
    const existingUser = await User.findByEmail(email) || await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    // Create the user
    const userData = {
      username,
      email,
      password,
      role,
      first_name: first_name,
      last_name: last_name,
      phone,
      status: status || 'ACTIVE'
    };
    
    const newUser = await User.create(userData);
    
    // Log the user creation
    await AuditService.logCreation({
      userId: req.user.id,
      entityType: 'user',
      entityId: newUser.id,
      values: { ...userData, password: '[REDACTED]' },
      ipAddress: req.ip
    });
    
    // Send welcome email
    await EmailService.sendWelcomeEmail(newUser);
    
    res.status(201).json({
      message: 'User created successfully',
      user: { ...newUser, password: undefined }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, first_name, last_name, phone, status } = req.body;
    
    // Get existing user data for audit log
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user
    const userData = {
      username,
      email,
      first_name: first_name,
      last_name: last_name,
      phone,
      status
    };
    
    const updatedUser = await User.update(id, userData);
    
    // Log the update
    await AuditService.logUpdate({
      userId: req.user.id,
      entityType: 'user',
      entityId: id,
      oldValues: existingUser,
      newValues: updatedUser,
      ipAddress: req.ip
    });
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get existing user data for audit log
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await User.delete(id);
    
    // Log the deletion
    await AuditService.logDeletion({
      userId: req.user.id,
      entityType: 'user',
      entityId: id,
      values: existingUser,
      ipAddress: req.ip
    });
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

exports.changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Get existing user data for audit log
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user status
    const updatedUser = await User.update(id, { status });
    
    // Log the status change
    await AuditService.logStatusChange({
      userId: req.user.id,
      entityType: 'user',
      entityId: id,
      oldStatus: existingUser.status,
      newStatus: status,
      ipAddress: req.ip
    });
    
    // Create notification for the user
    await NotificationService.createNotification(
      id,
      'Account Status Updated',
      `Your account status has been changed to ${status}`,
      status === 'ACTIVE' ? 'success' : 'warning'
    );
    
    res.status(200).json({
      message: 'User status updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error changing user status:', error);
    res.status(500).json({ message: 'Error changing user status' });
  }
};

/**
 * Revenue Management
 */
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    
    const filters = {};
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    
    const transactions = await Transaction.findAll({ ...filters, limit, offset });
    const total = await Transaction.getCount(filters);
    
    res.status(200).json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ message: 'Error retrieving transactions' });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findWithDetails(id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error getting transaction by ID:', error);
    res.status(500).json({ message: 'Error retrieving transaction details' });
  }
};

exports.approveTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    // Update transaction status
    const updatedTransaction = await TransactionService.updateTransactionStatus(
      id,
      'completed',
      req.user.id,
      notes
    );
    
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Create notification for related user
    let userId;
    if (updatedTransaction.merchant_id) {
      const merchant = await Merchant.findById(updatedTransaction.merchant_id);
      userId = merchant.user_id;
    } else if (updatedTransaction.agent_id) {
      const agent = await Agent.findById(updatedTransaction.agent_id);
      userId = agent.user_id;
    } else if (updatedTransaction.advertiser_id) {
      const advertiser = await Advertiser.findById(updatedTransaction.advertiser_id);
      userId = advertiser.user_id;
    }
    
    if (userId) {
      await NotificationService.createNotification(
        userId,
        'Transaction Approved',
        `Your transaction of $${updatedTransaction.amount} has been approved.`,
        'success'
      );
    }
    
    res.status(200).json({
      message: 'Transaction approved successfully',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Error approving transaction:', error);
    res.status(500).json({ message: 'Error approving transaction' });
  }
};

exports.rejectTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    // Update transaction status
    const updatedTransaction = await TransactionService.updateTransactionStatus(
      id,
      'failed',
      req.user.id,
      notes
    );
    
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Create notification for related user
    let userId;
    if (updatedTransaction.merchant_id) {
      const merchant = await Merchant.findById(updatedTransaction.merchant_id);
      userId = merchant.user_id;
    } else if (updatedTransaction.agent_id) {
      const agent = await Agent.findById(updatedTransaction.agent_id);
      userId = agent.user_id;
    } else if (updatedTransaction.advertiser_id) {
      const advertiser = await Advertiser.findById(updatedTransaction.advertiser_id);
      userId = advertiser.user_id;
    }
    
    if (userId) {
      await NotificationService.createNotification(
        userId,
        'Transaction Rejected',
        `Your transaction of $${updatedTransaction.amount} has been rejected. Reason: ${notes || 'Not specified'}`,
        'error'
      );
    }
    
    res.status(200).json({
      message: 'Transaction rejected successfully',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Error rejecting transaction:', error);
    res.status(500).json({ message: 'Error rejecting transaction' });
  }
};

exports.getRevenueOverview = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Get revenue summary grouped by type
    const revenueSummary = await Transaction.getRevenueSummary({ 
      groupBy: 'type',
      period
    });
    
    // Get daily revenue for the given period
    const dailyRevenue = await Transaction.getRevenueSummary({
      groupBy: 'day',
      period
    });
    
    res.status(200).json({
      summary: revenueSummary,
      dailyRevenue
    });
  } catch (error) {
    console.error('Error getting revenue overview:', error);
    res.status(500).json({ message: 'Error retrieving revenue overview' });
  }
};

/**
 * Reporting & Analytics
 */
exports.generateSystemReport = async (req, res) => {
  try {
    const { reportType, startDate, endDate, format = 'json' } = req.body;
    let report;
    
    switch (reportType) {
      case 'revenue':
        report = await ReportingService.generateRevenueReport({
          startDate,
          endDate,
          format
        });
        break;
      case 'adPerformance':
        report = await ReportingService.generateAdPerformanceReport({
          startDate,
          endDate,
          format
        });
        break;
      case 'wifiUsage':
        report = await ReportingService.generateWiFiUsageReport({
          startDate,
          endDate,
          format
        });
        break;
      case 'agentPerformance':
        report = await ReportingService.generateAgentPerformanceReport({
          startDate,
          endDate,
          format
        });
        break;
      case 'systemSummary':
        report = await ReportingService.generateSystemSummaryReport({
          startDate,
          endDate,
          format
        });
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }
    
    // Log report generation
    await AuditService.logActivity({
      userId: req.user.id,
      action: 'generate_report',
      entityType: 'report',
      description: `Generated ${reportType} report for period ${startDate} to ${endDate}`,
      ipAddress: req.ip
    });
    
    if (format === 'json') {
      return res.status(200).json(report);
    } else {
      // For file formats like PDF, CSV, etc.
      res.setHeader('Content-Type', `application/${format}`);
      res.setHeader('Content-Disposition', `attachment; filename=${reportType}_report.${format}`);
      return res.send(report);
    }
  } catch (error) {
    console.error('Error generating system report:', error);
    res.status(500).json({ message: 'Error generating system report' });
  }
};

exports.getSystemAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Get user growth analytics
    const userGrowth = await User.countByRole(null, { groupBy: 'day', period });
    
    // Get revenue analytics
    const revenueAnalytics = await Transaction.getRevenueSummary({
      groupBy: 'day',
      period
    });
    
    // Get ad impression analytics
    const impressionAnalytics = await AdImpression.getDailyImpressions(null, period);
    
    // Get WiFi usage analytics
    const wifiAnalytics = await WiFiAccess.getDailyConnectionCounts(null, period);
    
    res.status(200).json({
      userGrowth,
      revenue: revenueAnalytics,
      impressions: impressionAnalytics,
      wifiUsage: wifiAnalytics
    });
  } catch (error) {
    console.error('Error getting system analytics:', error);
    res.status(500).json({ message: 'Error retrieving system analytics' });
  }
};

exports.getPerformanceMetrics = async (req, res) => {
  try {
    const { metricType, entityId, period = 'month' } = req.query;
    
    let metrics;
    switch (metricType) {
      case 'agent':
        metrics = await Agent.getPerformanceMetrics(entityId, period);
        break;
      case 'advertiser':
        metrics = await Advertiser.getPerformanceMetrics(entityId, period);
        break;
      case 'merchant':
        metrics = await Merchant.getPerformanceMetrics(entityId, period);
        break;
      case 'campaign':
        metrics = await Campaign.getPerformanceMetrics(entityId, period);
        break;
      default:
        return res.status(400).json({ message: 'Invalid metric type' });
    }
    
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({ message: 'Error retrieving performance metrics' });
  }
};

exports.exportReportData = async (req, res) => {
  try {
    const { reportType, startDate, endDate, format = 'csv' } = req.query;
    let report;
    
    // Similar to generateSystemReport but for export only
    switch (reportType) {
      case 'revenue':
        report = await ReportingService.generateRevenueReport({
          startDate,
          endDate,
          format
        });
        break;
      case 'adPerformance':
        report = await ReportingService.generateAdPerformanceReport({
          startDate,
          endDate,
          format
        });
        break;
      case 'wifiUsage':
        report = await ReportingService.generateWiFiUsageReport({
          startDate,
          endDate,
          format
        });
        break;
      case 'agentPerformance':
        report = await ReportingService.generateAgentPerformanceReport({
          startDate,
          endDate,
          format
        });
        break;
      case 'systemSummary':
        report = await ReportingService.generateSystemSummaryReport({
          startDate,
          endDate,
          format
        });
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }
    
    // Log report export
    await AuditService.logActivity({
      userId: req.user.id,
      action: 'export_report',
      entityType: 'report',
      description: `Exported ${reportType} report in ${format} format`,
      ipAddress: req.ip
    });
    
    if (format === 'json') {
      return res.status(200).json(report);
    } else {
      // For file formats like PDF, CSV, etc.
      res.setHeader('Content-Type', `application/${format}`);
      res.setHeader('Content-Disposition', `attachment; filename=${reportType}_report.${format}`);
      return res.send(report);
    }
  } catch (error) {
    console.error('Error exporting report data:', error);
    res.status(500).json({ message: 'Error exporting report data' });
  }
};

/**
 * System Management & Settings
 */
exports.getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getAll();
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error getting system settings:', error);
    res.status(500).json({ message: 'Error retrieving system settings' });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    const results = [];
    // Get current values for audit logging
    const currentSettings = await SystemSettings.getMultiple(
      Object.keys(settings)
    );
    
    // Update settings one by one
    for (const [key, value] of Object.entries(settings)) {
      const oldValue = currentSettings[key] || null;
      const result = await SystemSettings.upsert(key, value, req.user.id);
      results.push(result);
      
      // Log the setting change
      await AuditService.logSettingChange({
        userId: req.user.id,
        key,
        oldValue,
        newValue: value,
        ipAddress: req.ip
      });
    }
    
    res.status(200).json({
      message: 'System settings updated successfully',
      settings: results
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ message: 'Error updating system settings' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, action, entityType, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    
    const filters = {};
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (entityType) filters.entityType = entityType;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    
    const logs = await AuditLog.getAll(filters, { limit, offset });
    const total = await AuditLog.getCount(filters);
    
    res.status(200).json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting audit logs:', error);
    res.status(500).json({ message: 'Error retrieving audit logs' });
  }
};

exports.getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await AuditLog.getById(id);
    
    if (!log) {
      return res.status(404).json({ message: 'Audit log not found' });
    }
    
    res.status(200).json(log);
  } catch (error) {
    console.error('Error getting audit log by ID:', error);
    res.status(500).json({ message: 'Error retrieving audit log details' });
  }
};

/**
 * Merchant Management
 */
exports.getMerchants = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const offset = (page - 1) * limit;
    
    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    
    const merchants = await Merchant.findAll({ 
      ...filters, 
      limit, 
      offset,
      sortBy,
      sortOrder
    });
    
    const total = await Merchant.getCount(filters);
    
    // Get associated user data
    const enrichedMerchants = await Promise.all(merchants.map(async (merchant) => {
      const userData = await User.findById(merchant.user_id);
      return {
        ...merchant,
        user: userData ? {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          status: userData.status
        } : null
      };
    }));
    
    res.status(200).json({
      merchants: enrichedMerchants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting merchants:', error);
    res.status(500).json({ message: 'Error retrieving merchants' });
  }
};

/**
 * Advertiser Management
 */
exports.getAdvertisers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const offset = (page - 1) * limit;
    
    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    
    const advertisers = await Advertiser.findAll({ 
      ...filters, 
      limit, 
      offset,
      sortBy,
      sortOrder
    });
    
    const total = await Advertiser.getCount(filters);
    
    // Get associated user data
    const enrichedAdvertisers = await Promise.all(advertisers.map(async (advertiser) => {
      const userData = await User.findById(advertiser.user_id);
      return {
        ...advertiser,
        user: userData ? {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          status: userData.status
        } : null
      };
    }));
    
    res.status(200).json({
      advertisers: enrichedAdvertisers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting advertisers:', error);
    res.status(500).json({ message: 'Error retrieving advertisers' });
  }
};

/**
 * Agent Management
 */
exports.getAgents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const offset = (page - 1) * limit;
    
    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    
    const agents = await Agent.findAll({ 
      ...filters, 
      limit, 
      offset,
      sortBy,
      sortOrder
    });
    
    const total = await Agent.getCount(filters);
    
    // Get associated user data
    const enrichedAgents = await Promise.all(agents.map(async (agent) => {
      const userData = await User.findById(agent.user_id);
      return {
        ...agent,
        user: userData ? {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          status: userData.status
        } : null
      };
    }));
    
    res.status(200).json({
      agents: enrichedAgents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting agents:', error);
    res.status(500).json({ message: 'Error retrieving agents' });
  }
};

/**
 * Campaign Management
 */
exports.getCampaigns = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, advertiserId, search, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const offset = (page - 1) * limit;
    
    const filters = {};
    if (status) filters.status = status;
    if (advertiserId) filters.advertiser_id = advertiserId;
    if (search) filters.search = search;
    
    const campaigns = await Campaign.findAll({ 
      ...filters, 
      limit, 
      offset,
      sortBy,
      sortOrder
    });
    
    const total = await Campaign.getCount(filters);
    
    // Get associated advertiser data
    const enrichedCampaigns = await Promise.all(campaigns.map(async (campaign) => {
      const advertiserData = await Advertiser.findById(campaign.advertiser_id);
      return {
        ...campaign,
        advertiser: advertiserData || null,
        // Calculate remaining budget
        remainingBudget: (campaign.budget - campaign.spent).toFixed(2),
        // Calculate campaign performance metrics
        performance: {
          impressions: await AdImpression.getCountByCampaignId(campaign.id),
          clicks: await AdImpression.getClicksByCampaignId(campaign.id),
          ctr: await AdImpression.getCTRByCampaignId(campaign.id)
        }
      };
    }));
    
    res.status(200).json({
      campaigns: enrichedCampaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    res.status(500).json({ message: 'Error retrieving campaigns' });
  }
};

module.exports = exports;