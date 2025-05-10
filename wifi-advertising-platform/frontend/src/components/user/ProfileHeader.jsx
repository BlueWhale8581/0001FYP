import React, { useEffect } from 'react';
import { useProfile } from '../../hooks/useUser';

const ProfileHeader = () => {
  const { profile, fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!profile) return null;

  return (
    <div className="flex items-center p-4 bg-gray-50 border rounded-lg">
      <img
        src={profile.avatar || '/default-avatar.png'}
        alt={`${profile.name}'s avatar`}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{profile.name}</h3>
        <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;