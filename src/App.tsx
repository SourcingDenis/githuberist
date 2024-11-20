import { useState, useEffect } from 'react';
import { Github, Heart } from 'lucide-react';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';
import { GitHubUser, SortOption } from './types/github';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Octokit } from '@octokit/rest';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { motion } from 'framer-motion';

type LanguageCount = { [key: string]: number };
