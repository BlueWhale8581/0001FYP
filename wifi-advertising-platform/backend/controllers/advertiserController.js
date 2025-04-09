//backend/controllers/advertiserController.js
const AdService = require('../services/adService');
const AuthService = require('../services/authService');
const CampaignService = require('../services/campaignService');
const DashboardService = require('../services/dashboardService');
const NotificationService = require('../services/notificationService');
const ReportingService = require('../services/reportingService');
const TransactionService = require('../services/transactionService');
const UploadService = require('../services/uploadService');

// Models
const Advertiser = require('../models/Advertiser');
const Ad = require('../models/Ad');
const Campaign = require('../models/Campaign');
const AdImpression = require('../models/AdImpression');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Dashboard functions
exports.getDashboardStats = async (req, res) => {
  try {
    const advertiserId = req.user.advertiserId;
    
    // Use DashboardService to get comprehensive dashboard data
    const dashboardData = await DashboardService.getAdvertiserDashboard(advertiserId);
    
    return res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

exports.getCampaignMetrics = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { startDate, endDate } = req.query;
    const advertiserId = req.user.advertiserId;
    
    // Verify campaign belongs to advertiser
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.advertiser_id !== advertiserId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to campaign metrics'
      });
    }
    
    const metrics = await CampaignService.getCampaignMetrics(campaignId, startDate, endDate);
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error getting campaign metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch campaign metrics',
      error: error.message
    });
  }
};

exports.getAdvertiserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = req.query;
    
    // Get unread notifications
    const unreadNotifications = await NotificationService.getUnreadNotifications(userId, limit);
    
    return res.status(200).json({
      success: true,
      data: {
        notifications: unreadNotifications,
        unreadCount: unreadNotifications.length
      }
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Campaign Management
exports.getAllCampaigns = async (req, res) => {
  try {
    const advertiserId = req.user.advertiserId;
    const { status, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    
    // Get campaigns with optional filtering
    const campaigns = await Campaign.findByAdvertiserId(
      advertiserId, 
      { status, page, limit, sortBy, sortOrder }
    );
    
    // Get total count for pagination
    const totalCampaigns = await Campaign.countByAdvertiserId(advertiserId, { status });
    
    return res.status(200).json({
      success: true,
      data: {
        campaigns,
        pagination: {
          total: totalCampaigns,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(totalCampaigns / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns',
      error: error.message
    });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const advertiserId = req.user.advertiserId;
    
    // Find campaign with associated ads
    const campaign = await Campaign.findById(campaignId);
    
    // Check if campaign exists and belongs to advertiser
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    if (campaign.advertiser_id !== advertiserId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this campaign'
      });
    }
    
    // Get ads associated with this campaign
    const ads = await Ad.findByCampaignId(campaignId);
    
    return res.status(200).json({
      success: true,
      data: {
        campaign,
        ads
      }
    });
  } catch (error) {
    console.error('Error getting campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch campaign details',
      error: error.message
    });
  }
};

exports.createCampaign = async (req, res) => {
  try {
    const advertiserId = req.user.advertiserId;
    const campaignData = req.body;
    
    // Create campaign using service
    const campaign = await CampaignService.createCampaign(campaignData, advertiserId);
    
    return res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create campaign',
      error: error.message
    });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const advertiserId = req.user.advertiserId;
    const updateData = req.body;
    
    // Update campaign using service
    const updatedCampaign = await CampaignService.updateCampaign(campaignId, updateData, advertiserId);
    
    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or you are not authorized to update it'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      data: updatedCampaign
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update campaign',
      error: error.message
    });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const advertiserId = req.user.advertiserId;
    
    // Delete campaign using service
    const result = await CampaignService.deleteCampaign(campaignId, advertiserId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or you are not authorized to delete it'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete campaign',
      error: error.message
    });
  }
};

exports.pauseCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const advertiserId = req.user.advertiserId;
    
    // Update campaign status to paused
    const updatedCampaign = await CampaignService.changeCampaignStatus(campaignId, 'paused', advertiserId);
    
    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or you are not authorized to pause it'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Campaign paused successfully',
      data: updatedCampaign
    });
  } catch (error) {
    console.error('Error pausing campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to pause campaign',
      error: error.message
    });
  }
};

exports.resumeCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const advertiserId = req.user.advertiserId;
    
    // Update campaign status to active
    const updatedCampaign = await CampaignService.changeCampaignStatus(campaignId, 'active', advertiserId);
    
    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or you are not authorized to resume it'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Campaign resumed successfully',
      data: updatedCampaign
    });
  } catch (error) {
    console.error('Error resuming campaign:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resume campaign',
      error: error.message
    });
  }
};

exports.createAd = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const advertiserId = req.user.advertiserId;
    const adData = req.body;
    
    // Handle file upload if present
    if (req.file) {
      const mediaUrl = await UploadService.uploadAdMedia(req.file, null, campaignId);
      adData.media_url = mediaUrl;
    }
    
    // Create ad using service
    const ad = await AdService.createAd(adData, campaignId, advertiserId);
    
    return res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: ad
    });
  } catch (error) {
    console.error('Error creating ad:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create ad',
      error: error.message
    });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const advertiserId = req.user.advertiserId;
    const updateData = req.body;
    
    // Handle file upload if present
    if (req.file) {
      const ad = await Ad.findById(adId);
      const campaignId = ad.campaign_id;
      
      // Delete old media if exists
      if (ad.media_url) {
        await UploadService.deleteFile(ad.media_url);
      }
      
      // Upload new media
      const mediaUrl = await UploadService.uploadAdMedia(req.file, adId, campaignId);
      updateData.media_url = mediaUrl;
    }
    
    // Update ad using service
    const updatedAd = await AdService.updateAd(adId, updateData, advertiserId);
    
    if (!updatedAd) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found or you are not authorized to update it'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Ad updated successfully',
      data: updatedAd
    });
  } catch (error) {
    console.error('Error updating ad:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update ad',
      error: error.message
    });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const advertiserId = req.user.advertiserId;
    
    // Delete ad using service
    const result = await AdService.deleteAd(adId, advertiserId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found or you are not authorized to delete it'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ad:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete ad',
      error: error.message
    });
  }
};

// Analytics & Reporting
exports.getCampaignAnalytics = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { startDate, endDate, metrics = 'all' } = req.query;
    const advertiserId = req.user.advertiserId;
    
    // Verify campaign belongs to advertiser
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.advertiser_id !== advertiserId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to campaign analytics'
      });
    }
    
    // Get campaign analytics from reporting service
    const analytics = await ReportingService.generateAdPerformanceReport({
      campaignId,
      startDate,
      endDate,
      metrics: metrics.split(',')
    });
    
    return res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting campaign analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch campaign analytics',
      error: error.message
    });
  }
};

exports.getAdPerformance = async (req, res) => {
  try {
    const { adId } = req.params;
    const advertiserId = req.user.advertiserId;
    
    // Verify ad belongs to advertiser
    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }
    
    const campaign = await Campaign.findById(ad.campaign_id);
    if (campaign.advertiser_id !== advertiserId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to ad performance'
      });
    }
    
    // Get ad metrics
    const metrics = await AdService.getAdMetrics(adId, advertiserId);
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error getting ad performance:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch ad performance',
      error: error.message
    });
  }
};

exports.exportCampaignData = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { format = 'json', startDate, endDate } = req.query;
    const advertiserId = req.user.advertiserId;
    
    // Verify campaign belongs to advertiser
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.advertiser_id !== advertiserId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to campaign data'
      });
    }
    
    // Get campaign analytics
    const analytics = await ReportingService.generateAdPerformanceReport({
      campaignId,
      startDate,
      endDate,
      includeAdDetails: true
    });
    
    // Format response according to requested format
    if (format.toLowerCase() === 'csv') {
      // Convert JSON to CSV
      const csvData = convertToCsv(analytics);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="campaign_${campaignId}_data.csv"`);
      return res.status(200).send(csvData);
    } else {
      // Default to JSON format
      return res.status(200).json({
        success: true,
        data: analytics
      });
    }
  } catch (error) {
    console.error('Error exporting campaign data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export campaign data',
      error: error.message
    });
  }
};

exports.getImpressionStats = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const advertiserId = req.user.advertiserId;
    
    // Verify campaign belongs to advertiser
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.advertiser_id !== advertiserId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to impression stats'
      });
    }
    
    // Get impression data based on groupBy parameter
    let impressionData;
    if (groupBy === 'ad') {
      // Group impressions by ad
      const ads = await Ad.findByCampaignId(campaignId);
      impressionData = await Promise.all(ads.map(async (ad) => {
        const count = await AdImpression.countByAdId(ad.id, { startDate, endDate });
        const completionRate = await AdImpression.getCompletionRate(ad.id, { startDate, endDate });
        const avgViewDuration = await AdImpression.getAverageViewDuration(ad.id, { startDate, endDate });
        
        return {
          adId: ad.id,
          adTitle: ad.title,
          impressions: count,
          completionRate,
          averageViewDuration: avgViewDuration
        };
      }));
    } else {
      // Group impressions by time (day, week, month)
      impressionData = await AdImpression.getDailyImpressions(campaignId, { 
        startDate, 
        endDate, 
        groupBy 
      });
    }
    
    return res.status(200).json({
      success: true,
      data: impressionData
    });
  } catch (error) {
    console.error('Error getting impression stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch impression statistics',
      error: error.message
    });
  }
};

// Budget & Payment Management
exports.getAdBudget = async (req, res) => {
  try {
    const advertiserId = req.user.advertiserId;
    
    // Get active campaigns
    const activeCampaigns = await Campaign.findByAdvertiserId(advertiserId, { 
      status: 'active'
    });
    
    // Calculate budget details
    const budgetDetails = activeCampaigns.map(campaign => ({
      campaignId: campaign.id,
      campaignName: campaign.name,
      totalBudget: campaign.budget,
      spent: campaign.spent,
      remaining: campaign.budget - campaign.spent,
      startDate: campaign.start_date,
      endDate: campaign.end_date
    }));
    
    // Calculate total budget statistics
    const totalBudget = budgetDetails.reduce((sum, campaign) => sum + campaign.totalBudget, 0);
    const totalSpent = budgetDetails.reduce((sum, campaign) => sum + campaign.spent, 0);
    
    return res.status(200).json({
      success: true,
      data: {
        campaigns: budgetDetails,
        summary: {
          totalBudget,
          totalSpent,
          totalRemaining: totalBudget - totalSpent,
          activeCampaignsCount: activeCampaigns.length
        }
      }
    });
  } catch (error) {
    console.error('Error getting ad budget:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch ad budget information',
      error: error.message
    });
  }
};

exports.getSpendingHistory = async (req, res) => {
  try {
    const advertiserId = req.user.advertiserId;
    const { startDate, endDate, campaignId, groupBy = 'day' } = req.query;
    
    // Get all transactions related to ad spending
    const filter = {
      advertiser_id: advertiserId,
      type: 'advertiser_payment'
    };
    
    if (campaignId) {
      filter.campaign_id = campaignId;
    }
    
    // Get spending transactions
    const transactions = await Transaction.findByAdvertiserId(
      advertiserId, 
      { startDate, endDate, campaignId, groupBy }
    );
    
    return res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error getting spending history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch spending history',
      error: error.message
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const advertiserId = req.user.advertiserId;
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    // Get payment transactions
    const payments = await Transaction.findByAdvertiserId(
      advertiserId, 
      { 
        type: 'advertiser_payment',
        page: parseInt(page),
        limit: parseInt(limit),
        startDate,
        endDate
      }
    );
    
    // Get total count for pagination
    const totalPayments = await Transaction.countByAdvertiserId(
      advertiserId, 
      { type: 'advertiser_payment', startDate, endDate }
    );
    
    return res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          total: totalPayments,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(totalPayments / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting payment history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
};

exports.makePayment = async (req, res) => {
  try {
    const advertiserId = req.user.advertiserId;
    const { campaignId, amount, paymentMethod, referenceId } = req.body;
    
    // Verify campaign belongs to advertiser
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign || campaign.advertiser_id !== advertiserId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access to make payment for this campaign'
        });
      }
    }
    
    // Process payment through transaction service
    const paymentResult = await TransactionService.processAdvertiserPayment(
      advertiserId,
      campaignId,
      amount,
      referenceId
    );
    
    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: paymentResult
    });
  } catch (error) {
    console.error('Error making payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
};

// Profile & Account Management
exports.getAdvertiserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const advertiserId = req.user.advertiserId;
    
    // Get advertiser with user data
    const advertiserData = await Advertiser.findWithUserData(advertiserId);
    
    if (!advertiserData) {
      return res.status(404).json({
        success: false,
        message: 'Advertiser profile not found'
      });
    }
    
    // Remove sensitive information
    delete advertiserData.user.password;
    
    return res.status(200).json({
      success: true,
      data: advertiserData
    });
  } catch (error) {
    console.error('Error getting advertiser profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch advertiser profile',
      error: error.message
    });
  }
};

exports.updateAdvertiserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const advertiserId = req.user.advertiserId;
    const { 
      company_name, company_address, company_phone, 
      company_email, industry, first_name, last_name, phone 
    } = req.body;
    
    // Update advertiser profile
    const advertiserData = {
      company_name,
      company_address,
      company_phone,
      company_email,
      industry
    };
    
    // Filter out undefined values
    Object.keys(advertiserData).forEach(
      key => advertiserData[key] === undefined && delete advertiserData[key]
    );
    
    const updatedAdvertiser = await Advertiser.update(advertiserId, advertiserData);
    
    // Update user profile if user data is provided
    const userData = {
      first_name,
      last_name,
      phone
    };
    
    // Filter out undefined values
    Object.keys(userData).forEach(
      key => userData[key] === undefined && delete userData[key]
    );
    
    if (Object.keys(userData).length > 0) {
      await User.update(userId, userData);
    }
    
    // Get updated profile
    const updatedProfile = await Advertiser.findWithUserData(advertiserId);
    
    // Remove sensitive information
    delete updatedProfile.user.password;
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating advertiser profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update advertiser profile',
      error: error.message
    });
  }
};

exports.updateBillingDetails = async (req, res) => {
  try {
    const advertiserId = req.user.advertiserId;
    const { 
      billing_address, billing_contact, payment_method,
      card_info, bank_info, tax_id 
    } = req.body;
    
    // Update billing details in advertiser record
    // Note: In a real application, you would likely have a separate billing_details table
    // and would handle sensitive payment information more securely.
    const billingData = {
      billing_address,
      billing_contact,
      payment_method,
      tax_id
    };
    
    // Filter out undefined values
    Object.keys(billingData).forEach(
      key => billingData[key] === undefined && delete billingData[key]
    );
    
    // Update the advertiser record
    const updatedAdvertiser = await Advertiser.update(advertiserId, billingData);
    
    // For security, we wouldn't save card_info directly to the database
    // Instead, you'd use a payment processor like Stripe and store a token/reference
    
    return res.status(200).json({
      success: true,
      message: 'Billing details updated successfully',
      data: {
        billingDetails: billingData
      }
    });
  } catch (error) {
    console.error('Error updating billing details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update billing details',
      error: error.message
    });
  }
};

// Helper function to convert JSON to CSV (simplified version)
function convertToCsv(data) {
  if (!data || !data.length) {
    return '';
  }
  
  const header = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map(item => 
    Object.values(item).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  ).join('\n');
  
  return header + rows;
}

module.exports = exports;