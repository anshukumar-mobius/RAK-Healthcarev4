import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Bot, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Activity,
  Stethoscope,
  FileText,
  Pill,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Play,
  Pause,
  Square,
  Loader
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { useEMRStore } from '../../stores/emrStore';
import { useAgentStore } from '../../stores/agentStore';
import { EMREntry } from '../../types/emr';
import { t } from '../../utils/translations';

// Import regenerator-runtime for async/await support
import 'regenerator-runtime/runtime';

interface EMREntryFormProps {
  patientId: string;
  entry?: EMREntry | null;
  onSave: (entry: Partial<EMREntry>) => void;
  onCancel: () => void;
}

export function EMREntryForm({ patientId, entry, onSave, onCancel }: EMREntryFormProps) {
  const { language, isRTL } = useApp();
  const { user } = useAuth();
  const { addEMREntry, updateEMREntry } = useEMRStore();
  const { triggerAgentAction, addRecommendation } = useAgentStore();

  const [formData, setFormData] = useState({
    entryType: 'consultation' as EMREntry['entryType'],
    title: '',
    content: '',
    chiefComplaint: '',
    historyOfPresentIllness: '',
    reviewOfSystems: '',
    physicalExamination: '',
    assessment: '',
    plan: '',
    icdCodes: '',
    medications: '',
    priority: 'routine' as 'routine' | 'urgent' | 'emergent',
    followUpRequired: false,
    followUpDate: '',
    tags: ''
  });

  const [isConversationRecording, setIsConversationRecording] = useState(false);
  const [conversationTranscript, setConversationTranscript] = useState('');
  const [isProcessingConversation, setIsProcessingConversation] = useState(false);

  // Mock AI suggestions data
  const mockAISuggestions = {
    icdCodes: [
      { code: 'I10', description: 'Essential hypertension', confidence: 94 },
      { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', confidence: 87 },
      { code: 'Z00.00', description: 'Encounter for general adult medical examination', confidence: 76 }
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', indication: 'Hypertension', confidence: 92 },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', indication: 'Type 2 Diabetes', confidence: 89 }
    ],
    differentialDx: [
      { diagnosis: 'Essential Hypertension', probability: 85, reasoning: 'Elevated BP readings, family history' },
      { diagnosis: 'Secondary Hypertension', probability: 15, reasoning: 'Consider if resistant to treatment' }
    ],
    clinicalGuidelines: [
      { title: '2017 ACC/AHA Hypertension Guidelines', recommendation: 'Target BP <130/80 for most adults', source: 'AHA/ACC' },
      { title: 'ADA Diabetes Guidelines', recommendation: 'HbA1c target <7% for most adults', source: 'ADA' }
    ],
    patientInsights: [
      { type: 'trend', title: 'Blood Pressure Trending Up', description: 'Last 3 visits show increasing systolic BP', priority: 'high' },
      { type: 'alert', title: 'Medication Adherence', description: 'Patient reported missing doses occasionally', priority: 'medium' }
    ],
    drugInteractions: [
      { drugs: ['Lisinopril', 'Potassium Supplements'], severity: 'moderate', description: 'May increase potassium levels' }
    ],
    allergyAlerts: [
      { medication: 'Penicillin', severity: 'severe', reaction: 'Anaphylaxis - documented allergy' }
    ]
  };

  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (entry) {
      setFormData({
        entryType: entry.entryType,
        title: entry.title,
        content: entry.content,
        chiefComplaint: entry.data?.chiefComplaint || '',
        historyOfPresentIllness: entry.data?.historyOfPresentIllness || '',
        reviewOfSystems: entry.data?.reviewOfSystems || '',
        physicalExamination: entry.data?.physicalExamination || '',
        assessment: entry.data?.assessment || '',
        plan: entry.data?.plan || '',
        icdCodes: entry.data?.icdCodes || '',
        medications: entry.data?.medications || '',
        priority: entry.priority || 'routine',
        followUpRequired: entry.followUpRequired || false,
        followUpDate: entry.followUpDate || '',
        tags: entry.tags?.join(', ') || ''
      });
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entryData = {
      patientId,
      entryType: formData.entryType,
      title: formData.title,
      content: formData.content,
      data: {
        chiefComplaint: formData.chiefComplaint,
        historyOfPresentIllness: formData.historyOfPresentIllness,
        reviewOfSystems: formData.reviewOfSystems,
        physicalExamination: formData.physicalExamination,
        assessment: formData.assessment,
        plan: formData.plan,
        icdCodes: formData.icdCodes,
        medications: formData.medications
      },
      clinicalNotes: {
        chiefComplaint: formData.chiefComplaint,
        historyOfPresentIllness: formData.historyOfPresentIllness,
        reviewOfSystems: formData.reviewOfSystems,
        physicalExamination: formData.physicalExamination,
        assessment: formData.assessment,
        plan: formData.plan,
        icdCodes: formData.icdCodes
      },
      priority: formData.priority,
      followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpDate,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdBy: user?.id || '',
      status: 'draft' as const
    };

    onSave(entryData);
  };

  const applySuggestion = (type: string, suggestion: any) => {
    const suggestionId = `${type}-${JSON.stringify(suggestion)}`;
    
    switch (type) {
      case 'icd':
        setFormData(prev => ({
          ...prev,
          icdCodes: prev.icdCodes ? `${prev.icdCodes}, ${suggestion.code}` : suggestion.code
        }));
        break;
      case 'medication':
        const medText = `${suggestion.name} ${suggestion.dosage} ${suggestion.frequency}`;
        setFormData(prev => ({
          ...prev,
          medications: prev.medications ? `${prev.medications}\n${medText}` : medText
        }));
        break;
      case 'diagnosis':
        setFormData(prev => ({
          ...prev,
          assessment: prev.assessment ? `${prev.assessment}\n${suggestion.diagnosis}` : suggestion.diagnosis
        }));
        break;
    }
    
    setAppliedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const startConversationRecording = () => {
    setIsConversationRecording(true);
    setConversationTranscript('');
    
    // Mock conversation recording
    setTimeout(() => {
      const mockConversation = `
Doctor: Good morning, how are you feeling today?
Patient: I've been having some chest pain and shortness of breath, especially when I walk upstairs.
Doctor: When did this start?
Patient: About two weeks ago. It's getting worse.
Doctor: Any family history of heart disease?
Patient: Yes, my father had a heart attack at 55.
Doctor: Let me examine you. Your blood pressure is 150/95, which is elevated.
Patient: Is that bad?
Doctor: We need to monitor it. I'm going to prescribe Lisinopril 10mg once daily and order some tests.
      `;
      setConversationTranscript(mockConversation);
    }, 3000);
  };

  const stopConversationRecording = () => {
    setIsConversationRecording(false);
    setIsProcessingConversation(true);
    
    // Mock AI processing
    setTimeout(() => {
      // Auto-populate fields based on conversation
      setFormData(prev => ({
        ...prev,
        chiefComplaint: 'Chest pain and shortness of breath on exertion',
        historyOfPresentIllness: 'Patient reports onset of chest pain and dyspnea on exertion approximately 2 weeks ago with progressive worsening. Symptoms occur primarily with physical activity such as climbing stairs.',
        reviewOfSystems: 'Cardiovascular: Positive for chest pain and dyspnea on exertion. Negative for palpitations, syncope, or orthopnea.',
        physicalExamination: 'Vital Signs: BP 150/95 mmHg. General: Alert and oriented, no acute distress.',
        assessment: 'Hypertension, newly diagnosed. Chest pain, likely related to elevated blood pressure. Family history of coronary artery disease.',
        plan: 'Start Lisinopril 10mg once daily. Order ECG and basic metabolic panel. Follow-up in 2 weeks to reassess blood pressure control.',
        icdCodes: 'I10',
        medications: 'Lisinopril 10mg once daily'
      }));
      
      setIsProcessingConversation(false);
      
      // Add recommendation
      addRecommendation({
        type: 'suggestion',
        priority: 'medium',
        title: 'Clinical Documentation Generated',
        description: 'AI Scribe has automatically populated clinical fields based on the doctor-patient conversation',
        confidence: 94,
        agentId: 'clinical-scribe-bot'
      });
    }, 5000);
  };

  const clearConversation = () => {
    setConversationTranscript('');
    setIsConversationRecording(false);
    setIsProcessingConversation(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {entry ? 'Edit EMR Entry' : 'New EMR Entry'}
              </h2>
              <p className="text-rak-magenta-100 mt-1">
                AI-Enhanced Clinical Documentation
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-rak-magenta-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Main Form */}
          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* AI Scribe Bot Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">AI Scribe Bot</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Record doctor-patient conversation for automatic documentation
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!isConversationRecording && !isProcessingConversation && (
                      <button
                        type="button"
                        onClick={startConversationRecording}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start Conversation</span>
                      </button>
                    )}
                    
                    {isConversationRecording && (
                      <button
                        type="button"
                        onClick={stopConversationRecording}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors animate-pulse"
                      >
                        <Square className="w-4 h-4" />
                        <span>Stop Recording</span>
                      </button>
                    )}
                    
                    {conversationTranscript && !isProcessingConversation && (
                      <button
                        type="button"
                        onClick={clearConversation}
                        className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Recording Status */}
                {isConversationRecording && (
                  <div className="flex items-center space-x-2 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700 dark:text-red-400 font-medium">Recording conversation...</span>
                  </div>
                )}
                
                {/* Processing Status */}
                {isProcessingConversation && (
                  <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-blue-700 dark:text-blue-400 font-medium">AI is analyzing conversation and generating clinical notes...</span>
                  </div>
                )}
                
                {/* Conversation Transcript */}
                {conversationTranscript && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Conversation Transcript:</h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {conversationTranscript}
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Entry Type
                  </label>
                  <select
                    value={formData.entryType}
                    onChange={(e) => setFormData(prev => ({ ...prev, entryType: e.target.value as any }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="consultation">Consultation</option>
                    <option value="nursing_note">Nursing Note</option>
                    <option value="diagnostic_result">Diagnostic Result</option>
                    <option value="medication">Medication</option>
                    <option value="vital_signs">Vital Signs</option>
                    <option value="procedure">Procedure</option>
                    <option value="discharge_summary">Discharge Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergent">Emergent</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors"
                  placeholder="Enter entry title..."
                  required
                />
              </div>

              {/* Chief Complaint */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Chief Complaint
                  </label>
                </div>
                <textarea
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Patient's primary concern or reason for visit..."
                />
              </div>

              {/* History of Present Illness */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    History of Present Illness
                  </label>
                </div>
                <textarea
                  value={formData.historyOfPresentIllness}
                  onChange={(e) => setFormData(prev => ({ ...prev, historyOfPresentIllness: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Detailed description of the patient's current illness..."
                />
              </div>

              {/* Review of Systems */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Review of Systems
                  </label>
                </div>
                <textarea
                  value={formData.reviewOfSystems}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewOfSystems: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Systematic review of body systems..."
                />
              </div>

              {/* Physical Examination */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Physical Examination
                  </label>
                </div>
                <textarea
                  value={formData.physicalExamination}
                  onChange={(e) => setFormData(prev => ({ ...prev, physicalExamination: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Physical examination findings..."
                />
              </div>

              {/* Assessment */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Assessment & Diagnosis
                  </label>
                </div>
                <textarea
                  value={formData.assessment}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessment: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Clinical assessment and diagnosis..."
                />
              </div>

              {/* Treatment Plan */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Treatment Plan
                  </label>
                </div>
                <textarea
                  value={formData.plan}
                  onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Treatment plan and recommendations..."
                />
              </div>

              {/* ICD Codes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    ICD Codes
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.icdCodes}
                  onChange={(e) => setFormData(prev => ({ ...prev, icdCodes: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors"
                  placeholder="ICD-10 codes (comma separated)..."
                />
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Medications
                  </label>
                </div>
                <textarea
                  value={formData.medications}
                  onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Prescribed medications with dosage and frequency..."
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Additional Notes
                  </label>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Additional clinical notes and observations..."
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tags
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors"
                  placeholder="Tags (comma separated)..."
                />
              </div>

              {/* Follow-up */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="followUpRequired"
                    checked={formData.followUpRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                    className="w-4 h-4 text-rak-magenta-600 bg-gray-100 border-gray-300 rounded focus:ring-rak-magenta-500 focus:ring-2"
                  />
                  <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Follow-up Required
                  </label>
                </div>

                {formData.followUpRequired && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 hover:from-rak-magenta-700 hover:to-rak-magenta-800 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <Save className="w-5 h-5" />
                  <span>{entry ? 'Update Entry' : 'Save Entry'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* AI Suggestions Panel */}
          <div className="w-96 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">AI Clinical Assistant</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Smart suggestions & insights</p>
                </div>
              </div>

              {/* ICD Code Suggestions */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">ICD Code Suggestions</h4>
                </div>
                <div className="space-y-2">
                  {mockAISuggestions.icdCodes.map((suggestion, index) => {
                    const suggestionId = `icd-${JSON.stringify(suggestion)}`;
                    const isApplied = appliedSuggestions.has(suggestionId);
                    
                    return (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {suggestion.code}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {suggestion.description}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                              {suggestion.confidence}%
                            </span>
                            {isApplied ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <button
                                onClick={() => applySuggestion('icd', suggestion)}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Medication Suggestions */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Pill className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Medication Suggestions</h4>
                </div>
                <div className="space-y-2">
                  {mockAISuggestions.medications.map((suggestion, index) => {
                    const suggestionId = `medication-${JSON.stringify(suggestion)}`;
                    const isApplied = appliedSuggestions.has(suggestionId);
                    
                    return (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {suggestion.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {suggestion.dosage} - {suggestion.frequency}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              For: {suggestion.indication}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                              {suggestion.confidence}%
                            </span>
                            {isApplied ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <button
                                onClick={() => applySuggestion('medication', suggestion)}
                                className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Differential Diagnosis */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Differential Diagnosis</h4>
                </div>
                <div className="space-y-2">
                  {mockAISuggestions.differentialDx.map((suggestion, index) => {
                    const suggestionId = `diagnosis-${JSON.stringify(suggestion)}`;
                    const isApplied = appliedSuggestions.has(suggestionId);
                    
                    return (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {suggestion.diagnosis}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {suggestion.reasoning}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                              {suggestion.probability}%
                            </span>
                            {isApplied ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <button
                                onClick={() => applySuggestion('diagnosis', suggestion)}
                                className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded transition-colors"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Guidelines */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Clinical Guidelines</h4>
                </div>
                <div className="space-y-2">
                  {mockAISuggestions.clinicalGuidelines.map((guideline, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        {guideline.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {guideline.recommendation}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">
                        Source: {guideline.source}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Insights */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Patient Insights</h4>
                </div>
                <div className="space-y-2">
                  {mockAISuggestions.patientInsights.map((insight, index) => (
                    <div key={index} className={`rounded-lg p-3 border ${
                      insight.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                      insight.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                      'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {insight.type === 'trend' ? <TrendingUp className="w-4 h-4 text-teal-600 mt-0.5" /> : 
                         <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />}
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {insight.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {insight.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drug Interactions */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="w-4 h-4 text-red-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Drug Interactions</h4>
                </div>
                <div className="space-y-2">
                  {mockAISuggestions.drugInteractions.map((interaction, index) => (
                    <div key={index} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-red-800 dark:text-red-400">
                            {interaction.drugs.join(' + ')}
                          </div>
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {interaction.description}
                          </div>
                          <div className="text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-300 px-2 py-1 rounded mt-2 inline-block">
                            {interaction.severity} severity
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergy Alerts */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Allergy Alerts</h4>
                </div>
                <div className="space-y-2">
                  {mockAISuggestions.allergyAlerts.map((alert, index) => (
                    <div key={index} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-orange-800 dark:text-orange-400">
                            {alert.medication}
                          </div>
                          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            {alert.reaction}
                          </div>
                          <div className="text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-300 px-2 py-1 rounded mt-2 inline-block">
                            {alert.severity} allergy
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}