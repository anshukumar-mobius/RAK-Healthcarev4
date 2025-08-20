import React, { useState } from 'react';
import { FlaskConical, FileText, Upload, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

interface DiagnosticTest {
  id: string;
  testName: string;
  patientName: string;
  doctorName: string;
  orderDate: string;
  status: 'ordered' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'urgent' | 'normal' | 'routine';
  type: 'blood' | 'urine' | 'imaging' | 'cardiac' | 'other';
  results?: string;
  notes?: string;
  technician?: string;
}

interface DiagnosticWorkflowProps {
  tests: DiagnosticTest[];
  onUpdateStatus?: (testId: string, status: DiagnosticTest['status']) => void;
  onUploadResults?: (testId: string) => void;
}

const statusIcons = {
  ordered: Clock,
  'in-progress': AlertCircle,
  completed: CheckCircle,
  cancelled: AlertCircle
};

const statusColors = {
  ordered: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200',
  'in-progress': 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200',
  completed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200',
  cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200'
};

const priorityColors = {
  urgent: 'bg-red-500',
  normal: 'bg-yellow-500',
  routine: 'bg-green-500'
};

const typeIcons = {
  blood: '🩸',
  urine: '🧪',
  imaging: '📡',
  cardiac: '❤️',
  other: '🔬'
};

export function DiagnosticWorkflow({ 
  tests, 
  onUpdateStatus, 
  onUploadResults 
}: DiagnosticWorkflowProps) {
  const { language, isRTL } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<DiagnosticTest['status'] | 'all'>('all');
  const [selectedType, setSelectedType] = useState<DiagnosticTest['type'] | 'all'>('all');

  const filteredTests = tests.filter(test => {
    const statusMatch = selectedStatus === 'all' || test.status === selectedStatus;
    const typeMatch = selectedType === 'all' || test.type === selectedType;
    return statusMatch && typeMatch;
  });

  const testCounts = {
    total: tests.length,
    ordered: tests.filter(t => t.status === 'ordered').length,
    'in-progress': tests.filter(t => t.status === 'in-progress').length,
    completed: tests.filter(t => t.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{testCounts.total}</p>
            </div>
            <FlaskConical className="w-8 h-8 text-teal-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('pendingTests', language)}</p>
              <p className="text-2xl font-bold text-yellow-600">{testCounts.ordered}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{testCounts['in-progress']}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('completedTests', language)}</p>
              <p className="text-2xl font-bold text-green-600">{testCounts.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Diagnostic Tests Workflow
          </h3>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="ordered">Ordered</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Types</option>
              <option value="blood">Blood Tests</option>
              <option value="urine">Urine Tests</option>
              <option value="imaging">Imaging</option>
              <option value="cardiac">Cardiac</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTests.map((test) => {
          const StatusIcon = statusIcons[test.status];
          
          return (
            <div
              key={test.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                    <span className="text-lg">{typeIcons[test.type]}</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {test.testName}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Patient: {test.patientName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ordered by: Dr. {test.doctorName}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className={`w-3 h-3 rounded-full ${priorityColors[test.priority]}`}></div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColors[test.status]}`}>
                    <StatusIcon className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                    {test.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Order Date:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{test.orderDate}</span>
                </div>
                
                {test.technician && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Technician:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">{test.technician}</span>
                  </div>
                )}
                
                <div className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Priority:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    test.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    test.priority === 'normal' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {test.priority}
                  </span>
                </div>
                
                {test.notes && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Notes:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{test.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {test.status !== 'completed' && onUpdateStatus && (
                    <select
                      value={test.status}
                      onChange={(e) => onUpdateStatus(test.id, e.target.value as DiagnosticTest['status'])}
                      className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                    >
                      <option value="ordered">Ordered</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {test.status === 'completed' && test.results && (
                    <button className="p-2 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  
                  {(test.status === 'in-progress' || test.status === 'completed') && onUploadResults && (
                    <button
                      onClick={() => onUploadResults(test.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No diagnostic tests found</p>
        </div>
      )}
    </div>
  );
}