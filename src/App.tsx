import { useState } from 'react';
import SearchBar from './components/SearchBar';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const { theme } = useTheme();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <main className="container mx-auto px-4 py-8">
        <SearchBar
          keyword={keyword}
          location={location}
          language={language}
          setKeyword={setKeyword}
          setLocation={setLocation}
          setLanguage={setLanguage}
        />
      </main>
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
