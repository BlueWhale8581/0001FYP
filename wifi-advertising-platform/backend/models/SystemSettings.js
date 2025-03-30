const db = require('../config/database');

class SystemSettings {
  // Get a specific setting by key
  static async getByKey(key) {
    try {
      const query = `
        SELECT * FROM system_settings
        WHERE setting_key = ?
      `;
      const [settings] = await db.execute(query, [key]);
      return settings.length ? settings[0] : null;
    } catch (error) {
      console.error('Error fetching system setting:', error);
      throw error;
    }
  }

  // Get multiple settings by keys
  static async getMultiple(keys) {
    try {
      const placeholders = keys.map(() => '?').join(',');
      const query = `
        SELECT * FROM system_settings
        WHERE setting_key IN (${placeholders})
      `;
      const [settings] = await db.execute(query, keys);
      
      // Convert array to object with key-value pairs
      return settings.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching multiple system settings:', error);
      throw error;
    }
  }

  // Get all system settings
  static async getAll() {
    try {
      const query = `
        SELECT * FROM system_settings
        ORDER BY setting_key
      `;
      const [settings] = await db.execute(query);
      return settings;
    } catch (error) {
      console.error('Error fetching all system settings:', error);
      throw error;
    }
  }

  // Update or create a setting
  static async upsert(key, value, description, updatedBy) {
    try {
      // Check if setting exists
      const existingSetting = await this.getByKey(key);
      
      if (existingSetting) {
        // Update existing setting
        const query = `
          UPDATE system_settings
          SET setting_value = ?, description = ?, updated_by = ?
          WHERE setting_key = ?
        `;
        const [result] = await db.execute(query, [value, description, updatedBy, key]);
        return { updated: true, id: existingSetting.id, affectedRows: result.affectedRows };
      } else {
        // Create new setting
        const query = `
          INSERT INTO system_settings (setting_key, setting_value, description, updated_by)
          VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [key, value, description, updatedBy]);
        return { updated: false, id: result.insertId, affectedRows: result.affectedRows };
      }
    } catch (error) {
      console.error('Error upserting system setting:', error);
      throw error;
    }
  }

  // Delete a setting
  static async delete(key) {
    try {
      const query = `
        DELETE FROM system_settings
        WHERE setting_key = ?
      `;
      const [result] = await db.execute(query, [key]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting system setting:', error);
      throw error;
    }
  }

  // Bulk update settings
  static async bulkUpdate(settings, updatedBy) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const results = [];
      
      for (const setting of settings) {
        const { key, value, description } = setting;
        const result = await this.upsert(key, value, description, updatedBy);
        results.push({ key, result });
      }
      
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      console.error('Error in bulk update of system settings:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = SystemSettings;