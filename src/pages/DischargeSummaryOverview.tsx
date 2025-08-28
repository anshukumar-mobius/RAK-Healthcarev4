import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Plus, 
  Search, 
  Filter,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  Edit,
  Download,
  Save
} from 'lucide-react';
import { useEMRStore } from '../stores/emrStore';
import { useAuth } from '../hooks/useAuth';
import dischargeSummaryData from '../data/dischargeSummary.json';

interface DischargeSummary {
  id: string;
  encounterId: string;
  patient: {
    id: string;
    name: string;
    mrn: string;
    dateOfBirth: string;
    gender: string;
    room?: string;
    bed?: string;
    admissionDate: string;
    diagnosis: string;
  };
  sections: Array<{
    title: string;
    text: string;
  }>;
  status: 'draft' | 'final' | 'pending';
  dischargeDate: string;
  attendingPhysician: string;
  dischargingNurse: string;
  dischargeDestination: string;
  followUpInstructions: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    instructions: string;
  }>;
  dietInstructions: string;
  activityRestrictions: string;
  warningSignsToReport: string[];
}

export function DischargeSummaryOverview() {
  const navigate = useNavigate();
  const { patients } = useEMRStore();
  const { user } = useAuth();
  
  const [summaries, setSummaries] = useState<DischargeSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'final' | 'pending'>('all');
  const [showNewSummary, setShowNewSummary] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');

  useEffect(() => {
    // Load discharge summaries and enrich with patient data
    const allSummaries = dischargeSummaryData as any[];
    
    // Enrich summaries with patient data from the store
    const enrichedSummaries = allSummaries.map(summary => {
      const patient = patients.find(p => p.id === summary.patient?.id);
      if (patient) {
        return {
          ...summary,
          patient: {
            id: patient.id,
            name: `${patient.firstName} ${patient.lastName}`,
            mrn: patient.mrn,
            dateOfBirth: patient.dateOfBirth,
            gender: patient.gender,
            room: 'A-101',
            bed: '1',
            admissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            diagnosis: patient.chronicConditions[0] || 'General Care'
          },
          dischargingNurse: user?.name || 'Current Nurse',
          dischargeDestination: 'Home',
          followUpInstructions: 'Follow up with primary care physician in 1-2 weeks',
          medications: [],
          dietInstructions: 'Regular diet as tolerated',
          activityRestrictions: 'No restrictions',
          warningSignsToReport: []
        };
      }
      return {
        ...summary,
        patient: {
          id: summary.patient?.id || '',
          name: summary.patient?.name || 'Unknown Patient',
          mrn: summary.patient?.mrn || 'N/A',
          dateOfBirth: summary.patient?.dateOfBirth || '1990-01-01',
          gender: summary.patient?.gender || 'Unknown',
          room: 'N/A',
          bed: 'N/A',
          admissionDate: new Date().toISOString(),
          diagnosis: 'Not specified'
        },
        dischargingNurse: user?.name || 'Current Nurse',
        dischargeDestination: 'Home',
        followUpInstructions: 'Follow up as needed',
        medications: [],
        dietInstructions: 'Regular diet',
        activityRestrictions: 'No restrictions',
        warningSignsToReport: []
      };
    });
    
    setSummaries(enrichedSummaries);
  }, [user, patients]);

  const filteredSummaries = summaries.filter(summary => {
    const matchesSearch = summary.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summary.patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summary.patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || summary.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleCreateNewSummary = () => {
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    // Navigate to the discharge form with the selected patient
    navigate(`/discharge-form?patientId=${patient.id}`);
  };

  const handleViewSummary = (summary: DischargeSummary) => {
    navigate(`/discharge-summary/${summary.encounterId}`);
  };

  const handleEditSummary = (summary: DischargeSummary) => {
    navigate(`/discharge-summary/${summary.encounterId}?edit=true`);
  };

  // Statistics
  const stats = {
    totalSummaries: summaries.length,
    draftSummaries: summaries.filter(s => s.status === 'draft').length,
    finalSummaries: summaries.filter(s => s.status === 'final').length,
    pendingSummaries: summaries.filter(s => s.status === 'pending').length,
    todaySummaries: summaries.filter(s => {
      const summaryDate = new Date(s.dischargeDate).toDateString();
      const today = new Date().toDateString();
      return summaryDate === today;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="w-8 h-8 mr-3 text-rak-magenta-600" />
            My Discharge Summaries
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage discharge summaries for all assigned patients
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewSummary(true)}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Discharge</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Summaries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSummaries}</p>
            </div>
            <FileText className="w-8 h-8 text-rak-magenta-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Discharges</p>
              <p className="text-2xl font-bold text-blue-600">{stats.todaySummaries}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Final Summaries</p>
              <p className="text-2xl font-bold text-green-600">{stats.finalSummaries}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Draft Summaries</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draftSummaries}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingSummaries}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, MRN, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 w-80"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="final">Final</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredSummaries.length} of {summaries.length} summaries
          </div>
        </div>
      </div>

      {/* Summaries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSummaries.map((summary) => {
          const completedSections = summary.sections.filter(s => s.text && s.text.trim().length > 0).length;
          const totalSections = summary.sections.length;
          const completionPercentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
          
          return (
            <div
              key={summary.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Patient Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-rak-pink-50 to-rak-beige-50 dark:from-rak-pink-900/10 dark:to-rak-beige-900/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-rak-magenta-100 dark:bg-rak-magenta-900/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-rak-magenta-600 dark:text-rak-magenta-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {summary.patient.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>MRN: {summary.patient.mrn}</span>
                        <span>{calculateAge(summary.patient.dateOfBirth)}y</span>
                        <span className="capitalize">{summary.patient.gender}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      summary.status === 'final' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                      summary.status === 'draft' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                      'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                    }`}>
                      {summary.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Discharge: {new Date(summary.dischargeDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{summary.attendingPhysician}</span>
                  </div>
                </div>
              </div>

              {/* Summary Content */}
              <div className="p-4">
                {/* Completion Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Progress</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        completionPercentage < 30 ? 'bg-red-500' :
                        completionPercentage < 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sections Summary */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1 text-rak-magenta-600" />
                    Sections ({totalSections})
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                      <div className="font-bold text-green-700 dark:text-green-400">{completedSections}</div>
                      <div className="text-green-600 dark:text-green-400">Completed</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/20 p-2 rounded border border-gray-200 dark:border-gray-800">
                      <div className="font-bold text-gray-700 dark:text-gray-400">{totalSections - completedSections}</div>
                      <div className="text-gray-600 dark:text-gray-400">Remaining</div>
                    </div>
                  </div>
                </div>

                {/* Primary Diagnosis */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Primary Diagnosis</h4>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <span className="text-sm text-blue-800 dark:text-blue-400 font-medium">
                      {summary.patient.diagnosis}
                    </span>
                  </div>
                </div>

                {/* Discharge Destination */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Discharge Destination</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {summary.dischargeDestination}
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Discharge: {new Date(summary.dischargeDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{summary.dischargingNurse}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewSummary(summary)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Summary</span>
                  </button>
                  <button
                    onClick={() => handleEditSummary(summary)}
                    className="flex items-center justify-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSummaries.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Discharge Summaries Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all'
              ? 'No summaries match your current filters' 
              : 'You have no discharge summaries yet'}
          </p>
          <button
            onClick={() => setShowNewSummary(true)}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-6 py-3 rounded-lg transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Summary</span>
          </button>
        </div>
      )}

      {/* New Summary Modal */}
      {showNewSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Create New Discharge Summary</h3>
                  <p className="text-rak-magenta-100 mt-1">Select a patient to create their discharge documentation</p>
                </div>
                <button
                  onClick={() => setShowNewSummary(false)}
                  className="p-2 hover:bg-rak-magenta-800 rounded-lg transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Patient Selection */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Patient Selection
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Patient *
                    </label>
                    <select
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Choose a patient...</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} - {patient.mrn} ({calculateAge(patient.dateOfBirth)}y, {patient.gender})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedPatient && (
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white mb-2">Selected Patient:</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Name:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {patients.find(p => p.id === selectedPatient)?.firstName} {patients.find(p => p.id === selectedPatient)?.lastName}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">MRN:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {patients.find(p => p.id === selectedPatient)?.mrn}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Age:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {calculateAge(patients.find(p => p.id === selectedPatient)?.dateOfBirth || '')} years
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Conditions:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {patients.find(p => p.id === selectedPatient)?.chronicConditions.join(', ') || 'None'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowNewSummary(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewSummary}
                  disabled={!selectedPatient}
                  className="flex items-center space-x-2 bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 hover:from-rak-magenta-700 hover:to-rak-magenta-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-5 h-5" />
                  <span>Create Discharge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}