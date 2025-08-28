import React, { useState } from 'react';
import { useEMRStore } from '../stores/emrStore';
import { useApp } from '../contexts/AppContext';
import { DataTable } from '../components/dashboard/DataTable';
import { PatientDetailView } from '../components/emr/PatientDetailView';
import { EMREntryForm } from '../components/emr/EMREntryForm';
import { PatientTimeline } from '../components/patients/PatientTimeline';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Calendar,
  Activity,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Patient, EMREntry } from '../types/emr';
import { t } from '../utils/translations';

export function Patients() {
  const { language, isRTL } = useApp();
  const { patients, searchPatients, getPatientEMREntries } = useEMRStore();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showEMRForm, setShowEMRForm] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  const filteredPatients = searchTerm ? searchPatients(searchTerm) : patients;

  const patientColumns = [
    { key: 'mrn', label: 'MRN', sortable: true, width: 'w-32' },
    { key: 'fullName', label: 'Patient Name', sortable: true },
    { key: 'dateOfBirth', label: 'Date of Birth', sortable: true },
    { key: 'gender', label: 'Gender', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'lastVisit', label: 'Last Visit', sortable: true }
  ];

  const tableData = filteredPatients.map(patient => ({
    id: patient.id,
    mrn: patient.mrn,
    fullName: `${patient.firstName} ${patient.lastName}`,
    dateOfBirth: new Date(patient.dateOfBirth).toLocaleDateString(),
    gender: patient.gender,
    phone: patient.phone,
    lastVisit: new Date(patient.updatedAt).toLocaleDateString(),
    patient: patient
  }));

  const handlePatientSelect = (item: any) => {
    setSelectedPatient(item.patient);
  };

  const handleNewEMREntry = () => {
    if (selectedPatient) {
      setShowEMRForm(true);
    }
  };

  const handleSaveEMREntry = (entryData: Partial<EMREntry>) => {
    // This would typically save to the store
    console.log('Saving EMR entry:', entryData);
    setShowEMRForm(false);
  };

  const generateTimelineEvents = (patient: Patient) => {
    const emrEntries = getPatientEMREntries(patient.id);
    
    return emrEntries.map(entry => ({
      id: entry.id,
      type: entry.entryType === 'consultation' ? 'appointment' as const : 
            entry.entryType === 'diagnostic_result' ? 'test' as const :
            entry.entryType === 'medication' ? 'medication' as const :
            entry.entryType === 'vital_signs' ? 'vital' as const : 'diagnosis' as const,
      title: entry.title,
      description: entry.content,
      date: new Date(entry.createdAt).toLocaleDateString(),
      time: new Date(entry.createdAt).toLocaleTimeString(),
      doctor: 'Dr. Ahmed Al Rashid', // This would come from the entry data
      status: entry.status === 'final' ? 'completed' as const : 'pending' as const,
      details: entry.data
    }));
  };

  if (showTimeline && selectedPatient) {
    const timelineEvents = generateTimelineEvents(selectedPatient);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowTimeline(false)}
            className="flex items-center space-x-2 text-rak-magenta-600 hover:text-rak-magenta-700"
          >
            ← Back to Patient Details
          </button>
        </div>
        
        <PatientTimeline 
          events={timelineEvents}
          patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
        />
      </div>
    );
  }

  if (selectedPatient) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedPatient(null)}
            className="flex items-center space-x-2 text-rak-magenta-600 hover:text-rak-magenta-700"
          >
            ← Back to Patients List
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowTimeline(true)}
              className="flex items-center space-x-2 bg-rak-beige-100 hover:bg-rak-beige-200 text-rak-beige-700 px-4 py-2 rounded-md transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>View Timeline</span>
            </button>
            <button
              onClick={handleNewEMREntry}
              className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>New EMR Entry</span>
            </button>
          </div>
        </div>

        {/* Patient Detail View */}
        <PatientDetailView 
          patient={selectedPatient}
          onEdit={() => console.log('Edit patient')}
        />

        {/* EMR Form Modal */}
        {showEMRForm && (
          <EMREntryForm
            patientId={selectedPatient.id}
            onSave={handleSaveEMREntry}
            onCancel={() => setShowEMRForm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="w-8 h-8 mr-3 text-rak-magenta-600" />
            {t('patients', language)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage patient records and medical information
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Cards
            </button>
          </div>
          
          <button className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Patient</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
            <input
              type="text"
              placeholder="Search patients by name, MRN, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent w-full`}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Patients Display */}
      {viewMode === 'list' ? (
        <DataTable
          title={`${filteredPatients.length} Patients`}
          columns={patientColumns}
          data={tableData}
          searchable={false}
          filterable={false}
          exportable={true}
          actions={true}
          onView={handlePatientSelect}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-rak-magenta-100 dark:bg-rak-magenta-900/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-rak-magenta-600 dark:text-rak-magenta-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      MRN: {patient.mrn}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  patient.chronicConditions.length > 0
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {patient.chronicConditions.length > 0 ? 'Chronic' : 'Healthy'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(patient.dateOfBirth).toLocaleDateString()} ({patient.gender})</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{patient.phone}</span>
                </div>
                {patient.email && (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{patient.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{patient.city}, {patient.emirate}</span>
                </div>
              </div>
              
              {patient.allergies.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Allergies:</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.slice(0, 3).map((allergy, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded-full"
                      >
                        {allergy}
                      </span>
                    ))}
                    {patient.allergies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        +{patient.allergies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}