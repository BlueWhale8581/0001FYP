// src/services/adminService.js
import axios from 'axios';

const API_URL = '/api/admin';

// Axios instance with auth token
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
const getDashboardStats = async () => {
  const response = await authAxios.get(`${API_URL}/dashboard/stats`);
  return response.data;
};

const getSystemMetrics = async () => {
  const response = await authAxios.get(`${API_URL}/dashboard/metrics`);
  return response.data;
};

const getNotifications = async () => {
  const response = await authAxios.get(`${API_URL}/notifications`);
  return response.data;
};

const getAlerts = async () => {
  const response = await authAxios.get(`${API_URL}/alerts`);
  return response.data;
};

/**
 * User Management Services
 */
const getAllUsers = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/users`, { params });
  return response.data;
};

const createUser = async (userData) => {
  const response = await authAxios.post(`${API_URL}/users`, userData);
  return response.data;
};

const getUserById = async (userId) => {
  const response = await authAxios.get(`${API_URL}/users/${userId}`);
  return response.data;
};

const updateUser = async (userId, userData) => {
  const response = await authAxios.put(`${API_URL}/users/${userId}`, userData);
  return response.data;
};

const changeUserStatus = async (userId, status) => {
  const response = await authAxios.put(`${API_URL}/users/${userId}/status`, { status });
  return response.data;
};

const deleteUser = async (userId) => {
  const response = await authAxios.delete(`${API_URL}/users/${userId}`);
  return response.data;
};

/**
 * Revenue Management Services
 */
const getTransactions = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/transactions`, { params });
  return response.data;
};

const getTransactionById = async (transactionId) => {
  const response = await authAxios.get(`${API_URL}/transactions/${transactionId}`);
  return response.data;
};

const approveTransaction = async (transactionId) => {
  const response = await authAxios.put(`${API_URL}/transactions/${transactionId}/approve`);
  return response.data;
};

const rejectTransaction = async (transactionId, reason) => {
  const response = await authAxios.put(`${API_URL}/transactions/${transactionId}/reject`, { reason });
  return response.data;
};

const getRevenueOverview = async (params = {}) => {
  const response = await authAxios.put(`${API_URL}/revenue/overview`, params);
  return response.data;
};

/**
 * Reporting & Analytics Services
 */
const generateSystemReport = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/reports/generate`, { params });
  return response.data;
};

const getSystemAnalytics = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/analytics`, { params });
  return response.data;
};

const getPerformanceMetrics = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/performance-metrics`, { params });
  return response.data;
};

const exportReportData = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/reports/export`, { 
    params,
    responseType: 'blob' // Important for file downloads
  });
  return response.data;
};

/**
 * System Management Services
 */
const getAuditLogs = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/audit-logs`, { params });
  return response.data;
};

const getAuditLogById = async (logId) => {
  const response = await authAxios.get(`${API_URL}/audit-logs/${logId}`);
  return response.data;
};

const getSystemSettings = async () => {
  const response = await authAxios.get(`${API_URL}/system-settings`);
  return response.data;
};

const updateSystemSettings = async (settings) => {
  const response = await authAxios.put(`${API_URL}/system-settings`, settings);
  return response.data;
};

/**
 * Entity Management Services
 */
const getMerchants = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/merchants`, { params });
  return response.data;
};

const getAdvertisers = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/advertisers`, { params });
  return response.data;
};

const getAgents = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/agents`, { params });
  return response.data;
};

const getCampaigns = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/campaigns`, { params });
  return response.data;
};

// Export all service functions
const adminService = {
  // Dashboard
  getDashboardStats,
  getSystemMetrics,
  getNotifications,
  getAlerts,
  
  // User Management
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  changeUserStatus,
  deleteUser,
  
  // Revenue Management
  getTransactions,
  getTransactionById,
  approveTransaction,
  rejectTransaction,
  getRevenueOverview,
  
  // Reporting & Analytics
  generateSystemReport,
  getSystemAnalytics,
  getPerformanceMetrics,
  exportReportData,
  
  // System Management
  getAuditLogs,
  getAuditLogById,
  getSystemSettings,
  updateSystemSettings,
  
  // Entity Management
  getMerchants,
  getAdvertisers,
  getAgents,
  getCampaigns
};

export default adminService;