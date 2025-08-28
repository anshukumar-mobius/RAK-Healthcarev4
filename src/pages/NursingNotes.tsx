import React, { useState } from 'react';
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
  Save
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import nursingNotesData from '../data/nursingNotes.json';

interface NursingNote {
  id: string;
  encounterId: string;
  author: string;
  shift: 'Day' | 'Evening' | 'Night';
  time: string;
  vitals: {
    bp: string;
    hr: number;
    temp: number;
  };
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const quickNotePhrases = [
  "Patient resting comfortably",
  "No acute distress noted",
  "Vital signs stable",
  "Good pain control",
  "Ambulated with assistance",
  "Tolerating oral intake well",
  "No nausea or vomiting",
  "Urine output adequate",
  "Family at bedside",
  "Patient cooperative with care"
];

const shiftColors = {
  Day: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
  Evening: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400',
  Night: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
};

export function NursingNotes() {
  const { encounterId } = useParams<{ encounterId: string }>();
  const navigate = useNavigate();
  const { language } = useApp();
  
  const [notes, setNotes] = useState<NursingNote[]>(nursingNotesData);
  const [showNewNote, setShowNewNote] = useState(false);
  const [selectedShift, setSelectedShift] = useState<'all' | 'Day' | 'Evening' | 'Night'>('all');
  const [newNote, setNewNote] = useState({
    author: 'Current User',
    shift: 'Day' as const,
    vitals: { bp: '', hr: 0, temp: 0 },
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  const filteredNotes = selectedShift === 'all' 
    ? notes 
    : notes.filter(note => note.shift === selectedShift);

  const handleAddQuickPhrase = (phrase: string, field: 'subjective' | 'objective' | 'assessment' | 'plan') => {
    setNewNote(prev => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]} ${phrase}` : phrase
    }));
  };

  const handleSaveNote = () => {
    const note: NursingNote = {
      id: `nn-${Date.now()}`,
      encounterId: encounterId || 'enc-12345',
      ...newNote,
      time: new Date().toISOString()
    };
    
    setNotes(prev => [note, ...prev]);
    setShowNewNote(false);
    setNewNote({
      author: 'Current User',
      shift: 'Day',
      vitals: { bp: '', hr: 0, temp: 0 },
      subjective: '',
      objective: '',
      assessment: '',
      plan: ''
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredNotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nursing-notes-${encounterId}.json`;
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
              Encounter ID: {encounterId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-rak-beige-100 hover:bg-rak-beige-200 text-rak-beige-700 px-4 py-2 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
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
            Shift Notes
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
          <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">{note.author}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${shiftColors[note.shift]}`}>
                    {note.shift} Shift
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(note.time).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {/* Vitals */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Vital Signs
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>BP: {note.vitals.bp}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>HR: {note.vitals.hr} bpm</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span>Temp: {note.vitals.temp}°C</span>
                  </div>
                </div>
              </div>

              {/* SOAP Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Subjective</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                    {note.subjective}
                  </p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Objective</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                    {note.objective}
                  </p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Assessment</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                    {note.assessment}
                  </p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Plan</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
                    {note.plan}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Note Modal */}
      {showNewNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  New Nursing Note
                </h3>
                <button
                  onClick={() => setShowNewNote(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Shift
                  </label>
                  <select
                    value={newNote.shift}
                    onChange={(e) => setNewNote(prev => ({ ...prev, shift: e.target.value as any }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Day">Day</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={newNote.author}
                    onChange={(e) => setNewNote(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Vitals */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Vital Signs</h4>
                <div className="grid grid-cols-3 gap-4">
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
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      value={newNote.vitals.hr || ''}
                      onChange={(e) => setNewNote(prev => ({ 
                        ...prev, 
                        vitals: { ...prev.vitals, hr: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newNote.vitals.temp || ''}
                      onChange={(e) => setNewNote(prev => ({ 
                        ...prev, 
                        vitals: { ...prev.vitals, temp: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SOAP Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subjective
                  </label>
                  <textarea
                    value={newNote.subjective}
                    onChange={(e) => setNewNote(prev => ({ ...prev, subjective: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Patient's reported symptoms and concerns..."
                  />
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Quick phrases:</p>
                    <div className="flex flex-wrap gap-1">
                      {quickNotePhrases.slice(0, 3).map((phrase, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddQuickPhrase(phrase, 'subjective')}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                        >
                          {phrase}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Objective
                  </label>
                  <textarea
                    value={newNote.objective}
                    onChange={(e) => setNewNote(prev => ({ ...prev, objective: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Observable findings and measurements..."
                  />
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Quick phrases:</p>
                    <div className="flex flex-wrap gap-1">
                      {quickNotePhrases.slice(3, 6).map((phrase, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddQuickPhrase(phrase, 'objective')}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded"
                        >
                          {phrase}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assessment
                  </label>
                  <textarea
                    value={newNote.assessment}
                    onChange={(e) => setNewNote(prev => ({ ...prev, assessment: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Clinical assessment and interpretation..."
                  />
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Quick phrases:</p>
                    <div className="flex flex-wrap gap-1">
                      {quickNotePhrases.slice(6, 8).map((phrase, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddQuickPhrase(phrase, 'assessment')}
                          className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded"
                        >
                          {phrase}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plan
                  </label>
                  <textarea
                    value={newNote.plan}
                    onChange={(e) => setNewNote(prev => ({ ...prev, plan: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Care plan and interventions..."
                  />
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Quick phrases:</p>
                    <div className="flex flex-wrap gap-1">
                      {quickNotePhrases.slice(8, 10).map((phrase, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddQuickPhrase(phrase, 'plan')}
                          className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded"
                        >
                          {phrase}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewNote(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md"
                >
                  <Save className="w-4 h-4" />
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