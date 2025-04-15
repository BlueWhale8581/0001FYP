// components/layout/BottomNavigation.jsx
import React from 'react';

const BottomNavigation = ({ 
  navigationItems = [], 
  activeTabId = '',
  onTabChange,
  roleColor = 'blue' // Used for text color highlights
}) => {
  return (
    <div className="bg-white border-t flex justify-around shadow-lg">
      {navigationItems.map(item => (
        <button
          key={item.id}
          className={`py-2 px-4 flex flex-col items-center ${
            activeTabId === item.id 
              ? `text-${roleColor}-600` 
              : 'text-gray-500'
          }`}
          onClick={() => onTabChange(item.id)}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;