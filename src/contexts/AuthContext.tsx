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

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('github_access_token');
  });
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!accessToken;

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
            const errorMessage = await response.text();
            throw new Error(`Failed to authenticate with GitHub: ${errorMessage}`);
          }

          const data = await response.json();
          if (data.access_token) {
            setAccessToken(data.access_token);
            localStorage.setItem('github_access_token', data.access_token);
            window.history.replaceState({}, document.title, window.location.pathname);
          } else if (data.error) {
            setError(data.error_description || 'Authentication failed');
          }
        } catch (error) {
          console.error('Authentication error:', error);
          setError(error instanceof Error ? error.message : 'Authentication failed');
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
