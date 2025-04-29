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
    role: 'merchant', // Fixed role
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    businessCategory: '',
    taxId: ''
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
    if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
    if (!formData.businessAddress.trim()) errors.businessAddress = 'Business address is required';
    if (!formData.businessPhone.trim()) errors.businessPhone = 'Business phone is required';
    if (!formData.businessEmail.trim()) errors.businessEmail = 'Business email is required';
    if (!formData.businessCategory.trim()) errors.businessCategory = 'Business category is required';
    if (!formData.taxId.trim()) errors.taxId = 'Tax ID is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.businessEmail && !emailRegex.test(formData.businessEmail)) {
      errors.businessEmail = 'Please enter a valid email address';
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
      role: 'merchant', // Fixed role
      userId, // Include userId from URL
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
      businessPhone: formData.businessPhone,
      businessEmail: formData.businessEmail,
      businessCategory: formData.businessCategory,
      taxId: formData.taxId
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
            <label className="block text-sm text-gray-700">Business Name*</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.businessName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.businessName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Address*</label>
            <textarea
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.businessAddress ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.businessAddress && (
              <p className="text-red-500 text-xs mt-1">{formErrors.businessAddress}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Phone*</label>
            <input
              type="tel"
              name="businessPhone"
              value={formData.businessPhone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.businessPhone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.businessPhone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.businessPhone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Email*</label>
            <input
              type="email"
              name="businessEmail"
              value={formData.businessEmail}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.businessEmail ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.businessEmail && (
              <p className="text-red-500 text-xs mt-1">{formErrors.businessEmail}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Category*</label>
            <input
              type="text"
              name="businessCategory"
              value={formData.businessCategory}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.businessCategory ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.businessCategory && (
              <p className="text-red-500 text-xs mt-1">{formErrors.businessCategory}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Tax ID*</label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.taxId ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.taxId && (
              <p className="text-red-500 text-xs mt-1">{formErrors.taxId}</p>
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