import React, { useState } from 'react';
import { User, UserPlus, Filter } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import StatusIndicator from '../../components/common/StatusIndicator';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

// Hooks
import { useUsers, useDashboardStats } from '../../hooks/useAdmin';
import useAuth from '../../hooks/useAuth';

const UsersPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Users Management"
      >
        <p className="text-center text-gray-500">Please log in to manage users.</p>
      </DashboardTemplate>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch users using the hook
  const { 
    users, 
    loading: usersLoading, 
    error: usersError,
    params,
    setParams,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    changeUserStatus
  } = useUsers();
  
  // Fetch dashboard stats for user counts
  const { 
    stats, 
    loading: statsLoading, 
    error: statsError 
  } = useDashboardStats();

  const handleSearch = () => {
    setParams({
      ...params,
      search: searchTerm
    });
    fetchUsers({
      ...params,
      search: searchTerm
    });
  };

  const handleAddUser = () => {
    // Implementation for adding a new user
    console.log('Add user clicked');
    navigate('/admin/createuser');
  };

  const handleEditUser = (userId) => {
    // Implementation for editing a user
    console.log('Edit user', userId);
    navigate(`/admin/edituser/${userId}`);
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    navigate('/admin/users');
  };

  const handleChangeStatus = async (userId, newStatus) => {
    await changeUserStatus(userId, newStatus);
  };

  return (
    <DashboardTemplate
      role="admin"
      userName="John Admin"
      notifications={[
        { id: 1, type: 'warning', message: 'System update required', time: '5m ago', read: false },
        { id: 2, type: 'error', message: 'Server #3 is offline', time: '30m ago', read: false },
      ]}
      pageTitle="Users Management"
    >
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <SearchBar
          placeholder="Search users..."
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          className="flex-grow"
        />
        <div className="flex gap-2">
          <Button
            text="Add User"
            className="flex items-center"
            onClick={handleAddUser}
          />
          <Button
            text="Filter"
            className="bg-gray-600 hover:bg-gray-700 flex items-center"
            onClick={() => console.log('Filter clicked')}
          />
        </div>
      </div>

      {/* Users Stats */}
      <Card className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-blue-600">
              {statsLoading ? '...' : (stats?.users?.total || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-xl font-bold text-green-600">
              {statsLoading ? '...' : (stats?.users?.active || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Users</p>
            <p className="text-xl font-bold text-yellow-600">
              {statsLoading ? '...' : (stats?.users?.pending || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Inactive Users</p>
            <p className="text-xl font-bold text-red-600">
              {statsLoading ? '...' : (stats?.users?.inactive || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <Card title="Users List" actionText="Export">
        {usersLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : usersError ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{usersError}</p>
          </div>
        ) : users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id || user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={16} className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator 
                        status={user.status} 
                        color={
                          user.status === 'Active' ? 'green' : 
                          user.status === 'Pending' ? 'yellow' : 'red'
                        } 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActiveFormatted || 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleEditUser(user._id || user.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteUser(user._id || user.id)}
                      >
                        Delete
                      </button>
                      {user.status !== 'Active' && (
                        <button 
                          className="text-green-600 hover:text-green-900 ml-3"
                          onClick={() => handleChangeStatus(user._id || user.id, 'Active')}
                        >
                          Activate
                        </button>
                      )}
                      {user.status === 'Active' && (
                        <button 
                          className="text-yellow-600 hover:text-yellow-900 ml-3"
                          onClick={() => handleChangeStatus(user._id || user.id, 'Inactive')}
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            title="No Users Found" 
            description="There are no users matching your search criteria."
            actionText="Add New User"
            onActionClick={handleAddUser}
          />
        )}
      </Card>
    </DashboardTemplate>
  );
};

export default UsersPage;