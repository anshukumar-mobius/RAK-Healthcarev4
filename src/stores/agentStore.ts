import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { AIAgent, Recommendation, AutomationRule, AgentTask, ALL_AGENTS } from '../types/agents';

interface AgentState {
  agents: AIAgent[];
  recommendations: Recommendation[];
  automationRules: AutomationRule[];
  tasks: AgentTask[];
  
  // Agent management
  getActiveAgents: () => AIAgent[];
  getAgentsByType: (type: AIAgent['type']) => AIAgent[];
  updateAgentStatus: (agentId: string, status: AIAgent['status']) => void;
  
  // Recommendations
  addRecommendation: (recommendation: Omit<Recommendation, 'id' | 'createdAt'>) => void;
  dismissRecommendation: (recommendationId: string) => void;
  getRecommendationsByPriority: (priority: Recommendation['priority']) => Recommendation[];
  
  // Automation rules
  addAutomationRule: (rule: Omit<AutomationRule, 'id' | 'executionCount'>) => void;
  toggleAutomationRule: (ruleId: string) => void;
  executeAutomationRule: (ruleId: string) => void;
  
  // Tasks
  addTask: (task: Omit<AgentTask, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: AgentTask['status'], result?: any) => void;
  getTasksByAgent: (agentId: string) => AgentTask[];
  
  // AI Actions
  triggerAgentAction: (agentId: string, action: string, data?: any) => void;
  processAgentRecommendations: () => void;
}

// Mock recommendations
const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    type: 'alert',
    priority: 'critical',
    title: 'Critical Drug Interaction Detected',
    description: 'Patient Ahmed Al Rashid has been prescribed Warfarin and Aspirin simultaneously. High bleeding risk detected.',
    action: 'Review medication list and consult with prescribing physician',
    confidence: 94,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    agentId: 'clinical-decision-support'
  },
  {
    id: '2',
    type: 'suggestion',
    priority: 'high',
    title: 'Optimize Appointment Schedule',
    description: 'Current schedule has 3 consecutive 15-minute gaps. Consolidating could reduce patient wait times by 23%.',
    action: 'Reschedule appointments to optimize flow',
    confidence: 87,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    agentId: 'scheduling-optimizer'
  },
  {
    id: '3',
    type: 'optimization',
    priority: 'medium',
    title: 'Inventory Reorder Suggestion',
    description: 'Surgical gloves inventory will reach minimum threshold in 3 days based on current usage patterns.',
    action: 'Place order for 500 boxes of surgical gloves',
    confidence: 91,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    agentId: 'inventory-management'
  },
  {
    id: '4',
    type: 'alert',
    priority: 'high',
    title: 'High Readmission Risk Patient',
    description: 'Patient Sarah Johnson has 78% probability of readmission within 30 days based on clinical indicators.',
    action: 'Schedule follow-up appointment and home care assessment',
    confidence: 82,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    agentId: 'readmission-predictor'
  }
];

// Mock automation rules
const MOCK_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: '1',
    name: 'Auto-schedule Follow-up Appointments',
    trigger: 'patient_discharge',
    conditions: [
      { field: 'diagnosis', operator: 'contains', value: 'chronic' },
      { field: 'length_of_stay', operator: 'greater_than', value: 3 }
    ],
    actions: [
      { type: 'schedule_appointment', delay: '7_days' },
      { type: 'send_reminder', template: 'follow_up_reminder' }
    ],
    enabled: true,
    executionCount: 23,
    lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: 'Critical Lab Value Alerts',
    trigger: 'lab_result_received',
    conditions: [
      { field: 'result_value', operator: 'outside_critical_range', value: true }
    ],
    actions: [
      { type: 'notify_physician', urgency: 'immediate' },
      { type: 'flag_patient_chart', priority: 'critical' }
    ],
    enabled: true,
    executionCount: 156,
    lastTriggered: new Date(Date.now() - 7 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Bed Management Optimization',
    trigger: 'bed_occupancy_threshold',
    conditions: [
      { field: 'occupancy_rate', operator: 'greater_than', value: 85 }
    ],
    actions: [
      { type: 'identify_discharge_candidates', priority: 'high' },
      { type: 'notify_bed_management', urgency: 'normal' }
    ],
    enabled: true,
    executionCount: 45,
    lastTriggered: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

export const useAgentStore = create<AgentState>()(
  persist(
    immer((set, get) => ({
      agents: ALL_AGENTS,
      recommendations: MOCK_RECOMMENDATIONS,
      automationRules: MOCK_AUTOMATION_RULES,
      tasks: [],

      getActiveAgents: () => {
        return get().agents.filter(agent => agent.status === 'active');
      },

      getAgentsByType: (type) => {
        return get().agents.filter(agent => agent.type === type);
      },

      updateAgentStatus: (agentId, status) => {
        set((state) => {
          const agent = state.agents.find(a => a.id === agentId);
          if (agent) {
            agent.status = status;
          }
        });
      },

      addRecommendation: (recommendationData) => {
        const recommendation: Recommendation = {
          ...recommendationData,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        };
        
        set((state) => {
          state.recommendations.unshift(recommendation);
        });
      },

      dismissRecommendation: (recommendationId) => {
        set((state) => {
          const index = state.recommendations.findIndex(r => r.id === recommendationId);
          if (index !== -1) {
            state.recommendations.splice(index, 1);
          }
        });
      },

      getRecommendationsByPriority: (priority) => {
        return get().recommendations.filter(rec => rec.priority === priority);
      },

      addAutomationRule: (ruleData) => {
        const rule: AutomationRule = {
          ...ruleData,
          id: uuidv4(),
          executionCount: 0
        };
        
        set((state) => {
          state.automationRules.push(rule);
        });
      },

      toggleAutomationRule: (ruleId) => {
        set((state) => {
          const rule = state.automationRules.find(r => r.id === ruleId);
          if (rule) {
            rule.enabled = !rule.enabled;
          }
        });
      },

      executeAutomationRule: (ruleId) => {
        set((state) => {
          const rule = state.automationRules.find(r => r.id === ruleId);
          if (rule) {
            rule.executionCount += 1;
            rule.lastTriggered = new Date().toISOString();
          }
        });
      },

      addTask: (taskData) => {
        const task: AgentTask = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        };
        
        set((state) => {
          state.tasks.push(task);
        });
      },

      updateTaskStatus: (taskId, status, result) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === taskId);
          if (task) {
            task.status = status;
            if (result) task.result = result;
            if (status === 'completed' || status === 'failed') {
              task.completedAt = new Date().toISOString();
            }
          }
        });
      },

      getTasksByAgent: (agentId) => {
        return get().tasks.filter(task => task.agentId === agentId);
      },

      triggerAgentAction: (agentId, action, data) => {
        const agent = get().agents.find(a => a.id === agentId);
        if (agent) {
          set((state) => {
            const agentToUpdate = state.agents.find(a => a.id === agentId);
            if (agentToUpdate) {
              agentToUpdate.status = 'processing';
              agentToUpdate.lastAction = action;
              agentToUpdate.lastActionTime = 'Just now';
            }
          });

          get().addTask({
            agentId,
            type: action,
            status: 'processing',
            priority: 'medium',
            data: data || {}
          });

          setTimeout(() => {
            set((state) => {
              const agentToUpdate = state.agents.find(a => a.id === agentId);
              if (agentToUpdate) {
                agentToUpdate.status = 'active';
              }
            });
          }, 2000);
        }
      },

      processAgentRecommendations: () => {
        // Process and apply agent recommendations to the system
        const recommendations = get().recommendations;
        const criticalRecs = recommendations.filter(r => r.priority === 'critical');
        
        // Auto-process certain types of recommendations
        criticalRecs.forEach(rec => {
          if (rec.type === 'alert' && rec.agentId === 'clinical-decision-support') {
            // Automatically flag patient charts for critical drug interactions
            console.log('Auto-flagging patient chart for:', rec.title);
          }
        });
      }
    })),
    {
      name: 'rak-hms-agents',
      partialize: (state) => ({
        agents: state.agents,
        recommendations: state.recommendations,
        automationRules: state.automationRules,
        tasks: state.tasks
      })
    }
  )
);