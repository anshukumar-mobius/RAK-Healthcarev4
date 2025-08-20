import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FlaskConical, 
  CreditCard,
  CheckSquare,
  UserPlus,
  Activity,
  Bed,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  key: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'dashboard',
    key: 'dashboard',
    roles: ['admin', 'doctor', 'nurse', 'receptionist', 'diagnostician']
  },
  {
    icon: Users,
    label: 'patients',
    key: 'patients',
    roles: ['admin', 'doctor', 'nurse', 'receptionist']
  },
  {
    icon: Calendar,
    label: 'appointments',
    key: 'appointments',
    roles: ['admin', 'doctor', 'nurse', 'receptionist']
  },
  {
    icon: FlaskConical,
    label: 'diagnostics',
    key: 'diagnostics',
    roles: ['admin', 'doctor', 'diagnostician']
  },
  {
    icon: CreditCard,
    label: 'billing',
    key: 'billing',
    roles: ['admin', 'receptionist']
  },
  {
    icon: CheckSquare,
    label: 'myTasks',
    key: 'tasks',
    roles: ['doctor', 'nurse']
  },
  {
    icon: UserPlus,
    label: 'patientRegistration',
    key: 'registration',
    roles: ['receptionist']
  },
  {
    icon: Activity,
    label: 'vitalSigns',
    key: 'vitals',
    roles: ['nurse']
  },
  {
    icon: Bed,
    label: 'bedOccupancy',
    key: 'beds',
    roles: ['admin', 'nurse']
  },
  {
    icon: ClipboardList,
    label: 'pendingTests',
    key: 'pending-tests',
    roles: ['diagnostician']
  }
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { role, language, isRTL } = useApp();

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-56 bg-rak-white dark:bg-gray-900 border-r border-rak-beige-200 dark:border-gray-700 h-full overflow-y-auto shadow-sm">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-rak-beige-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-7 h-7 bg-rak-magenta-600 rounded-md flex items-center justify-center">
            <LayoutDashboard className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Dashboard</h3>
            <p className="text-xs text-rak-beige-600 dark:text-gray-400">Management Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="p-3 space-y-1">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-rak-pink-50 dark:bg-rak-pink-900/20 text-rak-magenta-700 dark:text-rak-magenta-400 border-r-2 rtl:border-r-0 rtl:border-l-2 border-rak-magenta-600 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-rak-pink-50 dark:hover:bg-gray-800 hover:text-rak-magenta-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t(item.label, language)}</span>
            </button>
          );
        })}
      </nav>
      
      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-rak-beige-200 dark:border-gray-700 bg-rak-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-xs text-rak-beige-600 dark:text-gray-400">
            © 2024 RAK Government
          </p>
          <p className="text-xs text-rak-beige-500 dark:text-gray-500">
            All rights reserved
          </p>
        </div>
      </div>
    </aside>
  );
}