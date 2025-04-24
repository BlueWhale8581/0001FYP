// src/hooks/useAdvertiser.js
import { useState, useEffect, useCallback } from 'react';
import advertiserService from '../services/advertiserService';

/**
 * Custom hook for fetching advertiser dashboard data
 */
export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await advertiserService.getDashboard();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { dashboardData, loading, error, refetch: fetchDashboardData };
};

/**
 * Custom hook for fetching and managing advertiser notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await advertiserService.getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      setLoading(true);
      await advertiserService.markNotificationAsRead(notificationId);
      // Update local state to mark notification as read
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      await advertiserService.markAllNotificationsAsRead();
      // Update all notifications in local state to read
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark all notifications as read');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};

/**
 * Custom hook for campaign management
 */
export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaigns = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const data = await advertiserService.getCampaigns(params);
      setCampaigns(data.campaigns || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campaigns');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const getCampaignById = async (campaignId) => {
    try {
      setLoading(true);
      const data = await advertiserService.getCampaignById(campaignId);
      setError(null);
      return data.campaign;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get campaign details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData) => {
    try {
      setLoading(true);
      const result = await advertiserService.createCampaign(campaignData);
      await fetchCampaigns(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create campaign');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCampaign = async (campaignId, campaignData) => {
    try {
      setLoading(true);
      const result = await advertiserService.updateCampaign(campaignId, campaignData);
      await fetchCampaigns(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update campaign');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignStatus = async (campaignId, status) => {
    try {
      setLoading(true);
      const result = await advertiserService.updateCampaignStatus(campaignId, status);
      await fetchCampaigns(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update campaign status');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      setLoading(true);
      const result = await advertiserService.deleteCampaign(campaignId);
      await fetchCampaigns(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete campaign');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCampaignPerformance = async (campaignId) => {
    try {
      setLoading(true);
      const data = await advertiserService.getCampaignPerformance(campaignId);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get campaign performance');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    updateCampaignStatus,
    deleteCampaign,
    getCampaignPerformance
  };
};

/**
 * Custom hook for ad management
 */
export const useAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAds = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const data = await advertiserService.getAds(params);
      setAds(data.ads || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ads');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const getAdById = async (adId) => {
    try {
      setLoading(true);
      const data = await advertiserService.getAdById(adId);
      setError(null);
      return data.ad;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get ad details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createAd = async (campaignId, adData) => {
    try {
      setLoading(true);
      const result = await advertiserService.createAd(campaignId, adData);
      await fetchAds(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ad');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAd = async (adId, adData) => {
    try {
      setLoading(true);
      const result = await advertiserService.updateAd(adId, adData);
      await fetchAds(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ad');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (adId) => {
    try {
      setLoading(true);
      const result = await advertiserService.deleteAd(adId);
      await fetchAds(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete ad');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAdMetrics = async (adId) => {
    try {
      setLoading(true);
      const data = await advertiserService.getAdMetrics(adId);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get ad metrics');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    ads,
    loading,
    error,
    fetchAds,
    getAdById,
    createAd,
    updateAd,
    deleteAd,
    getAdMetrics
  };
};

/**
 * Custom hook for budget and payment management
 */
export const useBudgetAndPayments = () => {
  const [budgetOverview, setBudgetOverview] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgetOverview = useCallback(async () => {
    try {
      setLoading(true);
      const data = await advertiserService.getBudgetOverview();
      setBudgetOverview(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load budget overview');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaymentHistory = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const data = await advertiserService.getPaymentHistory(params);
      setPaymentHistory(data.payments || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payment history');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgetOverview();
    fetchPaymentHistory();
  }, [fetchBudgetOverview, fetchPaymentHistory]);

  const getCampaignBudgetDetails = async (campaignId) => {
    try {
      setLoading(true);
      const data = await advertiserService.getCampaignBudgetDetails(campaignId);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get campaign budget details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (paymentData) => {
    try {
      setLoading(true);
      const result = await advertiserService.makePayment(paymentData);
      await fetchPaymentHistory(); // Refresh payment history
      await fetchBudgetOverview(); // Refresh budget overview
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    budgetOverview,
    paymentHistory,
    loading,
    error,
    fetchBudgetOverview,
    fetchPaymentHistory,
    getCampaignBudgetDetails,
    makePayment
  };
};

/**
 * Custom hook for analytics and reporting
 */
export const useAnalyticsAndReporting = (initialParams = {}) => {
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchAnalyticsOverview = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await advertiserService.getAnalyticsOverview(queryParams);
      setAnalyticsOverview(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics overview');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAnalyticsOverview();
  }, [fetchAnalyticsOverview]);

  const getImpressionAnalytics = async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await advertiserService.getImpressionAnalytics(queryParams);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load impression analytics');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceAnalytics = async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await advertiserService.getPerformanceAnalytics(queryParams);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load performance analytics');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportParams) => {
    try {
      setLoading(true);
      const result = await advertiserService.generateReport(reportParams);
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyticsOverview,
    loading,
    error,
    params,
    setParams,
    fetchAnalyticsOverview,
    getImpressionAnalytics,
    getPerformanceAnalytics,
    generateReport
  };
};

/**
 * Custom hook for profile management
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await advertiserService.getProfile();
      setProfile(data.profile || null);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const result = await advertiserService.updateProfile(profileData);
      await fetchProfile(); // Refresh profile data
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile
  };
};

export default {
  useDashboardData,
  useNotifications,
  useCampaigns,
  useAds,
  useBudgetAndPayments,
  useAnalyticsAndReporting,
  useProfile
};