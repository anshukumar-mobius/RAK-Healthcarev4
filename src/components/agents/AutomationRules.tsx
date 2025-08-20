import React, { useState } from 'react';
import { Zap, Play, Pause, Settings, Plus, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useAgentStore } from '../../stores/agentStore';
import { AutomationRule } from '../../types/agents';

export function AutomationRules() {
  const { automationRules, toggleAutomationRule, executeAutomationRule, addAutomationRule } = useAgentStore();
  const [showAddRule, setShowAddRule] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  const formatLastTriggered = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Zap className="w-6 h-6 mr-2 text-rak-magenta-600" />
            Automation Rules
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure automated workflows and triggers
          </p>
        </div>
        <button
          onClick={() => setShowAddRule(true)}
          className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {automationRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-rak-white dark:bg-gray-800 rounded-lg border border-rak-beige-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{rule.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Trigger: {rule.trigger.replace('_', ' ')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAutomationRule(rule.id)}
                  className={`p-2 rounded-md ${
                    rule.enabled
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {rule.enabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedRule(rule)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Conditions:</p>
                <div className="mt-1 space-y-1">
                  {rule.conditions.map((condition, index) => (
                    <div key={index} className="text-xs bg-rak-beige-50 dark:bg-gray-900 p-2 rounded">
                      {condition.field} {condition.operator} {condition.value}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Actions:</p>
                <div className="mt-1 space-y-1">
                  {rule.actions.map((action, index) => (
                    <div key={index} className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      {action.type.replace('_', ' ')}
                      {action.delay && ` (${action.delay.replace('_', ' ')})`}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-rak-beige-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 dark:text-gray-400">
                      Executed: {rule.executionCount} times
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      rule.enabled
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last: {formatLastTriggered(rule.lastTriggered)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => executeAutomationRule(rule.id)}
                disabled={!rule.enabled}
                className="w-full px-3 py-2 bg-rak-magenta-600 text-white rounded-md hover:bg-rak-magenta-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                Test Rule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rule Detail Modal */}
      {selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-rak-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-rak-beige-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedRule.name}
                </h3>
                <button
                  onClick={() => setSelectedRule(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    value={selectedRule.name}
                    readOnly
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trigger Event
                  </label>
                  <input
                    type="text"
                    value={selectedRule.trigger}
                    readOnly
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAutomationRule(selectedRule.id)}
                      className={`px-4 py-2 rounded-md ${
                        selectedRule.enabled
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {selectedRule.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Execution Count
                    </label>
                    <p className="text-2xl font-bold text-rak-magenta-600">{selectedRule.executionCount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Triggered
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatLastTriggered(selectedRule.lastTriggered)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}