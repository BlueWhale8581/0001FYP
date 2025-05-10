import React, { useState } from 'react';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useUsers } from '../../hooks/useAdmin';
import useAuth from '../../hooks/useAuth';

const UsersCreatePage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Create User"
      >
        <p className="text-center text-gray-500">Please log in to create a user.</p>
      </DashboardTemplate>
    );
  }

  const { createUser } = useUsers();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [roleSpecificData, setRoleSpecificData] = useState({
     // For agents
    commission_rate: '',
    territory: '',
    // For advertisers
    company_name: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    industry: '',
    // For merchants
    business_name: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    business_category: '',
    tax_id: '',
    agent_id: '',
    approval_status: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSpecificChange = (e) => {
    const { name, value } = e.target;
    setRoleSpecificData({ ...roleSpecificData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create the user
      const user = await createUser(formData);

      // Handle role-specific data
      if (formData.role === 'agent') {
        await createAgent({
          user_id: user.id,
          commission_rate: roleSpecificData.commission_rate,
          territory: roleSpecificData.territory,
        });
      } else if (formData.role === 'advertiser') {
        await createAdvertiser({
          id: user.id,
          company_name: roleSpecificData.company_name,
          company_address: roleSpecificData.company_address,
        });
      } else if (formData.role === 'merchant') {
        await createMerchant({
          id: user.id,
          business_name: roleSpecificData.business_name,
          business_address: roleSpecificData.business_address,
        });
      }

      setSuccess(true);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: '',
        first_name: '',
        last_name: '',
        phone: '',
      });
      setRoleSpecificData({
        commission_rate: '',
        territory: '',
        company_name: '',
        company_address: '',
        business_name: '',
        business_address: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardTemplate
      role="admin"
      userName="Admin"
      pageTitle="Create User"
    >
      <Card title="Create New User">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">User created successfully!</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
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
          <div>
            <label className="block text-sm text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="advertiser">Advertiser</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>
          {formData.role === 'agent' && (
            <>
              <div>
                <label className="block text-sm text-gray-700">Commission Rate</label>
                <input
                  type="number"
                  name="commission_rate"
                  value={roleSpecificData.commission_rate}
                  onChange={handleRoleSpecificChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Territory</label>
                <input
                  type="text"
                  name="territory"
                  value={roleSpecificData.territory}
                  onChange={handleRoleSpecificChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}
          {formData.role === 'advertiser' && (
            <>
              <div>
                <label className="block text-sm text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={roleSpecificData.company_name}
                  onChange={handleRoleSpecificChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Company Address</label>
                <textarea
                  name="company_address"
                  value={roleSpecificData.company_address}
                  onChange={handleRoleSpecificChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}
          {formData.role === 'merchant' && (
            <>
              <div>
                <label className="block text-sm text-gray-700">Business Name</label>
                <input
                  type="text"
                  name="business_name"
                  value={roleSpecificData.business_name}
                  onChange={handleRoleSpecificChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Business Address</label>
                <textarea
                  name="business_address"
                  value={roleSpecificData.business_address}
                  onChange={handleRoleSpecificChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}
          <Button text={loading ? 'Creating...' : 'Create User'} type="submit" disabled={loading} />
        </form>
      </Card>
    </DashboardTemplate>
  );
};

export default UsersCreatePage;