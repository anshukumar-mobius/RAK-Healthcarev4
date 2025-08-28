import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { DiagnosticWorkflow } from '../components/diagnostics/DiagnosticWorkflow';
import { ClipboardList, Clock, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { t } from '../utils/translations';

// Mock pending tests data
const mockPendingTests = [
  {
    id: '1',
    testName: 'Complete Blood Count (CBC)',
    patientName: 'Ahmed Al Rashid',
    doctorName: 'Dr. Sarah Ahmed',
    orderDate: '2024-01-07',
    status: 'ordered' as const,
    priority: 'urgent' as const,
    type: 'blood' as const,
    notes: 'Patient fasting for 12 hours'
  },
  {
    id: '2',
    testName: 'Chest X-Ray',
    patientName: 'Sarah Johnson',
    doctorName: 'Dr. Ahmed Al Rashid',
    orderDate: '2024-01-07',
    status: 'in-progress' as const,
    priority: 'urgent' as const,
    type: 'imaging' as const,
    notes: 'Suspected pneumonia',
    technician: 'Radiology Tech Ahmed'
  },
  {
    id: '3',
    testName: 'Urine Analysis',
    patientName: 'Mohammed Ali',
    doctorName: 'Dr. Fatima Al Zahra',
    orderDate: '2024-01-07',
    status: 'ordered' as const,
    priority: 'routine' as const,
    type: 'urine' as const,
    notes: 'Routine screening'
  },
  {
    id: '4',
    testName: 'Lipid Panel',
    patientName: 'Fatima Al Zahra',
    doctorName: 'Dr. Sarah Ahmed',
    orderDate: '2024-01-06',
    status: 'ordered' as const,
    priority: 'normal' as const,
    type: 'blood' as const,
    notes: 'Cardiovascular risk assessment'
  },
  {
    id: '5',
    testName: 'CT Scan - Abdomen',
    patientName: 'Ali Hassan',
    doctorName: 'Dr. Mohammed Al Rashid',
    orderDate: '2024-01-06',
    status: 'in-progress' as const,
    priority: 'urgent' as const,
    type: 'imaging' as const,
    notes: 'Abdominal pain investigation',
    technician: 'CT Tech Sarah'
  }
];

export function PendingTests() {
  const { language } = useApp();
  const [pendingTests] = useState(mockPendingTests);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const filteredTests = pendingTests.filter(test => {
    const priorityMatch = selectedPriority === 'all' || test.priority === selectedPriority;
    const typeMatch = selectedType === 'all' || test.type === selectedType;
    return priorityMatch && typeMatch;
  });

  const testStats = {
    total: pendingTests.length,
    ordered: pendingTests.filter(t => t.status === 'ordered').length,
    inProgress: pendingTests.filter(t => t.status === 'in-progress').length,
    urgent: pendingTests.filter(t => t.priority === 'urgent').length
  };

  const handleUpdateStatus = (testId: string, status: any) => {
    console.log('Update test status:', testId, status);
  };

  const handleUploadResults = (testId: string) => {
    console.log('Upload results for test:', testId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <ClipboardList className="w-8 h-8 mr-3 text-rak-magenta-600" />
            {t('pendingTests', language)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and process pending diagnostic tests
          </p>
        </div>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{testStats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Pending</div>
            </div>
            <ClipboardList className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{testStats.ordered}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ordered</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{testStats.inProgress}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{testStats.urgent}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Urgent</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
              <option value="routine">Routine</option>
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="blood">Blood Tests</option>
              <option value="urine">Urine Tests</option>
              <option value="imaging">Imaging</option>
              <option value="cardiac">Cardiac</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTests.length} of {pendingTests.length} tests
          </div>
        </div>
      </div>

      {/* Diagnostic Workflow */}
      <DiagnosticWorkflow
        tests={filteredTests}
        onUpdateStatus={handleUpdateStatus}
        onUploadResults={handleUploadResults}
      />
    </div>
  );
}