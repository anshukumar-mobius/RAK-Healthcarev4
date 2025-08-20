import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'teal';
}

const colorClasses = {
  blue: 'bg-rak-primary-50 dark:bg-rak-primary-900/20 text-rak-primary-600 dark:text-rak-primary-400',
  green: 'bg-rak-success-50 dark:bg-rak-success-900/20 text-rak-success-600 dark:text-rak-success-400',
  yellow: 'bg-rak-warning-50 dark:bg-rak-warning-900/20 text-rak-warning-600 dark:text-rak-warning-400',
  red: 'bg-rak-error-50 dark:bg-rak-error-900/20 text-rak-error-600 dark:text-rak-error-400',
  teal: 'bg-rak-accent-50 dark:bg-rak-accent-900/20 text-rak-accent-600 dark:text-rak-accent-400'
};

export function KPICard({ title, value, change, icon: Icon, color = 'teal' }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-rak-secondary-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-1">
              {change.type === 'increase' ? (
                <TrendingUp className="w-3 h-3 text-rak-success-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rak-error-500 mr-1" />
              )}
              <span className={`text-xs font-medium ${
                change.type === 'increase' ? 'text-rak-success-600' : 'text-rak-error-600'
              }`}>
                {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-rak-secondary-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}