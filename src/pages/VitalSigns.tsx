import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Activity, Plus, TrendingUp, Heart, Thermometer, Droplets, Wind } from 'lucide-react';
import { t } from '../utils/translations';

// Mock vital signs data
const mockVitalSigns = [
  {
    id: '1',
    patientName: 'Ahmed Al Rashid',
    patientId: 'RAK-2024-001',
    temperature: 37.2,
    bloodPressure: { systolic: 145, diastolic: 90 },
    heartRate: 78,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    recordedAt: '2024-01-07T10:30:00Z',
    recordedBy: 'Nurse Fatima'
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    patientId: 'RAK-2024-002',
    temperature: 36.8,
    bloodPressure: { systolic: 128, diastolic: 82 },
    heartRate: 72,
    respiratoryRate: 14,
    oxygenSaturation: 99,
    recordedAt: '2024-01-07T09:15:00Z',
    recordedBy: 'Nurse Sarah'
  }
];

export function VitalSigns() {
  const { language } = useApp();
  const [vitalSigns] = useState(mockVitalSigns);
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="w-8 h-8 mr-3 text-rak-magenta-600" />
            {t('vitalSigns', language)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and record patient vital signs
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record Vitals</span>
        </button>
      </div>

      {/* Vital Signs Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vitalSigns.map((vitals) => (
          <div key={vitals.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{vitals.patientName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {vitals.patientId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(vitals.recordedAt).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">by {vitals.recordedBy}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Thermometer className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-400">Temperature</span>
                </div>
                <p className="text-lg font-bold text-red-900 dark:text-red-300">{vitals.temperature}°C</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Blood Pressure</span>
                </div>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
                  {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Heart className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-400">Heart Rate</span>
                </div>
                <p className="text-lg font-bold text-green-900 dark:text-green-300">{vitals.heartRate} bpm</p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Wind className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-400">Oxygen Sat</span>
                </div>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-300">{vitals.oxygenSaturation}%</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Respiratory Rate: {vitals.respiratoryRate}/min
                </span>
                <button className="text-sm text-rak-magenta-600 hover:text-rak-magenta-700">
                  View Trends
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Record Vitals Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Record Vital Signs
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select patient</option>
                  <option value="1">Ahmed Al Rashid (RAK-2024-001)</option>
                  <option value="2">Sarah Johnson (RAK-2024-002)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    placeholder="72"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    placeholder="120"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    placeholder="80"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Respiratory Rate (/min)
                  </label>
                  <input
                    type="number"
                    placeholder="16"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Oxygen Saturation (%)
                  </label>
                  <input
                    type="number"
                    placeholder="98"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional observations or notes..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-rak-magenta-600 text-white rounded-md hover:bg-rak-magenta-700"
              >
                Save Vitals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}