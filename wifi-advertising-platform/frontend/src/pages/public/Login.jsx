import React, { useState } from 'react';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../components/common/Button';
import { useLogin } from '../../hooks/useAuth';

const LoginPage = () => {
  const { login, loading, error, isAuthenticated } = useLogin();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
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
    await login({
      emailOrUsername: formData.emailOrUsername,
      password: formData.password
    });
  };

  return (
    <DashboardTemplate
      role="guest"
      userName="Guest"
      pageTitle="Login"
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Log In</h2>
        {isAuthenticated && <p className="text-green-600 text-center">Login successful! Redirecting...</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Email or Username</label>
            <input
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
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
          <Button text={loading ? 'Logging in...' : 'Login'} type="submit" disabled={loading} />
        </form>
      </div>
    </DashboardTemplate>
  );
};

export default LoginPage;