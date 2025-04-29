import React, { useEffect, useState } from 'react';
import { User, Key, Shield } from 'lucide-react';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

// Hooks
import { useProfile } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { profile, loading, error, fetchProfile, updateProfile, changePassword } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(updatedProfile);
    setEditMode(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    await changePassword(passwordForm);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const toggleEditMode = () => {
    if (editMode) {
      setUpdatedProfile(profile);
    }
    setEditMode(!editMode);
  };

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Profile"
      >
        <p className="text-center text-gray-500">Please log in to access your profile.</p>
      </DashboardTemplate>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <DashboardTemplate
      role={profile?.role}
      userName={profile?.name}
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
                  <Button text="Change Password" type="submit" className="bg-green-600 hover:bg-green-700" />
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
                <p className="font-medium">{profile?.lastLogin}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default ProfilePage;