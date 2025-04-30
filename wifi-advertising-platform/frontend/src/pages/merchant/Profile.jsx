import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardTemplate from '../../templates/DashboardTemplate';
import useAuth from '../../hooks/useAuth';
import useProfile from '../../hooks/useProfile';
import Card from '../../components/common/Card';

const ProfilePage = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { profile, loading: profileLoading, error } = useProfile("merchant");

  if (authLoading) {
    return <DashboardTemplate role="merchant" pageTitle="Loading..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardTemplate role="merchant" pageTitle="Merchant Profile">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {profileLoading && <div>Loading profile...</div>}
          {error && <div className="text-red-500">{error}</div>}
          
          {!profileLoading && !error && profile && (
            <div className="flex flex-col space-y-4">
              {/* Main Profile Content */}
              <Card>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Name</label>
                      <div className="text-black">{profile.first_name+' '+profile.last_name || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <div className="text-black">{profile.email || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Role Profile Content */}
              <Card>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Role Information</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Business Name</label>
                      <div className="text-black">{profile.business_name|| 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Business Email</label>
                      <div className="text-black">{profile.business_email || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Business Address</label>
                      <div className="text-black">{profile.business_address || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Business Phone</label>
                      <div className="text-black">{profile.business_phone || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Category</label>
                      <div className="text-black">{profile.business_category || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Password Change Section */}
              <Card>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Change Password</h2>
                  <form>
                    <div className="space-y-4">
                      <input
                        type="password"
                        name="currentPassword"
                        className="input w-full"
                        placeholder="Current Password"
                      />
                      <input
                        type="password"
                        name="newPassword"
                        className="input w-full"
                        placeholder="New Password"
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        className="input w-full"
                        placeholder="Confirm New Password"
                      />
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </Card>
            </div>
          )}
        </div>
        
        {/* Side Content */}
        <div className="col-span-1">
          {!profileLoading && !error && profile && (
            <Card>
              <div className="space-y-4 text-black">
                <div className="flex items-center space-x-2">
                  <span>Account Type: Merchant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Account Status: Active</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default ProfilePage;