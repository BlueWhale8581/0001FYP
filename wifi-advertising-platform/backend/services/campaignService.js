const Campaign = require('../models/Campaign');
const Ad = require('../models/Ad');
const AdImpression = require('../models/AdImpression');
const Advertiser = require('../models/Advertiser');
const Transaction = require('../models/Transaction');
const NotificationService = require('./notificationService');

class CampaignService {
  /**
   * Create a new campaign
   * @param {Object} campaignData - Campaign data
   * @param {number} advertiserId - Advertiser ID
   * @returns {Promise<Object>} Created campaign
   */
  async createCampaign(campaignData, advertiserId) {
    try {
      // Validate campaign dates
      if (new Date(campaignData.start_date) > new Date(campaignData.end_date)) {
        throw new Error('Start date cannot be after end date');
      }

      // Create campaign in database
      const campaign = await Campaign.create({
        ...campaignData,
        advertiser_id: advertiserId,
        status: 'draft'
      });

      // Notify advertiser
      await NotificationService.createNotification({
        user_id: campaignData.created_by,
        title: 'Campaign Created',
        message: `Campaign "${campaignData.name}" has been created successfully.`,
        type: 'success'
      });

      return campaign;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update campaign details
   * @param {number} campaignId - Campaign ID
   * @param {Object} updateData - Data to update
   * @param {number} advertiserId - Advertiser ID for validation
   * @returns {Promise<Object>} Updated campaign
   */
  async updateCampaign(campaignId, updateData, advertiserId) {
    try {
      // First check if campaign exists and belongs to advertiser
      const existingCampaign = await Campaign.findById(campaignId);
      if (!existingCampaign) {
        throw new Error('Campaign not found');
      }
      
      if (existingCampaign.advertiser_id !== advertiserId) {
        throw new Error('Unauthorized to update this campaign');
      }
      
      // Validate campaign dates if they are being updated
      if (updateData.start_date && updateData.end_date) {
        if (new Date(updateData.start_date) > new Date(updateData.end_date)) {
          throw new Error('Start date cannot be after end date');
        }
      } else if (updateData.start_date && !updateData.end_date) {
        if (new Date(updateData.start_date) > new Date(existingCampaign.end_date)) {
          throw new Error('Start date cannot be after end date');
        }
      } else if (!updateData.start_date && updateData.end_date) {
        if (new Date(existingCampaign.start_date) > new Date(updateData.end_date)) {
          throw new Error('Start date cannot be after end date');
        }
      }
      
      // Update campaign
      const updatedCampaign = await Campaign.update(campaignId, updateData);
      
      return updatedCampaign;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change campaign status (activate, pause, complete, cancel)
   * @param {number} campaignId - Campaign ID
   * @param {string} newStatus - New status ('ACTIVE', 'paused', 'completed', 'CANCELLED')
   * @param {number} advertiserId - Advertiser ID for validation
   * @returns {Promise<Object>} Updated campaign
   */
  async changeCampaignStatus(campaignId, newStatus, advertiserId) {
    try {
      // First check if campaign exists and belongs to advertiser
      const existingCampaign = await Campaign.findById(campaignId);
      if (!existingCampaign) {
        throw new Error('Campaign not found');
      }
      
      if (existingCampaign.advertiser_id !== advertiserId) {
        throw new Error('Unauthorized to update this campaign');
      }
      
      // Validate status changes
      const validStatuses = ['draft', 'ACTIVE', 'paused', 'completed', 'CANCELLED'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid status');
      }
      
      // Check specific rules for status changes
      if (existingCampaign.status === 'completed' || existingCampaign.status === 'CANCELLED') {
        throw new Error(`Cannot change status of a ${existingCampaign.status} campaign`);
      }
      
      // If activating, ensure campaign has at least one ad
      if (newStatus === 'ACTIVE') {
        const adCount = await Ad.countByCampaignId(campaignId);
        if (adCount === 0) {
          throw new Error('Cannot activate campaign without ads');
        }
        
        // Check if campaign dates are valid
        const currentDate = new Date();
        if (new Date(existingCampaign.end_date) < currentDate) {
          throw new Error('Cannot activate campaign with past end date');
        }
      }
      
      // Update campaign status
      const updatedCampaign = await Campaign.updateStatus(campaignId, newStatus);
      
      // Create notification
      const statusMessages = {
        active: 'activated',
        paused: 'paused',
        completed: 'completed',
        cancelled: 'CANCELLED',
        draft: 'returned to draft'
      };
      
      await NotificationService.createNotification({
        user_id: advertiserId,
        title: 'Campaign Status Updated',
        message: `Campaign "${existingCampaign.name}" has been ${statusMessages[newStatus]}.`,
        type: 'info'
      });
      
      return updatedCampaign;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get campaign performance metrics
   * @param {number} campaignId - Campaign ID
   * @param {string} startDate - Start date for metrics
   * @param {string} endDate - End date for metrics
   * @returns {Promise<Object>} Campaign metrics
   */
  async getCampaignMetrics(campaignId, startDate, endDate) {
    try {
      // Get campaign details
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }
      
      // Get all ads for the campaign
      const ads = await Ad.findByCampaignId(campaignId);
      const adIds = ads.map(ad => ad.id);
      
      // Get impression data
      const impressions = await AdImpression.findByCampaignId(campaignId, startDate, endDate);
      
      // Get daily impression counts
      const dailyImpressions = await AdImpression.getDailyImpressions(campaignId, startDate, endDate);
      
      // Calculate metrics
      const totalImpressions = impressions.length;
      const completedImpressions = impressions.filter(imp => imp.completed).length;
      const completionRate = totalImpressions > 0 ? (completedImpressions / totalImpressions) * 100 : 0;
      
      // Calculate average view duration
      let totalDuration = 0;
      impressions.forEach(imp => {
        totalDuration += imp.view_duration || 0;
      });
      const avgViewDuration = totalImpressions > 0 ? totalDuration / totalImpressions : 0;
      
      // Calculate spending
      const budgetSpent = campaign.spent;
      const budgetRemaining = campaign.budget - campaign.spent;
      const spendRate = campaign.budget > 0 ? (budgetSpent / campaign.budget) * 100 : 0;
      
      return {
        campaign: {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          startDate: campaign.start_date,
          endDate: campaign.end_date,
          budget: campaign.budget,
          spent: budgetSpent,
          budgetRemaining: budgetRemaining,
          spendRate: spendRate
        },
        performance: {
          totalImpressions,
          completedImpressions,
          completionRate,
          avgViewDuration,
          dailyImpressions
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a campaign
   * @param {number} campaignId - Campaign ID
   * @param {number} advertiserId - Advertiser ID for validation
   * @returns {Promise<boolean>} Success status
   */
  async deleteCampaign(campaignId, advertiserId) {
    try {
      // First check if campaign exists and belongs to advertiser
      const existingCampaign = await Campaign.findById(campaignId);
      if (!existingCampaign) {
        throw new Error('Campaign not found');
      }
      
      if (existingCampaign.advertiser_id !== advertiserId) {
        throw new Error('Unauthorized to delete this campaign');
      }
      
      // Check if campaign has already spent budget (has transactions)
      if (existingCampaign.spent > 0) {
        throw new Error('Cannot delete campaign with spent budget');
      }
      
      // Delete campaign
      await Campaign.delete(campaignId);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get advertiser dashboard data
   * @param {number} advertiserId - Advertiser ID
   * @returns {Promise<Object>} Dashboard data
   */
  async getAdvertiserDashboard(advertiserId) {
    try {
      // Get advertiser
      const advertiser = await Advertiser.findById(advertiserId);
      if (!advertiser) {
        throw new Error('Advertiser not found');
      }
      
      // Get active campaigns
      const activeCampaigns = await Campaign.findByAdvertiserId(advertiserId, { status: 'ACTIVE' });
      
      // Get campaign summaries
      const campaignSummary = await Campaign.getDashboardSummary(advertiserId);
      
      // Get recent transactions
      const recentTransactions = await Transaction.findByAdvertiserId(advertiserId, { limit: 5 });
      
      // Get performance metrics
      const performanceMetrics = await Advertiser.getPerformanceMetrics(advertiserId);
      
      return {
        activeCampaigns,
        campaignSummary,
        recentTransactions,
        performanceMetrics
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CampaignService();