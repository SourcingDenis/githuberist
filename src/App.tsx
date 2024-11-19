import React, { useState, useEffect } from 'react';
import { Github, Heart } from 'lucide-react';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';
import { GitHubUser, SortOption } from './types/github';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Octokit } from '@octokit/rest';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { motion } from 'framer-motion';

const stats = [
  { name: 'Pull Requests', value: '4.2B+' },
  { name: 'Programming Languages', value: '50+' },
  { name: 'Developers', value: '5M+' },
];

function AppContent() {
  const { theme } = useTheme();
  const { isAuthenticated, login, accessToken, error: authError } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Redirect user to the home screen after logging in
  useEffect(() => {
    if (isAuthenticated) {
      // Remove the OAuth code from the URL
      window.history.replaceState({}, document.title, '/');
    }
  }, [isAuthenticated]);

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
    if (keyword) {
      searchUsers(keyword, 1, newSort);
    }
  };

  const searchUsers = async (query: string, page = 1, sort: SortOption = sortBy) => {
    if (!query.trim()) return;

    // Check for authentication before proceeding
    if (!isAuthenticated || !accessToken) {
      setError('Please sign in with GitHub to search users');
      setUsers([]);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const octokit = new Octokit({ auth: accessToken });
      let endpoint = `${query} in:bio${location ? ` location:${location}` : ''}`;

      const searchResponse = await octokit.search.users({
        q: endpoint,
        page,
        per_page: 12,
        ...(sort === 'followers' || sort === 'repositories' ? { sort, order: 'desc' } : {}),
      });

      if (searchResponse.data.items.length === 0) {
        setUsers([]);
        setTotalCount(0);
        setError('No users found matching your search criteria.');
        return;
      }

      let users = await Promise.all(
        searchResponse.data.items.map(async (user) => {
          try {
            const [userData, mostUsedLanguage] = await Promise.all([
              octokit.users.getByUsername({ username: user.login }),
              getMostUsedLanguage(user.login, accessToken),
            ]);

            let totalStars = 0;
            if (sort === 'stars') {
              const { data: repos } = await octokit.repos.listForUser({
                username: user.login,
                per_page: 100,
                type: 'owner',
              });
              totalStars = (repos || []).reduce((acc, repo) => 
                acc + (repo.fork ? 0 : (repo.stargazers_count || 0)), 0
              );
            }

            return {
              ...userData.data,
              most_used_language: mostUsedLanguage,
              total_stars: totalStars,
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
              most_used_language: null,
              total_stars: 0,
            };
          }
        })
      );

      if (sort === 'stars') {
        users.sort((a, b) => (b.total_stars || 0) - (a.total_stars || 0));
      }

      setUsers(users as GitHubUser[]);
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
        per_page: 10,
      });

      const languages = repos.map((repo) => repo.language).filter(Boolean);

      if (languages.length === 0) return null;

      const languageCounts = languages.reduce<Record<string, number>>((acc, lang) => {
        if (lang) {
          acc[lang] = (acc[lang] || 0) + 1;
        }
        return acc;
      }, {});

      return Object.entries(languageCounts).sort(([, a], [, b]) => b - a)[0][0];
    } catch {
      return null;
    }
  };

  const handlePageChange = (page: number) => {
    searchUsers(keyword, page);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        <div className="flex justify-end mb-8">
          <ThemeSwitcher />
        </div>

        <div className="flex flex-col items-center">
          {!isAuthenticated ? (
            // Show hero section only for non-authenticated users
            <div className="text-center relative mb-12 w-full max-w-4xl mx-auto">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse-slow rounded-full" />
              
              <div className="flex items-center justify-center space-x-3 mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                  <Github 
                    className={`w-12 h-12 relative ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    } transform group-hover:scale-110 transition-transform duration-300`} 
                  />
                </div>
                <h1
                  className={`text-5xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  } tracking-tight relative`}
                >
                  DevFinder
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                </h1>
              </div>

              <h2 className={`text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient-x`}>
                Discover talented developers worldwide
              </h2>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {['Advanced Search', 'Real-time Data', 'GitHub Integration'].map((feature, index) => (
                  <div
                    key={feature}
                    className={`px-4 py-2 rounded-full text-sm font-medium 
                      ${theme === 'dark' 
                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }
                      transform hover:scale-105 transition-all duration-300
                      animate-fade-in`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {feature}
                  </div>
                ))}
              </div>

              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              } max-w-2xl mx-auto typewriter-text`}>
                Search through millions of GitHub profiles with advanced filtering
              </p>

              <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto mb-12">
                {stats.map((stat, index) => (
                  <div
                    key={stat.name}
                    className={`p-4 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-900/50 hover:bg-gray-800/50' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    } transform hover:scale-105 transition-all duration-300
                    animate-fade-in`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className={`text-2xl font-bold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="relative group inline-block">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                  <button
                    onClick={login}
                    className={`relative px-8 py-3 rounded-lg font-medium text-base ${
                      theme === 'dark'
                        ? 'bg-black text-white hover:bg-gray-900'
                        : 'bg-white text-black hover:bg-gray-100'
                    } transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2`}
                  >
                    Sign in with GitHub
                    <Github className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Show only search interface for authenticated users
            <>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                    <Github 
                      className={`w-12 h-12 relative ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      } transform group-hover:scale-110 transition-transform duration-300`} 
                    />
                  </div>
                  <motion.h1
                    className={`text-4xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    } tracking-tight relative`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    DevFinder
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  </motion.h1>
                </div>
              </div>
              
              <div className="w-full max-w-3xl">
                <SearchBar
                  keyword={keyword}
                  location={location}
                  setKeyword={setKeyword}
                  setLocation={setLocation}
                  onSearch={() => searchUsers(keyword, 1)}
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
                  sortBy={sortBy}
                  onPageChange={handlePageChange}
                  onSortChange={handleSortChange}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <footer
        className={`py-6 ${theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} border-t mt-auto`}
      >
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <p
            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center gap-2`}
          >
            Built with{' '}
            <a
              href="https://cursor.sh"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-${theme === 'dark' ? 'white' : 'black'} transition-colors`}
            >
              Cursor
            </a>{' '}
            &{' '}
            <Heart className="w-4 h-4 text-red-500 inline-block animate-pulse fill-current" aria-label="love" />{' '}
            by{' '}
            <a
              href="https://sourcingdenis.live"
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
