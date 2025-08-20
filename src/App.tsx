import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { useAuthStore } from './stores/authStore';
import { LoginForm } from './components/auth/LoginForm';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { RoleDashboard } from './components/dashboard/RoleDashboard';

function AppContent() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      
      <div className="flex h-[calc(100vh-64px)]">
        <div className="relative">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
          <div className="p-4 h-full">
            <RoleDashboard activeTab={activeTab} />
          </div>
        </main>
      </div>
    </div>
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