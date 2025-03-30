const db = require('../config/database');

class AuditLog {
  // Create a new audit log entry
  static async create(logData) {
    try {
      const {
        userId,
        action,
        entityType,
        entityId,
        oldValues,
        newValues,
        ipAddress
      } = logData;

      // Convert objects to JSON strings if they're not already
      const oldValuesJson = typeof oldValues === 'string' ? oldValues : JSON.stringify(oldValues || null);
      const newValuesJson = typeof newValues === 'string' ? newValues : JSON.stringify(newValues || null);

      const query = `
        INSERT INTO audit_logs 
        (user_id, action, entity_type, entity_id, old_values, new_values, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [
        userId || null,
        action,
        entityType,
        entityId || null,
        oldValuesJson,
        newValuesJson,
        ipAddress || null
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw error;
    }
  }

  // Get audit logs with flexible filtering
  static async getAll(filters = {}, pagination = {}) {
    try {
      let query = `
        SELECT al.*, u.username 
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id
        WHERE 1=1
      `;
      
      const queryParams = [];
      
      // Apply filters
      if (filters.userId) {
        query += ' AND al.user_id = ?';
        queryParams.push(filters.userId);
      }
      
      if (filters.action) {
        query += ' AND al.action = ?';
        queryParams.push(filters.action);
      }
      
      if (filters.entityType) {
        query += ' AND al.entity_type = ?';
        queryParams.push(filters.entityType);
      }
      
      if (filters.entityId) {
        query += ' AND al.entity_id = ?';
        queryParams.push(filters.entityId);
      }
      
      if (filters.startDate) {
        query += ' AND al.created_at >= ?';
        queryParams.push(filters.startDate);
      }
      
      if (filters.endDate) {
        query += ' AND al.created_at <= ?';
        queryParams.push(filters.endDate);
      }
      
      if (filters.ipAddress) {
        query += ' AND al.ip_address = ?';
        queryParams.push(filters.ipAddress);
      }
      
      // Apply sorting
      query += ' ORDER BY al.created_at DESC';
      
      // Apply pagination
      if (pagination.limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(pagination.limit));
        
        if (pagination.offset) {
          query += ' OFFSET ?';
          queryParams.push(parseInt(pagination.offset));
        }
      }
      
      const [logs] = await db.execute(query, queryParams);
      
      // Parse JSON strings to objects
      return logs.map(log => ({
        ...log,
        old_values: log.old_values ? JSON.parse(log.old_values) : null,
        new_values: log.new_values ? JSON.parse(log.new_values) : null
      }));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  // Get audit log count (for pagination)
  static async getCount(filters = {}) {
    try {
      let query = `
        SELECT COUNT(*) as count 
        FROM audit_logs 
        WHERE 1=1
      `;
      
      const queryParams = [];
      
      // Apply the same filters as getAll
      if (filters.userId) {
        query += ' AND user_id = ?';
        queryParams.push(filters.userId);
      }
      
      if (filters.action) {
        query += ' AND action = ?';
        queryParams.push(filters.action);
      }
      
      if (filters.entityType) {
        query += ' AND entity_type = ?';
        queryParams.push(filters.entityType);
      }
      
      if (filters.entityId) {
        query += ' AND entity_id = ?';
        queryParams.push(filters.entityId);
      }
      
      if (filters.startDate) {
        query += ' AND created_at >= ?';
        queryParams.push(filters.startDate);
      }
      
      if (filters.endDate) {
        query += ' AND created_at <= ?';
        queryParams.push(filters.endDate);
      }
      
      if (filters.ipAddress) {
        query += ' AND ip_address = ?';
        queryParams.push(filters.ipAddress);
      }
      
      const [result] = await db.execute(query, queryParams);
      return result[0].count;
    } catch (error) {
      console.error('Error counting audit logs:', error);
      throw error;
    }
  }

  // Get logs for a specific entity
  static async getByEntity(entityType, entityId) {
    try {
      const query = `
        SELECT al.*, u.username 
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id
        WHERE al.entity_type = ? AND al.entity_id = ?
        ORDER BY al.created_at DESC
      `;
      
      const [logs] = await db.execute(query, [entityType, entityId]);
      
      // Parse JSON strings to objects
      return logs.map(log => ({
        ...log,
        old_values: log.old_values ? JSON.parse(log.old_values) : null,
        new_values: log.new_values ? JSON.parse(log.new_values) : null
      }));
    } catch (error) {
      console.error('Error fetching entity audit logs:', error);
      throw error;
    }
  }

  // Helper method to log changes to an entity
  static async logChanges(userId, action, entityType, entityId, oldValues, newValues, ipAddress) {
    return this.create({
      userId,
      action,
      entityType, 
      entityId,
      oldValues,
      newValues,
      ipAddress
    });
  }
}

module.exports = AuditLog;