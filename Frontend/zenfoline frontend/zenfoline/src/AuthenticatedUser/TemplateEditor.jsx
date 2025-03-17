import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useTemplateStore from '../store/userTemplateStore';
import useAuthStore from '../store/userAuthStore';
import { templateComponents } from '../RenderedTemplate/templateComponents';
import { FiUser, FiInfo, FiCode, FiBriefcase, FiBook, FiAward, FiFileText, FiStar, FiTool, FiSettings } from 'react-icons/fi';
import { FaCode, FaServer, FaDatabase, FaTools, FaCloud, FaEnvelope, FaMapMarkerAlt, FaPhone, FaGlobe } from 'react-icons/fa';
import profile from "../assets/profile.png";

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
    removeButton: "absolute top-4 right-4 text-red-500 hover:text-red-700",
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
      highlights: [{ text: '', icon: 'FaCode' }]
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
      technologies: [],
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

  const [showSettings, setShowSettings] = useState(false);

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
      const response = await fetch(`http://localhost:3000/authenticated-user/updatetemplate/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });

      if (response.ok) {
        // Show success message or notification
        alert(`${section} section saved successfully!`);
      } else {
        throw new Error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const SaveButton = ({ section }) => (
    <button
      onClick={() => handleSaveSection(section)}
      className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Save {section}
    </button>
  );

  // Add section toggle handler
  const handleSectionToggle = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        enabledSections: {
          ...prev.theme.enabledSections,
          [sectionId]: !prev.theme.enabledSections[sectionId]
        }
      }
    }));
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
      ]
    };

    const sections = templateSections[activeTemplate.predefinedTemplate] || [];
    
    // Add settings section at the end
    return [
      ...sections,
      { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" />, required: true }
    ];
  };

  // Get visible sections for navigation
  const getVisibleSections = () => {
    return sections.filter(section => 
      section.required || formData.theme.enabledSections[section.id]
    );
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
                {Object.values(formData.theme.enabledSections).filter(Boolean).length} visible
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
                    formData.theme.enabledSections[section.id] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.theme.enabledSections[section.id] ? 'translate-x-6' : 'translate-x-1'
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
                  value={formData.basics.name}
                  onChange={(e) => handleInputChange('basics', 'name', e.target.value)}
                  className={commonClasses.input}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className={commonClasses.label}>Role</label>
                <input
                  type="text"
                  value={formData.basics.role}
                  onChange={(e) => handleInputChange('basics', 'role', e.target.value)}
                  className={commonClasses.input}
                  placeholder="e.g. Full Stack Developer"
                />
              </div>

              <div>
                <label className={commonClasses.label}>Email</label>
                <input
                  type="email"
                  value={formData.basics.email}
                  onChange={(e) => handleInputChange('basics', 'email', e.target.value)}
                  className={commonClasses.input}
                  placeholder="your@email.com"
                />
              </div>

              <div className="col-span-2">
                <label className={commonClasses.label}>Bio</label>
                <textarea
                  value={formData.basics.bio}
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
                  value={formData.basics.phone}
                  onChange={(e) => handleInputChange('basics', 'phone', e.target.value)}
                  className={commonClasses.input}
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className={commonClasses.label}>Location</label>
                <input
                  type="text"
                  value={formData.basics.location}
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
                      value={formData.basics.socialLinks.linkedin}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          basics: {
                            ...prev.basics,
                            socialLinks: {
                              ...prev.basics.socialLinks,
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
                      value={formData.basics.socialLinks.github}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          basics: {
                            ...prev.basics,
                            socialLinks: {
                              ...prev.basics.socialLinks,
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
                      value={formData.basics.email}
                      onChange={(e) => handleInputChange('basics', 'email', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 w-24">Phone:</span>
                    <input
                      type="tel"
                      value={formData.basics.phone}
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
                  value={formData.about.description}
                  onChange={(e) => handleInputChange('about', 'description', e.target.value)}
                  rows="6"
                  className={commonClasses.input}
                  placeholder="Share your professional journey, passion, and expertise..."
                />
              </div>

              <div className="col-span-2">
                <label className={commonClasses.label}>Key Highlights</label>
                {formData.about.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={highlight.text}
                      onChange={(e) => {
                        const newHighlights = [...formData.about.highlights];
                        newHighlights[index] = { ...highlight, text: e.target.value };
                        handleInputChange('about', 'highlights', newHighlights);
                      }}
                      className={commonClasses.input}
                      placeholder="Add a key highlight..."
                    />
                    <button
                      onClick={() => {
                        const newHighlights = formData.about.highlights.filter((_, i) => i !== index);
                        handleInputChange('about', 'highlights', newHighlights);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiFileText className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newHighlights = [...formData.about.highlights, { text: '' }];
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
                {formData.skills.technical.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const newSkills = [...formData.skills.technical];
                        newSkills[index] = { ...skill, name: e.target.value };
                        handleInputChange('skills', 'technical', newSkills);
                      }}
                      className={commonClasses.input}
                      placeholder="Skill name (e.g., JavaScript)"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const newSkills = [...formData.skills.technical];
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
                        const newSkills = formData.skills.technical.filter((_, i) => i !== index);
                        handleInputChange('skills', 'technical', newSkills);
                      }}
                      className={commonClasses.removeButton}
                    >
                      <FiFileText className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSkills = [...formData.skills.technical, { name: '', level: 'Beginner' }];
                    handleInputChange('skills', 'technical', newSkills);
                  }}
                  className={commonClasses.addButton}
                >
                  + Add Technical Skill
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Soft Skills</h3>
                {formData.skills.soft.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const newSkills = [...formData.skills.soft];
                        newSkills[index] = { ...skill, name: e.target.value };
                        handleInputChange('skills', 'soft', newSkills);
                      }}
                      className={commonClasses.input}
                      placeholder="Skill name (e.g., Leadership)"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const newSkills = [...formData.skills.soft];
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
                        const newSkills = formData.skills.soft.filter((_, i) => i !== index);
                        handleInputChange('skills', 'soft', newSkills);
                      }}
                      className={commonClasses.removeButton}
                    >
                      <FiFileText className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSkills = [...formData.skills.soft, { name: '', level: 'Beginner' }];
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

            {formData.experience.map((exp, index) => (
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
                      value={exp.title}
                      onChange={(e) => handleInputChange('experience', 'title', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="Company name"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => handleInputChange('experience', 'location', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, index)}
                      className={commonClasses.input}
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>End Date</label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, index)}
                      className={commonClasses.input}
                      disabled={exp.current}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Description</label>
                    <textarea
                      value={exp.description}
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

      case 'education':
        return (
          <div className={commonClasses.section}>
            <div className={commonClasses.infoBox}>
              <p className={commonClasses.infoText}>Add your educational background and qualifications.</p>
            </div>

            {formData.education.map((edu, index) => (
              <div key={index} className={commonClasses.itemCard}>
                <button
                  onClick={() => removeItem('education', index)}
                  className={commonClasses.removeButton}
                >
                  <FiFileText className="w-5 h-5" />
                </button>

                <div className={commonClasses.grid}>
                  <div className="col-span-2">
                    <label className={commonClasses.label}>Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="e.g., Bachelor of Science in Computer Science"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="School/University name"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Location</label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => handleInputChange('education', 'location', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Start Date</label>
                    <input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => handleInputChange('education', 'startDate', e.target.value, index)}
                      className={commonClasses.input}
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>End Date</label>
                    <input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => handleInputChange('education', 'endDate', e.target.value, index)}
                      className={commonClasses.input}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Description</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => handleInputChange('education', 'description', e.target.value, index)}
                      rows="3"
                      className={commonClasses.input}
                      placeholder="Add any relevant details about your studies..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => addItem('education')}
              className={commonClasses.addButton}
            >
              + Add Education
            </button>
            <SaveButton section="Education" />
          </div>
        );

      case 'certifications':
        return (
          <div className={commonClasses.section}>
            <div className={commonClasses.infoBox}>
              <p className={commonClasses.infoText}>Add your professional certifications and achievements.</p>
            </div>

            {formData.certifications.map((cert, index) => (
              <div key={index} className={commonClasses.itemCard}>
                <button
                  onClick={() => removeItem('certifications', index)}
                  className={commonClasses.removeButton}
                >
                  <FiFileText className="w-5 h-5" />
                </button>

                <div className={commonClasses.grid}>
                  <div className="col-span-2">
                    <label className={commonClasses.label}>Certification Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => handleInputChange('certifications', 'name', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="e.g., AWS Certified Solutions Architect"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => handleInputChange('certifications', 'issuer', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Date Issued</label>
                    <input
                      type="date"
                      value={cert.date}
                      onChange={(e) => handleInputChange('certifications', 'date', e.target.value, index)}
                      className={commonClasses.input}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Certificate URL</label>
                    <input
                      type="url"
                      value={cert.link}
                      onChange={(e) => handleInputChange('certifications', 'link', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="Link to verify certification"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => addItem('certifications')}
              className={commonClasses.addButton}
            >
              + Add Certification
            </button>
            <SaveButton section="Certifications" />
          </div>
        );

      case 'publications':
        return (
          <div className={commonClasses.section}>
            <div className={commonClasses.infoBox}>
              <p className={commonClasses.infoText}>Add your published works, articles, or research papers.</p>
            </div>

            {formData.publications.map((pub, index) => (
              <div key={index} className={commonClasses.itemCard}>
                <button
                  onClick={() => removeItem('publications', index)}
                  className={commonClasses.removeButton}
                >
                  <FiFileText className="w-5 h-5" />
                </button>

                <div className={commonClasses.grid}>
                  <div className="col-span-2">
                    <label className={commonClasses.label}>Title</label>
                    <input
                      type="text"
                      value={pub.title}
                      onChange={(e) => handleInputChange('publications', 'title', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="Publication title"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Publisher</label>
                    <input
                      type="text"
                      value={pub.publisher}
                      onChange={(e) => handleInputChange('publications', 'publisher', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="Publisher name"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Publication Date</label>
                    <input
                      type="date"
                      value={pub.date}
                      onChange={(e) => handleInputChange('publications', 'date', e.target.value, index)}
                      className={commonClasses.input}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Description</label>
                    <textarea
                      value={pub.description}
                      onChange={(e) => handleInputChange('publications', 'description', e.target.value, index)}
                      rows="3"
                      className={commonClasses.input}
                      placeholder="Brief description of the publication..."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Link</label>
                    <input
                      type="url"
                      value={pub.link}
                      onChange={(e) => handleInputChange('publications', 'link', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="URL to the publication"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => addItem('publications')}
              className={commonClasses.addButton}
            >
              + Add Publication
            </button>
            <SaveButton section="Publications" />
          </div>
        );

      case 'services':
        return (
          <div className={commonClasses.section}>
            <div className={commonClasses.infoBox}>
              <p className={commonClasses.infoText}>List the professional services you offer.</p>
            </div>

            {formData.services.map((service, index) => (
              <div key={index} className={commonClasses.itemCard}>
                <button
                  onClick={() => removeItem('services', index)}
                  className={commonClasses.removeButton}
                >
                  <FiFileText className="w-5 h-5" />
                </button>

                <div className={commonClasses.grid}>
                  <div className="col-span-2">
                    <label className={commonClasses.label}>Service Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleInputChange('services', 'title', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="e.g., Web Development"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Description</label>
                    <textarea
                      value={service.description}
                      onChange={(e) => handleInputChange('services', 'description', e.target.value, index)}
                      rows="3"
                      className={commonClasses.input}
                      placeholder="Describe the service you offer..."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Icon</label>
                    <input
                      type="text"
                      value={service.icon}
                      onChange={(e) => handleInputChange('services', 'icon', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="Icon name or URL"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => addItem('services')}
              className={commonClasses.addButton}
            >
              + Add Service
            </button>
            <SaveButton section="Services" />
          </div>
        );

      case 'projects':
        return (
          <div className={commonClasses.section}>
            <div className={commonClasses.infoBox}>
              <p className={commonClasses.infoText}>Add your notable projects here. Include details about technologies used and your role.</p>
            </div>

            {formData.projects.map((project, index) => (
              <div key={index} className={commonClasses.itemCard}>
                <button
                  onClick={() => removeItem('projects', index)}
                  className={commonClasses.removeButton}
                >
                  <FiFileText className="w-5 h-5" />
                </button>

                <div className={commonClasses.grid}>
                  <div className="col-span-2">
                    <label className={commonClasses.label}>Project Title</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => handleInputChange('projects', 'title', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="Project name"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)}
                      rows="3"
                      className={commonClasses.input}
                      placeholder="Describe your project"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={commonClasses.label}>Technologies Used (comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || ''}
                      onChange={(e) => {
                        const techArray = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech);
                        handleInputChange('projects', 'technologies', techArray, index);
                      }}
                      className={commonClasses.input}
                      placeholder="e.g. React, Node.js, MongoDB"
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Project URL</label>
                    <input
                      type="url"
                      value={project.liveLink}
                      onChange={(e) => handleInputChange('projects', 'liveLink', e.target.value, index)}
                      className={commonClasses.input}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className={commonClasses.label}>Source Code URL</label>
                    <input
                      type="url"
                      value={project.sourceCode}
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