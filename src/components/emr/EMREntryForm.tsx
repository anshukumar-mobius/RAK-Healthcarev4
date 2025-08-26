import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  Pause, 
  Play, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  Search,
  Clock,
  User,
  Pill,
  Activity,
  FileText,
  Zap,
  Shield,
  TrendingUp,
  Info
} from 'lucide-react';
import { useEMRStore } from '../../stores/emrStore';
import { useAuthStore } from '../../stores/authStore';
import { useAgentStore } from '../../stores/agentStore';
import { Patient, EMREntry, ROLE_PERMISSIONS } from '../../types/emr';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Import regenerator-runtime for async/await support
import 'regenerator-runtime/runtime';

interface EMREntryFormProps {
  patient: Patient;
  entry?: EMREntry | null;
  onClose: () => void;
  onSave: () => void;
}

// Mock AI suggestions data
const MOCK_ICD_CODES = [
  { code: 'I10', description: 'Essential (primary) hypertension', confidence: 95 },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', confidence: 92 },
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified', confidence: 88 },
  { code: 'M79.3', description: 'Panniculitis, unspecified', confidence: 85 },
  { code: 'R50.9', description: 'Fever, unspecified', confidence: 82 }
];

const MOCK_MEDICATIONS = [
  { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', indication: 'Hypertension', confidence: 94 },
  { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', indication: 'Diabetes Type 2', confidence: 91 },
  { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', indication: 'Bacterial infection', confidence: 87 },
  { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', indication: 'Pain/inflammation', confidence: 85 }
];

const MOCK_DIFFERENTIAL_DIAGNOSES = [
  { diagnosis: 'Viral upper respiratory infection', probability: 85, reasoning: 'Based on symptoms and seasonal patterns' },
  { diagnosis: 'Bacterial sinusitis', probability: 65, reasoning: 'Prolonged symptoms with purulent discharge' },
  { diagnosis: 'Allergic rhinitis', probability: 45, reasoning: 'Patient history of seasonal allergies' },
  { diagnosis: 'COVID-19', probability: 25, reasoning: 'Current pandemic considerations' }
];

const MOCK_CLINICAL_GUIDELINES = [
  { title: 'Hypertension Management Guidelines', recommendation: 'Consider ACE inhibitor as first-line therapy', source: 'AHA/ACC 2024' },
  { title: 'Diabetes Care Standards', recommendation: 'HbA1c target <7% for most adults', source: 'ADA 2024' },
  { title: 'Antibiotic Stewardship', recommendation: 'Avoid antibiotics for viral infections', source: 'CDC Guidelines' }
];

const MOCK_DRUG_INTERACTIONS = [
  { drug1: 'Warfarin', drug2: 'Aspirin', severity: 'High', description: 'Increased bleeding risk' },
  { drug1: 'Lisinopril', drug2: 'Potassium supplements', severity: 'Medium', description: 'Risk of hyperkalemia' }
];

const MOCK_PATIENT_INSIGHTS = [
  { type: 'trend', title: 'Blood Pressure Trending Up', description: 'Last 3 readings show increasing trend', priority: 'high' },
  { type: 'allergy', title: 'Penicillin Allergy Alert', description: 'Patient has documented penicillin allergy', priority: 'critical' },
  { type: 'medication', title: 'Medication Adherence', description: '85% adherence rate based on refill history', priority: 'medium' },
  { type: 'followup', title: 'Overdue Lab Work', description: 'HbA1c due for diabetic monitoring', priority: 'high' }
];

export function EMREntryForm({ patient, entry, onClose, onSave }: EMREntryFormProps) {
  const user = useAuthStore(state => state.user);
  const { addEMREntry, updateEMREntry } = useEMRStore();
  const { addRecommendation } = useAgentStore();
  
  // Speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  const [isRecording, setIsRecording] = useState(false);
  const [activeField, setActiveField] = useState<string>('');
  const [recordingField, setRecordingField] = useState<string>('');
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [selectedIcdCodes, setSelectedIcdCodes] = useState<string[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    entryType: 'consultation' as EMREntry['entryType'],
    title: '',
    content: '',
    status: 'draft' as EMREntry['status'],
    tags: '',
    // Clinical fields
    chiefComplaint: '',
    historyOfPresentIllness: '',
    reviewOfSystems: '',
    physicalExamination: '',
    assessment: '',
    plan: '',
    differentialDiagnosis: '',
    // Vital signs specific fields
    temperature: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    painScale: '',
    // Additional clinical fields
    allergies: '',
    currentMedications: '',
    socialHistory: '',
    familyHistory: '',
    followUpInstructions: '',
    clinicalNotes: ''
  });

  const permissions = user ? ROLE_PERMISSIONS[user.role] : null;
  const allowedEntryTypes = permissions?.entryTypes || [];

  useEffect(() => {
    if (entry) {
      setFormData({
        entryType: entry.entryType,
        title: entry.title,
        content: entry.content,
        status: entry.status,
        tags: entry.tags?.join(', ') || '',
        chiefComplaint: entry.clinicalNotes?.chiefComplaint || '',
        historyOfPresentIllness: entry.clinicalNotes?.historyOfPresentIllness || '',
        reviewOfSystems: entry.clinicalNotes?.reviewOfSystems || '',
        physicalExamination: entry.clinicalNotes?.physicalExamination || '',
        assessment: entry.clinicalNotes?.assessment || '',
        plan: entry.clinicalNotes?.plan || '',
        differentialDiagnosis: entry.clinicalNotes?.differentialDiagnosis?.join(', ') || '',
        // Extract vital signs data if present
        temperature: entry.data?.temperature?.toString() || '',
        systolic: entry.data?.bloodPressure?.systolic?.toString() || '',
        diastolic: entry.data?.bloodPressure?.diastolic?.toString() || '',
        heartRate: entry.data?.heartRate?.toString() || '',
        respiratoryRate: entry.data?.respiratoryRate?.toString() || '',
        oxygenSaturation: entry.data?.oxygenSaturation?.toString() || '',
        weight: entry.data?.weight?.toString() || '',
        height: entry.data?.height?.toString() || '',
        painScale: entry.data?.painScale?.toString() || '',
        allergies: '',
        currentMedications: '',
        socialHistory: '',
        familyHistory: '',
        followUpInstructions: '',
        clinicalNotes: ''
      });
    }
  }, [entry]);

  // Handle speech recognition transcript
  useEffect(() => {
    if (transcript && activeField && isRecording) {
      setFormData(prev => ({
        ...prev,
        [activeField]: prev[activeField as keyof typeof prev] + ' ' + transcript
      }));
    }
  }, [transcript, activeField, isRecording]);

  // Voice input handlers
  const startListening = (fieldName: string) => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (!isMicrophoneAvailable) {
      alert('Microphone access is required for voice input. Please allow microphone permissions.');
      return;
    }

    setActiveField(fieldName);
    setRecordingField(fieldName);
    setIsRecording(true);
    resetTranscript();
    
    SpeechRecognition.startListening({ 
      continuous: true,
      language: 'en-US'
    });
  };

  const stopListening = () => {
    setIsRecording(false);
    setActiveField('');
    setRecordingField('');
    SpeechRecognition.stopListening();
  };

  const clearTranscript = (fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    resetTranscript();
  };

  // AI suggestion handlers
  const applyIcdCode = (code: any) => {
    if (!selectedIcdCodes.includes(code.code)) {
      setSelectedIcdCodes([...selectedIcdCodes, code.code]);
      setFormData(prev => ({
        ...prev,
        assessment: prev.assessment + (prev.assessment ? ', ' : '') + `${code.code} - ${code.description}`
      }));
    }
  };

  const applyMedication = (medication: any) => {
    if (!selectedMedications.find(m => m.name === medication.name)) {
      setSelectedMedications([...selectedMedications, medication]);
      setFormData(prev => ({
        ...prev,
        plan: prev.plan + (prev.plan ? '\n' : '') + `${medication.name} ${medication.dosage} ${medication.frequency} for ${medication.indication}`
      }));
    }
  };

  const applyDifferentialDiagnosis = (diagnosis: any) => {
    setFormData(prev => ({
      ...prev,
      differentialDiagnosis: prev.differentialDiagnosis + (prev.differentialDiagnosis ? ', ' : '') + diagnosis.diagnosis
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const entryData: Omit<EMREntry, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId: patient.id,
      entryType: formData.entryType,
      title: formData.title,
      content: formData.content,
      status: formData.status,
      createdBy: user.id,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
      clinicalNotes: {
        chiefComplaint: formData.chiefComplaint,
        historyOfPresentIllness: formData.historyOfPresentIllness,
        reviewOfSystems: formData.reviewOfSystems,
        physicalExamination: formData.physicalExamination,
        assessment: formData.assessment,
        plan: formData.plan,
        differentialDiagnosis: formData.differentialDiagnosis ? formData.differentialDiagnosis.split(',').map(d => d.trim()) : undefined,
        icdCodes: selectedIcdCodes
      }
    };

    // Add structured data based on entry type
    if (formData.entryType === 'vital_signs') {
      entryData.data = {
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        bloodPressure: formData.systolic && formData.diastolic ? {
          systolic: parseInt(formData.systolic),
          diastolic: parseInt(formData.diastolic)
        } : undefined,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
        respiratoryRate: formData.respiratoryRate ? parseInt(formData.respiratoryRate) : undefined,
        oxygenSaturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        painScale: formData.painScale ? parseInt(formData.painScale) : undefined,
        bmi: formData.weight && formData.height ? 
          parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2) : undefined
      };
    }

    if (entry) {
      updateEMREntry(entry.id, entryData);
    } else {
      addEMREntry(entryData);
    }

    // Add AI recommendation for clinical decision support
    addRecommendation({
      type: 'suggestion',
      priority: 'medium',
      title: 'EMR Entry Created with AI Assistance',
      description: `New ${formData.entryType} entry created for ${patient.firstName} ${patient.lastName} with AI-powered suggestions`,
      confidence: 92,
      agentId: 'clinical-decision-support'
    });

    onSave();
  };

  // Voice input button component
  const VoiceInputButton = ({ fieldName, label }: { fieldName: string; label: string }) => (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {isRecording && recordingField === fieldName ? (
          <button
            type="button"
            onClick={stopListening}
            className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors animate-pulse"
          >
            <MicOff className="w-4 h-4" />
            <span>Stop Recording</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => startListening(fieldName)}
            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
            disabled={isRecording}
          >
            <Mic className="w-4 h-4" />
            <span>Voice Input</span>
          </button>
        )}
        
        {formData[fieldName as keyof typeof formData] && (
          <button
            type="button"
            onClick={() => clearTranscript(fieldName)}
            className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded-md text-sm transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      
      {isRecording && recordingField === fieldName && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Listening... Speak clearly</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-bold">
                  {entry ? 'Edit EMR Entry' : 'AI-Powered EMR Entry'}
                </h3>
                <p className="text-rak-magenta-100">
                  Patient: {patient.firstName} {patient.lastName} • MRN: {patient.mrn}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-rak-magenta-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Main Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Entry Type and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Entry Type *
                  </label>
                  <select
                    value={formData.entryType}
                    onChange={(e) => setFormData(prev => ({ ...prev, entryType: e.target.value as EMREntry['entryType'] }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                    required
                  >
                    {allowedEntryTypes.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as EMREntry['status'] }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="final">Final</option>
                    <option value="amended">Amended</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <VoiceInputButton fieldName="title" label="Title" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 mt-2"
                  placeholder="Enter entry title"
                  required
                />
              </div>

              {/* Clinical Fields */}
              {formData.entryType === 'consultation' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Clinical Documentation
                  </h4>

                  {/* Chief Complaint */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chief Complaint
                    </label>
                    <VoiceInputButton fieldName="chiefComplaint" label="Chief Complaint" />
                    <textarea
                      value={formData.chiefComplaint}
                      onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                      rows={2}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 mt-2"
                      placeholder="Patient's primary concern or reason for visit"
                    />
                  </div>

                  {/* History of Present Illness */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      History of Present Illness
                    </label>
                    <VoiceInputButton fieldName="historyOfPresentIllness" label="HPI" />
                    <textarea
                      value={formData.historyOfPresentIllness}
                      onChange={(e) => setFormData(prev => ({ ...prev, historyOfPresentIllness: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 mt-2"
                      placeholder="Detailed description of the current illness"
                    />
                  </div>

                  {/* Review of Systems */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Review of Systems
                    </label>
                    <VoiceInputButton fieldName="reviewOfSystems" label="ROS" />
                    <textarea
                      value={formData.reviewOfSystems}
                      onChange={(e) => setFormData(prev => ({ ...prev, reviewOfSystems: e.target.value }))}
                      rows={3}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 mt-2"
                      placeholder="Systematic review of body systems"
                    />
                  </div>

                  {/* Physical Examination */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Physical Examination
                    </label>
                    <VoiceInputButton fieldName="physicalExamination" label="Physical Exam" />
                    <textarea
                      value={formData.physicalExamination}
                      onChange={(e) => setFormData(prev => ({ ...prev, physicalExamination: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 mt-2"
                      placeholder="Physical examination findings"
                    />
                  </div>

                  {/* Assessment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assessment & Diagnosis
                    </label>
                    <VoiceInputButton fieldName="assessment" label="Assessment" />
                    <textarea
                      value={formData.assessment}
                      onChange={(e) => setFormData(prev => ({ ...prev, assessment: e.target.value }))}
                      rows={3}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 mt-2"
                      placeholder="Clinical assessment and primary diagnosis"
                    />
                  </div>

                  {/* Plan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Treatment Plan
                    </label>
                    <VoiceInputButton fieldName="plan" label="Plan" />
                    <textarea
                      value={formData.plan}
                      onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 mt-2"
                      placeholder="Treatment plan, medications, follow-up instructions"
                    />
                  </div>

                  {/* Differential Diagnosis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Differential Diagnosis
                    </label>
                    <VoiceInputButton fieldName="differentialDiagnosis" label="Differential" />
                    <textarea
                      value={formData.differentialDiagnosis}
                      onChange={(e) => setFormData(prev => ({ ...prev, differentialDiagnosis: e.target.value }))}
                      rows={2}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 mt-2"
                      placeholder="Alternative diagnoses to consider"
                    />
                  </div>
                </div>
              )}

              {/* Vital Signs Fields */}
              {formData.entryType === 'vital_signs' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Vital Signs</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Temperature (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                        placeholder="36.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Systolic BP
                      </label>
                      <input
                        type="number"
                        value={formData.systolic}
                        onChange={(e) => setFormData(prev => ({ ...prev, systolic: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                        placeholder="120"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Diastolic BP
                      </label>
                      <input
                        type="number"
                        value={formData.diastolic}
                        onChange={(e) => setFormData(prev => ({ ...prev, diastolic: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                        placeholder="80"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Heart Rate (bpm)
                      </label>
                      <input
                        type="number"
                        value={formData.heartRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, heartRate: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                        placeholder="72"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Respiratory Rate
                      </label>
                      <input
                        type="number"
                        value={formData.respiratoryRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                        placeholder="16"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Oxygen Saturation (%)
                      </label>
                      <input
                        type="number"
                        value={formData.oxygenSaturation}
                        onChange={(e) => setFormData(prev => ({ ...prev, oxygenSaturation: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                        placeholder="98"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* General Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <VoiceInputButton fieldName="content" label="Content" />
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 mt-2"
                  placeholder="Additional clinical notes and observations"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <VoiceInputButton fieldName="tags" label="Tags" />
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 mt-2"
                  placeholder="routine, follow-up, urgent"
                />
              </div>

              {/* Voice Recognition Status */}
              {!browserSupportsSpeechRecognition && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-400">
                        Voice Input Not Available
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari for voice input functionality.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Current transcript display */}
              {isRecording && transcript && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Mic className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                        Voice Input Active - {recordingField}
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 p-2 rounded border">
                        "{transcript}"
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Continue speaking or click "Stop Recording" to finish
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{entry ? 'Update' : 'Save'} Entry</span>
                </button>
              </div>
            </form>
          </div>

          {/* AI Suggestions Panel */}
          {showAISuggestions && (
            <div className="w-96 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <h4 className="font-semibold">AI Clinical Assistant</h4>
                  </div>
                  <button
                    onClick={() => setShowAISuggestions(false)}
                    className="text-blue-100 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Patient Insights */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                    Patient Insights
                  </h5>
                  <div className="space-y-2">
                    {MOCK_PATIENT_INSIGHTS.map((insight, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border text-sm ${
                          insight.priority === 'critical' ? 'bg-red-50 border-red-200 text-red-800' :
                          insight.priority === 'high' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                          'bg-blue-50 border-blue-200 text-blue-800'
                        }`}
                      >
                        <div className="font-medium flex items-center">
                          {insight.type === 'trend' && <TrendingUp className="w-3 h-3 mr-1" />}
                          {insight.type === 'allergy' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {insight.type === 'medication' && <Pill className="w-3 h-3 mr-1" />}
                          {insight.type === 'followup' && <Clock className="w-3 h-3 mr-1" />}
                          {insight.title}
                        </div>
                        <div className="text-xs mt-1 opacity-80">{insight.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ICD Code Suggestions */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-green-600" />
                    ICD Code Suggestions
                  </h5>
                  <div className="space-y-2">
                    {MOCK_ICD_CODES.map((code, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => applyIcdCode(code)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {code.code}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {code.description}
                            </div>
                          </div>
                          <div className="text-xs text-green-600 font-medium ml-2">
                            {code.confidence}%
                          </div>
                        </div>
                        {selectedIcdCodes.includes(code.code) && (
                          <div className="mt-2 flex items-center text-xs text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Applied
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medication Suggestions */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Pill className="w-4 h-4 mr-2 text-purple-600" />
                    Medication Suggestions
                  </h5>
                  <div className="space-y-2">
                    {MOCK_MEDICATIONS.map((med, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => applyMedication(med)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {med.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {med.dosage} {med.frequency}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              For: {med.indication}
                            </div>
                          </div>
                          <div className="text-xs text-green-600 font-medium ml-2">
                            {med.confidence}%
                          </div>
                        </div>
                        {selectedMedications.find(m => m.name === med.name) && (
                          <div className="mt-2 flex items-center text-xs text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Applied
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Differential Diagnosis */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                    Differential Diagnosis
                  </h5>
                  <div className="space-y-2">
                    {MOCK_DIFFERENTIAL_DIAGNOSES.map((diagnosis, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => applyDifferentialDiagnosis(diagnosis)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {diagnosis.diagnosis}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {diagnosis.reasoning}
                            </div>
                          </div>
                          <div className="text-xs text-blue-600 font-medium ml-2">
                            {diagnosis.probability}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Drug Interactions */}
                {MOCK_DRUG_INTERACTIONS.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                      Drug Interaction Alerts
                    </h5>
                    <div className="space-y-2">
                      {MOCK_DRUG_INTERACTIONS.map((interaction, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border text-sm ${
                            interaction.severity === 'High' ? 'bg-red-50 border-red-200 text-red-800' :
                            'bg-yellow-50 border-yellow-200 text-yellow-800'
                          }`}
                        >
                          <div className="font-medium">
                            {interaction.drug1} + {interaction.drug2}
                          </div>
                          <div className="text-xs mt-1 opacity-80">
                            {interaction.description}
                          </div>
                          <div className="text-xs mt-1 font-medium">
                            Severity: {interaction.severity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clinical Guidelines */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-teal-600" />
                    Clinical Guidelines
                  </h5>
                  <div className="space-y-2">
                    {MOCK_CLINICAL_GUIDELINES.map((guideline, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {guideline.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {guideline.recommendation}
                        </div>
                        <div className="text-xs text-teal-600 mt-1 font-medium">
                          Source: {guideline.source}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}