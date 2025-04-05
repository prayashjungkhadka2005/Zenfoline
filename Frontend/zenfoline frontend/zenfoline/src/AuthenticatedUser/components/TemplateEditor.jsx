import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useTemplateStore from '../../store/userTemplateStore';
import useAuthStore from '../../store/userAuthStore';
import { templateComponents } from '../../RenderedTemplate/templateComponents';
import { FiUser, FiInfo, FiCode, FiBriefcase, FiBook, FiAward, FiFileText, FiStar, FiTool, FiSettings, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { FaCode, FaServer, FaDatabase, FaTools, FaCloud, FaEnvelope, FaMapMarkerAlt, FaPhone, FaGlobe } from 'react-icons/fa';
import profile from "../../assets/profile.png";
import { showNotification } from '../../utils/notifications';
import EditorLayout from './EditorLayout';
import EditorSidebar from './EditorSidebar';
import EditorForm from './EditorForm';
import EditorPreview from './EditorPreview';
import BasicsForm from './forms/BasicsForm';
import AboutForm from './forms/AboutForm';
import SkillsForm from './forms/SkillsForm';
import ExperienceForm from './forms/ExperienceForm';
import ProjectsForm from './forms/ProjectsForm';
import SettingsForm from './forms/SettingsForm';

const TemplateEditor = () => {
  const { templateId } = useParams();
  const userId = useAuthStore((state) => state.userId);
  const { templates, fetchTemplates } = useTemplateStore();
  
  // State management
  const [sections, setSections] = useState([
    { id: 'basics', label: 'Basics', icon: <FiUser />, required: true },
    { id: 'about', label: 'About', icon: <FiInfo />, required: true },
    { id: 'skills', label: 'Skills', icon: <FiCode /> },
    { id: 'experience', label: 'Experience', icon: <FiBriefcase /> },
    { id: 'projects', label: 'Projects', icon: <FiFileText /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> }
  ]);
  
  const [activeSection, setActiveSection] = useState('basics');
  const [formData, setFormData] = useState({
    basics: {},
    about: {},
    skills: [],
    experience: [],
    projects: [],
    theme: {
      enabledSections: {
        basics: true,
        about: true,
        skills: true,
        experience: true,
        projects: true
      },
      fontStyle: 'default'
    }
  });
  const [scale, setScale] = useState(1);
  const [fontStyle, setFontStyle] = useState('default');
  const [activeTemplate, setActiveTemplate] = useState(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch templates
        await fetchTemplates(userId);
        const template = templates.find(t => t._id === templateId);
        
        if (template) {
          setActiveTemplate(template);
          
          // Initialize form data with template data
          if (template.data) {
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
      } catch (error) {
        console.error('Error loading template data:', error);
        showNotification('Error loading template data', 'error');
      }
    };

    if (userId && templateId) {
      loadData();
    }
  }, [userId, templateId, fetchTemplates, templates]);

  // Handle form updates
  const handleFormUpdate = (sectionId, data) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: data
    }));
  };

  // Save changes
  const saveChanges = async () => {
    try {
      const response = await fetch(`/api/portfolio/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        showNotification('Changes saved successfully!');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      showNotification('Error saving changes', 'error');
    }
  };

  // Render form section based on active section
  const renderFormSection = () => {
    switch (activeSection) {
      case 'basics':
        return <BasicsForm data={formData.basics} onUpdate={(data) => handleFormUpdate('basics', data)} />;
      case 'about':
        return <AboutForm data={formData.about} onUpdate={(data) => handleFormUpdate('about', data)} />;
      case 'skills':
        return <SkillsForm data={formData.skills} onUpdate={(data) => handleFormUpdate('skills', data)} />;
      case 'experience':
        return <ExperienceForm data={formData.experience} onUpdate={(data) => handleFormUpdate('experience', data)} />;
      case 'projects':
        return <ProjectsForm data={formData.projects} onUpdate={(data) => handleFormUpdate('projects', data)} />;
      case 'settings':
        return <SettingsForm 
          data={formData.theme} 
          onUpdate={(data) => handleFormUpdate('theme', data)}
          fontStyle={fontStyle}
          setFontStyle={setFontStyle}
        />;
      default:
        return <div>Select a section</div>;
    }
  };

  const TemplateComponent = activeTemplate ? templateComponents[activeTemplate.predefinedTemplate] : null;

  return (
    <EditorLayout
      sidebar={
        <EditorSidebar
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          formData={formData}
        />
      }
      form={
        <EditorForm
          activeSection={activeSection}
          sections={sections}
          renderFormSection={renderFormSection}
        />
      }
      preview={
        <EditorPreview
          scale={scale}
          setScale={setScale}
          TemplateComponent={TemplateComponent}
          activeTemplate={activeTemplate}
          formData={formData}
          fontStyle={fontStyle}
          userId={userId}
          showNotification={showNotification}
        />
      }
    />
  );
};

export default TemplateEditor; 