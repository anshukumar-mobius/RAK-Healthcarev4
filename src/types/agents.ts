export interface AIAgent {
  id: string;
  name: string;
  type: 'clinical' | 'administrative' | 'operational' | 'predictive' | 'diagnostic';
  status: 'active' | 'idle' | 'processing' | 'offline';
  capabilities: string[];
  lastAction?: string;
  lastActionTime?: string;
  confidence?: number;
  recommendations?: Recommendation[];
}

export interface Recommendation {
  id: string;
  type: 'alert' | 'suggestion' | 'action' | 'optimization';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action?: string;
  data?: any;
  confidence: number;
  createdAt: string;
  agentId: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: any[];
  actions: any[];
  enabled: boolean;
  lastTriggered?: string;
  executionCount: number;
}

export interface AgentTask {
  id: string;
  agentId: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  result?: any;
  createdAt: string;
  completedAt?: string;
}

// Clinical AI Agents
export const CLINICAL_AGENTS: AIAgent[] = [
  {
    id: 'clinical-decision-support',
    name: 'Clinical Decision Support Agent',
    type: 'clinical',
    status: 'active',
    capabilities: [
      'Drug interaction checking',
      'Allergy alerts',
      'Diagnosis suggestions',
      'Treatment recommendations',
      'Clinical guideline compliance'
    ],
    lastAction: 'Flagged potential drug interaction for Patient #RAK-2024-001',
    lastActionTime: '2 minutes ago',
    confidence: 94
  },
  {
    id: 'vital-signs-monitor',
    name: 'Vital Signs Monitoring Agent',
    type: 'clinical',
    status: 'active',
    capabilities: [
      'Real-time vital signs analysis',
      'Early warning system',
      'Trend analysis',
      'Critical value alerts',
      'Sepsis prediction'
    ],
    lastAction: 'Detected abnormal heart rate pattern in ICU Room 205',
    lastActionTime: '5 minutes ago',
    confidence: 89
  },
  {
    id: 'medication-management',
    name: 'Medication Management Agent',
    type: 'clinical',
    status: 'active',
    capabilities: [
      'Medication reconciliation',
      'Dosage optimization',
      'Adherence monitoring',
      'Side effect prediction',
      'Pharmacy integration'
    ],
    lastAction: 'Optimized insulin dosage for diabetic patient',
    lastActionTime: '12 minutes ago',
    confidence: 92
  }
];

// Administrative AI Agents
export const ADMINISTRATIVE_AGENTS: AIAgent[] = [
  {
    id: 'scheduling-optimizer',
    name: 'Smart Scheduling Agent',
    type: 'administrative',
    status: 'active',
    capabilities: [
      'Appointment optimization',
      'Resource allocation',
      'Wait time reduction',
      'No-show prediction',
      'Staff scheduling'
    ],
    lastAction: 'Rescheduled 3 appointments to reduce wait times',
    lastActionTime: '8 minutes ago',
    confidence: 87
  },
  {
    id: 'billing-automation',
    name: 'Billing Automation Agent',
    type: 'administrative',
    status: 'active',
    capabilities: [
      'Automated billing generation',
      'Insurance claim processing',
      'Payment tracking',
      'Revenue optimization',
      'Compliance checking'
    ],
    lastAction: 'Processed 45 insurance claims automatically',
    lastActionTime: '15 minutes ago',
    confidence: 96
  },
  {
    id: 'patient-flow',
    name: 'Patient Flow Optimization Agent',
    type: 'administrative',
    status: 'active',
    capabilities: [
      'Bed management',
      'Discharge planning',
      'Transfer coordination',
      'Capacity planning',
      'Bottleneck identification'
    ],
    lastAction: 'Identified discharge opportunity in Ward B',
    lastActionTime: '3 minutes ago',
    confidence: 91
  }
];

// Operational AI Agents
export const OPERATIONAL_AGENTS: AIAgent[] = [
  {
    id: 'inventory-management',
    name: 'Inventory Management Agent',
    type: 'operational',
    status: 'active',
    capabilities: [
      'Stock level monitoring',
      'Automated reordering',
      'Expiry tracking',
      'Usage prediction',
      'Cost optimization'
    ],
    lastAction: 'Reordered surgical supplies - low stock detected',
    lastActionTime: '20 minutes ago',
    confidence: 93
  },
  {
    id: 'equipment-maintenance',
    name: 'Equipment Maintenance Agent',
    type: 'operational',
    status: 'active',
    capabilities: [
      'Predictive maintenance',
      'Performance monitoring',
      'Failure prediction',
      'Maintenance scheduling',
      'Compliance tracking'
    ],
    lastAction: 'Scheduled preventive maintenance for MRI Scanner 2',
    lastActionTime: '1 hour ago',
    confidence: 88
  },
  {
    id: 'quality-assurance',
    name: 'Quality Assurance Agent',
    type: 'operational',
    status: 'active',
    capabilities: [
      'Quality metrics monitoring',
      'Compliance checking',
      'Incident detection',
      'Performance analysis',
      'Improvement suggestions'
    ],
    lastAction: 'Generated quality improvement report for Emergency Dept',
    lastActionTime: '30 minutes ago',
    confidence: 85
  }
];

// Predictive AI Agents
export const PREDICTIVE_AGENTS: AIAgent[] = [
  {
    id: 'readmission-predictor',
    name: 'Readmission Prediction Agent',
    type: 'predictive',
    status: 'active',
    capabilities: [
      '30-day readmission risk',
      'Discharge planning optimization',
      'Follow-up scheduling',
      'Risk factor identification',
      'Intervention recommendations'
    ],
    lastAction: 'Identified high readmission risk for Patient #RAK-2024-089',
    lastActionTime: '45 minutes ago',
    confidence: 82
  },
  {
    id: 'demand-forecasting',
    name: 'Demand Forecasting Agent',
    type: 'predictive',
    status: 'active',
    capabilities: [
      'Patient volume prediction',
      'Seasonal trend analysis',
      'Resource planning',
      'Staffing optimization',
      'Capacity management'
    ],
    lastAction: 'Predicted 15% increase in ER visits next week',
    lastActionTime: '2 hours ago',
    confidence: 79
  }
];

// Diagnostic AI Agents
export const DIAGNOSTIC_AGENTS: AIAgent[] = [
  {
    id: 'radiology-ai',
    name: 'Radiology AI Assistant',
    type: 'diagnostic',
    status: 'active',
    capabilities: [
      'Image analysis',
      'Abnormality detection',
      'Report generation',
      'Priority scoring',
      'Second opinion'
    ],
    lastAction: 'Analyzed chest X-ray - no abnormalities detected',
    lastActionTime: '10 minutes ago',
    confidence: 96
  },
  {
    id: 'lab-results-ai',
    name: 'Lab Results Analysis Agent',
    type: 'diagnostic',
    status: 'active',
    capabilities: [
      'Result interpretation',
      'Critical value detection',
      'Trend analysis',
      'Reference range checking',
      'Clinical correlation'
    ],
    lastAction: 'Flagged critical glucose level in Patient #RAK-2024-156',
    lastActionTime: '7 minutes ago',
    confidence: 98
  }
];

export const ALL_AGENTS = [
  ...CLINICAL_AGENTS,
  ...ADMINISTRATIVE_AGENTS,
  ...OPERATIONAL_AGENTS,
  ...PREDICTIVE_AGENTS,
  ...DIAGNOSTIC_AGENTS
];