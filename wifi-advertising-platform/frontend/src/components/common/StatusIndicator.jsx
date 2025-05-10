import React from 'react';

const StatusIndicator = ({
  status = 'Active',
  color = 'green',
  className = '',
}) => {
  const statusColors = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    gray: 'bg-gray-500',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <span
        className={`inline-block w-3 h-3 rounded-full ${statusColors[color]} mr-2`}
      ></span>
      <span className="text-sm text-gray-700">{status}</span>
    </div>
  );
};

export default StatusIndicator;