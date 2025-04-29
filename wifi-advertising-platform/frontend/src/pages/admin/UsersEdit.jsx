import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useUsers } from '../../hooks/useAdmin';
import useAuth from '../../hooks/useAuth';

const UsersEditPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="guest"
        userName="Guest"
        pageTitle="Edit User"
      >
        <p className="text-center text-gray-500">Please log in to edit user details.</p>
      </DashboardTemplate>
    );
  }

  const { id } = useParams();
  const { users, updateUser } = useUsers();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const user = users.find((u) => u.id === parseInt(id, 10));
    if (user) {
      setFormData(user);
    }
  }, [id, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUser(id, formData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return <p>Loading user data...</p>;
  }

  return (
    <DashboardTemplate
      role="admin"
      userName="Admin"
      pageTitle="Edit User"
    >
      <Card title="Edit User">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">User updated successfully!</p>}
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
            <label className="block text-sm text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="admin">Admin</option>
              <option value="advertiser">Advertiser</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <Button text={loading ? 'Updating...' : 'Update User'} type="submit" disabled={loading} />
        </form>
      </Card>
    </DashboardTemplate>
  );
};

export default UsersEditPage;