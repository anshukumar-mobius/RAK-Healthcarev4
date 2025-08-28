import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { DataTable } from '../components/dashboard/DataTable';
import { KPICard } from '../components/dashboard/KPICard';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Download
} from 'lucide-react';
import { t } from '../utils/translations';

// Mock billing data
const mockBillingData = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    patientName: 'Ahmed Al Rashid',
    date: '2024-01-07',
    amount: 'AED 850.00',
    status: 'Paid',
    insuranceProvider: 'ADNIC',
    services: 'Consultation, Lab Tests'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    patientName: 'Sarah Johnson',
    date: '2024-01-07',
    amount: 'AED 1,200.00',
    status: 'Pending',
    insuranceProvider: 'Daman',
    services: 'Consultation, X-Ray, Medication'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    patientName: 'Mohammed Ali',
    date: '2024-01-06',
    amount: 'AED 2,500.00',
    status: 'Overdue',
    insuranceProvider: 'Self-Pay',
    services: 'Emergency Care, CT Scan'
  }
];

const billingColumns = [
  { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
  { key: 'patientName', label: 'Patient', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'insuranceProvider', label: 'Insurance', sortable: true },
  { key: 'services', label: 'Services', sortable: false }
];

export function Billing() {
  const { language } = useApp();
  const [billingData] = useState(mockBillingData);
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const handleViewInvoice = (item: any) => {
    console.log('View invoice:', item);
  };

  const handleEditInvoice = (item: any) => {
    console.log('Edit invoice:', item);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-rak-magenta-600" />
            {t('billing', language)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage invoices, payments, and financial records
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-rak-beige-100 hover:bg-rak-beige-200 text-rak-beige-700 px-4 py-2 rounded-md transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowNewInvoice(true)}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value="AED 125,400"
          change={{ value: 12, type: 'increase' }}
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="Outstanding"
          value="AED 18,750"
          change={{ value: 5, type: 'decrease' }}
          icon={Clock}
          color="yellow"
        />
        <KPICard
          title="Paid Invoices"
          value="89"
          change={{ value: 8, type: 'increase' }}
          icon={CheckCircle}
          color="blue"
        />
        <KPICard
          title="Overdue"
          value="12"
          change={{ value: 3, type: 'increase' }}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Billing Table */}
      <DataTable
        title="Recent Invoices"
        columns={billingColumns}
        data={billingData}
        searchable={true}
        filterable={true}
        exportable={true}
        actions={true}
        onView={handleViewInvoice}
        onEdit={handleEditInvoice}
      />

      {/* New Invoice Modal */}
      {showNewInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              New Invoice
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Invoice creation form would go here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewInvoice(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewInvoice(false)}
                className="px-4 py-2 bg-rak-magenta-600 text-white rounded-md hover:bg-rak-magenta-700"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}