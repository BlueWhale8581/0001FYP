import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useUsers } from '../../hooks/useAdmin';
import useAuth from '../../hooks/useAuth';

const UsersEditPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = users.find((u) => u.id === parseInt(id, 10));
        if (!user) {
          throw new Error('User not found');
        }
        setFormData(user);
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to update this user?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUser(id, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardTemplate role="admin" userName={user?.name || "Admin"} pageTitle="Edit User">
        <Card>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading user data...</p>
          </div>
        </Card>
      </DashboardTemplate>
    );
  }

  if (loadError) {
    return (
      <DashboardTemplate role="admin" userName={user?.name || "Admin"} pageTitle="Edit User">
        <Card>
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{loadError}</p>
          </div>
        </Card>
      </DashboardTemplate>
    );
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