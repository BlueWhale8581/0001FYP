import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../components/common/Button';

const MerchantDetailsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    business_name: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    business_category: '',
    tax_id: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/merchant/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        navigate('/merchant/dashboard');
      } else {
        setError(result.message || 'Failed to save details');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="guest"
        userName="Guest"
        pageTitle="Details"
      >
        <p className="text-center text-gray-500">Please log in to access the details page.</p>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate role="merchant" userName={user?.name || "Merchant"} pageTitle="Complete Your Profile">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Merchant Details</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Business Name</label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Address</label>
            <textarea
              name="business_address"
              value={formData.business_address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Phone</label>
            <input
              type="tel"
              name="business_phone"
              value={formData.business_phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Email</label>
            <input
              type="email"
              name="business_email"
              value={formData.business_email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Category</label>
            <input
              type="text"
              name="business_category"
              value={formData.business_category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Tax ID</label>
            <input
              type="text"
              name="tax_id"
              value={formData.tax_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <Button text="Save Details" type="submit" className="w-full" />
        </form>
      </div>
    </DashboardTemplate>
  );
};

export default MerchantDetailsPage;
