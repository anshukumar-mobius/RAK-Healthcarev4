import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useEMRStore } from '../../stores/emrStore';
import { useAuthStore } from '../../stores/authStore';
import { Patient, EMREntry, ROLE_PERMISSIONS } from '../../types/emr';

interface EMREntryFormProps {
  patient: Patient;
  entry?: EMREntry | null;
  onClose: () => void;
  onSave: () => void;
}

export function EMREntryForm({ patient, entry, onClose, onSave }: EMREntryFormProps) {
  const user = useAuthStore(state => state.user);
  const { addEMREntry, updateEMREntry } = useEMRStore();
  
  const [formData, setFormData] = useState({
    entryType: 'consultation' as EMREntry['entryType'],
    title: '',
    content: '',
    status: 'draft' as EMREntry['status'],
    tags: '',
    // Vital signs specific fields
    temperature: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    painScale: ''
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
        // Extract vital signs data if present
        temperature: entry.data?.temperature?.toString() || '',
        systolic: entry.data?.bloodPressure?.systolic?.toString() || '',
        diastolic: entry.data?.bloodPressure?.diastolic?.toString() || '',
        heartRate: entry.data?.heartRate?.toString() || '',
        respiratoryRate: entry.data?.respiratoryRate?.toString() || '',
        oxygenSaturation: entry.data?.oxygenSaturation?.toString() || '',
        weight: entry.data?.weight?.toString() || '',
        height: entry.data?.height?.toString() || '',
        painScale: entry.data?.painScale?.toString() || ''
      });
    }
  }, [entry]);

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
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined
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

    onSave();
  };

  const renderVitalSignsFields = () => {
    if (formData.entryType !== 'vital_signs') return null;

    return (
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
              placeholder="98"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
              placeholder="70.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
              placeholder="175"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pain Scale (0-10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={formData.painScale}
              onChange={(e) => setFormData(prev => ({ ...prev, painScale: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {entry ? 'Edit EMR Entry' : 'Add EMR Entry'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Type *
              </label>
              <select
                value={formData.entryType}
                onChange={(e) => setFormData(prev => ({ ...prev, entryType: e.target.value as EMREntry['entryType'] }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
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
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="final">Final</option>
                <option value="amended">Amended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
              placeholder="Enter entry title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
              placeholder="Enter detailed content..."
              required
            />
          </div>

          {renderVitalSignsFields()}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-primary-500"
              placeholder="routine, follow-up, urgent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-rak-primary-600 hover:bg-rak-primary-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{entry ? 'Update' : 'Save'} Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}