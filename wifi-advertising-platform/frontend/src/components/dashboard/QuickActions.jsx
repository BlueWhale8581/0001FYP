import React from 'react';

const QuickActions = ({ actions }) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;