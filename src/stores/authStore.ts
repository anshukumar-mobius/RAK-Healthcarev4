import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/emr';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
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
    avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '2',
    name: 'Nurse Fatima Al Zahra',
    email: 'fatima.zahra@rak.gov.ae',
    role: 'nurse',
    department: 'Emergency',
    licenseNumber: 'NUR-2024-001',
    avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '3',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@rak.gov.ae',
    role: 'diagnostician',
    department: 'Radiology',
    licenseNumber: 'RAD-2024-001',
    avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '4',
    name: 'Mohammed Al Mansoori',
    email: 'mohammed.mansoori@rak.gov.ae',
    role: 'admin',
    department: 'Administration',
    avatar: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '5',
    name: 'Aisha Al Qasimi',
    email: 'aisha.qasimi@rak.gov.ae',
    role: 'receptionist',
    department: 'Front Desk',
    avatar: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication - in real app, this would call an API
        const user = MOCK_USERS.find(u => u.email === email);
        
        if (user && password === 'password123') {
          set({ user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      }
    }),
    {
      name: 'rak-hms-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);