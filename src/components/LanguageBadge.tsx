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
  Terminal,
  BookOpen,
  Coffee,
  Database,
  FileCode,
  Settings,
  Layers,
  Workflow
} from 'lucide-react';
import { Badge } from './ui/badge';

interface LanguageBadgeProps {
  language: string;
}

const LanguageBadge: React.FC<LanguageBadgeProps> = ({ language }) => {
  const { theme } = useTheme();

  const getLanguageConfig = (lang: string): { icon: JSX.Element; bgColor: string } => {
    const iconProps = {
      className: "w-3.5 h-3.5",
      strokeWidth: 2,
    };

    const normalizedLang = lang.toLowerCase().trim();

    // Simplified language configuration map - removed color properties since we'll use black/white
    const languageConfigs: Record<string, { icon: JSX.Element; bgOpacity: string }> = {
      javascript: { 
        icon: <Box {...iconProps} />, 
        bgOpacity: '20'
      },
      typescript: { 
        icon: <Box {...iconProps} />, 
        bgOpacity: '20'
      },
      python: { 
        icon: <FileType {...iconProps} />, 
        bgOpacity: '20'
      },
      java: { 
        icon: <Coffee {...iconProps} />, 
        bgOpacity: '20'
      },
      kotlin: { 
        icon: <Cpu {...iconProps} />, 
        bgOpacity: '20'
      },
      'c#': { 
        icon: <Hash {...iconProps} />, 
        bgOpacity: '20'
      },
      csharp: { 
        icon: <Hash {...iconProps} />, 
        bgOpacity: '20'
      },
      c: { 
        icon: <Code {...iconProps} />, 
        bgOpacity: '20'
      },
      'c++': { 
        icon: <Puzzle {...iconProps} />, 
        bgOpacity: '20'
      },
      cpp: { 
        icon: <Puzzle {...iconProps} />, 
        bgOpacity: '20'
      },
      php: { 
        icon: <Braces {...iconProps} />, 
        bgOpacity: '20'
      },
      ruby: { 
        icon: <Terminal {...iconProps} />, 
        bgOpacity: '20'
      },
      go: { 
        icon: <Box {...iconProps} />, 
        bgOpacity: '20'
      },
      golang: { 
        icon: <Box {...iconProps} />, 
        bgOpacity: '20'
      },
      rust: { 
        icon: <Cog {...iconProps} />, 
        bgOpacity: '20'
      },
      html: { 
        icon: <Code {...iconProps} />, 
        bgOpacity: '20'
      },
      css: { 
        icon: <Layers {...iconProps} />, 
        bgOpacity: '20'
      },
      shell: { 
        icon: <Terminal {...iconProps} />, 
        bgOpacity: '20'
      },
      bash: { 
        icon: <Terminal {...iconProps} />, 
        bgOpacity: '20'
      },
      powershell: { 
        icon: <Terminal {...iconProps} />, 
        bgOpacity: '20'
      },
      jupyter: { 
        icon: <BookOpen {...iconProps} />, 
        bgOpacity: '20'
      },
      'jupyter notebook': { 
        icon: <BookOpen {...iconProps} />, 
        bgOpacity: '20'
      },
      sql: { 
        icon: <Database {...iconProps} />, 
        bgOpacity: '20'
      },
      swift: { 
        icon: <FileCode {...iconProps} />, 
        bgOpacity: '20'
      },
      scala: { 
        icon: <Settings {...iconProps} />, 
        bgOpacity: '20'
      },
      haskell: { 
        icon: <Workflow {...iconProps} />, 
        bgOpacity: '20'
      },
      r: { 
        icon: <FileType {...iconProps} />, 
        bgOpacity: '20'
      },
      dart: { 
        icon: <Box {...iconProps} />, 
        bgOpacity: '20'
      },
      perl: { 
        icon: <FileCode {...iconProps} />, 
        bgOpacity: '20'
      },
      json: { 
        icon: <FileJson {...iconProps} />, 
        bgOpacity: '20'
      },
    };

    const config = languageConfigs[normalizedLang] || {
      icon: <Code {...iconProps} />,
      bgOpacity: '20'
    };

    return {
      icon: config.icon,
      bgColor: theme === 'dark' 
        ? `bg-white/10`
        : `bg-black/5`
    };
  };

  const config = getLanguageConfig(language);

  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1.5 px-2 py-1 border transition-colors duration-200
        ${config.bgColor}
        ${theme === 'dark' 
          ? 'text-white border-gray-800 hover:border-gray-700'
          : 'text-black border-gray-200 hover:border-gray-300'
        }
        hover:scale-105
      `}
    >
      {React.cloneElement(config.icon, { 
        className: `${config.icon.props.className} ${theme === 'dark' ? 'text-white' : 'text-black'}`,
        strokeWidth: 2.5
      })}
      <span className="text-xs font-semibold">{language}</span>
    </Badge>
  );
};

export default LanguageBadge; 