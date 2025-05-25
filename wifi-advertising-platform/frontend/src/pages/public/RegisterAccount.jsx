import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../components/common/Button';
import { useRegister } from '../../hooks/useAuth';

const RegisterPage = () => {
  const { register, loading, error, success } = useRegister();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'merchant' // Default role
  });
  
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.first_name) errors.first_name = 'First Name is required';
    if (!formData.last_name) errors.last_name = 'Last Name is required';
    if (!formData.phone) errors.phone = 'Phone is required';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password strength
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Password match
    if (formData.password && formData.confirmPassword && 
        formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Submit registration
    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role
      });
      
      // Navigate based on role
      if (result && result.success && result.userId) {
        switch (formData.role) {
          case 'merchant':
            navigate(`/register/merchant/${result.userId}`);
            break;
          case 'advertiser':
            navigate(`/register/advertiser/${result.userId}`);
            break;
          case 'agent':
            // For agents, directly go to login as no additional info is needed
            navigate('/login');
            break;
          default:
            navigate('/login');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormErrors({ submit: error.message });
    }
  };

  return (
    <DashboardTemplate
    role="user"
    userName="Visitor"
      pageTitle="Register"
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4 text-black">Create an Account</h2>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Account Registration successful!
            <p className="text-sm">Redirecting to next page...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div>
              <label className="block text-sm text-gray-700">Username*</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${formErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-gray-700">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">First Name*</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {formErrors.first_name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-gray-700">Last Name*</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {formErrors.label && (
                <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700">Phone Number*</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
              )}
          </div>
          
          <div>
            <label className="block text-sm text-gray-700">Account Type*</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="merchant">Merchant</option>
              <option value="advertiser">Advertiser</option>
              <option value="agent">Agent</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.role === 'merchant' && "For businesses accepting payment through our platform"}
              {formData.role === 'advertiser' && "For businesses looking to advertise their products"}
              {formData.role === 'agent' && "For sales representatives working with merchants"}
            </p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700">Password*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm text-gray-700">Confirm Password*</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>
          
          <Button
            text={loading ? 'Creating Account...' : 'Register'}
            type="submit"
            disabled={loading}
            className="w-full"
          />
        </form>
        <div className="text-center text-sm mt-4">
          <Button
            as={Link}
            to="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Log In
          </Button>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default RegisterPage;