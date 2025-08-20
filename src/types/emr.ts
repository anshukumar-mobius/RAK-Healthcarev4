export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'diagnostician';
  department?: string;
  licenseNumber?: string;
  avatar?: string;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  nationality: string;
  emiratesId: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  emirate: string;
  postalCode?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    coverageType: string;
    copayAmount?: number;
  };
  allergies: string[];
  chronicConditions: string[];
  bloodType?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  preferredLanguage: 'en' | 'ar';
  smokingStatus?: 'never' | 'former' | 'current';
  alcoholConsumption?: 'never' | 'occasional' | 'regular';
  familyHistory: {
    condition: string;
    relationship: string;
    ageOfOnset?: number;
  }[];
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    startDate: string;
    endDate?: string;
    status: 'active' | 'discontinued' | 'completed';
  }[];
  immunizations: {
    vaccine: string;
    date: string;
    provider: string;
    lotNumber?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface EMREntry {
  id: string;
  patientId: string;
  entryType: 'consultation' | 'nursing_note' | 'diagnostic_result' | 'medication' | 'vital_signs' | 'procedure' | 'discharge_summary';
  title: string;
  content: string;
  data?: Record<string, any>; // Structured data based on entry type
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'final' | 'amended';
  attachments?: string[];
  tags?: string[];
  visitId?: string; // Link to specific visit/encounter
  departmentId?: string;
  priority?: 'routine' | 'urgent' | 'emergent';
  followUpRequired?: boolean;
  followUpDate?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  clinicalNotes?: {
    chiefComplaint?: string;
    historyOfPresentIllness?: string;
    reviewOfSystems?: string;
    physicalExamination?: string;
    assessment?: string;
    plan?: string;
    differentialDiagnosis?: string[];
    icdCodes?: string[];
  };
}

export interface VitalSigns {
  temperature: number;
  temperatureUnit: 'celsius' | 'fahrenheit';
  bloodPressure: {
    systolic: number;
    diastolic: number;
    position: 'sitting' | 'standing' | 'lying';
  };
  heartRate: number;
  heartRhythm?: 'regular' | 'irregular';
  respiratoryRate: number;
  oxygenSaturation: number;
  oxygenSupport?: 'room_air' | 'nasal_cannula' | 'mask' | 'ventilator';
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  height?: number;
  heightUnit?: 'cm' | 'inches';
  bmi?: number;
  painScale?: number;
  painLocation?: string;
  painQuality?: string;
  glucoseLevel?: number;
  headCircumference?: number;
  recordedBy: string;
  recordedAt: string;
  notes?: string;
}

export interface Medication {
  name: string;
  genericName?: string;
  brandName?: string;
  dosage: string;
  strength?: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'topical' | 'inhaler' | 'other';
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  indication: string;
  instructions?: string;
  sideEffects?: string[];
  contraindications?: string[];
  interactions?: string[];
  status: 'active' | 'discontinued' | 'completed';
  refillsRemaining?: number;
  pharmacyNotes?: string;
}

export interface DiagnosticTest {
  id: string;
  patientId: string;
  testName: string;
  testType: 'blood' | 'urine' | 'imaging' | 'cardiac' | 'pathology' | 'other';
  testCategory?: string;
  cptCode?: string;
  orderedBy: string;
  orderedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  status: 'ordered' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat';
  clinicalIndication?: string;
  preparationInstructions?: string;
  results?: {
    summary: string;
    details: Record<string, any>;
    normalRanges?: Record<string, string>;
    abnormalFlags?: string[];
    interpretation?: string;
    recommendations?: string;
    attachments?: string[];
  };
  technician?: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reportUrl?: string;
  cost?: number;
  insuranceCovered?: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow_up' | 'procedure' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  chiefComplaint?: string;
  symptoms?: string[];
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  room?: string;
  department?: string;
  estimatedCost?: number;
  insuranceAuthorization?: string;
  referralRequired?: boolean;
  referredBy?: string;
  createdBy: string;
  createdAt: string;
  checkedInAt?: string;
  completedAt?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface Visit {
  id: string;
  patientId: string;
  appointmentId?: string;
  visitType: 'outpatient' | 'inpatient' | 'emergency' | 'procedure';
  admissionDate: string;
  dischargeDate?: string;
  primaryDoctorId: string;
  department: string;
  room?: string;
  bed?: string;
  chiefComplaint: string;
  presentingSymptoms: string[];
  vitalSigns: VitalSigns[];
  diagnoses: {
    primary: string;
    secondary: string[];
    icdCodes: string[];
  };
  procedures: {
    name: string;
    date: string;
    performedBy: string;
    cptCode?: string;
    notes?: string;
  }[];
  medications: Medication[];
  diagnosticTests: string[]; // Test IDs
  emrEntries: string[]; // EMR Entry IDs
  status: 'active' | 'discharged' | 'transferred';
  dischargeInstructions?: string;
  followUpInstructions?: string;
  totalCost?: number;
  insuranceClaim?: {
    claimNumber: string;
    status: 'pending' | 'approved' | 'denied';
    approvedAmount?: number;
  };
}

export interface EMRPermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canAmend: boolean;
  entryTypes: EMREntry['entryType'][];
}

export const ROLE_PERMISSIONS: Record<User['role'], EMRPermissions> = {
  admin: {
    canRead: true,
    canWrite: true,
    canDelete: true,
    canAmend: true,
    entryTypes: ['consultation', 'nursing_note', 'diagnostic_result', 'medication', 'vital_signs', 'procedure', 'discharge_summary']
  },
  doctor: {
    canRead: true,
    canWrite: true,
    canDelete: false,
    canAmend: true,
    entryTypes: ['consultation', 'medication', 'procedure', 'discharge_summary']
  },
  nurse: {
    canRead: true,
    canWrite: true,
    canDelete: false,
    canAmend: false,
    entryTypes: ['nursing_note', 'vital_signs', 'medication']
  },
  diagnostician: {
    canRead: true,
    canWrite: true,
    canDelete: false,
    canAmend: false,
    entryTypes: ['diagnostic_result']
  },
  receptionist: {
    canRead: true,
    canWrite: false,
    canDelete: false,
    canAmend: false,
    entryTypes: []
  }
};