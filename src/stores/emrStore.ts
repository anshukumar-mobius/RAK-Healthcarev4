import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { Patient, EMREntry, DiagnosticTest, Appointment, VitalSigns, Medication, Visit } from '../types/emr';

interface EMRState {
  patients: Patient[];
  emrEntries: EMREntry[];
  diagnosticTests: DiagnosticTest[];
  appointments: Appointment[];
  visits: Visit[];
  
  // Patient management
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  getPatient: (id: string) => Patient | undefined;
  searchPatients: (query: string) => Patient[];
  
  // EMR entries
  addEMREntry: (entry: Omit<EMREntry, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateEMREntry: (id: string, updates: Partial<EMREntry>) => void;
  getPatientEMREntries: (patientId: string) => EMREntry[];
  deleteEMREntry: (id: string) => void;
  
  // Diagnostic tests
  addDiagnosticTest: (test: Omit<DiagnosticTest, 'id'>) => string;
  updateDiagnosticTest: (id: string, updates: Partial<DiagnosticTest>) => void;
  getPatientDiagnosticTests: (patientId: string) => DiagnosticTest[];
  
  // Appointments
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => string;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  getPatientAppointments: (patientId: string) => Appointment[];
  getDoctorAppointments: (doctorId: string, date?: string) => Appointment[];
  
  // Visits
  addVisit: (visit: Omit<Visit, 'id'>) => string;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  getPatientVisits: (patientId: string) => Visit[];
  getActiveVisits: () => Visit[];
  
  // Utility functions
  generateMRN: () => string;
}

// Mock data
const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    mrn: 'RAK-2024-001',
    firstName: 'Ahmed',
    lastName: 'Al Rashid',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    nationality: 'UAE',
    emiratesId: '784-1985-1234567-1',
    phone: '+971-50-123-4567',
    email: 'ahmed.rashid@email.com',
    address: 'Al Nakheel, Ras Al Khaimah, UAE',
    city: 'Ras Al Khaimah',
    emirate: 'Ras Al Khaimah',
    postalCode: '12345',
    emergencyContact: {
      name: 'Fatima Al Rashid',
      relationship: 'Wife',
      phone: '+971-50-765-4321',
      email: 'fatima.rashid@email.com',
      address: 'Same as patient'
    },
    insurance: {
      provider: 'ADNIC',
      policyNumber: 'ADN-2024-789',
      expiryDate: '2024-12-31',
      coverageType: 'Comprehensive',
      copayAmount: 50
    },
    allergies: ['Penicillin', 'Shellfish'],
    chronicConditions: ['Hypertension'],
    bloodType: 'O+',
    maritalStatus: 'married',
    occupation: 'Engineer',
    preferredLanguage: 'ar',
    smokingStatus: 'never',
    alcoholConsumption: 'never',
    familyHistory: [
      { condition: 'Diabetes Type 2', relationship: 'Father', ageOfOnset: 55 },
      { condition: 'Hypertension', relationship: 'Mother', ageOfOnset: 60 }
    ],
    currentMedications: [
      {
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        brandName: 'Prinivil',
        dosage: '10mg',
        strength: '10mg',
        form: 'tablet',
        frequency: 'Once daily',
        route: 'Oral',
        startDate: '2024-01-01',
        prescribedBy: 'Dr. Sarah Ahmed',
        indication: 'Hypertension',
        instructions: 'Take with food',
        status: 'active',
        refillsRemaining: 3
      }
    ],
    immunizations: [
      { vaccine: 'COVID-19 (Pfizer)', date: '2023-10-15', provider: 'RAK Hospital', lotNumber: 'PF123456' },
      { vaccine: 'Influenza', date: '2023-09-01', provider: 'RAK Hospital' }
    ],
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-07T10:30:00Z'
  },
  {
    id: '2',
    mrn: 'RAK-2024-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1992-07-22',
    gender: 'female',
    nationality: 'UK',
    emiratesId: '784-1992-2345678-2',
    phone: '+971-55-987-6543',
    email: 'sarah.johnson@email.com',
    address: 'Al Hamra Village, Ras Al Khaimah, UAE',
    city: 'Ras Al Khaimah',
    emirate: 'Ras Al Khaimah',
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Husband',
      phone: '+971-55-123-9876',
      email: 'michael.johnson@email.com'
    },
    insurance: {
      provider: 'Daman',
      policyNumber: 'DAM-2024-456',
      expiryDate: '2024-11-30',
      coverageType: 'Basic',
      copayAmount: 100
    },
    allergies: [],
    chronicConditions: ['Diabetes Type 2'],
    bloodType: 'A+',
    maritalStatus: 'married',
    occupation: 'Teacher',
    preferredLanguage: 'en',
    smokingStatus: 'never',
    alcoholConsumption: 'occasional',
    familyHistory: [
      { condition: 'Diabetes Type 2', relationship: 'Mother', ageOfOnset: 45 }
    ],
    currentMedications: [
      {
        name: 'Metformin',
        genericName: 'Metformin HCl',
        brandName: 'Glucophage',
        dosage: '500mg',
        strength: '500mg',
        form: 'tablet',
        frequency: 'Twice daily',
        route: 'Oral',
        startDate: '2023-06-01',
        prescribedBy: 'Dr. Ahmed Al Rashid',
        indication: 'Diabetes Type 2',
        instructions: 'Take with meals',
        status: 'active',
        refillsRemaining: 2
      }
    ],
    immunizations: [
      { vaccine: 'COVID-19 (Moderna)', date: '2023-11-01', provider: 'RAK Hospital' }
    ],
    createdAt: '2024-01-02T09:15:00Z',
    updatedAt: '2024-01-06T14:20:00Z'
  }
];

const MOCK_EMR_ENTRIES: EMREntry[] = [
  {
    id: '1',
    patientId: '1',
    entryType: 'consultation',
    title: 'Annual Physical Examination',
    content: 'Patient presents for routine annual physical. No acute complaints. Blood pressure elevated at 145/90. Discussed lifestyle modifications and medication compliance.',
    data: {
      chiefComplaint: 'Routine checkup',
      assessment: 'Hypertension, well controlled',
      plan: 'Continue current medications, lifestyle counseling'
    },
    clinicalNotes: {
      chiefComplaint: 'Annual physical examination - no acute complaints',
      historyOfPresentIllness: 'Patient reports feeling well overall. Denies chest pain, shortness of breath, or palpitations. Blood pressure has been well controlled on current medication regimen.',
      reviewOfSystems: 'Constitutional: No fever, chills, or weight loss. Cardiovascular: No chest pain or palpitations. Respiratory: No shortness of breath or cough. GI: No nausea, vomiting, or abdominal pain.',
      physicalExamination: 'Vital Signs: BP 145/90, HR 72, RR 16, Temp 98.6°F, O2 Sat 98% on RA. General: Well-appearing male in no acute distress. HEENT: Normocephalic, atraumatic. Cardiovascular: Regular rate and rhythm, no murmurs. Lungs: Clear to auscultation bilaterally.',
      assessment: 'Hypertension, well controlled on current regimen',
      plan: '1. Continue Lisinopril 10mg daily\n2. Lifestyle modifications - diet and exercise\n3. Follow-up in 6 months\n4. Annual labs ordered',
      icdCodes: ['I10 - Essential hypertension']
    },
    visitId: 'V001',
    departmentId: 'INTERNAL_MED',
    priority: 'routine',
    followUpRequired: true,
    followUpDate: '2024-07-07',
    createdBy: '1',
    createdAt: '2024-01-07T09:00:00Z',
    updatedAt: '2024-01-07T09:00:00Z',
    status: 'final',
    tags: ['routine', 'hypertension']
  },
  {
    id: '2',
    patientId: '1',
    entryType: 'vital_signs',
    title: 'Vital Signs Assessment',
    content: 'Routine vital signs taken during consultation',
    data: {
      temperature: 36.8,
      temperatureUnit: 'celsius',
      bloodPressure: { systolic: 145, diastolic: 90 },
      heartRate: 72,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      weight: 78.5,
      height: 175,
      bmi: 25.6,
      painScale: 0,
      recordedBy: 'Nurse Fatima Al Zahra',
      recordedAt: '2024-01-07T08:45:00Z',
      notes: 'Patient comfortable, no distress'
    },
    visitId: 'V001',
    priority: 'routine',
    createdBy: '2',
    createdAt: '2024-01-07T08:45:00Z',
    updatedAt: '2024-01-07T08:45:00Z',
    status: 'final'
  },
  {
    id: '3',
    patientId: '2',
    entryType: 'consultation',
    title: 'Diabetes Follow-up Visit',
    content: 'Patient presents for routine diabetes follow-up. Reports good glucose control with current medication. No hypoglycemic episodes.',
    clinicalNotes: {
      chiefComplaint: 'Diabetes follow-up',
      historyOfPresentIllness: 'Patient with Type 2 diabetes on Metformin 500mg BID. Reports good adherence to medication and diet. Home glucose readings averaging 120-140 mg/dL. No episodes of hypoglycemia.',
      reviewOfSystems: 'No polyuria, polydipsia, or polyphagia. No visual changes. No numbness or tingling in extremities.',
      physicalExamination: 'Vital Signs: BP 128/82, HR 68, RR 14, Temp 98.4°F. General: Well-appearing female. Feet: No ulcers or deformities, pulses intact.',
      assessment: 'Type 2 diabetes mellitus, well controlled',
      plan: '1. Continue Metformin 500mg BID\n2. HbA1c ordered\n3. Continue current diet and exercise\n4. Follow-up in 3 months',
      icdCodes: ['E11.9 - Type 2 diabetes mellitus without complications']
    },
    visitId: 'V002',
    departmentId: 'ENDOCRINOLOGY',
    priority: 'routine',
    followUpRequired: true,
    followUpDate: '2024-04-06',
    createdBy: '1',
    createdAt: '2024-01-06T14:20:00Z',
    updatedAt: '2024-01-06T14:20:00Z',
    status: 'final',
    tags: ['diabetes', 'follow-up']
  }
];

export const useEMRStore = create<EMRState>()(
  persist(
    immer((set, get) => ({
      patients: MOCK_PATIENTS,
      emrEntries: MOCK_EMR_ENTRIES,
      diagnosticTests: [],
      appointments: [],
      visits: [],

      generateMRN: () => {
        const year = new Date().getFullYear();
        const count = get().patients.length + 1;
        return `RAK-${year}-${count.toString().padStart(3, '0')}`;
      },

      addPatient: (patientData) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        
        set((state) => {
          const patient: Patient = {
            ...patientData,
            id,
            mrn: state.generateMRN(),
            createdAt: now,
            updatedAt: now
          };
          state.patients.push(patient);
        });
        
        return id;
      },

      updatePatient: (id, updates) => {
        set((state) => {
          const patient = state.patients.find(p => p.id === id);
          if (patient) {
            Object.assign(patient, updates, { updatedAt: new Date().toISOString() });
          }
        });
      },

      getPatient: (id) => {
        return get().patients.find(p => p.id === id);
      },

      searchPatients: (query) => {
        const patients = get().patients;
        const lowercaseQuery = query.toLowerCase();
        
        return patients.filter(patient =>
          patient.firstName.toLowerCase().includes(lowercaseQuery) ||
          patient.lastName.toLowerCase().includes(lowercaseQuery) ||
          patient.mrn.toLowerCase().includes(lowercaseQuery) ||
          patient.emiratesId.includes(query) ||
          patient.phone.includes(query)
        );
      },

      addEMREntry: (entryData) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        
        set((state) => {
          const entry: EMREntry = {
            ...entryData,
            id,
            createdAt: now,
            updatedAt: now
          };
          state.emrEntries.push(entry);
        });
        
        return id;
      },

      updateEMREntry: (id, updates) => {
        set((state) => {
          const entry = state.emrEntries.find(e => e.id === id);
          if (entry) {
            Object.assign(entry, updates, { updatedAt: new Date().toISOString() });
          }
        });
      },

      getPatientEMREntries: (patientId) => {
        return get().emrEntries
          .filter(entry => entry.patientId === patientId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      deleteEMREntry: (id) => {
        set((state) => {
          const index = state.emrEntries.findIndex(e => e.id === id);
          if (index !== -1) {
            state.emrEntries.splice(index, 1);
          }
        });
      },

      addDiagnosticTest: (testData) => {
        const id = uuidv4();
        
        set((state) => {
          const test: DiagnosticTest = {
            ...testData,
            id
          };
          state.diagnosticTests.push(test);
        });
        
        return id;
      },

      updateDiagnosticTest: (id, updates) => {
        set((state) => {
          const test = state.diagnosticTests.find(t => t.id === id);
          if (test) {
            Object.assign(test, updates);
          }
        });
      },

      getPatientDiagnosticTests: (patientId) => {
        // Note: We need to link diagnostic tests to patients through EMR entries or appointments
        return get().diagnosticTests.filter(test => {
          // This is a simplified approach - in a real system, you'd have proper patient linking
          const patient = get().getPatient(patientId);
          return patient && (test.orderedBy === patient.id || test.id.includes(patientId));
        });
      },

      addAppointment: (appointmentData) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        
        set((state) => {
          const appointment: Appointment = {
            ...appointmentData,
            id,
            createdAt: now
          };
          state.appointments.push(appointment);
        });
        
        return id;
      },

      updateAppointment: (id, updates) => {
        set((state) => {
          const appointment = state.appointments.find(a => a.id === id);
          if (appointment) {
            Object.assign(appointment, updates);
          }
        });
      },

      getPatientAppointments: (patientId) => {
        return get().appointments
          .filter(apt => apt.patientId === patientId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getDoctorAppointments: (doctorId, date) => {
        const appointments = get().appointments.filter(apt => apt.doctorId === doctorId);
        
        if (date) {
          return appointments.filter(apt => apt.date === date);
        }
        
        return appointments;
      },

      addVisit: (visitData) => {
        const id = uuidv4();
        
        set((state) => {
          const visit: Visit = {
            ...visitData,
            id
          };
          state.visits.push(visit);
        });
        
        return id;
      },

      updateVisit: (id, updates) => {
        set((state) => {
          const visit = state.visits.find(v => v.id === id);
          if (visit) {
            Object.assign(visit, updates);
          }
        });
      },

      getPatientVisits: (patientId) => {
        return get().visits
          .filter(visit => visit.patientId === patientId)
          .sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime());
      },

      getActiveVisits: () => {
        return get().visits.filter(visit => visit.status === 'active');
      }
    })),
    {
      name: 'rak-hms-emr',
      partialize: (state) => ({
        patients: state.patients,
        emrEntries: state.emrEntries,
        diagnosticTests: state.diagnosticTests,
        appointments: state.appointments,
        visits: state.visits
      })
    }
  )
);