import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Eye, Calendar, User, Activity, FlaskConical, Pill, Stethoscope, FileX, Clock, AlertCircle, CheckCircle, Bot } from 'lucide-react';
import { useEMRStore } from '../../stores/emrStore';
import { useAuthStore } from '../../stores/authStore';
import { Patient, EMREntry, ROLE_PERMISSIONS } from '../../types/emr';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';
import { EMREntryForm } from './EMREntryForm';
import { useAgentStore } from '../../stores/agentStore';

interface EMRViewerProps {
  patient: Patient;
}

const entryTypeIcons = {
  consultation: Stethoscope,
  nursing_note: Activity,
  diagnostic_result: FlaskConical,
  medication: Pill,
  vital_signs: Activity,
  procedure: FileText,
  discharge_summary: FileX
};

const entryTypeColors = {
  consultation: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200',
  nursing_note: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200',
  diagnostic_result: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200',
  medication: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200',
  vital_signs: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-200',
  procedure: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200',
  discharge_summary: 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border-gray-200'
};

export function EMRViewer({ patient }: EMRViewerProps) {
  const { language, isRTL } = useApp();
  const user = useAuthStore(state => state.user);
  const { getPatientEMREntries, deleteEMREntry } = useEMRStore();
  const { triggerAgentAction, addRecommendation } = useAgentStore();
  const [selectedEntry, setSelectedEntry] = useState<EMREntry | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EMREntry | null>(null);
  const [filterType, setFilterType] = useState<EMREntry['entryType'] | 'all'>('all');

  const emrEntries = getPatientEMREntries(patient.id);
  const permissions = user ? ROLE_PERMISSIONS[user.role] : null;

  const filteredEntries = filterType === 'all' 
    ? emrEntries 
    : emrEntries.filter(entry => entry.entryType === filterType);

  const canWrite = permissions?.canWrite && user;
  const canDelete = permissions?.canDelete;
  const canAmend = permissions?.canAmend;

  // AI Agent Integration for EMR
  const handleAIAnalysis = (entry: EMREntry) => {
    // Trigger clinical decision support agent
    triggerAgentAction('clinical-decision-support', 'Analyze EMR entry', {
      patientId: patient.id,
      entryId: entry.id,
      entryType: entry.entryType,
      content: entry.content
    });

    // Generate AI recommendation based on entry analysis
    if (entry.entryType === 'consultation' && entry.clinicalNotes) {
      addRecommendation({
        type: 'suggestion',
        priority: 'medium',
        title: 'Clinical Decision Support Available',
        description: `AI analysis suggests reviewing drug interactions and treatment protocols for ${patient.firstName} ${patient.lastName}`,
        action: 'Review clinical guidelines and medication interactions',
        confidence: 87,
        agentId: 'clinical-decision-support'
      });
    }
  };
  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this EMR entry?')) {
      deleteEMREntry(entryId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderVitalSigns = (data: any) => {
    if (!data) return null;
    
    return (
      <div className="bg-rak-beige-50 dark:bg-rak-beige-900/20 rounded-lg p-4 mt-3">
        <h5 className="font-medium text-rak-beige-800 dark:text-rak-beige-400 mb-3">Vital Signs</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.temperature && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Temperature:</span>
            <span className="ml-1 text-gray-900 dark:text-white">{data.temperature}°{data.temperatureUnit === 'fahrenheit' ? 'F' : 'C'}</span>
          </div>
        )}
        {data.bloodPressure && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">BP:</span>
            <span className="ml-1 text-gray-900 dark:text-white">{data.bloodPressure.systolic}/{data.bloodPressure.diastolic} mmHg</span>
          </div>
        )}
        {data.heartRate && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">HR:</span>
            <span className="ml-1 text-gray-900 dark:text-white">{data.heartRate} bpm</span>
          </div>
        )}
        {data.oxygenSaturation && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">SpO₂:</span>
            <span className="ml-1 text-gray-900 dark:text-white">{data.oxygenSaturation}%</span>
          </div>
        )}
        {data.weight && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Weight:</span>
            <span className="ml-1 text-gray-900 dark:text-white">{data.weight} {data.weightUnit || 'kg'}</span>
          </div>
        )}
        {data.height && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Height:</span>
            <span className="ml-1 text-gray-900 dark:text-white">{data.height} {data.heightUnit || 'cm'}</span>
          </div>
        )}
        {data.bmi && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">BMI:</span>
            <span className="ml-1 text-gray-900 dark:text-white">{data.bmi.toFixed(1)}</span>
          </div>
        )}
        {data.painScale !== undefined && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Pain Scale:</span>
            <span className="ml-1 text-gray-900 dark:text-white">{data.painScale}/10</span>
          </div>
        )}
        </div>
        {data.recordedBy && (
          <div className="mt-3 pt-3 border-t border-rak-beige-200 dark:border-rak-beige-800 text-xs text-rak-beige-700 dark:text-rak-beige-400">
            Recorded by: {data.recordedBy} • {data.recordedAt ? new Date(data.recordedAt).toLocaleString() : ''}
          </div>
        )}
      </div>
    );
  };

  const renderClinicalNotes = (entry: EMREntry) => {
    if (!entry.clinicalNotes) return null;
    
    const notes = entry.clinicalNotes;
    
    return (
      <div className="bg-rak-pink-50 dark:bg-rak-pink-900/20 rounded-lg p-4 mt-3">
        <h5 className="font-medium text-rak-magenta-800 dark:text-rak-magenta-400 mb-3">Clinical Notes</h5>
        <div className="space-y-3">
          {notes.chiefComplaint && (
            <div>
              <span className="font-medium text-rak-magenta-700 dark:text-rak-magenta-300">Chief Complaint:</span>
              <p className="text-gray-900 dark:text-white mt-1">{notes.chiefComplaint}</p>
            </div>
          )}
          
          {notes.historyOfPresentIllness && (
            <div>
              <span className="font-medium text-rak-magenta-700 dark:text-rak-magenta-300">History of Present Illness:</span>
              <p className="text-gray-900 dark:text-white mt-1">{notes.historyOfPresentIllness}</p>
            </div>
          )}
          
          {notes.reviewOfSystems && (
            <div>
              <span className="font-medium text-rak-magenta-700 dark:text-rak-magenta-300">Review of Systems:</span>
              <p className="text-gray-900 dark:text-white mt-1">{notes.reviewOfSystems}</p>
            </div>
          )}
          
          {notes.physicalExamination && (
            <div>
              <span className="font-medium text-rak-magenta-700 dark:text-rak-magenta-300">Physical Examination:</span>
              <p className="text-gray-900 dark:text-white mt-1">{notes.physicalExamination}</p>
            </div>
          )}
          
          {notes.assessment && (
            <div>
              <span className="font-medium text-rak-magenta-700 dark:text-rak-magenta-300">Assessment:</span>
              <p className="text-gray-900 dark:text-white mt-1">{notes.assessment}</p>
            </div>
          )}
          
          {notes.plan && (
            <div>
              <span className="font-medium text-rak-magenta-700 dark:text-rak-magenta-300">Plan:</span>
              <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-line">{notes.plan}</p>
            </div>
          )}
          
          {notes.differentialDiagnosis && notes.differentialDiagnosis.length > 0 && (
            <div>
              <span className="font-medium text-rak-magenta-700 dark:text-rak-magenta-300">Differential Diagnosis:</span>
              <ul className="list-disc list-inside text-gray-900 dark:text-white mt-1">
                {notes.differentialDiagnosis.map((diagnosis, index) => (
                  <li key={index}>{diagnosis}</li>
                ))}
              </ul>
            </div>
          )}
          
          {notes.icdCodes && notes.icdCodes.length > 0 && (
            <div>
              <span className="font-medium text-rak-magenta-700 dark:text-rak-magenta-300">ICD Codes:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {notes.icdCodes.map((code, index) => (
                  <span key={index} className="bg-rak-pink-100 dark:bg-rak-pink-900/40 text-rak-magenta-800 dark:text-rak-magenta-400 px-2 py-1 rounded text-sm font-mono">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-rak-white dark:bg-gray-800 rounded-lg border border-rak-beige-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-rak-beige-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Electronic Medical Record
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {patient.firstName} {patient.lastName} • MRN: {patient.mrn}
            </p>
          </div>
          
          {canWrite && (
            <button
              onClick={() => setShowEntryForm(true)}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Entry</span>
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by type:
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-1 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          >
            <option value="all">All Entries</option>
            <option value="consultation">Consultations</option>
            <option value="nursing_note">Nursing Notes</option>
            <option value="diagnostic_result">Diagnostic Results</option>
            <option value="medication">Medications</option>
            <option value="vital_signs">Vital Signs</option>
            <option value="procedure">Procedures</option>
            <option value="discharge_summary">Discharge Summary</option>
          </select>
        </div>
      </div>

      {/* EMR Entries */}
      <div className="p-6">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No EMR entries found for this patient
            </p>
            {canWrite && (
              <button
                onClick={() => setShowEntryForm(true)}
                className="mt-4 text-rak-magenta-600 hover:text-rak-magenta-700 font-medium"
              >
                Add the first entry
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => {
              const Icon = entryTypeIcons[entry.entryType];
              
              return (
                <div
                  key={entry.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${entryTypeColors[entry.entryType]}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm">{entry.title}</h4>
                        <p className="text-xs opacity-80">
                          {formatDate(entry.createdAt)} • {entry.entryType.replace('_', ' ')}
                          {entry.priority && (
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              entry.priority === 'emergent' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                              entry.priority === 'urgent' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            }`}>
                              {entry.priority}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.status === 'final' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        entry.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {entry.status}
                      </span>
                      
                      {entry.followUpRequired && (
                        <span className="text-orange-600 dark:text-orange-400" title="Follow-up required">
                          <Clock className="w-4 h-4" />
                        </span>
                      )}
                      
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {canAmend && entry.createdBy === user?.id && (
                        <button
                          onClick={() => setEditingEntry(entry)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      
                      {user?.role === 'doctor' && (
                        <button
                          onClick={() => handleAIAnalysis(entry)}
                          className="p-1 text-gray-400 hover:text-rak-magenta-600 transition-colors"
                          title="AI Analysis"
                        >
                          <Bot className="w-4 h-4" />
                        </button>
                      )}
                      
                      {canDelete && entry.createdBy === user?.id && (
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm opacity-90 mb-3">
                    {entry.content}
                  </div>
                  
                  {entry.entryType === 'vital_signs' && renderVitalSigns(entry.data)}
                  {entry.entryType === 'consultation' && renderClinicalNotes(entry)}
                  
                  {entry.followUpRequired && entry.followUpDate && (
                    <div className="bg-rak-warning-50 dark:bg-rak-warning-900/20 border border-rak-warning-200 dark:border-rak-warning-800 rounded-md p-3 mt-3">
                      <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Follow-up Required</span>
                      </div>
                      <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
                        Scheduled for: {formatDate(entry.followUpDate)}
                      </p>
                    </div>
                  )}
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-rak-white dark:bg-gray-800 rounded-full text-xs font-medium opacity-80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Entry Form Modal */}
      {(showEntryForm || editingEntry) && (
        <EMREntryForm
          patient={patient}
          entry={editingEntry}
          onClose={() => {
            setShowEntryForm(false);
            setEditingEntry(null);
          }}
          onSave={() => {
            setShowEntryForm(false);
            setEditingEntry(null);
          }}
        />
      )}

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-rak-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-rak-beige-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedEntry.title}
                </h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedEntry.content}</p>
                </div>
                
                {selectedEntry.entryType === 'consultation' && renderClinicalNotes(selectedEntry)}
                {selectedEntry.entryType === 'vital_signs' && renderVitalSigns(selectedEntry.data)}
                
                {selectedEntry.data && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Structured Data
                    </label>
                    <div className="bg-rak-beige-50 dark:bg-gray-900 p-3 rounded-md">
                      {Object.entries(selectedEntry.data).map(([key, value]) => (
                        <div key={key} className="mb-2 last:mb-0">
                          <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block font-medium text-gray-700 dark:text-gray-300">
                      Created
                    </label>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatDate(selectedEntry.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <p className="text-gray-600 dark:text-gray-400 capitalize">
                      {selectedEntry.status}
                    </p>
                  </div>
                  {selectedEntry.priority && (
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">
                        Priority
                      </label>
                      <p className="text-gray-600 dark:text-gray-400 capitalize">
                        {selectedEntry.priority}
                      </p>
                    </div>
                  )}
                  {selectedEntry.departmentId && (
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">
                        Department
                      </label>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedEntry.departmentId.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                  {selectedEntry.reviewedBy && (
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-300">
                        Reviewed By
                      </label>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedEntry.reviewedBy}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}