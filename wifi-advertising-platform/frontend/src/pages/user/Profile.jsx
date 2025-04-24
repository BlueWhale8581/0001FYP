import React, { useState } from 'react';
import { User, Key, Shield, Clock, FileText } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ProfilePage = () => {
  // Profile data
  const [profileData, setProfileData] = useState({
    name: 'John Admin',
    email: 'john.admin@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',
    department: 'IT Operations',
    joinDate: '2023-06-15',
    lastLogin: '2025-04-23 08:42 AM'
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Profile update form
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({...profileData});

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value
    });
  };

  // Submit handlers
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting password change:', passwordForm);
    // Implementation would go here
    
    // Reset form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Updating profile:', updatedProfile);
    // Implementation would go here
    
    // Update profile data and exit edit mode
    setProfileData({...updatedProfile});
    setEditMode(false);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Cancel edit - revert changes
      setUpdatedProfile({...profileData});
    }
    setEditMode(!editMode);
  };

  // Activity log data
  const activityLog = [
    { action: 'Login', timestamp: '2025-04-23 08:42 AM', details: 'Successful login from 192.168.1.105' },
    { action: 'Settings Changed', timestamp: '2025-04-22 03:15 PM', details: 'Updated server configuration' },
    { action: 'User Created', timestamp: '2025-04-22 11:30 AM', details: 'Created new merchant account for Coffee Shop' },
    { action: 'System Update', timestamp: '2025-04-21 09:22 AM', details: 'Ran system update v1.0.2' },
    { action: 'Login', timestamp: '2025-04-21 09:15 AM', details: 'Successful login from 192.168.1.105' },
  ];

  return (
    <DashboardTemplate
      role="admin"
      userName={profileData.name}
      notifications={[
        { id: 1, type: 'warning', message: 'System update required', time: '5m ago', read: false },
        { id: 2, type: 'error', message: 'Server #3 is offline', time: '30m ago', read: false },
      ]}
      pageTitle="My Profile"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                      <User size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">Profile Information</h3>
                  </div>
                  <Button
                    text={editMode ? "Cancel" : "Edit Profile"}
                    type="button"
                    className={`${editMode ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
                    onClick={toggleEditMode}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={updatedProfile.name}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Email Address</label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={updatedProfile.email}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={updatedProfile.phone}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Department</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="department"
                        value={updatedProfile.department}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.department}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Role</label>
                    <p className="text-gray-900">{profileData.role}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Contact your system administrator to change roles.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Join Date</label>
                    <p className="text-gray-900">{profileData.joinDate}</p>
                  </div>
                </div>
                
                {editMode && (
                  <div className="flex justify-end">
                    <Button
                      text="Save Changes"
                      type="submit"
                    />
                  </div>
                )}
              </div>
            </form>
          </Card>
          
          {/* Change Password */}
          <Card className="mt-4">
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <Key size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">Change Password</h3>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    text="Change Password"
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  />
                </div>
              </div>
            </form>
          </Card>
        </div>
        
        {/* Sidebar - Access & Activity */}
        <div className="space-y-4">
          {/* Account Information */}
          <Card>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Account Access</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-medium">{profileData.lastLogin}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Access Level</p>
                <p className="font-medium">Full System Access</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Two-Factor Authentication</p>
                <p className="font-medium text-green-600">Enabled</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Password Expiry</p>
                <p className="font-medium">45 days remaining</p>
              </div>
            </div>
          </Card>
          
          {/* Activity Log */}
          <Card title="Recent Activity" actionText="View All">
            <div className="space-y-3">
              {activityLog.map((activity, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3 py-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  <p className="text-xs text-gray-700 mt-1">{activity.details}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default ProfilePage;