import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, ROLE_PERMISSIONS, SESSION_CONFIG } from '../types/auth';

interface AuthStoreState extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshSession: () => void;
  checkSession: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Dr. Ahmed Al Rashid',
    email: 'ahmed.rashid@rak.gov.ae',
    role: 'doctor',
    department: 'Internal Medicine',
    licenseNumber: 'DOC-2024-001',
    avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    permissions: ROLE_PERMISSIONS.doctor,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Nurse Fatima Al Zahra',
    email: 'fatima.zahra@rak.gov.ae',
    role: 'nurse',
    department: 'Emergency',
    licenseNumber: 'NUR-2024-001',
    avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    permissions: ROLE_PERMISSIONS.nurse,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@rak.gov.ae',
    role: 'diagnostician',
    department: 'Radiology',
    licenseNumber: 'RAD-2024-001',
    avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    permissions: ROLE_PERMISSIONS.diagnostician,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Mohammed Al Mansoori',
    email: 'mohammed.mansoori@rak.gov.ae',
    role: 'admin',
    department: 'Administration',
    avatar: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    permissions: ROLE_PERMISSIONS.admin,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Aisha Al Qasimi',
    email: 'aisha.qasimi@rak.gov.ae',
    role: 'receptionist',
    department: 'Front Desk',
    avatar: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    permissions: ROLE_PERMISSIONS.receptionist,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      sessionExpiry: null,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock authentication - in real app, this would call an API
        const user = MOCK_USERS.find(u => u.email === email);
        
        if (user && password === 'password123') {
          const sessionExpiry = Date.now() + (SESSION_CONFIG.TIMEOUT_MINUTES * 60 * 1000);
          const updatedUser = {
            ...user,
            lastLogin: new Date().toISOString()
          };
          
          set({ 
            user: updatedUser, 
            isAuthenticated: true, 
            sessionExpiry,
            isLoading: false 
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          sessionExpiry: null,
          isLoading: false 
        });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          });
        }
      },

      refreshSession: () => {
        const { user, isAuthenticated } = get();
        if (user && isAuthenticated) {
          const sessionExpiry = Date.now() + (SESSION_CONFIG.TIMEOUT_MINUTES * 60 * 1000);
          set({ sessionExpiry });
        }
      },

      checkSession: () => {
        const { sessionExpiry, isAuthenticated } = get();
        if (isAuthenticated && sessionExpiry) {
          const now = Date.now();
          if (now >= sessionExpiry) {
            // Session expired, logout
            get().logout();
          }
        }
      }
    }),
    {
      name: 'rak-hms-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionExpiry: state.sessionExpiry
      })
    }
  )
);