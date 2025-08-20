import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  FileText, 
  Activity,
  ArrowRight,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  assignedTo?: string;
  estimatedTime?: string;
  actualTime?: string;
  dependencies?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface ClinicalWorkflowProps {
  patientId: string;
  patientName: string;
  workflowType: 'admission' | 'surgery' | 'discharge' | 'emergency';
}

const mockWorkflowSteps: Record<string, WorkflowStep[]> = {
  admission: [
    {
      id: '1',
      title: 'Patient Registration',
      description: 'Complete patient registration and insurance verification',
      status: 'completed',
      assignedTo: 'Receptionist',
      estimatedTime: '10 min',
      actualTime: '8 min',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Initial Assessment',
      description: 'Nurse conducts initial vital signs and health assessment',
      status: 'completed',
      assignedTo: 'Nurse Sarah',
      estimatedTime: '15 min',
      actualTime: '12 min',
      dependencies: ['1'],
      priority: 'high'
    },
    {
      id: '3',
      title: 'Doctor Consultation',
      description: 'Primary physician consultation and diagnosis',
      status: 'in-progress',
      assignedTo: 'Dr. Ahmed',
      estimatedTime: '30 min',
      dependencies: ['2'],
      priority: 'critical'
    },
    {
      id: '4',
      title: 'Lab Tests Ordered',
      description: 'Order necessary laboratory tests based on consultation',
      status: 'pending',
      assignedTo: 'Dr. Ahmed',
      estimatedTime: '5 min',
      dependencies: ['3'],
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Room Assignment',
      description: 'Assign patient to appropriate room based on condition',
      status: 'pending',
      assignedTo: 'Nurse Manager',
      estimatedTime: '5 min',
      dependencies: ['3'],
      priority: 'medium'
    }
  ],
  surgery: [
    {
      id: '1',
      title: 'Pre-operative Assessment',
      description: 'Complete pre-surgical evaluation and clearance',
      status: 'completed',
      assignedTo: 'Dr. Sarah',
      estimatedTime: '45 min',
      actualTime: '40 min',
      priority: 'critical'
    },
    {
      id: '2',
      title: 'Anesthesia Consultation',
      description: 'Anesthesiologist evaluation and planning',
      status: 'completed',
      assignedTo: 'Dr. Anesthesia',
      estimatedTime: '20 min',
      actualTime: '25 min',
      dependencies: ['1'],
      priority: 'critical'
    },
    {
      id: '3',
      title: 'OR Preparation',
      description: 'Operating room setup and equipment check',
      status: 'in-progress',
      assignedTo: 'OR Team',
      estimatedTime: '30 min',
      dependencies: ['2'],
      priority: 'high'
    },
    {
      id: '4',
      title: 'Surgery',
      description: 'Primary surgical procedure',
      status: 'pending',
      assignedTo: 'Dr. Surgeon',
      estimatedTime: '120 min',
      dependencies: ['3'],
      priority: 'critical'
    },
    {
      id: '5',
      title: 'Post-operative Care',
      description: 'Recovery room monitoring and care',
      status: 'pending',
      assignedTo: 'Recovery Nurse',
      estimatedTime: '60 min',
      dependencies: ['4'],
      priority: 'critical'
    }
  ]
};

export function ClinicalWorkflow({ patientId, patientName, workflowType }: ClinicalWorkflowProps) {
  const { language } = useApp();
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [showAddStep, setShowAddStep] = useState(false);

  const steps = mockWorkflowSteps[workflowType] || [];

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'blocked':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200';
      case 'blocked':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400 border-gray-200';
    }
  };

  const getPriorityColor = (priority: WorkflowStep['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Clinical Workflow - {workflowType.charAt(0).toUpperCase() + workflowType.slice(1)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Patient: {patientName} • ID: {patientId}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddStep(true)}
              className="flex items-center space-x-1 bg-rak-primary-600 hover:bg-rak-primary-700 text-white px-3 py-2 rounded-md text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Step</span>
            </button>
            <button className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
              <FileText className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="p-6">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200 dark:bg-gray-700"></div>
              )}
              
              <div className={`flex items-start space-x-4 p-4 rounded-lg border ${
                step.status === 'in-progress' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' :
                step.status === 'completed' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :
                'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              }`}>
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(step.status)}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h4>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(step.priority)}`}></div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}>
                          {step.status.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {step.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                        {step.assignedTo && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{step.assignedTo}</span>
                          </div>
                        )}
                        {step.estimatedTime && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Est: {step.estimatedTime}</span>
                          </div>
                        )}
                        {step.actualTime && (
                          <div className="flex items-center space-x-1">
                            <Activity className="w-3 h-3" />
                            <span>Actual: {step.actualTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={() => setSelectedStep(step)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Steps</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{steps.length}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {steps.filter(s => s.status === 'completed').length}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400">In Progress</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {steps.filter(s => s.status === 'in-progress').length}
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                {steps.filter(s => s.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Detail Modal */}
      {selectedStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Step Details
                </h3>
                <button
                  onClick={() => setSelectedStep(null)}
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
                    Title
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedStep.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedStep.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedStep.status)}`}>
                      {selectedStep.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedStep.priority)}`}></div>
                      <span className="text-sm capitalize">{selectedStep.priority}</span>
                    </div>
                  </div>
                </div>
                
                {selectedStep.assignedTo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Assigned To
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedStep.assignedTo}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  {selectedStep.estimatedTime && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estimated Time
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedStep.estimatedTime}</p>
                    </div>
                  )}
                  
                  {selectedStep.actualTime && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Actual Time
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedStep.actualTime}</p>
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