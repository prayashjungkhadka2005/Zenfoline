import React from 'react';
import { FiUser, FiInfo, FiCode, FiBriefcase, FiFileText, FiSettings, FiAward, FiBook, FiServer } from 'react-icons/fi';

const EditorSidebar = ({ sections, activeSection, setActiveSection, formData, sectionVisibility }) => {
  // Filter sections based on visibility and required status
  const visibleSections = sections.filter(section => {
    // Always show required sections
    if (section.required) return true;
    
    // For non-required sections, check visibility
    return sectionVisibility[section.id] !== false;
  });

  const visibleCount = Object.values(sectionVisibility).filter(Boolean).length;

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 px-6 border-b border-gray-200 flex flex-col justify-center flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-800 leading-tight">Template Editor</h1>
        <p className="text-xs text-gray-500 mt-0.5">Customize your portfolio</p>
      </div>
      <nav className="px-4 py-6 space-y-2 overflow-y-auto flex-grow">
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
                  {section.id === 'skills' ? <FiAward className="w-5 h-5" /> : 
                   section.id === 'education' ? <FiBook className="w-5 h-5" /> : 
                   section.id === 'publications' ? <FiFileText className="w-5 h-5" /> :
                   section.id === 'services' ? <FiServer className="w-5 h-5" /> :
                   section.icon}
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