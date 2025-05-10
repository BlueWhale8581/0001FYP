import React, { useState } from 'react';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useMerchants } from '../../hooks/useAgent';
import { useUsers } from '../../hooks/useAdmin';
import useAuth from '../../hooks/useAuth';

const MerchantsCreatePage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Create Merchant"
      >
        <p className="text-center text-gray-500">Please log in to create a merchant.</p>
      </DashboardTemplate>
    );
  }

  const { registerMerchant } = useMerchants();
  const { createUser } = useUsers();
  const [merchantFormData, setMerchantFormData] = useState({
    business_name: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    business_category: '',
    tax_id: '',
  });
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'merchant',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleMerchantChange = (e) => {
    const { name, value } = e.target;
    setMerchantFormData({ ...merchantFormData, [name]: value });
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create user first
      const user = await createUser(userFormData);

      // Register merchant with the created user's ID
      await registerMerchant({ ...merchantFormData, agent_id: user.id });
      setSuccess(true);

      // Reset form data
      setMerchantFormData({
        business_name: '',
        business_address: '',
        business_phone: '',
        business_email: '',
        business_category: '',
        tax_id: '',
      });
      setUserFormData({
        username: '',
        email: '',
        password: '',
        role: 'merchant',
        first_name: '',
        last_name: '',
        phone: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to create merchant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardTemplate
      role="agent"
      userName="Agent"
      pageTitle="Create Merchant"
    >
      <Card title="Register New Merchant">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Merchant registered successfully!</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold">Merchant Information</h3>
          <div>
            <label className="block text-sm text-gray-700">Business Name</label>
            <input
              type="text"
              name="business_name"
              value={merchantFormData.business_name}
              onChange={handleMerchantChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Address</label>
            <textarea
              name="business_address"
              value={merchantFormData.business_address}
              onChange={handleMerchantChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Phone</label>
            <input
              type="text"
              name="business_phone"
              value={merchantFormData.business_phone}
              onChange={handleMerchantChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Email</label>
            <input
              type="email"
              name="business_email"
              value={merchantFormData.business_email}
              onChange={handleMerchantChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Business Category</label>
            <input
              type="text"
              name="business_category"
              value={merchantFormData.business_category}
              onChange={handleMerchantChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Tax ID</label>
            <input
              type="text"
              name="tax_id"
              value={merchantFormData.tax_id}
              onChange={handleMerchantChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <h3 className="text-lg font-semibold">User Account Information</h3>
          <div>
            <label className="block text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={userFormData.username}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={userFormData.email}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={userFormData.password}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={userFormData.first_name}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={userFormData.last_name}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={userFormData.phone}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <Button text={loading ? 'Registering...' : 'Register Merchant'} type="submit" disabled={loading} />
        </form>
      </Card>
    </DashboardTemplate>
  );
};

export default MerchantsCreatePage;