import React from 'react';
import { AgentDashboard } from '../components/agents/AgentDashboard';
import { AutomationRules } from '../components/agents/AutomationRules';
import { useApp } from '../contexts/AppContext';
import { Bot, Zap } from 'lucide-react';

export function AIAgents() {
  const { language } = useApp();
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'automation'>('dashboard');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Bot className="w-8 h-8 mr-3 text-rak-magenta-600" />
            AI Agents & Automation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent automation and AI-powered healthcare assistance
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-6 px-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-rak-magenta-500 text-rak-magenta-600 dark:text-rak-magenta-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Agents</span>
            </button>
            <button
              onClick={() => setActiveTab('automation')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'automation'
                  ? 'border-rak-magenta-500 text-rak-magenta-600 dark:text-rak-magenta-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Automation Rules</span>
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'dashboard' ? <AgentDashboard /> : <AutomationRules />}
        </div>
      </div>
    </div>
  );
}