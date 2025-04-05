import React from 'react';

const EditorLayout = ({ sidebar, form, preview }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 bg-white border-r border-gray-200">
        {sidebar}
      </div>

      {/* Middle Section - Form */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {form}
      </div>

      {/* Right Section - Live Preview */}
      <div className="w-[45%] bg-[#f8fafc] border-l border-gray-200 flex flex-col">
        {preview}
      </div>
    </div>
  );
};

export default EditorLayout; 