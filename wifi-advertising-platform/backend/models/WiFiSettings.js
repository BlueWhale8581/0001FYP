const mysql = require('mysql2/promise');
const db = require('../config/database');

class WiFiSettings {
  constructor(settingsData) {
    this.id = settingsData.id;
    this.merchant_id = settingsData.merchant_id;
    this.ssid = settingsData.ssid;
    this.password = settingsData.password;
    this.connection_limit = settingsData.connection_limit || 50;
    this.session_duration = settingsData.session_duration || 60;
    this.ads_before_access = settingsData.ads_before_access !== undefined ? settingsData.ads_before_access : true;
    this.redirect_url = settingsData.redirect_url;
    this.terms_and_conditions = settingsData.terms_and_conditions;
    this.created_at = settingsData.created_at;
    this.updated_at = settingsData.updated_at;
  }

  // Create new WiFi settings
  static async create(settingsData) {
    try {
      const query = `
        INSERT INTO wifi_settings (
          merchant_id, ssid, password, connection_limit, session_duration,
          ads_before_access, redirect_url, terms_and_conditions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        settingsData.merchant_id,
        settingsData.ssid,
        settingsData.password,
        settingsData.connection_limit || 50,
        settingsData.session_duration || 60,
        settingsData.ads_before_access !== undefined ? settingsData.ads_before_access : true,
        settingsData.redirect_url,
        settingsData.terms_and_conditions
      ]);
      
      return { id: result.insertId, ...settingsData };
    } catch (error) {
      throw error;
    }
  }

  // Find WiFi settings by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM wifi_settings WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) return null;
      
      const settingsData = rows[0];
      return new WiFiSettings(settingsData);
    } catch (error) {
      throw error;
    }
  }

  // Find WiFi settings by merchant ID
  static async findByMerchantId(merchantId) {
    try {
      const query = 'SELECT * FROM wifi_settings WHERE merchant_id = ?';
      const [rows] = await db.execute(query, [merchantId]);
      
      if (rows.length === 0) return null;
      
      const settingsData = rows[0];
      return new WiFiSettings(settingsData);
    } catch (error) {
      throw error;
    }
  }

  // Update WiFi settings
  static async update(merchantId, updates) {
    try {
      // Check if settings exist for this merchant
      const existingSettings = await this.findByMerchantId(merchantId);
      
      if (!existingSettings) {
        // If no settings exist, create new settings
        return await this.create({ merchant_id: merchantId, ...updates });
      }
      
      const allowedUpdates = [
        'ssid', 'password', 'connection_limit', 'session_duration',
        'ads_before_access', 'redirect_url', 'terms_and_conditions'
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
      
      const query = `UPDATE wifi_settings SET ${updateFields.join(', ')} WHERE merchant_id = ?`;
      updateValues.push(merchantId);
      
      const [result] = await db.execute(query, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get current WiFi connections count
  static async getCurrentConnectionsCount(merchantId) {
    try {
      const query = `
        SELECT COUNT(*) as connection_count
        FROM wifi_access_logs
        WHERE merchant_id = ? AND disconnection_time IS NULL
      `;
      
      const [rows] = await db.execute(query, [merchantId]);
      
      return rows[0].connection_count;
    } catch (error) {
      throw error;
    }
  }

  // Check if connection limit reached
  static async isConnectionLimitReached(merchantId) {
    try {
      const settings = await this.findByMerchantId(merchantId);
      if (!settings) return true; // If no settings, consider limit reached
      
      const currentConnections = await this.getCurrentConnectionsCount(merchantId);
      return currentConnections >= settings.connection_limit;
    } catch (error) {
      throw error;
    }
  }

  // Delete WiFi settings
  static async delete(merchantId) {
    try {
      const query = 'DELETE FROM wifi_settings WHERE merchant_id = ?';
      const [result] = await db.execute(query, [merchantId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WiFiSettings;