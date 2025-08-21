import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Monitor, 
  Clock, 
  Globe, 
  Palette,
  Database,
  Key,
  Mail,
  Phone,
  MapPin,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Calendar,
  FileText,
  Stethoscope,
  Activity,
  FlaskConical,
  CreditCard,
  UserPlus
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuthStore } from '../../stores/authStore';
import { t } from '../../utils/translations';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

// Admin Settings Components
function AdminGeneralSettings() {
  const [settings, setSettings] = useState({
    hospitalName: 'RAK Hospital',
    hospitalCode: 'RAK001',
    address: 'Ras Al Khaimah, UAE',
    phone: '+971-7-123-4567',
    email: 'admin@rak.gov.ae',
    website: 'https://rak.gov.ae',
    timezone: 'Asia/Dubai',
    currency: 'AED',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hospital Name
          </label>
          <input
            type="text"
            value={settings.hospitalName}
            onChange={(e) => setSettings(prev => ({ ...prev, hospitalName: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hospital Code
          </label>
          <input
            type="text"
            value={settings.hospitalCode}
            onChange={(e) => setSettings(prev => ({ ...prev, hospitalCode: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <textarea
            value={settings.address}
            onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
            rows={3}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
      </div>
    </div>
  );
}

function AdminSystemSettings() {
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '7years',
    auditLogging: true,
    sessionTimeout: '30',
    maxLoginAttempts: '3',
    passwordExpiry: '90',
    twoFactorAuth: true,
    sslEnabled: true,
    maintenanceMode: false
  });

  return (
    <div className="space-y-6">
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for all admin accounts</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.twoFactorAuth ? 'bg-rak-magenta-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Backup & Data Management</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Automatic Backup</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enable automatic system backups</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, autoBackup: !prev.autoBackup }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoBackup ? 'bg-rak-magenta-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Backup Frequency
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Retention Period
              </label>
              <select
                value={settings.dataRetention}
                onChange={(e) => setSettings(prev => ({ ...prev, dataRetention: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              >
                <option value="1year">1 Year</option>
                <option value="3years">3 Years</option>
                <option value="5years">5 Years</option>
                <option value="7years">7 Years</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Doctor Settings Components
function DoctorProfileSettings() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({
    firstName: 'Ahmed',
    lastName: 'Al Rashid',
    specialization: 'Internal Medicine',
    licenseNumber: 'DOC-2024-001',
    yearsOfExperience: '15',
    education: 'MD, Internal Medicine - UAE University',
    certifications: 'Board Certified Internal Medicine, Advanced Cardiac Life Support',
    languages: ['English', 'Arabic'],
    consultationFee: '300',
    followUpFee: '200',
    availableHours: {
      monday: { start: '08:00', end: '17:00', available: true },
      tuesday: { start: '08:00', end: '17:00', available: true },
      wednesday: { start: '08:00', end: '17:00', available: true },
      thursday: { start: '08:00', end: '17:00', available: true },
      friday: { start: '08:00', end: '12:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: false },
      sunday: { start: '09:00', end: '13:00', available: false }
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Specialization
          </label>
          <select
            value={profile.specialization}
            onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          >
            <option value="Internal Medicine">Internal Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Surgery">Surgery</option>
            <option value="Emergency Medicine">Emergency Medicine</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            License Number
          </label>
          <input
            type="text"
            value={profile.licenseNumber}
            onChange={(e) => setProfile(prev => ({ ...prev, licenseNumber: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
      </div>
      
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Consultation Fees</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Initial Consultation (AED)
            </label>
            <input
              type="number"
              value={profile.consultationFee}
              onChange={(e) => setProfile(prev => ({ ...prev, consultationFee: e.target.value }))}
              className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Follow-up Consultation (AED)
            </label>
            <input
              type="number"
              value={profile.followUpFee}
              onChange={(e) => setProfile(prev => ({ ...prev, followUpFee: e.target.value }))}
              className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Available Hours</h4>
        <div className="space-y-3">
          {Object.entries(profile.availableHours).map(([day, hours]) => (
            <div key={day} className="flex items-center justify-between p-3 bg-rak-white dark:bg-gray-800 rounded-md">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={hours.available}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    availableHours: {
                      ...prev.availableHours,
                      [day]: { ...hours, available: e.target.checked }
                    }
                  }))}
                  className="rounded border-rak-beige-300 text-rak-magenta-600 focus:ring-rak-magenta-500"
                />
                <span className="font-medium text-gray-900 dark:text-white capitalize">{day}</span>
              </div>
              
              {hours.available && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={hours.start}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      availableHours: {
                        ...prev.availableHours,
                        [day]: { ...hours, start: e.target.value }
                      }
                    }))}
                    className="border border-rak-beige-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={hours.end}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      availableHours: {
                        ...prev.availableHours,
                        [day]: { ...hours, end: e.target.value }
                      }
                    }))}
                    className="border border-rak-beige-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoctorClinicalSettings() {
  const [settings, setSettings] = useState({
    defaultAppointmentDuration: '30',
    allowOnlineConsultations: true,
    autoGenerateReports: true,
    requireFollowUpReminders: true,
    enableClinicalDecisionSupport: true,
    drugInteractionAlerts: true,
    allergyAlerts: true,
    prescriptionTemplates: true,
    defaultPrescriptionInstructions: 'Take as directed by physician',
    clinicalNotesTemplate: 'SOAP',
    enableVoiceNotes: false,
    autoSaveInterval: '5'
  });

  return (
    <div className="space-y-6">
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Appointment Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Appointment Duration (minutes)
            </label>
            <select
              value={settings.defaultAppointmentDuration}
              onChange={(e) => setSettings(prev => ({ ...prev, defaultAppointmentDuration: e.target.value }))}
              className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Online Consultations</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Allow telemedicine appointments</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, allowOnlineConsultations: !prev.allowOnlineConsultations }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowOnlineConsultations ? 'bg-rak-magenta-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.allowOnlineConsultations ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Clinical Decision Support</h4>
        <div className="space-y-4">
          {[
            { key: 'enableClinicalDecisionSupport', label: 'Clinical Decision Support', desc: 'AI-powered clinical recommendations' },
            { key: 'drugInteractionAlerts', label: 'Drug Interaction Alerts', desc: 'Automatic medication conflict detection' },
            { key: 'allergyAlerts', label: 'Allergy Alerts', desc: 'Patient allergy warnings' },
            { key: 'autoGenerateReports', label: 'Auto-Generate Reports', desc: 'Automatic clinical report generation' },
            { key: 'requireFollowUpReminders', label: 'Follow-up Reminders', desc: 'Automatic patient follow-up scheduling' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.key as keyof typeof settings] ? 'bg-rak-magenta-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Nurse Settings Components
function NurseProfileSettings() {
  const [profile, setProfile] = useState({
    firstName: 'Fatima',
    lastName: 'Al Zahra',
    nursingLicense: 'NUR-2024-001',
    specialization: 'Emergency Nursing',
    yearsOfExperience: '8',
    certifications: 'BLS, ACLS, PALS',
    shift: 'day',
    department: 'Emergency',
    supervisorName: 'Sarah Ahmed',
    emergencyContact: '+971-50-987-6543',
    languages: ['English', 'Arabic'],
    skills: ['IV Insertion', 'Wound Care', 'Patient Education', 'Medication Administration']
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nursing License
          </label>
          <input
            type="text"
            value={profile.nursingLicense}
            onChange={(e) => setProfile(prev => ({ ...prev, nursingLicense: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Department
          </label>
          <select
            value={profile.department}
            onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          >
            <option value="Emergency">Emergency</option>
            <option value="ICU">ICU</option>
            <option value="Medical Ward">Medical Ward</option>
            <option value="Surgical Ward">Surgical Ward</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Maternity">Maternity</option>
            <option value="Outpatient">Outpatient</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Shift Preference
          </label>
          <select
            value={profile.shift}
            onChange={(e) => setProfile(prev => ({ ...prev, shift: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          >
            <option value="day">Day Shift (7 AM - 7 PM)</option>
            <option value="night">Night Shift (7 PM - 7 AM)</option>
            <option value="rotating">Rotating Shifts</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            value={profile.yearsOfExperience}
            onChange={(e) => setProfile(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Certifications
        </label>
        <textarea
          value={profile.certifications}
          onChange={(e) => setProfile(prev => ({ ...prev, certifications: e.target.value }))}
          rows={3}
          className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          placeholder="List your certifications (BLS, ACLS, etc.)"
        />
      </div>
    </div>
  );
}

function NurseCareSettings() {
  const [settings, setSettings] = useState({
    vitalsFrequency: '4hours',
    medicationReminders: true,
    patientEducationMode: 'interactive',
    documentationStyle: 'narrative',
    alertThresholds: {
      temperature: { min: 36.0, max: 38.0 },
      heartRate: { min: 60, max: 100 },
      bloodPressure: { systolicMax: 140, diastolicMax: 90 },
      oxygenSaturation: { min: 95 }
    },
    autoCalculateBMI: true,
    enableMobilityAssessment: true,
    painScaleDefault: 'numeric',
    enableFallRiskAssessment: true
  });

  return (
    <div className="space-y-6">
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Vital Signs Monitoring</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Vitals Frequency
            </label>
            <select
              value={settings.vitalsFrequency}
              onChange={(e) => setSettings(prev => ({ ...prev, vitalsFrequency: e.target.value }))}
              className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            >
              <option value="1hour">Every Hour</option>
              <option value="2hours">Every 2 Hours</option>
              <option value="4hours">Every 4 Hours</option>
              <option value="6hours">Every 6 Hours</option>
              <option value="8hours">Every 8 Hours</option>
              <option value="12hours">Every 12 Hours</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temperature Range (°C)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={settings.alertThresholds.temperature.min}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    alertThresholds: {
                      ...prev.alertThresholds,
                      temperature: { ...prev.alertThresholds.temperature, min: parseFloat(e.target.value) }
                    }
                  }))}
                  className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  step="0.1"
                  value={settings.alertThresholds.temperature.max}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    alertThresholds: {
                      ...prev.alertThresholds,
                      temperature: { ...prev.alertThresholds.temperature, max: parseFloat(e.target.value) }
                    }
                  }))}
                  className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Heart Rate Range (bpm)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={settings.alertThresholds.heartRate.min}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    alertThresholds: {
                      ...prev.alertThresholds,
                      heartRate: { ...prev.alertThresholds.heartRate, min: parseInt(e.target.value) }
                    }
                  }))}
                  className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={settings.alertThresholds.heartRate.max}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    alertThresholds: {
                      ...prev.alertThresholds,
                      heartRate: { ...prev.alertThresholds.heartRate, max: parseInt(e.target.value) }
                    }
                  }))}
                  className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Patient Care Settings</h4>
        <div className="space-y-4">
          {[
            { key: 'medicationReminders', label: 'Medication Reminders', desc: 'Automatic medication administration alerts' },
            { key: 'autoCalculateBMI', label: 'Auto-Calculate BMI', desc: 'Automatically calculate BMI from height/weight' },
            { key: 'enableMobilityAssessment', label: 'Mobility Assessment', desc: 'Include mobility evaluation in care plans' },
            { key: 'enableFallRiskAssessment', label: 'Fall Risk Assessment', desc: 'Automatic fall risk evaluation' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.key as keyof typeof settings] ? 'bg-rak-magenta-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Receptionist Settings Components
function ReceptionistProfileSettings() {
  const [profile, setProfile] = useState({
    firstName: 'Aisha',
    lastName: 'Al Qasimi',
    employeeId: 'REC-2024-001',
    department: 'Front Desk',
    shift: 'morning',
    languages: ['English', 'Arabic', 'Hindi'],
    workStation: 'Reception Desk 1',
    supervisorName: 'Mohammed Al Mansoori',
    phoneExtension: '1001',
    emergencyContact: '+971-50-123-4567',
    specializations: ['Insurance Verification', 'Appointment Scheduling', 'Patient Registration']
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Employee ID
          </label>
          <input
            type="text"
            value={profile.employeeId}
            onChange={(e) => setProfile(prev => ({ ...prev, employeeId: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Work Station
          </label>
          <select
            value={profile.workStation}
            onChange={(e) => setProfile(prev => ({ ...prev, workStation: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          >
            <option value="Reception Desk 1">Reception Desk 1</option>
            <option value="Reception Desk 2">Reception Desk 2</option>
            <option value="Emergency Reception">Emergency Reception</option>
            <option value="Outpatient Reception">Outpatient Reception</option>
            <option value="Billing Counter">Billing Counter</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Shift
          </label>
          <select
            value={profile.shift}
            onChange={(e) => setProfile(prev => ({ ...prev, shift: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          >
            <option value="morning">Morning (6 AM - 2 PM)</option>
            <option value="afternoon">Afternoon (2 PM - 10 PM)</option>
            <option value="night">Night (10 PM - 6 AM)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Extension
          </label>
          <input
            type="text"
            value={profile.phoneExtension}
            onChange={(e) => setProfile(prev => ({ ...prev, phoneExtension: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
      </div>
    </div>
  );
}

function ReceptionistWorkflowSettings() {
  const [settings, setSettings] = useState({
    autoAssignAppointments: true,
    defaultAppointmentType: 'consultation',
    requireInsuranceVerification: true,
    enableWalkInRegistration: true,
    maxWalkInsPerHour: '5',
    appointmentReminderTime: '24hours',
    enableSMSReminders: true,
    enableEmailReminders: true,
    autoGeneratePatientCards: true,
    requireEmergencyContact: true,
    enableQueueManagement: true,
    maxQueueSize: '20',
    priorityBookingEnabled: true
  });

  return (
    <div className="space-y-6">
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Appointment Management</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Appointment Type
            </label>
            <select
              value={settings.defaultAppointmentType}
              onChange={(e) => setSettings(prev => ({ ...prev, defaultAppointmentType: e.target.value }))}
              className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="procedure">Procedure</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Appointment Reminder Time
              </label>
              <select
                value={settings.appointmentReminderTime}
                onChange={(e) => setSettings(prev => ({ ...prev, appointmentReminderTime: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              >
                <option value="1hour">1 Hour Before</option>
                <option value="2hours">2 Hours Before</option>
                <option value="24hours">24 Hours Before</option>
                <option value="48hours">48 Hours Before</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Walk-ins Per Hour
              </label>
              <input
                type="number"
                value={settings.maxWalkInsPerHour}
                onChange={(e) => setSettings(prev => ({ ...prev, maxWalkInsPerHour: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { key: 'autoAssignAppointments', label: 'Auto-Assign Appointments', desc: 'Automatically assign appointments to available doctors' },
              { key: 'requireInsuranceVerification', label: 'Require Insurance Verification', desc: 'Mandatory insurance verification for all patients' },
              { key: 'enableWalkInRegistration', label: 'Walk-in Registration', desc: 'Allow walk-in patient registration' },
              { key: 'enableSMSReminders', label: 'SMS Reminders', desc: 'Send SMS appointment reminders' },
              { key: 'enableEmailReminders', label: 'Email Reminders', desc: 'Send email appointment reminders' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[item.key as keyof typeof settings] ? 'bg-rak-magenta-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Diagnostician Settings Components
function DiagnosticianProfileSettings() {
  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    licenseNumber: 'RAD-2024-001',
    specialization: 'Radiology',
    certifications: 'Board Certified Radiologist, CT/MRI Certified',
    yearsOfExperience: '12',
    department: 'Radiology',
    shift: 'day',
    supervisorName: 'Dr. Ahmed Al Rashid',
    emergencyContact: '+971-55-987-6543',
    languages: ['English', 'Arabic'],
    equipmentCertifications: ['CT Scanner', 'MRI', 'X-Ray', 'Ultrasound', 'Mammography']
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            License Number
          </label>
          <input
            type="text"
            value={profile.licenseNumber}
            onChange={(e) => setProfile(prev => ({ ...prev, licenseNumber: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Specialization
          </label>
          <select
            value={profile.specialization}
            onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          >
            <option value="Radiology">Radiology</option>
            <option value="Laboratory Medicine">Laboratory Medicine</option>
            <option value="Pathology">Pathology</option>
            <option value="Nuclear Medicine">Nuclear Medicine</option>
            <option value="Interventional Radiology">Interventional Radiology</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Department
          </label>
          <select
            value={profile.department}
            onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          >
            <option value="Radiology">Radiology</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Pathology">Pathology</option>
            <option value="Nuclear Medicine">Nuclear Medicine</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            value={profile.yearsOfExperience}
            onChange={(e) => setProfile(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
            className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Equipment Certifications
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['CT Scanner', 'MRI', 'X-Ray', 'Ultrasound', 'Mammography', 'PET Scan', 'Fluoroscopy', 'DEXA Scan'].map((equipment) => (
            <label key={equipment} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={profile.equipmentCertifications.includes(equipment)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setProfile(prev => ({
                      ...prev,
                      equipmentCertifications: [...prev.equipmentCertifications, equipment]
                    }));
                  } else {
                    setProfile(prev => ({
                      ...prev,
                      equipmentCertifications: prev.equipmentCertifications.filter(cert => cert !== equipment)
                    }));
                  }
                }}
                className="rounded border-rak-beige-300 text-rak-magenta-600 focus:ring-rak-magenta-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{equipment}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiagnosticianLabSettings() {
  const [settings, setSettings] = useState({
    defaultReportTemplate: 'standard',
    autoCalculateNormalRanges: true,
    enableCriticalValueAlerts: true,
    criticalValueNotificationMethod: 'immediate',
    qualityControlFrequency: 'daily',
    enableAIAssistance: true,
    autoFlagAbnormalResults: true,
    requireSecondReview: true,
    enableVoiceReporting: false,
    defaultTurnaroundTime: '2hours',
    enablePatientPortalResults: true,
    requireDigitalSignature: true
  });

  return (
    <div className="space-y-6">
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Report Settings</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Report Template
              </label>
              <select
                value={settings.defaultReportTemplate}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultReportTemplate: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              >
                <option value="standard">Standard Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="summary">Summary Report</option>
                <option value="custom">Custom Template</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Turnaround Time
              </label>
              <select
                value={settings.defaultTurnaroundTime}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultTurnaroundTime: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              >
                <option value="30minutes">30 Minutes</option>
                <option value="1hour">1 Hour</option>
                <option value="2hours">2 Hours</option>
                <option value="4hours">4 Hours</option>
                <option value="24hours">24 Hours</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { key: 'autoCalculateNormalRanges', label: 'Auto-Calculate Normal Ranges', desc: 'Automatically calculate reference ranges based on demographics' },
              { key: 'enableCriticalValueAlerts', label: 'Critical Value Alerts', desc: 'Immediate alerts for critical test results' },
              { key: 'enableAIAssistance', label: 'AI Assistance', desc: 'AI-powered result interpretation and suggestions' },
              { key: 'autoFlagAbnormalResults', label: 'Auto-Flag Abnormal Results', desc: 'Automatically highlight abnormal values' },
              { key: 'requireSecondReview', label: 'Require Second Review', desc: 'Mandatory peer review for critical results' },
              { key: 'requireDigitalSignature', label: 'Digital Signature Required', desc: 'Electronic signature for all reports' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[item.key as keyof typeof settings] ? 'bg-rak-magenta-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Common Settings Components
function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    criticalAlerts: true,
    appointmentReminders: true,
    systemUpdates: false,
    marketingEmails: false,
    weeklyReports: true,
    soundAlerts: true,
    vibrationAlerts: false
  });

  return (
    <div className="space-y-6">
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h4>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
            { key: 'criticalAlerts', label: 'Critical Alerts', desc: 'Immediate alerts for critical situations' },
            { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Reminders for upcoming appointments' },
            { key: 'systemUpdates', label: 'System Updates', desc: 'Notifications about system updates' },
            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly performance and activity reports' },
            { key: 'soundAlerts', label: 'Sound Alerts', desc: 'Audio notifications for alerts' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.key as keyof typeof settings] ? 'bg-rak-magenta-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [settings, setSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginNotifications: true,
    deviceTrust: true,
    biometricLogin: false
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  return (
    <div className="space-y-6">
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={settings.currentPassword}
                onChange={(e) => setSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 pr-10 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={settings.newPassword}
                onChange={(e) => setSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 pr-10 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={settings.confirmPassword}
                onChange={(e) => setSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full border border-rak-beige-300 dark:border-gray-600 rounded-md px-3 py-2 pr-10 bg-rak-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <button className="bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors">
            Update Password
          </button>
        </div>
      </div>
      
      <div className="bg-rak-beige-50 dark:bg-gray-900 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Security Options</h4>
        <div className="space-y-4">
          {[
            { key: 'twoFactorEnabled', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
            { key: 'loginNotifications', label: 'Login Notifications', desc: 'Get notified of new login attempts' },
            { key: 'deviceTrust', label: 'Device Trust', desc: 'Remember trusted devices' },
            { key: 'biometricLogin', label: 'Biometric Login', desc: 'Use fingerprint or face recognition' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.key as keyof typeof settings] ? 'bg-rak-magenta-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Settings Component
export function RoleSettings() {
  const { role } = useApp();
  const [activeSection, setActiveSection] = useState('profile');

  const getRoleSections = (): SettingsSection[] => {
    const commonSections: SettingsSection[] = [
      { id: 'notifications', title: 'Notifications', icon: Bell, component: NotificationSettings },
      { id: 'security', title: 'Security', icon: Shield, component: SecuritySettings }
    ];

    switch (role) {
      case 'admin':
        return [
          { id: 'general', title: 'General Settings', icon: Settings, component: AdminGeneralSettings },
          { id: 'system', title: 'System Settings', icon: Database, component: AdminSystemSettings },
          ...commonSections
        ];
      case 'doctor':
        return [
          { id: 'profile', title: 'Profile Settings', icon: User, component: DoctorProfileSettings },
          { id: 'clinical', title: 'Clinical Settings', icon: Stethoscope, component: DoctorClinicalSettings },
          ...commonSections
        ];
      case 'nurse':
        return [
          { id: 'profile', title: 'Profile Settings', icon: User, component: NurseProfileSettings },
          { id: 'care', title: 'Patient Care Settings', icon: Activity, component: NurseCareSettings },
          ...commonSections
        ];
      case 'receptionist':
        return [
          { id: 'profile', title: 'Profile Settings', icon: User, component: ReceptionistProfileSettings },
          { id: 'workflow', title: 'Workflow Settings', icon: Calendar, component: ReceptionistWorkflowSettings },
          ...commonSections
        ];
      case 'diagnostician':
        return [
          { id: 'profile', title: 'Profile Settings', icon: User, component: DiagnosticianProfileSettings },
          { id: 'lab', title: 'Lab Settings', icon: FlaskConical, component: DiagnosticianLabSettings },
          ...commonSections
        ];
      default:
        return commonSections;
    }
  };

  const sections = getRoleSections();
  const activeComponent = sections.find(s => s.id === activeSection)?.component || sections[0].component;
  const ActiveComponent = activeComponent;

  return (
    <div className="bg-rak-white dark:bg-gray-800 rounded-lg border border-rak-beige-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-rak-beige-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Settings className="w-6 h-6 mr-3 text-rak-magenta-600" />
              {role.charAt(0).toUpperCase() + role.slice(1)} Settings
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configure your preferences and system settings
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 bg-rak-beige-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-rak-beige-200 dark:hover:bg-gray-600 text-sm">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 bg-rak-magenta-600 text-white rounded-md hover:bg-rak-magenta-700 text-sm">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Settings Navigation */}
        <div className="w-64 border-r border-rak-beige-200 dark:border-gray-700 p-4">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-rak-pink-50 dark:bg-rak-pink-900/20 text-rak-magenta-700 dark:text-rak-magenta-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-rak-pink-50 dark:hover:bg-gray-800 hover:text-rak-magenta-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}