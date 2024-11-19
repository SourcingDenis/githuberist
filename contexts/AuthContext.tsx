import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: any | null;
  login: () => void;
  logout: () => void;
  error: string | null;
}

const githubOAuthConfig = {
  clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/callback`,
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('github_access_token'));
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!accessToken;

  // Fetch user data on load if accessToken exists
  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        try {
          const response = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('github_access_token');
          setAccessToken(null); // Clear invalid token
        }
      }
    };

    fetchUserData();
  }, [accessToken]);

  // Handle GitHub OAuth callback
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
            setAccessToken(data.access_token);

            // Remove code from the URL and redirect to home
            window.history.replaceState({}, document.title, '/');
          } else {
            console.error('Authentication failed: No access token returned');
            setError('Authentication failed');
          }
        } catch (error) {
          console.error('Authentication error:', error);
          setError('Authentication error occurred');
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
    setUser(null);
    localStorage.removeItem('github_access_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, user, login, logout, error }}>
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
