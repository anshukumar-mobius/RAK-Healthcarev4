import React from 'react';
import { Bell, Moon, Sun, Globe, User, LogOut, Shield, Phone, Calendar, Search, Menu } from 'lucide-react';
import { useApp, Role } from '../../contexts/AppContext';
import { useAuthStore } from '../../stores/authStore';
import { t } from '../../utils/translations';

const roleOptions: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'diagnostician', label: 'Diagnostician' }
];

export function Header() {
  const { role, setRole, language, setLanguage, theme, setTheme, isRTL } = useApp();
  const { user, logout } = useAuthStore();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      {/* Top Bar */}
      <div className="bg-rak-magenta-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center space-x-1 rtl:space-x-reverse hover:bg-rak-magenta-700 px-2 py-1 rounded transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1 hover:bg-rak-magenta-700 rounded transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header - Compact */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-rak-magenta-600 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-rak-magenta-600 dark:text-white">
                  RAK Hospital
                </h1>
                <p className="text-xs text-rak-beige-600 dark:text-gray-400">
                  Management System
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse flex-1 justify-center">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
              <input
                type="text"
                placeholder={t('search', language)}
                className={`${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-rak-beige-300 dark:border-gray-600 rounded-lg bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent w-80`}
              />
            </div>

            {/* Primary CTAs */}
           
          </div>

          {/* User Menu & Mobile Controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Role Selector */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="bg-rak-white dark:bg-gray-800 border border-rak-beige-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rak-magenta-500"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.value, language)}
                </option>
              ))}
            </select>

            {/* Notifications */}
            <button className="relative p-1.5 text-gray-500 hover:text-rak-magenta-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-rak-pink-100 dark:hover:bg-gray-800 rounded-md transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-rak-error-500 text-rak-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="text-right rtl:text-left hidden md:block">
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-xs text-rak-secondary-600 dark:text-gray-400 capitalize">{t(role, language)}</p>
              </div>
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-rak-pink-200"
                  />
                )}
                <button
                  onClick={logout}
                  className="p-1.5 text-gray-500 hover:text-rak-error-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-rak-pink-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-rak-magenta-600 hover:bg-rak-pink-100 rounded-md transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-rak-white dark:bg-gray-900 border-t border-rak-beige-200 dark:border-gray-700 px-4 py-3">
          <div className="space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <Search className={`absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
              <input
                type="text"
                placeholder={t('search', language)}
                className={`${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-rak-beige-300 dark:border-gray-600 rounded-lg bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent w-full`}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}