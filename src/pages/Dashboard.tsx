import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { KPICard } from '../components/dashboard/KPICard';
import { Chart } from '../components/dashboard/Chart';
import { DataTable } from '../components/dashboard/DataTable';
import { TaskBoard } from '../components/dashboard/TaskBoard';
import { AdvancedAnalytics } from '../components/dashboard/AdvancedAnalytics';
import { 
  Users, 
  Calendar, 
  FlaskConical, 
  Clock, 
  Activity, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Bed,
  DollarSign,
  FileText,
  ClipboardList,
  Target
} from 'lucide-react';
import { t } from '../utils/translations';

// Mock data for demonstration
const mockTasks = [
  {
    id: '1',
    title: 'Review Lab Results',
    description: 'Patient Ahmed Al Rashid - Blood work results available',
    priority: 'urgent' as const,
    status: 'pending' as const,
    assignedTo: 'Dr. Sarah Ahmed',
    patient: 'Ahmed Al Rashid'
  },
  {
    id: '2',
    title: 'Medication Review',
    description: 'Update prescription for diabetes patient',
    priority: 'normal' as const,
    status: 'in-progress' as const,
    assignedTo: 'Dr. Ahmed Al Rashid',
    patient: 'Sarah Johnson'
  },
  {
    id: '3',
    title: 'Discharge Planning',
    description: 'Prepare discharge summary and instructions',
    priority: 'normal' as const,
    status: 'completed' as const,
    assignedTo: 'Nurse Fatima',
    patient: 'Mohammed Ali'
  }
];

const mockTableData = [
  {
    id: '1',
    patient: 'Ahmed Al Rashid',
    appointment: '10:00 AM',
    doctor: 'Dr. Sarah Ahmed',
    status: 'Completed',
    type: 'Consultation'
  },
  {
    id: '2',
    patient: 'Sarah Johnson',
    appointment: '11:30 AM',
    doctor: 'Dr. Ahmed Al Rashid',
    status: 'In Progress',
    type: 'Follow-up'
  },
  {
    id: '3',
    patient: 'Mohammed Ali',
    appointment: '2:00 PM',
    doctor: 'Dr. Fatima Al Zahra',
    status: 'Scheduled',
    type: 'Emergency'
  }
];

const tableColumns = [
  { key: 'patient', label: 'Patient', sortable: true },
  { key: 'appointment', label: 'Time', sortable: true },
  { key: 'doctor', label: 'Doctor', sortable: true },
  { key: 'type', label: 'Type', sortable: false },
  { key: 'status', label: 'Status', sortable: true }
];

export function Dashboard() {
  const { user } = useAuth();
  const { language } = useApp();
  const navigate = useNavigate();

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t('totalPatients', language)}
          value="2,847"
          change={{ value: 12, type: 'increase' }}
          icon={Users}
          color="blue"
        />
        <KPICard
          title={t('todayAppointments', language)}
          value="156"
          change={{ value: 8, type: 'increase' }}
          icon={Calendar}
          color="green"
        />
        <KPICard
          title={t('bedOccupancy', language)}
          value="87%"
          change={{ value: 3, type: 'decrease' }}
          icon={Bed}
          color="yellow"
        />
        <KPICard
          title="Revenue (AED)"
          value="2.4M"
          change={{ value: 15, type: 'increase' }}
          icon={DollarSign}
          color="teal"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart title="Patient Volume Trends" type="line" />
        <Chart title="Department Performance" type="bar" />
      </div>

      {/* Advanced Analytics */}
      <AdvancedAnalytics role="admin" />
      <AdvancedAnalytics role="doctor" />
    </div>
  );

  const renderDoctorDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t('myPatients', language)}
          value="28"
          change={{ value: 3, type: 'increase' }}
          icon={Users}
          color="blue"
        />
        <KPICard
          title={t('todayAppointments', language)}
          value="12"
          change={{ value: 2, type: 'increase' }}
          icon={Calendar}
          color="green"
        />
        <KPICard
          title={t('pendingResults', language)}
          value="5"
          change={{ value: 1, type: 'decrease' }}
          icon={FlaskConical}
          color="yellow"
        />
        <KPICard
          title={t('urgentTasks', language)}
          value="3"
          change={{ value: 1, type: 'increase' }}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Tasks and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskBoard tasks={mockTasks} />
        <AdvancedAnalytics role="doctor" />
      </div>

      {/* Recent Patients Table */}
      <DataTable
        title={t('recentPatients', language)}
        data={mockTableData}
        columns={tableColumns}
      />
    </div>
  );

  const renderNurseDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Patients Under Care"
          value="32"
          change={{ value: 4, type: 'increase' }}
          icon={Users}
          color="blue"
        />
        <KPICard
          title={t('urgentTasks', language)}
          value="5"
          change={{ value: 2, type: 'decrease' }}
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="Medications Administered"
          value="48"
          change={{ value: 12, type: 'increase' }}
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          title={t('vitalSigns', language)}
          value="28"
          change={{ value: 6, type: 'increase' }}
          icon={Activity}
          color="teal"
        />
      </div>

      {/* Tasks */}
      <TaskBoard tasks={mockTasks} />

      {/* Advanced Analytics */}
      <AdvancedAnalytics role="nurse" />

      {/* Nursing Documentation */}
      <div className="bg-gradient-to-r from-rak-pink-50 to-rak-beige-50 dark:from-rak-pink-900/20 dark:to-rak-beige-900/20 rounded-lg p-6 border border-rak-pink-200 dark:border-rak-pink-800">
        <h3 className="text-lg font-semibold text-rak-magenta-700 dark:text-rak-magenta-400 mb-4">
          Nursing Documentation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/discharge-summary/V001')}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-rak-pink-200 dark:border-rak-pink-700 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rak-magenta-100 dark:bg-rak-magenta-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-rak-magenta-600 dark:text-rak-magenta-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Discharge Summary</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create & edit discharge summaries</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/nursing-notes/V001')}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-rak-pink-200 dark:border-rak-pink-700 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rak-beige-100 dark:bg-rak-beige-900/20 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-rak-beige-600 dark:text-rak-beige-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Nursing Notes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Document shift notes & progress</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/care-plan/V001')}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-rak-pink-200 dark:border-rak-pink-700 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rak-success-100 dark:bg-rak-success-900/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-rak-success-600 dark:text-rak-success-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Care Plan</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage patient care goals</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderReceptionistDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Patients Registered"
          value="18"
          change={{ value: 3, type: 'increase' }}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Appointments Scheduled"
          value="45"
          change={{ value: 8, type: 'increase' }}
          icon={Calendar}
          color="green"
        />
        <KPICard
          title="Check-ins Today"
          value="67"
          change={{ value: 12, type: 'increase' }}
          icon={CheckCircle}
          color="teal"
        />
        <KPICard
          title="Average Wait Time"
          value="12 min"
          change={{ value: 3, type: 'decrease' }}
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Appointments Table */}
      <DataTable
        title="Today's Appointments"
        columns={tableColumns}
        data={mockTableData}
        searchable={true}
        filterable={true}
        exportable={true}
      />

      {/* Advanced Analytics */}
      <AdvancedAnalytics role="receptionist" />
    </div>
  );

  const renderDiagnosticianDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Tests Completed"
          value="89"
          change={{ value: 15, type: 'increase' }}
          icon={FlaskConical}
          color="blue"
        />
        <KPICard
          title={t('pendingTests', language)}
          value="23"
          change={{ value: 5, type: 'decrease' }}
          icon={Clock}
          color="yellow"
        />
        <KPICard
          title="Critical Results"
          value="3"
          change={{ value: 1, type: 'increase' }}
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="Average TAT"
          value="2.4 hrs"
          change={{ value: 8, type: 'decrease' }}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart title="Test Volume by Type" type="pie" />
        <Chart title="Turnaround Time Trends" type="line" />
      </div>

      {/* Advanced Analytics */}
      <AdvancedAnalytics role="diagnostician" />
    </div>
  );

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'doctor':
        return renderDoctorDashboard();
      case 'nurse':
        return renderNurseDashboard();
      case 'receptionist':
        return renderReceptionistDashboard();
      case 'diagnostician':
        return renderDiagnosticianDashboard();
      default:
        return <div>Dashboard not available for this role</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-rak-magenta-100">
          {user?.department && `${user.department} • `}
          {new Date().toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Role-specific Dashboard */}
      {renderDashboard()}
    </div>
  );
}