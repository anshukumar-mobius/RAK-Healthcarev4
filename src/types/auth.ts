export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  licenseNumber?: string;
  avatar?: string;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'diagnostician';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiry: number | null;
}

// Role-based permissions configuration
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'patients', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'emr', actions: ['create', 'read', 'update', 'delete', 'amend'] },
    { resource: 'diagnostics', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'billing', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['create', 'read', 'export'] },
    { resource: 'settings', actions: ['read', 'update'] },
    { resource: 'ai-agents', actions: ['read', 'update', 'configure'] }
  ],
  doctor: [
    { resource: 'patients', actions: ['create', 'read', 'update'] },
    { resource: 'appointments', actions: ['create', 'read', 'update'] },
    { resource: 'emr', actions: ['create', 'read', 'update', 'amend'] },
    { resource: 'diagnostics', actions: ['create', 'read', 'update'] },
    { resource: 'prescriptions', actions: ['create', 'read', 'update'] },
    { resource: 'reports', actions: ['read', 'export'] },
    { resource: 'ai-agents', actions: ['read', 'use'] }
  ],
  nurse: [
    { resource: 'patients', actions: ['read', 'update'] },
    { resource: 'appointments', actions: ['read', 'update'] },
    { resource: 'emr', actions: ['create', 'read', 'update'] },
    { resource: 'vital-signs', actions: ['create', 'read', 'update'] },
    { resource: 'medications', actions: ['read', 'administer'] },
    { resource: 'tasks', actions: ['create', 'read', 'update'] },
    { resource: 'ai-agents', actions: ['read', 'use'] }
  ],
  receptionist: [
    { resource: 'patients', actions: ['create', 'read', 'update'] },
    { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'billing', actions: ['create', 'read', 'update'] },
    { resource: 'insurance', actions: ['read', 'verify'] },
    { resource: 'registration', actions: ['create', 'read', 'update'] }
  ],
  diagnostician: [
    { resource: 'patients', actions: ['read'] },
    { resource: 'diagnostics', actions: ['create', 'read', 'update'] },
    { resource: 'lab-results', actions: ['create', 'read', 'update'] },
    { resource: 'imaging', actions: ['create', 'read', 'update'] },
    { resource: 'reports', actions: ['create', 'read'] },
    { resource: 'ai-agents', actions: ['read', 'use'] }
  ]
};

// Dashboard access configuration
export const DASHBOARD_ACCESS: Record<UserRole, string[]> = {
  admin: ['dashboard', 'patients', 'appointments', 'diagnostics', 'billing', 'users', 'reports', 'settings', 'ai-agents'],
  doctor: ['dashboard', 'patients', 'appointments', 'diagnostics', 'prescriptions', 'ai-agents'],
  nurse: ['dashboard', 'patients', 'appointments', 'vital-signs', 'medications', 'tasks', 'ai-agents'],
  receptionist: ['dashboard', 'patients', 'appointments', 'billing', 'registration'],
  diagnostician: ['dashboard', 'patients', 'diagnostics', 'lab-results', 'imaging', 'ai-agents']
};

// Session configuration
export const SESSION_CONFIG = {
  TIMEOUT_MINUTES: 30,
  WARNING_MINUTES: 5,
  REFRESH_THRESHOLD_MINUTES: 10
};