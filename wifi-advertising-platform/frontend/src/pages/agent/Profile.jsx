import React, { useEffect, useState } from 'react';
import { User, Key, Shield } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

// Hooks
import useAuth from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useAgent';
import { useNotifications } from '../../hooks/useAgent';

const ProfilePage = () => {
  const { user: authUser, changePassword } = useAuth();
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useProfile();
  const { notifications } = useNotifications();
  
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Initialize updatedProfile when profile data loads
  useEffect(() => {
    if (profile) {
      setUpdatedProfile(profile);
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
    // Reset messages when user starts typing
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(updatedProfile);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    try {
      await changePassword(passwordForm);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(err.message || "Failed to change password");
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      // Reset form if canceling edit
      setUpdatedProfile(profile);
    }
    setEditMode(!editMode);
  };

  if (profileLoading) {
    return (
      <DashboardTemplate
        role={authUser?.role}
        userName={authUser?.name}
        notifications={notifications}
        pageTitle="My Profile"
      >
        <div className="flex justify-center items-center h-64">
          <p>Loading profile...</p>
        </div>
      </DashboardTemplate>
    );
  }

  if (profileError) {
    return (
      <DashboardTemplate
        role={authUser?.role}
        userName={authUser?.name}
        notifications={notifications}
        pageTitle="My Profile"
      >
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading profile: {profileError}</p>
        </div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role={authUser?.role}
      userName={authUser?.name}
      notifications={notifications}
      pageTitle="My Profile"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                        value={updatedProfile.name || ''}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Email Address</label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={updatedProfile.email || ''}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.email}</p>
                    )}
                  </div>
                  {profile?.phone && (
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                      {editMode ? (
                        <input
                          type="tel"
                          name="phone"
                          value={updatedProfile.phone || ''}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.phone}</p>
                      )}
                    </div>
                  )}
                </div>
                {editMode && (
                  <div className="flex justify-end">
                    <Button text="Save Changes" type="submit" />
                  </div>
                )}
              </div>
            </form>
          </Card>
          <Card className="mt-4">
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <Key size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">Change Password</h3>
                </div>
                
                {passwordError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {passwordError}
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Password changed successfully!
                  </div>
                )}
                
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
        <div className="space-y-4">
          <Card>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Account Access</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{profile?.role || authUser?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-medium">{profile?.lastLogin || 'Not available'}</p>
              </div>
              {profile?.registrationDate && (
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-medium">{profile.registrationDate}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default ProfilePage;