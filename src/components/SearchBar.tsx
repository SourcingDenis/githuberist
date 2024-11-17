import React from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  keyword: string;
  location: string;
  setKeyword: (value: string) => void;
  setLocation: (value: string) => void;
  onSearch: () => void;
}

function SearchBar({ keyword, location, setKeyword, setLocation, onSearch }: SearchBarProps) {
  const { theme } = useTheme();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex flex-col md:flex-row gap-4 p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="flex-1">
          <label htmlFor="keyword" className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Search by bio
          </label>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-black border-gray-800 text-white focus:border-gray-600' 
                  : 'bg-white border-gray-200 text-black focus:border-gray-400'
              } focus:outline-none transition-colors`}
              placeholder="Enter keywords..."
            />
          </div>
        </div>
        
        <div className="flex-1">
          <label htmlFor="location" className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Filter by location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              theme === 'dark' 
                ? 'bg-black border-gray-800 text-white focus:border-gray-600' 
                : 'bg-white border-gray-200 text-black focus:border-gray-400'
            } focus:outline-none transition-colors`}
            placeholder="Enter location..."
          />
        </div>
        
        <div className="flex items-end">
          <button
            type="submit"
            className={`w-full md:w-auto px-6 py-2 rounded-md font-medium transition-all ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-gray-200 active:bg-gray-300'
                : 'bg-black text-white hover:bg-gray-800 active:bg-gray-700'
            } shadow-sm hover:shadow focus:outline-none focus:ring-2 ${
              theme === 'dark' ? 'focus:ring-gray-400' : 'focus:ring-gray-600'
            } focus:ring-opacity-50`}
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;