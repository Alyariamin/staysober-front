import React, { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Home, BookOpen, Lightbulb, Shield, Users, User, X, Calendar, Heart,Brain, LogOut } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Journal', path: '/journal', icon: BookOpen },
    { name: 'Goals', path: '/goals', icon: Lightbulb },
    { name: 'Habits', path: '/habits', icon: Calendar },
    { name: 'Cravings', path: '/cravings', icon: Brain },
    { name: 'Resources', path: '/resources', icon: Shield },
    // { name: 'Community', path: '
    // ommunity', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTitle = () => {
    const item = navItems.find(item => item.path === location.pathname);
    return item ? item.name : 'Recovery Journey';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors lg:hidden"
              aria-label="Toggle navigation"
            >
              <Menu className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-white">{getTitle()}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="hidden md:block text-sm text-slate-600 dark:text-slate-300">
              Welcome, {user?.first_name}
            </span>
            <button onClick={handleLogout} className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors" title="Logout">
              <LogOut className="h-5 w-5" />
            </button>
            <ThemeSelector />
          </div>
        </div>
      </header>

      <div className="flex container mx-auto">
        {/* Sidebar - Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <motion.aside 
          className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 shadow-lg z-50 lg:static lg:h-auto lg:shadow-none lg:z-0 lg:translate-x-0 lg:block ${isSidebarOpen ? '' : 'hidden'}`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-700 lg:hidden">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Recovery Path
            </h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      location.pathname === item.path 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;