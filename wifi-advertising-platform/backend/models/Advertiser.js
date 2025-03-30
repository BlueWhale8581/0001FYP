const mysql = require('mysql2/promise');
const db = require('../config/database');

class Advertiser {
  constructor(advertiserData) {
    this.id = advertiserData.id;
    this.user_id = advertiserData.user_id;
    this.company_name = advertiserData.company_name;
    this.company_address = advertiserData.company_address;
    this.company_phone = advertiserData.company_phone;
    this.company_email = advertiserData.company_email;
    this.industry = advertiserData.industry;
    this.created_at = advertiserData.created_at;
    this.updated_at = advertiserData.updated_at;
  }

  // Create a new advertiser
  static async create(advertiserData) {
    try {
      const query = `
        INSERT INTO advertisers (
          user_id, company_name, company_address, company_phone, 
          company_email, industry
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        advertiserData.user_id,
        advertiserData.company_name,
        advertiserData.company_address,
        advertiserData.company_phone,
        advertiserData.company_email,
        advertiserData.industry
      ]);
      
      return { id: result.insertId, ...advertiserData };
    } catch (error) {
      throw error;
    }
  }

  // Find advertiser by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM advertisers WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const advertiserData = rows[0];
      return new Advertiser(advertiserData);
    } catch (error) {
      throw error;
    }
  }

  // Find advertiser by user ID
  static async findByUserId(userId) {
    try {
      const query = 'SELECT * FROM advertisers WHERE user_id = ?';
      const [rows] = await db.execute(query, [userId]);
      
      if (rows.length === 0) return null;
      
      const advertiserData = rows[0];
      return new Advertiser(advertiserData);
    } catch (error) {
      throw error;
    }
  }

  // Get all advertisers with optional filtering and pagination
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      let query = 'SELECT * FROM advertisers WHERE 1=1';
      const params = [];
      
      if (filters.industry) {
        query += ' AND industry = ?';
        params.push(filters.industry);
      }
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [rows] = await db.execute(query, params);
      
      return rows.map(row => new Advertiser(row));
    } catch (error) {
      throw error;
    }
  }

  // Get advertiser with user data joined
  static async findWithUserData(advertiserId) {
    try {
      const query = `
        SELECT a.*, u.username, u.email, u.first_name, u.last_name, u.phone, u.status
        FROM advertisers a
        JOIN users u ON a.user_id = u.id
        WHERE a.id = ?
      `;
      
      const [rows] = await db.execute(query, [advertiserId]);
      
      if (rows.length === 0) return null;
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update advertiser information
  static async update(id, updates) {
    try {
      const allowedUpdates = [
        'company_name', 'company_address', 'company_phone', 
        'company_email', 'industry'
      ];
      
      const updateFields = [];
      const updateValues = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key) && value !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
      
      if (updateFields.length === 0) {
        return false;
      }
      
      const query = `UPDATE advertisers SET ${updateFields.join(', ')} WHERE id = ?`;
      updateValues.push(id);
      
      const [result] = await db.execute(query, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get advertiser performance metrics
  static async getPerformanceMetrics(advertiserId, startDate, endDate) {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT c.id) as total_campaigns,
          SUM(c.budget) as total_budget,
          SUM(c.spent) as total_spent,
          COUNT(DISTINCT a.id) as total_ads,
          COUNT(DISTINCT ai.id) as total_impressions,
          SUM(CASE WHEN ai.completed = 1 THEN 1 ELSE 0 END) as completed_views
        FROM advertisers adv
        LEFT JOIN campaigns c ON adv.id = c.advertiser_id
        LEFT JOIN ads a ON c.id = a.campaign_id
        LEFT JOIN ad_impressions ai ON a.id = ai.ad_id
          AND ai.view_time BETWEEN ? AND ?
        WHERE adv.id = ?
        GROUP BY adv.id
      `;
      
      const [rows] = await db.execute(query, [startDate, endDate, advertiserId]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Get advertiser active campaigns
  static async getActiveCampaigns(advertiserId) {
    try {
      const query = `
        SELECT * FROM campaigns 
        WHERE advertiser_id = ? 
        AND status = 'active' 
        AND start_date <= CURDATE() 
        AND end_date >= CURDATE()
      `;
      
      const [rows] = await db.execute(query, [advertiserId]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get advertiser payment history
  static async getPaymentHistory(advertiserId, page = 1, limit = 10) {
    try {
      const query = `
        SELECT * FROM transactions
        WHERE advertiser_id = ? AND type = 'advertiser_payment'
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const offset = (page - 1) * limit;
      const [rows] = await db.execute(query, [advertiserId, parseInt(limit), parseInt(offset)]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete an advertiser
  static async delete(id) {
    try {
      const query = 'DELETE FROM advertisers WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Advertiser;