import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Target, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  Check,
  X,
  Plus,
  User,
  Save
} from 'lucide-react';
import { useEMRStore } from '../stores/emrStore';
import carePlanData from '../data/carePlan.json';

interface Diagnosis {
  code: string;
  label: string;
}

interface Goal {
  id: string;
  text: string;
  status: 'planned' | 'in-progress' | 'completed' | 'achieved';
  progress: number;
  targetDate?: string;
  priority: 'low' | 'medium' | 'high';
}

interface CarePlan {
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
    primaryDiagnosis: string;
  };
  diagnoses: Diagnosis[];
  goals: Goal[];
  interventions: string[];
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  status: 'active' | 'completed' | 'discontinued';
}

const suggestedGoals = [
  { id: 'sg-1', text: 'Patient will demonstrate improved exercise tolerance', status: 'planned' as const, progress: 0, priority: 'medium' as const },
  { id: 'sg-2', text: 'Maintain fluid balance within normal limits', status: 'planned' as const, progress: 0, priority: 'high' as const },
  { id: 'sg-3', text: 'Patient will verbalize understanding of medication regimen', status: 'planned' as const, progress: 0, priority: 'high' as const },
  { id: 'sg-4', text: 'Achieve pain level of 3/10 or less', status: 'planned' as const, progress: 0, priority: 'medium' as const },
  { id: 'sg-5', text: 'Patient will demonstrate proper wound care technique', status: 'planned' as const, progress: 0, priority: 'low' as const }
];

const suggestedInterventions = [
  'Assess respiratory status every 4 hours',
  'Daily weight monitoring',
  'Medication education and compliance monitoring',
  'Progressive mobility as tolerated',
  'Dietary consultation for low-sodium diet',
  'Pain assessment using 0-10 scale every 2 hours',
  'Monitor intake and output',
  'Provide emotional support and counseling'
];

const priorityColors = {
  low: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200',
  medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200',
  high: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200'
};

export function CarePlan() {
  const { encounterId } = useParams<{ encounterId: string }>();
  const navigate = useNavigate();
  const { patients } = useEMRStore();
  
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [acceptedGoals, setAcceptedGoals] = useState<Set<string>>(new Set());
  const [acceptedInterventions, setAcceptedInterventions] = useState<Set<string>>(new Set());
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [newPlan, setNewPlan] = useState({
    primaryDiagnosis: '',
    diagnoses: [] as Diagnosis[],
    goals: [] as Goal[],
    interventions: [] as string[]
  });

  useEffect(() => {
    if (encounterId) {
      const foundPlan = carePlanData.find(
        (plan: any) => plan.encounterId === encounterId
      );
      
      if (foundPlan) {
        setCarePlan(foundPlan as CarePlan);
      }
    }
  }, [encounterId]);

  const handleAcceptGoal = (goal: Goal) => {
    if (!carePlan) return;
    setCarePlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        goals: [...prev.goals, { ...goal, id: `g-${Date.now()}` }]
      };
    });
    setAcceptedGoals(prev => new Set([...prev, goal.id]));
  };

  const handleRejectGoal = (goalId: string) => {
    setAcceptedGoals(prev => new Set([...prev, goalId]));
  };

  const handleAcceptIntervention = (intervention: string) => {
    if (!carePlan) return;
    setCarePlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        interventions: [...prev.interventions, intervention]
      };
    });
    setAcceptedInterventions(prev => new Set([...prev, intervention]));
  };

  const handleRejectIntervention = (intervention: string) => {
    setAcceptedInterventions(prev => new Set([...prev, intervention]));
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    if (!carePlan) return;
    setCarePlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        goals: prev.goals.map(goal =>
          goal.id === goalId 
            ? { 
                ...goal, 
                progress,
                status: progress === 100 ? 'completed' as const : progress > 0 ? 'in-progress' as const : 'planned' as const
              }
            : goal
        )
      };
    });
  };

  const handleCreateNewPlan = () => {
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    const newCarePlan: CarePlan = {
      id: `cp-${Date.now()}`,
      encounterId: `V${patient.id.padStart(3, '0')}`,
      patient: {
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        mrn: patient.mrn,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        room: 'A-101',
        bed: '1',
        admissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        primaryDiagnosis: newPlan.primaryDiagnosis || patient.chronicConditions[0] || 'General Care'
      },
      diagnoses: newPlan.diagnoses,
      goals: newPlan.goals,
      interventions: newPlan.interventions,
      createdBy: 'Current Nurse',
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'active'
    };

    setCarePlan(newCarePlan);
    setShowNewPlan(false);
    setSelectedPatient('');
    setNewPlan({
      primaryDiagnosis: '',
      diagnoses: [],
      goals: [],
      interventions: []
    });
  };

  const handleExport = () => {
    if (!carePlan) return;
    
    const dataStr = JSON.stringify(carePlan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `care-plan-${carePlan.encounterId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-300';
    if (progress < 50) return 'bg-red-500';
    if (progress < 80) return 'bg-yellow-500';
    return 'bg-green-500';
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
              <Target className="w-8 h-8 mr-3 text-rak-magenta-600" />
              Nursing Care Plan
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {encounterId ? `Encounter ID: ${encounterId}` : 'Create or manage care plans'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewPlan(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Care Plan</span>
          </button>
          {carePlan && (
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-rak-beige-100 hover:bg-rak-beige-200 text-rak-beige-700 px-4 py-2 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {carePlan ? (
        <>
          {/* Patient Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-rak-magenta-100 dark:bg-rak-magenta-900/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-rak-magenta-600 dark:text-rak-magenta-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {carePlan.patient.name}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-gray-500">MRN:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{carePlan.patient.mrn}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Room:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{carePlan.patient.room}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Primary Dx:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{carePlan.patient.primaryDiagnosis}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                      carePlan.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      carePlan.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {carePlan.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnoses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Primary Diagnoses
            </h3>
            <div className="flex flex-wrap gap-2">
              {carePlan.diagnoses.map((diagnosis, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-rak-magenta-100 dark:bg-rak-magenta-900/20 text-rak-magenta-700 dark:text-rak-magenta-400 rounded-lg text-sm font-medium border border-rak-magenta-200 dark:border-rak-magenta-800"
                >
                  {diagnosis.code}: {diagnosis.label}
                </span>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          {showSuggestions && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400">
                  AI-Suggested Goals & Interventions
                </h3>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Hide Suggestions
                </button>
              </div>
              
              {/* Suggested Goals */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Suggested Goals</h4>
                <div className="space-y-3">
                  {suggestedGoals.filter(goal => !acceptedGoals.has(goal.id)).map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-gray-900 dark:text-white font-medium">{goal.text}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[goal.priority]}`}>
                            {goal.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAcceptGoal(goal)}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRejectGoal(goal.id)}
                          className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Interventions */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Suggested Interventions</h4>
                <div className="space-y-3">
                  {suggestedInterventions.filter(intervention => !acceptedInterventions.has(intervention)).map((intervention, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
                      <span className="text-gray-900 dark:text-white font-medium">{intervention}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAcceptIntervention(intervention)}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRejectIntervention(intervention)}
                          className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Active Care Goals ({carePlan.goals.length})
            </h3>
            <div className="space-y-4">
              {carePlan.goals.map((goal) => (
                <div key={goal.id} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="font-semibold text-gray-900 dark:text-white">{goal.text}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[goal.priority]}`}>
                          {goal.priority}
                        </span>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        goal.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        goal.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {goal.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {goal.progress}%
                      </div>
                      <div className="text-xs text-gray-500">Progress</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress Slider</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                        className="w-48 accent-rak-magenta-600"
                      />
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interventions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Nursing Interventions ({carePlan.interventions.length})
            </h3>
            <div className="space-y-3">
              {carePlan.interventions.map((intervention, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white font-medium">{intervention}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Care Plan Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {encounterId ? `No care plan found for encounter ${encounterId}` : 'Select a patient to create a new care plan'}
          </p>
          <button
            onClick={() => setShowNewPlan(true)}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-6 py-3 rounded-lg transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Care Plan</span>
          </button>
        </div>
      )}

      {/* New Care Plan Modal */}
      {showNewPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">New Care Plan</h3>
                  <p className="text-rak-magenta-100 mt-1">Create comprehensive patient care plan</p>
                </div>
                <button
                  onClick={() => setShowNewPlan(false)}
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

              {/* Primary Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Diagnosis
                </label>
                <input
                  type="text"
                  value={newPlan.primaryDiagnosis}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, primaryDiagnosis: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  placeholder="Enter primary diagnosis..."
                />
              </div>

              {/* Initial Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Initial Care Goals
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                  placeholder="Enter initial care goals (one per line)..."
                />
              </div>

              {/* Initial Interventions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Initial Interventions
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                  placeholder="Enter initial nursing interventions (one per line)..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowNewPlan(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewPlan}
                  disabled={!selectedPatient}
                  className="flex items-center space-x-2 bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 hover:from-rak-magenta-700 hover:to-rak-magenta-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <Save className="w-5 h-5" />
                  <span>Create Care Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}