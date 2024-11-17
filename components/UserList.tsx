import React from 'react';
import { GitHubUser } from '../types/github';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Link as LinkIcon, Twitter, Users, Building, ChevronLeft, ChevronRight } from 'lucide-react';

interface UserListProps {
  users: GitHubUser[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  searchKeyword: string;
  onPageChange: (page: number) => void;
}

function UserList({ 
  users, 
  totalCount, 
  currentPage, 
  loading, 
  error, 
  searchKeyword,
  onPageChange 
}: UserListProps) {
  const { theme } = useTheme();
  const totalPages = Math.ceil(Math.min(totalCount, 1000) / 10);

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
          <React.Fragment key={index}>
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
          </React.Fragment>
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
      <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        Loading...
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
    return (
      <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        Enter a search term to find GitHub users
      </div>
    );
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
      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        Found {totalCount.toLocaleString()} users
      </div>
      
      <div className="grid gap-4">
        {users.map((user) => (
          <div 
            key={user.id}
            className={`p-6 rounded-lg border transition-all ${
              theme === 'dark' 
                ? 'bg-black border-gray-800 hover:border-gray-700' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <img 
                src={user.avatar_url} 
                alt={`${user.login}'s avatar`}
                className="w-16 h-16 rounded-full"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-medium hover:underline ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  >
                    {user.name || user.login}
                  </a>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    @{user.login}
                  </span>
                </div>

                {user.bio && (
                  <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.bio}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {user.location && (
                    <div className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.blog && (
                    <a
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 hover:underline ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                  
                  {user.twitter_username && (
                    <a
                      href={`https://twitter.com/${user.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 hover:underline ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      <Twitter className="w-4 h-4" />
                      <span>@{user.twitter_username}</span>
                    </a>
                  )}
                  
                  {user.company && (
                    <div className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Building className="w-4 h-4" />
                      <span>{user.company}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Users className="w-4 h-4" />
                    <span>{user.followers.toLocaleString()} followers</span>
                  </div>
                  
                  {user.most_used_language && (
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Most used: {user.most_used_language}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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