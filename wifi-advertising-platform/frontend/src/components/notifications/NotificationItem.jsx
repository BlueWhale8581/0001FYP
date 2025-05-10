import React from 'react';

const NotificationItem = ({ type, message, time, read }) => {
  const typeColors = {
    info: 'blue',
    success: 'green',
    warning: 'yellow',
    error: 'red',
  };

  const color = typeColors[type] || 'gray';

  return (
    <div
      className={`p-3 border-l-4 rounded-lg ${
        read ? 'bg-gray-100' : `bg-${color}-50`
      } border-${color}-500`}
    >
      <p className={`text-${color}-600 font-medium`}>{message}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  );
};

export default NotificationItem;