const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Service for handling system notifications
 */
class NotificationService {
  /**
   * Create a new notification for a specific user
   * 
   * @param {number} userId - The ID of the user to notify
   * @param {string} title - The notification title
   * @param {string} message - The notification message
   * @param {string} type - The notification type (info, success, warning, error)
   * @returns {Promise<object>} The created notification
   */
  async createNotification(userId, title, message, type = 'info') {
    try {
      // Verify the user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      return await Notification.create({
        user_id: userId,
        title,
        message,
        type
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Create notifications for multiple users
   * 
   * @param {Array<number>} userIds - Array of user IDs
   * @param {string} title - The notification title
   * @param {string} message - The notification message
   * @param {string} type - The notification type (info, success, warning, error)
   * @returns {Promise<Array>} Created notifications
   */
  async createBulkNotifications(userIds, title, message, type = 'info') {
    try {
      const notifications = [];
      
      for (const userId of userIds) {
        const notification = await this.createNotification(userId, title, message, type);
        notifications.push(notification);
      }
      
      return notifications;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  /**
   * Create notifications for all users with a specific role
   * 
   * @param {string} role - The user role (admin, agent, advertiser, merchant)
   * @param {string} title - The notification title
   * @param {string} message - The notification message
   * @param {string} type - The notification type (info, success, warning, error)
   * @returns {Promise<Array>} Created notifications
   */
  async notifyUsersByRole(role, title, message, type = 'info') {
    try {
      const users = await User.findAll({ role });
      const userIds = users.map(user => user.id);
      
      return await this.createBulkNotifications(userIds, title, message, type);
    } catch (error) {
      console.error(`Error notifying users with role ${role}:`, error);
      throw error;
    }
  }

  /**
   * Get unread notifications for a user
   * 
   * @param {number} userId - The user ID
   * @param {number} limit - Maximum number of notifications to return
   * @returns {Promise<Array>} Unread notifications
   */
  async getUnreadNotifications(userId, limit = 10) {
    try {
      const notifications = await Notification.getByUserId(userId, { 
        isRead: false,
        limit
      });
      
      return notifications;
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   * 
   * @param {number} notificationId - The notification ID
   * @param {number} userId - The user ID (for security verification)
   * @returns {Promise<boolean>} Success status
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findById(notificationId);
      
      if (!notification) {
        throw new Error(`Notification with ID ${notificationId} not found`);
      }
      
      // Security check - ensure the notification belongs to the user
      if (notification.user_id !== userId) {
        throw new Error('Unauthorized access to notification');
      }
      
      return await Notification.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   * 
   * @param {number} userId - The user ID
   * @returns {Promise<boolean>} Success status
   */
  async markAllAsRead(userId) {
    try {
      return await Notification.markAllAsRead(userId);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * 
   * @param {number} notificationId - The notification ID
   * @param {number} userId - The user ID (for security verification)
   * @returns {Promise<boolean>} Success status
   */
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findById(notificationId);
      
      if (!notification) {
        throw new Error(`Notification with ID ${notificationId} not found`);
      }
      
      // Security check - ensure the notification belongs to the user
      if (notification.user_id !== userId) {
        throw new Error('Unauthorized access to notification');
      }
      
      return await Notification.delete(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();