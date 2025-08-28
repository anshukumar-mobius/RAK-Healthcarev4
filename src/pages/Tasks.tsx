import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { TaskBoard } from '../components/dashboard/TaskBoard';
import { CheckSquare, Plus, Filter, Calendar } from 'lucide-react';
import { t } from '../utils/translations';

// Mock tasks data
const mockTasks = [
  {
    id: '1',
    title: 'Review Lab Results',
    description: 'Patient Ahmed Al Rashid - Blood work results available for review',
    priority: 'urgent' as const,
    status: 'pending' as const,
    assignedTo: 'Dr. Sarah Ahmed',
    dueDate: '2024-01-07',
    patient: 'Ahmed Al Rashid'
  },
  {
    id: '2',
    title: 'Medication Review',
    description: 'Update prescription for diabetes patient - dosage adjustment needed',
    priority: 'normal' as const,
    status: 'in-progress' as const,
    assignedTo: 'Dr. Ahmed Al Rashid',
    dueDate: '2024-01-08',
    patient: 'Sarah Johnson'
  },
  {
    id: '3',
    title: 'Discharge Planning',
    description: 'Prepare discharge summary and home care instructions',
    priority: 'normal' as const,
    status: 'completed' as const,
    assignedTo: 'Nurse Fatima',
    dueDate: '2024-01-06',
    patient: 'Mohammed Ali'
  },
  {
    id: '4',
    title: 'Follow-up Appointment',
    description: 'Schedule follow-up for post-operative patient',
    priority: 'low' as const,
    status: 'pending' as const,
    assignedTo: 'Receptionist Aisha',
    dueDate: '2024-01-09',
    patient: 'Fatima Al Zahra'
  },
  {
    id: '5',
    title: 'Vital Signs Check',
    description: 'Monitor patient vital signs every 4 hours',
    priority: 'urgent' as const,
    status: 'in-progress' as const,
    assignedTo: 'Nurse Sarah',
    dueDate: '2024-01-07',
    patient: 'Ali Hassan'
  },
  {
    id: '6',
    title: 'Insurance Verification',
    description: 'Verify insurance coverage for upcoming procedure',
    priority: 'normal' as const,
    status: 'pending' as const,
    assignedTo: 'Receptionist Mohammed',
    dueDate: '2024-01-08',
    patient: 'Mariam Ahmed'
  }
];

export function Tasks() {
  const { language } = useApp();
  const [tasks] = useState(mockTasks);
  const [showNewTask, setShowNewTask] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    return priorityMatch && statusMatch;
  });

  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task);
  };

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <CheckSquare className="w-8 h-8 mr-3 text-rak-magenta-600" />
            {t('myTasks', language)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your daily tasks and assignments
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewTask(true)}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{taskStats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{taskStats.urgent}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Urgent</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>
      </div>

      {/* Task Board */}
      <TaskBoard tasks={filteredTasks} onTaskClick={handleTaskClick} />

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              New Task
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewTask(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewTask(false)}
                className="px-4 py-2 bg-rak-magenta-600 text-white rounded-md hover:bg-rak-magenta-700"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}