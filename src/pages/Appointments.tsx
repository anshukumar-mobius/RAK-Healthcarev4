import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AppointmentScheduler } from '../components/appointments/AppointmentScheduler';
import { Calendar, Plus, Filter, Search } from 'lucide-react';
import { t } from '../utils/translations';

// Mock appointments data
const mockAppointments = [
  {
    id: '1',
    patientName: 'Ahmed Al Rashid',
    doctorName: 'Dr. Sarah Ahmed',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    type: 'Consultation',
    status: 'scheduled' as const,
    room: 'A-101',
    notes: 'Follow-up for hypertension'
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    doctorName: 'Dr. Ahmed Al Rashid',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    duration: 45,
    type: 'Follow-up',
    status: 'completed' as const,
    room: 'B-205',
    notes: 'Diabetes management review'
  },
  {
    id: '3',
    patientName: 'Mohammed Ali',
    doctorName: 'Dr. Fatima Al Zahra',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    duration: 60,
    type: 'Emergency',
    status: 'in-progress' as const,
    room: 'ER-3',
    notes: 'Chest pain evaluation'
  },
  {
    id: '4',
    patientName: 'Fatima Al Zahra',
    doctorName: 'Dr. Sarah Ahmed',
    date: new Date().toISOString().split('T')[0],
    time: '15:30',
    duration: 30,
    type: 'Consultation',
    status: 'scheduled' as const,
    room: 'A-102',
    notes: 'Annual physical examination'
  }
];

export function Appointments() {
  const { language } = useApp();
  const [appointments] = useState(mockAppointments);
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const handleNewAppointment = () => {
    setShowNewAppointment(true);
  };

  const handleEditAppointment = (appointment: any) => {
    console.log('Edit appointment:', appointment);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-rak-magenta-600" />
            {t('appointments', language)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage patient appointments and scheduling
          </p>
        </div>
      </div>

      {/* Appointment Scheduler */}
      <AppointmentScheduler
        appointments={appointments}
        onNewAppointment={handleNewAppointment}
        onEditAppointment={handleEditAppointment}
      />

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              New Appointment
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Appointment booking form would go here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewAppointment(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewAppointment(false)}
                className="px-4 py-2 bg-rak-magenta-600 text-white rounded-md hover:bg-rak-magenta-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}