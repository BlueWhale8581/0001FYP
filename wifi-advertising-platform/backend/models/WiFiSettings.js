const { sql, poolPromise } = require('../config/database');

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

  static async create(settingsData) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('merchant_id', sql.Int, settingsData.merchant_id)
        .input('ssid', sql.NVarChar, settingsData.ssid)
        .input('password', sql.NVarChar, settingsData.password)
        .input('connection_limit', sql.Int, settingsData.connection_limit || 50)
        .input('session_duration', sql.Int, settingsData.session_duration || 60)
        .input('ads_before_access', sql.Bit, settingsData.ads_before_access !== undefined ? settingsData.ads_before_access : true)
        .input('redirect_url', sql.NVarChar, settingsData.redirect_url)
        .input('terms_and_conditions', sql.NVarChar, settingsData.terms_and_conditions)
        .query(`
          INSERT INTO wifi_settings (
            merchant_id, ssid, password, connection_limit, session_duration,
            ads_before_access, redirect_url, terms_and_conditions
          )
          OUTPUT INSERTED.id
          VALUES (@merchant_id, @ssid, @password, @connection_limit, @session_duration, @ads_before_access, @redirect_url, @terms_and_conditions)
        `);
      return { id: result.recordset[0].id, ...settingsData };
    } catch (error) {
      console.error('Error creating WiFi settings:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM wifi_settings WHERE id = @id');
      if (result.recordset.length === 0) return null;
      return new WiFiSettings(result.recordset[0]);
    } catch (error) {
      console.error('Error finding WiFi settings by ID:', error);
      throw error;
    }
  }

  static async findByMerchantId(merchantId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('merchant_id', sql.Int, merchantId)
        .query('SELECT * FROM wifi_settings WHERE merchant_id = @merchant_id');
      if (result.recordset.length === 0) return null;
      return new WiFiSettings(result.recordset[0]);
    } catch (error) {
      console.error('Error finding WiFi settings by merchant ID:', error);
      throw error;
    }
  }
}

module.exports = WiFiSettings;