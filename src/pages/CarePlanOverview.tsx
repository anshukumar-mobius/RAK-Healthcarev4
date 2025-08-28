import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
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
  FileText,
  Activity,
  Heart,
  Pill,
  Eye,
  Edit
} from 'lucide-react';
import { useEMRStore } from '../stores/emrStore';
import { useAuth } from '../hooks/useAuth';
import carePlanData from '../data/carePlan.json';

interface PatientCarePlan {
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
  diagnoses: Array<{
    code: string;
    label: string;
  }>;
  goals: Array<{
    id: string;
    text: string;
    status: 'planned' | 'in-progress' | 'completed' | 'achieved';
    progress: number;
    priority: 'low' | 'medium' | 'high';
  }>;
  interventions: string[];
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  status: 'active' | 'completed' | 'discontinued';
  assignedNurse: string;
  nextReviewDate: string;
}

export function CarePlanOverview() {
  const navigate = useNavigate();
  const { patients } = useEMRStore();
  const { user } = useAuth();
  
  const [carePlans, setCarePlans] = useState<PatientCarePlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'discontinued'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');

  useEffect(() => {
    // Load care plans and filter by assigned nurse
    const allPlans = carePlanData as PatientCarePlan[];
    // In a real system, you'd filter by assignedNurse === user?.id
    // For demo, we'll show all plans but you can filter by user
    const assignedPlans = allPlans.map(plan => ({
      ...plan,
      assignedNurse: user?.name || 'Current Nurse',
      nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    setCarePlans(assignedPlans);
  }, [user]);

  const filteredPlans = carePlans.filter(plan => {
    const matchesSearch = plan.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.patient.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    
    const hasHighPriorityGoals = plan.goals.some(goal => goal.priority === 'high');
    const hasMediumPriorityGoals = plan.goals.some(goal => goal.priority === 'medium');
    const hasLowPriorityGoals = plan.goals.some(goal => goal.priority === 'low');
    
    const matchesPriority = priorityFilter === 'all' || 
                           (priorityFilter === 'high' && hasHighPriorityGoals) ||
                           (priorityFilter === 'medium' && hasMediumPriorityGoals) ||
                           (priorityFilter === 'low' && hasLowPriorityGoals);
    
    return matchesSearch && matchesStatus && matchesPriority;
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

  const getOverallProgress = (goals: PatientCarePlan['goals']) => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / goals.length);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200';
      case 'low': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200';
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200';
      case 'completed': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200';
      case 'discontinued': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200';
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400 border-gray-200';
    }
  };

  const handleCreateNewPlan = () => {
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    // Navigate to the care plan creation page with the selected patient
    navigate(`/care-plan/${patient.mrn}`);
  };

  const handleViewPlan = (plan: PatientCarePlan) => {
    navigate(`/care-plan/${plan.encounterId}`);
  };

  const handleEditPlan = (plan: PatientCarePlan) => {
    navigate(`/care-plan/${plan.encounterId}?edit=true`);
  };

  // Statistics
  const stats = {
    totalPlans: carePlans.length,
    activePlans: carePlans.filter(p => p.status === 'active').length,
    completedPlans: carePlans.filter(p => p.status === 'completed').length,
    highPriorityPlans: carePlans.filter(p => p.goals.some(g => g.priority === 'high')).length,
    avgProgress: carePlans.length > 0 ? Math.round(
      carePlans.reduce((sum, plan) => sum + getOverallProgress(plan.goals), 0) / carePlans.length
    ) : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="w-8 h-8 mr-3 text-rak-magenta-600" />
            My Patient Care Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage care plans for all assigned patients
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewPlan(true)}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Care Plan</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPlans}</p>
            </div>
            <Target className="w-8 h-8 text-rak-magenta-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Plans</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activePlans}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedPlans}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.highPriorityPlans}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</p>
              <p className="text-2xl font-bold text-rak-magenta-600">{stats.avgProgress}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-rak-magenta-600" />
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
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="discontinued">Discontinued</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredPlans.length} of {carePlans.length} care plans
          </div>
        </div>
      </div>

      {/* Care Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const overallProgress = getOverallProgress(plan.goals);
          const completedGoals = plan.goals.filter(g => g.status === 'completed' || g.status === 'achieved').length;
          const highPriorityGoals = plan.goals.filter(g => g.priority === 'high').length;
          
          return (
            <div
              key={plan.id}
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
                        {plan.patient.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>MRN: {plan.patient.mrn}</span>
                        <span>{calculateAge(plan.patient.dateOfBirth)}y</span>
                        <span className="capitalize">{plan.patient.gender}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Heart className="w-4 h-4" />
                      <span>{plan.patient.primaryDiagnosis}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Review: {new Date(plan.nextReviewDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Plan Content */}
              <div className="p-4">
                {/* Progress Overview */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(overallProgress)}`}
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Goals Summary */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-1 text-rak-magenta-600" />
                    Goals ({plan.goals.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                      <div className="font-bold text-green-700 dark:text-green-400">{completedGoals}</div>
                      <div className="text-green-600 dark:text-green-400">Completed</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                      <div className="font-bold text-blue-700 dark:text-blue-400">{plan.goals.filter(g => g.status === 'in-progress').length}</div>
                      <div className="text-blue-600 dark:text-blue-400">In Progress</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                      <div className="font-bold text-red-700 dark:text-red-400">{highPriorityGoals}</div>
                      <div className="text-red-600 dark:text-red-400">High Priority</div>
                    </div>
                  </div>
                </div>

                {/* Recent Goals */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Recent Goals</h4>
                  <div className="space-y-2">
                    {plan.goals.slice(0, 2).map((goal) => (
                      <div key={goal.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
                              {goal.priority}
                            </span>
                            <span className="text-gray-900 dark:text-white font-medium truncate">
                              {goal.text.length > 30 ? `${goal.text.substring(0, 30)}...` : goal.text}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-xs font-bold text-gray-900 dark:text-white">{goal.progress}%</div>
                        </div>
                      </div>
                    ))}
                    {plan.goals.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        +{plan.goals.length - 2} more goals
                      </div>
                    )}
                  </div>
                </div>

                {/* Interventions Summary */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm flex items-center">
                    <Pill className="w-4 h-4 mr-1 text-green-600" />
                    Interventions ({plan.interventions.length})
                  </h4>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {plan.interventions.slice(0, 2).map((intervention, index) => (
                      <div key={index} className="flex items-center space-x-1 mb-1">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span className="truncate">{intervention}</span>
                      </div>
                    ))}
                    {plan.interventions.length > 2 && (
                      <div className="text-gray-500 dark:text-gray-400">
                        +{plan.interventions.length - 2} more interventions
                      </div>
                    )}
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Updated: {new Date(plan.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{plan.assignedNurse}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewPlan(plan)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Plan</span>
                  </button>
                  <button
                    onClick={() => handleEditPlan(plan)}
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

      {filteredPlans.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Care Plans Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'No care plans match your current filters' 
              : 'You have no assigned care plans yet'}
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
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Create New Care Plan</h3>
                  <p className="text-rak-magenta-100 mt-1">Select a patient to create their care plan</p>
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
                  <Target className="w-5 h-5" />
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