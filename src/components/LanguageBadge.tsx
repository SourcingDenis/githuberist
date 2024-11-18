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
          color: theme === 'dark' ? 'text-yellow-200' : 'text-yellow-700',
          bgColor: theme === 'dark' ? 'bg-yellow-400/20' : 'bg-yellow-100'
        };
      case 'typescript':
        return {
          icon: <Box {...iconProps} />,
          color: theme === 'dark' ? 'text-blue-200' : 'text-blue-700',
          bgColor: theme === 'dark' ? 'bg-blue-400/20' : 'bg-blue-100'
        };
      case 'python':
        return {
          icon: <FileType {...iconProps} />,
          color: theme === 'dark' ? 'text-green-200' : 'text-green-700',
          bgColor: theme === 'dark' ? 'bg-green-400/20' : 'bg-green-100'
        };
      case 'java':
        return {
          icon: <Cpu {...iconProps} />,
          color: theme === 'dark' ? 'text-orange-200' : 'text-orange-700',
          bgColor: theme === 'dark' ? 'bg-orange-400/20' : 'bg-orange-100'
        };
      case 'kotlin':
        return {
          icon: <Cpu {...iconProps} />,
          color: theme === 'dark' ? 'text-purple-200' : 'text-purple-700',
          bgColor: theme === 'dark' ? 'bg-purple-400/20' : 'bg-purple-100'
        };
      case 'c#':
      case 'csharp':
        return {
          icon: <Hash {...iconProps} />,
          color: theme === 'dark' ? 'text-violet-200' : 'text-violet-700',
          bgColor: theme === 'dark' ? 'bg-violet-400/20' : 'bg-violet-100'
        };
      case 'c':
        return {
          icon: <Code {...iconProps} />,
          color: theme === 'dark' ? 'text-cyan-200' : 'text-cyan-700',
          bgColor: theme === 'dark' ? 'bg-cyan-400/20' : 'bg-cyan-100'
        };
      case 'php':
        return {
          icon: <Braces {...iconProps} />,
          color: theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700',
          bgColor: theme === 'dark' ? 'bg-indigo-400/20' : 'bg-indigo-100'
        };
      case 'ruby':
        return {
          icon: <Terminal {...iconProps} />,
          color: theme === 'dark' ? 'text-red-200' : 'text-red-700',
          bgColor: theme === 'dark' ? 'bg-red-400/20' : 'bg-red-100'
        };
      case 'go':
      case 'golang':
        return {
          icon: <Box {...iconProps} />,
          color: theme === 'dark' ? 'text-sky-200' : 'text-sky-700',
          bgColor: theme === 'dark' ? 'bg-sky-400/20' : 'bg-sky-100'
        };
      case 'rust':
        return {
          icon: <Cog {...iconProps} />,
          color: theme === 'dark' ? 'text-amber-200' : 'text-amber-700',
          bgColor: theme === 'dark' ? 'bg-amber-400/20' : 'bg-amber-100'
        };
      case 'c++':
      case 'cpp':
        return {
          icon: <Puzzle {...iconProps} />,
          color: theme === 'dark' ? 'text-pink-200' : 'text-pink-700',
          bgColor: theme === 'dark' ? 'bg-pink-400/20' : 'bg-pink-100'
        };
      case 'html':
        return {
          icon: <Code {...iconProps} />,
          color: theme === 'dark' ? 'text-rose-200' : 'text-rose-700',
          bgColor: theme === 'dark' ? 'bg-rose-400/20' : 'bg-rose-100'
        };
      case 'css':
        return {
          icon: <Code {...iconProps} />,
          color: theme === 'dark' ? 'text-fuchsia-200' : 'text-fuchsia-700',
          bgColor: theme === 'dark' ? 'bg-fuchsia-400/20' : 'bg-fuchsia-100'
        };
      case 'shell':
        return {
          icon: <Terminal {...iconProps} />,
          color: theme === 'dark' ? 'text-lime-200' : 'text-lime-700',
          bgColor: theme === 'dark' ? 'bg-lime-400/20' : 'bg-lime-100'
        };
      case 'json':
        return {
          icon: <FileJson {...iconProps} />,
          color: theme === 'dark' ? 'text-slate-200' : 'text-slate-700',
          bgColor: theme === 'dark' ? 'bg-slate-400/20' : 'bg-slate-100'
        };
      default:
        return {
          icon: <Code {...iconProps} />,
          color: theme === 'dark' ? 'text-gray-200' : 'text-gray-700',
          bgColor: theme === 'dark' ? 'bg-gray-400/20' : 'bg-gray-100'
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