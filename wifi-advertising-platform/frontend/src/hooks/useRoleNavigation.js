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
          navigate('/admin');
          break;
        case 'agent':
          navigate('/agent');
          break;
        case 'advertiser':
          navigate('/advertiser'); // Redirect to advertiser details page if missing
          break;
        case 'merchant':
          navigate('/merchant'); // Redirect to merchant details page if missing
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, loading, navigate, allowedRoles]);
  
  return { user, isAuthenticated, loading };
};

export default useRoleNavigation;