import React, { useState, useEffect } from 'react';
import { Github, Heart } from 'lucide-react';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';
import { GitHubUser, SortOption } from './types/github';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Octokit } from '@octokit/rest';
import { AuthProvider, useAuth } from './contexts/AuthContext';

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
        per_page: 10,
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
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Github className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
              <h1
                className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} tracking-tight`}
              >
                DevFinder
              </h1>
            </div>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover talented developers worldwide
            </p>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Search through millions of GitHub profiles with advanced filtering
            </p>
          </div>

          <div className="w-full max-w-3xl">
            {isAuthenticated ? (
              <SearchBar
                keyword={keyword}
                location={location}
                setKeyword={setKeyword}
                setLocation={setLocation}
                onSearch={() => searchUsers(keyword, 1)}
              />
            ) : (
              <div className="mt-6 text-center">
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
                <p className={`text-sm mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sign in with GitHub to start searching for users
                </p>
              </div>
            )}
          </div>

          {isAuthenticated && (
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
          )}
        </div>
      </div>

      <footer
        className={`py-6 ${theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} border-t`}
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
