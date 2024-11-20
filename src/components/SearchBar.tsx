import React, { useState } from 'react';
import { Search, MapPin, Code, Hash, X, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { SearchFilters } from '../types/github';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  loading?: boolean;
}

const PROGRAMMING_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Ruby',
  'Go',
  'Rust',
  'PHP',
  'Swift',
  'Kotlin',
].sort();

export default function SearchBar({ filters, onFiltersChange, onSearch, loading }: SearchBarProps) {
  const { theme } = useTheme();
  const [activeFilters, setActiveFilters] = useState<('location' | 'language' | 'topics')[]>([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleFilter = (filter: 'location' | 'language' | 'topics') => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
      // Clear the filter value when removing it
      handleFilterChange(filter, filter === 'topics' ? [] : '');
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Search Bar */}
      <div className={`relative flex items-center gap-2 p-1 rounded-lg border transition-colors ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex-1 flex items-center gap-2">
          <Search className={`w-5 h-5 ml-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            placeholder="Search GitHub users..."
            className={`flex-1 px-2 py-3 bg-transparent border-none focus:outline-none ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`p-2 rounded-md transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Plus className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {showFilterMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${
                  theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="py-1">
                  {[
                    { id: 'location', label: 'Location', icon: MapPin },
                    { id: 'language', label: 'Language', icon: Code },
                    { id: 'topics', label: 'Topics', icon: Hash },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => {
                        toggleFilter(id as 'location' | 'language' | 'topics');
                        setShowFilterMenu(false);
                      }}
                      className={`w-full flex items-center px-4 py-2 text-sm ${
                        theme === 'dark'
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onSearch}
          disabled={loading}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-black text-white hover:bg-gray-800'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <motion.div
              key={filter}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-2 p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}
            >
              {filter === 'location' && (
                <>
                  <MapPin className="w-4 h-4" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="Enter location..."
                    className={`bg-transparent border-none focus:outline-none ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  />
                </>
              )}

              {filter === 'language' && (
                <>
                  <Code className="w-4 h-4" />
                  <select
                    value={filters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                    className={`bg-transparent border-none focus:outline-none ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  >
                    <option value="">Select language</option>
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {filter === 'topics' && (
                <>
                  <Hash className="w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Add topics..."
                    className={`bg-transparent border-none focus:outline-none ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  />
                </>
              )}

              <button
                onClick={() => toggleFilter(filter)}
                className={`p-1 rounded-md transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-800 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}