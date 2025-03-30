const mysql = require('mysql2/promise');
const db = require('../config/database');

class Agent {
  constructor(agentData) {
    this.id = agentData.id;
    this.user_id = agentData.user_id;
    this.commission_rate = agentData.commission_rate;
    this.territory = agentData.territory;
    this.created_at = agentData.created_at;
    this.updated_at = agentData.updated_at;
  }

  // Create a new agent
  static async create(agentData) {
    try {
      const query = `
        INSERT INTO agents (user_id, commission_rate, territory)
        VALUES (?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        agentData.user_id,
        agentData.commission_rate || 0.00,
        agentData.territory
      ]);
      
      return { id: result.insertId, ...agentData };
    } catch (error) {
      throw error;
    }
  }

  // Find agent by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM agents WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const agentData = rows[0];
      return new Agent(agentData);
    } catch (error) {
      throw error;
    }
  }

  // Find agent by user ID
  static async findByUserId(userId) {
    try {
      const query = 'SELECT * FROM agents WHERE user_id = ?';
      const [rows] = await db.execute(query, [userId]);
      
      if (rows.length === 0) return null;
      
      const agentData = rows[0];
      return new Agent(agentData);
    } catch (error) {
      throw error;
    }
  }

  // Get all agents with optional filtering and pagination
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      let query = 'SELECT * FROM agents WHERE 1=1';
      const params = [];
      
      if (filters.territory) {
        query += ' AND territory = ?';
        params.push(filters.territory);
      }
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [rows] = await db.execute(query, params);
      
      return rows.map(row => new Agent(row));
    } catch (error) {
      throw error;
    }
  }

  // Get agent with user data joined
  static async findWithUserData(agentId) {
    try {
      const query = `
        SELECT a.*, u.username, u.email, u.first_name, u.last_name, u.phone, u.status
        FROM agents a
        JOIN users u ON a.user_id = u.id
        WHERE a.id = ?
      `;
      
      const [rows] = await db.execute(query, [agentId]);
      
      if (rows.length === 0) return null;
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update agent information
  static async update(id, updates) {
    try {
      const allowedUpdates = ['commission_rate', 'territory'];
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
      
      const query = `UPDATE agents SET ${updateFields.join(', ')} WHERE id = ?`;
      updateValues.push(id);
      
      const [result] = await db.execute(query, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get agent performance metrics
  static async getPerformanceMetrics(agentId, startDate, endDate) {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT m.id) as total_merchants,
          SUM(CASE WHEN m.approval_status = 'approved' THEN 1 ELSE 0 END) as approved_merchants,
          COUNT(DISTINCT q.id) as total_qr_codes,
          COUNT(DISTINCT t.id) as total_transactions,
          SUM(t.amount) as total_commission
        FROM agents a
        LEFT JOIN merchants m ON a.id = m.agent_id
        LEFT JOIN qr_codes q ON m.id = q.merchant_id
        LEFT JOIN transactions t ON a.id = t.agent_id AND t.type = 'agent_commission'
          AND t.created_at BETWEEN ? AND ?
        WHERE a.id = ?
        GROUP BY a.id
      `;
      
      const [rows] = await db.execute(query, [startDate, endDate, agentId]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Get agent commission history
  static async getCommissionHistory(agentId, page = 1, limit = 10) {
    try {
      const query = `
        SELECT t.*, m.business_name
        FROM transactions t
        LEFT JOIN merchants m ON t.merchant_id = m.id
        WHERE t.agent_id = ? AND t.type = 'agent_commission'
        ORDER BY t.created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const offset = (page - 1) * limit;
      const [rows] = await db.execute(query, [agentId, parseInt(limit), parseInt(offset)]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete an agent
  static async delete(id) {
    try {
      const query = 'DELETE FROM agents WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Agent;