import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Brain, 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Shield,
  Lightbulb,
  Target,
  Cpu,
  Database,
  Network
} from 'lucide-react';
import { useAgentStore } from '../../stores/agentStore';
import { useApp } from '../../contexts/AppContext';
import { AIAgent, Recommendation } from '../../types/agents';

const agentTypeIcons = {
  clinical: Shield,
  administrative: BarChart3,
  operational: Settings,
  predictive: TrendingUp,
  diagnostic: Brain
};

const agentTypeColors = {
  clinical: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  administrative: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  operational: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  predictive: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  diagnostic: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
};

const statusIcons = {
  active: Activity,
  idle: Clock,
  processing: Cpu,
  offline: AlertTriangle
};

const statusColors = {
  active: 'text-green-500',
  idle: 'text-yellow-500',
  processing: 'text-blue-500',
  offline: 'text-red-500'
};

const priorityColors = {
  critical: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200',
  high: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 border-orange-200',
  medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200',
  low: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200'
};

export function AgentDashboard() {
  const { language } = useApp();
  const { 
    agents, 
    recommendations, 
    automationRules,
    updateAgentStatus,
    dismissRecommendation,
    triggerAgentAction,
    simulateAgentActivity
  } = useAgentStore();

  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [autoSimulation, setAutoSimulation] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoSimulation) {
      interval = setInterval(() => {
        simulateAgentActivity();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoSimulation, simulateAgentActivity]);

  const activeAgents = agents.filter(agent => agent.status === 'active');
  const criticalRecommendations = recommendations.filter(rec => rec.priority === 'critical');
  const enabledRules = automationRules.filter(rule => rule.enabled);

  const handleAgentToggle = (agent: AIAgent) => {
    const newStatus = agent.status === 'active' ? 'idle' : 'active';
    updateAgentStatus(agent.id, newStatus);
  };

  const handleTriggerAction = (agentId: string, action: string) => {
    triggerAgentAction(agentId, action);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Bot className="w-8 h-8 mr-3 text-rak-magenta-600" />
            AI Agents & Automation
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent automation and AI-powered healthcare assistance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoSimulation(!autoSimulation)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              autoSimulation 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {autoSimulation ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{autoSimulation ? 'Stop Simulation' : 'Start Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-rak-white dark:bg-gray-800 p-4 rounded-lg border border-rak-beige-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rak-beige-600 dark:text-gray-400">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeAgents.length}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-rak-white dark:bg-gray-800 p-4 rounded-lg border border-rak-beige-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rak-beige-600 dark:text-gray-400">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{criticalRecommendations.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-rak-white dark:bg-gray-800 p-4 rounded-lg border border-rak-beige-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rak-beige-600 dark:text-gray-400">Automation Rules</p>
              <p className="text-2xl font-bold text-blue-600">{enabledRules.length}</p>
            </div>
            <Zap className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-rak-white dark:bg-gray-800 p-4 rounded-lg border border-rak-beige-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rak-beige-600 dark:text-gray-400">Recommendations</p>
              <p className="text-2xl font-bold text-purple-600">{recommendations.length}</p>
            </div>
            <Lightbulb className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Critical Recommendations */}
      {criticalRecommendations.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Critical Recommendations Requiring Immediate Attention
          </h3>
          <div className="space-y-3">
            {criticalRecommendations.map((rec) => (
              <div key={rec.id} className="bg-rak-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                    {rec.action && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
                        Recommended Action: {rec.action}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Confidence: {rec.confidence}%</span>
                      <span>{rec.createdAt}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissRecommendation(rec.id)}
                    className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const TypeIcon = agentTypeIcons[agent.type];
          const StatusIcon = statusIcons[agent.status];
          
          return (
            <div
              key={agent.id}
              className="bg-rak-white dark:bg-gray-800 rounded-lg border border-rak-beige-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${agentTypeColors[agent.type]}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                    <p className="text-sm text-rak-beige-600 dark:text-gray-400 capitalize">{agent.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`w-4 h-4 ${statusColors[agent.status]}`} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgentToggle(agent);
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      agent.status === 'active' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {agent.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Capabilities:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.capabilities.slice(0, 3).map((capability, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-rak-beige-100 dark:bg-gray-700 text-xs rounded-full text-rak-beige-700 dark:text-gray-300"
                      >
                        {capability}
                      </span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="px-2 py-1 bg-rak-beige-100 dark:bg-gray-700 text-xs rounded-full text-rak-beige-700 dark:text-gray-300">
                        +{agent.capabilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {agent.lastAction && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Action:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{agent.lastAction}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{agent.lastActionTime}</p>
                  </div>
                )}

                {agent.confidence && (
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Confidence</span>
                      <span className="font-medium">{agent.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className="bg-rak-magenta-600 h-2 rounded-full transition-all"
                        style={{ width: `${agent.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-rak-beige-200 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTriggerAction(agent.id, 'Manual trigger');
                  }}
                  className="w-full px-3 py-2 bg-rak-magenta-600 text-white rounded-md hover:bg-rak-magenta-700 text-sm transition-colors"
                >
                  Trigger Action
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Recommendations */}
      <div className="bg-rak-white dark:bg-gray-800 rounded-lg border border-rak-beige-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          All AI Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="flex items-start justify-between p-4 bg-rak-beige-50 dark:bg-gray-900 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[rec.priority]}`}>
                    {rec.priority}
                  </span>
                  <span className="text-xs text-gray-500">{rec.confidence}% confidence</span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">{rec.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                {rec.action && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    Action: {rec.action}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissRecommendation(rec.id)}
                className="ml-4 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-rak-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-rak-beige-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${agentTypeColors[selectedAgent.type]}`}>
                    {React.createElement(agentTypeIcons[selectedAgent.type], { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedAgent.name}
                    </h3>
                    <p className="text-sm text-rak-beige-600 dark:text-gray-400 capitalize">
                      {selectedAgent.type} Agent
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Capabilities</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedAgent.capabilities.map((capability, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-rak-beige-50 dark:bg-gray-900 rounded">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedAgent.lastAction && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Activity</h4>
                    <div className="p-3 bg-rak-beige-50 dark:bg-gray-900 rounded">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedAgent.lastAction}</p>
                      <p className="text-xs text-gray-500 mt-1">{selectedAgent.lastActionTime}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAgentToggle(selectedAgent)}
                    className={`flex-1 px-4 py-2 rounded-md font-medium ${
                      selectedAgent.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {selectedAgent.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleTriggerAction(selectedAgent.id, 'Manual action from detail view')}
                    className="flex-1 px-4 py-2 bg-rak-magenta-600 text-white rounded-md hover:bg-rak-magenta-700"
                  >
                    Trigger Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}