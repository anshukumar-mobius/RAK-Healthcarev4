import { useLocation, useNavigate } from 'react-router-dom';
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
  ClipboardList,
  Bot,
  Settings,
  FileText,
  Target,
  type LucideIcon
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  roles: string[];
  priority?: number;
  section?: string;
}

// Priority-based menu items for nurses
const nursingMenuItems: MenuItem[] = [
  // High Priority - Patient Care
  {
    icon: LayoutDashboard,
    label: 'dashboard',
    path: '/dashboard',
    roles: ['nurse'],
    priority: 1,
    section: 'Patient Care'
  },
  {
    icon: Users,
    label: 'patients',
    path: '/patients',
    roles: ['nurse'],
    priority: 1,
    section: 'Patient Care'
  },
  {
    icon: Activity,
    label: 'vitalSigns',
    path: '/vitals',
    roles: ['nurse'],
    priority: 1,
    section: 'Patient Care'
  },
  {
    icon: CheckSquare,
    label: 'myTasks',
    path: '/tasks',
    roles: ['nurse'],
    priority: 1,
    section: 'Patient Care'
  },
  
  // Medium Priority - Documentation
  {
    icon: FileText,
    label: 'dischargeSummary',
    path: '/discharge-summary/V001',
    roles: ['nurse'],
    priority: 2,
    section: 'Documentation'
  },
  {
    icon: ClipboardList,
    label: 'nursingNotes',
    path: '/nursing-notes/V001',
    roles: ['nurse'],
    priority: 2,
    section: 'Documentation'
  },
  {
    icon: Target,
    label: 'carePlan',
    path: '/care-plan/V001',
    roles: ['nurse'],
    priority: 2,
    section: 'Documentation'
  },
  
  // Lower Priority - Management
  {
    icon: Calendar,
    label: 'appointments',
    path: '/appointments',
    roles: ['nurse'],
    priority: 3,
    section: 'Management'
  },
  {
    icon: Bed,
    label: 'bedOccupancy',
    path: '/beds',
    roles: ['nurse'],
    priority: 3,
    section: 'Management'
  },
  {
    icon: Bot,
    label: 'AI Agents',
    path: '/ai-agents',
    roles: ['nurse'],
    priority: 4,
    section: 'Tools'
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    roles: ['nurse'],
    priority: 4,
    section: 'Tools'
  }
];

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'dashboard',
    path: '/dashboard',
    roles: ['admin', 'doctor', 'receptionist', 'diagnostician']
  },
  {
    icon: Users,
    label: 'patients',
    path: '/patients',
    roles: ['admin', 'doctor', 'receptionist']
  },
  {
    icon: Calendar,
    label: 'appointments',
    path: '/appointments',
    roles: ['admin', 'doctor', 'receptionist']
  },
  {
    icon: FlaskConical,
    label: 'diagnostics',
    path: '/diagnostics',
    roles: ['admin', 'doctor', 'diagnostician']
  },
  {
    icon: CreditCard,
    label: 'billing',
    path: '/billing',
    roles: ['admin', 'receptionist']
  },
  {
    icon: CheckSquare,
    label: 'myTasks',
    path: '/tasks',
    roles: ['doctor']
  },
  {
    icon: UserPlus,
    label: 'patientRegistration',
    path: '/registration',
    roles: ['receptionist']
  },
  {
    icon: Bed,
    label: 'bedOccupancy',
    path: '/beds',
    roles: ['admin']
  },
  {
    icon: ClipboardList,
    label: 'pendingTests',
    path: '/pending-tests',
    roles: ['diagnostician']
  },
  {
    icon: Bot,
    label: 'AI Agents',
    path: '/ai-agents',
    roles: ['admin', 'doctor', 'receptionist', 'diagnostician']
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    roles: ['admin', 'doctor', 'nurse', 'receptionist', 'diagnostician']
  }
];
export function Sidebar() {
  const { language } = useApp();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  // For nurses, use priority-based structure; for others, use regular filtering
  const getMenuItems = () => {
    if (user.role === 'nurse') {
      // Group nursing items by section for priority display
      const sections = nursingMenuItems.reduce((acc, item) => {
        const sectionKey = item.section || 'Other';
        if (!acc[sectionKey]) {
          acc[sectionKey] = [];
        }
        acc[sectionKey].push(item);
        return acc;
      }, {} as Record<string, typeof nursingMenuItems>);
      
      // Return sections in priority order
      return [
        { title: 'Patient Care', items: sections['Patient Care'] || [] },
        { title: 'Documentation', items: sections['Documentation'] || [] },
        { title: 'Management', items: sections['Management'] || [] },
        { title: 'Tools', items: sections['Tools'] || [] }
      ];
    } else {
      // For other roles, use regular menu items
      const filteredItems = menuItems.filter(item => 
        item.roles.includes(user.role)
      );
      return [{ title: '', items: filteredItems }];
    }
  };  const menuSections = getMenuItems();

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
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {/* Section title for nurses */}
            {section.title && user.role === 'nurse' && (
              <div className="px-2 py-1 mb-2">
                <h4 className="text-xs font-medium text-rak-beige-600 dark:text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h4>
              </div>
            )}
            
            {/* Menu items */}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-rak-pink-50 dark:bg-rak-pink-900/20 text-rak-magenta-700 dark:text-rak-magenta-400 border-r-2 rtl:border-r-0 rtl:border-l-2 border-rak-magenta-600 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-rak-pink-50 dark:hover:bg-gray-800 hover:text-rak-magenta-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t(item.label, language)} {user.role === 'admin' && item.path === '/settings' && '⚙️'}</span>
                </button>
              );
            })}
            
            {/* Add section separator for nurses except for last section */}
            {user.role === 'nurse' && sectionIndex < menuSections.length - 1 && (
              <div className="my-3 border-b border-rak-beige-200 dark:border-gray-700"></div>
            )}
          </div>
        ))}
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