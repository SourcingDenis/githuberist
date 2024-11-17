import React, { useState } from 'react';
import { Github, Heart } from 'lucide-react';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';
import { GitHubUser, SearchResults } from './types/github';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { createTokenAuth } from '@octokit/auth-token';
import { Octokit } from '@octokit/rest';

function AppContent() {
  const { theme } = useTheme();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (page = 1) => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (!token) {
        throw new Error('GitHub token not configured. Please check environment variables.');
      }

      const octokit = new Octokit({ auth: token });
      const query = `${keyword} in:bio${location ? ` location:${location}` : ''}`;

      const searchResponse = await octokit.search.users({
        q: query,
        page,
        per_page: 10
      });
      
      if (searchResponse.data.items.length === 0) {
        setUsers([]);
        setTotalCount(0);
        setError('No users found matching your search criteria.');
        return;
      }

      const detailedUsers = await Promise.all(
        searchResponse.data.items.map(async (user) => {
          try {
            const [userData, mostUsedLanguage] = await Promise.all([
              octokit.users.getByUsername({ username: user.login }),
              getMostUsedLanguage(user.login, token)
            ]);
            
            return {
              ...userData.data,
              most_used_language: mostUsedLanguage
            };
          } catch (err) {
            return {
              ...user,
              name: user.login,
              bio: '',
              location: null,
              blog: null,
              twitter_username: null,
              followers: 0,
              following: 0,
              company: null,
              most_used_language: null
            };
          }
        })
      );

      setUsers(detailedUsers as GitHubUser[]);
      setTotalCount(Math.min(searchResponse.data.total_count, 1000));
      setCurrentPage(page);
    } catch (err) {
      console.error('Search error:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}` 
          : 'An error occurred while searching. Please try again later.'
      );
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getMostUsedLanguage = async (username: string, token: string) => {
    try {
      const octokit = new Octokit({ auth: token });
      
      const { data: repos } = await octokit.repos.listForUser({
        username,
        sort: 'pushed',
        per_page: 10
      });
      
      const languages = repos.map(repo => repo.language).filter(Boolean);
      
      if (languages.length === 0) return null;
      
      const languageCounts = languages.reduce<Record<string, number>>((acc, lang) => {
        if (lang) {
          acc[lang] = (acc[lang] || 0) + 1;
        }
        return acc;
      }, {});
      
      return Object.entries(languageCounts)
        .sort(([, a], [, b]) => b - a)[0][0];
    } catch {
      return null;
    }
  };

  const handlePageChange = (page: number) => {
    searchUsers(page);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-8 flex-grow max-w-5xl">
        <div className="flex justify-end mb-8">
          <ThemeSwitcher />
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Github className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
              <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} tracking-tight`}>
                GitHub Bio Search
              </h1>
            </div>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Find GitHub users by searching their bio descriptions
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <SearchBar 
              keyword={keyword}
              location={location}
              setKeyword={setKeyword}
              setLocation={setLocation}
              onSearch={() => searchUsers(1)}
            />
          </div>

          <div className="w-full mt-8">
            <UserList 
              users={users}
              totalCount={totalCount}
              currentPage={currentPage}
              loading={loading}
              error={error}
              searchKeyword={keyword}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      
      <footer className={`py-6 ${theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} border-t`}>
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center gap-2`}>
            Built with{' '}
            <a 
              href="https://cursor.sh"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-${theme === 'dark' ? 'white' : 'black'} transition-colors`}
            >
              Cursor
            </a>
            {' & '}
            <Heart 
              className="w-4 h-4 text-red-500 inline-block animate-pulse fill-current" 
              aria-label="love"
            />
            {' by '}
            <a 
              href="https://linkedin.com/in/sourcingdenis"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-${theme === 'dark' ? 'white' : 'black'} transition-colors`}
            >
              @sourcingdenis
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;