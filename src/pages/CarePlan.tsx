import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Target, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  Check,
  X
} from 'lucide-react';
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
}

interface CarePlan {
  id: string;
  encounterId: string;
  patientId?: string;
  patientName?: string;
  diagnoses: Diagnosis[];
  goals: Goal[];
  interventions: string[];
}

const suggestedGoals = [
  { id: 'sg-1', text: 'Patient will demonstrate improved exercise tolerance', status: 'planned' as const, progress: 0 },
  { id: 'sg-2', text: 'Maintain fluid balance within normal limits', status: 'planned' as const, progress: 0 },
  { id: 'sg-3', text: 'Patient will verbalize understanding of medication regimen', status: 'planned' as const, progress: 0 }
];

const suggestedInterventions = [
  'Assess respiratory status every 4 hours',
  'Daily weight monitoring',
  'Medication education and compliance monitoring',
  'Progressive mobility as tolerated',
  'Dietary consultation for low-sodium diet'
];

export function CarePlan() {
  const { encounterId } = useParams<{ encounterId: string }>();
  const navigate = useNavigate();
  
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [acceptedGoals, setAcceptedGoals] = useState<Set<string>>(new Set());
  const [acceptedInterventions, setAcceptedInterventions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Find the care plan for the specific encounter
    const foundPlan = carePlanData.find(
      (plan: any) => plan.encounterId === encounterId
    );
    
    if (foundPlan) {
      setCarePlan(foundPlan as CarePlan);
    } else {
      // Fallback to first plan if encounter not found
      setCarePlan(carePlanData[0] as CarePlan);
    }
  }, [encounterId]);

  const handleAcceptGoal = (goal: Goal) => {
    if (!carePlan) return;
    setCarePlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        goals: [...prev.goals, goal]
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

  // Show loading state if care plan is not loaded yet
  if (!carePlan) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading care plan...</p>
          </div>
        </div>
      </div>
    );
  }

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
              Encounter ID: {encounterId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-rak-beige-100 hover:bg-rak-beige-200 text-rak-beige-700 px-4 py-2 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
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
              className="px-3 py-1 bg-rak-magenta-100 dark:bg-rak-magenta-900/20 text-rak-magenta-700 dark:text-rak-magenta-400 rounded-full text-sm font-medium"
            >
              {diagnosis.code}: {diagnosis.label}
            </span>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      {showSuggestions && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400">
              AI-Suggested Goals & Interventions
            </h3>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Hide Suggestions
            </button>
          </div>
          
          {/* Suggested Goals */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Suggested Goals</h4>
            <div className="space-y-2">
              {suggestedGoals.filter(goal => !acceptedGoals.has(goal.id)).map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                  <span className="text-gray-900 dark:text-white">{goal.text}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAcceptGoal(goal)}
                      className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      <Check className="w-3 h-3" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleRejectGoal(goal.id)}
                      className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      <X className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Interventions */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Suggested Interventions</h4>
            <div className="space-y-2">
              {suggestedInterventions.filter(intervention => !acceptedInterventions.has(intervention)).map((intervention, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                  <span className="text-gray-900 dark:text-white">{intervention}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAcceptIntervention(intervention)}
                      className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      <Check className="w-3 h-3" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleRejectIntervention(intervention)}
                      className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      <X className="w-3 h-3" />
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Active Care Goals
        </h3>
        <div className="space-y-4">
          {carePlan.goals.map((goal) => (
            <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{goal.text}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    goal.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    goal.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {goal.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {goal.progress}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(goal.progress)}`}
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nursing Interventions
        </h3>
        <div className="space-y-2">
          {carePlan.interventions.map((intervention, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-900 dark:text-white">{intervention}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}