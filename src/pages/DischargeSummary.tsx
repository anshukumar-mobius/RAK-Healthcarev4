import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Save, Edit, ArrowLeft, User, Plus, Calendar, Clock } from 'lucide-react';
import { useEMRStore } from '../stores/emrStore';
import dischargeSummaryData from '../data/dischargeSummary.json';

interface DischargeSummarySection {
  title: string;
  text: string;
}

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
  sections: DischargeSummarySection[];
  status: string;
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

export function DischargeSummary() {
  const { encounterId } = useParams<{ encounterId: string }>();
  const navigate = useNavigate();
  const { patients } = useEMRStore();
  
  const [summary, setSummary] = useState<DischargeSummary | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showNewSummary, setShowNewSummary] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [newSummary, setNewSummary] = useState({
    attendingPhysician: '',
    dischargingNurse: 'Current Nurse',
    dischargeDestination: 'Home',
    followUpInstructions: '',
    dietInstructions: '',
    activityRestrictions: '',
    sections: [
      { title: 'Admission', text: '' },
      { title: 'Hospital Course', text: '' },
      { title: 'Diagnostics', text: '' },
      { title: 'Discharge Medications', text: '' },
      { title: 'Follow-up', text: '' }
    ]
  });

  useEffect(() => {
    if (encounterId) {
      const foundSummary = dischargeSummaryData.find(
        (item: any) => item.encounterId === encounterId
      );
      
      if (foundSummary) {
        setSummary(foundSummary as DischargeSummary);
      }
    }
  }, [encounterId]);

  const handleEditSection = (sectionTitle: string, currentText: string) => {
    setEditingSection(sectionTitle);
    setEditText(currentText);
  };

  const handleSaveSection = () => {
    if (editingSection && summary) {
      setSummary(prev => {
        if (!prev) return null;
        return {
          ...prev,
          sections: prev.sections.map(section =>
            section.title === editingSection
              ? { ...section, text: editText }
              : section
          )
        };
      });
      setEditingSection(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditText('');
  };

  const handleCreateNewSummary = () => {
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    const newSummaryData: DischargeSummary = {
      id: `ds-${Date.now()}`,
      encounterId: `V${patient.id.padStart(3, '0')}`,
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
      sections: newSummary.sections,
      status: 'draft',
      dischargeDate: new Date().toISOString(),
      attendingPhysician: newSummary.attendingPhysician,
      dischargingNurse: newSummary.dischargingNurse,
      dischargeDestination: newSummary.dischargeDestination,
      followUpInstructions: newSummary.followUpInstructions,
      medications: [],
      dietInstructions: newSummary.dietInstructions,
      activityRestrictions: newSummary.activityRestrictions,
      warningSignsToReport: []
    };

    setSummary(newSummaryData);
    setShowNewSummary(false);
    setSelectedPatient('');
    setNewSummary({
      attendingPhysician: '',
      dischargingNurse: 'Current Nurse',
      dischargeDestination: 'Home',
      followUpInstructions: '',
      dietInstructions: '',
      activityRestrictions: '',
      sections: [
        { title: 'Admission', text: '' },
        { title: 'Hospital Course', text: '' },
        { title: 'Diagnostics', text: '' },
        { title: 'Discharge Medications', text: '' },
        { title: 'Follow-up', text: '' }
      ]
    });
  };

  const handleExport = () => {
    if (!summary) return;
    
    const dataStr = JSON.stringify(summary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `discharge-summary-${summary.encounterId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-rak-magenta-600 hover:text-rak-magenta-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className="w-8 h-8 mr-3 text-rak-magenta-600" />
              Discharge Summary
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {encounterId ? `Encounter ID: ${encounterId}` : 'Create or view discharge summaries'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewSummary(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Summary</span>
          </button>
          {summary && (
            <>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 bg-rak-beige-100 hover:bg-rak-beige-200 text-rak-beige-700 px-4 py-2 rounded-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors">
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
            </>
          )}
        </div>
      </div>

      {summary ? (
        <>
          {/* Patient Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-rak-magenta-100 dark:bg-rak-magenta-900/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-rak-magenta-600 dark:text-rak-magenta-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {summary.patient.name}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-gray-500">MRN:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{summary.patient.mrn}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">DOB:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">
                      {new Date(summary.patient.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white capitalize">{summary.patient.gender}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                      summary.status === 'final' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {summary.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Discharge Summary Sections */}
          <div className="space-y-4">
            {summary.sections.map((section, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-rak-pink-50 to-rak-beige-50 dark:from-rak-pink-900/10 dark:to-rak-beige-900/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {section.title}
                    </h3>
                    {editingSection !== section.title && (
                      <button
                        onClick={() => handleEditSection(section.title, section.text)}
                        className="flex items-center space-x-1 text-rak-magenta-600 hover:text-rak-magenta-700 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  {editingSection === section.title ? (
                    <div className="space-y-4">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={6}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSaveSection}
                          className="flex items-center space-x-1 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {section.text || <span className="text-gray-400 italic">No content added yet. Click Edit to add information.</span>}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Discharge Summary Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {encounterId ? `No discharge summary found for encounter ${encounterId}` : 'Select a patient to create a new discharge summary'}
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
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">New Discharge Summary</h3>
                  <p className="text-rak-magenta-100 mt-1">Create comprehensive discharge documentation</p>
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
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Patient Selection
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          {patient.firstName} {patient.lastName} - {patient.mrn}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedPatient && (
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">Selected Patient:</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {patients.find(p => p.id === selectedPatient)?.firstName} {patients.find(p => p.id === selectedPatient)?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          MRN: {patients.find(p => p.id === selectedPatient)?.mrn}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attending Physician *
                  </label>
                  <input
                    type="text"
                    value={newSummary.attendingPhysician}
                    onChange={(e) => setNewSummary(prev => ({ ...prev, attendingPhysician: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                    placeholder="Dr. Name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discharge Destination
                  </label>
                  <select
                    value={newSummary.dischargeDestination}
                    onChange={(e) => setNewSummary(prev => ({ ...prev, dischargeDestination: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  >
                    <option value="Home">Home</option>
                    <option value="Skilled Nursing Facility">Skilled Nursing Facility</option>
                    <option value="Rehabilitation Center">Rehabilitation Center</option>
                    <option value="Another Hospital">Another Hospital</option>
                    <option value="Hospice">Hospice</option>
                  </select>
                </div>
              </div>

              {/* Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Follow-up Instructions
                  </label>
                  <textarea
                    value={newSummary.followUpInstructions}
                    onChange={(e) => setNewSummary(prev => ({ ...prev, followUpInstructions: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                    placeholder="Follow-up appointment instructions..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Diet Instructions
                  </label>
                  <textarea
                    value={newSummary.dietInstructions}
                    onChange={(e) => setNewSummary(prev => ({ ...prev, dietInstructions: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                    placeholder="Dietary restrictions and recommendations..."
                  />
                </div>
              </div>

              {/* Activity Restrictions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activity Restrictions
                </label>
                <textarea
                  value={newSummary.activityRestrictions}
                  onChange={(e) => setNewSummary(prev => ({ ...prev, activityRestrictions: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                  placeholder="Activity limitations and restrictions..."
                />
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
                  <Save className="w-5 h-5" />
                  <span>Create Summary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}