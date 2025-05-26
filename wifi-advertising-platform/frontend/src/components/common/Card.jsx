// components/common/Card.jsx
import React from 'react';

const Card = ({ 
  title, 
  actionText,
  onActionClick,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 text-gray-700 ${className}`}>
      {(title || actionText) && (
        <div className="flex justify-between items-center mb-3">
          {title && <h3 className="font-medium text-gray-700">{title}</h3>}
          {actionText && (
            <button 
              className="text-xs text-gray-800"
              onClick={onActionClick}
            >
              {actionText}
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;