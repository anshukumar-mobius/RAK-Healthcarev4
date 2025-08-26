import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SessionManager } from './components/auth/SessionManager';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { RoleDashboard } from './components/dashboard/RoleDashboard';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <SessionManager />
        <Header />
        
        <div className="flex h-[calc(100vh-64px)]">
          <div className="relative">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
            <div className="p-4 h-full">
              <RoleDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;