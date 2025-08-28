import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Save, 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock,
  Pill,
  AlertTriangle,
  CheckCircle,
  Home,
  Phone,
  Stethoscope,
  Activity,
  Plus,
  X
} from 'lucide-react';
import { useEMRStore } from '../stores/emrStore';

interface DischargeFormData {
  patientId: string;
  dischargeDate: string;
  dischargeTime: string;
  attendingPhysician: string;
  dischargingNurse: string;
  dischargeDestination: string;
  transportMethod: string;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  procedures: string[];
  dischargeMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  dietInstructions: string;
  activityRestrictions: string;
  followUpAppointments: Array<{
    provider: string;
    timeframe: string;
    reason: string;
    phone: string;
  }>;
  warningSignsToReport: string[];
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  homeCarePlan: string;
  equipmentNeeded: string[];
  specialInstructions: string;
  patientEducationProvided: string[];
  dischargeCondition: 'stable' | 'improved' | 'unchanged' | 'guarded';
  functionalStatus: string;
  cognitiveStatus: string;
  painLevel: number;
  vitalSigns: {
    bp: string;
    hr: number;
    temp: number;
    rr: number;
    spo2: number;
  };
}

export function DischargeForm() {
  const navigate = useNavigate();
  const { patients } = useEMRStore();
  
  const [formData, setFormData] = useState<DischargeFormData>({
    patientId: '',
    dischargeDate: new Date().toISOString().split('T')[0],
    dischargeTime: new Date().toTimeString().slice(0, 5),
    attendingPhysician: '',
    dischargingNurse: 'Current Nurse',
    dischargeDestination: 'Home',
    transportMethod: 'Private Vehicle',
    primaryDiagnosis: '',
    secondaryDiagnoses: [],
    procedures: [],
    dischargeMedications: [],
    dietInstructions: '',
    activityRestrictions: '',
    followUpAppointments: [],
    warningSignsToReport: [],
    emergencyContacts: [],
    homeCarePlan: '',
    equipmentNeeded: [],
    specialInstructions: '',
    patientEducationProvided: [],
    dischargeCondition: 'stable',
    functionalStatus: '',
    cognitiveStatus: '',
    painLevel: 0,
    vitalSigns: {
      bp: '',
      hr: 0,
      temp: 0,
      rr: 0,
      spo2: 0
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const selectedPatient = patients.find(p => p.id === formData.patientId);

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      dischargeMedications: [
        ...prev.dischargeMedications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    }));
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dischargeMedications: prev.dischargeMedications.filter((_, i) => i !== index)
    }));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dischargeMedications: prev.dischargeMedications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const addFollowUpAppointment = () => {
    setFormData(prev => ({
      ...prev,
      followUpAppointments: [
        ...prev.followUpAppointments,
        { provider: '', timeframe: '', reason: '', phone: '' }
      ]
    }));
  };

  const removeFollowUpAppointment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      followUpAppointments: prev.followUpAppointments.filter((_, i) => i !== index)
    }));
  };

  const updateFollowUpAppointment = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      followUpAppointments: prev.followUpAppointments.map((apt, i) => 
        i === index ? { ...apt, [field]: value } : apt
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Discharge form submitted:', formData);
    // Here you would save the discharge form data
    alert('Discharge form completed successfully!');
    navigate('/dashboard');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Patient & Basic Information</h3>
            
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
                    value={formData.patientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
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
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        MRN: {selectedPatient.mrn} • DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Discharge Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discharge Date *
                </label>
                <input
                  type="date"
                  value={formData.dischargeDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dischargeDate: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discharge Time *
                </label>
                <input
                  type="time"
                  value={formData.dischargeTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dischargeTime: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attending Physician *
                </label>
                <input
                  type="text"
                  value={formData.attendingPhysician}
                  onChange={(e) => setFormData(prev => ({ ...prev, attendingPhysician: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  placeholder="Dr. Name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discharge Destination *
                </label>
                <select
                  value={formData.dischargeDestination}
                  onChange={(e) => setFormData(prev => ({ ...prev, dischargeDestination: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  required
                >
                  <option value="Home">Home</option>
                  <option value="Skilled Nursing Facility">Skilled Nursing Facility</option>
                  <option value="Rehabilitation Center">Rehabilitation Center</option>
                  <option value="Another Hospital">Another Hospital</option>
                  <option value="Hospice">Hospice</option>
                  <option value="Assisted Living">Assisted Living</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Clinical Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Diagnosis *
                </label>
                <input
                  type="text"
                  value={formData.primaryDiagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryDiagnosis: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  placeholder="Primary diagnosis with ICD code"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discharge Condition *
                </label>
                <select
                  value={formData.dischargeCondition}
                  onChange={(e) => setFormData(prev => ({ ...prev, dischargeCondition: e.target.value as any }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  required
                >
                  <option value="stable">Stable</option>
                  <option value="improved">Improved</option>
                  <option value="unchanged">Unchanged</option>
                  <option value="guarded">Guarded</option>
                </select>
              </div>
            </div>

            {/* Vital Signs at Discharge */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-rak-magenta-600" />
                Vital Signs at Discharge
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={formData.vitalSigns.bp}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      vitalSigns: { ...prev.vitalSigns, bp: e.target.value }
                    }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Heart Rate
                  </label>
                  <input
                    type="number"
                    placeholder="72"
                    value={formData.vitalSigns.hr || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      vitalSigns: { ...prev.vitalSigns, hr: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Temperature
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={formData.vitalSigns.temp || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      vitalSigns: { ...prev.vitalSigns, temp: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Resp. Rate
                  </label>
                  <input
                    type="number"
                    placeholder="16"
                    value={formData.vitalSigns.rr || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      vitalSigns: { ...prev.vitalSigns, rr: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SpO2 (%)
                  </label>
                  <input
                    type="number"
                    placeholder="98"
                    value={formData.vitalSigns.spo2 || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      vitalSigns: { ...prev.vitalSigns, spo2: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Functional Status
                </label>
                <textarea
                  value={formData.functionalStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, functionalStatus: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                  placeholder="Patient's functional abilities and limitations..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cognitive Status
                </label>
                <textarea
                  value={formData.cognitiveStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, cognitiveStatus: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                  placeholder="Patient's mental status and cognitive function..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discharge Medications</h3>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-green-600" />
                  Medications to Continue at Home
                </h4>
                <button
                  onClick={addMedication}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Medication</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.dischargeMedications.map((medication, index) => (
                  <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900 dark:text-white">Medication #{index + 1}</h5>
                      <button
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Medication Name
                        </label>
                        <input
                          type="text"
                          value={medication.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="e.g., Lisinopril"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Dosage
                        </label>
                        <input
                          type="text"
                          value={medication.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="e.g., 10mg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Frequency
                        </label>
                        <input
                          type="text"
                          value={medication.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="e.g., Once daily"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={medication.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="e.g., 30 days"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Special Instructions
                      </label>
                      <textarea
                        value={medication.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        rows={2}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                        placeholder="e.g., Take with food, avoid alcohol..."
                      />
                    </div>
                  </div>
                ))}
                
                {formData.dischargeMedications.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Pill className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No medications added yet</p>
                    <p className="text-sm">Click "Add Medication" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Care Instructions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diet Instructions
                </label>
                <textarea
                  value={formData.dietInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, dietInstructions: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                  placeholder="Dietary restrictions, recommendations, and special instructions..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activity Restrictions
                </label>
                <textarea
                  value={formData.activityRestrictions}
                  onChange={(e) => setFormData(prev => ({ ...prev, activityRestrictions: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                  placeholder="Activity limitations, weight restrictions, mobility guidelines..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Home Care Plan
              </label>
              <textarea
                value={formData.homeCarePlan}
                onChange={(e) => setFormData(prev => ({ ...prev, homeCarePlan: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                placeholder="Detailed home care instructions, wound care, monitoring requirements..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Follow-up Care</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Follow-up Appointments
                </h4>
                <button
                  onClick={addFollowUpAppointment}
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Appointment</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.followUpAppointments.map((appointment, index) => (
                  <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900 dark:text-white">Follow-up #{index + 1}</h5>
                      <button
                        onClick={() => removeFollowUpAppointment(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Provider/Department
                        </label>
                        <input
                          type="text"
                          value={appointment.provider}
                          onChange={(e) => updateFollowUpAppointment(index, 'provider', e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="e.g., Cardiology, Dr. Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Timeframe
                        </label>
                        <input
                          type="text"
                          value={appointment.timeframe}
                          onChange={(e) => updateFollowUpAppointment(index, 'timeframe', e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="e.g., 1-2 weeks, 3 months"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Reason
                        </label>
                        <input
                          type="text"
                          value={appointment.reason}
                          onChange={(e) => updateFollowUpAppointment(index, 'reason', e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="e.g., Blood pressure check"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={appointment.phone}
                          onChange={(e) => updateFollowUpAppointment(index, 'phone', e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="+971-XX-XXX-XXXX"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.followUpAppointments.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No follow-up appointments scheduled</p>
                    <p className="text-sm">Click "Add Appointment" to schedule follow-up care</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Warning Signs & Emergency Information</h3>
            
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Warning Signs to Report Immediately
              </h4>
              
              <div className="space-y-3">
                {[
                  'Chest pain or pressure',
                  'Difficulty breathing or shortness of breath',
                  'Severe headache or dizziness',
                  'High fever (>101°F/38.3°C)',
                  'Excessive bleeding or wound drainage',
                  'Signs of infection (redness, swelling, warmth)',
                  'Severe nausea or vomiting',
                  'Loss of consciousness or confusion'
                ].map((sign, index) => (
                  <label key={index} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded">
                    <input
                      type="checkbox"
                      checked={formData.warningSignsToReport.includes(sign)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            warningSignsToReport: [...prev.warningSignsToReport, sign]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            warningSignsToReport: prev.warningSignsToReport.filter(s => s !== sign)
                          }));
                        }
                      }}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{sign}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Special Instructions
              </label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                placeholder="Any additional special instructions or precautions..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review & Finalize</h3>
            
            {/* Summary Review */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Discharge Summary Review
              </h4>
              
              {selectedPatient && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Patient:</span>
                      <p className="text-gray-900 dark:text-white">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">MRN:</span>
                      <p className="text-gray-900 dark:text-white">{selectedPatient.mrn}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Discharge Date:</span>
                      <p className="text-gray-900 dark:text-white">{formData.dischargeDate} at {formData.dischargeTime}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Destination:</span>
                      <p className="text-gray-900 dark:text-white">{formData.dischargeDestination}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Attending Physician:</span>
                      <p className="text-gray-900 dark:text-white">{formData.attendingPhysician}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Primary Diagnosis:</span>
                      <p className="text-gray-900 dark:text-white">{formData.primaryDiagnosis}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Condition:</span>
                      <p className="text-gray-900 dark:text-white capitalize">{formData.dischargeCondition}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Medications:</span>
                      <p className="text-gray-900 dark:text-white">{formData.dischargeMedications.length} prescribed</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Final Checklist */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Discharge Checklist</h4>
              <div className="space-y-3">
                {[
                  'Patient education completed and understood',
                  'Discharge medications reconciled and explained',
                  'Follow-up appointments scheduled',
                  'Warning signs reviewed with patient/family',
                  'Transportation arranged',
                  'Home care equipment ordered (if needed)',
                  'Emergency contact information verified',
                  'Patient/family questions answered'
                ].map((item, index) => (
                  <label key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
              <FileText className="w-8 h-8 mr-3 text-rak-magenta-600" />
              Patient Discharge Form
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive discharge documentation and planning
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Step {currentStep} of {totalSteps}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Patient Info</span>
          <span>Medications</span>
          <span>Care Instructions</span>
          <span>Follow-up</span>
          <span>Warnings</span>
          <span>Review</span>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i + 1 <= currentStep ? 'bg-rak-magenta-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={currentStep === 1 && !formData.patientId}
              className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
            >
              <span>Next</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!formData.patientId}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5" />
              <span>Complete Discharge</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}