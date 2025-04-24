// src/hooks/usePublic.js
import { useState, useCallback } from 'react';
import publicService from '../services/publicService';

/**
 * Custom hook for getting WiFi details based on QR code
 */
export const useWiFiDetails = () => {
  const [wifiDetails, setWiFiDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDetails = useCallback(async (qrCodeId) => {
    try {
      setLoading(true);
      const data = await publicService.getWiFiDetails(qrCodeId);
      setWiFiDetails(data.wifiDetails || null);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load WiFi details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    wifiDetails,
    loading,
    error,
    getDetails
  };
};

/**
 * Custom hook for connecting to merchant WiFi
 */
export const useWiFiConnection = () => {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async (merchantId, connectionData = {}) => {
    try {
      setLoading(true);
      const data = await publicService.connectToWiFi(merchantId, connectionData);
      setSessionInfo(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to WiFi');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sessionInfo,
    loading,
    error,
    connect
  };
};

/**
 * Custom hook for managing ad views during WiFi sessions
 */
export const useAdViews = () => {
  const [adViewStatus, setAdViewStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startAdView = useCallback(async (sessionId, adId) => {
    try {
      setLoading(true);
      const data = await publicService.trackAdView(sessionId, adId);
      setAdViewStatus(prev => ({
        ...prev,
        [adId]: { ...prev[adId], started: true }
      }));
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start ad view');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeAdView = useCallback(async (sessionId, adId) => {
    try {
      setLoading(true);
      const data = await publicService.completeAdView(sessionId, adId);
      setAdViewStatus(prev => ({
        ...prev,
        [adId]: { ...prev[adId], completed: true }
      }));
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete ad view');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRedirectAfterAds = useCallback(async (sessionId) => {
    try {
      setLoading(true);
      const data = await publicService.redirectAfterAds(sessionId);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get redirect information');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    adViewStatus,
    loading,
    error,
    startAdView,
    completeAdView,
    getRedirectAfterAds
  };
};

/**
 * Custom hook for retrieving and managing ads
 */
export const useAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAds = useCallback(async (merchantId) => {
    try {
      setLoading(true);
      const data = await publicService.getAdsToView(merchantId);
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

  const recordImpression = useCallback(async (adId, merchantId) => {
    try {
      setLoading(true);
      const data = await publicService.recordAdImpression(adId, merchantId);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record ad impression');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ads,
    loading,
    error,
    getAds,
    recordImpression
  };
};

/**
 * Custom hook for advertiser registration
 */
export const useAdvertiserRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = useCallback(async (advertiserData) => {
    try {
      setLoading(true);
      const result = await publicService.registerAsAdvertiser(advertiserData);
      setSuccess(true);
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register as advertiser');
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    register,
    resetState
  };
};

/**
 * Custom hook for merchant registration
 */
export const useMerchantRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = useCallback(async (merchantData) => {
    try {
      setLoading(true);
      const result = await publicService.registerAsMerchant(merchantData);
      setSuccess(true);
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register as merchant');
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    register,
    resetState
  };
};

/**
 * Custom hook for agent registration
 */
export const useAgentRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = useCallback(async (agentData) => {
    try {
      setLoading(true);
      const result = await publicService.registerAsAgent(agentData);
      setSuccess(true);
      setError(null);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register as agent');
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    register,
    resetState
  };
};

export default {
  useWiFiDetails,
  useWiFiConnection,
  useAdViews,
  useAds,
  useAdvertiserRegistration,
  useMerchantRegistration,
  useAgentRegistration
};