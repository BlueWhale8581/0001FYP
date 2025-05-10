// src/services/agentService.js
import axios from 'axios';

const API_URL = '/api/agent';

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

const getAgentNotifications = async () => {
  const response = await authAxios.get(`${API_URL}/notifications`);
  return response.data;
};

const markNotificationAsRead = async (notificationId) => {
  const response = await authAxios.put(`${API_URL}/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Merchant Management Services
 */
const getAllMerchants = async () => {
  const response = await authAxios.get(`${API_URL}/merchants`);
  return response.data;
};

const getMerchantsOnboarded = async () => {
  const response = await authAxios.get(`${API_URL}/merchants/onboarded`);
  return response.data;
};

const getMerchantById = async (merchantId) => {
  const response = await authAxios.get(`${API_URL}/merchants/${merchantId}`);
  return response.data;
};

const registerMerchant = async (merchantData) => {
  const response = await authAxios.post(`${API_URL}/merchants`, merchantData);
  return response.data;
};

const updateMerchant = async (merchantId, merchantData) => {
  const response = await authAxios.put(`${API_URL}/merchants/${merchantId}`, merchantData);
  return response.data;
};

const approveMerchantApplication = async (merchantId) => {
  const response = await authAxios.put(`${API_URL}/merchants/${merchantId}/approve`);
  return response.data;
};

const rejectMerchantApplication = async (merchantId, rejectionData) => {
  const response = await authAxios.put(`${API_URL}/merchants/${merchantId}/reject`, rejectionData);
  return response.data;
};

/**
 * QR Code Management Services
 */
const getAllQRCodes = async () => {
  const response = await authAxios.get(`${API_URL}/qrcodes`);
  return response.data;
};

const getQRCodesByMerchant = async (merchantId) => {
  const response = await authAxios.get(`${API_URL}/merchants/${merchantId}/qrcodes`);
  return response.data;
};

const generateQRCode = async (merchantId, qrCodeData) => {
  const response = await authAxios.post(`${API_URL}/merchants/${merchantId}/qrcodes`, qrCodeData);
  return response.data;
};

const regenerateQRCode = async (merchantId, qrCodeData) => {
  const response = await authAxios.post(`${API_URL}/merchants/${merchantId}/qrcodes/regenerate`, qrCodeData);
  return response.data;
};

const downloadQRCode = async (qrCodeId) => {
  const response = await authAxios.get(`${API_URL}/qrcodes/${qrCodeId}/download`, {
    responseType: 'blob' // Important for file downloads
  });
  return response.data;
};

/**
 * Commission and Transaction Services
 */
const getCommissions = async () => {
  const response = await authAxios.get(`${API_URL}/commissions`);
  return response.data;
};

const getCommissionReports = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/commissions/report`, { params });
  return response.data;
};

const getCommissionByPeriod = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/commissions/period`, { params });
  return response.data;
};

const getTransactionHistory = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/transactions`, { params });
  return response.data;
};

const getEarningsSummary = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/earnings`, { params });
  return response.data;
};

/**
 * Profile Management Services
 */
const getAgentProfile = async () => {
  const response = await authAxios.get(`${API_URL}/profile`);
  return response.data;
};

const updateAgentProfile = async (profileData) => {
  const response = await authAxios.put(`${API_URL}/profile`, profileData);
  return response.data;
};

/**
 * Help Resources
 */
const getHelpResources = async () => {
  const response = await authAxios.get(`${API_URL}/help`);
  return response.data;
};

// Export all service functions
const agentService = {
  // Dashboard
  getDashboardStats,
  getAgentNotifications,
  markNotificationAsRead,
  
  // Merchant Management
  getAllMerchants,
  getMerchantsOnboarded,
  getMerchantById,
  registerMerchant,
  updateMerchant,
  approveMerchantApplication,
  rejectMerchantApplication,
  
  // QR Code Management
  getAllQRCodes,
  getQRCodesByMerchant,
  generateQRCode,
  regenerateQRCode,
  downloadQRCode,
  
  // Commission and Transaction
  getCommissions,
  getCommissionReports,
  getCommissionByPeriod,
  getTransactionHistory,
  getEarningsSummary,
  
  // Profile Management
  getAgentProfile,
  updateAgentProfile,
  
  // Help Resources
  getHelpResources
};

export default agentService;