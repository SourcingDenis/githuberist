import React, { ChangeEvent } from 'react';
import { Search, MapPin, Code, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  keyword: string;
  location: string;
  language: string;
  setKeyword: (value: string) => void;
  setLocation: (value: string) => void;
  setLanguage: (value: string) => void;
  onSearch: () => void;
}

// Common programming languages
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch();
  };

  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`p-4 rounded-xl ${
        theme === 'dark' 
          ? 'bg-gray-900/50 border border-gray-800' 
          : 'bg-gray-50 border border-gray-100'
      }`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={handleKeywordChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-black border-gray-800 text-white focus:border-gray-700'
                    : 'bg-white border-gray-200 text-black focus:border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                placeholder="Search by bio..."
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="relative">
              <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                id="location"
                type="text"
                value={location}
                onChange={handleLocationChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-black border-gray-800 text-white focus:border-gray-700'
                    : 'bg-white border-gray-200 text-black focus:border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                placeholder="Filter by location..."
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <Code className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border appearance-none ${
                  theme === 'dark'
                    ? 'bg-black border-gray-800 text-white focus:border-gray-700'
                    : 'bg-white border-gray-200 text-black focus:border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
              >
                <option value="">Any language</option>
                {PROGRAMMING_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-black text-white hover:bg-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;