import React, { useState, useRef, useEffect } from 'react';

const EditorLayout = ({ sidebar, form, preview, previewMode }) => {
  // State to track the widths of the sections
  const [sidebarWidth, setSidebarWidth] = useState(256); // 16rem = 256px
  const [desktopPreviewWidthPercent, setDesktopPreviewWidthPercent] = useState(54);
  const [responsivePixelPreviewWidth, setResponsivePixelPreviewWidth] = useState(500); // Default pixel width for responsive
  
  // Refs for the resize handles
  const sidebarResizeHandleRef = useRef(null);
  const previewResizeHandleRef = useRef(null);
  const editorContainerRef = useRef(null); // Ref for the main container
  
  // State to track if resizing is active
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingPreview, setIsResizingPreview] = useState(false);
  
  // Handle mouse down events for the resize handles
  const handleMouseDownSidebar = (e) => {
    setIsResizingSidebar(true);
    e.preventDefault();
  };
  
  // Only allow resizing if mode is 'responsive'
  const handleMouseDownPreview = (e) => {
    if (previewMode === 'responsive') {
      setIsResizingPreview(true);
      e.preventDefault();
    } // Do nothing for 'desktop' or 'mobile'
  };
  
  // Handle mouse move events for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Use cached container width if available
      const containerWidth = editorContainerRef.current?.clientWidth;
      if (!containerWidth) return; // Exit if container ref not ready

      // Sidebar resizing (no change)
      if (isResizingSidebar) {
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 400) {
          setSidebarWidth(newWidth);
        }
      }
      
      // Preview resizing (using pixels for responsive mode)
      if (isResizingPreview && previewMode === 'responsive') { 
        // Calculate target preview width in pixels directly
        const targetPixelPreviewWidth = containerWidth - e.clientX; 
        
        // Define boundaries (ensure form has at least ~200px)
        const minPixelWidth = 150;
        const minFormWidth = 200; 
        const handleWidths = 5; // Approx width of handles
        const maxPixelWidth = containerWidth - sidebarWidth - handleWidths - minFormWidth;
        
        // Clamp the width within boundaries
        const clampedWidth = Math.max(minPixelWidth, Math.min(targetPixelPreviewWidth, maxPixelWidth));
        
        setResponsivePixelPreviewWidth(clampedWidth);
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
  }, [isResizingSidebar, isResizingPreview, previewMode, sidebarWidth]);

  // useEffect to reset previewWidth on mode change
  useEffect(() => {
    if (previewMode === 'desktop') {
      setDesktopPreviewWidthPercent(54); // Reset desktop percentage
    } else if (previewMode === 'responsive') {
      setResponsivePixelPreviewWidth(500); // Reset responsive pixels to default
    }
    // No reset needed for mobile (fixed width)
    // No reset needed for states not relevant to the new mode
  }, [previewMode]);

  return (
    <div ref={editorContainerRef} className="flex h-screen bg-gray-50 editor-container overflow-hidden">
      {/* Left Sidebar - Always visible */}
      <div 
        className="bg-white border-r border-gray-200 overflow-hidden"
        style={{ 
          width: `${sidebarWidth}px`,
          transition: isResizingSidebar ? 'none' : 'width 150ms ease-out',
          flexShrink: 0
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
      
      {/* Middle Section - Form - Added min-width: 0 */}
      <div 
        className="flex-1 overflow-hidden flex flex-col"
        style={{ minWidth: 0 }} // Explicitly allow shrinking
      >
        {form}
      </div>
      
      {/* Preview resize handle - Temporarily removed hover style */}
      <div
        ref={previewResizeHandleRef}
        className={`w-1 bg-gray-200 transition-colors ${previewMode === 'responsive' ? 'cursor-col-resize hover:bg-blue-500' : 'cursor-default'}`} // Re-added hover style
        onMouseDown={previewMode === 'responsive' ? handleMouseDownPreview : undefined} 
      />
      
      {/* Right Section - Live Preview - Adjust width based on previewMode */}
      <div 
        className="bg-[#f8fafc] border-l border-gray-200 flex flex-col overflow-hidden"
        style={{ 
          width: previewMode === 'mobile' ? '375px' : 
                 previewMode === 'responsive' ? `${responsivePixelPreviewWidth}px` : 
                 `${desktopPreviewWidthPercent}%`,
          transition: (isResizingPreview && previewMode === 'responsive') ? 'none' : 'width 150ms ease-out',
          flexShrink: 0
        }}
      >
        {preview}
      </div>
    </div>
  );
};

export default EditorLayout; 