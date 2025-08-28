import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Bed, User, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { t } from '../utils/translations';

// Mock bed data
const mockBeds = [
  {
    id: '1',
    roomNumber: 'A-101',
    bedNumber: '1',
    status: 'occupied',
    patientName: 'Ahmed Al Rashid',
    patientId: 'RAK-2024-001',
    admissionDate: '2024-01-05',
    expectedDischarge: '2024-01-08',
    department: 'Internal Medicine',
    condition: 'stable'
  },
  {
    id: '2',
    roomNumber: 'A-101',
    bedNumber: '2',
    status: 'available',
    department: 'Internal Medicine'
  },
  {
    id: '3',
    roomNumber: 'A-102',
    bedNumber: '1',
    status: 'maintenance',
    department: 'Internal Medicine',
    maintenanceReason: 'Equipment repair'
  },
  {
    id: '4',
    roomNumber: 'B-201',
    bedNumber: '1',
    status: 'occupied',
    patientName: 'Sarah Johnson',
    patientId: 'RAK-2024-002',
    admissionDate: '2024-01-06',
    expectedDischarge: '2024-01-09',
    department: 'Cardiology',
    condition: 'critical'
  },
  {
    id: '5',
    roomNumber: 'B-201',
    bedNumber: '2',
    status: 'reserved',
    patientName: 'Mohammed Ali',
    patientId: 'RAK-2024-003',
    reservedUntil: '2024-01-08T14:00:00Z',
    department: 'Cardiology'
  },
  {
    id: '6',
    roomNumber: 'ICU-01',
    bedNumber: '1',
    status: 'occupied',
    patientName: 'Fatima Al Zahra',
    patientId: 'RAK-2024-004',
    admissionDate: '2024-01-07',
    department: 'ICU',
    condition: 'critical'
  }
];

const statusColors = {
  available: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200',
  occupied: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200',
  reserved: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200',
  maintenance: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200'
};

const conditionColors = {
  stable: 'text-green-600',
  moderate: 'text-yellow-600',
  critical: 'text-red-600'
};

export function Beds() {
  const { language } = useApp();
  const [beds] = useState(mockBeds);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const departments = ['all', ...new Set(beds.map(bed => bed.department))];
  
  const filteredBeds = beds.filter(bed => {
    const departmentMatch = selectedDepartment === 'all' || bed.department === selectedDepartment;
    const statusMatch = selectedStatus === 'all' || bed.status === selectedStatus;
    return departmentMatch && statusMatch;
  });

  const bedStats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    reserved: beds.filter(b => b.status === 'reserved').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
    occupancyRate: Math.round((beds.filter(b => b.status === 'occupied').length / beds.length) * 100)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Bed className="w-8 h-8 mr-3 text-rak-magenta-600" />
            {t('bedOccupancy', language)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor bed availability and patient assignments
          </p>
        </div>
      </div>

      {/* Bed Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{bedStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Beds</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{bedStats.available}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{bedStats.occupied}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Occupied</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{bedStats.reserved}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reserved</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{bedStats.maintenance}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Maintenance</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-rak-magenta-600">{bedStats.occupancyRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Occupancy</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredBeds.length} of {beds.length} beds
          </div>
        </div>
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBeds.map((bed) => (
          <div
            key={bed.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-rak-beige-100 dark:bg-rak-beige-900/20 rounded-lg flex items-center justify-center">
                  <Bed className="w-6 h-6 text-rak-beige-600 dark:text-rak-beige-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Room {bed.roomNumber}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bed {bed.bedNumber} • {bed.department}
                  </p>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[bed.status]}`}>
                {bed.status}
              </span>
            </div>

            {bed.status === 'occupied' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{bed.patientName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {bed.patientId}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Admitted</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(bed.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Expected Discharge</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(bed.expectedDischarge).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {bed.condition && (
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      bed.condition === 'stable' ? 'bg-green-500' :
                      bed.condition === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-sm font-medium ${conditionColors[bed.condition]}`}>
                      {bed.condition.charAt(0).toUpperCase() + bed.condition.slice(1)} Condition
                    </span>
                  </div>
                )}
              </div>
            )}

            {bed.status === 'reserved' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{bed.patientName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {bed.patientId}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="text-gray-600 dark:text-gray-400">Reserved until</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(bed.reservedUntil).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {bed.status === 'maintenance' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <p className="font-medium text-red-700 dark:text-red-400">Under Maintenance</p>
                </div>
                
                {bed.maintenanceReason && (
                  <div className="text-sm">
                    <p className="text-gray-600 dark:text-gray-400">Reason</p>
                    <p className="font-medium text-gray-900 dark:text-white">{bed.maintenanceReason}</p>
                  </div>
                )}
              </div>
            )}

            {bed.status === 'available' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className="font-medium text-green-700 dark:text-green-400">Ready for Patient</p>
                </div>
                
                <button className="w-full px-3 py-2 bg-rak-magenta-600 text-white rounded-md hover:bg-rak-magenta-700 text-sm transition-colors">
                  Assign Patient
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}