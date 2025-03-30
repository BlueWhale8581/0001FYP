const mysql = require('mysql2/promise');
const db = require('../config/database');

class WiFiAccess {
  constructor(accessData) {
    this.id = accessData.id;
    this.merchant_id = accessData.merchant_id;
    this.user_id = accessData.user_id;
    this.device_mac = accessData.device_mac;
    this.connection_time = accessData.connection_time;
    this.disconnection_time = accessData.disconnection_time;
    this.ads_viewed = accessData.ads_viewed || 0;
    this.ip_address = accessData.ip_address;
    this.user_agent = accessData.user_agent;
  }

  // Create a new WiFi access log
  static async create(accessData) {
    try {
      const query = `
        INSERT INTO wifi_access_logs (
          merchant_id, user_id, device_mac, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        accessData.merchant_id,
        accessData.user_id || null,
        accessData.device_mac,
        accessData.ip_address,
        accessData.user_agent
      ]);
      
      return { id: result.insertId, ...accessData };
    } catch (error) {
      throw error;
    }
  }

  // Find access log by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM wifi_access_logs WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const accessData = rows[0];
      return new WiFiAccess(accessData);
    } catch (error) {
      throw error;
    }
  }

  // End a WiFi session
  static async endSession(id) {
    try {
      const query = 'UPDATE wifi_access_logs SET disconnection_time = CURRENT_TIMESTAMP WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update ads viewed count
  static async updateAdsViewed(id, count = 1) {
    try {
      const query = 'UPDATE wifi_access_logs SET ads_viewed = ads_viewed + ? WHERE id = ?';
      const [result] = await db.execute(query, [count, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all access logs for a merchant with optional filtering and pagination
  static async findByMerchantId(merchantId, filters = {}, page = 1, limit = 10) {
    try {
      let query = 'SELECT * FROM wifi_access_logs WHERE merchant_id = ?';
      const params = [merchantId];
      
      if (filters.active === true) {
        query += ' AND disconnection_time IS NULL';
      }
      
      if (filters.startDate && filters.endDate) {
        query += ' AND connection_time BETWEEN ? AND ?';
        params.push(filters.startDate, filters.endDate);
      }
      
      // Add sorting
      query += ' ORDER BY connection_time DESC';
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [rows] = await db.execute(query, params);
      
      return rows.map(row => new WiFiAccess(row));
    } catch (error) {
      throw error;
    }
  }

  // Get WiFi usage statistics for a merchant
  static async getUsageStatistics(merchantId, startDate, endDate) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_connections,
          COUNT(DISTINCT device_mac) as unique_devices,
          COUNT(DISTINCT user_id) as registered_users,
          AVG(TIME_TO_SEC(TIMEDIFF(IFNULL(disconnection_time, NOW()), connection_time)))/60 as avg_session_minutes,
          SUM(ads_viewed) as total_ads_viewed
        FROM wifi_access_logs
        WHERE merchant_id = ? AND connection_time BETWEEN ? AND ?
      `;
      
      const [rows] = await db.execute(query, [merchantId, startDate, endDate]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Get daily connection counts for a time period
  static async getDailyConnectionCounts(merchantId, startDate, endDate) {
    try {
      const query = `
        SELECT 
          DATE(connection_time) as date,
          COUNT(*) as connection_count
        FROM wifi_access_logs
        WHERE merchant_id = ? AND connection_time BETWEEN ? AND ?
        GROUP BY DATE(connection_time)
        ORDER BY DATE(connection_time)
      `;
      
      const [rows] = await db.execute(query, [merchantId, startDate, endDate]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Check if device is already connected
  static async isDeviceConnected(merchantId, deviceMac) {
    try {
      const query = `
        SELECT COUNT(*) as connection_count
        FROM wifi_access_logs
        WHERE merchant_id = ? AND device_mac = ? AND disconnection_time IS NULL
      `;
      
      const [rows] = await db.execute(query, [merchantId, deviceMac]);
      
      return rows[0].connection_count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WiFiAccess;