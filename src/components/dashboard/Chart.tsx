import React from 'react';

interface ChartProps {
  title: string;
  type: 'bar' | 'line' | 'pie';
  data?: any[];
  height?: number;
}

export function Chart({ title, type, height = 300 }: ChartProps) {
  // Mock chart visualization
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <div className="flex items-end justify-between h-48 px-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="bg-teal-500 dark:bg-teal-400 rounded-t-md w-8 transition-all hover:bg-teal-600"
                  style={{ height: `${Math.random() * 150 + 30}px` }}
                ></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        );
      case 'line':
        return (
          <div className="flex items-center justify-center h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-teal-500"
                points="0,150 50,120 100,140 150,90 200,110 250,70 300,90 350,50 400,80"
              />
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-blue-500"
                points="0,180 50,160 100,170 150,130 200,140 250,100 300,120 350,90 400,110"
              />
            </svg>
          </div>
        );
      case 'pie':
        return (
          <div className="flex items-center justify-center h-48">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-blue-500"></div>
              <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-800"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">85%</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      {renderChart()}
    </div>
  );
}