import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Heart, 
  AlertTriangle, 
  Pill, 
  Shield,
  FileText,
  Activity,
  Clock,
  Edit,
  Plus
} from 'lucide-react';
import { Patient } from '../../types/emr';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

interface PatientDetailViewProps {
  patient: Patient;
  onEdit?: () => void;
}

export function PatientDetailView({ patient, onEdit }: PatientDetailViewProps) {
  const { language, isRTL } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'insurance' | 'contacts'>('overview');

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'medical', label: 'Medical History', icon: Heart },
    { key: 'insurance', label: 'Insurance', icon: Shield },
    { key: 'contacts', label: 'Contacts', icon: Phone }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Demographics */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Demographics
        </h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
              <p className="text-gray-900 dark:text-white">{patient.firstName} {patient.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">MRN</label>
              <p className="text-gray-900 dark:text-white font-mono">{patient.mrn}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date of Birth</label>
              <p className="text-gray-900 dark:text-white">{formatDate(patient.dateOfBirth)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Age</label>
              <p className="text-gray-900 dark:text-white">{calculateAge(patient.dateOfBirth)} years</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender</label>
              <p className="text-gray-900 dark:text-white capitalize">{patient.gender}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Blood Type</label>
              <p className="text-gray-900 dark:text-white">{patient.bloodType || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nationality</label>
              <p className="text-gray-900 dark:text-white">{patient.nationality}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Emirates ID</label>
              <p className="text-gray-900 dark:text-white font-mono">{patient.emiratesId}</p>
            </div>
          </div>
          
          {patient.maritalStatus && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Marital Status</label>
                <p className="text-gray-900 dark:text-white capitalize">{patient.maritalStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupation</label>
                <p className="text-gray-900 dark:text-white">{patient.occupation || 'Not specified'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          Contact Information
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
            <p className="text-gray-900 dark:text-white">{patient.phone}</p>
          </div>
          
          {patient.email && (
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
              <p className="text-gray-900 dark:text-white">{patient.email}</p>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
            <p className="text-gray-900 dark:text-white">
              {patient.address}<br />
              {patient.city}, {patient.emirate}
              {patient.postalCode && ` ${patient.postalCode}`}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Preferred Language</label>
            <p className="text-gray-900 dark:text-white">
              {patient.preferredLanguage === 'ar' ? 'Arabic' : 'English'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      {/* Allergies & Chronic Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-red-800 dark:text-red-400 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Allergies
          </h4>
          {patient.allergies.length > 0 ? (
            <div className="space-y-2">
              {patient.allergies.map((allergy, index) => (
                <div key={index} className="bg-red-100 dark:bg-red-900/40 px-3 py-2 rounded-md">
                  <span className="text-red-800 dark:text-red-400 font-medium">{allergy}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600 dark:text-red-400">No known allergies</p>
          )}
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Chronic Conditions
          </h4>
          {patient.chronicConditions.length > 0 ? (
            <div className="space-y-2">
              {patient.chronicConditions.map((condition, index) => (
                <div key={index} className="bg-yellow-100 dark:bg-yellow-900/40 px-3 py-2 rounded-md">
                  <span className="text-yellow-800 dark:text-yellow-400 font-medium">{condition}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-yellow-600 dark:text-yellow-400">No chronic conditions</p>
          )}
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Pill className="w-5 h-5 mr-2" />
          Current Medications
        </h4>
        {patient.currentMedications.length > 0 ? (
          <div className="space-y-4">
            {patient.currentMedications.map((medication, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {medication.brandName || medication.name}
                    </h5>
                    {medication.genericName && medication.brandName && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Generic: {medication.genericName}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    medication.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    medication.status === 'discontinued' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {medication.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Dosage:</span>
                    <p className="text-gray-600 dark:text-gray-400">{medication.dosage}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Frequency:</span>
                    <p className="text-gray-600 dark:text-gray-400">{medication.frequency}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Route:</span>
                    <p className="text-gray-600 dark:text-gray-400">{medication.route}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Prescribed by:</span>
                    <p className="text-gray-600 dark:text-gray-400">{medication.prescribedBy}</p>
                  </div>
                </div>
                
                {medication.indication && (
                  <div className="mt-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Indication:</span>
                    <p className="text-gray-600 dark:text-gray-400">{medication.indication}</p>
                  </div>
                )}
                
                {medication.instructions && (
                  <div className="mt-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Instructions:</span>
                    <p className="text-gray-600 dark:text-gray-400">{medication.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No current medications</p>
        )}
      </div>

      {/* Family History */}
      {patient.familyHistory.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Family History
          </h4>
          <div className="space-y-3">
            {patient.familyHistory.map((history, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{history.condition}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">({history.relationship})</span>
                  </div>
                  {history.ageOfOnset && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Age of onset: {history.ageOfOnset}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social History */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Social History
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Smoking Status</label>
            <p className="text-gray-900 dark:text-white capitalize">{patient.smokingStatus || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Alcohol Consumption</label>
            <p className="text-gray-900 dark:text-white capitalize">{patient.alcoholConsumption || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2" />
        Insurance Information
      </h4>
      {patient.insurance ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Provider</label>
              <p className="text-gray-900 dark:text-white">{patient.insurance.provider}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Policy Number</label>
              <p className="text-gray-900 dark:text-white font-mono">{patient.insurance.policyNumber}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Coverage Type</label>
              <p className="text-gray-900 dark:text-white">{patient.insurance.coverageType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiry Date</label>
              <p className="text-gray-900 dark:text-white">{formatDate(patient.insurance.expiryDate)}</p>
            </div>
          </div>
          
          {patient.insurance.copayAmount && (
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Copay Amount</label>
              <p className="text-gray-900 dark:text-white">AED {patient.insurance.copayAmount}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No insurance information available</p>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Phone className="w-5 h-5 mr-2" />
        Emergency Contact
      </h4>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
            <p className="text-gray-900 dark:text-white">{patient.emergencyContact.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Relationship</label>
            <p className="text-gray-900 dark:text-white">{patient.emergencyContact.relationship}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
            <p className="text-gray-900 dark:text-white">{patient.emergencyContact.phone}</p>
          </div>
          {patient.emergencyContact.email && (
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
              <p className="text-gray-900 dark:text-white">{patient.emergencyContact.email}</p>
            </div>
          )}
        </div>
        
        {patient.emergencyContact.address && (
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
            <p className="text-gray-900 dark:text-white">{patient.emergencyContact.address}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'medical':
        return renderMedicalHistory();
      case 'insurance':
        return renderInsurance();
      case 'contacts':
        return renderContacts();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-rak-primary-100 dark:bg-rak-primary-900/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-rak-primary-600 dark:text-rak-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                MRN: {patient.mrn} • {calculateAge(patient.dateOfBirth)} years old • {patient.gender}
              </p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Last updated: {formatDate(patient.updatedAt)}
                </span>
              </div>
            </div>
          </div>
          
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center space-x-1 bg-rak-primary-600 hover:bg-rak-primary-700 text-white px-3 py-1.5 text-sm rounded-md transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-6 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-1 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-rak-primary-500 text-rak-primary-600 dark:text-rak-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {renderTabContent()}
      </div>
    </div>
  );
}