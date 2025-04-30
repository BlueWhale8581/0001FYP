import React, { useState, useEffect } from 'react';
import { User, Key, Shield } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import useProfile from '../hooks/useProfile';

const ProfileLayout = ({ role, extraFields, children }) => {
  const { isAuthenticated, user: authUser } = useAuth();
  const { profile, loading, error, fetchProfile } = useProfile(role);
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
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setUpdatedProfile(profile);
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // Implement update profile logic here
    setEditMode(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    try {
      // Implement password change logic
      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setPasswordError(err.message || "Failed to change password");
    }
  };

  // Generate the main content
  const mainContent = (
    <>
      <Card>
        <form onSubmit={handleProfileSubmit}>
          <div className="space-y-4">
            {/* Basic profile fields */}
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                value={updatedProfile.name || ''}
                onChange={handleProfileChange}
                className="input"
                placeholder="Name"
              />
              {extraFields?.map(field => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={updatedProfile[field] || ''}
                  onChange={handleProfileChange}
                  className="input"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
              ))}
            </div>
            <Button type="submit" disabled={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
      <Card className="mt-4">
        <form onSubmit={handlePasswordSubmit}>
          <div className="space-y-4">
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="input"
              placeholder="Current Password"
            />
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="input"
              placeholder="New Password"
            />
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="input"
              placeholder="Confirm New Password"
            />
            {passwordError && <div className="text-red-500">{passwordError}</div>}
            {passwordSuccess && <div className="text-green-500">Password updated successfully!</div>}
            <Button type="submit" disabled={loading}>
              Change Password
            </Button>
          </div>
        </form>
      </Card>
    </>
  );

  // Generate the side content
  const sideContent = (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Account Type: {role.charAt(0).toUpperCase() + role.slice(1)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>Last Login: {authUser?.lastLogin ? new Date(authUser.lastLogin).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Account Status: Active</span>
        </div>
      </div>
    </Card>
  );

  if (!isAuthenticated || !authUser) {
    return <div>Not authenticated</div>;
  }

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // If a render prop is provided, use it
  if (typeof children === 'function') {
    return children({
      mainContent,
      sideContent,
      loading,
      error
    });
  }

  // Default rendering
  return (
    <div className="flex flex-col space-y-4">
      {mainContent}
      {sideContent}
    </div>
  );
};

export default ProfileLayout;