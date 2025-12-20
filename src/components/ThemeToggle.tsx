import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-dark-700 dark:hover:bg-dark-600 transition-colors duration-200"
      aria-label={theme === 'light' ? '切换到暗黑模式' : '切换到明亮模式'}
      title={theme === 'light' ? '切换到暗黑模式' : '切换到明亮模式'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      ) : (
        <Sun className="w-5 h-5 text-purple-400" />
      )}
    </button>
  );
} 