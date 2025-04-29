import React, { useEffect, useState } from 'react';
import { User, Key, Shield } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';

// Hooks
import { useProfile } from '../../hooks/useAdvertiser';
import { useNotifications } from '../../hooks/useAdvertiser';
import useAuth from '../../hooks/useAuth';

const ProfilePage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="My Profile"
      >
        <p className="text-center text-gray-500">Please log in to access your profile.</p>
      </DashboardTemplate>
    );
  }

  // Use the proper hooks for profile management
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();
  const { notifications } = useNotifications();
  const { changePassword } = useAuth();
  
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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
    // Reset error/success state when user starts typing
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(updatedProfile);
    if (result) {
      setEditMode(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    try {
      const result = await changePassword(passwordForm);
      if (result) {
        setPasswordSuccess(true);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setPasswordError(err.message || "Failed to change password");
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      setUpdatedProfile(profile);
    }
    setEditMode(!editMode);
  };

  if (loading && !profile) {
    return <LoadingState message="Loading profile information..." />;
  }

  return (
    <DashboardTemplate
      role={profile?.role || "advertiser"}
      userName={profile?.name || "User"}
      notifications={notifications?.map(notification => ({
        ...notification,
        time: notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Unknown'
      }))}
      pageTitle="My Profile"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
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
                        required
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.name || 'Not set'}</p>
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
                        required
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.email || 'Not set'}</p>
                    )}
                  </div>
                </div>
                
                {profile?.company && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Company Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="company"
                          value={updatedProfile.company || ''}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.company}</p>
                      )}
                    </div>
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
                        <p className="text-gray-900">{profile.phone || 'Not set'}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {editMode && (
                  <div className="flex justify-end">
                    <Button 
                      text="Save Changes" 
                      type="submit" 
                      disabled={loading}
                    />
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
                    required
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
                      required
                      minLength={8}
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
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    text="Change Password" 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700" 
                    disabled={loading}
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
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-medium">
                  {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Not available'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium capitalize">{profile?.role || 'Advertiser'}</p>
              </div>
              {profile?.subscription && (
                <div>
                  <p className="text-sm text-gray-500">Subscription Plan</p>
                  <p className="font-medium">{profile.subscription.plan}</p>
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