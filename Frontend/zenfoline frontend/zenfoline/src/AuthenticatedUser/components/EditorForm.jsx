import React from 'react';

const EditorForm = ({ activeSection, sections, renderFormSection }) => {
  const currentSection = sections.find(s => s.id === activeSection);
  
  return (
    <>
      <div className="h-16 px-6 border-b bg-white flex items-center flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-800">
          {currentSection?.label || 'Section'}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderFormSection()}
        </div>
      </div>
    </>
  );
};

export default EditorForm; 