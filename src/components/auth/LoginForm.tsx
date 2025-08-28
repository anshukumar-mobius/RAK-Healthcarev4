import React, { useState } from 'react';
import { Shield, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

export function LoginForm() {
  const { language } = useApp();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err) {
      setError('Login failed. Please check your connection and try again.');
    }
  };

  const demoUsers = [
    { email: 'ahmed.rashid@rak.gov.ae', role: 'Doctor' },
    { email: 'fatima.zahra@rak.gov.ae', role: 'Nurse' },
    { email: 'sarah.johnson@rak.gov.ae', role: 'Diagnostician' },
    { email: 'mohammed.mansoori@rak.gov.ae', role: 'Admin' },
    { email: 'aisha.qasimi@rak.gov.ae', role: 'Receptionist' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rak-pink-50 via-rak-white to-rak-beige-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-rak-magenta-600 to-rak-magenta-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-rak-magenta-600 dark:text-white mb-1">
            RAK Hospital
          </h2>
          <p className="text-sm text-rak-beige-600 dark:text-gray-400">
            Management System
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-rak-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-rak-beige-100 dark:border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              Professional Login
            </h3>
            <p className="text-xs text-rak-beige-600 dark:text-gray-400 text-center mt-1">
              Access your medical dashboard
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-rak-beige-300 dark:border-gray-600 rounded-lg bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-rak-beige-300 dark:border-gray-600 rounded-lg bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors text-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rak-error-50 dark:bg-rak-error-900/20 border border-rak-error-200 dark:border-rak-error-800 rounded-lg p-2">
                <p className="text-xs text-rak-error-600 dark:text-rak-error-400 flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 hover:from-rak-magenta-700 hover:to-rak-magenta-800 disabled:from-rak-magenta-400 disabled:to-rak-magenta-500 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Users - Compact */}
          <div className="mt-4 pt-4 border-t border-rak-beige-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
              Demo: password123
            </p>
            <div className="grid grid-cols-2 gap-1">
              {demoUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setEmail(user.email);
                    setPassword('password123');
                  }}
                  className={`text-left px-2 py-1.5 text-xs bg-rak-pink-50 dark:bg-gray-700 hover:bg-rak-pink-100 dark:hover:bg-gray-600 rounded transition-colors border border-rak-pink-100 dark:border-gray-600 ${
                    index === 4 ? 'col-span-2' : ''
                  }`}
                >
                  <div className="font-medium text-rak-magenta-700 dark:text-white truncate">{user.role}</div>
                  <div className="text-rak-beige-600 dark:text-gray-400 truncate text-xs">{user.email.split('@')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-rak-beige-500 dark:text-gray-400 mt-4">
          <p>© 2024 Government of Ras Al Khaimah</p>
        </div>
      </div>
    </div>
  );
}