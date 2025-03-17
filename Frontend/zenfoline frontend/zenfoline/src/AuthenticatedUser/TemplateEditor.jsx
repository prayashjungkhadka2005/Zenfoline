import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useTemplateStore from '../store/userTemplateStore';
import useAuthStore from '../store/userAuthStore';
import { templateComponents } from '../RenderedTemplate/templateComponents';

const TemplateEditor = () => {
  const { templateId } = useParams();
  const { templates, fetchTemplates } = useTemplateStore();
  const userId = useAuthStore((state) => state.userId);

  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeSection, setActiveSection] = useState('basics');
  const [fontStyle, setFontStyle] = useState('Poppins');
  const [formData, setFormData] = useState({
    theme: {
      fontStyle: 'Poppins',
    },
    basics: {
      name: '',
      role: '',
      bio: '',
      email: '',
      phone: '',
      location: '',
      profileImage: null,
      socialLinks: {
        linkedin: '',
        github: '',
        twitter: ''
      }
    },
    about: {
      description: '',
      highlights: ['']
    },
    skills: {
      technical: [{ name: '', level: 'Beginner' }],
      soft: [{ name: '', level: 'Beginner' }]
    },
    experience: [{
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }],
    education: [{
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    projects: [{
      title: '',
      description: '',
      technologies: [''],
      image: null,
      liveLink: '',
      sourceCode: ''
    }],
    certifications: [{
      name: '',
      issuer: '',
      date: '',
      link: ''
    }],
    publications: [{
      title: '',
      publisher: '',
      date: '',
      link: '',
      description: ''
    }],
    services: [{
      title: '',
      description: '',
      icon: ''
    }]
  });

  // Fetch template data and theme on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        // Fetch templates
        await fetchTemplates(userId);
        const template = templates.find(t => t._id === templateId);
        if (template) {
          setActiveTemplate(template);
          if (template.data) {
            setFormData(template.data);
          }
        }

        // Fetch theme settings
        try {
          const response = await fetch(
            `http://localhost:3000/authenticated-user/gettheme?userId=${userId}`
          );
          if (response.ok) {
            const { theme } = await response.json();
            console.log('Fetched theme:', theme);
            const themeFontStyle = theme.fontStyle || 'Poppins';
            setFontStyle(themeFontStyle);
            setFormData(prev => ({
              ...prev,
              theme: {
                ...prev.theme,
                fontStyle: themeFontStyle
              }
            }));
          }
        } catch (error) {
          console.error('Error fetching theme:', error);
        }
      }
    };
    fetchData();
  }, [userId, templateId, templates, fetchTemplates]);

  const handleImageUpload = async (e, section, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const { imagePath } = await response.json();
        // Update the appropriate section with the new image path
        if (section === 'basics') {
          setFormData(prev => ({
            ...prev,
            basics: { ...prev.basics, profileImage: imagePath }
          }));
        } else if (section === 'projects' && index !== null) {
          const newProjects = [...formData.projects];
          newProjects[index] = { ...newProjects[index], image: imagePath };
          setFormData(prev => ({ ...prev, projects: newProjects }));
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (index !== null && Array.isArray(newData[section])) {
        newData[section][index] = { ...newData[section][index], [field]: value };
      } else if (typeof newData[section] === 'object') {
        newData[section] = { ...newData[section], [field]: value };
      }
      return newData;
    });
  };

  const addItem = (section) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (Array.isArray(newData[section])) {
        newData[section] = [...newData[section], { ...newData[section][0] }];
      }
      return newData;
    });
  };

  const removeItem = (section, index) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (Array.isArray(newData[section])) {
        newData[section] = newData[section].filter((_, i) => i !== index);
      }
      return newData;
    });
  };

  const renderFormSection = () => {
    switch (activeSection) {
      case 'basics':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'basics')}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.basics.name}
                onChange={(e) => handleInputChange('basics', 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            {/* Add other basic fields */}
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6">
            {formData.projects.map((project, index) => (
              <div key={index} className="border p-4 rounded-md">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-medium">Project {index + 1}</h3>
                  <button
                    onClick={() => removeItem('projects', index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => handleInputChange('projects', 'title', e.target.value, index)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  {/* Add other project fields */}
                </div>
              </div>
            ))}
            <button
              onClick={() => addItem('projects')}
              className="w-full py-2 bg-blue-500 text-white rounded-md"
            >
              Add Project
            </button>
          </div>
        );
      // Add other section cases
      default:
        return null;
    }
  };

  const TemplateComponent = activeTemplate ? templateComponents[activeTemplate.predefinedTemplate] : null;

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-100 border-r overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Edit Sections</h2>
          <nav className="space-y-2">
            {Object.keys(formData).map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeSection === section
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Middle Section - Form */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            Edit {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>
          {renderFormSection()}
        </div>
      </div>

      {/* Right Section - Live Preview */}
      <div className="w-1/2 border-l overflow-y-auto">
        <div className="sticky top-0 p-4 bg-white border-b">
          <h2 className="text-lg font-bold">Live Preview</h2>
        </div>
        <div className="p-4">
          {TemplateComponent && (
            <TemplateComponent 
              template={activeTemplate} 
              data={formData}
              fontStyle={fontStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor; 