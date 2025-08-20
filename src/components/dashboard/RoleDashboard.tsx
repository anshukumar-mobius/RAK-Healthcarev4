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
  Thermometer
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

interface RoleDashboardProps {
  activeTab: string;
}

// Mock data - in a real app, this would come from APIs
const mockKPIData = {
  admin: [
    { title: t('bedOccupancy', 'en'), value: '85%', change: { value: 5, type: 'increase' as const }, icon: Bed, color: 'teal' as const },
    { title: t('avgConsultationTime', 'en'), value: '24min', change: { value: 3, type: 'decrease' as const }, icon: Clock, color: 'blue' as const },
    { title: t('doctorSuccessRate', 'en'), value: '94%', change: { value: 2, type: 'increase' as const }, icon: TrendingUp, color: 'green' as const },
    { title: t('totalPatients', 'en'), value: '1,247', change: { value: 8, type: 'increase' as const }, icon: Users, color: 'yellow' as const }
  ],
  doctor: [
    { title: t('todayAppointments', 'en'), value: '12', icon: Calendar, color: 'blue' as const },
    { title: t('urgentTasks', 'en'), value: '3', icon: CheckSquare, color: 'red' as const },
    { title: t('pendingTests', 'en'), value: '7', icon: FlaskConical, color: 'yellow' as const },
    { title: 'Patient Reviews', value: '98%', icon: TrendingUp, color: 'green' as const }
  ],
  nurse: [
    { title: 'Assigned Patients', value: '18', icon: Users, color: 'teal' as const },
    { title: 'Vitals Pending', value: '5', icon: Activity, color: 'yellow' as const },
    { title: 'Medications Due', value: '12', icon: Clock, color: 'red' as const },
    { title: 'Available Beds', value: '3', icon: Bed, color: 'green' as const }
  ],
  receptionist: [
    { title: 'Check-ins Today', value: '47', icon: UserPlus, color: 'blue' as const },
    { title: 'Queue Length', value: '8', icon: ClipboardList, color: 'yellow' as const },
    { title: 'Appointments Today', value: '52', icon: Calendar, color: 'teal' as const },
    { title: 'Avg Wait Time', value: '12min', icon: Clock, color: 'green' as const }
  ],
  diagnostician: [
    { title: t('pendingTests', 'en'), value: '23', icon: FlaskConical, color: 'yellow' as const },
    { title: t('completedTests', 'en'), value: '156', icon: CheckSquare, color: 'green' as const },
    { title: 'Urgent Results', value: '2', icon: Activity, color: 'red' as const },
    { title: 'Equipment Status', value: '96%', icon: TrendingUp, color: 'blue' as const }
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

const mockDiagnosticTests = [
  {
    id: 'T001',
    testName: 'Complete Blood Count',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Ahmed',
    orderDate: '2025-01-07',
    status: 'ordered' as const,
    priority: 'urgent' as const,
    type: 'blood' as const
  },
  {
    id: 'T002',
    testName: 'Chest X-Ray',
    patientName: 'Sarah Smith',
    doctorName: 'Dr. Michael Brown',
    orderDate: '2025-01-06',
    status: 'in-progress' as const,
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

export function RoleDashboard({ activeTab }: RoleDashboardProps) {
  const { role, language } = useApp();
  const user = useAuthStore(state => state.user);
  const { patients, searchPatients } = useEMRStore();
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        const kpiData = mockKPIData[role] || [];
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, index) => (
                <KPICard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  icon={kpi.icon}
                  color={kpi.color}
                />
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Chart title="Patient Flow" type="line" />
              <Chart title="Department Workload" type="bar" />
            </div>

            {/* Role-specific additional content */}
            {(role === 'doctor' || role === 'nurse') && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('myTasks', language)}
                </h3>
                <TaskBoard tasks={mockTasks} />
              </div>
            )}
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

  return <div className="space-y-6">{renderDashboardContent()}</div>;
}