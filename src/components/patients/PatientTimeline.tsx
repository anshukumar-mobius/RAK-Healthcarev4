import React from 'react';
import { Calendar, FileText, FlaskConical, Pill, Activity, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface TimelineEvent {
  id: string;
  type: 'appointment' | 'diagnosis' | 'test' | 'medication' | 'vital' | 'emergency';
  title: string;
  description: string;
  date: string;
  time: string;
  doctor?: string;
  status?: 'completed' | 'pending' | 'cancelled';
  details?: any;
}

interface PatientTimelineProps {
  events: TimelineEvent[];
  patientName: string;
}

const eventIcons = {
  appointment: Calendar,
  diagnosis: FileText,
  test: FlaskConical,
  medication: Pill,
  vital: Activity,
  emergency: AlertTriangle
};

const eventColors = {
  appointment: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  diagnosis: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  test: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
  medication: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  vital: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  emergency: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
};

export function PatientTimeline({ events, patientName }: PatientTimelineProps) {
  const { isRTL } = useApp();
  
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Medical Timeline - {patientName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Complete medical history and timeline of events
        </p>
      </div>
      
      <div className="p-6">
        <div className={`relative ${isRTL ? 'border-r-2' : 'border-l-2'} border-gray-200 dark:border-gray-700`}>
          {sortedEvents.map((event, index) => {
            const Icon = eventIcons[event.type];
            
            return (
              <div key={event.id} className={`relative ${isRTL ? 'pr-8' : 'pl-8'} pb-8`}>
                {/* Timeline dot */}
                <div className={`absolute ${isRTL ? '-right-2' : '-left-2'} w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${eventColors[event.type]} flex items-center justify-center`}>
                  <Icon className="w-2 h-2" />
                </div>
                
                {/* Event content */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                    </div>
                    
                    <div className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'mr-4' : 'ml-4'} text-right rtl:text-left flex-shrink-0`}>
                      <div>{event.date}</div>
                      <div>{event.time}</div>
                    </div>
                  </div>
                  
                  {event.doctor && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Doctor: {event.doctor}
                    </div>
                  )}
                  
                  {event.status && (
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  )}
                  
                  {event.details && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        {Object.entries(event.details).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 ml-1">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Connecting line */}
                {index < sortedEvents.length - 1 && (
                  <div className={`absolute ${isRTL ? '-right-0.5' : '-left-0.5'} top-8 w-0.5 h-8 bg-gray-200 dark:bg-gray-700`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}