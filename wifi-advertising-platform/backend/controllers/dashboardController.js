/**
 * Dashboard Controller
 * Provides dashboard data for different user roles and common dashboard components
 */
const DashboardService = require('../services/dashboardService');
const AuditLog = require('../models/AuditLog');
const NotificationService = require('../services/notificationService');
const Transaction = require('../models/Transaction');
const Merchant = require('../models/Merchant');
const AdImpression = require('../models/AdImpression');
const Agent = require('../models/Agent');
const Campaign = require('../models/Campaign');
const Ad = require('../models/Ad');
const WiFiAccess = require('../models/WiFiAccess');
const User = require('../models/User');
const SystemSettings = require('../models/SystemSettings');
const Advertiser = require('../models/Advertiser');
const Notification = require('../models/Notification');

/**
 * Get admin dashboard data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAdminDashboard = async (req, res) => {
  try {
    const dashboardData = await DashboardService.getAdminDashboard({
      timeframe: req.query.timeframe || 'week',
      startDate: req.query.startDate,
      endDate: req.query.endDate
    });

    const quickStats = await exports.getQuickStats('admin');
    const recentActivity = await exports.getRecentActivity(req.user.id, 'admin');
    const systemAlerts = await exports.getSystemAlerts();
    const notifications = await exports.getNotifications(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        ...dashboardData,
        quickStats,
        recentActivity,
        systemAlerts,
        notifications
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get agent dashboard data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAgentDashboard = async (req, res) => {
  try {
    const { timeframe = 'month', startDate, endDate } = req.query;
    
    // Get agent ID from user record
    const agent = await Agent.findByUserId(req.user.id);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent record not found'
      });
    }
    
    // Get dashboard data using service
    const dashboardData = await DashboardService.getAgentDashboard(agent.id, {
      timeframe,
      startDate,
      endDate
    });
    
    // Get quick stats
    const quickStats = await exports.getQuickStats('agent', agent.id);
    
    // Get recent activity
    const recentActivity = await exports.getRecentActivity(req.user.id, 'agent');
    
    // Get notifications
    const notifications = await exports.getNotifications(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        ...dashboardData,
        quickStats,
        recentActivity,
        notifications
      }
    });
  } catch (error) {
    console.error('Agent dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve agent dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get advertiser dashboard data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAdvertiserDashboard = async (req, res) => {
  try {
    const { timeframe = 'month', startDate, endDate } = req.query;
    
    // Get advertiser details from user record
    const advertiser = await Advertiser.findByUserId(req.user.id);
    if (!advertiser) {
      return res.status(404).json({
        success: false,
        message: 'Advertiser record not found'
      });
    }
    
    // Get dashboard data using service
    const dashboardData = await DashboardService.getAdvertiserDashboard(advertiser.id, {
      timeframe,
      startDate,
      endDate
    });
    
    // Get quick stats
    const quickStats = await exports.getQuickStats('advertiser', advertiser.id);
    
    // Get recent activity
    const recentActivity = await exports.getRecentActivity(req.user.id, 'advertiser');
    
    // Get notifications
    const notifications = await exports.getNotifications(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        ...dashboardData,
        quickStats,
        recentActivity,
        notifications
      }
    });
  } catch (error) {
    console.error('Advertiser dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve advertiser dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get merchant dashboard data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMerchantDashboard = async (req, res) => {
  try {
    const { timeframe = 'month', startDate, endDate } = req.query;
    
    // Get merchant details from user record
    const merchant = await Merchant.findByUserId(req.user.id);
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant record not found'
      });
    }
    
    // Get dashboard data using service
    const dashboardData = await DashboardService.getMerchantDashboard(merchant.id, {
      timeframe,
      startDate,
      endDate
    });
    
    // Get quick stats
    const quickStats = await exports.getQuickStats('merchant', merchant.id);
    
    // Get recent activity
    const recentActivity = await exports.getRecentActivity(req.user.id, 'merchant');
    
    // Get notifications
    const notifications = await exports.getNotifications(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        ...dashboardData,
        quickStats,
        recentActivity,
        notifications
      }
    });
  } catch (error) {
    console.error('Merchant dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve merchant dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get recent activity for a user
 * @param {Number} userId - User ID
 * @param {String} role - User role
 * @param {Number} limit - Maximum number of activities to return
 * @returns {Promise<Array>} Recent activities
 */
exports.getRecentActivity = async (userId, role, limit = 10) => {
  try {
    let entityType;
    let entityId;
    
    // Determine which entities to include based on role
    switch (role) {
      case 'admin':
        // For admin, get all recent activities
        return await AuditLog.getAll({ limit });
      
      case 'agent':
        const agent = await Agent.findByUserId(userId);
        entityType = 'agent';
        entityId = agent.id;
        break;
      
      case 'advertiser':
        const advertiser = await Advertiser.findByUserId(userId);
        entityType = 'advertiser';
        entityId = advertiser.id;
        break;
      
      case 'merchant':
        const merchant = await Merchant.findByUserId(userId);
        entityType = 'merchant';
        entityId = merchant.id;
        break;
      
      default:
        return [];
    }
    
    // Get audit logs for the specific entity
    const activityLogs = await AuditLog.getByEntity(entityType, entityId, { limit });
    
    // Enrich the activity logs with additional info if needed
    const enrichedLogs = activityLogs.map(log => {
      return {
        ...log,
        formattedTime: new Date(log.created_at).toLocaleString()
      };
    });
    
    return enrichedLogs;
  } catch (error) {
    console.error('Error getting recent activity:', error);
    return [];
  }
};

/**
 * Get system alerts
 * @param {Number} limit - Maximum number of alerts to return
 * @returns {Promise<Array>} System alerts
 */
exports.getSystemAlerts = async (limit = 5) => {
  try {
    // Get system alerts from settings
    const systemAlertSettings = await SystemSettings.getByKey('system_alerts');
    let alerts = [];
    
    if (systemAlertSettings && systemAlertSettings.setting_value) {
      try {
        const parsedAlerts = JSON.parse(systemAlertSettings.setting_value);
        alerts = Array.isArray(parsedAlerts) ? parsedAlerts : [];
      } catch (e) {
        console.error('Error parsing system alerts:', e);
      }
    }
    
    // Check for low budgets in campaigns
    const lowBudgetCampaigns = await Campaign.findAll({
      where: {
        status: 'ACTIVE',
        // Where remaining budget is less than 10%
        spentPercentage: { $gt: 90 }
      },
      limit
    });
    
    if (lowBudgetCampaigns && lowBudgetCampaigns.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Low Campaign Budgets',
        message: `${lowBudgetCampaigns.length} active campaigns have less than 10% budget remaining.`,
        created_at: new Date().toISOString()
      });
    }
    
    // Return most recent alerts first
    return alerts
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting system alerts:', error);
    return [];
  }
};

/**
 * Get notifications for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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
 * Get quick stats based on user role
 * @param {String} role - User role
 * @param {Number} entityId - Entity ID (agent, advertiser, or merchant ID)
 * @returns {Promise<Object>} Quick stats for dashboard
 */
exports.getQuickStats = async (role, entityId = null) => {
  try {
    const stats = {};
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    
    switch (role) {
      case 'admin':
        // Admin quick stats
        stats.totalUsers = await User.countByRole();
        stats.pendingMerchants = await Merchant.countByStatus('PENDING');
        
        // Revenue stats for last 30 days
        const revenueSummary = await Transaction.getRevenueSummary({
          startDate: thirtyDaysAgo,
          endDate: currentDate,
          groupBy: 'type'
        });
        
        stats.totalRevenue = revenueSummary.total || 0;
        stats.adRevenue = revenueSummary.byType?.ad_revenue || 0;
        stats.pendingTransactions = await Transaction.findAll({
          where: { status: 'PENDING' },
          count: true
        });
        
        // Total ad impressions
        stats.totalImpressions = await AdImpression.countByAdId(null, {
          startDate: thirtyDaysAgo,
          endDate: currentDate
        });
        break;
      
      case 'agent':
        // Agent quick stats
        stats.totalMerchants = await Merchant.findByAgentId(entityId, { count: true });
        stats.pendingMerchants = await Merchant.findByAgentId(entityId, { 
          where: { approval_status: 'PENDING' },
          count: true
        });
        
        // Commission stats
        const agentTransactions = await Transaction.findByAgentId(entityId, {
          startDate: thirtyDaysAgo,
          endDate: currentDate
        });
        
        stats.totalCommission = agentTransactions.reduce(
          (sum, transaction) => sum + parseFloat(transaction.amount), 
          0
        ).toFixed(2);
        
        // QR code stats
        stats.activeQRCodes = await require('../models/QRCode').findByAgentId(entityId, {
          where: { activation_status: 'ACTIVE' },
          count: true
        });
        break;
      
      case 'advertiser':
        // Advertiser quick stats
        stats.activeCampaigns = await Campaign.findByAdvertiserId(entityId, {
          where: { status: 'ACTIVE' },
          count: true
        });
        
        // Budget stats
        const campaigns = await Campaign.findByAdvertiserId(entityId);
        stats.totalBudget = campaigns.reduce(
          (sum, campaign) => sum + parseFloat(campaign.budget), 
          0
        ).toFixed(2);
        stats.totalSpent = campaigns.reduce(
          (sum, campaign) => sum + parseFloat(campaign.spent), 
          0
        ).toFixed(2);
        
        // Ad performance stats
        const advertiserCampaignIds = campaigns.map(campaign => campaign.id);
        const ads = await Ad.findByCampaignId(advertiserCampaignIds);
        const adIds = ads.map(ad => ad.id);
        
        stats.totalImpressions = await AdImpression.countByAdId(adIds, {
          startDate: thirtyDaysAgo,
          endDate: currentDate
        });
        
        stats.completionRate = await AdImpression.getCompletionRate(adIds, {
          startDate: thirtyDaysAgo,
          endDate: currentDate
        });
        break;
      
      case 'merchant':
        // Merchant quick stats
        const wifiAccess = await WiFiAccess.findByMerchantId(entityId, {
          startDate: thirtyDaysAgo,
          endDate: currentDate
        });
        
        stats.totalConnections = wifiAccess.length;
        stats.uniqueUsers = new Set(wifiAccess.map(log => log.device_mac)).size;
        
        // Revenue stats
        const merchantTransactions = await Transaction.findByMerchantId(entityId, {
          startDate: thirtyDaysAgo,
          endDate: currentDate,
          type: 'ad_revenue'
        });
        
        stats.totalRevenue = merchantTransactions.reduce(
          (sum, transaction) => sum + parseFloat(transaction.amount), 
          0
        ).toFixed(2);
        
        // Ad impressions at this merchant
        stats.adsServed = await AdImpression.findByMerchantId(entityId, {
          startDate: thirtyDaysAgo,
          endDate: currentDate,
          count: true
        });
        
        // Average session duration
        stats.avgSessionDuration = wifiAccess.reduce((sum, session) => {
          if (session.connection_time && session.disconnection_time) {
            const duration = new Date(session.disconnection_time) - new Date(session.connection_time);
            return sum + duration;
          }
          return sum;
        }, 0) / (wifiAccess.length || 1) / 60000; // Convert to minutes
        
        stats.avgSessionDuration = stats.avgSessionDuration.toFixed(1);
        break;
      
      default:
        break;
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting quick stats:', error);
    return {};
  }
};

module.exports = exports;