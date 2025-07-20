import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        aria-label="Change theme"
      >
        <Palette className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-12 z-50 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4"
            >
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Choose Theme
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      setTheme(themeOption.id);
                      setIsOpen(false);
                    }}
                    className={`relative p-3 rounded-lg border-2 transition-all ${
                      theme === themeOption.id
                        ? 'border-blue-500 dark:border-blue-400'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: themeOption.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: themeOption.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: themeOption.colors.accent }}
                      />
                    </div>
                    
                    <div className="text-left">
                      <h4 className="font-medium text-slate-800 dark:text-white">
                        {themeOption.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {themeOption.description}
                      </p>
                    </div>
                    
                    {theme === themeOption.id && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;