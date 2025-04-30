import { useState, useEffect } from 'react';
import useAuth from './useAuth';

const useProfile = (role) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      let profileData;
      
      switch (role) {
        case 'agent':
          // Fetch agent-specific data
          profileData = {
            ...user,
            commission_rate: user.commission_rate || 0,
            territory: user.territory || 'Unassigned',
            merchants_count: user.merchants_count || 0,
            total_commission: user.total_commission || 0,
          };
          break;

        case 'merchant':
          // Fetch merchant-specific data
          profileData = {
            ...user,
            business_name: user.business_name || '',
            business_address: user.business_address || '',
            business_phone: user.business_phone || '',
            business_category: user.business_category || '',
            assigned_agent: user.assigned_agent || 'Unassigned',
            wifi_spots: user.wifi_spots || [],
          };
          break;

        case 'advertiser':
          // Fetch advertiser-specific data
          profileData = {
            ...user,
            company_name: user.company_name || '',
            industry: user.industry || '',
            campaigns_count: user.campaigns_count || 0,
            active_ads: user.active_ads || 0,
            total_spend: user.total_spend || 0,
          };
          break;

        default:
          profileData = user;
      }

      setProfile(profileData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, role]);

  return { profile, loading, error, fetchProfile };
};

export default useProfile;
