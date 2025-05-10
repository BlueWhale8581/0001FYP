// src/hooks/useMerchant.js
import { useState, useEffect, useCallback } from 'react';
import merchantService from '../services/merchantService';

/**
 * Custom hook for fetching merchant dashboard statistics
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await merchantService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

/**
 * Custom hook for WiFi usage statistics
 */
export const useWiFiUsageStats = () => {
  const [wifiUsage, setWifiUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWiFiUsage = useCallback(async () => {
    try {
      setLoading(true);
      const data = await merchantService.getWiFiUsageStats();
      setWifiUsage(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load WiFi usage statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWiFiUsage();
  }, [fetchWiFiUsage]);

  return { wifiUsage, loading, error, refetch: fetchWiFiUsage };
};

/**
 * Custom hook for ad impressions
 */
export const useAdImpressions = () => {
  const [impressions, setImpressions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImpressions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await merchantService.getAdImpressions();
      setImpressions(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ad impressions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImpressions();
  }, [fetchImpressions]);

  return { impressions, loading, error, refetch: fetchImpressions };
};

/**
 * Custom hook for revenue details
 */
export const useRevenueDetails = () => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRevenue = useCallback(async () => {
    try {
      setLoading(true);
      const data = await merchantService.getRevenueDetails();
      setRevenue(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load revenue details');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return { revenue, loading, error, refetch: fetchRevenue };
};

/**
 * Custom hook for WiFi settings management
 */
export const useWiFiSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await merchantService.getWiFiSettings();
      setSettings(data.settings || null);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load WiFi settings');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (settingsData) => {
    try {
      setLoading(true);
      const result = await merchantService.updateWiFiSettings(settingsData);
      await fetchSettings(); // Refresh settings data
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update WiFi settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings
  };
};

/**
 * Custom hook for ad display preferences
 */
export const useAdPreferences = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPreferences = useCallback(async () => {
    try {
      setLoading(true);
      const data = await merchantService.getAdDisplayPreferences();
      setPreferences(data.preferences || null);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ad display preferences');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreferences = async (preferencesData) => {
    try {
      setLoading(true);
      const result = await merchantService.updateAdDisplayPreferences(preferencesData);
      await fetchPreferences(); // Refresh preferences data
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ad display preferences');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    error,
    fetchPreferences,
    updatePreferences
  };
};

/**
 * Custom hook for redirect URL configuration
 */
export const useRedirectUrl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const configureRedirectUrl = async (urlData) => {
    try {
      setLoading(true);
      const result = await merchantService.configureRedirectUrl(urlData);
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to configure redirect URL');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    configureRedirectUrl
  };
};

/**
 * Custom hook for merchant profile management
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await merchantService.getMerchantProfile();
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
      const result = await merchantService.updateMerchantProfile(profileData);
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

  const updateLogo = async (logoFile) => {
    try {
      setLoading(true);
      const result = await merchantService.updateBusinessLogo(logoFile);
      await fetchProfile(); // Refresh profile data
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update business logo');
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
    updateProfile,
    updateLogo
  };
};

/**
 * Custom hook for earnings reports
 */
export const useEarnings = (initialParams = {}) => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchEarnings = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await merchantService.getEarningsReport(queryParams);
      setEarnings(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load earnings report');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return {
    earnings,
    loading,
    error,
    params,
    setParams,
    fetchEarnings
  };
};

/**
 * Custom hook for commission breakdown
 */
export const useCommission = (initialParams = {}) => {
  const [commission, setCommission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchCommission = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await merchantService.getCommissionBreakdown(queryParams);
      setCommission(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load commission breakdown');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCommission();
  }, [fetchCommission]);

  return {
    commission,
    loading,
    error,
    params,
    setParams,
    fetchCommission
  };
};

/**
 * Custom hook for revenue reports by period
 */
export const useRevenue = (initialParams = {}) => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchRevenue = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await merchantService.getRevenueByPeriod(queryParams);
      setRevenue(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load revenue report');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return {
    revenue,
    loading,
    error,
    params,
    setParams,
    fetchRevenue
  };
};

export default {
  useDashboardStats,
  useWiFiUsageStats,
  useAdImpressions,
  useRevenueDetails,
  useWiFiSettings,
  useAdPreferences,
  useRedirectUrl,
  useProfile,
  useEarnings,
  useCommission,
  useRevenue
};