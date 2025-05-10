const { sql, poolPromise } = require('../config/database');

class SystemSettings {
  static async getByKey(key) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('key', sql.NVarChar, key)
        .query('SELECT * FROM system_settings WHERE setting_key = @key');
      return result.recordset.length ? result.recordset[0] : null;
    } catch (error) {
      console.error('Error fetching system setting:', error);
      throw error;
    }
  }

  static async getMultiple(keys) {
    try {
      const pool = await poolPromise;
      const placeholders = keys.map((_, i) => `@key${i}`).join(',');
      const request = pool.request();
      keys.forEach((key, i) => request.input(`key${i}`, sql.NVarChar, key));
      const result = await request.query(`SELECT * FROM system_settings WHERE setting_key IN (${placeholders})`);
      return result.recordset.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching multiple system settings:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM system_settings ORDER BY setting_key');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching all system settings:', error);
      throw error;
    }
  }

  static async upsert(key, value, description, updatedBy) {
    try {
      const existingSetting = await this.getByKey(key);
      const pool = await poolPromise;
      if (existingSetting) {
        const result = await pool
          .request()
          .input('key', sql.NVarChar, key)
          .input('value', sql.NVarChar, value)
          .input('description', sql.NVarChar, description)
          .input('updatedBy', sql.NVarChar, updatedBy)
          .query(`
            UPDATE system_settings
            SET setting_value = @value, description = @description, updated_by = @updatedBy
            WHERE setting_key = @key
          `);
        return { updated: true, id: existingSetting.id, affectedRows: result.rowsAffected[0] };
      } else {
        const result = await pool
          .request()
          .input('key', sql.NVarChar, key)
          .input('value', sql.NVarChar, value)
          .input('description', sql.NVarChar, description)
          .input('updatedBy', sql.NVarChar, updatedBy)
          .query(`
            INSERT INTO system_settings (setting_key, setting_value, description, updated_by)
            OUTPUT INSERTED.id
            VALUES (@key, @value, @description, @updatedBy)
          `);
        return { updated: false, id: result.recordset[0].id, affectedRows: result.rowsAffected[0] };
      }
    } catch (error) {
      console.error('Error upserting system setting:', error);
      throw error;
    }
  }

  static async delete(key) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('key', sql.NVarChar, key)
        .query('DELETE FROM system_settings WHERE setting_key = @key');
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting system setting:', error);
      throw error;
    }
  }
}

module.exports = SystemSettings;