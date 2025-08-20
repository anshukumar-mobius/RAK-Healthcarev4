import {useState} from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  Bed, 
  Clock, 
  TrendingUp,
  FlaskConical,
  CheckSquare,
  UserPlus,
  ClipboardList,
  Heart,
  Thermometer,
  Stethoscope,
  FileText,
  AlertTriangle,
  Phone,
  MessageSquare,
  Settings,
  BarChart3,
  PieChart,
  TrendingDown,
  Shield,
  DollarSign,
  CreditCard,
  Receipt,
  FileCheck,
  UserCheck,
  Building,
  MapPin,
  Printer,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Bell,
  Mail,
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Award,
  Target,
  Zap,
  Database,
  Monitor,
  Wifi,
  WifiOff,
  Bot
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuthStore } from '../../stores/authStore';
import { useEMRStore } from '../../stores/emrStore';
import { t } from '../../utils/translations';
import { KPICard } from './KPICard';
import { Chart } from './Chart';
import { DataTable } from './DataTable';
import { TaskBoard } from './TaskBoard';
import { PatientTimeline } from '../patients/PatientTimeline';
import { AppointmentScheduler } from '../appointments/AppointmentScheduler';
import { DiagnosticWorkflow } from '../diagnostics/DiagnosticWorkflow';
import { EMRViewer } from '../emr/EMRViewer';
import { PatientDetailView } from '../emr/PatientDetailView';
import { AgentDashboard } from '../agents/AgentDashboard';
import { useAgentStore } from '../../stores/agentStore';

// Agent integration hooks
const useAgentIntegration = (role: string) => {
  const { agents, recommendations, triggerAgentAction } = useAgentStore();
  
  // Get role-specific agents
  const roleAgents = agents.filter(agent => {
    switch (role) {
      case 'admin':
        return ['scheduling-optimizer', 'billing-automation', 'patient-flow'].includes(agent.id);
      case 'doctor':
        return ['clinical-decision-support', 'medication-management', 'readmission-predictor'].includes(agent.id);
      case 'nurse':
        return ['vital-signs-monitor', 'medication-management'].includes(agent.id);
      case 'receptionist':
        return ['scheduling-optimizer', 'patient-flow'].includes(agent.id);
      case 'diagnostician':
        return ['radiology-ai', 'lab-results-ai', 'equipment-maintenance'].includes(agent.id);
      default:
        return false;
    }
  });
  
  // Get role-specific recommendations
  const roleRecommendations = recommendations.filter(rec => {
    const agent = agents.find(a => a.id === rec.agentId);
    return roleAgents.some(ra => ra.id === agent?.id);
  });
  
  return { roleAgents, roleRecommendations, triggerAgentAction };
};
interface RoleDashboardProps {
  activeTab: string;
}

// Mock data - in a real app, this would come from APIs
const mockKPIData = {
  admin: [
    { title: 'Hospital Occupancy', value: '87%', change: { value: 5, type: 'increase' as const }, icon: Building, color: 'blue' as const },
    { title: 'Revenue Today', value: 'AED 245K', change: { value: 12, type: 'increase' as const }, icon: DollarSign, color: 'green' as const },
    { title: 'Staff Efficiency', value: '94%', change: { value: 3, type: 'increase' as const }, icon: TrendingUp, color: 'teal' as const },
    { title: 'Patient Satisfaction', value: '4.8/5', change: { value: 2, type: 'increase' as const }, icon: Star, color: 'yellow' as const },
    { title: 'Emergency Response', value: '3.2min', change: { value: 8, type: 'decrease' as const }, icon: AlertTriangle, color: 'red' as const },
    { title: 'System Uptime', value: '99.9%', change: { value: 0.1, type: 'increase' as const }, icon: Monitor, color: 'green' as const }
  ],
  doctor: [
    { title: 'Today\'s Patients', value: '18', icon: Users, color: 'blue' as const },
    { title: 'Pending Consultations', value: '5', icon: Stethoscope, color: 'yellow' as const },
    { title: 'Lab Results Review', value: '12', icon: FlaskConical, color: 'red' as const },
    { title: 'Follow-up Required', value: '8', icon: Calendar, color: 'teal' as const },
    { title: 'Patient Satisfaction', value: '4.9/5', icon: Star, color: 'green' as const },
    { title: 'Avg Consultation', value: '22min', icon: Clock, color: 'blue' as const }
  ],
  nurse: [
    { title: 'Assigned Patients', value: '24', icon: Users, color: 'blue' as const },
    { title: 'Vitals Due', value: '8', icon: Activity, color: 'yellow' as const },
    { title: 'Medications Pending', value: '15', icon: Thermometer, color: 'red' as const },
    { title: 'Discharge Ready', value: '6', icon: UserCheck, color: 'green' as const },
    { title: 'Critical Alerts', value: '2', icon: AlertTriangle, color: 'red' as const },
    { title: 'Bed Turnover', value: '4', icon: Bed, color: 'teal' as const }
  ],
  receptionist: [
    { title: 'Today\'s Check-ins', value: '67', icon: UserPlus, color: 'blue' as const },
    { title: 'Current Queue', value: '12', icon: ClipboardList, color: 'yellow' as const },
    { title: 'Appointments Booked', value: '89', icon: Calendar, color: 'teal' as const },
    { title: 'Insurance Verified', value: '45', icon: Shield, color: 'green' as const },
    { title: 'No-shows Today', value: '3', icon: UserCheck, color: 'red' as const },
    { title: 'Avg Wait Time', value: '8min', icon: Clock, color: 'green' as const }
  ],
  diagnostician: [
    { title: 'Tests Pending', value: '34', icon: FlaskConical, color: 'yellow' as const },
    { title: 'Results Ready', value: '28', icon: CheckSquare, color: 'green' as const },
    { title: 'Critical Results', value: '4', icon: AlertTriangle, color: 'red' as const },
    { title: 'Equipment Online', value: '98%', icon: Monitor, color: 'green' as const },
    { title: 'Turnaround Time', value: '2.4hrs', icon: Clock, color: 'blue' as const },
    { title: 'Quality Score', value: '99.2%', icon: Award, color: 'teal' as const }
  ]
};

const mockTasks = [
  {
    id: '1',
    title: 'Review Lab Results',
    description: 'Blood work for John Doe needs approval',
    priority: 'urgent' as const,
    status: 'pending' as const,
    patient: 'John Doe',
    dueDate: '2025-01-08'
  },
  {
    id: '2',
    title: 'Follow-up Call',
    description: 'Check on post-surgery patient recovery',
    priority: 'normal' as const,
    status: 'in-progress' as const,
    patient: 'Sarah Smith',
    dueDate: '2025-01-09'
  },
  {
    id: '3',
    title: 'Medication Review',
    description: 'Update prescription for diabetes patient',
    priority: 'normal' as const,
    status: 'completed' as const,
    patient: 'Mike Johnson',
    dueDate: '2025-01-07'
  }
];

const mockPatientData = [
  { id: 'P001', name: 'John Doe', age: 45, condition: 'Hypertension', lastVisit: '2025-01-05', status: 'Active' },
  { id: 'P002', name: 'Sarah Smith', age: 32, condition: 'Diabetes', lastVisit: '2025-01-04', status: 'Active' },
  { id: 'P003', name: 'Mike Johnson', age: 67, condition: 'Heart Disease', lastVisit: '2025-01-03', status: 'Inactive' },
  { id: 'P004', name: 'Lisa Brown', age: 28, condition: 'Pregnancy Care', lastVisit: '2025-01-02', status: 'Active' }
];

const mockAppointments = [
  {
    id: 'A001',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Ahmed',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    type: 'Consultation',
    status: 'scheduled' as const,
    room: '101'
  },
  {
    id: 'A002',
    patientName: 'Sarah Smith',
    doctorName: 'Dr. Michael Brown',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    duration: 45,
    type: 'Follow-up',
    status: 'scheduled' as const,
    room: '102'
  }
];

type DiagnosticTestStatus = 'ordered' | 'in-progress' | 'completed';

const mockDiagnosticTests = [
  {
    id: 'T001',
    testName: 'Complete Blood Count',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Ahmed',
    orderDate: '2025-01-07',
    status: 'ordered' as DiagnosticTestStatus,
    priority: 'urgent' as const,
    type: 'blood' as const
  },
  {
    id: 'T002',
    testName: 'Chest X-Ray',
    patientName: 'Sarah Smith',
    doctorName: 'Dr. Michael Brown',
    orderDate: '2025-01-06',
    status: 'in-progress' as DiagnosticTestStatus,
    priority: 'normal' as const,
    type: 'imaging' as const,
    technician: 'Tech. Lisa Wilson'
  }
];

const mockTimelineEvents = [
  {
    id: '1',
    type: 'appointment' as const,
    title: 'Regular Checkup',
    description: 'Annual physical examination',
    date: '2025-01-07',
    time: '09:00 AM',
    doctor: 'Dr. Sarah Ahmed',
    status: 'completed' as const,
    details: { bloodPressure: '120/80', weight: '75kg', temperature: '98.6°F' }
  },
  {
    id: '2',
    type: 'test' as const,
    title: 'Blood Work',
    description: 'Complete metabolic panel',
    date: '2025-01-06',
    time: '11:30 AM',
    doctor: 'Dr. Sarah Ahmed',
    status: 'completed' as const
  }
];

// Industry-level mock data for detailed views
const mockAdminData = {
  departments: [
    { name: 'Emergency', occupancy: 95, staff: 24, revenue: 45000, satisfaction: 4.7 },
    { name: 'ICU', occupancy: 88, staff: 18, revenue: 78000, satisfaction: 4.9 },
    { name: 'Cardiology', occupancy: 76, staff: 12, revenue: 56000, satisfaction: 4.8 },
    { name: 'Orthopedics', occupancy: 82, staff: 15, revenue: 42000, satisfaction: 4.6 }
  ],
  financialMetrics: {
    dailyRevenue: 245000,
    monthlyRevenue: 6800000,
    outstandingBills: 125000,
    insuranceClaims: 89000
  },
  systemHealth: {
    serverUptime: 99.9,
    databasePerformance: 98.5,
    networkLatency: 12,
    backupStatus: 'Completed'
  }
};

const mockDoctorData = {
  todaySchedule: [
    { time: '09:00', patient: 'Ahmed Al Rashid', type: 'Consultation', room: '201', status: 'completed' },
    { time: '09:30', patient: 'Sarah Johnson', type: 'Follow-up', room: '201', status: 'in-progress' },
    { time: '10:00', patient: 'Mohammed Ali', type: 'New Patient', room: '201', status: 'scheduled' },
    { time: '10:30', patient: 'Fatima Hassan', type: 'Consultation', room: '201', status: 'scheduled' }
  ],
  pendingReviews: [
    { patient: 'John Doe', test: 'Blood Work', priority: 'urgent', ordered: '2 hours ago' },
    { patient: 'Lisa Brown', test: 'MRI Scan', priority: 'normal', ordered: '1 day ago' },
    { patient: 'Mike Wilson', test: 'ECG', priority: 'urgent', ordered: '30 minutes ago' }
  ],
  patientAlerts: [
    { patient: 'Ahmed Al Rashid', alert: 'Blood pressure elevated', severity: 'high' },
    { patient: 'Sarah Johnson', alert: 'Medication due', severity: 'medium' }
  ]
};

const mockNurseData = {
  assignedPatients: [
    { name: 'Ahmed Al Rashid', room: '201', condition: 'Stable', vitals: 'Due in 2hrs', medications: '3 pending' },
    { name: 'Sarah Johnson', room: '202', condition: 'Critical', vitals: 'Overdue', medications: '1 pending' },
    { name: 'Mohammed Ali', room: '203', condition: 'Stable', vitals: 'Completed', medications: 'None' }
  ],
  medicationSchedule: [
    { time: '08:00', patient: 'Ahmed Al Rashid', medication: 'Lisinopril 10mg', status: 'completed' },
    { time: '09:00', patient: 'Sarah Johnson', medication: 'Metformin 500mg', status: 'pending' },
    { time: '10:00', patient: 'Mohammed Ali', medication: 'Aspirin 81mg', status: 'scheduled' }
  ],
  criticalAlerts: [
    { patient: 'Sarah Johnson', alert: 'Blood pressure critical', time: '5 minutes ago' },
    { patient: 'Ahmed Al Rashid', alert: 'Pain level 8/10', time: '15 minutes ago' }
  ]
};

const mockReceptionistData = {
  todayQueue: [
    { number: 'Q001', patient: 'Ahmed Al Rashid', appointment: '09:00', status: 'checked-in', waitTime: '5 min' },
    { number: 'Q002', patient: 'Sarah Johnson', appointment: '09:30', status: 'waiting', waitTime: '12 min' },
    { number: 'Q003', patient: 'Mohammed Ali', appointment: '10:00', status: 'called', waitTime: '0 min' }
  ],
  insuranceVerifications: [
    { patient: 'Ahmed Al Rashid', provider: 'ADNIC', status: 'verified', coverage: '100%' },
    { patient: 'Sarah Johnson', provider: 'Daman', status: 'pending', coverage: 'Unknown' },
    { patient: 'Mohammed Ali', provider: 'THIQA', status: 'verified', coverage: '80%' }
  ],
  appointmentRequests: [
    { patient: 'Fatima Hassan', specialty: 'Cardiology', preferred: 'Dr. Ahmed', urgency: 'routine' },
    { patient: 'Ali Mohammed', specialty: 'Orthopedics', preferred: 'Any', urgency: 'urgent' }
  ]
};

const mockDiagnosticianData = {
  equipmentStatus: [
    { equipment: 'MRI Scanner 1', status: 'online', utilization: '85%', nextMaintenance: '2025-02-15' },
    { equipment: 'CT Scanner 2', status: 'maintenance', utilization: '0%', nextMaintenance: '2025-01-10' },
    { equipment: 'X-Ray Unit 3', status: 'online', utilization: '67%', nextMaintenance: '2025-03-01' }
  ],
  qualityMetrics: {
    accuracyRate: 99.2,
    retestRate: 1.8,
    turnaroundTime: 2.4,
    patientSatisfaction: 4.8
  },
  workloadDistribution: [
    { technician: 'Tech. Ahmed Ali', tests: 12, completed: 10, pending: 2 },
    { technician: 'Tech. Sarah Hassan', tests: 15, completed: 13, pending: 2 },
    { technician: 'Tech. Mohammed Rashid', tests: 8, completed: 8, pending: 0 }
  ]
};
export function RoleDashboard({ activeTab: initialActiveTab }: RoleDashboardProps) {
  const { role, language } = useApp();
  const user = useAuthStore(state => state.user);
  const { patients, searchPatients } = useEMRStore();
  const { recommendations, getRecommendationsByPriority, dismissRecommendation } = useAgentStore();
  const { roleAgents, roleRecommendations, triggerAgentAction } = useAgentIntegration(role);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(initialActiveTab);


  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        const kpiData = mockKPIData[role] || [];
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {kpiData.map((kpi, index) => (
                <KPICard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  {...('change' in kpi ? { change: kpi.change } : {})}
                  icon={kpi.icon}
                  color={kpi.color}
                />
              ))}
            </div>

            {/* Role-specific detailed dashboard */}
            {/* AI Recommendations Banner */}
            {roleRecommendations.length > 0 && (
              <div className="space-y-4">
                {roleRecommendations.filter(r => r.priority === 'critical').map(rec => (
                  <div key={rec.id} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <span className="font-semibold text-red-800 dark:text-red-400">{rec.title}</span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            {rec.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-2">{rec.description}</p>
                        {rec.action && (
                          <p className="text-sm font-medium text-red-800 dark:text-red-400">
                            Recommended: {rec.action}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => triggerAgentAction(rec.agentId, rec.action || 'Process recommendation', rec.data)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => dismissRecommendation(rec.id)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {roleRecommendations.filter(r => r.priority === 'high').length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800 dark:text-yellow-400">
                          {roleRecommendations.filter(r => r.priority === 'high').length} high priority recommendations
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab('ai-agents')}
                        className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Active Agents Status */}
            {roleAgents.filter(a => a.status === 'active').length > 0 && (
              <div className="bg-rak-pink-50 dark:bg-rak-pink-900/20 border border-rak-pink-200 dark:border-rak-pink-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-rak-magenta-600" />
                    <span className="font-medium text-rak-magenta-800 dark:text-rak-magenta-400">
                      {roleAgents.filter(a => a.status === 'active').length} AI agents actively monitoring your workflows
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('ai-agents')}
                    className="px-3 py-1 bg-rak-magenta-600 text-white rounded-md hover:bg-rak-magenta-700 text-sm"
                  >
                    Manage Agents
                  </button>
                </div>
              </div>
            )}

            {role === 'admin' && renderAdminDashboard()}
            {role === 'doctor' && renderDoctorDashboard()}
            {role === 'nurse' && renderNurseDashboard()}
            {role === 'receptionist' && renderReceptionistDashboard()}
            {role === 'diagnostician' && renderDiagnosticianDashboard()}
          </div>
        );

      case 'patients':
        return (
          <div className="space-y-6">
            {selectedPatient ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-rak-primary-600 hover:text-rak-primary-700 font-medium"
                  >
                    ← Back to Patients
                  </button>
                </div>
                <PatientDetailView 
                  patient={selectedPatient} 
                  onEdit={() => console.log('Edit patient')} 
                />
                <EMRViewer patient={selectedPatient} />
              </div>
            ) : (
              <DataTable
                title={t('patients', language)}
                columns={[
                  { key: 'mrn', label: 'MRN', sortable: true },
                  { key: 'firstName', label: 'First Name', sortable: true },
                  { key: 'lastName', label: 'Last Name', sortable: true },
                  { key: 'dateOfBirth', label: 'DOB', sortable: true },
                  { key: 'phone', label: 'Phone' },
                  { key: 'nationality', label: 'Nationality' }
                ]}
                data={patients}
                onView={(patient) => setSelectedPatient(patient)}
              />
            )}
          </div>
        );

      case 'appointments':
        return (
          <AppointmentScheduler
            appointments={mockAppointments}
            onNewAppointment={() => console.log('New appointment')}
            onEditAppointment={(apt) => console.log('Edit appointment:', apt)}
          />
        );

      case 'diagnostics':
        return (
          <DiagnosticWorkflow
            tests={mockDiagnosticTests}
            onUpdateStatus={(id, status) => console.log('Update status:', id, status)}
            onUploadResults={(id) => console.log('Upload results:', id)}
          />
        );

      case 'billing':
        return (
          <DataTable
            title={t('billing', language)}
            columns={[
              { key: 'invoiceId', label: 'Invoice ID', sortable: true },
              { key: 'patientName', label: 'Patient', sortable: true },
              { key: 'amount', label: 'Amount', sortable: true },
              { key: 'status', label: 'Status' },
              { key: 'date', label: 'Date', sortable: true }
            ]}
            data={[
              { invoiceId: 'INV001', patientName: 'John Doe', amount: '$250', status: 'Paid', date: '2025-01-07' },
              { invoiceId: 'INV002', patientName: 'Sarah Smith', amount: '$180', status: 'Pending', date: '2025-01-06' }
            ]}
          />
        );

      case 'tasks':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('myTasks', language)}
            </h2>
            <TaskBoard
              tasks={mockTasks}
              onTaskClick={(task) => console.log('Task clicked:', task)}
            />
          </div>
        );

      case 'registration':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {t('patientRegistration', language)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                {t('cancel', language)}
              </button>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                {t('save', language)}
              </button>
            </div>
          </div>
        );

      case 'vitals':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard title="Blood Pressure" value="120/80" icon={Heart} color="red" />
              <KPICard title="Heart Rate" value="72 BPM" icon={Activity} color="blue" />
              <KPICard title="Temperature" value="98.6°F" icon={Thermometer} color="yellow" />
              <KPICard title="Oxygen Sat" value="98%" icon={Activity} color="green" />
            </div>
            
            <DataTable
              title="Patient Vital Signs"
              columns={[
                { key: 'patient', label: 'Patient', sortable: true },
                { key: 'room', label: 'Room' },
                { key: 'bp', label: 'BP' },
                { key: 'hr', label: 'HR' },
                { key: 'temp', label: 'Temp' },
                { key: 'lastUpdated', label: 'Last Updated', sortable: true }
              ]}
              data={[
                { patient: 'John Doe', room: '101', bp: '120/80', hr: '72', temp: '98.6°F', lastUpdated: '10:30 AM' },
                { patient: 'Sarah Smith', room: '102', bp: '118/75', hr: '68', temp: '98.4°F', lastUpdated: '10:25 AM' }
              ]}
            />
          </div>
        );

      case 'beds':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <KPICard title="Total Beds" value="120" icon={Bed} color="blue" />
              <KPICard title="Occupied" value="102" icon={Users} color="yellow" />
              <KPICard title="Available" value="18" icon={CheckSquare} color="green" />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Bed Status Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-md border text-center ${
                      i % 5 === 0
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="font-semibold">Room {101 + i}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {i % 5 === 0 ? 'Available' : 'Occupied'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pending-tests':
        return (
          <DiagnosticWorkflow
            tests={mockDiagnosticTests.filter(test => test.status !== 'completed')}
            onUpdateStatus={(id, status) => console.log('Update status:', id, status)}
            onUploadResults={(id) => console.log('Upload results:', id)}
          />
        );

      case 'ai-agents':
        return <AgentDashboard />;

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Select a section from the sidebar to view content
            </p>
          </div>
        );
    }
  };

  // Industry-level detailed dashboard renderers
  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart title="Patient Flow Trends" type="line" />
        <Chart title="Department Revenue" type="bar" />
      </div>

      {/* Department Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department Performance</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-rak-primary-100 text-rak-primary-700 rounded-md">Export</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md">Refresh</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAdminData.departments.map((dept, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{dept.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Occupancy:</span>
                  <span className="font-medium">{dept.occupancy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Staff:</span>
                  <span className="font-medium">{dept.staff}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                  <span className="font-medium">AED {dept.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                  <span className="font-medium">{dept.satisfaction}/5</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Daily Revenue</span>
              <span className="text-xl font-bold text-green-600">AED {mockAdminData.financialMetrics.dailyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Monthly Revenue</span>
              <span className="text-lg font-semibold">AED {mockAdminData.financialMetrics.monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Outstanding Bills</span>
              <span className="text-lg font-semibold text-yellow-600">AED {mockAdminData.financialMetrics.outstandingBills.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Insurance Claims</span>
              <span className="text-lg font-semibold text-blue-600">AED {mockAdminData.financialMetrics.insuranceClaims.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Server Uptime</span>
              <span className="text-lg font-semibold text-green-600">{mockAdminData.systemHealth.serverUptime}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Database Performance</span>
              <span className="text-lg font-semibold text-green-600">{mockAdminData.systemHealth.databasePerformance}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Network Latency</span>
              <span className="text-lg font-semibold">{mockAdminData.systemHealth.networkLatency}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Backup Status</span>
              <span className="text-lg font-semibold text-green-600">{mockAdminData.systemHealth.backupStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDoctorDashboard = () => (
    <div className="space-y-6">
      {/* Today's Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-rak-primary-100 text-rak-primary-700 rounded-md">Add Patient</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md">View Calendar</button>
          </div>
        </div>
        <div className="space-y-3">
          {mockDoctorData.todaySchedule.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{appointment.time}</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{appointment.patient}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{appointment.type} • Room {appointment.room}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                appointment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Reviews and Patient Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Lab Reviews</h3>
          <div className="space-y-3">
            {mockDoctorData.pendingReviews.map((review, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{review.patient}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{review.test} • {review.ordered}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  review.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {review.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Patient Alerts</h3>
          <div className="space-y-3">
            {mockDoctorData.patientAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{alert.patient}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{alert.alert}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Management */}
      <TaskBoard tasks={mockTasks} />
    </div>
  );

  const renderNurseDashboard = () => (
    <div className="space-y-6">
      {/* Assigned Patients */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assigned Patients</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-rak-primary-100 text-rak-primary-700 rounded-md">Update Vitals</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md">View All</button>
          </div>
        </div>
        <div className="space-y-3">
          {mockNurseData.assignedPatients.map((patient, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Room {patient.room}</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{patient.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Condition: {patient.condition} • Vitals: {patient.vitals} • Meds: {patient.medications}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                patient.condition === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {patient.condition}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Medication Schedule and Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Medication Schedule</h3>
          <div className="space-y-3">
            {mockNurseData.medicationSchedule.map((med, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{med.time} - {med.patient}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{med.medication}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  med.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  med.status === 'pending' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {med.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Critical Alerts</h3>
          <div className="space-y-3">
            {mockNurseData.criticalAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div>
                  <div className="font-semibold text-red-800 dark:text-red-400">{alert.patient}</div>
                  <div className="text-sm text-red-600 dark:text-red-300">{alert.alert}</div>
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">{alert.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReceptionistDashboard = () => (
    <div className="space-y-6">
      {/* Patient Queue */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Patient Queue</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-rak-primary-100 text-rak-primary-700 rounded-md">Check In</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md">Call Next</button>
          </div>
        </div>
        <div className="space-y-3">
          {mockReceptionistData.todayQueue.map((queue, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{queue.number}</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{queue.patient}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Appointment: {queue.appointment} • Wait: {queue.waitTime}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                queue.status === 'checked-in' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                queue.status === 'waiting' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
              }`}>
                {queue.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance Verifications and Appointment Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insurance Verifications</h3>
          <div className="space-y-3">
            {mockReceptionistData.insuranceVerifications.map((insurance, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{insurance.patient}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {insurance.provider} • Coverage: {insurance.coverage}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  insurance.status === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {insurance.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appointment Requests</h3>
          <div className="space-y-3">
            {mockReceptionistData.appointmentRequests.map((request, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{request.patient}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {request.specialty} • Dr. {request.preferred}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.urgency === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {request.urgency}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiagnosticianDashboard = () => (
    <div className="space-y-6">
      {/* Equipment Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Equipment Status</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-rak-primary-100 text-rak-primary-700 rounded-md">Schedule Maintenance</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md">View All</button>
          </div>
        </div>
        <div className="space-y-3">
          {mockDiagnosticianData.equipmentStatus.map((equipment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  equipment.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{equipment.equipment}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Utilization: {equipment.utilization} • Next Maintenance: {equipment.nextMaintenance}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                equipment.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {equipment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Metrics and Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quality Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Accuracy Rate</span>
              <span className="text-lg font-semibold text-green-600">{mockDiagnosticianData.qualityMetrics.accuracyRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Retest Rate</span>
              <span className="text-lg font-semibold text-yellow-600">{mockDiagnosticianData.qualityMetrics.retestRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Turnaround Time</span>
              <span className="text-lg font-semibold">{mockDiagnosticianData.qualityMetrics.turnaroundTime}hrs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Patient Satisfaction</span>
              <span className="text-lg font-semibold text-green-600">{mockDiagnosticianData.qualityMetrics.patientSatisfaction}/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workload Distribution</h3>
          <div className="space-y-3">
            {mockDiagnosticianData.workloadDistribution.map((tech, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{tech.technician}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {tech.tests} • Completed: {tech.completed} • Pending: {tech.pending}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.round((tech.completed / tech.tests) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Completion</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  return <div className="space-y-6">{renderDashboardContent()}</div>;
}