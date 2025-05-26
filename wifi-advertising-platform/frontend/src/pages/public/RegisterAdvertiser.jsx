import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../components/common/Button';

const RegisterAdvertiser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    industry: ''
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

    try {
      const response = await fetch('/api/auth/register-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'advertiser',
          userId,
          roleData: {
            company_name: formData.company_name,
            company_address: formData.company_address,
            company_phone: formData.company_phone,
            company_email: formData.company_email,
            industry: formData.industry
          }
        }),
      });

      if (response.ok) {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please login to continue.' 
          }
        });
      } else {
        throw new Error('Failed to register advertiser details');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <DashboardTemplate
      role="user"
      userName="New Advertiser"
      pageTitle="Complete Advertiser Registration"
    >
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4 text-black">Company Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Company Name*</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.company_name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.company_name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.company_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Company Address*</label>
            <textarea
              name="company_address"
              value={formData.company_address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.company_address ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              rows="3"
            />
            {formErrors.company_address && (
              <p className="text-red-500 text-xs mt-1">{formErrors.company_address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Company Phone*</label>
            <input
              type="tel"
              name="company_phone"
              value={formData.company_phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.company_phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.company_phone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.company_phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Company Email*</label>
            <input
              type="email"
              name="company_email"
              value={formData.company_email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.company_email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {formErrors.company_email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.company_email}</p>
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
            text="Complete Registration"
            type="submit"
            className="w-full"
          />
        </form>
      </div>
    </DashboardTemplate>
  );
};

export default RegisterAdvertiser;
