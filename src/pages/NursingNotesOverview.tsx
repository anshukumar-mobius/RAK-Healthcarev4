import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Plus, 
  Search, 
  Filter,
  User,
  Calendar,
  Clock,
  Activity,
  Eye,
  Edit,
  Stethoscope,
  Heart,
  AlertTriangle
} from 'lucide-react';
import { useEMRStore } from '../stores/emrStore';
import { useAuth } from '../hooks/useAuth';
import nursingNotesData from '../data/nursingNotes.json';

interface NursingNote {
  id: string;
  encounterId: string;
  patientId: string;
  patientName: string;
  patient: {
    id: string;
    name: string;
    mrn: string;
    dateOfBirth: string;
    gender: string;
    room?: string;
    bed?: string;
  };
  author: string;
  shift: 'Day' | 'Evening' | 'Night';
  time: string;
  vitals: {
    bp: string;
    hr: number;
    temp: number;
    spo2?: number;
    rr?: number;
    pain?: number;
  };
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  priority: 'routine' | 'urgent' | 'critical';
  status: 'draft' | 'final';
}

const shiftColors = {
  Day: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200',
  Evening: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 border-orange-200',
  Night: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200'
};

const priorityColors = {
  routine: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200',
  urgent: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200',
  critical: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200'
};

export function NursingNotesOverview() {
  const navigate = useNavigate();
  const { patients } = useEMRStore();
  const { user } = useAuth();
  
  const [notes, setNotes] = useState<NursingNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState<'all' | 'Day' | 'Evening' | 'Night'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'routine' | 'urgent' | 'critical'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'final'>('all');
  const [showNewNote, setShowNewNote] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');

  useEffect(() => {
    // Load nursing notes and enrich with patient data
    const allNotes = nursingNotesData as NursingNote[];
    
    // Enrich notes with patient data from the store
    const enrichedNotes = allNotes.map(note => {
      const patient = patients.find(p => p.id === note.patientId);
      if (patient) {
        return {
          ...note,
          patient: {
            id: patient.id,
            name: `${patient.firstName} ${patient.lastName}`,
            mrn: patient.mrn,
            dateOfBirth: patient.dateOfBirth,
            gender: patient.gender,
            room: 'A-101',
            bed: '1'
          }
        };
      }
      return {
        ...note,
        patient: {
          id: note.patientId || '',
          name: note.patientName || 'Unknown Patient',
          mrn: 'N/A',
          dateOfBirth: '1990-01-01',
          gender: 'Unknown',
          room: 'N/A',
          bed: 'N/A'
        }
      };
    });
    
    // Filter notes assigned to current nurse
    const assignedNotes = enrichedNotes.map(note => ({
      ...note,
      assignedNurse: user?.name || 'Current Nurse'
    }));
    
    setNotes(assignedNotes);
  }, [user, patients]);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subjective.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.assessment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesShift = shiftFilter === 'all' || note.shift === shiftFilter;
    const matchesPriority = priorityFilter === 'all' || note.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || note.status === statusFilter;
    
    return matchesSearch && matchesShift && matchesPriority && matchesStatus;
  });

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleCreateNewNote = () => {
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    // Navigate to the nursing notes creation page with the selected patient
    navigate(`/nursing-notes/${patient.mrn}`);
  };

  const handleViewNote = (note: NursingNote) => {
    navigate(`/nursing-notes/${note.encounterId}`);
  };

  const handleEditNote = (note: NursingNote) => {
    navigate(`/nursing-notes/${note.encounterId}?edit=${note.id}`);
  };

  // Statistics
  const stats = {
    totalNotes: notes.length,
    draftNotes: notes.filter(n => n.status === 'draft').length,
    finalNotes: notes.filter(n => n.status === 'final').length,
    criticalNotes: notes.filter(n => n.priority === 'critical').length,
    todayNotes: notes.filter(n => {
      const noteDate = new Date(n.time).toDateString();
      const today = new Date().toDateString();
      return noteDate === today;
    }).length
  };

  // Group notes by patient
  const notesByPatient = notes.reduce((acc, note) => {
    const patientKey = note.patient.id;
    if (!acc[patientKey]) {
      acc[patientKey] = {
        patient: note.patient,
        notes: [],
        lastNote: note.time,
        criticalCount: 0,
        draftCount: 0
      };
    }
    acc[patientKey].notes.push(note);
    if (note.priority === 'critical') acc[patientKey].criticalCount++;
    if (note.status === 'draft') acc[patientKey].draftCount++;
    if (new Date(note.time) > new Date(acc[patientKey].lastNote)) {
      acc[patientKey].lastNote = note.time;
    }
    return acc;
  }, {} as Record<string, any>);

  const patientGroups = Object.values(notesByPatient);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="w-8 h-8 mr-3 text-rak-magenta-600" />
            My Nursing Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage nursing notes for all assigned patients
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewNote(true)}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Notes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalNotes}</p>
            </div>
            <FileText className="w-8 h-8 text-rak-magenta-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Notes</p>
              <p className="text-2xl font-bold text-blue-600">{stats.todayNotes}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Final Notes</p>
              <p className="text-2xl font-bold text-green-600">{stats.finalNotes}</p>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Draft Notes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draftNotes}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalNotes}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, notes, or assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 w-80"
              />
            </div>
            
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            >
              <option value="all">All Shifts</option>
              <option value="Day">Day Shift</option>
              <option value="Evening">Evening Shift</option>
              <option value="Night">Night Shift</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            >
              <option value="all">All Priorities</option>
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="final">Final</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredNotes.length} of {notes.length} notes
          </div>
        </div>
      </div>

      {/* Notes by Patient */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {patientGroups.filter(group => {
          const groupNotes = group.notes.filter((note: NursingNote) => {
            const matchesSearch = note.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 note.patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 note.subjective.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 note.assessment.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesShift = shiftFilter === 'all' || note.shift === shiftFilter;
            const matchesPriority = priorityFilter === 'all' || note.priority === priorityFilter;
            const matchesStatus = statusFilter === 'all' || note.status === statusFilter;
            
            return matchesSearch && matchesShift && matchesPriority && matchesStatus;
          });
          return groupNotes.length > 0;
        }).map((group) => {
          const latestNote = group.notes.sort((a: NursingNote, b: NursingNote) => 
            new Date(b.time).getTime() - new Date(a.time).getTime()
          )[0];
          
          return (
            <div
              key={group.patient.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Patient Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-rak-pink-50 to-rak-beige-50 dark:from-rak-pink-900/10 dark:to-rak-beige-900/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-rak-magenta-100 dark:bg-rak-magenta-900/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-rak-magenta-600 dark:text-rak-magenta-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {group.patient.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>MRN: {group.patient.mrn}</span>
                        <span>{calculateAge(group.patient.dateOfBirth)}y</span>
                        <span className="capitalize">{group.patient.gender}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {group.criticalCount > 0 && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-full text-xs font-medium">
                        {group.criticalCount} Critical
                      </span>
                    )}
                    {group.draftCount > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-full text-xs font-medium">
                        {group.draftCount} Draft
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Stethoscope className="w-4 h-4" />
                      <span>Room: {group.patient.room}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Heart className="w-4 h-4" />
                      <span>Bed: {group.patient.bed}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Last: {new Date(group.lastNote).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes Content */}
              <div className="p-4">
                {/* Notes Summary */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes Summary</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{group.notes.length} total</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                      <div className="font-bold text-green-700 dark:text-green-400">{group.notes.filter((n: NursingNote) => n.priority === 'routine').length}</div>
                      <div className="text-green-600 dark:text-green-400">Routine</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border border-yellow-200 dark:border-yellow-800">
                      <div className="font-bold text-yellow-700 dark:text-yellow-400">{group.notes.filter((n: NursingNote) => n.priority === 'urgent').length}</div>
                      <div className="text-yellow-600 dark:text-yellow-400">Urgent</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                      <div className="font-bold text-red-700 dark:text-red-400">{group.criticalCount}</div>
                      <div className="text-red-600 dark:text-red-400">Critical</div>
                    </div>
                  </div>
                </div>

                {/* Latest Note Preview */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Latest Note</h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${shiftColors[latestNote.shift]}`}>
                          {latestNote.shift}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[latestNote.priority]}`}>
                          {latestNote.priority}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(latestNote.time).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Assessment:</strong> {latestNote.assessment.length > 60 ? `${latestNote.assessment.substring(0, 60)}...` : latestNote.assessment}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">BP:</span>
                        <span className="ml-1 font-medium">{latestNote.vitals.bp}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">HR:</span>
                        <span className="ml-1 font-medium">{latestNote.vitals.hr} bpm</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shift Distribution */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Shift Distribution</h4>
                  <div className="flex space-x-1">
                    {['Day', 'Evening', 'Night'].map(shift => {
                      const count = group.notes.filter((n: NursingNote) => n.shift === shift).length;
                      const percentage = group.notes.length > 0 ? (count / group.notes.length) * 100 : 0;
                      return (
                        <div key={shift} className="flex-1">
                          <div className="text-xs text-center mb-1">{shift}</div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                shift === 'Day' ? 'bg-yellow-500' :
                                shift === 'Evening' ? 'bg-orange-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-center mt-1 text-gray-500">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Last: {new Date(group.lastNote).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{latestNote.author}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewNote(latestNote)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Notes</span>
                  </button>
                  <button
                    onClick={() => handleEditNote(latestNote)}
                    className="flex items-center justify-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Nursing Notes Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || shiftFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all'
              ? 'No notes match your current filters' 
              : 'You have no nursing notes yet'}
          </p>
          <button
            onClick={() => setShowNewNote(true)}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-6 py-3 rounded-lg transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Note</span>
          </button>
        </div>
      )}

      {/* New Note Modal */}
      {showNewNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Create New Nursing Note</h3>
                  <p className="text-rak-magenta-100 mt-1">Select a patient to create their nursing note</p>
                </div>
                <button
                  onClick={() => setShowNewNote(false)}
                  className="p-2 hover:bg-rak-magenta-800 rounded-lg transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Patient Selection */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Patient Selection
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Patient *
                    </label>
                    <select
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Choose a patient...</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} - {patient.mrn} ({calculateAge(patient.dateOfBirth)}y, {patient.gender})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedPatient && (
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white mb-2">Selected Patient:</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Name:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {patients.find(p => p.id === selectedPatient)?.firstName} {patients.find(p => p.id === selectedPatient)?.lastName}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">MRN:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {patients.find(p => p.id === selectedPatient)?.mrn}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Age:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {calculateAge(patients.find(p => p.id === selectedPatient)?.dateOfBirth || '')} years
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Conditions:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {patients.find(p => p.id === selectedPatient)?.chronicConditions.join(', ') || 'None'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowNewNote(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewNote}
                  disabled={!selectedPatient}
                  className="flex items-center space-x-2 bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 hover:from-rak-magenta-700 hover:to-rak-magenta-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-5 h-5" />
                  <span>Create Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}