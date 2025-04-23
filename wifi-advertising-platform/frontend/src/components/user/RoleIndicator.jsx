import React from 'react';

const RoleIndicator = ({ role, color = 'blue' }) => {
  return (
    <div className={`flex items-center px-4 py-2 bg-${color}-50 border rounded-lg`}>
      <span className={`text-${color}-600 font-semibold capitalize`}>{role}</span>
    </div>
  );
};

export default RoleIndicator;