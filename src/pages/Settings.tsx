import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../hooks/useAuth';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export function Settings() {
  const { language, setLanguage, theme, setTheme } = useApp();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'notifications'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    licenseNumber: user?.licenseNumber || '',
    phone: '',
    bio: ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    labResultAlerts: true,
    systemUpdates: false
  });

  const handleProfileSave = () => {
    if (user) {
      updateUser({
        name: profileData.name,
        department: profileData.department,
        licenseNumber: profileData.licenseNumber
      });
    }
    console.log('Profile updated:', profileData);
  };

  const handleSecuritySave = () => {
    console.log('Security settings updated');
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleNotificationSave = () => {
    console.log('Notification settings updated:', notificationSettings);
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              disabled
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <input
              type="text"
              value={profileData.department}
              onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              License Number
            </label>
            <input
              type="text"
              value={profileData.licenseNumber}
              onChange={(e) => setProfileData(prev => ({ ...prev, licenseNumber: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              placeholder="+971-XX-XXX-XXXX"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            rows={4}
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            placeholder="Tell us about yourself..."
          />
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleProfileSave}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Preferences</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Language</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center space-x-3">
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-gray-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Theme</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose light or dark mode</p>
              </div>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={securityData.newPassword}
              onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={securityData.confirmPassword}
              onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            />
          </div>
          
          <button
            onClick={handleSecuritySave}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Update Password</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {key === 'emailNotifications' && 'Receive notifications via email'}
                  {key === 'pushNotifications' && 'Receive push notifications in browser'}
                  {key === 'smsNotifications' && 'Receive SMS notifications on your phone'}
                  {key === 'appointmentReminders' && 'Get reminders for upcoming appointments'}
                  {key === 'labResultAlerts' && 'Get alerts when lab results are available'}
                  {key === 'systemUpdates' && 'Receive notifications about system updates'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rak-magenta-300 dark:peer-focus:ring-rak-magenta-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rak-magenta-600"></div>
              </label>
            </div>
          ))}
          
          <button
            onClick={handleNotificationSave}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'preferences':
        return renderPreferences();
      case 'security':
        return renderSecurity();
      case 'notifications':
        return renderNotifications();
      default:
        return renderProfile();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-rak-magenta-600" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-6 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-rak-magenta-500 text-rak-magenta-600 dark:text-rak-magenta-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}