import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Eye, Calendar, User, Activity, FlaskConical, Pill, Stethoscope, FileX, Clock, AlertTriangle, CheckCircle, Bot, Search, Filter, ChevronDown, ChevronRight, Star, Archive, Download, Share2, MoreHorizontal, Zap, TrendingUp, Heart, Thermometer, Activity as PulseIcon, List, Baseline as Timeline, BarChart3, MapPin, ArrowRight, Layers, Grid, Calendar as CalendarIcon, Target, Bookmark, Tag, Users, Clipboard } from 'lucide-react';
import { useEMRStore } from '../../stores/emrStore';
import { useAuthStore } from '../../stores/authStore';
import { Patient, EMREntry, ROLE_PERMISSIONS } from '../../types/emr';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';
import { EMREntryForm } from './EMREntryForm';
import { useAgentStore } from '../../stores/agentStore';

interface EMRViewerProps {
  patient: Patient;
}

const entryTypeIcons = {
  consultation: Stethoscope,
  nursing_note: Activity,
  diagnostic_result: FlaskConical,
  medication: Pill,
  vital_signs: PulseIcon,
  procedure: FileText,
  discharge_summary: FileX
};

const entryTypeColors = {
  consultation: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  nursing_note: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
  diagnostic_result: 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
  medication: 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  vital_signs: 'bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700',
  procedure: 'bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
  discharge_summary: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
};

const priorityConfig = {
  emergent: { color: 'bg-red-500', label: 'Emergency', textColor: 'text-red-700 dark:text-red-300' },
  urgent: { color: 'bg-orange-500', label: 'Urgent', textColor: 'text-orange-700 dark:text-orange-300' },
  routine: { color: 'bg-green-500', label: 'Routine', textColor: 'text-green-700 dark:text-green-300' }
};

export function EMRViewer({ patient }: EMRViewerProps) {
  const { language, isRTL } = useApp();
  const user = useAuthStore(state => state.user);
  const { getPatientEMREntries, deleteEMREntry } = useEMRStore();
  const { triggerAgentAction, addRecommendation } = useAgentStore();
  const [selectedEntry, setSelectedEntry] = useState<EMREntry | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EMREntry | null>(null);
  const [filterType, setFilterType] = useState<EMREntry['entryType'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'priority'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'summary'>('list');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const emrEntries = getPatientEMREntries(patient.id);
  const permissions = user ? ROLE_PERMISSIONS[user.role] : null;

  // Enhanced filtering and searching
  const filteredEntries = emrEntries.filter(entry => {
    const matchesType = filterType === 'all' || entry.entryType === filterType;
    const matchesSearch = !searchQuery || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'type':
        return a.entryType.localeCompare(b.entryType);
      case 'priority':
        const priorityOrder = { emergent: 3, urgent: 2, routine: 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      default:
        return 0;
    }
  });

  const canWrite = permissions?.canWrite && user;
  const canDelete = permissions?.canDelete;
  const canAmend = permissions?.canAmend;

  // Statistics for dashboard
  const stats = {
    total: emrEntries.length,
    consultations: emrEntries.filter(e => e.entryType === 'consultation').length,
    vitals: emrEntries.filter(e => e.entryType === 'vital_signs').length,
    medications: emrEntries.filter(e => e.entryType === 'medication').length,
    pending: emrEntries.filter(e => e.followUpRequired).length,
    thisWeek: emrEntries.filter(e => {
      const entryDate = new Date(e.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length,
    critical: emrEntries.filter(e => e.priority === 'emergent').length
  };

  const toggleEntryExpansion = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  // AI Agent Integration for EMR
  const handleAIAnalysis = (entry: EMREntry) => {
    triggerAgentAction('clinical-decision-support', 'Analyze EMR entry', {
      patientId: patient.id,
      entryId: entry.id,
      entryType: entry.entryType,
      content: entry.content
    });

    if (entry.entryType === 'consultation' && entry.clinicalNotes) {
      addRecommendation({
        type: 'suggestion',
        priority: 'medium',
        title: 'Clinical Decision Support Available',
        description: `AI analysis suggests reviewing drug interactions and treatment protocols for ${patient.firstName} ${patient.lastName}`,
        action: 'Review clinical guidelines and medication interactions',
        confidence: 87,
        agentId: 'clinical-decision-support'
      });
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this EMR entry?')) {
      deleteEMREntry(entryId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const renderVitalSigns = (data: any) => {
    if (!data) return null;
    
    const vitalItems = [
      { key: 'temperature', label: 'Temp', value: data.temperature, unit: '°C', icon: Thermometer, color: 'text-red-500' },
      { key: 'bloodPressure', label: 'BP', value: data.bloodPressure ? `${data.bloodPressure.systolic}/${data.bloodPressure.diastolic}` : null, unit: 'mmHg', icon: Heart, color: 'text-blue-500' },
      { key: 'heartRate', label: 'HR', value: data.heartRate, unit: 'bpm', icon: PulseIcon, color: 'text-green-500' },
      { key: 'oxygenSaturation', label: 'SpO₂', value: data.oxygenSaturation, unit: '%', icon: Activity, color: 'text-teal-500' }
    ];
    
    return (
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl p-6 mt-4 border border-teal-200 dark:border-teal-700">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-semibold text-teal-800 dark:text-teal-300 flex items-center">
            <PulseIcon className="w-5 h-5 mr-2" />
            Vital Signs
          </h5>
          <span className="text-xs text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/40 px-2 py-1 rounded-full">
            {data.recordedAt ? formatRelativeTime(data.recordedAt) : 'Recent'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {vitalItems.map(item => {
            if (!item.value) return null;
            const Icon = item.icon;
            return (
              <div key={item.key} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{item.unit}</div>
              </div>
            );
          })}
        </div>
        
        {data.recordedBy && (
          <div className="mt-4 pt-3 border-t border-teal-200 dark:border-teal-700 text-xs text-teal-700 dark:text-teal-400">
            <User className="w-3 h-3 inline mr-1" />
            Recorded by: {data.recordedBy}
          </div>
        )}
      </div>
    );
  };

  const renderClinicalNotes = (entry: EMREntry) => {
    if (!entry.clinicalNotes) return null;
    
    const notes = entry.clinicalNotes;
    const sections = [
      { key: 'chiefComplaint', label: 'Chief Complaint', content: notes.chiefComplaint },
      { key: 'historyOfPresentIllness', label: 'History of Present Illness', content: notes.historyOfPresentIllness },
      { key: 'physicalExamination', label: 'Physical Examination', content: notes.physicalExamination },
      { key: 'assessment', label: 'Assessment', content: notes.assessment },
      { key: 'plan', label: 'Plan', content: notes.plan }
    ];
    
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mt-4 border border-blue-200 dark:border-blue-700">
        <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
          <Stethoscope className="w-5 h-5 mr-2" />
          Clinical Notes
        </h5>
        
        <div className="space-y-4">
          {sections.map(section => {
            if (!section.content) return null;
            return (
              <div key={section.key} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <h6 className="font-medium text-blue-700 dark:text-blue-300 mb-2 text-sm">
                  {section.label}
                </h6>
                <p className="text-gray-900 dark:text-white text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            );
          })}
          
          {notes.icdCodes && notes.icdCodes.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <h6 className="font-medium text-blue-700 dark:text-blue-300 mb-2 text-sm">
                ICD Codes
              </h6>
              <div className="flex flex-wrap gap-2">
                {notes.icdCodes.map((code, index) => (
                  <span key={index} className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-mono border border-blue-200 dark:border-blue-700">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // LIST VIEW COMPONENT
  const renderListView = () => {
    const renderEntryCard = (entry: EMREntry) => {
      const Icon = entryTypeIcons[entry.entryType];
      const isExpanded = expandedEntries.has(entry.id);
      const priority = entry.priority as keyof typeof priorityConfig;
      
      return (
        <div
          key={entry.id}
          className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${entryTypeColors[entry.entryType]}`}
        >
          {/* Priority indicator */}
          {priority && (
            <div className={`absolute top-0 left-0 w-1 h-full ${priorityConfig[priority].color}`} />
          )}
          
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 rtl:space-x-reverse flex-1">
                <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                    <h4 className="font-bold text-lg truncate">{entry.title}</h4>
                    {entry.followUpRequired && (
                      <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full text-xs">
                        <Clock className="w-3 h-3" />
                        <span>Follow-up</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm opacity-75 mb-2">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatRelativeTime(entry.createdAt)}</span>
                    </span>
                    <span className="capitalize">{entry.entryType.replace('_', ' ')}</span>
                    {priority && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 ${priorityConfig[priority].textColor}`}>
                        {priorityConfig[priority].label}
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {entry.content}
                  </p>
                </div>
              </div>
              
              {/* Status badge */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  entry.status === 'final' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700' :
                  entry.status === 'draft' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700' :
                  'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700'
                }`}>
                  {entry.status === 'final' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                  {entry.status}
                </span>
              </div>
            </div>
            
            {/* Expanded content */}
            {isExpanded && (
              <div className="mt-4 space-y-4">
                {entry.entryType === 'vital_signs' && renderVitalSigns(entry.data)}
                {entry.entryType === 'consultation' && renderClinicalNotes(entry)}
                
                {entry.followUpRequired && entry.followUpDate && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-300 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">Follow-up Required</span>
                    </div>
                    <p className="text-orange-700 dark:text-orange-300 text-sm">
                      Scheduled for: {formatDate(entry.followUpDate)}
                    </p>
                  </div>
                )}
                
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => toggleEntryExpansion(entry.id)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span>{isExpanded ? 'Less' : 'More'}</span>
                </button>
                
                <button
                  onClick={() => setSelectedEntry(entry)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {user?.role === 'doctor' && (
                  <button
                    onClick={() => handleAIAnalysis(entry)}
                    className="p-2 rounded-lg bg-gradient-to-r from-rak-magenta-500 to-rak-magenta-600 text-white hover:from-rak-magenta-600 hover:to-rak-magenta-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    title="AI Analysis"
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                )}
                
                {canAmend && entry.createdBy === user?.id && (
                  <button
                    onClick={() => setEditingEntry(entry)}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                
                {canDelete && entry.createdBy === user?.id && (
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {filteredEntries.map(renderEntryCard)}
      </div>
    );
  };

  // TIMELINE VIEW COMPONENT
  const renderTimelineView = () => {
    const groupedEntries = filteredEntries.reduce((groups, entry) => {
      const date = new Date(entry.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {} as Record<string, EMREntry[]>);

    return (
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rak-magenta-400 to-rak-magenta-600"></div>
        
        <div className="space-y-8">
          {Object.entries(groupedEntries).map(([date, entries]) => (
            <div key={date} className="relative">
              {/* Date marker */}
              <div className="flex items-center mb-6">
                <div className="relative z-10 bg-rak-magenta-600 text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="font-semibold text-sm">
                      {new Date(date).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-rak-magenta-300 to-transparent ml-4"></div>
              </div>
              
              {/* Entries for this date */}
              <div className="ml-16 space-y-4">
                {entries.map((entry) => {
                  const Icon = entryTypeIcons[entry.entryType];
                  const priority = entry.priority as keyof typeof priorityConfig;
                  
                  return (
                    <div
                      key={entry.id}
                      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Timeline connector */}
                      <div className="absolute -left-16 top-6 w-8 h-0.5 bg-rak-magenta-400"></div>
                      <div className="absolute -left-20 top-4 w-4 h-4 bg-rak-magenta-600 rounded-full border-4 border-white dark:border-gray-800 shadow-md"></div>
                      
                      {/* Priority indicator */}
                      {priority && (
                        <div className={`absolute top-0 right-0 w-3 h-3 ${priorityConfig[priority].color} rounded-bl-lg`}></div>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${entryTypeColors[entry.entryType]} shadow-sm`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                              {entry.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(entry.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entry.status === 'final' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                                entry.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                              }`}>
                                {entry.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                            <span className="capitalize">{entry.entryType.replace('_', ' ')}</span>
                            {priority && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[priority].textColor} bg-white dark:bg-gray-700`}>
                                {priorityConfig[priority].label}
                              </span>
                            )}
                            {entry.followUpRequired && (
                              <span className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                                <Clock className="w-3 h-3" />
                                <span>Follow-up</span>
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                            {entry.content}
                          </p>
                          
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {entry.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedEntry(entry)}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-rak-magenta-100 dark:bg-rak-magenta-900/40 text-rak-magenta-700 dark:text-rak-magenta-300 rounded-lg hover:bg-rak-magenta-200 dark:hover:bg-rak-magenta-900/60 transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Details</span>
                              </button>
                              
                              {user?.role === 'doctor' && (
                                <button
                                  onClick={() => handleAIAnalysis(entry)}
                                  className="p-1.5 bg-gradient-to-r from-rak-magenta-500 to-rak-magenta-600 text-white rounded-lg hover:from-rak-magenta-600 hover:to-rak-magenta-700 transition-all"
                                  title="AI Analysis"
                                >
                                  <Bot className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {canAmend && entry.createdBy === user?.id && (
                                <button
                                  onClick={() => setEditingEntry(entry)}
                                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                              )}
                              
                              {canDelete && entry.createdBy === user?.id && (
                                <button
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // SUMMARY VIEW COMPONENT
  const renderSummaryView = () => {
    const summaryData = {
      overview: {
        totalEntries: stats.total,
        recentEntries: stats.thisWeek,
        criticalEntries: stats.critical,
        pendingFollowUps: stats.pending
      },
      byType: Object.entries(
        filteredEntries.reduce((acc, entry) => {
          acc[entry.entryType] = (acc[entry.entryType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).sort(([,a], [,b]) => b - a),
      recentActivity: filteredEntries.slice(0, 5),
      criticalItems: filteredEntries.filter(e => e.priority === 'emergent' || e.followUpRequired),
      vitalTrends: filteredEntries
        .filter(e => e.entryType === 'vital_signs' && e.data)
        .slice(0, 10)
        .reverse(),
      medications: filteredEntries.filter(e => e.entryType === 'medication'),
      diagnoses: filteredEntries
        .filter(e => e.entryType === 'consultation' && e.clinicalNotes?.icdCodes)
        .flatMap(e => e.clinicalNotes?.icdCodes || [])
        .reduce((acc, code) => {
          acc[code] = (acc[code] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
    };

    return (
      <div className="space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {summaryData.overview.totalEntries}
              </span>
            </div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Total Records</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">All medical entries</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                {summaryData.overview.recentEntries}
              </span>
            </div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">This Week</h3>
            <p className="text-sm text-green-600 dark:text-green-400">Recent activity</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6 border border-red-200 dark:border-red-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600 rounded-xl shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                {summaryData.overview.criticalEntries}
              </span>
            </div>
            <h3 className="font-semibold text-red-800 dark:text-red-300">Critical Items</h3>
            <p className="text-sm text-red-600 dark:text-red-400">Require attention</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-600 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {summaryData.overview.pendingFollowUps}
              </span>
            </div>
            <h3 className="font-semibold text-orange-800 dark:text-orange-300">Follow-ups</h3>
            <p className="text-sm text-orange-600 dark:text-orange-400">Pending actions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Entry Types Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-rak-magenta-600" />
                Record Types
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Distribution</span>
            </div>
            
            <div className="space-y-4">
              {summaryData.byType.map(([type, count]) => {
                const Icon = entryTypeIcons[type as keyof typeof entryTypeIcons];
                const percentage = Math.round((count / stats.total) * 100);
                
                return (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${entryTypeColors[type as keyof typeof entryTypeColors]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {count} entries
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-rak-magenta-600 dark:text-rak-magenta-400">
                        {percentage}%
                      </p>
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                        <div 
                          className="h-2 bg-rak-magenta-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-rak-magenta-600" />
                Recent Activity
              </h3>
              <button
                onClick={() => setViewMode('timeline')}
                className="text-sm text-rak-magenta-600 dark:text-rak-magenta-400 hover:underline"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {summaryData.recentActivity.map((entry) => {
                const Icon = entryTypeIcons[entry.entryType];
                
                return (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors cursor-pointer"
                       onClick={() => setSelectedEntry(entry)}>
                    <div className={`p-2 rounded-lg ${entryTypeColors[entry.entryType]} flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {entry.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(entry.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {entry.priority === 'emergent' && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      {entry.followUpRequired && (
                        <Clock className="w-3 h-3 text-orange-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vital Signs Trends */}
        {summaryData.vitalTrends.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Heart className="w-5 h-5 mr-2 text-rak-magenta-600" />
                Vital Signs Trends
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Last 10 readings</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['temperature', 'heartRate', 'bloodPressure', 'oxygenSaturation'].map((vital) => {
                const readings = summaryData.vitalTrends
                  .map(entry => entry.data?.[vital])
                  .filter(Boolean)
                  .slice(-5);
                
                if (readings.length === 0) return null;
                
                const latest = readings[readings.length - 1];
                const previous = readings[readings.length - 2];
                const trend = previous ? (latest > previous ? 'up' : latest < previous ? 'down' : 'stable') : 'stable';
                
                return (
                  <div key={vital} className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-teal-200 dark:border-teal-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-teal-700 dark:text-teal-300 capitalize">
                        {vital.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className={`p-1 rounded-full ${
                        trend === 'up' ? 'bg-green-100 text-green-600' :
                        trend === 'down' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-teal-800 dark:text-teal-300">
                      {typeof latest === 'object' ? `${latest.systolic}/${latest.diastolic}` : latest}
                      <span className="text-xs font-normal ml-1">
                        {vital === 'temperature' ? '°C' :
                         vital === 'heartRate' ? 'bpm' :
                         vital === 'bloodPressure' ? 'mmHg' :
                         vital === 'oxygenSaturation' ? '%' : ''}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Critical Items & Follow-ups */}
        {summaryData.criticalItems.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-300 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Items Requiring Attention
              </h3>
              <span className="text-sm text-red-600 dark:text-red-400">
                {summaryData.criticalItems.length} items
              </span>
            </div>
            
            <div className="space-y-3">
              {summaryData.criticalItems.slice(0, 5).map((entry) => {
                const Icon = entryTypeIcons[entry.entryType];
                
                return (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-700">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${entryTypeColors[entry.entryType]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {entry.title}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{formatRelativeTime(entry.createdAt)}</span>
                          {entry.priority === 'emergent' && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              Emergency
                            </span>
                          )}
                          {entry.followUpRequired && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              Follow-up Due
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors text-sm font-medium"
                    >
                      Review
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Electronic Medical Record</h2>
              <p className="text-rak-magenta-100">
                {patient.firstName} {patient.lastName} • MRN: {patient.mrn}
              </p>
            </div>
          </div>
          
          {canWrite && (
            <button
              onClick={() => setShowEntryForm(true)}
              className="flex items-center space-x-2 bg-white text-rak-magenta-600 px-6 py-3 rounded-xl font-semibold hover:bg-rak-magenta-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Add Entry</span>
            </button>
          )}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-rak-magenta-100">Total</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{stats.consultations}</div>
            <div className="text-sm text-rak-magenta-100">Consults</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{stats.vitals}</div>
            <div className="text-sm text-rak-magenta-100">Vitals</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{stats.medications}</div>
            <div className="text-sm text-rak-magenta-100">Meds</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-300">{stats.pending}</div>
            <div className="text-sm text-rak-magenta-100">Follow-ups</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-300">{stats.thisWeek}</div>
            <div className="text-sm text-rak-magenta-100">This Week</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-300">{stats.critical}</div>
            <div className="text-sm text-rak-magenta-100">Critical</div>
          </div>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 focus:border-transparent transition-all"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 transition-all"
            >
              <option value="all">All Types</option>
              <option value="consultation">Consultations</option>
              <option value="nursing_note">Nursing Notes</option>
              <option value="diagnostic_result">Diagnostic Results</option>
              <option value="medication">Medications</option>
              <option value="vital_signs">Vital Signs</option>
              <option value="procedure">Procedures</option>
              <option value="discharge_summary">Discharge Summary</option>
            </select>
          </div>
          
          {/* View Controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
              {[
                { mode: 'list', icon: List, label: 'List' },
                { mode: 'timeline', icon: Timeline, label: 'Timeline' },
                { mode: 'summary', icon: BarChart3, label: 'Summary' }
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-rak-magenta-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="type">Sort by Type</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-rak-magenta-100 to-rak-pink-100 dark:from-rak-magenta-900/20 dark:to-rak-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-rak-magenta-600 dark:text-rak-magenta-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No EMR entries found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery ? 'Try adjusting your search criteria' : 'Start by adding the first medical entry for this patient'}
            </p>
            {canWrite && !searchQuery && (
              <button
                onClick={() => setShowEntryForm(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-rak-magenta-700 hover:to-rak-magenta-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Add First Entry</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'list' && renderListView()}
            {viewMode === 'timeline' && renderTimelineView()}
            {viewMode === 'summary' && renderSummaryView()}
          </>
        )}
      </div>

      {/* Entry Form Modal */}
      {(showEntryForm || editingEntry) && (
        <EMREntryForm
          patient={patient}
          entry={editingEntry}
          onClose={() => {
            setShowEntryForm(false);
            setEditingEntry(null);
          }}
          onSave={() => {
            setShowEntryForm(false);
            setEditingEntry(null);
          }}
        />
      )}

      {/* Enhanced Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {React.createElement(entryTypeIcons[selectedEntry.entryType], { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedEntry.title}</h3>
                    <p className="text-rak-magenta-100 text-sm">
                      {formatDate(selectedEntry.createdAt)} • {selectedEntry.entryType.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Content</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedEntry.content}</p>
                </div>
                
                {selectedEntry.entryType === 'consultation' && renderClinicalNotes(selectedEntry)}
                {selectedEntry.entryType === 'vital_signs' && renderVitalSigns(selectedEntry.data)}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h5>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedEntry.status === 'final' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                      selectedEntry.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>
                      {selectedEntry.status === 'final' && <CheckCircle className="w-4 h-4 mr-1" />}
                      {selectedEntry.status}
                    </span>
                  </div>
                  
                  {selectedEntry.priority && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Priority</h5>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${priorityConfig[selectedEntry.priority as keyof typeof priorityConfig]?.color}`}></div>
                        <span className="text-sm font-medium capitalize">{selectedEntry.priority}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedEntry.departmentId && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Department</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {selectedEntry.departmentId.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}