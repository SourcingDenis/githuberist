import * as React from "react"
import { ChevronDown } from "lucide-react"
import { useTheme } from "../../contexts/ThemeContext"
import { SortOption } from "../../types/github"

interface SelectContextType {
  value: SortOption
  onValueChange: (value: SortOption) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  theme: 'light' | 'dark'
}

interface SelectProps {
  value: SortOption
  onValueChange: (value: SortOption) => void
  children: React.ReactNode
}

interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

interface SelectContentProps {
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

// Create context with proper type
const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false);
  const { theme } = useTheme();

  // Provide context value
  const contextValue = React.useMemo(() => ({
    value,
    onValueChange,
    open,
    setOpen,
    theme,
  }), [value, onValueChange, open, theme]);

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

// Custom hook for using select context
const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select provider');
  }
  return context;
};

const SelectTrigger = ({ className = "", children }: SelectTriggerProps) => {
  const { open, setOpen, theme } = useSelectContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      } ${className}`}
    >
      {children}
      <ChevronDown className={`w-4 h-4 transition-transform ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      } ${open ? 'transform rotate-180' : ''}`} />
    </button>
  );
};

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { value, theme } = useSelectContext();
  return (
    <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
      {value || placeholder}
    </span>
  );
};

const SelectContent = ({ children }: SelectContentProps) => {
  const { open, theme } = useSelectContext();

  if (!open) return null;

  return (
    <div className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg ${
      theme === 'dark'
        ? 'bg-gray-900 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <div className="py-1">{children}</div>
    </div>
  );
};

const SelectItem = ({ value: itemValue, children }: SelectItemProps) => {
  const { value, onValueChange, setOpen, theme } = useSelectContext();

  const handleClick = () => {
    onValueChange(itemValue as SortOption);
    setOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={`px-3 py-2 text-sm cursor-pointer ${
        theme === 'dark'
          ? `${value === itemValue ? 'bg-gray-800' : ''} text-gray-200 hover:bg-gray-800`
          : `${value === itemValue ? 'bg-gray-50' : ''} text-gray-700 hover:bg-gray-50`
      }`}
    >
      {children}
    </div>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }; 