const mysql = require('mysql2/promise');
const db = require('../config/database');

class Merchant {
  constructor(merchantData) {
    this.id = merchantData.id;
    this.user_id = merchantData.user_id;
    this.business_name = merchantData.business_name;
    this.business_address = merchantData.business_address;
    this.business_phone = merchantData.business_phone;
    this.business_email = merchantData.business_email;
    this.business_category = merchantData.business_category;
    this.tax_id = merchantData.tax_id;
    this.logo_url = merchantData.logo_url;
    this.agent_id = merchantData.agent_id;
    this.approval_status = merchantData.approval_status || 'pending';
    this.created_at = merchantData.created_at;
    this.updated_at = merchantData.updated_at;
  }

  // Create a new merchant
  static async create(merchantData) {
    try {
      const query = `
        INSERT INTO merchants (
          user_id, business_name, business_address, business_phone, 
          business_email, business_category, tax_id, logo_url, agent_id, approval_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        merchantData.user_id,
        merchantData.business_name,
        merchantData.business_address,
        merchantData.business_phone,
        merchantData.business_email,
        merchantData.business_category,
        merchantData.tax_id,
        merchantData.logo_url,
        merchantData.agent_id,
        merchantData.approval_status || 'pending'
      ]);
      
      return { id: result.insertId, ...merchantData };
    } catch (error) {
      throw error;
    }
  }

  // Find merchant by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM merchants WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const merchantData = rows[0];
      return new Merchant(merchantData);
    } catch (error) {
      throw error;
    }
  }

  // Find merchant by user ID
  static async findByUserId(userId) {
    try {
      const query = 'SELECT * FROM merchants WHERE user_id = ?';
      const [rows] = await db.execute(query, [userId]);
      
      if (rows.length === 0) return null;
      
      const merchantData = rows[0];
      return new Merchant(merchantData);
    } catch (error) {
      throw error;
    }
  }

  // Get all merchants with optional filtering and pagination
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      let query = 'SELECT * FROM merchants WHERE 1=1';
      const params = [];
      
      if (filters.agent_id) {
        query += ' AND agent_id = ?';
        params.push(filters.agent_id);
      }
      
      if (filters.approval_status) {
        query += ' AND approval_status = ?';
        params.push(filters.approval_status);
      }
      
      if (filters.business_category) {
        query += ' AND business_category = ?';
        params.push(filters.business_category);
      }
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [rows] = await db.execute(query, params);
      
      return rows.map(row => new Merchant(row));
    } catch (error) {
      throw error;
    }
  }

  // Get merchant with user data joined
  static async findWithUserData(merchantId) {
    try {
      const query = `
        SELECT m.*, u.username, u.email, u.first_name, u.last_name, u.phone, u.status
        FROM merchants m
        JOIN users u ON m.user_id = u.id
        WHERE m.id = ?
      `;
      
      const [rows] = await db.execute(query, [merchantId]);
      
      if (rows.length === 0) return null;
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update merchant information
  static async update(id, updates) {
    try {
      const allowedUpdates = [
        'business_name', 'business_address', 'business_phone', 
        'business_email', 'business_category', 'tax_id',
        'logo_url', 'agent_id', 'approval_status'
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
      
      const query = `UPDATE merchants SET ${updateFields.join(', ')} WHERE id = ?`;
      updateValues.push(id);
      
      const [result] = await db.execute(query, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get merchants by agent
  static async findByAgentId(agentId, page = 1, limit = 10) {
    try {
      const query = `
        SELECT * FROM merchants 
        WHERE agent_id = ? 
        LIMIT ? OFFSET ?
      `;
      
      const offset = (page - 1) * limit;
      const [rows] = await db.execute(query, [agentId, parseInt(limit), parseInt(offset)]);
      
      return rows.map(row => new Merchant(row));
    } catch (error) {
      throw error;
    }
  }

  // Get count of merchants by approval status
  static async countByStatus() {
    try {
      const query = 'SELECT approval_status, COUNT(*) as count FROM merchants GROUP BY approval_status';
      const [rows] = await db.execute(query);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update merchant approval status
  static async updateApprovalStatus(id, status) {
    try {
      const query = 'UPDATE merchants SET approval_status = ? WHERE id = ?';
      const [result] = await db.execute(query, [status, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get merchant with WiFi settings
  static async findWithWiFiSettings(merchantId) {
    try {
      const query = `
        SELECT m.*, w.ssid, w.password, w.connection_limit, w.session_duration, 
               w.ads_before_access, w.redirect_url, w.terms_and_conditions
        FROM merchants m
        LEFT JOIN wifi_settings w ON m.id = w.merchant_id
        WHERE m.id = ?
      `;
      
      const [rows] = await db.execute(query, [merchantId]);
      
      if (rows.length === 0) return null;
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete a merchant
  static async delete(id) {
    try {
      const query = 'DELETE FROM merchants WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Merchant;