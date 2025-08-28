import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Download, 
  ArrowLeft, 
  User, 
  Clock, 
  Activity,
  Thermometer,
  Heart,
  Droplets,
  Save,
  Search
} from 'lucide-react';
import { useEMRStore } from '../stores/emrStore';
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

const quickNotePhrases = {
  subjective: [
    "Patient reports feeling comfortable",
    "No complaints at this time",
    "Pain well controlled",
    "Denies nausea or vomiting",
    "Reports good appetite"
  ],
  objective: [
    "Patient resting comfortably",
    "No acute distress noted",
    "Vital signs stable",
    "Ambulated with assistance",
    "Tolerating oral intake well"
  ],
  assessment: [
    "Condition stable",
    "Responding well to treatment",
    "No complications noted",
    "Pain adequately managed",
    "Ready for discharge planning"
  ],
  plan: [
    "Continue current medications",
    "Monitor vital signs q4h",
    "Encourage ambulation",
    "Maintain IV access",
    "Follow up with physician"
  ]
};

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

export function NursingNotes() {
  const { encounterId } = useParams<{ encounterId: string }>();
  const navigate = useNavigate();
  const { patients } = useEMRStore();
  
  const [notes, setNotes] = useState<NursingNote[]>([]);
  const [showNewNote, setShowNewNote] = useState(false);
  const [selectedShift, setSelectedShift] = useState<'all' | 'Day' | 'Evening' | 'Night'>('all');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [newNote, setNewNote] = useState({
    patientId: '',
    encounterId: '',
    author: 'Current Nurse',
    shift: 'Day' as const,
    vitals: { bp: '', hr: 0, temp: 0, spo2: 98, rr: 16, pain: 0 },
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    priority: 'routine' as const
  });

  useEffect(() => {
    // Load and filter notes based on encounterId if provided
    const allNotes = nursingNotesData as NursingNote[];
    if (encounterId) {
      const filteredNotes = allNotes.filter(note => note.encounterId === encounterId);
      setNotes(filteredNotes);
    } else {
      setNotes(allNotes);
    }
  }, [encounterId]);

  const filteredNotes = selectedShift === 'all' 
    ? notes 
    : notes.filter(note => note.shift === selectedShift);

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patientId);
      setNewNote(prev => ({
        ...prev,
        patientId: patient.id,
        encounterId: `V${patient.id.padStart(3, '0')}` // Generate encounter ID
      }));
    }
  };

  const handleAddQuickPhrase = (phrase: string, field: 'subjective' | 'objective' | 'assessment' | 'plan') => {
    setNewNote(prev => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]} ${phrase}` : phrase
    }));
  };

  const handleSaveNote = () => {
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    const note: NursingNote = {
      id: `nn-${Date.now()}`,
      encounterId: newNote.encounterId,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patient: {
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        mrn: patient.mrn,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        room: 'A-101',
        bed: '1'
      },
      author: newNote.author,
      shift: newNote.shift,
      time: new Date().toISOString(),
      vitals: newNote.vitals,
      subjective: newNote.subjective,
      objective: newNote.objective,
      assessment: newNote.assessment,
      plan: newNote.plan,
      priority: newNote.priority,
      status: 'final'
    };
    
    setNotes(prev => [note, ...prev]);
    setShowNewNote(false);
    setSelectedPatient('');
    setNewNote({
      patientId: '',
      encounterId: '',
      author: 'Current Nurse',
      shift: 'Day',
      vitals: { bp: '', hr: 0, temp: 0, spo2: 98, rr: 16, pain: 0 },
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      priority: 'routine'
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredNotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nursing-notes-${encounterId || 'all'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-rak-magenta-600 hover:text-rak-magenta-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className="w-8 h-8 mr-3 text-rak-magenta-600" />
              Nursing & Progress Notes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {encounterId ? `Encounter ID: ${encounterId}` : 'All nursing notes'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-rak-beige-100 hover:bg-rak-beige-200 text-rak-beige-700 px-4 py-2 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowNewNote(true)}
            className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Shift Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Shift Notes ({filteredNotes.length})
          </h3>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
            {['all', 'Day', 'Evening', 'Night'].map((shift) => (
              <button
                key={shift}
                onClick={() => setSelectedShift(shift as any)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedShift === shift
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {shift === 'all' ? 'All Shifts' : shift}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            {/* Note Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-rak-pink-50 to-rak-beige-50 dark:from-rak-pink-900/10 dark:to-rak-beige-900/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rak-magenta-100 dark:bg-rak-magenta-900/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-rak-magenta-600 dark:text-rak-magenta-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {note.patient.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>MRN: {note.patient.mrn}</span>
                      <span>Room: {note.patient.room || 'N/A'}</span>
                      <span>Bed: {note.patient.bed || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[note.priority]}`}>
                    {note.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${shiftColors[note.shift]}`}>
                    {note.shift} Shift
                  </span>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900 dark:text-white">{note.author}</span>
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(note.time).toLocaleString()}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  note.status === 'final' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {note.status}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              {/* Vitals */}
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-rak-magenta-600" />
                  Vital Signs
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-xs text-gray-500">BP</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{note.vitals.bp}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <Heart className="w-4 h-4 text-red-500" />
                    <div>
                      <div className="text-xs text-gray-500">HR</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{note.vitals.hr} bpm</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="text-xs text-gray-500">Temp</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{note.vitals.temp}°C</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <Activity className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="text-xs text-gray-500">SpO2</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{note.vitals.spo2}%</div>
                    </div>
                  </div>
                  {note.vitals.rr && (
                    <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border">
                      <Activity className="w-4 h-4 text-purple-500" />
                      <div>
                        <div className="text-xs text-gray-500">RR</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{note.vitals.rr}/min</div>
                      </div>
                    </div>
                  )}
                  {note.vitals.pain !== undefined && (
                    <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border">
                      <div className="w-4 h-4 text-pink-500 font-bold text-center">!</div>
                      <div>
                        <div className="text-xs text-gray-500">Pain</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{note.vitals.pain}/10</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SOAP Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h5 className="font-semibold text-blue-800 dark:text-blue-400 mb-2 flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      Subjective
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {note.subjective}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h5 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2 flex items-center">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                      Assessment
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {note.assessment}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h5 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      Objective
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {note.objective}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h5 className="font-semibold text-purple-800 dark:text-purple-400 mb-2 flex items-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                      Plan
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {note.plan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredNotes.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No nursing notes found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Create a new note to get started</p>
          </div>
        )}
      </div>

      {/* New Note Modal */}
      {showNewNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">New Nursing Note</h3>
                  <p className="text-rak-magenta-100 mt-1">Document patient care and observations</p>
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
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Patient Selection
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Patient *
                    </label>
                    <select
                      value={selectedPatient}
                      onChange={(e) => handlePatientSelect(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Choose a patient...</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} - {patient.mrn}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedPatient && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">Selected Patient:</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {patients.find(p => p.id === selectedPatient)?.firstName} {patients.find(p => p.id === selectedPatient)?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          MRN: {patients.find(p => p.id === selectedPatient)?.mrn}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Shift *
                  </label>
                  <select
                    value={newNote.shift}
                    onChange={(e) => setNewNote(prev => ({ ...prev, shift: e.target.value as any }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  >
                    <option value="Day">Day Shift</option>
                    <option value="Evening">Evening Shift</option>
                    <option value="Night">Night Shift</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newNote.priority}
                    onChange={(e) => setNewNote(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={newNote.author}
                    onChange={(e) => setNewNote(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                  />
                </div>
              </div>

              {/* Vitals */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-rak-magenta-600" />
                  Vital Signs
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Blood Pressure
                    </label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={newNote.vitals.bp}
                      onChange={(e) => setNewNote(prev => ({ 
                        ...prev, 
                        vitals: { ...prev.vitals, bp: e.target.value }
                      }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Heart Rate
                    </label>
                    <input
                      type="number"
                      placeholder="72"
                      value={newNote.vitals.hr || ''}
                      onChange={(e) => setNewNote(prev => ({ 
                        ...prev, 
                        vitals: { ...prev.vitals, hr: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Temperature
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={newNote.vitals.temp || ''}
                      onChange={(e) => setNewNote(prev => ({ 
                        ...prev, 
                        vitals: { ...prev.vitals, temp: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SpO2 (%)
                    </label>
                    <input
                      type="number"
                      placeholder="98"
                      value={newNote.vitals.spo2 || ''}
                      onChange={(e) => setNewNote(prev => ({ 
                        ...prev, 
                        vitals: { ...prev.vitals, spo2: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Resp. Rate
                    </label>
                    <input
                      type="number"
                      placeholder="16"
                      value={newNote.vitals.rr || ''}
                      onChange={(e) => setNewNote(prev => ({ 
                        ...prev, 
                        vitals: { ...prev.vitals, rr: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pain (0-10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0"
                      value={newNote.vitals.pain || ''}
                      onChange={(e) => setNewNote(prev => ({ 
                        ...prev, 
                        vitals: { ...prev.vitals, pain: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500"
                    />
                  </div>
                </div>
              </div>

              {/* SOAP Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Subjective
                    </label>
                    <textarea
                      value={newNote.subjective}
                      onChange={(e) => setNewNote(prev => ({ ...prev, subjective: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Patient's reported symptoms and concerns..."
                    />
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick phrases:</p>
                      <div className="flex flex-wrap gap-1">
                        {quickNotePhrases.subjective.map((phrase, index) => (
                          <button
                            key={index}
                            onClick={() => handleAddQuickPhrase(phrase, 'subjective')}
                            className="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded transition-colors"
                          >
                            {phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Assessment
                    </label>
                    <textarea
                      value={newNote.assessment}
                      onChange={(e) => setNewNote(prev => ({ ...prev, assessment: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 resize-none"
                      placeholder="Clinical assessment and interpretation..."
                    />
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick phrases:</p>
                      <div className="flex flex-wrap gap-1">
                        {quickNotePhrases.assessment.map((phrase, index) => (
                          <button
                            key={index}
                            onClick={() => handleAddQuickPhrase(phrase, 'assessment')}
                            className="text-xs bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-800/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded transition-colors"
                          >
                            {phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Objective
                    </label>
                    <textarea
                      value={newNote.objective}
                      onChange={(e) => setNewNote(prev => ({ ...prev, objective: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="Observable findings and measurements..."
                    />
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick phrases:</p>
                      <div className="flex flex-wrap gap-1">
                        {quickNotePhrases.objective.map((phrase, index) => (
                          <button
                            key={index}
                            onClick={() => handleAddQuickPhrase(phrase, 'objective')}
                            className="text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-700 dark:text-green-400 px-2 py-1 rounded transition-colors"
                          >
                            {phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Plan
                    </label>
                    <textarea
                      value={newNote.plan}
                      onChange={(e) => setNewNote(prev => ({ ...prev, plan: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Care plan and interventions..."
                    />
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick phrases:</p>
                      <div className="flex flex-wrap gap-1">
                        {quickNotePhrases.plan.map((phrase, index) => (
                          <button
                            key={index}
                            onClick={() => handleAddQuickPhrase(phrase, 'plan')}
                            className="text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-800/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded transition-colors"
                          >
                            {phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
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
                  onClick={handleSaveNote}
                  disabled={!selectedPatient}
                  className="flex items-center space-x-2 bg-gradient-to-r from-rak-magenta-600 to-rak-magenta-700 hover:from-rak-magenta-700 hover:to-rak-magenta-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}