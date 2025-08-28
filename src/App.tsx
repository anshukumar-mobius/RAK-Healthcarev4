import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SessionManager } from './components/auth/SessionManager';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Appointments } from './pages/Appointments';
import { Diagnostics } from './pages/Diagnostics';
import { Billing } from './pages/Billing';
import { Tasks } from './pages/Tasks';
import Registration from './pages/Registration';
import { VitalSigns } from './pages/VitalSigns';
import { Beds } from './pages/Beds';
import { PendingTests } from './pages/PendingTests';
import { AIAgents } from './pages/AIAgents';
import { Settings } from './pages/Settings';
import { DischargeSummary } from './pages/DischargeSummary';
import { NursingNotes } from './pages/NursingNotes';
import { CarePlan } from './pages/CarePlan';

function AppContent() {
  const { isAuthenticated } = useAuth();

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
            <Sidebar />
          </div>
          
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
            <div className="p-4 h-full">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/diagnostics" element={<Diagnostics />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/vitals" element={<VitalSigns />} />
                <Route path="/beds" element={<Beds />} />
                <Route path="/pending-tests" element={<PendingTests />} />
                <Route path="/ai-agents" element={<AIAgents />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/discharge-summary/:encounterId" element={<DischargeSummary />} />
                <Route path="/nursing-notes/:encounterId" element={<NursingNotes />} />
                <Route path="/care-plan/:encounterId" element={<CarePlan />} />
              </Routes>
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
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;