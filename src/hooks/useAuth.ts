import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { DASHBOARD_ACCESS, SESSION_CONFIG } from '../types/auth';

export function useAuth() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    sessionExpiry,
    login, 
    logout, 
    refreshSession,
    checkSession 
  } = useAuthStore();

  // Check if user has permission for a specific resource and action
  const hasPermission = useCallback((resource: string, action: string): boolean => {
    if (!user || !isAuthenticated) return false;
    
    const userPermissions = user.permissions;
    const resourcePermission = userPermissions.find(p => p.resource === resource);
    
    return resourcePermission?.actions.includes(action) || false;
  }, [user, isAuthenticated]);

  // Check if user can access a specific dashboard/route
  const canAccessRoute = useCallback((route: string): boolean => {
    if (!user || !isAuthenticated) return false;
    
    const allowedRoutes = DASHBOARD_ACCESS[user.role];
    return allowedRoutes.includes(route);
  }, [user, isAuthenticated]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return user?.role === 'admin' && isAuthenticated;
  }, [user, isAuthenticated]);

  // Check if user is doctor
  const isDoctor = useCallback((): boolean => {
    return user?.role === 'doctor' && isAuthenticated;
  }, [user, isAuthenticated]);

  // Check if user is nurse
  const isNurse = useCallback((): boolean => {
    return user?.role === 'nurse' && isAuthenticated;
  }, [user, isAuthenticated]);

  // Session management
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) return;

    const checkSessionValidity = () => {
      const now = Date.now();
      const timeUntilExpiry = sessionExpiry - now;
      const warningTime = SESSION_CONFIG.WARNING_MINUTES * 60 * 1000;
      const refreshTime = SESSION_CONFIG.REFRESH_THRESHOLD_MINUTES * 60 * 1000;

      // Auto-refresh session if within refresh threshold
      if (timeUntilExpiry <= refreshTime && timeUntilExpiry > warningTime) {
        refreshSession();
      }

      // Show warning if session is about to expire
      if (timeUntilExpiry <= warningTime && timeUntilExpiry > 0) {
        // You can implement a warning modal here
        console.warn('Session will expire soon');
      }

      // Auto-logout if session expired
      if (timeUntilExpiry <= 0) {
        logout();
      }
    };

    // Check session validity every minute
    const interval = setInterval(checkSessionValidity, 60000);
    
    // Initial check
    checkSessionValidity();

    return () => clearInterval(interval);
  }, [isAuthenticated, sessionExpiry, refreshSession, logout]);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    user,
    isAuthenticated,
    isLoading,
    sessionExpiry,
    login,
    logout,
    refreshSession,
    hasPermission,
    canAccessRoute,
    isAdmin,
    isDoctor,
    isNurse
  };
}