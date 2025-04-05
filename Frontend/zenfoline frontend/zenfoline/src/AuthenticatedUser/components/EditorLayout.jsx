import React, { useState, useRef, useEffect } from 'react';

const EditorLayout = ({ sidebar, form, preview }) => {
  // State to track the widths of the sections
  const [sidebarWidth, setSidebarWidth] = useState(256); // 16rem = 256px
  const [previewWidth, setPreviewWidth] = useState(45); // 45% of the container width
  
  // Refs for the resize handles
  const sidebarResizeHandleRef = useRef(null);
  const previewResizeHandleRef = useRef(null);
  
  // State to track if resizing is active
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingPreview, setIsResizingPreview] = useState(false);
  
  // Handle mouse down events for the resize handles
  const handleMouseDownSidebar = (e) => {
    setIsResizingSidebar(true);
    e.preventDefault();
  };
  
  const handleMouseDownPreview = (e) => {
    setIsResizingPreview(true);
    e.preventDefault();
  };
  
  // Handle mouse move events for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingSidebar) {
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 400) {
          setSidebarWidth(newWidth);
        }
      }
      
      if (isResizingPreview) {
        const containerWidth = document.querySelector('.editor-container').clientWidth;
        const newWidth = ((containerWidth - e.clientX) / containerWidth) * 100;
        if (newWidth >= 30 && newWidth <= 70) {
          setPreviewWidth(newWidth);
        }
      }
    };
    
    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingPreview(false);
    };
    
    if (isResizingSidebar || isResizingPreview) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, isResizingPreview]);
  
  return (
    <div className="flex h-screen bg-gray-50 editor-container">
      {/* Left Sidebar - Navigation */}
      <div 
        className="bg-white border-r border-gray-200 overflow-hidden"
        style={{ width: `${sidebarWidth}px` }}
      >
        {sidebar}
      </div>
      
      {/* Sidebar resize handle */}
      <div
        ref={sidebarResizeHandleRef}
        className="w-1 cursor-col-resize bg-gray-200 hover:bg-blue-500 transition-colors"
        onMouseDown={handleMouseDownSidebar}
      />
      
      {/* Middle Section - Form */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {form}
      </div>
      
      {/* Preview resize handle */}
      <div
        ref={previewResizeHandleRef}
        className="w-1 cursor-col-resize bg-gray-200 hover:bg-blue-500 transition-colors"
        onMouseDown={handleMouseDownPreview}
      />
      
      {/* Right Section - Live Preview */}
      <div 
        className="bg-[#f8fafc] border-l border-gray-200 flex flex-col overflow-hidden"
        style={{ width: `${previewWidth}%` }}
      >
        {preview}
      </div>
    </div>
  );
};

export default EditorLayout; 