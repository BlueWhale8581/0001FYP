import React from 'react';

const LoadingState = ({ 
  message = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6 ${className}`}>
      <div className="loader border-t-4 border-blue-600 rounded-full w-12 h-12 animate-spin mb-4"></div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;