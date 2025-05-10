import React from 'react';

const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  className = '',
}) => {
  return (
    <div className={`flex items-center bg-white rounded-lg shadow-sm p-2 ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;