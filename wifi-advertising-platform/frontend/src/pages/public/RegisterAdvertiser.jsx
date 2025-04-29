import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../components/common/Button';
import { useRegister } from '../../hooks/useAuth';

const RegisterPage = () => {
  const { register, loading, error, success } = useRegister();
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const [formData, setFormData] = useState({
    role: 'advertiser', // Fixed role
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    industry: ''
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
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.companyAddress.trim()) errors.companyAddress = 'Company address is required';
    if (!formData.companyPhone.trim()) errors.companyPhone = 'Company phone is required';
    if (!formData.companyEmail.trim()) errors.companyEmail = 'Company email is required';
    if (!formData.industry.trim()) errors.industry = 'Industry is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.companyEmail && !emailRegex.test(formData.companyEmail)) {
      errors.companyEmail = 'Please enter a valid email address';
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
    const result = await register({
      role: 'advertiser', // Fixed role
      userId, // Include userId from URL
      companyName: formData.companyName,
      companyAddress: formData.companyAddress,
      companyPhone: formData.companyPhone,
      companyEmail: formData.companyEmail,
      industry: formData.industry
    });
    
    // Redirect on success after a delay
    if (result && result.success) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <DashboardTemplate
    role="user"
    userName="Visitor"
      pageTitle="Register"
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Create an Account</h2>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Registration successful! Please check your email to verify your account.
            <p className="text-sm">Redirecting to login page...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Company Name*</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.companyName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.companyName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Company Address*</label>
            <textarea
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.companyAddress ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.companyAddress && (
              <p className="text-red-500 text-xs mt-1">{formErrors.companyAddress}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Company Phone*</label>
            <input
              type="tel"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.companyPhone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.companyPhone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.companyPhone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Company Email*</label>
            <input
              type="email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.companyEmail ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.companyEmail && (
              <p className="text-red-500 text-xs mt-1">{formErrors.companyEmail}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Industry*</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.industry ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.industry && (
              <p className="text-red-500 text-xs mt-1">{formErrors.industry}</p>
            )}
          </div>
          
          <Button
            text={loading ? 'Creating Account...' : 'Register'}
            type="submit"
            disabled={loading}
            className="w-full"
          />
        </form>
        <div className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800">Log In</Link>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default RegisterPage;