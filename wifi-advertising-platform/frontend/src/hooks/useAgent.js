// src/hooks/useAgent.js
import { useState, useEffect, useCallback } from 'react';
import agentService from '../services/agentService';

/**
 * Custom hook for fetching agent dashboard statistics
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentService.getDashboardStats();
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
 * Custom hook for fetching and managing agent notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentService.getAgentNotifications();
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
      await agentService.markNotificationAsRead(notificationId);
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

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead
  };
};

/**
 * Custom hook for merchant management
 */
export const useMerchants = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMerchants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentService.getAllMerchants();
      setMerchants(data.merchants || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load merchants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const fetchOnboardedMerchants = async () => {
    try {
      setLoading(true);
      const data = await agentService.getMerchantsOnboarded();
      setMerchants(data.merchants || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load onboarded merchants');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMerchantById = async (merchantId) => {
    try {
      setLoading(true);
      const data = await agentService.getMerchantById(merchantId);
      setError(null);
      return data.merchant;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get merchant details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registerMerchant = async (merchantData) => {
    try {
      setLoading(true);
      const result = await agentService.registerMerchant(merchantData);
      await fetchMerchants(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register merchant');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMerchant = async (merchantId, merchantData) => {
    try {
      setLoading(true);
      const result = await agentService.updateMerchant(merchantId, merchantData);
      await fetchMerchants(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update merchant');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const approveMerchantApplication = async (merchantId) => {
    try {
      setLoading(true);
      const result = await agentService.approveMerchantApplication(merchantId);
      await fetchMerchants(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve merchant application');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rejectMerchantApplication = async (merchantId, rejectionData) => {
    try {
      setLoading(true);
      const result = await agentService.rejectMerchantApplication(merchantId, rejectionData);
      await fetchMerchants(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject merchant application');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    merchants,
    loading,
    error,
    fetchMerchants,
    fetchOnboardedMerchants,
    getMerchantById,
    registerMerchant,
    updateMerchant,
    approveMerchantApplication,
    rejectMerchantApplication
  };
};

/**
 * Custom hook for QR code management
 */
export const useQRCodes = () => {
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllQRCodes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentService.getAllQRCodes();
      // Defensive: handle both array and object response
      if (Array.isArray(data)) {
        setQRCodes(data);
      } else if (Array.isArray(data.qrcodes)) {
        setQRCodes(data.qrcodes);
      } else {
        setQRCodes([]);
      }
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load QR codes');
      setQRCodes([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllQRCodes();
  }, [fetchAllQRCodes]);

  const fetchQRCodesByMerchant = async (merchantId) => {
    try {
      setLoading(true);
      const data = await agentService.getQRCodesByMerchant(merchantId);
      // Defensive: handle both array and object response
      if (Array.isArray(data)) {
        setQRCodes(data);
      } else if (Array.isArray(data.qrcodes)) {
        setQRCodes(data.qrcodes);
      } else {
        setQRCodes([]);
      }
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || `Failed to load QR codes for merchant ${merchantId}`);
      setQRCodes([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (merchantId, qrCodeData) => {
    try {
      setLoading(true);
      const result = await agentService.generateQRCode(merchantId, qrCodeData);
      await fetchAllQRCodes(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate QR code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const regenerateQRCode = async (merchantId, qrCodeData) => {
    try {
      setLoading(true);
      const result = await agentService.regenerateQRCode(merchantId, qrCodeData);
      await fetchAllQRCodes(); // Refresh the list
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to regenerate QR code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async (qrCodeId) => {
    try {
      setLoading(true);
      const blob = await agentService.downloadQRCode(qrCodeId);
      
      // Create a download link for the blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `qrcode-${qrCodeId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download QR code');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    qrCodes,
    loading,
    error,
    fetchAllQRCodes,
    fetchQRCodesByMerchant,
    generateQRCode,
    regenerateQRCode,
    downloadQRCode
  };
};

/**
 * Custom hook for commission management
 */
export const useCommissions = (initialParams = {}) => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentService.getCommissions();
      setCommissions(data.commissions || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load commissions');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const fetchCommissionReports = async (reportParams = params) => {
    try {
      setLoading(true);
      const data = await agentService.getCommissionReports(reportParams);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load commission reports');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCommissionByPeriod = async (periodParams = params) => {
    try {
      setLoading(true);
      const data = await agentService.getCommissionByPeriod(periodParams);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load commission by period');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    commissions,
    loading,
    error,
    params,
    setParams,
    fetchCommissions,
    fetchCommissionReports,
    fetchCommissionByPeriod
  };
};

/**
 * Custom hook for transaction history
 */
export const useTransactions = (initialParams = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchTransactions = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await agentService.getTransactionHistory(queryParams);
      setTransactions(data.transactions || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions');
      return null;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    params,
    setParams,
    fetchTransactions
  };
};

/**
 * Custom hook for earnings summary
 */
export const useEarnings = (initialParams = {}) => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchEarnings = useCallback(async (queryParams = params) => {
    try {
      setLoading(true);
      const data = await agentService.getEarningsSummary(queryParams);
      setEarnings(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load earnings summary');
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
 * Custom hook for agent profile management
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentService.getAgentProfile();
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
      const result = await agentService.updateAgentProfile(profileData);
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

/**
 * Custom hook for help resources
 */
export const useHelpResources = () => {
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentService.getHelpResources();
      setResources(data.resources || null);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load help resources');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return {
    resources,
    loading,
    error,
    refetch: fetchResources
  };
};

// Combined hook for simplified import
export const useAgent = () => {
  return {
    useDashboardStats,
    useNotifications,
    useMerchants,
    useQRCodes,
    useCommissions,
    useTransactions,
    useEarnings,
    useProfile,
    useHelpResources
  };
};

export default useAgent;