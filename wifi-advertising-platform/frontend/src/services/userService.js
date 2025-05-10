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
  try {
    const response = await authAxios.get(`${API_URL}/dashboard`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Profile Services
 */

/**
 * Get user profile information
 * @returns {Promise<Object>} - User profile
 */
const getUserProfile = async () => {
  try {
    const response = await authAxios.get(`${API_URL}/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get authorized user profile
 * @returns {Promise<Object>} - User auth profile
 */
const getAuthUserProfile = async () => {
  try {
    const response = await authAxios.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile information
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Updated profile
 */
const updateUserProfile = async (profileData) => {
  try {
    const response = await authAxios.put(`${API_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get role-specific data
 * @param {string} role - User role
 * @returns {Promise<Object>} - Role specific data
 */
const getRoleSpecificData = async (role) => {
  try {
    const response = await authAxios.get(`${API_URL}/${role}-profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update role-specific data
 * @param {string} role - User role
 * @param {Object} roleData - Role specific data
 * @returns {Promise<Object>} - Updated role data
 */
const updateRoleSpecificData = async (role, roleData) => {
  try {
    const response = await authAxios.put(`${API_URL}/${role}-profile`, roleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Change user password
 * @param {Object} passwordData - Old and new password
 * @returns {Promise<Object>} - Password change response
 */
const changePassword = async (passwordData) => {
  try {
    const response = await authAxios.put(`${API_URL}/password`, passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Notification Services
 */

/**
 * Get user notifications
 * @returns {Promise<Object>} - Notifications list
 */
const getUserNotifications = async () => {
  try {
    const response = await authAxios.get(`${API_URL}/notifications`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} - Marked notification response
 */
const markNotificationRead = async (notificationId) => {
  try {
    const response = await authAxios.put(`${API_URL}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} - Response after marking all as read
 */
const markAllNotificationsRead = async () => {
  try {
    const response = await authAxios.put(`${API_URL}/notifications/read-all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} - Deletion response
 */
const deleteNotification = async (notificationId) => {
  try {
    const response = await authAxios.delete(`${API_URL}/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
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
  try {
    const response = await authAxios.put(`${API_URL}/settings`, settings);
    return response.data;
  } catch (error) {
    throw error;
  }
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
  try {
    const response = await authAxios.post(`${API_URL}/feedback`, feedback);
    return response.data;
  } catch (error) {
    throw error;
  }
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
  try {
    const response = await authAxios.get(`${API_URL}/transactions`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get transaction details by ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object>} - Transaction details
 */
const getTransactionDetails = async (transactionId) => {
  try {
    const response = await authAxios.get(`${API_URL}/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const userService = {
  // Dashboard Services
  getDashboard,
  
  // Profile Services
  getUserProfile,
  getAuthUserProfile,
  updateUserProfile,
  getRoleSpecificData,
  updateRoleSpecificData,
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