import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

export const useRoleNavigation = (allowedRoles = []) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Wait until auth is checked
    if (loading) return;
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Handle role-based access
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      // Redirect based on role
      switch (user?.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'agent':
          navigate('/agent/dashboard');
          break;
        case 'advertiser':
          navigate('/advertiser/dashboard');
          break;
        case 'merchant':
          navigate('/merchant/dashboard');
          break;
        default:
          navigate('/unauthorized');
      }
    }
  }, [isAuthenticated, user, loading, navigate, allowedRoles]);
  
  return { user, isAuthenticated, loading };
};

export default useRoleNavigation;