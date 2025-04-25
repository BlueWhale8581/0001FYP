const { sql, poolPromise } = require('../config/database');

class Notification {
  // Create a new notification
  static async create(userId, title, message, type = 'info') {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('user_id', sql.Int, userId)
        .input('title', sql.NVarChar, title)
        .input('message', sql.NVarChar, message)
        .input('type', sql.NVarChar, type)
        .query(`
          INSERT INTO notifications (user_id, title, message, type)
          OUTPUT INSERTED.id
          VALUES (@user_id, @title, @message, @type)
        `);
      return result.recordset[0].id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get notifications for a specific user
  static async getByUserId(userId, options = {}) {
    try {
      let query = `
        SELECT * FROM notifications 
        WHERE user_id = ?
      `;
      
      const params = [userId];
      
      // Add filter for read/unread if specified
      if (options.unreadOnly) {
        query += ' AND is_read = false';
      }
      
      // Add ordering
      query += ' ORDER BY created_at DESC';
      
      // Add limit if specified
      if (options.limit) {
        query += ' LIMIT ?';
        params.push(options.limit);
      }
      
      const [notifications] = await db.execute(query, params);
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark a notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const query = `
        UPDATE notifications 
        SET is_read = true 
        WHERE id = ? AND user_id = ?
      `;
      const [result] = await db.execute(query, [notificationId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    try {
      const query = `
        UPDATE notifications 
        SET is_read = true 
        WHERE user_id = ? AND is_read = false
      `;
      const [result] = await db.execute(query, [userId]);
      return result.affectedRows;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete a notification
  static async delete(notificationId, userId) {
    try {
      const query = `
        DELETE FROM notifications 
        WHERE id = ? AND user_id = ?
      `;
      const [result] = await db.execute(query, [notificationId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Get unread count for a user
  static async getUnreadCount(userId) {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM notifications 
        WHERE user_id = ? AND is_read = false
      `;
      const [result] = await db.execute(query, [userId]);
      return result[0].count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
}

module.exports = Notification;