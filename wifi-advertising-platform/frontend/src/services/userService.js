// src/services/userService.js
import axios from 'axios';

const API_URL = '/api/user';

// Create axios instance with auth token
const authAxios = axios.create();

// Add auth token to requests
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Dashboard Services
 */

/**
 * Get user dashboard data
 * @returns {Promise<Object>} - Dashboard data
 */
const getDashboard = async () => {
  const response = await authAxios.get(`${API_URL}/dashboard`);
  return response.data;
};

/**
 * Profile Services
 */

/**
 * Get user profile information
 * @returns {Promise<Object>} - User profile
 */
const getUserProfile = async () => {
  const response = await authAxios.get(`${API_URL}/profile`);
  return response.data;
};

/**
 * Update user profile information
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Updated profile
 */
const updateUserProfile = async (profileData) => {
  const response = await authAxios.put(`${API_URL}/profile`, profileData);
  return response.data;
};

/**
 * Change user password
 * @param {Object} passwordData - Old and new password
 * @returns {Promise<Object>} - Password change response
 */
const changePassword = async (passwordData) => {
  const response = await authAxios.put(`${API_URL}/password`, passwordData);
  return response.data;
};

/**
 * Notification Services
 */

/**
 * Get user notifications
 * @returns {Promise<Object>} - Notifications list
 */
const getUserNotifications = async () => {
  const response = await authAxios.get(`${API_URL}/notifications`);
  return response.data;
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} - Marked notification response
 */
const markNotificationRead = async (notificationId) => {
  const response = await authAxios.put(`${API_URL}/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} - Response after marking all as read
 */
const markAllNotificationsRead = async () => {
  const response = await authAxios.put(`${API_URL}/notifications/read-all`);
  return response.data;
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} - Deletion response
 */
const deleteNotification = async (notificationId) => {
  const response = await authAxios.delete(`${API_URL}/notifications/${notificationId}`);
  return response.data;
};

/**
 * Settings Services
 */

/**
 * Update user settings and preferences
 * @param {Object} settings - User settings
 * @returns {Promise<Object>} - Updated settings
 */
const updateUserSettings = async (settings) => {
  const response = await authAxios.put(`${API_URL}/settings`, settings);
  return response.data;
};

/**
 * Feedback Services
 */

/**
 * Submit user feedback
 * @param {Object} feedback - User feedback
 * @returns {Promise<Object>} - Feedback submission response
 */
const submitFeedback = async (feedback) => {
  const response = await authAxios.post(`${API_URL}/feedback`, feedback);
  return response.data;
};

/**
 * Transaction Services
 */

/**
 * Get user transaction history
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Transaction history
 */
const getUserTransactions = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/transactions`, { params });
  return response.data;
};

/**
 * Get transaction details by ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object>} - Transaction details
 */
const getTransactionDetails = async (transactionId) => {
  const response = await authAxios.get(`${API_URL}/transactions/${transactionId}`);
  return response.data;
};

const userService = {
  // Dashboard Services
  getDashboard,
  
  // Profile Services
  getUserProfile,
  updateUserProfile,
  changePassword,
  
  // Notification Services
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  
  // Settings Services
  updateUserSettings,
  
  // Feedback Services
  submitFeedback,
  
  // Transaction Services
  getUserTransactions,
  getTransactionDetails
};

export default userService;