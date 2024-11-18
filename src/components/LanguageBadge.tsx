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

  const getLanguageConfig = (lang: string): { icon: JSX.Element; color: string; bgColor: string } => {
    const iconProps = {
      className: "w-3.5 h-3.5",
      strokeWidth: 2,
    };

    const normalizedLang = lang.toLowerCase().trim();

    // Comprehensive language configuration map
    const languageConfigs: Record<string, { icon: JSX.Element; lightColor: string; darkColor: string; }> = {
      javascript: { 
        icon: <Box {...iconProps} />, 
        lightColor: 'yellow-600',
        darkColor: 'yellow-300'
      },
      typescript: { 
        icon: <Box {...iconProps} />, 
        lightColor: 'blue-600',
        darkColor: 'blue-300'
      },
      python: { 
        icon: <FileType {...iconProps} />, 
        lightColor: 'green-600',
        darkColor: 'green-300'
      },
      java: { 
        icon: <Coffee {...iconProps} />, 
        lightColor: 'orange-600',
        darkColor: 'orange-300'
      },
      kotlin: { 
        icon: <Cpu {...iconProps} />, 
        lightColor: 'purple-600',
        darkColor: 'purple-300'
      },
      'c#': { 
        icon: <Hash {...iconProps} />, 
        lightColor: 'violet-600',
        darkColor: 'violet-300'
      },
      csharp: { 
        icon: <Hash {...iconProps} />, 
        lightColor: 'violet-600',
        darkColor: 'violet-300'
      },
      c: { 
        icon: <Code {...iconProps} />, 
        lightColor: 'cyan-600',
        darkColor: 'cyan-300'
      },
      'c++': { 
        icon: <Puzzle {...iconProps} />, 
        lightColor: 'pink-600',
        darkColor: 'pink-300'
      },
      cpp: { 
        icon: <Puzzle {...iconProps} />, 
        lightColor: 'pink-600',
        darkColor: 'pink-300'
      },
      php: { 
        icon: <Braces {...iconProps} />, 
        lightColor: 'indigo-600',
        darkColor: 'indigo-300'
      },
      ruby: { 
        icon: <Terminal {...iconProps} />, 
        lightColor: 'red-600',
        darkColor: 'red-300'
      },
      go: { 
        icon: <Box {...iconProps} />, 
        lightColor: 'sky-600',
        darkColor: 'sky-300'
      },
      golang: { 
        icon: <Box {...iconProps} />, 
        lightColor: 'sky-600',
        darkColor: 'sky-300'
      },
      rust: { 
        icon: <Cog {...iconProps} />, 
        lightColor: 'amber-600',
        darkColor: 'amber-300'
      },
      html: { 
        icon: <Code {...iconProps} />, 
        lightColor: 'rose-600',
        darkColor: 'rose-300'
      },
      css: { 
        icon: <Layers {...iconProps} />, 
        lightColor: 'fuchsia-600',
        darkColor: 'fuchsia-300'
      },
      shell: { 
        icon: <Terminal {...iconProps} />, 
        lightColor: 'lime-600',
        darkColor: 'lime-300'
      },
      bash: { 
        icon: <Terminal {...iconProps} />, 
        lightColor: 'emerald-600',
        darkColor: 'emerald-300'
      },
      powershell: { 
        icon: <Terminal {...iconProps} />, 
        lightColor: 'blue-600',
        darkColor: 'blue-300'
      },
      jupyter: { 
        icon: <BookOpen {...iconProps} />, 
        lightColor: 'orange-600',
        darkColor: 'orange-300'
      },
      'jupyter notebook': { 
        icon: <BookOpen {...iconProps} />, 
        lightColor: 'orange-600',
        darkColor: 'orange-300'
      },
      sql: { 
        icon: <Database {...iconProps} />, 
        lightColor: 'blue-600',
        darkColor: 'blue-300'
      },
      swift: { 
        icon: <FileCode {...iconProps} />, 
        lightColor: 'orange-600',
        darkColor: 'orange-300'
      },
      scala: { 
        icon: <Settings {...iconProps} />, 
        lightColor: 'red-600',
        darkColor: 'red-300'
      },
      haskell: { 
        icon: <Workflow {...iconProps} />, 
        lightColor: 'purple-600',
        darkColor: 'purple-300'
      },
      r: { 
        icon: <FileType {...iconProps} />, 
        lightColor: 'blue-600',
        darkColor: 'blue-300'
      },
      dart: { 
        icon: <Box {...iconProps} />, 
        lightColor: 'cyan-600',
        darkColor: 'cyan-300'
      },
      perl: { 
        icon: <FileCode {...iconProps} />, 
        lightColor: 'indigo-600',
        darkColor: 'indigo-300'
      },
      json: { 
        icon: <FileJson {...iconProps} />, 
        lightColor: 'slate-600',
        darkColor: 'slate-300'
      },
    };

    const config = languageConfigs[normalizedLang] || {
      icon: <Code {...iconProps} />,
      lightColor: 'gray-600',
      darkColor: 'gray-300'
    };

    return {
      icon: config.icon,
      color: theme === 'dark' ? `text-${config.darkColor}` : `text-${config.lightColor}`,
      bgColor: theme === 'dark' 
        ? `bg-${config.darkColor}/20`
        : `bg-${config.lightColor}/15`
    };
  };

  const config = getLanguageConfig(language);

  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1.5 px-2 py-1 border transition-colors duration-200
        ${config.bgColor} ${config.color}
        ${theme === 'dark' 
          ? 'border-gray-800 hover:border-gray-700'
          : 'border-gray-200 hover:border-gray-300'
        }
        hover:scale-105
      `}
    >
      {React.cloneElement(config.icon, { 
        className: `${config.icon.props.className} ${config.color}`,
        strokeWidth: 2.5
      })}
      <span className="text-xs font-semibold">{language}</span>
    </Badge>
  );
};

export default LanguageBadge; 