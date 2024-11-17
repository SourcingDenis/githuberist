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
  clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI,
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
            throw new Error('Failed to authenticate with GitHub');
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
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!clientId) {
      setError('GitHub Client ID not configured');
      return;
    }

    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'read:user';
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('github_access_token');
  };

  const handleGithubSignIn = async () => {
    try {
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${
        githubOAuthConfig.clientId
      }&redirect_uri=${encodeURIComponent(githubOAuthConfig.redirectUri)}`;
      
      window.location.href = authUrl;
    } catch (error) {
      console.error('GitHub authentication error:', error);
      // Handle error appropriately
    }
  };

  const handleOAuthCallback = async (code: string) => {
    try {
      // Exchange code for access token
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: githubOAuthConfig.clientId,
          client_secret: githubOAuthConfig.clientSecret,
          code,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error_description || 'Authentication failed');
      }

      // Store the access token securely
      const { access_token } = data;
      // ... handle successful authentication
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      // Handle error appropriately
    }
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