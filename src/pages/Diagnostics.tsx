import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { DiagnosticWorkflow } from '../components/diagnostics/DiagnosticWorkflow';
import { FlaskConical, Upload, Download, Filter } from 'lucide-react';
import { t } from '../utils/translations';

// Mock diagnostic tests data
const mockDiagnosticTests = [
  {
    id: '1',
    testName: 'Complete Blood Count (CBC)',
    patientName: 'Ahmed Al Rashid',
    doctorName: 'Dr. Sarah Ahmed',
    orderDate: '2024-01-07',
    status: 'completed' as const,
    priority: 'normal' as const,
    type: 'blood' as const,
    results: 'Normal values within reference range',
    notes: 'Patient fasting for 12 hours',
    technician: 'Lab Tech Sarah'
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
    testName: 'ECG',
    patientName: 'Fatima Al Zahra',
    doctorName: 'Dr. Sarah Ahmed',
    orderDate: '2024-01-06',
    status: 'completed' as const,
    priority: 'urgent' as const,
    type: 'cardiac' as const,
    results: 'Normal sinus rhythm',
    technician: 'Cardiac Tech Mohammed'
  }
];

export function Diagnostics() {
  const { language } = useApp();
  const [diagnosticTests] = useState(mockDiagnosticTests);

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
            <FlaskConical className="w-8 h-8 mr-3 text-rak-magenta-600" />
            {t('diagnostics', language)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage diagnostic tests and laboratory workflows
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-rak-beige-100 hover:bg-rak-beige-200 text-rak-beige-700 px-4 py-2 rounded-md transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload Results</span>
          </button>
          <button className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Diagnostic Workflow */}
      <DiagnosticWorkflow
        tests={diagnosticTests}
        onUpdateStatus={handleUpdateStatus}
        onUploadResults={handleUploadResults}
      />
    </div>
  );
}