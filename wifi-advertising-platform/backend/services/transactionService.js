const Transaction = require('../models/Transaction');
const Campaign = require('../models/Campaign');
const Merchant = require('../models/Merchant');
const Agent = require('../models/Agent');
const Advertiser = require('../models/Advertiser');
const NotificationService = require('./notificationService');

class TransactionService {
  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise<Object>} Created transaction
   */
  async createTransaction(transactionData) {
    try {
      // Validate transaction data
      if (!transactionData.type || !transactionData.amount) {
        throw new Error('Missing required transaction information');
      }
      
      // Validate transaction type
      const validTypes = ['ad_revenue', 'merchant_payment', 'agent_commission', 'advertiser_payment'];
      if (!validTypes.includes(transactionData.type)) {
        throw new Error('Invalid transaction type');
      }
      
      // Validate amount is positive
      if (transactionData.amount <= 0) {
        throw new Error('Transaction amount must be positive');
      }
      
      // Create transaction
      const transaction = await Transaction.create(transactionData);
      
      // Send notifications based on transaction type
      let notificationUserId;
      let notificationTitle;
      let notificationMessage;
      
      switch (transactionData.type) {
        case 'ad_revenue':
          // If merchant_id is provided, notify merchant
          if (transactionData.merchant_id) {
            const merchant = await Merchant.findById(transactionData.merchant_id);
            notificationUserId = merchant.user_id;
            notificationTitle = 'Ad Revenue Generated';
            notificationMessage = `You've earned $${transactionData.amount.toFixed(2)} from ad impressions.`;
          }
          break;
          
        case 'merchant_payment':
          if (transactionData.merchant_id) {
            const merchant = await Merchant.findById(transactionData.merchant_id);
            notificationUserId = merchant.user_id;
            notificationTitle = 'Payment Processed';
            notificationMessage = `A payment of $${transactionData.amount.toFixed(2)} has been processed for your account.`;
          }
          break;
          
        case 'agent_commission':
          if (transactionData.agent_id) {
            const agent = await Agent.findById(transactionData.agent_id);
            notificationUserId = agent.user_id;
            notificationTitle = 'Commission Earned';
            notificationMessage = `You've earned $${transactionData.amount.toFixed(2)} in commissions.`;
          }
          break;
          
        case 'advertiser_payment':
          if (transactionData.advertiser_id) {
            const advertiser = await Advertiser.findById(transactionData.advertiser_id);
            notificationUserId = advertiser.user_id;
            notificationTitle = 'Payment Received';
            notificationMessage = `We've received your payment of $${transactionData.amount.toFixed(2)}.`;
          }
          break;
      }
      
      // Send notification if applicable
      if (notificationUserId) {
        await NotificationService.createNotification({
          user_id: notificationUserId,
          title: notificationTitle,
          message: notificationMessage,
          type: 'success'
        });
      }
      
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update transaction status
   * @param {number} transactionId - Transaction ID
   * @param {string} newStatus - New status ('PENDING', 'completed', 'failed', 'refunded')
   * @param {number} adminId - Admin user ID making the change
   * @returns {Promise<Object>} Updated transaction
   */
  async updateTransactionStatus(transactionId, newStatus, adminId) {
    try {
      // Verify transaction exists
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      
      // Validate status
      const validStatuses = ['PENDING', 'completed', 'failed', 'refunded'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid transaction status');
      }
      
      // Update transaction status
      const updatedTransaction = await Transaction.updateStatus(transactionId, newStatus);
      
      // Handle side effects based on new status
      if (newStatus === 'completed') {
        if (transaction.type === 'advertiser_payment' && transaction.campaign_id) {
          // If it's an advertiser payment, add to campaign budget
          await Campaign.update(transaction.campaign_id, {
            budget: transaction.amount,
            increment: true
          });
        } else if (transaction.type === 'merchant_payment' && transaction.merchant_id) {
          // If it's a merchant payment, record it
          // No specific action needed here as the transaction record is enough
        } else if (transaction.type === 'agent_commission' && transaction.agent_id) {
          // If it's an agent commission, record it
          // No specific action needed here as the transaction record is enough
        }
      } else if (newStatus === 'refunded' && transaction.status === 'completed') {
        // Handle refunds by reversing previous completed transactions
        if (transaction.type === 'advertiser_payment' && transaction.campaign_id) {
          // Reduce campaign budget
          const campaign = await Campaign.findById(transaction.campaign_id);
          if (campaign.budget >= transaction.amount) {
            await Campaign.update(transaction.campaign_id, {
              budget: -transaction.amount,
              increment: true
            });
          }
        }
      }
      
      // Create notification for affected party
      let notificationUserId;
      let notificationEntity;
      
      if (transaction.advertiser_id) {
        const advertiser = await Advertiser.findById(transaction.advertiser_id);
        notificationUserId = advertiser.user_id;
        notificationEntity = 'advertiser';
      } else if (transaction.merchant_id) {
        const merchant = await Merchant.findById(transaction.merchant_id);
        notificationUserId = merchant.user_id;
        notificationEntity = 'merchant';
      } else if (transaction.agent_id) {
        const agent = await Agent.findById(transaction.agent_id);
        notificationUserId = agent.user_id;
        notificationEntity = 'agent';
      }
      
      if (notificationUserId) {
        const statusMessages = {
          completed: 'completed',
          pending: 'marked as pending',
          failed: 'failed',
          refunded: 'refunded'
        };
        
        await NotificationService.createNotification({
          user_id: notificationUserId,
          title: 'Transaction Status Updated',
          message: `Your transaction of $${transaction.amount.toFixed(2)} has been ${statusMessages[newStatus]}.`,
          type: newStatus === 'completed' ? 'success' : (newStatus === 'failed' ? 'error' : 'info')
        });
      }
      
      return updatedTransaction;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process advertiser payment
   * @param {number} advertiserId - Advertiser ID
   * @param {number} campaignId - Campaign ID
   * @param {number} amount - Payment amount
   * @param {string} referenceId - External payment reference
   * @returns {Promise<Object>} Created transaction
   */
  async processAdvertiserPayment(advertiserId, campaignId, amount, referenceId) {
    try {
      // Verify advertiser owns the campaign
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }
      
      if (campaign.advertiser_id !== advertiserId) {
        throw new Error('Unauthorized to make payment for this campaign');
      }
      
      // Create transaction
      const transaction = await this.createTransaction({
        type: 'advertiser_payment',
        amount,
        status: 'completed',
        reference_id: referenceId,
        advertiser_id: advertiserId,
        campaign_id: campaignId,
        description: `Payment for campaign: ${campaign.name}`
      });
      
      // Update campaign budget
      await Campaign.update(campaignId, {
        budget: amount,
        increment: true
      });
      
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Distribute ad revenue to merchants and agents
   * @param {number} merchantId - Merchant ID
   * @param {number} amount - Revenue amount
   * @param {number} campaignId - Campaign ID (optional)
   * @returns {Promise<Object>} Distribution results
   */
  async distributeAdRevenue(merchantId, amount, campaignId = null) {
    try {
      // Get merchant information including agent
      const merchant = await Merchant.findById(merchantId);
      if (!merchant) {
        throw new Error('Merchant not found');
      }
      
      // Define revenue split percentages (would normally be in system settings)
      const platformFeePercentage = 30; // Platform takes 30%
      const merchantPercentage = 50; // Merchant gets 50%
      const agentPercentage = 20; // Agent gets 20% (if exists)
      
      // Calculate shares
      const platformFee = amount * (platformFeePercentage / 100);
      const merchantShare = amount * (merchantPercentage / 100);
      let agentShare = 0;
      
      if (merchant.agent_id) {
        agentShare = amount * (agentPercentage / 100);
      } else {
        // If no agent, platform gets the agent's share
        platformFee += amount * (agentPercentage / 100);
      }
      
      // Create merchant payment transaction
      const merchantTransaction = await this.createTransaction({
        type: 'merchant_payment',
        amount: merchantShare,
        status: 'completed',
        merchant_id: merchantId,
        campaign_id: campaignId,
        description: 'Ad revenue share'
     });
      
// Create agent commission transaction if applicable
let agentTransaction = null;
if (merchant.agent_id && agentShare > 0) {
  // Get agent details
  const agent = await Agent.findById(merchant.agent_id);
  
  agentTransaction = await this.createTransaction({
    type: 'agent_commission',
    amount: agentShare,
    status: 'completed',
    agent_id: merchant.agent_id,
    merchant_id: merchantId,
    campaign_id: campaignId,
    description: 'Agent commission from ad revenue'
  });
}

return {
  totalAmount: amount,
  platformFee,
  merchantShare,
  agentShare,
  merchantTransaction,
  agentTransaction
};
} catch (error) {
throw error;
}
}

/**
* Calculate agent commissions for a period
* @param {number} agentId - Agent ID
* @param {string} startDate - Start date
* @param {string} endDate - End date
* @returns {Promise<Object>} Commission summary
*/
async calculateAgentCommissions(agentId, startDate, endDate) {
try {
// Verify agent exists
const agent = await Agent.findById(agentId);
if (!agent) {
  throw new Error('Agent not found');
}

// Get agent's merchants
const merchants = await Merchant.findByAgentId(agentId);

// Get transactions for the period
const transactions = await Transaction.findByAgentId(agentId, {
  startDate,
  endDate,
  type: 'agent_commission'
});

// Calculate summary
const totalCommission = transactions.reduce((total, t) => total + t.amount, 0);

// Group by merchant
const merchantCommissions = {};
merchants.forEach(merchant => {
  merchantCommissions[merchant.id] = {
    merchantId: merchant.id,
    businessName: merchant.business_name,
    totalCommission: 0,
    transactions: []
  };
});

transactions.forEach(transaction => {
  if (transaction.merchant_id && merchantCommissions[transaction.merchant_id]) {
    merchantCommissions[transaction.merchant_id].totalCommission += transaction.amount;
    merchantCommissions[transaction.merchant_id].transactions.push(transaction);
  }
});

return {
  agentId,
  period: {
    start: startDate,
    end: endDate
  },
  totalCommission,
  merchantBreakdown: Object.values(merchantCommissions)
};
} catch (error) {
throw error;
}
}

/**
* Generate merchant revenue report
* @param {number} merchantId - Merchant ID
* @param {string} startDate - Start date
* @param {string} endDate - End date
* @returns {Promise<Object>} Revenue report
*/
async generateMerchantRevenueReport(merchantId, startDate, endDate) {
try {
// Verify merchant exists
const merchant = await Merchant.findById(merchantId);
if (!merchant) {
  throw new Error('Merchant not found');
}

// Get merchant payments for period
const transactions = await Transaction.findByMerchantId(merchantId, {
  startDate,
  endDate,
  type: 'merchant_payment'
});

// Get WiFi usage data
const wifiAccess = await WiFiAccess.findByMerchantId(merchantId, {
  startDate,
  endDate
});

// Get ad impressions
const adImpressions = await AdImpression.findByMerchantId(merchantId, {
  startDate,
  endDate
});

// Calculate daily revenue
const dailyRevenue = await Transaction.getRevenueSummary(merchantId, {
  startDate,
  endDate,
  groupBy: 'day'
});

// Calculate summary metrics
const totalRevenue = transactions.reduce((total, t) => total + t.amount, 0);
const totalConnections = wifiAccess.length;
const totalImpressions = adImpressions.length;
const completedImpressions = adImpressions.filter(imp => imp.completed).length;

// Revenue per connection & impression
const revenuePerConnection = totalConnections > 0 ? totalRevenue / totalConnections : 0;
const revenuePerImpression = totalImpressions > 0 ? totalRevenue / totalImpressions : 0;

return {
  merchantId,
  period: {
    start: startDate,
    end: endDate
  },
  summary: {
    totalRevenue,
    totalConnections,
    totalImpressions,
    completedImpressions,
    revenuePerConnection,
    revenuePerImpression
  },
  dailyRevenue,
  transactions
};
} catch (error) {
throw error;
}
}

/**
* Generate overall platform revenue report (admin only)
* @param {string} startDate - Start date
* @param {string} endDate - End date
* @param {string} groupBy - Grouping criteria (day, week, month, merchant, advertiser)
* @returns {Promise<Object>} Platform revenue report
*/
async generatePlatformRevenueReport(startDate, endDate, groupBy = 'day') {
try {
// Get all transactions for period
const transactions = await Transaction.findAll({
  startDate,
  endDate
});

// Calculate revenue by type
const adRevenue = transactions
  .filter(t => t.type === 'ad_revenue')
  .reduce((total, t) => total + t.amount, 0);
  
const advertiserPayments = transactions
  .filter(t => t.type === 'advertiser_payment')
  .reduce((total, t) => total + t.amount, 0);
  
const merchantPayments = transactions
  .filter(t => t.type === 'merchant_payment')
  .reduce((total, t) => total + t.amount, 0);
  
const agentCommissions = transactions
  .filter(t => t.type === 'agent_commission')
  .reduce((total, t) => total + t.amount, 0);
  
// Calculate platform profit
const platformProfit = adRevenue - merchantPayments - agentCommissions;

// Get revenue breakdown by grouping
const revenueBreakdown = await Transaction.getRevenueSummary(null, {
  startDate,
  endDate,
  groupBy
});

// Get top merchants by revenue
const merchantRevenue = await Transaction.getRevenueSummary(null, {
  startDate,
  endDate,
  groupBy: 'merchant_id',
  limit: 10,
  orderBy: 'total',
  direction: 'DESC'
});

// Get top advertisers by spending
const advertiserSpending = await Transaction.getRevenueSummary(null, {
  startDate,
  endDate,
  groupBy: 'advertiser_id',
  type: 'advertiser_payment',
  limit: 10,
  orderBy: 'total',
  direction: 'DESC'
});

return {
  period: {
    start: startDate,
    end: endDate
  },
  summary: {
    adRevenue,
    advertiserPayments,
    merchantPayments,
    agentCommissions,
    platformProfit
  },
  revenueBreakdown,
  topMerchants: merchantRevenue,
  topAdvertisers: advertiserSpending
};
} catch (error) {
throw error;
}
}

/**
* Approve pending transaction
* @param {number} transactionId - Transaction ID
* @param {number} adminId - Admin user ID approving the transaction
* @returns {Promise<Object>} Updated transaction
*/
async approveTransaction(transactionId, adminId) {
try {
return await this.updateTransactionStatus(transactionId, 'completed', adminId);
} catch (error) {
throw error;
}
}

/**
* Reject pending transaction
* @param {number} transactionId - Transaction ID
* @param {number} adminId - Admin user ID rejecting the transaction
* @param {string} reason - Reason for rejection
* @returns {Promise<Object>} Updated transaction
*/
async rejectTransaction(transactionId, adminId, reason) {
try {
// Update status
const updatedTransaction = await this.updateTransactionStatus(transactionId, 'failed', adminId);

// Add rejection reason
await Transaction.update(transactionId, {
  description: `${updatedTransaction.description || ''} Rejected reason: ${reason}`
});

return updatedTransaction;
} catch (error) {
throw error;
}
}

/**
* Get transaction details with related entities
* @param {number} transactionId - Transaction ID
* @returns {Promise<Object>} Transaction with related details
*/
async getTransactionDetails(transactionId) {
try {
// Get transaction with related details
const transaction = await Transaction.findWithDetails(transactionId);
if (!transaction) {
  throw new Error('Transaction not found');
}

return transaction;
} catch (error) {
throw error;
}
}
}

module.exports = new TransactionService();