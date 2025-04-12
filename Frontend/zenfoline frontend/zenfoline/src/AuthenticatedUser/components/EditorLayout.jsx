import React, { useState, useRef, useEffect } from 'react';

const EditorLayout = ({ sidebar, form, preview, previewMode }) => {
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
      
      if (isResizingPreview && previewMode === 'desktop') { // Only allow preview resize in desktop mode
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
  }, [isResizingSidebar, isResizingPreview, previewMode]);

  // Add useEffect to reset previewWidth when switching back to desktop mode
  useEffect(() => {
    if (previewMode === 'desktop') {
      setPreviewWidth(45); // Reset to default percentage
    }
  }, [previewMode]);

  return (
    <div className="flex h-screen bg-gray-50 editor-container overflow-hidden">
      {/* Left Sidebar - Always visible */}
      <div 
        className="bg-white border-r border-gray-200 overflow-hidden"
        style={{ 
          width: `${sidebarWidth}px`,
          transition: isResizingSidebar ? 'none' : 'width 150ms ease-out'
        }}
      >
        {sidebar}
      </div>
      
      {/* Sidebar resize handle - Always visible */}
      <div
        ref={sidebarResizeHandleRef}
        className="w-1 cursor-col-resize bg-gray-200 hover:bg-blue-500 transition-colors"
        onMouseDown={handleMouseDownSidebar}
      />
      
      {/* Middle Section - Form - Always visible */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {form}
      </div>
      
      {/* Preview resize handle - Disable interaction in mobile mode? Or keep? Keep for now */}
      <div
        ref={previewResizeHandleRef}
        className="w-1 cursor-col-resize bg-gray-200 hover:bg-blue-500 transition-colors"
        onMouseDown={previewMode === 'desktop' ? handleMouseDownPreview : undefined} 
      />
      
      {/* Right Section - Live Preview - Adjust width based on previewMode */}
      <div 
        className="bg-[#f8fafc] border-l border-gray-200 flex flex-col overflow-hidden"
        style={{ 
          width: previewMode === 'desktop' ? `${previewWidth}%` : '400px',
          transition: isResizingPreview ? 'none' : 'width 150ms ease-out'
        }}
      >
        {preview}
      </div>
    </div>
  );
};

export default EditorLayout; 