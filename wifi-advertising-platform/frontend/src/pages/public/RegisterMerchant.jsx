import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../components/common/Button';

const RegisterMerchant = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    business_name: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    business_category: '',
    tax_id: '',
    logo_url: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) {
        errors[key] = `${key.replace(/_/g, ' ')} is required`;
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // TODO: Implement API call to save merchant details
    try {
      // Add API call here
      navigate('/login'); // Redirect to login after successful registration
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <DashboardTemplate
      role="user"
      userName="New Merchant"
      pageTitle="Complete Merchant Registration"
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4 text-black">Business Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Business Name*</label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.business_name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.business_name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.business_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Business Address*</label>
            <textarea
              name="business_address"
              value={formData.business_address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.business_address ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              rows="3"
            />
            {formErrors.business_address && (
              <p className="text-red-500 text-xs mt-1">{formErrors.business_address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Business Phone*</label>
            <input
              type="tel"
              name="business_phone"
              value={formData.business_phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.business_phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.business_phone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.business_phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Business Email*</label>
            <input
              type="email"
              name="business_email"
              value={formData.business_email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.business_email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.business_email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.business_email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Business Category*</label>
            <input
              type="text"
              name="business_category"
              value={formData.business_category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.business_category ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.business_category && (
              <p className="text-red-500 text-xs mt-1">{formErrors.business_category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Tax ID*</label>
            <input
              type="text"
              name="tax_id"
              value={formData.tax_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.tax_id ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.tax_id && (
              <p className="text-red-500 text-xs mt-1">{formErrors.tax_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Logo URL*</label>
            <input
              type="text"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.logo_url ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.logo_url && (
              <p className="text-red-500 text-xs mt-1">{formErrors.logo_url}</p>
            )}
          </div>

          <Button
            text="Complete Registration"
            type="submit"
            className="w-full"
          />
        </form>
      </div>
    </DashboardTemplate>
  );
};

export default RegisterMerchant;
