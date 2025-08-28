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
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-rak-magenta-600 to-rak-magenta-700 rounded-3xl flex items-center justify-center shadow-xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-rak-magenta-600 dark:text-white mb-2">
            RAK Hospital
          </h2>
          <p className="text-lg font-medium text-rak-beige-600 dark:text-gray-400 mb-1">
            Management System
          </p>
          <p className="text-sm text-rak-beige-500 dark:text-gray-500">
            Government of Ras Al Khaimah • وزارة الصحة
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-rak-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-rak-beige-100 dark:border-gray-700">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Healthcare Professional Login
            </h3>
            <p className="text-sm text-rak-beige-600 dark:text-gray-400 text-center mt-1">
              Access your medical dashboard
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-rak-beige-300 dark:border-gray-600 rounded-lg bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors"
                placeholder="Enter your government email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-rak-beige-300 dark:border-gray-600 rounded-lg bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rak-error-50 dark:bg-rak-error-900/20 border border-rak-error-200 dark:border-rak-error-800 rounded-lg p-3">
                <p className="text-sm text-rak-error-600 dark:text-rak-error-400 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 hover:from-rak-magenta-700 hover:to-rak-magenta-800 disabled:from-rak-magenta-400 disabled:to-rak-magenta-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Users */}
          <div className="mt-8 pt-6 border-t border-rak-beige-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
              Demo Users (Password: password123)
            </p>
            <div className="space-y-2">
              {demoUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setEmail(user.email);
                    setPassword('password123');
                  }}
                  className="w-full text-left px-4 py-3 text-sm bg-rak-pink-50 dark:bg-gray-700 hover:bg-rak-pink-100 dark:hover:bg-gray-600 rounded-lg transition-colors border border-rak-pink-100 dark:border-gray-600"
                >
                  <div className="font-semibold text-rak-magenta-700 dark:text-white">{user.role}</div>
                  <div className="text-rak-beige-600 dark:text-gray-400 text-xs">{user.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-rak-beige-500 dark:text-gray-400 space-y-1">
          <p>© 2024 Government of Ras Al Khaimah</p>
          <p>Ministry of Health & Prevention Approved</p>
          <p className="text-xs">All rights reserved • جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}