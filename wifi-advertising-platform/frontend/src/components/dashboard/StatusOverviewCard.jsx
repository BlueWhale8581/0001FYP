import React from 'react';

const StatusOverviewCard = ({ title, status, description, icon: Icon, color = 'blue' }) => {
  return (
    <div className={`p-4 border rounded-lg bg-${color}-50`}>
      <div className="flex items-center">
        {Icon && <Icon size={24} className={`text-${color}-600 mr-3`} />}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className={`mt-4 text-${color}-600 font-bold text-xl`}>{status}</div>
    </div>
  );
};

export default StatusOverviewCard;