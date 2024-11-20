import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Link as LinkIcon, Twitter, Users, Building, Star, ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { SortOption, GitHubUser } from '../types/github';
import LanguageBadge from './LanguageBadge';
import { Fragment } from 'react';

interface UserListProps {
  users: GitHubUser[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  searchKeyword: string;
  sortBy: SortOption;
  onPageChange: (page: number) => void;
  onSortChange: (sort: SortOption) => void;
}

const ITEMS_PER_PAGE = 12;

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

function UserList({ 
  users, 
  totalCount, 
  currentPage, 
  loading, 
  error, 
  searchKeyword,
  sortBy,
  onPageChange,
  onSortChange 
}: UserListProps) {
  const { theme } = useTheme();
  const totalPages = Math.ceil(Math.min(totalCount, 1000) / ITEMS_PER_PAGE);

  const renderPaginationButtons = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white disabled:text-gray-600'
              : 'text-gray-600 hover:text-black disabled:text-gray-300'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {pages.map((page, index) => (
          <Fragment key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  currentPage === page
                    ? theme === 'dark'
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {page}
              </button>
            ) : (
              <span className={`px-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {page}
              </span>
            )}
          </Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white disabled:text-gray-600'
              : 'text-gray-600 hover:text-black disabled:text-gray-300'
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`animate-pulse p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
              }`} />
              <div className="flex-1 space-y-3">
                <div className={`h-4 rounded ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                }`} />
                <div className={`h-3 rounded ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!searchKeyword) {
    return null;
  }

  if (users.length === 0) {
    return (
      <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        No users found matching your criteria
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <span className="text-lg font-medium">
            {totalCount.toLocaleString()} {totalCount === 1 ? 'user' : 'users'} found
          </span>
          <span className="text-sm ml-4">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount.toLocaleString()}
          </span>
        </div>

        <Select
          value={sortBy}
          onValueChange={(value: SortOption) => onSortChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Most relevant</SelectItem>
            <SelectItem value="followers">Most followers</SelectItem>
            <SelectItem value="repositories">Most repositories</SelectItem>
            <SelectItem value="stars">Most stars received</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        {users.map((user) => (
          <Card 
            key={user.id} 
            className={`w-full transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
              theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-800 hover:bg-gray-800/70' 
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start p-6 gap-6">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <a 
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <img 
                    src={user.avatar_url} 
                    alt={`${user.login}'s avatar`}
                    className={`w-20 h-20 rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform duration-300 group-hover:scale-105
                      ${theme === 'dark' ? 'ring-gray-700' : 'ring-gray-200'}`}
                  />
                </a>
              </div>

              {/* Main Content Section */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xl font-semibold hover:underline ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {user.name || user.login}
                      </a>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        @{user.login}
                      </span>
                    </div>

                    {user.bio && (
                      <p className={`text-sm leading-relaxed mb-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {user.bio}
                      </p>
                    )}
                  </div>

                  {user.most_used_language && (
                    <div className="flex-shrink-0">
                      <LanguageBadge language={user.most_used_language} />
                    </div>
                  )}
                </div>

                {/* Stats Section */}
                <div className="flex flex-wrap gap-6 mb-4">
                  <div className={`flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <Users className="w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">{formatNumber(user.followers)}</span>
                      <span className="text-xs">followers</span>
                    </div>
                  </div>

                  {user.public_repos > 0 && (
                    <div className={`flex items-center gap-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <Star className="w-5 h-5" />
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold">{formatNumber(user.public_repos)}</span>
                        <span className="text-xs">repositories</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="flex flex-wrap gap-4">
                  {user.location && (
                    <span className={`flex items-center gap-1.5 text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </span>
                  )}
                  {user.company && (
                    <span className={`flex items-center gap-1.5 text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <Building className="w-4 h-4" />
                      {user.company}
                    </span>
                  )}
                  {user.blog && (
                    <a
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-400"
                    >
                      {user.blog.toLowerCase().includes('linkedin.com') ? (
                        <>
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4" />
                          Website
                        </>
                      )}
                    </a>
                  )}
                  {user.twitter_username && (
                    <a
                      href={`https://twitter.com/${user.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-400"
                    >
                      <Twitter className="w-4 h-4" />
                      @{user.twitter_username}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          {renderPaginationButtons()}
          <div className={`text-center mt-4 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;