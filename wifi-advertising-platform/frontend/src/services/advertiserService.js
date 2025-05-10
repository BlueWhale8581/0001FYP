// src/services/advertiserService.js
import axios from 'axios';

const API_URL = '/api/advertiser';

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
const getDashboard = async () => {
  const response = await authAxios.get(`${API_URL}/dashboard`);
  return response.data;
};

const getNotifications = async () => {
  const response = await authAxios.get(`${API_URL}/notifications`);
  return response.data;
};

const markNotificationAsRead = async (notificationId) => {
  const response = await authAxios.put(`${API_URL}/notifications/${notificationId}/read`);
  return response.data;
};

const markAllNotificationsAsRead = async () => {
  const response = await authAxios.put(`${API_URL}/notifications/read-all`);
  return response.data;
};

/**
 * Campaign Management Services
 */
const getCampaigns = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/campaigns`, { params });
  return response.data;
};

const createCampaign = async (campaignData) => {
  const response = await authAxios.post(`${API_URL}/campaigns`, campaignData);
  return response.data;
};

const getCampaignById = async (campaignId) => {
  const response = await authAxios.get(`${API_URL}/campaigns/${campaignId}`);
  return response.data;
};

const updateCampaign = async (campaignId, campaignData) => {
  const response = await authAxios.put(`${API_URL}/campaigns/${campaignId}`, campaignData);
  return response.data;
};

const updateCampaignStatus = async (campaignId, status) => {
  const response = await authAxios.put(`${API_URL}/campaigns/${campaignId}/status`, { status });
  return response.data;
};

const deleteCampaign = async (campaignId) => {
  const response = await authAxios.delete(`${API_URL}/campaigns/${campaignId}`);
  return response.data;
};

const getCampaignPerformance = async (campaignId) => {
  const response = await authAxios.get(`${API_URL}/campaigns/${campaignId}/performance`);
  return response.data;
};

/**
 * Ad Management Services
 */
const getAds = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/ads`, { params });
  return response.data;
};

const createAd = async (campaignId, adData) => {
  // Using FormData for file uploads
  const formData = new FormData();
  
  // Append ad details
  Object.keys(adData).forEach(key => {
    if (key !== 'media') {
      formData.append(key, adData[key]);
    }
  });
  
  // Append media file if it exists
  if (adData.media) {
    formData.append('media', adData.media);
  }
  
  const response = await authAxios.post(
    `${API_URL}/campaigns/${campaignId}/ads`, 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  
  return response.data;
};

const getAdById = async (adId) => {
  const response = await authAxios.get(`${API_URL}/ads/${adId}`);
  return response.data;
};

const updateAd = async (adId, adData) => {
  // Using FormData for file uploads
  const formData = new FormData();
  
  // Append ad details
  Object.keys(adData).forEach(key => {
    if (key !== 'media') {
      formData.append(key, adData[key]);
    }
  });
  
  // Append media file if it exists
  if (adData.media) {
    formData.append('media', adData.media);
  }
  
  const response = await authAxios.put(
    `${API_URL}/ads/${adId}`, 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  
  return response.data;
};

const deleteAd = async (adId) => {
  const response = await authAxios.delete(`${API_URL}/ads/${adId}`);
  return response.data;
};

const getAdMetrics = async (adId) => {
  const response = await authAxios.get(`${API_URL}/ads/${adId}/metrics`);
  return response.data;
};

/**
 * Budget & Payment Services
 */
const getPaymentHistory = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/payments`, { params });
  return response.data;
};

const makePayment = async (paymentData) => {
  const response = await authAxios.post(`${API_URL}/payments`, paymentData);
  return response.data;
};

const getBudgetOverview = async () => {
  const response = await authAxios.get(`${API_URL}/budget`);
  return response.data;
};

const getCampaignBudgetDetails = async (campaignId) => {
  const response = await authAxios.get(`${API_URL}/budget/${campaignId}`);
  return response.data;
};

/**
 * Analytics & Reporting Services
 */
const getAnalyticsOverview = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/analytics/overview`, { params });
  return response.data;
};

const getImpressionAnalytics = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/analytics/impressions`, { params });
  return response.data;
};

const getPerformanceAnalytics = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/analytics/performance`, { params });
  return response.data;
};

const generateReport = async (params = {}) => {
  const response = await authAxios.get(`${API_URL}/reports`, { 
    params,
    responseType: params.format === 'csv' || params.format === 'pdf' ? 'blob' : 'json'
  });
  return response.data;
};

/**
 * Profile Management Services
 */
const getProfile = async () => {
  const response = await authAxios.get(`${API_URL}/profile`);
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await authAxios.put(`${API_URL}/profile`, profileData);
  return response.data;
};

// Export all service functions
const advertiserService = {
  // Dashboard
  getDashboard,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  
  // Campaign Management
  getCampaigns,
  createCampaign,
  getCampaignById,
  updateCampaign,
  updateCampaignStatus,
  deleteCampaign,
  getCampaignPerformance,
  
  // Ad Management
  getAds,
  createAd,
  getAdById,
  updateAd,
  deleteAd,
  getAdMetrics,
  
  // Budget & Payment
  getPaymentHistory,
  makePayment,
  getBudgetOverview,
  getCampaignBudgetDetails,
  
  // Analytics & Reporting
  getAnalyticsOverview,
  getImpressionAnalytics,
  getPerformanceAnalytics,
  generateReport,
  
  // Profile Management
  getProfile,
  updateProfile
};

export default advertiserService;