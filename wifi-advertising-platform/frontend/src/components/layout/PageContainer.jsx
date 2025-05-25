// components/layout/PageContainer.jsx
import React from 'react';
import { ChevronLeft } from 'lucide-react';

const PageContainer = ({ 
  children,
  showBackButton = false,
  onBackClick,
  title = ''
}) => {
  return (
    <div className="w-full min-h-full px-4 pb-4">
      {(showBackButton || title) && (
        <div className="flex items-center text-sm text-black mb-4">
          {showBackButton && (
            <button className="flex items-center" onClick={onBackClick}>
              <ChevronLeft size={16} className="mr-1" />
              <span>Back</span>
            </button>
          )}
          {title && (
            <h2 className={`${showBackButton ? 'ml-4' : ''} font-medium text-black`}>{title}</h2>
          )}
        </div>
      )}
      
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;