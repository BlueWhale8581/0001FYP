// /frontend/src/services/publicService.js
import axios from 'axios';

const API_URL = '/api/public';

/**
 * Wi-Fi Access Services
 */

/**
 * Get Wi-Fi details based on QR code
 * @param {string} qrCodeId - QR code ID of the merchant
 * @returns {Promise<Object>} - Wi-Fi details
 */
const getWiFiDetails = async (qrCodeId) => {
  const response = await axios.get(`${API_URL}/wifi/${qrCodeId}`);
  return response.data;
};

/**
 * Connect to merchant Wi-Fi
 * @param {string} merchantId - Merchant ID
 * @param {Object} connectionData - Additional connection data if needed
 * @returns {Promise<Object>} - Connection response
 */
const connectToWiFi = async (merchantId, connectionData = {}) => {
  const response = await axios.post(`${API_URL}/wifi/connect/${merchantId}`, connectionData);
  return response.data;
};

/**
 * Track when an ad starts playing
 * @param {string} sessionId - Wi-Fi session ID
 * @param {string} adId - Ad ID
 * @returns {Promise<Object>} - Ad tracking response
 */
const trackAdView = async (sessionId, adId) => {
  const response = await axios.post(`${API_URL}/wifi/ad/start/${sessionId}/${adId}`);
  return response.data;
};

/**
 * Mark an ad as completely viewed
 * @param {string} sessionId - Wi-Fi session ID
 * @param {string} adId - Ad ID
 * @returns {Promise<Object>} - Ad completion response
 */
const completeAdView = async (sessionId, adId) => {
  const response = await axios.post(`${API_URL}/wifi/ad/complete/${sessionId}/${adId}`);
  return response.data;
};

/**
 * Redirect user after viewing all required ads
 * @param {string} sessionId - Wi-Fi session ID
 * @returns {Promise<Object>} - Redirect information
 */
const redirectAfterAds = async (sessionId) => {
  const response = await axios.get(`${API_URL}/wifi/redirect/${sessionId}`);
  return response.data;
};

/**
 * Get ads that need to be viewed
 * @param {string} merchantId - Merchant ID
 * @returns {Promise<Object>} - Ads to view
 */
const getAdsToView = async (merchantId) => {
  const response = await axios.get(`${API_URL}/ads/${merchantId}`);
  return response.data;
};

/**
 * Record an ad impression without being connected to Wi-Fi
 * @param {string} adId - Ad ID
 * @param {string} merchantId - Merchant ID
 * @returns {Promise<Object>} - Impression record response
 */
const recordAdImpression = async (adId, merchantId) => {
  const response = await axios.post(`${API_URL}/ads/impression/${adId}/${merchantId}`);
  return response.data;
};

/**
 * Registration Services
 */

/**
 * Register as an advertiser
 * @param {Object} advertiserData - Advertiser registration data
 * @returns {Promise<Object>} - Advertiser registration response
 */
const registerAsAdvertiser = async (advertiserData) => {
  const response = await axios.post(`${API_URL}/register/advertiser`, advertiserData);
  return response.data;
};

/**
 * Register as a merchant
 * @param {Object} merchantData - Merchant registration data
 * @returns {Promise<Object>} - Merchant registration response
 */
const registerAsMerchant = async (merchantData) => {
  const response = await axios.post(`${API_URL}/register/merchant`, merchantData);
  return response.data;
};

/**
 * Register as an agent
 * @param {Object} agentData - Agent registration data
 * @returns {Promise<Object>} - Agent registration response
 */
const registerAsAgent = async (agentData) => {
  const response = await axios.post(`${API_URL}/register/agent`, agentData);
  return response.data;
};

const publicService = {
  // Wi-Fi Access Services
  getWiFiDetails,
  connectToWiFi,
  trackAdView,
  completeAdView,
  redirectAfterAds,
  getAdsToView,
  recordAdImpression,
  
  // Registration Services
  registerAsAdvertiser,
  registerAsMerchant,
  registerAsAgent
};

export default publicService;