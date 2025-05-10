import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

export const useRoleNavigation = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useRoleNavigation:', { user, isAuthenticated, loading });

    if (loading) return; // Wait until auth is checked

    if (!isAuthenticated) {
      navigate('/login', { replace: true }); // Redirect to login if not authenticated
      return;
    }

    if (user?.role) {
      const rolePath = `/${user.role.toLowerCase()}`;
      console.log('Navigating to:', rolePath);
      navigate(rolePath, { replace: true }); // Redirect to role-specific dashboard
    }
  }, [isAuthenticated, user, loading, navigate]);

  return { user, isAuthenticated, loading };
};

export default useRoleNavigation;