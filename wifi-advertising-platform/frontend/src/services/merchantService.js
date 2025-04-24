// src/services/merchantService.js
import axios from 'axios';

const API_URL = '/api/merchant';

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

const getWiFiUsageStats = async () => {
  const response = await authAxios.get(`${API_URL}/dashboard/wifi-usage`);
  return response.data;
};

const getAdImpressions = async () => {
  const response = await authAxios.get(`${API_URL}/dashboard/ad-impressions`);
  return response.data;
};

const getRevenueDetails = async () => {
  const response = await authAxios.get(`${API_URL}/dashboard/revenue`);
  return response.data;
};

/**
 * Wi-Fi Service Management Services
 */
const getWiFiSettings = async () => {
  const response = await authAxios.get(`${API_URL}/wifi-settings`);
  return response.data;
};

const updateWiFiSettings = async (settings) => {
  const response = await authAxios.put(`${API_URL}/wifi-settings`, settings);
  return response.data;
};

const getAdDisplayPreferences = async () => {
  const response = await authAxios.get(`${API_URL}/ad-preferences`);
  return response.data;
};

const updateAdDisplayPreferences = async (preferences) => {
  const response = await authAxios.put(`${API_URL}/ad-preferences`, preferences);
  return response.data;
};

const configureRedirectUrl = async (urlData) => {
  const response = await authAxios.put(`${API_URL}/redirect-url`, urlData);
  return response.data;
};

/**
 * Profile Management Services
 */
const getMerchantProfile = async () => {
  const response = await authAxios.get(`${API_URL}/profile`);
  return response.data;
};

const updateMerchantProfile = async (profileData) => {
  const response = await authAxios.put(`${API_URL}/profile`, profileData);
  return response.data;
};

const updateBusinessLogo = async (logoFile) => {
  const formData = new FormData();
  formData.append('logo', logoFile);

  const response = await authAxios.put(`${API_URL}/profile/logo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

/**
 * Revenue & Commission Report Services
 */
const getEarningsReport = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/reports/earnings`, { params });
  return response.data;
};

const getCommissionBreakdown = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/reports/commission`, { params });
  return response.data;
};

const getRevenueByPeriod = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/reports/revenue`, { params });
  return response.data;
};

// Export all service functions
const merchantService = {
  // Dashboard
  getDashboardStats,
  getWiFiUsageStats,
  getAdImpressions,
  getRevenueDetails,
  
  // Wi-Fi Service Management
  getWiFiSettings,
  updateWiFiSettings,
  getAdDisplayPreferences,
  updateAdDisplayPreferences,
  configureRedirectUrl,
  
  // Profile Management
  getMerchantProfile,
  updateMerchantProfile,
  updateBusinessLogo,
  
  // Revenue & Commission Reports
  getEarningsReport,
  getCommissionBreakdown,
  getRevenueByPeriod
};

export default merchantService;