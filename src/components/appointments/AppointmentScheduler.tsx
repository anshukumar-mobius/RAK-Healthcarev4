import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Plus, Search, Bot } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';
import { useAgentStore } from '../../stores/agentStore';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  room?: string;
  notes?: string;
}

interface AppointmentSchedulerProps {
  appointments: Appointment[];
  onNewAppointment?: () => void;
  onEditAppointment?: (appointment: Appointment) => void;
}

export function AppointmentScheduler({ 
  appointments, 
  onNewAppointment, 
  onEditAppointment 
}: AppointmentSchedulerProps) {
  const { language, isRTL } = useApp();
  const { triggerAgentAction, addRecommendation } = useAgentStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    scheduled: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200',
    completed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200',
    cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200',
    'no-show': 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400 border-gray-200'
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.date === selectedDate &&
    (apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // AI-powered appointment optimization
  const optimizeSchedule = () => {
    triggerAgentAction('scheduling-optimizer', 'Optimize daily schedule', {
      date: selectedDate,
      appointments: filteredAppointments
    });

    addRecommendation({
      type: 'optimization',
      priority: 'medium',
      title: 'Schedule Optimization Available',
      description: `AI can reduce wait times by 15% by rearranging ${filteredAppointments.length} appointments`,
      action: 'Apply optimized schedule arrangement',
      confidence: 89,
      agentId: 'scheduling-optimizer'
    });
  };
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // 8 AM to 8 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('appointments', language)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and schedule appointments
            </p>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
              {['day', 'week', 'month'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === mode
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            
            <button
              onClick={onNewAppointment}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">{t('newAppointment', language)}</span>
            </button>
            <button
              onClick={optimizeSchedule}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">AI Optimize</span>
            </button>
          </div>
        </div>
        
        {/* Controls */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          
          <div className="relative">
            <Search className={`absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
            <input
              type="text"
              placeholder={t('search', language)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500`}
            />
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-2">
          {timeSlots.map((timeSlot) => {
            const appointmentsAtTime = filteredAppointments.filter(apt => 
              apt.time.startsWith(timeSlot.split(':')[0])
            );
            
            return (
              <div key={timeSlot} className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-2 mb-2 last:border-b-0">
                <div className="w-16 flex-shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400 pt-2">
                  {timeSlot}
                </div>
                
                <div className="flex-1 ml-4 rtl:mr-4 rtl:ml-0 min-h-[48px]">
                  {appointmentsAtTime.length > 0 ? (
                    <div className="space-y-2">
                      {appointmentsAtTime.map((appointment) => (
                        <div
                          key={appointment.id}
                          onClick={() => onEditAppointment?.(appointment)}
                          className={`p-3 rounded-md border cursor-pointer hover:shadow-sm transition-shadow ${statusColors[appointment.status]}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                                <User className="w-4 h-4" />
                                <span className="font-medium text-sm">
                                  {appointment.patientName}
                                </span>
                              </div>
                              <div className="text-xs opacity-80">
                                Dr. {appointment.doctorName} • {appointment.type}
                              </div>
                              {appointment.room && (
                                <div className="flex items-center space-x-1 rtl:space-x-reverse text-xs opacity-80 mt-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>Room {appointment.room}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-1 rtl:space-x-reverse text-xs">
                              <Clock className="w-3 h-3" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-12 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md">
                      <span className="text-xs text-gray-400">No appointments</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}