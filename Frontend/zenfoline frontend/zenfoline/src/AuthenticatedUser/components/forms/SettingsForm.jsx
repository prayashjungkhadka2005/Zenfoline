import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../store/userAuthStore';

// API base URL
const API_BASE_URL = 'http://localhost:3000';

const SettingsForm = ({ data, onUpdate, onSettingsSaved }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const userId = useAuthStore((state) => state.userId);
  const [localEnabledSections, setLocalEnabledSections] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  const commonClasses = {
    section: "max-w-3xl mx-auto space-y-8",
    infoBox: "bg-blue-50 p-4 rounded-lg mb-8",
    infoText: "text-blue-700 text-sm",
    sectionTitle: "text-lg font-medium text-gray-900 mb-4",
    sectionContainer: "bg-white rounded-lg border border-gray-200 p-6",
    toggleContainer: "flex items-center justify-between py-3 border-b last:border-b-0",
    toggleLabel: "text-sm font-medium text-gray-900",
    toggleDescription: "text-xs text-gray-500 mt-1"
  };

  // Initialize local state with data from props
  useEffect(() => {
    if (data && data.enabledSections && !isInitialized) {
      setLocalEnabledSections(data.enabledSections);
      setIsInitialized(true);
    }
  }, [data, isInitialized]);

  // Fetch section visibility settings on component mount
  useEffect(() => {
    const fetchSectionVisibility = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio-save/section-visibility/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch section visibility');
        }
        const result = await response.json();
        
        // Update the form data with the fetched section configuration
        if (result.data) {
          const sectionConfig = {};
          Object.keys(result.data).forEach(section => {
            if (section !== 'customSections') {
              sectionConfig[section] = result.data[section].isEnabled;
            }
          });
          
          // Update both the parent component and local state
          onUpdate({
            ...data,
            enabledSections: sectionConfig
          });
          setLocalEnabledSections(sectionConfig);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error fetching section visibility:', error);
        setError('Failed to load section visibility settings');
      }
    };

    if (userId && !isInitialized) {
      fetchSectionVisibility();
    }
  }, [userId, isInitialized]);

  // Handle section toggle in local state only
  const handleSectionToggle = (sectionId, isEnabled) => {
    console.log(`Toggling ${sectionId} to ${isEnabled}`);
    setLocalEnabledSections(prev => {
      const newState = {
        ...prev,
        [sectionId]: isEnabled
      };
      console.log('New state:', newState);
      return newState;
    });
  };

  const sections = [
    { id: 'basics', label: 'Basics', required: true },
    { id: 'about', label: 'About', required: true },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'publications', label: 'Publications' },
    { id: 'awards', label: 'Awards' },
    { id: 'services', label: 'Services' }
  ];

  const handleSave = async () => {
    try {
      setError('');
      setStatus('saving');
      
      // Prepare the section configuration for the API
      const sectionConfiguration = {};
      Object.keys(localEnabledSections).forEach(sectionId => {
        sectionConfiguration[sectionId] = {
          isEnabled: localEnabledSections[sectionId]
        };
      });
      
      // Call the API to update section visibility
      const response = await fetch(`${API_BASE_URL}/portfolio-save/section-visibility/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sectionConfiguration })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update section visibility');
      }
      
      // Update parent component with the new settings
      onUpdate({
        ...data,
        enabledSections: localEnabledSections
      });
      
      // Notify parent component that settings have been saved
      if (onSettingsSaved) {
        onSettingsSaved(localEnabledSections);
      }
      
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setStatus('error');
      setError('Failed to save settings');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 3000);
    }
  };

  return (
    <div className={commonClasses.section}>
      <div className={commonClasses.infoBox}>
        <p className={commonClasses.infoText}>
          Customize your portfolio by choosing which sections to display.
        </p>
      </div>

      <div className="space-y-8">
        <div className={commonClasses.sectionContainer}>
          <h3 className={commonClasses.sectionTitle}>Section Visibility</h3>
          <div className="space-y-1">
            {sections.map((section) => (
              <div key={section.id} className={commonClasses.toggleContainer}>
                <div>
                  <h4 className={commonClasses.toggleLabel}>{section.label}</h4>
                  {section.required && (
                    <p className={commonClasses.toggleDescription}>Required section</p>
                  )}
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={section.required || localEnabledSections[section.id] || false}
                      onChange={(e) => handleSectionToggle(section.id, e.target.checked)}
                      disabled={section.required}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-colors ${
          status === 'saving' 
            ? 'bg-gray-400 cursor-not-allowed' 
            : status === 'success' 
              ? 'bg-green-500' 
              : status === 'error' 
                ? 'bg-red-500' 
                : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={status === 'saving'}
      >
        {status === 'saving' 
          ? 'Saving...' 
          : status === 'success' 
            ? 'Saved Successfully!' 
            : status === 'error' 
              ? error || 'Failed to save' 
              : 'Save Settings'}
      </button>
    </div>
  );
};

export default SettingsForm; 