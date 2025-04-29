import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

export const useRoleNavigation = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait until auth is checked

    console.log('Auth state:', { isAuthenticated, user });

    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login...');
      navigate('/login');
      return;
    }

    if (user?.role) {
      const rolePath = `/${user.role.toLowerCase()}`;
      console.log(`Redirecting to ${rolePath}...`);
      navigate(rolePath);
    } else {
      console.log('User role not recognized, redirecting to home...');
      navigate('/');
    }
  }, [isAuthenticated, user, loading, navigate]);

  return { user, isAuthenticated, loading };
};

export default useRoleNavigation;