import React from 'react';

const EmptyState = ({
  title = 'No Data Available',
  description = 'There is currently no data to display.',
  actionText,
  onActionClick,
  className = '',
}) => {
  return (
    <div className={`bg-gray-100 rounded-lg p-6 text-center ${className}`}>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
      {actionText && (
        <button
          className="mt-4 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={onActionClick}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;