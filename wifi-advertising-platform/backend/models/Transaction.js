const mysql = require('mysql2/promise');
const db = require('../config/database');

class Transaction {
  constructor(transactionData) {
    this.id = transactionData.id;
    this.type = transactionData.type;
    this.amount = parseFloat(transactionData.amount);
    this.status = transactionData.status || 'pending';
    this.reference_id = transactionData.reference_id;
    this.merchant_id = transactionData.merchant_id;
    this.advertiser_id = transactionData.advertiser_id;
    this.agent_id = transactionData.agent_id;
    this.campaign_id = transactionData.campaign_id;
    this.description = transactionData.description;
    this.created_at = transactionData.created_at;
    this.updated_at = transactionData.updated_at;
  }

  // Create a new transaction
  static async create(transactionData) {
    try {
      const query = `
        INSERT INTO transactions (
          type, amount, status, reference_id, merchant_id,
          advertiser_id, agent_id, campaign_id, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        transactionData.type,
        transactionData.amount,
        transactionData.status || 'pending',
        transactionData.reference_id,
        transactionData.merchant_id || null,
        transactionData.advertiser_id || null,
        transactionData.agent_id || null,
        transactionData.campaign_id || null,
        transactionData.description
      ]);
      
      return { id: result.insertId, ...transactionData };
    } catch (error) {
      throw error;
    }
  }

  // Find transaction by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM transactions WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const transactionData = rows[0];
      return new Transaction(transactionData);
    } catch (error) {
      throw error;
    }
  }

  // Find transaction by reference ID
  static async findByReferenceId(referenceId) {
    try {
      const query = 'SELECT * FROM transactions WHERE reference_id = ?';
      const [rows] = await db.execute(query, [referenceId]);
      
      if (rows.length === 0) return null;
      
      const transactionData = rows[0];
      return new Transaction(transactionData);
    } catch (error) {
      throw error;
    }
  }

  // Get all transactions with optional filtering and pagination
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      let query = 'SELECT * FROM transactions WHERE 1=1';
      const params = [];
      
      if (filters.type) {
        query += ' AND type = ?';
        params.push(filters.type);
      }
      
      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }
      
      if (filters.merchant_id) {
        query += ' AND merchant_id = ?';
        params.push(filters.merchant_id);
      }
      
      if (filters.advertiser_id) {
        query += ' AND advertiser_id = ?';
        params.push(filters.advertiser_id);
      }
      
      if (filters.agent_id) {
        query += ' AND agent_id = ?';
        params.push(filters.agent_id);
      }
      
      if (filters.campaign_id) {
        query += ' AND campaign_id = ?';
        params.push(filters.campaign_id);
      }
      
      if (filters.start_date && filters.end_date) {
        query += ' AND created_at BETWEEN ? AND ?';
        params.push(filters.start_date, filters.end_date);
      }
      
      // Add sorting
      query += ' ORDER BY created_at DESC';
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [rows] = await db.execute(query, params);
      
      return rows.map(row => new Transaction(row));
    } catch (error) {
      throw error;
    }
  }

  // Get transaction with detailed information
  static async findWithDetails(transactionId) {
    try {
      const query = `
        SELECT t.*, 
          m.business_name, 
          a.company_name, 
          u1.username as merchant_username,
          u2.username as advertiser_username,
          u3.username as agent_username,
          c.name as campaign_name
        FROM transactions t
        LEFT JOIN merchants m ON t.merchant_id = m.id
        LEFT JOIN advertisers a ON t.advertiser_id = a.id
        LEFT JOIN agents ag ON t.agent_id = ag.id
        LEFT JOIN users u1 ON m.user_id = u1.id
        LEFT JOIN users u2 ON a.user_id = u2.id
        LEFT JOIN users u3 ON ag.user_id = u3.id
        LEFT JOIN campaigns c ON t.campaign_id = c.id
        WHERE t.id = ?
      `;
      
      const [rows] = await db.execute(query, [transactionId]);
      
      if (rows.length === 0) return null;
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update transaction status
  static async updateStatus(id, status, referenceId = null) {
    try {
      let query = 'UPDATE transactions SET status = ?';
      const params = [status];
      
      if (referenceId) {
        query += ', reference_id = ?';
        params.push(referenceId);
      }
      
      query += ' WHERE id = ?';
      params.push(id);
      
      const [result] = await db.execute(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get transactions by merchant ID
  static async findByMerchantId(merchantId, startDate, endDate, page = 1, limit = 10) {
    try {
      const query = `
        SELECT * FROM transactions 
        WHERE merchant_id = ? 
        AND created_at BETWEEN ? AND ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const offset = (page - 1) * limit;
      const [rows] = await db.execute(query, [
        merchantId, 
        startDate, 
        endDate, 
        parseInt(limit), 
        parseInt(offset)
      ]);
      
      return rows.map(row => new Transaction(row));
    } catch (error) {
      throw error;
    }
  }

  // Get transactions by agent ID
  static async findByAgentId(agentId, startDate, endDate, page = 1, limit = 10) {
    try {
      const query = `
        SELECT t.*, m.business_name
        FROM transactions t
        LEFT JOIN merchants m ON t.merchant_id = m.id
        WHERE t.agent_id = ? 
        AND t.created_at BETWEEN ? AND ?
        ORDER BY t.created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const offset = (page - 1) * limit;
      const [rows] = await db.execute(query, [
        agentId, 
        startDate, 
        endDate, 
        parseInt(limit), 
        parseInt(offset)
      ]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get transactions by advertiser ID
  static async findByAdvertiserId(advertiserId, startDate, endDate, page = 1, limit = 10) {
    try {
      const query = `
        SELECT t.*, c.name as campaign_name
        FROM transactions t
        LEFT JOIN campaigns c ON t.campaign_id = c.id
        WHERE t.advertiser_id = ? 
        AND t.created_at BETWEEN ? AND ?
        ORDER BY t.created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const offset = (page - 1) * limit;
      const [rows] = await db.execute(query, [
        advertiserId, 
        startDate, 
        endDate, 
        parseInt(limit), 
        parseInt(offset)
      ]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get revenue summary
  static async getRevenueSummary(startDate, endDate, groupBy = 'day') {
    try {
      let timeFormat;
      
      switch (groupBy) {
        case 'day':
          timeFormat = '%Y-%m-%d';
          break;
        case 'week':
          timeFormat = '%x-W%v'; // Year-Week format
          break;
        case 'month':
          timeFormat = '%Y-%m';
          break;
        case 'year':
          timeFormat = '%Y';
          break;
        default:
          timeFormat = '%Y-%m-%d';
      }
      
      const query = `
        SELECT 
          DATE_FORMAT(created_at, ?) as time_period,
          SUM(CASE WHEN type = 'ad_revenue' THEN amount ELSE 0 END) as ad_revenue,
          SUM(CASE WHEN type = 'merchant_payment' THEN amount ELSE 0 END) as merchant_payment,
          SUM(CASE WHEN type = 'agent_commission' THEN amount ELSE 0 END) as agent_commission,
          SUM(CASE WHEN type = 'advertiser_payment' THEN amount ELSE 0 END) as advertiser_payment
        FROM transactions
        WHERE created_at BETWEEN ? AND ?
        AND status = 'completed'
        GROUP BY time_period
        ORDER BY MIN(created_at)
      `;
      
      const [rows] = await db.execute(query, [timeFormat, startDate, endDate]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Transaction;