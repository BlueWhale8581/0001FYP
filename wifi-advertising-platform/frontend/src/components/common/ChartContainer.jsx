import React from 'react';

const ChartContainer = ({
  title,
  actionText,
  onActionClick,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {(title || actionText) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
          {actionText && (
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={onActionClick}
            >
              {actionText}
            </button>
          )}
        </div>
      )}
      <div className="chart-content">{children}</div>
    </div>
  );
};

export default ChartContainer;