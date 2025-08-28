import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Save, Edit, ArrowLeft, User } from 'lucide-react';
import dischargeSummaryData from '../data/dischargeSummary.json';

interface DischargeSummarySection {
  title: string;
  text: string;
}

interface DischargeSummary {
  id: string;
  encounterId: string;
  patient: {
    id: string;
    name: string;
    mrn?: string;
    dateOfBirth?: string;
    gender?: string;
  };
  sections: DischargeSummarySection[];
  status: string;
  dischargeDate?: string;
  attendingPhysician?: string;
}

export function DischargeSummary() {
  const { encounterId } = useParams<{ encounterId: string }>();
  const navigate = useNavigate();
  
  const [summary, setSummary] = useState<DischargeSummary | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    // Find the discharge summary for the specific encounter
    const foundSummary = dischargeSummaryData.find(
      (item: any) => item.encounterId === encounterId
    );
    
    if (foundSummary) {
      setSummary(foundSummary as DischargeSummary);
    } else {
      // Fallback to first summary if encounter not found
      setSummary(dischargeSummaryData[0] as DischargeSummary);
    }
  }, [encounterId]);

  const handleEditSection = (sectionTitle: string, currentText: string) => {
    setEditingSection(sectionTitle);
    setEditText(currentText);
  };

  const handleSaveSection = () => {
    if (editingSection && summary) {
      setSummary(prev => {
        if (!prev) return null;
        return {
          ...prev,
          sections: prev.sections.map(section =>
            section.title === editingSection
              ? { ...section, text: editText }
              : section
          )
        };
      });
      setEditingSection(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditText('');
  };

  const handleExport = () => {
    if (!summary) return;
    
    const dataStr = JSON.stringify(summary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `discharge-summary-${summary.encounterId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Show loading state if summary is not loaded yet
  if (!summary) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading discharge summary...</p>
          </div>
        </div>
      </div>
    );
  }

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
              Discharge Summary
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
          <button className="flex items-center space-x-2 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-4 py-2 rounded-md transition-colors">
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-rak-magenta-100 dark:bg-rak-magenta-900/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-rak-magenta-600 dark:text-rak-magenta-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {summary.patient.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Patient ID: {summary.patient.id} • Status: {summary.status}
            </p>
          </div>
        </div>
      </div>

      {/* Discharge Summary Sections */}
      <div className="space-y-4">
        {summary.sections.map((section, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                {editingSection !== section.title && (
                  <button
                    onClick={() => handleEditSection(section.title, section.text)}
                    className="flex items-center space-x-1 text-rak-magenta-600 hover:text-rak-magenta-700 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4">
              {editingSection === section.title ? (
                <div className="space-y-4">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rak-magenta-500 resize-none"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSaveSection}
                      className="flex items-center space-x-1 bg-rak-magenta-600 hover:bg-rak-magenta-700 text-white px-3 py-2 rounded-md text-sm"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {section.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}