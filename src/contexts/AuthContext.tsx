import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: () => void;
  logout: () => void;
  error: string | null;
}

const githubOAuthConfig = {
  clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/callback`,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('github_access_token');
    if (token) {
      fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((userData) => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('github_access_token'); // Clear invalid token
        });
    }
  }, []);

  const login = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'read:user';

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scope}`;
  };

  const logout = () => {
    localStorage.removeItem('github_access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
useEffect(() => {
  const handleCallback = async () => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      try {
        const response = await fetch('/.netlify/functions/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to authenticate with GitHub');
        }

        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('github_access_token', data.access_token);

          // Remove the code from the URL and redirect to home
          window.history.replaceState({}, document.title, '/');
          window.location.href = '/'; // Fallback
        } else {
          console.error('Authentication failed: No access token returned');
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    }
  };

  handleCallback();
}, []);

  const login = () => {
    const clientId = githubOAuthConfig.clientId;
    if (!clientId) {
      setError('GitHub Client ID not configured');
      return;
    }

    const scope = 'read:user';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      githubOAuthConfig.redirectUri
    )}&scope=${scope}`;
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('github_access_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
