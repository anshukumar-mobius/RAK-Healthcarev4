import React from 'react';
import { Clock, AlertCircle, CheckCircle, User, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'normal' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  dueDate?: string;
  patient?: string;
}

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const priorityColors = {
  urgent: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800',
  normal: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  low: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800'
};

const statusIcons = {
  pending: Clock,
  'in-progress': AlertCircle,
  completed: CheckCircle
};

export function TaskBoard({ tasks, onTaskClick }: TaskBoardProps) {
  const { language } = useApp();
  
  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  const columns = [
    { key: 'pending', title: t('pendingTasks', language), color: 'border-yellow-300' },
    { key: 'in-progress', title: 'In Progress', color: 'border-blue-300' },
    { key: 'completed', title: t('completedTasks', language), color: 'border-green-300' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = groupedTasks[column.key as keyof typeof groupedTasks];
        
        return (
          <div key={column.key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className={`p-4 border-b border-gray-200 dark:border-gray-700 border-l-4 ${column.color}`}>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {column.title}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {columnTasks.length} tasks
              </span>
            </div>
            
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {columnTasks.map((task) => {
                const StatusIcon = statusIcons[task.status];
                
                return (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick?.(task)}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${priorityColors[task.priority]}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <StatusIcon className="w-4 h-4 flex-shrink-0 ml-2" />
                    </div>
                    
                    <p className="text-xs opacity-80 mb-3">{task.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        {task.patient && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{task.patient}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{task.dueDate}</span>
                          </div>
                        )}
                      </div>
                      
                      <span className="font-medium capitalize">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No {column.title.toLowerCase()}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}