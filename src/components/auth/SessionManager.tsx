import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SESSION_CONFIG } from '../../types/auth';

export function SessionManager() {
  const { sessionExpiry, refreshSession, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!sessionExpiry) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, sessionExpiry - now);
      const remainingMinutes = Math.floor(remaining / (1000 * 60));
      
      setTimeRemaining(remainingMinutes);
      
      // Show warning when 5 minutes or less remaining
      if (remainingMinutes <= SESSION_CONFIG.WARNING_MINUTES && remainingMinutes > 0) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
      
      // Auto logout when session expires
      if (remainingMinutes <= 0) {
        logout();
      }
    };

    // Update immediately
    updateTimer();
    
    // Update every 30 seconds
    const interval = setInterval(updateTimer, 30000);
    
    return () => clearInterval(interval);
  }, [sessionExpiry, logout]);

  const handleExtendSession = () => {
    refreshSession();
    setShowWarning(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (!showWarning) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 border-l-4 border-orange-500 rounded-lg shadow-xl p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Session Expiring Soon
            </h3>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {timeRemaining} minute{timeRemaining !== 1 ? 's' : ''} remaining
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleExtendSession}
                className="flex items-center space-x-1 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white text-xs font-medium px-3 py-2 rounded-md transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Extend Session</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}