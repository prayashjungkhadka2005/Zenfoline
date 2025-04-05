import React from 'react';

const SettingsForm = ({ data, onUpdate, fontStyle, setFontStyle }) => {
  const handleSectionVisibility = (sectionId, isEnabled) => {
    onUpdate({
      ...data,
      enabledSections: {
        ...data.enabledSections,
        [sectionId]: isEnabled
      }
    });
  };

  const handleFontStyleChange = (style) => {
    setFontStyle(style);
    onUpdate({
      ...data,
      fontStyle: style
    });
  };

  const sections = [
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

  const fontStyles = [
    { id: 'default', label: 'Default' },
    { id: 'modern', label: 'Modern' },
    { id: 'classic', label: 'Classic' },
    { id: 'minimal', label: 'Minimal' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Section Visibility</h3>
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="flex items-center justify-between py-3 border-b">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{section.label}</h4>
                {section.required && (
                  <p className="text-xs text-gray-500">Required section</p>
                )}
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.required || data.enabledSections?.[section.id] || false}
                    onChange={(e) => handleSectionVisibility(section.id, e.target.checked)}
                    disabled={section.required}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Font Style</h3>
        <div className="grid grid-cols-2 gap-4">
          {fontStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => handleFontStyleChange(style.id)}
              className={`p-4 text-left rounded-lg border ${
                fontStyle === style.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{style.label}</div>
              <div className="text-sm text-gray-500">
                Sample text in {style.label.toLowerCase()} style
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsForm; 