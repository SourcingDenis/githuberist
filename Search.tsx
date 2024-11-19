import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import UserList from './UserList';
import { GitHubUser, SortOption } from '../types/github';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('');

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchUsers(debouncedSearchTerm, currentPage, sortBy);
    } else {
      setUsers([]);
      setTotalCount(0);
    }
  }, [debouncedSearchTerm, currentPage, sortBy]);

  const searchUsers = async (query: string, page: number, sort: SortOption) => {
    setLoading(true);
    setError(null);

    try {
      // Base query
      let endpoint = `https://api.github.com/search/users?q=${query}&page=${page}&per_page=10`;
      
      // Add sort parameters
      if (sort === 'followers' || sort === 'repositories') {
        endpoint += `&sort=${sort}&order=desc`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      let users = await Promise.all(
        data.items.map(async (user: any) => {
          // Fetch detailed user info
          const userResponse = await fetch(`https://api.github.com/users/${user.login}`, {
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            }
          });
          const userData = await userResponse.json();

          // If sorting by stars, fetch repositories
          if (sort === 'stars') {
            const reposResponse = await fetch(
              `https://api.github.com/users/${user.login}/repos?per_page=100&type=owner`,
              {
                headers: {
                  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                }
              }
            );
            const repos = await reposResponse.json();
            const totalStars = repos.reduce((acc: number, repo: any) => 
              acc + (repo.fork ? 0 : repo.stargazers_count), 0
            );
            return { ...userData, total_stars: totalStars };
          }

          return userData;
        })
      );

      // Sort by stars if needed
      if (sort === 'stars') {
        users.sort((a, b) => (b.total_stars || 0) - (a.total_stars || 0));
      }

      setUsers(users);
      setTotalCount(Math.min(data.total_count, 1000)); // GitHub API limits to 1000 results
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search for users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full"
      />

      <UserList
        users={users}
        totalCount={totalCount}
        currentPage={currentPage}
        loading={loading}
        error={error}
        searchKeyword={searchTerm}
        sortBy={sortBy}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default Search; 