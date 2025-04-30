import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

export const useRoleNavigation = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Role Navigation State:', {
      user,
      isAuthenticated,
      loading,
      currentPath: window.location.pathname
    });

    if (loading) {
      console.log('Loading auth state...');
      return;
    }

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
      return;
    }

    if (user?.role) {
      const rolePath = `/${user.role.toLowerCase()}`;
      console.log('User authenticated, navigating to:', rolePath);
      if (window.location.pathname !== rolePath) {
        navigate(rolePath, { replace: true });
      }
    } else {
      console.log('No role found for user:', user);
    }
  }, [isAuthenticated, user, loading, navigate]);

  return { user, isAuthenticated, loading };
};

export default useRoleNavigation;