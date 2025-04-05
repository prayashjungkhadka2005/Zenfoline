import React, { useEffect, useState } from 'react';
import { FiUser, FiInfo, FiCode, FiBriefcase, FiFileText, FiSettings, FiAward } from 'react-icons/fi';
import useAuthStore from '../../store/userAuthStore';

// API base URL
const API_BASE_URL = 'http://localhost:3000';

const EditorSidebar = ({ sections, activeSection, setActiveSection, formData }) => {
  const [sectionVisibility, setSectionVisibility] = useState({});
  const userId = useAuthStore((state) => state.userId);

  // Fetch section visibility on component mount
  useEffect(() => {
    const fetchSectionVisibility = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio-save/section-visibility/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch section visibility');
        }
        const result = await response.json();
        
        if (result.data) {
          const visibility = {};
          Object.keys(result.data).forEach(section => {
            if (section !== 'customSections') {
              visibility[section] = result.data[section].isEnabled;
            }
          });
          setSectionVisibility(visibility);
        }
      } catch (error) {
        console.error('Error fetching section visibility:', error);
      }
    };

    if (userId) {
      fetchSectionVisibility();
    }
  }, [userId]);

  // Get visible sections for navigation
  const getVisibleSections = () => {
    return sections.filter(section => {
      // Always show required sections and settings
      if (section.required || section.id === 'settings') {
        return true;
      }
      
      // For non-required sections, check if they are enabled in the backend data
      // Fall back to formData if backend data is not available
      return sectionVisibility[section.id] !== undefined 
        ? sectionVisibility[section.id] 
        : formData?.theme?.enabledSections?.[section.id] ?? true;
    });
  };

  const visibleSections = getVisibleSections();
  const visibleCount = Object.values(sectionVisibility).filter(Boolean).length;

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Template Editor</h1>
        <p className="text-sm text-gray-500 mt-1">Customize your portfolio</p>
      </div>
      <nav className="px-4 py-6 space-y-2">
        {visibleSections.map((section) => (
          <div key={section.id} className="relative">
            <button
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-md ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {section.id === 'skills' ? <FiAward className="w-5 h-5" /> : section.icon}
                </div>
                <span className="text-sm font-medium">{section.label}</span>
              </div>
              {section.id === 'settings' && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {visibleCount} visible
                  </span>
                </div>
              )}
            </button>
            {activeSection === section.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default EditorSidebar; 