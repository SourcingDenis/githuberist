import React, { ChangeEvent, useCallback } from 'react';
import { Search, MapPin, Code, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import debounce from 'lodash/debounce';
import { motion } from 'framer-motion';

interface SearchBarProps {
  keyword: string;
  location: string;
  language: string;
  setKeyword: (value: string) => void;
  setLocation: (value: string) => void;
  setLanguage: (value: string) => void;
  onSearch?: () => void;
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

function SearchBar({ 
  keyword, 
  location, 
  language,
  setKeyword, 
  setLocation,
  setLanguage,
  onSearch 
}: SearchBarProps) {
  const { theme } = useTheme();

  const debouncedSearch = useCallback(
    debounce(() => {
      onSearch?.();
    }, 500),
    [onSearch]
  );

  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch();
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    debouncedSearch();
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLanguage(value);
    debouncedSearch();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`p-4 rounded-xl backdrop-blur-lg ${
        theme === 'dark' 
          ? 'bg-gray-900/50 border border-gray-800 shadow-lg shadow-gray-900/20' 
          : 'bg-white/50 border border-gray-200 shadow-lg shadow-gray-200/20'
      }`}>
        <div className="flex flex-col md:flex-row gap-4">
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative group">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'text-gray-400 group-hover:text-gray-300' 
                  : 'text-gray-500 group-hover:text-gray-600'
              }`} />
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={handleKeywordChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-black/50 border-gray-800 text-white placeholder-gray-500 focus:border-gray-700 hover:bg-black/70'
                    : 'bg-white border-gray-200 text-black placeholder-gray-400 focus:border-gray-300 hover:bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="Search by bio..."
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative group">
              <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'text-gray-400 group-hover:text-gray-300' 
                  : 'text-gray-500 group-hover:text-gray-600'
              }`} />
              <input
                id="location"
                type="text"
                value={location}
                onChange={handleLocationChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-black/50 border-gray-800 text-white placeholder-gray-500 focus:border-gray-700 hover:bg-black/70'
                    : 'bg-white border-gray-200 text-black placeholder-gray-400 focus:border-gray-300 hover:bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="Filter by location..."
              />
            </div>
          </motion.div>

          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative group">
              <Code className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'text-gray-400 group-hover:text-gray-300' 
                  : 'text-gray-500 group-hover:text-gray-600'
              }`} />
              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
                className={`w-full pl-10 pr-8 py-3 rounded-lg border appearance-none transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-black/50 border-gray-800 text-white focus:border-gray-700 hover:bg-black/70'
                    : 'bg-white border-gray-200 text-black focus:border-gray-300 hover:bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="">Any language</option>
                {PROGRAMMING_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 group-hover:translate-y-[-45%]">
                <ChevronDown className={`w-4 h-4 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'
                }`} />
              </div>
            </div>
          </motion.div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-gray-200 hover:shadow-lg hover:shadow-white/10'
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-black/20'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            Search
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}

export default SearchBar;