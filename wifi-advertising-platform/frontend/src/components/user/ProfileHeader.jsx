import React from 'react';

const ProfileHeader = ({ userName, role, avatar }) => {
  return (
    <div className="flex items-center p-4 bg-gray-50 border rounded-lg">
      <img
        src={avatar}
        alt={`${userName}'s avatar`}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{userName}</h3>
        <p className="text-sm text-gray-500 capitalize">{role}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;