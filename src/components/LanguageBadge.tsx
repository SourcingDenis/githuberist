import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Code, 
  FileJson, 
  Braces, 
  Hash, 
  FileType, 
  Cpu, 
  Cog, 
  Puzzle,
  Box,
  Terminal
} from 'lucide-react';
import { Badge } from './ui/badge';

interface LanguageBadgeProps {
  language: string;
}

const LanguageBadge: React.FC<LanguageBadgeProps> = ({ language }) => {
  const { theme } = useTheme();

  const getLanguageConfig = (lang: string): { icon: JSX.Element; color: string; bgColor: string } => {
    const iconProps = {
      className: "w-3.5 h-3.5",
      strokeWidth: 2,
    };

    switch (lang.toLowerCase()) {
      case 'javascript':
        return {
          icon: <Box {...iconProps} />,
          color: theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600',
          bgColor: theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50'
        };
      case 'typescript':
        return {
          icon: <Box {...iconProps} />,
          color: theme === 'dark' ? 'text-blue-300' : 'text-blue-600',
          bgColor: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
        };
      case 'python':
        return {
          icon: <FileType {...iconProps} />,
          color: theme === 'dark' ? 'text-green-300' : 'text-green-600',
          bgColor: theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'
        };
      case 'java':
        return {
          icon: <Cpu {...iconProps} />,
          color: theme === 'dark' ? 'text-orange-300' : 'text-orange-600',
          bgColor: theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'
        };
      case 'kotlin':
        return {
          icon: <Cpu {...iconProps} />,
          color: theme === 'dark' ? 'text-purple-300' : 'text-purple-600',
          bgColor: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
        };
      case 'c#':
      case 'csharp':
        return {
          icon: <Hash {...iconProps} />,
          color: theme === 'dark' ? 'text-purple-300' : 'text-purple-600',
          bgColor: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
        };
      case 'c':
        return {
          icon: <Code {...iconProps} />,
          color: theme === 'dark' ? 'text-blue-300' : 'text-blue-600',
          bgColor: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
        };
      case 'php':
        return {
          icon: <Braces {...iconProps} />,
          color: theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600',
          bgColor: theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'
        };
      case 'ruby':
        return {
          icon: <Terminal {...iconProps} />,
          color: theme === 'dark' ? 'text-red-300' : 'text-red-600',
          bgColor: theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'
        };
      case 'go':
      case 'golang':
        return {
          icon: <Box {...iconProps} />,
          color: theme === 'dark' ? 'text-sky-300' : 'text-sky-600',
          bgColor: theme === 'dark' ? 'bg-sky-500/10' : 'bg-sky-50'
        };
      case 'rust':
        return {
          icon: <Cog {...iconProps} />,
          color: theme === 'dark' ? 'text-orange-300' : 'text-orange-700',
          bgColor: theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'
        };
      case 'c++':
      case 'cpp':
        return {
          icon: <Puzzle {...iconProps} />,
          color: theme === 'dark' ? 'text-pink-300' : 'text-pink-600',
          bgColor: theme === 'dark' ? 'bg-pink-500/10' : 'bg-pink-50'
        };
      case 'html':
        return {
          icon: <Code {...iconProps} />,
          color: theme === 'dark' ? 'text-orange-300' : 'text-orange-600',
          bgColor: theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'
        };
      case 'css':
        return {
          icon: <Code {...iconProps} />,
          color: theme === 'dark' ? 'text-blue-300' : 'text-blue-600',
          bgColor: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
        };
      case 'shell':
        return {
          icon: <Terminal {...iconProps} />,
          color: theme === 'dark' ? 'text-green-300' : 'text-green-600',
          bgColor: theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'
        };
      case 'json':
        return {
          icon: <FileJson {...iconProps} />,
          color: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
          bgColor: theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-100'
        };
      default:
        return {
          icon: <Code {...iconProps} />,
          color: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
          bgColor: theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-100'
        };
    }
  };

  const config = getLanguageConfig(language);

  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1.5 px-2 py-1 border transition-colors duration-200
        ${config.bgColor} ${config.color}
        ${theme === 'dark' 
          ? 'border-gray-700 hover:border-gray-600' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      {React.cloneElement(config.icon, { className: `${config.icon.props.className} ${config.color}` })}
      <span className="text-xs font-medium">{language}</span>
    </Badge>
  );
};

export default LanguageBadge; 