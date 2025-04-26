import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../store/userAuthStore';
import Spinner from '../../../components/Spinner';

// API base URL
const API_BASE_URL = 'http://localhost:3000';

const SettingsForm = ({ data, onUpdate, onSettingsSaved }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const userId = useAuthStore((state) => state.userId);
  const [localEnabledSections, setLocalEnabledSections] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [defaultSections, setDefaultSections] = useState([]);
  const [optionalSections, setOptionalSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [templateCategory, setTemplateCategory] = useState('');

  const commonClasses = {
    section: "max-w-3xl mx-auto space-y-8",
    infoBox: "bg-blue-50 p-4 rounded-lg mb-8",
    infoText: "text-blue-700 text-sm",
    sectionTitle: "text-lg font-medium text-gray-900 mb-4",
    sectionContainer: "bg-white rounded-lg border border-gray-200 p-6",
    toggleContainer: "flex items-center justify-between py-3 border-b last:border-b-0",
    toggleLabel: "text-sm font-medium text-gray-900",
    toggleDescription: "text-xs text-gray-500 mt-1",
    categoryTitle: "text-md font-medium text-gray-700 mb-3 mt-6"
  };

  // All available sections
  const allSections = [
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

  // Default sections by template category
  const defaultSectionsByCategory = {
    'developer': ['basics', 'about', 'skills', 'experience', 'projects', 'education', 'certifications'],
    'student': ['basics', 'about', 'education', 'skills', 'projects', 'certifications', 'awards'],
    'content-creator': ['basics', 'about', 'services', 'publications', 'projects', 'skills'],
    'designer': ['basics', 'about', 'projects', 'skills', 'experience', 'services'],
    'lawyer': ['basics', 'about', 'experience', 'education', 'certifications', 'services', 'publications'],
    'expert': ['basics', 'about', 'experience', 'skills', 'projects', 'publications', 'certifications', 'services']
  };

  // Fetch template default sections and section visibility
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get the template ID from the data prop
        const templateId = data?.templateId || 'developer'; // Default to developer if not specified
        console.log('Template ID:', templateId);
        
        // Fetch template data
        const templateResponse = await fetch(`${API_BASE_URL}/authenticated-user/activetemplate?userId=${userId}`);
        if (!templateResponse.ok) {
          throw new Error('Failed to fetch template data');
        }
        const templateData = await templateResponse.json();
        console.log('Template data:', templateData);
        
        // Get template category
        const category = templateData.category || 'designer';
        setTemplateCategory(category);
        console.log('Template category:', category);
        
        // Get default sections for this template category
        const defaultSectionIds = defaultSectionsByCategory[category] || ['basics', 'about'];
        console.log('Default section IDs:', defaultSectionIds);
        
        // Fetch section visibility
        const visibilityResponse = await fetch(`${API_BASE_URL}/portfolio-save/section-visibility/${userId}`);
        if (!visibilityResponse.ok) {
          throw new Error('Failed to fetch section visibility');
        }
        const visibilityData = await visibilityResponse.json();
        console.log('Visibility data:', visibilityData);
        
        // Process section visibility data
        if (visibilityData.data) {
          const sectionConfig = {};
          Object.keys(visibilityData.data).forEach(section => {
            if (section !== 'customSections') {
              sectionConfig[section] = visibilityData.data[section].isEnabled;
            }
          });
          
          // Update parent component with the fetched section configuration
          onUpdate({
            ...data,
            enabledSections: sectionConfig
          });
          
          // Set local state
          setLocalEnabledSections(sectionConfig);
          
          // Organize sections into default and optional
          const defaultSectionsList = allSections.filter(section => 
            defaultSectionIds.includes(section.id) || section.required
          );
          
          const optionalSectionsList = allSections.filter(section => 
            !defaultSectionIds.includes(section.id) && !section.required
          );
          
          console.log('Default sections list:', defaultSectionsList);
          console.log('Optional sections list:', optionalSectionsList);
          
          setDefaultSections(defaultSectionsList);
          setOptionalSections(optionalSectionsList);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load settings');
        
        // Set fallback sections in case of error
        const defaultSectionsList = allSections.filter(section => 
          ['basics', 'about'].includes(section.id) || section.required
        );
        
        const optionalSectionsList = allSections.filter(section => 
          !['basics', 'about'].includes(section.id) && !section.required
        );
        
        setDefaultSections(defaultSectionsList);
        setOptionalSections(optionalSectionsList);
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && !isInitialized) {
      fetchData();
    }
  }, [userId, isInitialized, data, onUpdate]);

  // Handle section toggle in local state only
  const handleSectionToggle = (sectionId, isEnabled) => {
    setLocalEnabledSections(prev => {
      // Defensive: ensure prev has all sections, not just toggled ones
      const fullState = { ...allSections.reduce((acc, s) => ({ ...acc, [s.id]: prev[s.id] ?? false }), {}), ...prev };
      const newState = {
        ...fullState,
        [sectionId]: isEnabled
      };
      if (onSettingsSaved) {
        onSettingsSaved(newState);
      }
      return newState;
    });
  };

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

  // Render a section toggle
  const renderSectionToggle = (section) => (
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
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg"  />
      </div>
    );
  }

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
          
          {/* Default Template Sections */}
          <h4 className={commonClasses.categoryTitle}>
            Default {templateCategory ? templateCategory.charAt(0).toUpperCase() + templateCategory.slice(1) : 'Template'} Sections
          </h4>
          <div className="space-y-1">
            {defaultSections.length > 0 ? (
              defaultSections.map(renderSectionToggle)
            ) : (
              <p className="text-gray-500 italic">No default sections found for this template.</p>
            )}
          </div>
          
          {/* Optional Sections */}
          <h4 className={commonClasses.categoryTitle}>Optional Sections</h4>
          <div className="space-y-1">
            {optionalSections.length > 0 ? (
              optionalSections.map(renderSectionToggle)
            ) : (
              <p className="text-gray-500 italic">No optional sections available.</p>
            )}
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