// backend/services/auditService.js

const AuditLog = require('../models/AuditLog');

/**
 * Service for handling audit logging
 */
class AuditService {
  /**
   * Create an audit log entry
   * @param {Object} logData - Data for the audit log
   * @param {Number} logData.userId - ID of the user performing the action
   * @param {String} logData.action - Action performed (create, update, delete, etc.)
   * @param {String} logData.entityType - Type of entity (user, merchant, campaign, etc.)
   * @param {Number} logData.entityId - ID of the entity
   * @param {Object} logData.oldValues - Previous values (for updates)
   * @param {Object} logData.newValues - New values (for creates and updates)
   * @param {String} logData.ipAddress - IP address of the user
   * @returns {Object} Created audit log entry
   */
  async logActivity(logData) {
    try {
      return await AuditLog.create(logData);
    } catch (error) {
      console.error('Error creating audit log:', error);
      // Don't throw the error - audit logging should not block main operations
      return null;
    }
  }

  /**
   * Log a create operation
   * @param {Object} params - Parameters
   * @param {Number} params.userId - ID of the user performing the action
   * @param {String} params.entityType - Type of entity (user, merchant, campaign, etc.)
   * @param {Number} params.entityId - ID of the created entity
   * @param {Object} params.values - Values of the created entity
   * @param {String} params.ipAddress - IP address of the user
   * @returns {Object} Created audit log entry
   */
  async logCreation({ userId, entityType, entityId, values, ipAddress }) {
    return this.logActivity({
      userId,
      action: 'create',
      entityType,
      entityId,
      oldValues: null,
      newValues: values,
      ipAddress
    });
  }

  /**
   * Log an update operation
   * @param {Object} params - Parameters
   * @param {Number} params.userId - ID of the user performing the action
   * @param {String} params.entityType - Type of entity (user, merchant, campaign, etc.)
   * @param {Number} params.entityId - ID of the updated entity
   * @param {Object} params.oldValues - Previous values
   * @param {Object} params.newValues - New values
   * @param {String} params.ipAddress - IP address of the user
   * @returns {Object} Created audit log entry
   */
  async logUpdate({ userId, entityType, entityId, oldValues, newValues, ipAddress }) {
    return this.logActivity({
      userId,
      action: 'update',
      entityType,
      entityId,
      oldValues,
      newValues,
      ipAddress
    });
  }

  /**
   * Log a delete operation
   * @param {Object} params - Parameters
   * @param {Number} params.userId - ID of the user performing the action
   * @param {String} params.entityType - Type of entity (user, merchant, campaign, etc.)
   * @param {Number} params.entityId - ID of the deleted entity
   * @param {Object} params.values - Values of the deleted entity
   * @param {String} params.ipAddress - IP address of the user
   * @returns {Object} Created audit log entry
   */
  async logDeletion({ userId, entityType, entityId, values, ipAddress }) {
    return this.logActivity({
      userId,
      action: 'delete',
      entityType,
      entityId,
      oldValues: values,
      newValues: null,
      ipAddress
    });
  }

  /**
   * Log a status change operation
   * @param {Object} params - Parameters
   * @param {Number} params.userId - ID of the user performing the action
   * @param {String} params.entityType - Type of entity (merchant, campaign, etc.)
   * @param {Number} params.entityId - ID of the entity
   * @param {String} params.oldStatus - Previous status
   * @param {String} params.newStatus - New status
   * @param {String} params.ipAddress - IP address of the user
   * @returns {Object} Created audit log entry
   */
  async logStatusChange({ userId, entityType, entityId, oldStatus, newStatus, ipAddress }) {
    return this.logActivity({
      userId,
      action: 'status_change',
      entityType,
      entityId,
      oldValues: { status: oldStatus },
      newValues: { status: newStatus },
      ipAddress
    });
  }

  /**
   * Log a login attempt
   * @param {Object} params - Parameters
   * @param {Number} params.userId - ID of the user (null for failed logins)
   * @param {String} params.username - Username used for login attempt
   * @param {Boolean} params.success - Whether login was successful
   * @param {String} params.ipAddress - IP address of the user
   * @returns {Object} Created audit log entry
   */
  async logLoginAttempt({ userId, username, success, ipAddress }) {
    return this.logActivity({
      userId,
      action: success ? 'login_success' : 'login_failure',
      entityType: 'user',
      entityId: userId,
      oldValues: null,
      newValues: { username },
      ipAddress
    });
  }

  /**
   * Log a password change
   * @param {Object} params - Parameters
   * @param {Number} params.userId - ID of the user
   * @param {String} params.ipAddress - IP address of the user
   * @returns {Object} Created audit log entry
   */
  async logPasswordChange({ userId, ipAddress }) {
    return this.logActivity({
      userId,
      action: 'password_change',
      entityType: 'user',
      entityId: userId,
      oldValues: null,
      newValues: { password_changed: new Date() },
      ipAddress
    });
  }

  /**
   * Log a system setting change
   * @param {Object} params - Parameters
   * @param {Number} params.userId - ID of the user
   * @param {String} params.key - Key of the system setting
   * @param {*} params.oldValue - Previous value
   * @param {*} params.newValue - New value
   * @param {String} params.ipAddress - IP address of the user
   * @returns {Object} Created audit log entry
   */
  async logSettingChange({ userId, key, oldValue, newValue, ipAddress }) {
    return this.logActivity({
      userId,
      action: 'setting_change',
      entityType: 'system_setting',
      entityId: null,
      oldValues: { [key]: oldValue },
      newValues: { [key]: newValue },
      ipAddress
    });
  }

  /**
   * Log user account actions (suspensions, activations, etc.)
   * @param {Object} params - Parameters
   * @param {Number} params.adminId - ID of the admin user performing the action
   * @param {Number} params.targetUserId - ID of the target user
   * @param {String} params.action - Specific action (suspend, activate, etc.)
   * @param {String} params.reason - Reason for the action
   * @param {String} params.ipAddress - IP address of the admin
   * @returns {Object} Created audit log entry
   */
  async logUserAccountAction({ adminId, targetUserId, action, reason, ipAddress }) {
    return this.logActivity({
      userId: adminId,
      action: `user_${action}`,
      entityType: 'user',
      entityId: targetUserId,
      oldValues: null,
      newValues: { reason },
      ipAddress
    });
  }

  /**
   * Log a bulk operation
   * @param {Object} params - Parameters
   * @param {Number} params.userId - ID of the user
   * @param {String} params.action - Action performed (bulk_create, bulk_update, etc.)
   * @param {String} params.entityType - Type of entities
   * @param {Array} params.entityIds - IDs of affected entities
   * @param {String} params.description - Description of the bulk operation
   * @param {String} params.ipAddress - IP address of the user
   * @returns {Object} Created audit log entry
   */
  async logBulkOperation({ userId, action, entityType, entityIds, description, ipAddress }) {
    return this.logActivity({
      userId,
      action: `bulk_${action}`,
      entityType,
      entityId: null, // No single entity ID for bulk operations
      oldValues: null,
      newValues: { entityIds, description },
      ipAddress
    });
  }

  /**
   * Get audit logs for a specific entity
   * @param {String} entityType - Type of entity
   * @param {Number} entityId - ID of the entity
   * @param {Object} options - Query options (limit, offset, etc.)
   * @returns {Array} Audit logs for the entity
   */
  async getEntityAuditTrail(entityType, entityId, options = {}) {
    try {
      return await AuditLog.getByEntity(entityType, entityId, options);
    } catch (error) {
      console.error(`Error fetching audit trail for ${entityType} ${entityId}:`, error);
      throw new Error('Failed to retrieve audit trail');
    }
  }

  /**
   * Get audit logs for a specific user's actions
   * @param {Number} userId - ID of the user
   * @param {Object} options - Query options (limit, offset, etc.)
   * @returns {Array} Audit logs for the user's actions
   */
  async getUserActivityLog(userId, options = {}) {
    try {
      return await AuditLog.getAll({ userId, ...options });
    } catch (error) {
      console.error(`Error fetching activity log for user ${userId}:`, error);
      throw new Error('Failed to retrieve user activity log');
    }
  }

  /**
   * Get system-wide audit logs
   * @param {Object} filters - Filters to apply
   * @param {Object} options - Query options (limit, offset, sort, etc.)
   * @returns {Object} Audit logs and count
   */
  async getSystemAuditLogs(filters = {}, options = {}) {
     try {
       const [logs, count] = await Promise.all([
         AuditLog.getAll({ ...filters, ...options }),
         AuditLog.getCount(filters)
       ]);
       
       return {
         logs,
         total: count,
         page: options.page || 1,
         limit: options.limit || 20
       };
     } catch (error) {
       console.error('Error fetching system audit logs:', error);
       throw new Error('Failed to retrieve system audit logs');
     }
   }
 
   /**
    * Compare old and new values to determine what changed
    * @param {Object} oldValues - Previous values
    * @param {Object} newValues - New values
    * @returns {Object} Changes with old and new values for each changed field
    */
   getChanges(oldValues, newValues) {
     if (!oldValues) return { type: 'creation', changes: newValues };
     if (!newValues) return { type: 'deletion', changes: oldValues };
     
     const changes = {};
     let hasChanges = false;
     
     // Find all changed fields
     for (const key in newValues) {
       // Skip if key doesn't exist in old values
       if (!(key in oldValues)) {
         changes[key] = { new: newValues[key], old: undefined };
         hasChanges = true;
         continue;
       }
       
       // Compare values
       const oldVal = oldValues[key];
       const newVal = newValues[key];
       
       // Handle deep object comparison
       if (typeof oldVal === 'object' && oldVal !== null && 
           typeof newVal === 'object' && newVal !== null) {
         
         // For arrays, simply check if they're different (don't go into details)
         if (Array.isArray(oldVal) && Array.isArray(newVal)) {
           if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
             changes[key] = { old: oldVal, new: newVal };
             hasChanges = true;
           }
         } else {
           // For objects, recursively find changes
           const nestedChanges = this.getChanges(oldVal, newVal);
           if (nestedChanges.changes && Object.keys(nestedChanges.changes).length > 0) {
             changes[key] = nestedChanges.changes;
             hasChanges = true;
           }
         }
       } else if (oldVal !== newVal) {
         // Simple value comparison
         changes[key] = { old: oldVal, new: newVal };
         hasChanges = true;
       }
     }
     
     // Find keys that were in old values but removed in new values
     for (const key in oldValues) {
       if (!(key in newValues)) {
         changes[key] = { old: oldValues[key], new: undefined };
         hasChanges = true;
       }
     }
     
     return { 
       type: 'update',
       changes: hasChanges ? changes : {},
       hasChanges
     };
   }
 
   /**
    * Format changes for human-readable output
    * @param {Object} auditLog - Audit log entry
    * @returns {Object} Formatted changes
    */
   formatChangesForDisplay(auditLog) {
     const { action, oldValues, newValues } = auditLog;
     
     let formattedChanges = {
       action,
       timestamp: auditLog.created_at,
       changes: []
     };
     
     // Skip formatting for certain actions
     if (['login_success', 'login_failure', 'password_change'].includes(action)) {
       return formattedChanges;
     }
     
     const changes = this.getChanges(oldValues, newValues);
     
     // Format each change
     for (const key in changes.changes) {
       const change = changes.changes[key];
       
       // Skip internal or sensitive fields
       if (['password', 'salt', '__v'].includes(key)) continue;
       
       formattedChanges.changes.push({
         field: key,
         oldValue: change.old,
         newValue: change.new
       });
     }
     
     return formattedChanges;
   }
 
   /**
    * Sanitize sensitive data from audit logs
    * @param {Object} values - Values to sanitize
    * @returns {Object} Sanitized values
    * @private
    */
   _sanitizeValues(values) {
     if (!values) return null;
     
     const sanitized = { ...values };
     
     // Remove sensitive fields
     const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
     sensitiveFields.forEach(field => {
       if (field in sanitized) {
         sanitized[field] = '[REDACTED]';
       }
     });
     
     return sanitized;
   }
 }
 
 module.exports = new AuditService();