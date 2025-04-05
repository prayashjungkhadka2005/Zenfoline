import React from 'react';
import { FiUser, FiInfo, FiCode, FiBriefcase, FiFileText, FiSettings, FiAward } from 'react-icons/fi';

const EditorSidebar = ({ sections, activeSection, setActiveSection, formData }) => {
  // Get visible sections for navigation
  const getVisibleSections = () => {
    return sections.filter(section => 
      section.required || formData?.theme?.enabledSections?.[section.id] || false
    );
  };

  const visibleSections = getVisibleSections();
  const visibleCount = Object.values(formData?.theme?.enabledSections || {}).filter(Boolean).length;

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