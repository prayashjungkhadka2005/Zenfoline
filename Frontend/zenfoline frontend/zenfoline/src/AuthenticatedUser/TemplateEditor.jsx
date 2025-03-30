import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useTemplateStore from '../store/userTemplateStore';
import useAuthStore from '../store/userAuthStore';
import { templateComponents } from '../RenderedTemplate/templateComponents';
import { FiUser, FiInfo, FiCode, FiBriefcase, FiBook, FiAward, FiFileText, FiStar, FiTool, FiSettings, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { FaCode, FaServer, FaDatabase, FaTools, FaCloud, FaEnvelope, FaMapMarkerAlt, FaPhone, FaGlobe } from 'react-icons/fa';
import profile from "../assets/profile.png";

const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = type === 'success' ? 'rgba(0, 0, 0, 0.8)' : '#f44336';
    notification.style.color = 'white';
    notification.style.padding = '20px 40px';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '1000';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.fontSize = '16px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.minWidth = '300px';
    notification.style.textAlign = 'center';
    notification.style.animation = 'fadeInOut 2.5s forwards';

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -40%); }
            15% { opacity: 1; transform: translate(-50%, -50%); }
            85% { opacity: 1; transform: translate(-50%, -50%); }
            100% { opacity: 0; transform: translate(-50%, -60%); }
        }
    `;
    document.head.appendChild(style);

    // Create icon element
    const icon = document.createElement('span');
    icon.innerHTML = type === 'success' 
        ? '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    
    // Create message element
    const messageElement = document.createElement('span');
    messageElement.textContent = message;

    notification.appendChild(icon);
    notification.appendChild(messageElement);
    document.body.appendChild(notification);

    // Remove the notification and style after animation
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 2500);
};

const TemplateEditor = () => {
  const { templateId } = useParams();
  const { templates, fetchTemplates } = useTemplateStore();
  const userId = useAuthStore((state) => state.userId);

  // Move commonClasses to component level
  const commonClasses = {
    input: "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    label: "block text-sm font-medium text-gray-700 mb-2",
    section: "space-y-6",
    infoBox: "bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6",
    infoText: "text-sm text-blue-700",
    grid: "grid grid-cols-2 gap-6",
    itemCard: "bg-white rounded-lg border border-gray-200 p-6 relative",
    removeButton: "inline-flex items-center justify-center p-1 text-red-500 hover:text-red-700 transition-colors",
    addButton: "w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
  };

  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeSection, setActiveSection] = useState('basics');
  const [fontStyle, setFontStyle] = useState('Poppins');
  const [scale, setScale] = useState(0.8); // Add scale control for preview
  const [formData, setFormData] = useState({
    theme: {
      fontStyle: 'Poppins',
      enabledSections: {
        about: true,
        skills: true,
        experience: true,
        projects: true
      }
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
      highlights: [{ text: '' }]
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
    projects: [{
      title: '',
      description: '',
      technologies: [],
      newTech: '',
      image: null,
      liveLink: '',
      sourceCode: ''
    }]
  });

  const [showSettings, setShowSettings] = useState(false);

  // Fetch template data and theme on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (userId && templateId) {
        try {
          console.log('Fetching initial data...');
          
          // Fetch templates
          await fetchTemplates(userId);
          const template = templates.find(t => t._id === templateId);
          
          if (template && isMounted) {
            console.log('Found template:', template);
            setActiveTemplate(template);
            
            // Initialize form data with template data or default structure
            if (template.data) {
              console.log('Setting form data from template:', template.data);
              setFormData(prev => ({
                ...prev,
                basics: template.data.basics || prev.basics,
                about: template.data.about || prev.about,
                skills: template.data.skills || prev.skills,
                experience: template.data.experience || prev.experience,
                projects: template.data.projects || prev.projects,
                theme: {
                  ...prev.theme,
                  fontStyle: template.data.theme?.fontStyle || prev.theme.fontStyle,
                  enabledSections: {
                    ...prev.theme.enabledSections,
                    ...(template.data.theme?.enabledSections || {
                      about: true,
                      skills: true,
                      experience: true,
                      projects: true
                    })
                  }
                }
              }));
            }
          }

          // Fetch theme settings
          const response = await fetch(
            `http://localhost:3000/authenticated-user/gettheme?userId=${userId}`
          );
          if (response.ok && isMounted) {
            const { theme } = await response.json();
            console.log('Fetched theme:', theme);
            const themeFontStyle = theme.fontStyle || 'Poppins';
            setFontStyle(themeFontStyle);
            setFormData(prev => ({
              ...prev,
              theme: {
                ...prev.theme,
                fontStyle: themeFontStyle,
                enabledSections: {
                  ...prev.theme.enabledSections,
                  ...(theme.enabledSections || {})
                }
              }
            }));
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          showNotification('Error loading template data', 'error');
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [userId, templateId]);

  // Add a separate useEffect for handling template updates
  useEffect(() => {
    if (activeTemplate && activeTemplate.data) {
      setFormData(activeTemplate.data);
    }
  }, [activeTemplate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          basics: {
            ...prev.basics,
            profileImage: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (index !== null && Array.isArray(newData[section])) {
        newData[section][index] = { ...newData[section][index], [field]: value };
      } else if (section === 'basics') {
        // Special handling for basics section to ensure proper data structure
        if (field === 'role') {
          newData[section] = {
            ...newData[section],
            title: value, // Update both role and title to maintain compatibility
            role: value
          };
        } else if (field === 'bio') {
          newData[section] = {
            ...newData[section],
            summary: value, // Update both bio and summary to maintain compatibility
            bio: value
          };
        } else {
          newData[section] = { ...newData[section], [field]: value };
        }
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

  // Add save function
  const handleSaveSection = async (section) => {
    try {
        let response;
        console.log('Saving section:', section);
        console.log('Current userId:', userId);

        if (!userId) {
            throw new Error('User ID is not available');
        }
        
        if (section === 'Basic Info') {
            // Ensure proper data structure
            const basicData = {
                name: formData.basics?.name || '',
                role: formData.basics?.role || '',
                bio: formData.basics?.bio || '',
                email: formData.basics?.email || '',
                phone: formData.basics?.phone || '',
                location: formData.basics?.location || '',
                profileImage: formData.basics?.profileImage || null,
                socialLinks: {
                    linkedin: formData.basics?.socialLinks?.linkedin || '',
                    github: formData.basics?.socialLinks?.github || '',
                    twitter: formData.basics?.socialLinks?.twitter || ''
                }
            };
            console.log('Sending basic info data:', basicData);

            // Save template data with only basics section and theme
            const templateData = {
                basics: basicData,
                theme: {
                    ...(formData.theme || {}),
                    fontStyle: formData.theme?.fontStyle || 'Poppins',
                    enabledSections: {
                        ...(formData.theme?.enabledSections || {
                            about: true,
                            skills: true,
                            experience: true,
                            projects: true
                        })
                    }
                }
            };
            
            console.log('Sending template data:', templateData);
            const templateResponse = await fetch(`http://localhost:3000/portfolio-save/template/${userId}/data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: templateData }),
            });

            if (!templateResponse.ok) {
                const templateData = await templateResponse.json();
                throw new Error(templateData.message || 'Failed to save basic info');
            }

            // Update formData with template response
            const templateUpdateData = await templateResponse.json();
            console.log('Template update response:', templateUpdateData);

            if (templateUpdateData.data) {
                setFormData(prev => ({
                    ...prev,
                    basics: {
                        ...(prev.basics || {}),
                        ...(templateUpdateData.data.basics || {}),
                        socialLinks: {
                            ...(prev.basics?.socialLinks || {}),
                            ...(templateUpdateData.data.basics?.socialLinks || {})
                        }
                    },
                    theme: {
                        ...(prev.theme || {}),
                        ...(templateUpdateData.data.theme || {}),
                        fontStyle: templateUpdateData.data.theme?.fontStyle || prev.theme?.fontStyle || 'Poppins',
                        enabledSections: {
                            ...(prev.theme?.enabledSections || {
                                about: true,
                                skills: true,
                                experience: true,
                                projects: true
                            }),
                            ...(templateUpdateData.data.theme?.enabledSections || {})
                        }
                    }
                }));

                // Update active template if it exists
                if (activeTemplate) {
                    setActiveTemplate(prev => ({
                        ...prev,
                        data: {
                            ...prev.data,
                            basics: templateUpdateData.data.basics,
                            theme: templateUpdateData.data.theme
                        }
                    }));
                }
            }

            // Force a re-render of the preview by toggling the active section
            setActiveSection(prev => prev);
            
            // Show success notification
            showNotification('Basic info saved successfully!', 'success');
        } else if (section === 'About') {
            // Ensure proper data structure for about section
            const aboutData = {
                description: formData.about?.description || '',
                highlights: formData.about?.highlights?.filter(highlight => highlight.text.trim() !== '') || []
            };
            console.log('Sending about data:', aboutData);

            // Save template data with only the about section and theme
            const templateData = {
                about: {
                    description: aboutData.description,
                    highlights: aboutData.highlights.map(highlight => ({
                        text: highlight.text,
                        isVisible: true
                    }))
                },
                theme: {
                    ...(formData.theme || {}),
                    fontStyle: formData.theme?.fontStyle || 'Poppins',
                    enabledSections: {
                        ...(formData.theme?.enabledSections || {
                            about: true,
                            skills: true,
                            experience: true,
                            projects: true
                        })
                    }
                }
            };
            
            console.log('Sending template data:', templateData);
            const templateResponse = await fetch(`http://localhost:3000/portfolio-save/template/${userId}/data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: templateData }),
            });

            if (!templateResponse.ok) {
                const templateData = await templateResponse.json();
                throw new Error(templateData.message || 'Failed to save about section');
            }

            // Update formData with template response
            const templateUpdateData = await templateResponse.json();
            console.log('Template update response:', templateUpdateData);

            if (templateUpdateData.data) {
                setFormData(prev => ({
                    ...prev,
                    about: {
                        description: templateUpdateData.data.about?.description || prev.about?.description || '',
                        highlights: templateUpdateData.data.about?.highlights?.map(h => ({
                            text: h.text,
                            isVisible: h.isVisible
                        })) || prev.about?.highlights || []
                    },
                    theme: {
                        ...(prev.theme || {}),
                        ...(templateUpdateData.data.theme || {}),
                        fontStyle: templateUpdateData.data.theme?.fontStyle || prev.theme?.fontStyle || 'Poppins',
                        enabledSections: {
                            ...(prev.theme?.enabledSections || {
                                about: true,
                                skills: true,
                                experience: true,
                                projects: true
                            }),
                            ...(templateUpdateData.data.theme?.enabledSections || {})
                        }
                    }
                }));

                // Update active template if it exists
                if (activeTemplate) {
                    setActiveTemplate(prev => ({
                        ...prev,
                        data: {
                            ...prev.data,
                            about: templateUpdateData.data.about,
                            theme: templateUpdateData.data.theme
                        }
                    }));
                }
            }

            // Force a re-render of the preview by toggling the active section
            setActiveSection(prev => prev);
            
            // Show success notification
            showNotification('About section saved successfully!', 'success');
        }
    } catch (error) {
        console.error('Error saving changes:', error);
        showNotification(error.message || 'Failed to save changes', 'error');
        throw error;
    }
};

  const SaveButton = ({ section }) => {
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const validateSection = () => {
        if (section === 'Basic Info') {
            const emptyFields = [];
            const requiredFields = {
                name: 'Name',
                role: 'Role',
                bio: 'Bio',
                email: 'Email',
                phone: 'Phone',
                location: 'Location'
            };

            for (const [field, label] of Object.entries(requiredFields)) {
                if (!formData.basics?.[field]?.trim()) {
                    emptyFields.push(label);
                }
            }

            if (emptyFields.length > 0) {
                setError('Fill all fields');
                return false;
            }
            return true;
        } else if (section === 'About') {
            const emptyFields = [];
            
            if (!formData.about?.description?.trim()) {
                emptyFields.push('About description');
            }
            if (!formData.about?.highlights?.some(h => h.text.trim())) {
                emptyFields.push('At least one highlight');
            }

            if (emptyFields.length > 0) {
                setError('Fill all fields');
                return false;
            }
            return true;
        }
        return true;
    };

    const handleClick = async () => {
        try {
            setError('');
            if (!validateSection()) {
                setStatus('error');
                setTimeout(() => {
                    setStatus(null);
                    setError('');
                }, 2000);
                return;
            }

            setStatus('saving');
            await handleSaveSection(section);
            setStatus('success');
            setMessage('Saved!');
            setTimeout(() => {
                setStatus(null);
                setMessage('');
                setError('');
            }, 2000);
        } catch (error) {
            setStatus('error');
            setError('Failed to save');
            setTimeout(() => {
                setStatus(null);
                setMessage('');
                setError('');
            }, 2000);
        }
    };

    const getButtonStyles = () => {
        const baseStyles = "mt-6 w-full py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ";
        
        switch (status) {
            case 'saving':
                return baseStyles + "bg-gray-400 text-white cursor-wait";
            case 'success':
                return baseStyles + "bg-green-500 text-white";
            case 'error':
                return baseStyles + "bg-red-500 text-white";
            default:
                return baseStyles + "bg-blue-600 hover:bg-blue-700 text-white";
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={status === 'saving'}
            className={getButtonStyles()}
        >
            {status === 'saving' && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {status === 'success' && <FiCheck className="w-5 h-5" />}
            {status === 'error' && <FiX className="w-5 h-5" />}
            <span>
                {status === 'saving' ? 'Saving...' :
                 status === 'success' ? 'Saved!' :
                 status === 'error' ? error || 'Failed to save' :
                 `Save ${section}`}
            </span>
        </button>
    );
};

  // Add section toggle handler
  const handleSectionToggle = (sectionId) => {
    setFormData(prev => {
      // Get current enabled sections with defaults
      const currentEnabledSections = prev.theme?.enabledSections || {
        about: true,
        skills: true,
        experience: true,
        projects: true
      };

      // Create new theme state
      const newTheme = {
        ...(prev.theme || {}),
        fontStyle: prev.theme?.fontStyle || 'Poppins',
        enabledSections: {
          ...currentEnabledSections,
          [sectionId]: !currentEnabledSections[sectionId]
        }
      };

      console.log('Toggling section:', sectionId, 'New enabled sections:', newTheme.enabledSections);

      return {
        ...prev,
        theme: newTheme
      };
    });
  };

  // Get visible sections for navigation
  const getVisibleSections = () => {
    return sections.filter(section => 
      section.required || formData?.theme?.enabledSections?.[section.id] || false
    );
  };

  // Update sections based on template and visibility
  const getTemplateSections = () => {
    if (!activeTemplate) return [];
    
    const templateSections = {
      ExpertPortfolioTemplate: [
        { id: 'basics', label: 'Basic Info', icon: <FiUser className="w-5 h-5" />, required: true },
        { id: 'about', label: 'About', icon: <FiInfo className="w-5 h-5" />, required: false },
        { id: 'skills', label: 'Skills', icon: <FiCode className="w-5 h-5" />, required: false },
        { id: 'experience', label: 'Experience', icon: <FiBriefcase className="w-5 h-5" />, required: false },
        { id: 'projects', label: 'Projects', icon: <FiFileText className="w-5 h-5" />, required: false }
      ],
      SimplePortfolioTemplate: [
        { id: 'basics', label: 'Basic Info', icon: <FiUser className="w-5 h-5" />, required: true },
        { id: 'about', label: 'About', icon: <FiInfo className="w-5 h-5" />, required: false },
        { id: 'projects', label: 'Projects', icon: <FiFileText className="w-5 h-5" />, required: false }
      ],
      // Add more templates here as needed
    };

    const sections = templateSections[activeTemplate.predefinedTemplate] || [];
    
    // Add settings section at the end
    return [
      ...sections,
      { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" />, required: true }
    ];
  };

  // Update the navigation rendering
  const renderNavigation = () => {
    const visibleSections = getVisibleSections();
    
    return visibleSections.map((section) => (
      <div key={section.id} className="mb-2">
        <button
          onClick={() => setActiveSection(section.id)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
            activeSection === section.id
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            {section.icon}
            <span className="text-sm font-medium">{section.label}</span>
          </div>
          {section.id === 'settings' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {Object.values(formData?.theme?.enabledSections || {}).filter(Boolean).length} visible
              </span>
            </div>
          )}
        </button>
      </div>
    ));
  };

  const sections = getTemplateSections();

  const TemplateComponent = activeTemplate ? templateComponents[activeTemplate.predefinedTemplate] : null;

  // Update the sections rendering to include toggles
  const renderFormSection = () => {
    if (activeSection === 'settings') {
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">Customize which sections appear in your portfolio.</p>
          </div>
          
          <div className="space-y-4">
            {sections.filter(section => !section.required).map((section) => (
              <div key={section.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <span className="text-sm font-medium text-gray-700">{section.label}</span>
                </div>
                <button
                  onClick={() => handleSectionToggle(section.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData?.theme?.enabledSections?.[section.id] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData?.theme?.enabledSections?.[section.id] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <SaveButton section="Settings" />
        </div>
      );
    }

    switch (activeSection) {
      case 'basics':
        return (
          <div className={commonClasses.section}>
            <div className={commonClasses.infoBox}>
              <p className={commonClasses.infoText}>This section contains your basic information that appears at the top of your portfolio.</p>
            </div>
            
            <div className={commonClasses.grid}>
              <div className="col-span-2">
                <label className={commonClasses.label}>Profile Image</label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500">
                    <img
                      src={formData.basics.profileImage || profile}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = profile;
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className={commonClasses.label}>Name</label>
                <input
                  type="text"
                  value={formData.basics?.name || ''}
                  onChange={(e) => handleInputChange('basics', 'name', e.target.value)}
                  className={commonClasses.input}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className={commonClasses.label}>Role</label>
                <input
                  type="text"
                  value={formData.basics?.role || ''}
                  onChange={(e) => handleInputChange('basics', 'role', e.target.value)}
                  className={commonClasses.input}
                  placeholder="e.g. Full Stack Developer"
                />
              </div>

              <div>
                <label className={commonClasses.label}>Email</label>
                <input
                  type="email"
                  value={formData.basics?.email || ''}
                  onChange={(e) => handleInputChange('basics', 'email', e.target.value)}
                  className={commonClasses.input}
                  placeholder="your@email.com"
                />
              </div>

              <div className="col-span-2">
                <label className={commonClasses.label}>Bio</label>
                <textarea
                  value={formData.basics?.bio || ''}
                  onChange={(e) => handleInputChange('basics', 'bio', e.target.value)}
                  rows="4"
                  className={commonClasses.input}
                  placeholder="Write a short bio about yourself"
                />
              </div>

              <div>
                <label className={commonClasses.label}>Phone</label>
                <input
                  type="tel"
                  value={formData.basics?.phone || ''}
                  onChange={(e) => handleInputChange('basics', 'phone', e.target.value)}
                  className={commonClasses.input}
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className={commonClasses.label}>Location</label>
                <input
                  type="text"
                  value={formData.basics?.location || ''}
                  onChange={(e) => handleInputChange('basics', 'location', e.target.value)}
                  className={commonClasses.input}
                  placeholder="City, Country"
                />
              </div>

              <div className="col-span-2">
                <label className={commonClasses.label}>Social Links</label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 w-24">LinkedIn:</span>
                    <input
                      type="url"
                      value={formData.basics?.socialLinks?.linkedin || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          basics: {
                            ...prev.basics,
                            socialLinks: {
                              ...(prev.basics?.socialLinks || {}),
                              linkedin: e.target.value
                            }
                          }
                        }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 w-24">GitHub:</span>
                    <input
                      type="url"
                      value={formData.basics?.socialLinks?.github || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          basics: {
                            ...prev.basics,
                            socialLinks: {
                              ...(prev.basics?.socialLinks || {}),
                              github: e.target.value
                            }
                          }
                        }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="GitHub profile URL"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 w-24">Email:</span>
                    <input
                      type="email"
                      value={formData.basics?.email || ''}
                      onChange={(e) => handleInputChange('basics', 'email', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 w-24">Phone:</span>
                    <input
                      type="tel"
                      value={formData.basics?.phone || ''}
                      onChange={(e) => handleInputChange('basics', 'phone', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>
            <SaveButton section="Basic Info" />
          </div>
        );

      case 'about':
        return (
          <div className={commonClasses.section}>
            <div className={commonClasses.infoBox}>
              <p className={commonClasses.infoText}>Tell your story. Share your professional journey and what drives you.</p>
            </div>

            <div className={commonClasses.grid}>
              <div className="col-span-2">
                <label className={commonClasses.label}>About Me</label>
                <textarea
                  value={formData.about?.description || ''}
                  onChange={(e) => handleInputChange('about', 'description', e.target.value)}
                  rows="6"
                  className={commonClasses.input}
                  placeholder="Share your professional journey, passion, and expertise..."
                />
              </div>

              <div className="col-span-2">
                <label className={commonClasses.label}>Key Highlights</label>
                {formData.about?.highlights?.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={highlight?.text || ''}
                      onChange={(e) => {
                        const newHighlights = [...(formData.about?.highlights || [])];
                        newHighlights[index] = { ...highlight, text: e.target.value };
                        handleInputChange('about', 'highlights', newHighlights);
                      }}
                      className={commonClasses.input}
                      placeholder="Add a key highlight..."
                    />
                    <button
                      onClick={() => {
                        const newHighlights = (formData.about?.highlights || []).filter((_, i) => i !== index);
                        handleInputChange('about', 'highlights', newHighlights);
                      }}
                      className={commonClasses.removeButton}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newHighlights = [...(formData.about?.highlights || []), { text: '' }];
                    handleInputChange('about', 'highlights', newHighlights);
                  }}
                  className={commonClasses.addButton}
                >
                  + Add Highlight
                </button>
              </div>
            </div>
            <SaveButton section="About" />
          </div>
        );

      case 'skills':
        return (
          <div className={commonClasses.section}>
            <div className={commonClasses.infoBox}>
              <p className={commonClasses.infoText}>List your technical and soft skills with proficiency levels.</p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Skills</h3>
                {formData.skills?.technical?.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <input
                      type="text"
                      value={skill?.name || ''}
                      onChange={(e) => {
                        const newSkills = [...(formData.skills?.technical || [])];
                        newSkills[index] = { ...skill, name: e.target.value };
                        handleInputChange('skills', 'technical', newSkills);
                      }}
                      className={commonClasses.input}
                      placeholder="Skill name (e.g., JavaScript)"
                    />
                    <select
                      value={skill?.level || 'Beginner'}
                      onChange={(e) => {
                        const newSkills = [...(formData.skills?.technical || [])];
                        newSkills[index] = { ...skill, level: e.target.value };
                        handleInputChange('skills', 'technical', newSkills);
                      }}
                      className={commonClasses.input}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button
                      onClick={() => {
                        const newSkills = (formData.skills?.technical || []).filter((_, i) => i !== index);
                        handleInputChange('skills', 'technical', newSkills);
                      }}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSkills = [...(formData.skills?.technical || []), { name: '', level: 'Beginner' }];
                    handleInputChange('skills', 'technical', newSkills);
                  }}
                  className={commonClasses.addButton}
                >
                  + Add Technical Skill
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Soft Skills</h3>
                {formData.skills?.soft?.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <input
                      type="text"
                      value={skill?.name || ''}
                      onChange={(e) => {
                        const newSkills = [...(formData.skills?.soft || [])];
                        newSkills[index] = { ...skill, name: e.target.value };
                        handleInputChange('skills', 'soft', newSkills);
                      }}
                      className={commonClasses.input}
                      placeholder="Skill name (e.g., Leadership)"
                    />
                    <select
                      value={skill?.level || 'Beginner'}
                      onChange={(e) => {
                        const newSkills = [...(formData.skills?.soft || [])];
                        newSkills[index] = { ...skill, level: e.target.value };
                        handleInputChange('skills', 'soft', newSkills);
                      }}
                      className={commonClasses.input}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button
                      onClick={() => {
                        const newSkills = (formData.skills?.soft || []).filter((_, i) => i !== index);
                        handleInputChange('skills', 'soft', newSkills);
                      }}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSkills = [...(formData.skills?.soft || []), { name: '', level: 'Beginner' }];
                    handleInputChange('skills', 'soft', newSkills);
                  }}
                  className={commonClasses.addButton}
                >
                  + Add Soft Skill
                </button>
              </div>
            </div>
            <SaveButton section="Skills" />
          </div>
        );

      case 'experience':
        return (
          <div className={commonClasses.section}>
            <div className={commonClasses.infoBox}>
              <p className={commonClasses.infoText}>Add your work experience, including current and previous positions.</p>
            </div>

            {formData.experience?.map((exp, index) => (
              <div key={index} className={commonClasses.itemCard}>
                <button
                  onClick={() => removeItem('experience', index)}
                  className={commonClasses.removeButton}
                >
                  <FiFileText className="w-5 h-5" />
                </button>

                <div className={commonClasses.grid}>
                  <div className="col-span-2">
                    <label className={commonClasses.label}>Job Title</label>
                    <input
                      type="text"
                      value={exp?.title || ''}
                      onChange={(e) => handleInputChange('experience', 'title', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Company</label>
                    <input
                      type="text"
                      value={exp?.company || ''}
                      onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="Company name"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Location</label>
                    <input
                      type="text"
                      value={exp?.location || ''}
                      onChange={(e) => handleInputChange('experience', 'location', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Start Date</label>
                    <input
                      type="date"
                      value={exp?.startDate || ''}
                      onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, index)}
                      className={commonClasses.input}
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>End Date</label>
                    <input
                      type="date"
                      value={exp?.endDate || ''}
                      onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, index)}
                      className={commonClasses.input}
                      disabled={exp?.current}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Description</label>
                    <textarea
                      value={exp?.description || ''}
                      onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
                      rows="4"
                      className={commonClasses.input}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => addItem('experience')}
              className={commonClasses.addButton}
            >
              + Add Experience
            </button>
            <SaveButton section="Experience" />
          </div>
        );

      case 'projects':
        return (
          <div className={commonClasses.section}>
            <div className={commonClasses.infoBox}>
              <p className={commonClasses.infoText}>Add your notable projects here. Include details about technologies used and your role.</p>
            </div>

            {formData.projects?.map((project, index) => (
              <div key={index} className={commonClasses.itemCard}>
                <button
                  onClick={() => removeItem('projects', index)}
                  className={commonClasses.removeButton}
                >
                  <FiFileText className="w-5 h-5" />
                </button>

                <div className={commonClasses.grid}>
                  <div className="col-span-2">
                    <label className={commonClasses.label}>Project Image</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={project?.image || 'https://via.placeholder.com/150'}
                          alt={project?.title || 'Project preview'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              handleInputChange('projects', 'image', reader.result, index);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Project Title</label>
                    <input
                      type="text"
                      value={project?.title || ''}
                      onChange={(e) => handleInputChange('projects', 'title', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="Project name"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Description</label>
                    <textarea
                      value={project?.description || ''}
                      onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)}
                      rows="3"
                      className={commonClasses.input}
                      placeholder="Describe your project"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Technologies Used</label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project?.technologies?.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => {
                                const newTechs = (project?.technologies || []).filter((_, i) => i !== techIndex);
                                handleInputChange('projects', 'technologies', newTechs, index);
                              }}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={project?.newTech || ''}
                          onChange={(e) => {
                            handleInputChange('projects', 'newTech', e.target.value, index);
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && project?.newTech?.trim()) {
                              e.preventDefault();
                              const newTechs = [...(project?.technologies || []), project.newTech.trim()];
                              handleInputChange('projects', 'technologies', newTechs, index);
                              handleInputChange('projects', 'newTech', '', index);
                            }
                          }}
                          className={commonClasses.input}
                          placeholder="Type a technology and press Enter"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (project?.newTech?.trim()) {
                              const newTechs = [...(project?.technologies || []), project.newTech.trim()];
                              handleInputChange('projects', 'technologies', newTechs, index);
                              handleInputChange('projects', 'newTech', '', index);
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={commonClasses.label}>Project URL</label>
                    <input
                      type="url"
                      value={project?.liveLink || ''}
                      onChange={(e) => handleInputChange('projects', 'liveLink', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Source Code URL</label>
                    <input
                      type="url"
                      value={project?.sourceCode || ''}
                      onChange={(e) => handleInputChange('projects', 'sourceCode', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => addItem('projects')}
              className={commonClasses.addButton}
            >
              + Add Another Project
            </button>
            <SaveButton section="Projects" />
          </div>
        );

      default:
        return null;
    }
  };

  // Update IconSelector component
  const IconSelector = ({ value, onChange }) => {
    const icons = {
      FaCode: { component: FaCode, label: 'Code' },
      FaServer: { component: FaServer, label: 'Server' },
      FaDatabase: { component: FaDatabase, label: 'Database' },
      FaTools: { component: FaTools, label: 'Tools' },
      FaCloud: { component: FaCloud, label: 'Cloud' },
      FaEnvelope: { component: FaEnvelope, label: 'Envelope' },
      FaMapMarkerAlt: { component: FaMapMarkerAlt, label: 'Location' },
      FaPhone: { component: FaPhone, label: 'Phone' },
      FaGlobe: { component: FaGlobe, label: 'Globe' }
    };

    const IconComponent = icons[value]?.component || FaCode;

    return (
      <div className="relative w-32">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 pl-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
        >
          {Object.entries(icons).map(([iconName, { label }]) => (
            <option key={iconName} value={iconName}>
              {label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none flex items-center space-x-2">
          <IconComponent className="w-5 h-5 text-gray-600" />
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Template Editor</h1>
          <p className="text-sm text-gray-500 mt-1">Customize your portfolio</p>
        </div>
        <nav className="px-4 pb-6">
          {renderNavigation()}
        </nav>
      </div>

      {/* Middle Section - Form */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 border-b bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {sections.find(s => s.id === activeSection)?.label}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderFormSection()}
          </div>
        </div>
      </div>

      {/* Right Section - Live Preview */}
      <div className="w-[45%] bg-[#f8fafc] border-l border-gray-200 flex flex-col">
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
      </div>
    </div>
  );
};

export default TemplateEditor; 