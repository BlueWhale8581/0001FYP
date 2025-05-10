import React from 'react';

const NotificationCounter = ({ count }) => {
  return (
    <div className="relative">
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {count}
      </span>
    </div>
  );
};

export default NotificationCounter;