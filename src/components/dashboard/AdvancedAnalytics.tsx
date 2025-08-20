import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Calendar, Download, Filter, RefreshCw } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AnalyticsProps {
  role: string;
}

export function AdvancedAnalytics({ role }: AnalyticsProps) {
  const { language } = useApp();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const renderAdminAnalytics = () => (
    <div className="space-y-6">
      {/* Revenue Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Analytics</h3>
          <div className="flex space-x-2">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="px-3 py-1 text-sm bg-rak-primary-100 text-rak-primary-700 rounded-md">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Total Revenue</div>
            <div className="text-2xl font-bold">AED 2.4M</div>
            <div className="text-sm flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% vs last period
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Patient Volume</div>
            <div className="text-2xl font-bold">1,847</div>
            <div className="text-sm flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.3% vs last period
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Avg Revenue/Patient</div>
            <div className="text-2xl font-bold">AED 1,299</div>
            <div className="text-sm flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +4.1% vs last period
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Operating Margin</div>
            <div className="text-2xl font-bold">23.4%</div>
            <div className="text-sm flex items-center mt-1">
              <TrendingDown className="w-3 h-3 mr-1" />
              -1.2% vs last period
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="h-64 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Revenue Trend Chart</p>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Performance</h3>
          <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Department Revenue Distribution</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Patient Satisfaction Trends</h3>
          <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Satisfaction Score Trends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDoctorAnalytics = () => (
    <div className="space-y-6">
      {/* Patient Outcomes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Patient Outcomes & Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Success Rate</div>
            <div className="text-2xl font-bold">94.2%</div>
            <div className="text-sm mt-1">Treatment Success</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Patient Satisfaction</div>
            <div className="text-2xl font-bold">4.8/5</div>
            <div className="text-sm mt-1">Average Rating</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Follow-up Rate</div>
            <div className="text-2xl font-bold">87%</div>
            <div className="text-sm mt-1">Patient Compliance</div>
          </div>
        </div>

        <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Patient Outcome Trends</p>
          </div>
        </div>
      </div>

      {/* Diagnosis Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most Common Diagnoses</h3>
        <div className="space-y-3">
          {[
            { diagnosis: 'Hypertension', count: 45, percentage: 23 },
            { diagnosis: 'Diabetes Type 2', count: 38, percentage: 19 },
            { diagnosis: 'Upper Respiratory Infection', count: 32, percentage: 16 },
            { diagnosis: 'Anxiety Disorder', count: 28, percentage: 14 },
            { diagnosis: 'Migraine', count: 24, percentage: 12 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{item.diagnosis}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.count} patients</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{item.percentage}%</div>
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-2 bg-rak-primary-500 rounded-full" 
                    style={{ width: `${item.percentage * 4}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNurseAnalytics = () => (
    <div className="space-y-6">
      {/* Patient Care Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Patient Care Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Patients Cared</div>
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm mt-1">This Month</div>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Medication Accuracy</div>
            <div className="text-2xl font-bold">99.8%</div>
            <div className="text-sm mt-1">Administration Rate</div>
          </div>
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Vitals Compliance</div>
            <div className="text-2xl font-bold">96%</div>
            <div className="text-sm mt-1">On-time Collection</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Patient Satisfaction</div>
            <div className="text-2xl font-bold">4.9/5</div>
            <div className="text-sm mt-1">Care Rating</div>
          </div>
        </div>

        <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Daily Care Activities</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReceptionistAnalytics = () => (
    <div className="space-y-6">
      {/* Front Desk Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Front Desk Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Patients Registered</div>
            <div className="text-2xl font-bold">234</div>
            <div className="text-sm mt-1">This Week</div>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Avg Check-in Time</div>
            <div className="text-2xl font-bold">3.2min</div>
            <div className="text-sm mt-1">Processing Time</div>
          </div>
          <div className="bg-gradient-to-r from-violet-500 to-violet-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Insurance Verification</div>
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm mt-1">Success Rate</div>
          </div>
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Patient Satisfaction</div>
            <div className="text-2xl font-bold">4.7/5</div>
            <div className="text-sm mt-1">Service Rating</div>
          </div>
        </div>

        <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Daily Registration Trends</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiagnosticianAnalytics = () => (
    <div className="space-y-6">
      {/* Lab Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Laboratory Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Tests Completed</div>
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm mt-1">This Month</div>
          </div>
          <div className="bg-gradient-to-r from-lime-500 to-lime-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Accuracy Rate</div>
            <div className="text-2xl font-bold">99.4%</div>
            <div className="text-sm mt-1">Quality Score</div>
          </div>
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Turnaround Time</div>
            <div className="text-2xl font-bold">2.1hrs</div>
            <div className="text-sm mt-1">Average Processing</div>
          </div>
          <div className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Equipment Uptime</div>
            <div className="text-2xl font-bold">98.7%</div>
            <div className="text-sm mt-1">Operational Status</div>
          </div>
        </div>

        <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Test Type Distribution</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    switch (role) {
      case 'admin':
        return renderAdminAnalytics();
      case 'doctor':
        return renderDoctorAnalytics();
      case 'nurse':
        return renderNurseAnalytics();
      case 'receptionist':
        return renderReceptionistAnalytics();
      case 'diagnostician':
        return renderDiagnosticianAnalytics();
      default:
        return <div>No analytics available for this role</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive performance insights and metrics</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-2 bg-rak-primary-600 text-white rounded-md hover:bg-rak-primary-700">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {renderAnalytics()}
    </div>
  );
}