import React from 'react';

const MetricsChart = ({ title, chart }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div>{chart}</div>
    </div>
  );
};

export default MetricsChart;