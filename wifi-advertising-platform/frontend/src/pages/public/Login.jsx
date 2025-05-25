import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../components/common/Button';
import { useLogin } from '../../hooks/useAuth';

const LoginPage = () => {
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      console.log('Login successful, navigating...');
      // Navigate to the appropriate dashboard based on user role
      const user = result.user;
      if (user && user.role) {
        navigate(`/${user.role.toLowerCase()}`, { replace: true });
      }
    } else {
      console.error('Login failed:', result.error);
    }
  };

  return (
    <DashboardTemplate
      role="user"
      userName="Visitor"
      pageTitle="Login"
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4 text-black">Log In</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <Button 
            text={loading ? 'Logging in...' : 'Login'} 
            type="submit" 
            disabled={loading} 
            className="w-full"
          />
        </form>
        <Link
          to="/register"
          className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 mt-2"
        >
          Register
        </Link>
      </div>
    </DashboardTemplate>
  );
};

export default LoginPage;