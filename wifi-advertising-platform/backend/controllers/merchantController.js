// backend/controllers/merchantController.js

const Merchant = require('../models/Merchant');
const WiFiSettings = require('../models/WiFiSettings');
const AdImpression = require('../models/AdImpression');
const Transaction = require('../models/Transaction');
const UploadService = require('../services/uploadService');
const WiFiService = require('../services/wifiService');
const ReportingService = require('../services/reportingService');
const DashboardService = require('../services/dashboardService');
const { validationResult } = require('express-validator');

// Dashboard functions
exports.getDashboardStats = async (req, res) => {
  try {
    const merchantId = req.params.merchantId || req.merchant.id;
    
    // Use dashboard service to get comprehensive merchant stats
    const dashboardData = await DashboardService.getMerchantDashboard(merchantId);
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching merchant dashboard stats:', error);
    res.status(500).json({
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

exports.getWiFiUsageStats = async (req, res) => {
  try {
    const merchantId = req.params.merchantId || req.merchant.id;
    const { startDate, endDate, groupBy } = req.query;
    
    const options = {
      startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default: last 30 days
      endDate: endDate || new Date(),
      groupBy: groupBy || 'day' // Default: group by day
    };
    
    const wifiStats = await WiFiService.getWiFiUsageStats(merchantId, options);
    
    res.status(200).json({
      success: true,
      data: wifiStats
    });
  } catch (error) {
    console.error('Error fetching WiFi usage stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch WiFi usage statistics',
      error: error.message
    });
  }
};

exports.getAdImpressions = async (req, res) => {
  try {
    const merchantId = req.params.merchantId || req.merchant.id;
    const { startDate, endDate, page, limit } = req.query;
    
    const options = {
      startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: endDate ? new Date(endDate) : new Date(),
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20
    };
    
    // Get ad impressions for this merchant
    const impressions = await AdImpression.findByMerchantId(merchantId, options);
    
    // Get summary statistics
    const totalCount = await AdImpression.countByMerchantId(merchantId, options);
    const completionRate = await AdImpression.getCompletionRate(merchantId, options);
    
    res.status(200).json({
      success: true,
      data: {
        impressions,
        totalCount,
        completionRate,
        pagination: {
          page: options.page,
          limit: options.limit,
          totalPages: Math.ceil(totalCount / options.limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching ad impressions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ad impressions',
      error: error.message
    });
  }
};

exports.getRevenueDetails = async (req, res) => {
  try {
    const merchantId = req.params.merchantId || req.merchant.id;
    const { startDate, endDate } = req.query;
    
    const options = {
      startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: endDate ? new Date(endDate) : new Date()
    };
    
    // Get revenue details from transactions
    const revenueDetails = await Transaction.getRevenueSummary({
      merchantId,
      startDate: options.startDate,
      endDate: options.endDate,
      groupBy: 'day'
    });
    
    // Get totals
    const totalRevenue = revenueDetails.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
    res.status(200).json({
      success: true,
      data: {
        revenueDetails,
        totalRevenue,
        period: {
          start: options.startDate,
          end: options.endDate
        }
      }
    });
  } catch (error) {
    console.error('Error fetching revenue details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue details',
      error: error.message
    });
  }
};

// Wi-Fi Service Management
exports.getWiFiSettings = async (req, res) => {
  try {
    const merchantId = req.params.merchantId || req.merchant.id;
    
    // Get Wi-Fi settings for this merchant
    const wifiSettings = await WiFiSettings.findByMerchantId(merchantId);
    
    if (!wifiSettings) {
      return res.status(404).json({
        success: false,
        message: 'WiFi settings not found for this merchant'
      });
    }
    
    res.status(200).json({
      success: true,
      data: wifiSettings
    });
  } catch (error) {
    console.error('Error fetching WiFi settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch WiFi settings',
      error: error.message
    });
  }
};

exports.updateWiFiSettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const merchantId = req.params.merchantId || req.merchant.id;
    const updatedSettings = req.body;
    
    // Check if settings exist
    const existingSettings = await WiFiSettings.findByMerchantId(merchantId);
    
    let wifiSettings;
    if (existingSettings) {
      // Update existing settings
      wifiSettings = await WiFiService.updateWiFiSettings(merchantId, updatedSettings);
    } else {
      // Initialize new settings
      wifiSettings = await WiFiService.initializeWiFiSettings(merchantId, updatedSettings);
    }
    
    res.status(200).json({
      success: true,
      message: 'WiFi settings updated successfully',
      data: wifiSettings
    });
  } catch (error) {
    console.error('Error updating WiFi settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update WiFi settings',
      error: error.message
    });
  }
};

exports.getAdDisplayPreferences = async (req, res) => {
  try {
    const merchantId = req.params.merchantId || req.merchant.id;
    
    // Get Wi-Fi settings for this merchant
    const wifiSettings = await WiFiSettings.findByMerchantId(merchantId);
    
    if (!wifiSettings) {
      return res.status(404).json({
        success: false,
        message: 'Ad display preferences not found for this merchant'
      });
    }
    
    // Extract ad display related settings
    const adDisplayPreferences = {
      adsBeforeAccess: wifiSettings.ads_before_access,
      redirectUrl: wifiSettings.redirect_url
    };
    
    res.status(200).json({
      success: true,
      data: adDisplayPreferences
    });
  } catch (error) {
    console.error('Error fetching ad display preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ad display preferences',
      error: error.message
    });
  }
};

exports.updateAdDisplayPreferences = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const merchantId = req.params.merchantId || req.merchant.id;
    const { adsBeforeAccess } = req.body;
    
    // Get existing Wi-Fi settings
    const existingSettings = await WiFiSettings.findByMerchantId(merchantId);
    
    if (!existingSettings) {
      return res.status(404).json({
        success: false,
        message: 'WiFi settings not found for this merchant'
      });
    }
    
    // Update only the ad display preference
    const updatedSettings = { 
      ...existingSettings,
      ads_before_access: adsBeforeAccess
    };
    
    const wifiSettings = await WiFiService.updateWiFiSettings(merchantId, updatedSettings);
    
    res.status(200).json({
      success: true,
      message: 'Ad display preferences updated successfully',
      data: {
        adsBeforeAccess: wifiSettings.ads_before_access
      }
    });
  } catch (error) {
    console.error('Error updating ad display preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ad display preferences',
      error: error.message
    });
  }
};

exports.configureRedirectUrl = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const merchantId = req.params.merchantId || req.merchant.id;
    const { redirectUrl } = req.body;
    
    // Get existing Wi-Fi settings
    const existingSettings = await WiFiSettings.findByMerchantId(merchantId);
    
    if (!existingSettings) {
      return res.status(404).json({
        success: false,
        message: 'WiFi settings not found for this merchant'
      });
    }
    
    // Update only the redirect URL
    const updatedSettings = { 
      ...existingSettings,
      redirect_url: redirectUrl
    };
    
    const wifiSettings = await WiFiService.updateWiFiSettings(merchantId, updatedSettings);
    
    res.status(200).json({
      success: true,
      message: 'Redirect URL updated successfully',
      data: {
        redirectUrl: wifiSettings.redirect_url
      }
    });
  } catch (error) {
    console.error('Error updating redirect URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update redirect URL',
      error: error.message
    });
  }
};

// Profile Management
exports.getMerchantProfile = async (req, res) => {
  try {
    const merchantId = req.params.merchantId || req.merchant.id;
    
    // Get merchant profile with user data
    const merchantProfile = await Merchant.findWithUserData(merchantId);
    
    if (!merchantProfile) {
      return res.status(404).json({
        success: false,
        message: 'Merchant profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: merchantProfile
    });
  } catch (error) {
    console.error('Error fetching merchant profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch merchant profile',
      error: error.message
    });
  }
};

exports.updateMerchantProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const merchantId = req.params.merchantId || req.merchant.id;
    const updatedProfileData = req.body;
    
    // Update merchant profile
    const updatedProfile = await Merchant.update(merchantId, updatedProfileData);
    
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Merchant profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Merchant profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating merchant profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update merchant profile',
      error: error.message
    });
  }
};

exports.updateBusinessLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const merchantId = req.params.merchantId || req.merchant.id;
    
    // Upload logo using upload service
    const logoUrl = await UploadService.uploadMerchantLogo(req.file, merchantId);
    
    // Update merchant record with new logo URL
    const updatedProfile = await Merchant.update(merchantId, { logo_url: logoUrl });
    
    res.status(200).json({
      success: true,
      message: 'Business logo updated successfully',
      data: {
        logoUrl
      }
    });
  } catch (error) {
    console.error('Error updating business logo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update business logo',
      error: error.message
    });
  }
};

// Revenue & Commission Reports
exports.getEarningsReport = async (req, res) => {
  try {
    const merchantId = req.params.merchantId || req.merchant.id;
    const { startDate, endDate, groupBy } = req.query;
    
    const options = {
      merchantId,
      startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: endDate ? new Date(endDate) : new Date(),
      groupBy: groupBy || 'day'
    };
    
    // Generate revenue report using reporting service
    const earningsReport = await ReportingService.generateRevenueReport(options);
    
    res.status(200).json({
      success: true,
      data: earningsReport
    });
  } catch (error) {
    console.error('Error generating earnings report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate earnings report',
      error: error.message
    });
  }
};

exports.getCommissionBreakdown = async (req, res) => {
  try {
    const merchantId = req.params.merchantId || req.merchant.id;
    const { startDate, endDate } = req.query;
    
    const options = {
      startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: endDate ? new Date(endDate) : new Date()
    };
    
    // Get all transactions for this merchant within date range
    const transactions = await Transaction.findByMerchantId(merchantId, options);
    
    // Get merchant details to determine agent
    const merchantDetails = await Merchant.findById(merchantId);
    
    if (!merchantDetails) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }
    
    // Get agent commission details if merchant has an agent
    let agentCommissions = [];
    if (merchantDetails.agent_id) {
      agentCommissions = await Transaction.findAll({
        type: 'agent_commission',
        reference_id: merchantId,
        startDate: options.startDate,
        endDate: options.endDate
      });
    }
    
    // Calculate totals
    const totalRevenue = transactions.reduce((sum, t) => 
      t.type === 'ad_revenue' ? sum + parseFloat(t.amount) : sum, 0);
    
    const totalAgentCommission = agentCommissions.reduce((sum, t) => 
      sum + parseFloat(t.amount), 0);
    
    const merchantEarnings = totalRevenue - totalAgentCommission;
    
    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalAgentCommission,
        merchantEarnings,
        commissionRate: merchantDetails.agent_id ? 
          (totalAgentCommission / totalRevenue * 100).toFixed(2) + '%' : '0%',
        transactions,
        agentCommissions,
        period: {
          start: options.startDate,
          end: options.endDate
        }
      }
    });
  } catch (error) {
    console.error('Error fetching commission breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch commission breakdown',
      error: error.message
    });
  }
};

exports.getRevenueByPeriod = async (req, res) => {
  try {
    const merchantId = req.params.merchantId || req.merchant.id;
    const { period, startDate, endDate } = req.query;
    
    // Determine date range based on period
    let start, end;
    end = endDate ? new Date(endDate) : new Date();
    
    switch (period) {
      case 'week':
        start = startDate ? new Date(startDate) : new Date(end - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = startDate ? new Date(startDate) : new Date(end - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        start = startDate ? new Date(startDate) : new Date(end - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        start = startDate ? new Date(startDate) : new Date(end - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = startDate ? new Date(startDate) : new Date(end - 30 * 24 * 60 * 60 * 1000);
    }
    
    // Determine appropriate grouping
    let groupBy;
    const daysDiff = Math.floor((end - start) / (24 * 60 * 60 * 1000));
    
    if (daysDiff <= 31) {
      groupBy = 'day';
    } else if (daysDiff <= 90) {
      groupBy = 'week';
    } else {
      groupBy = 'month';
    }
    
    // Get revenue summary using transactions
    const revenueSummary = await Transaction.getRevenueSummary({
      merchantId,
      startDate: start,
      endDate: end,
      groupBy
    });
    
    // Calculate totals
    const totalRevenue = revenueSummary.reduce((sum, item) => 
      sum + parseFloat(item.amount), 0);
    
    res.status(200).json({
      success: true,
      data: {
        revenueSummary,
        totalRevenue,
        period: {
          name: period || 'custom',
          start,
          end,
          groupBy
        }
      }
    });
  } catch (error) {
    console.error('Error fetching revenue by period:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue by period',
      error: error.message
    });
  }
};

module.exports = exports;