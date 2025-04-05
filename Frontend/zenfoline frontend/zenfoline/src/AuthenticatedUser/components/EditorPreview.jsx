import React from 'react';

const EditorPreview = ({ scale, setScale, TemplateComponent, activeTemplate, formData, fontStyle, userId, showNotification }) => {
  return (
    <>
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Preview</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const portfolioUrl = `${window.location.origin}/portfolio/${userId}`;
              navigator.clipboard.writeText(portfolioUrl);
              showNotification('Portfolio URL copied to clipboard!');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            <span>Share Portfolio</span>
          </button>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Scale:</label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div 
          className="min-h-full"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            height: `${100/scale}%`  // Adjust container height based on scale
          }}
        >
          {TemplateComponent && (
            <TemplateComponent 
              template={activeTemplate} 
              data={formData}
              fontStyle={fontStyle}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EditorPreview; 