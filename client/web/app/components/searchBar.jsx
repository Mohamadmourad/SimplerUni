// components/SearchBar.jsx

import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  showBannedOnly, 
  setShowBannedOnly 
}) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow p-4 mb-6 transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="banned-only" className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                id="banned-only"
                type="checkbox"
                className="sr-only"
                checked={showBannedOnly}
                onChange={() => setShowBannedOnly(!showBannedOnly)}
              />
              <div className={`block w-12 h-6 rounded-full transition-colors duration-200 ${showBannedOnly ? 'bg-red-500' : 'bg-gray-700'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${showBannedOnly ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-300">
              {showBannedOnly ? 'Showing banned only' : 'Show all users'}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
