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
import EducationForm from './forms/EducationForm';
import PublicationsForm from './forms/PublicationsForm';
import CertificationsForm from './forms/CertificationsForm';
import AwardsForm from './forms/AwardsForm';
import SettingsForm from './forms/SettingsForm';

// API base URL
const API_BASE_URL = 'http://localhost:3000';

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
    { id: 'education', label: 'Education', icon: <FiBook /> },
    { id: 'publications', label: 'Publications', icon: <FiFileText /> },
    { id: 'certifications', label: 'Certifications', icon: <FiAward /> },
    { id: 'awards', label: 'Awards', icon: <FiStar /> },
    { id: 'projects', label: 'Projects', icon: <FiFileText /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> }
  ]);
  
  const [activeSection, setActiveSection] = useState('basics');
  const [formData, setFormData] = useState({
    basics: {},
    about: {},
    skills: [],
    experience: [],
    education: [],
    publications: [],
    certifications: [],
    awards: [],
    projects: [],
    theme: {
      enabledSections: {
        basics: true,
        about: true,
        skills: true,
        experience: true,
        education: true,
        publications: true,
        certifications: true,
        awards: true,
        projects: true
      },
      fontStyle: 'default'
    }
  });
  const [scale, setScale] = useState(1);
  const [fontStyle, setFontStyle] = useState('default');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [sectionVisibility, setSectionVisibility] = useState({});
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

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
              education: template.data.education || prev.education,
              publications: template.data.publications || prev.publications,
              certifications: template.data.certifications || prev.certifications,
              awards: template.data.awards || prev.awards,
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
                    education: true,
                    publications: true,
                    certifications: true,
                    awards: true,
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
  }, [userId, templateId, fetchTemplates]);

  // Fetch section visibility on component mount
  useEffect(() => {
    const fetchSectionVisibility = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio-save/section-visibility/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch section visibility');
        }
        const result = await response.json();
        
        if (result.data) {
          const visibility = {};
          Object.keys(result.data).forEach(section => {
            if (section !== 'customSections') {
              visibility[section] = result.data[section].isEnabled;
            }
          });
          setSectionVisibility(visibility);
          
          // Update formData with the fetched section visibility
          setFormData(prev => ({
            ...prev,
            theme: {
              ...prev.theme,
              enabledSections: {
                ...prev.theme.enabledSections,
                ...visibility
              }
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching section visibility:', error);
      }
    };

    if (userId) {
      fetchSectionVisibility();
    }
  }, [userId]);

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
      const response = await fetch(`${API_BASE_URL}/portfolio-save/${userId}`, {
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

  // Handle settings saved
  const handleSettingsSaved = (newSectionVisibility) => {
    // Update the section visibility state
    setSectionVisibility(newSectionVisibility);
    
    // Force sidebar refresh by incrementing the key
    setSidebarRefreshKey(prev => prev + 1);
    
    // No need to show notification as SettingsForm already shows one
  };

  // Get visible sections for navigation
  const getVisibleSections = () => {
    return sections.filter(section => {
      // Always show required sections and settings
      if (section.required || section.id === 'settings') {
        return true;
      }
      
      // For non-required sections, check if they are enabled in the backend data
      // Fall back to formData if backend data is not available
      return sectionVisibility[section.id] !== undefined 
        ? sectionVisibility[section.id] 
        : formData?.theme?.enabledSections?.[section.id] ?? true;
    });
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
        { id: 'education', label: 'Education', icon: <FiBook className="w-5 h-5" />, required: false },
        { id: 'publications', label: 'Publications', icon: <FiFileText className="w-5 h-5" />, required: false },
        { id: 'certifications', label: 'Certifications', icon: <FiAward className="w-5 h-5" />, required: false },
        { id: 'awards', label: 'Awards', icon: <FiStar className="w-5 h-5" />, required: false },
        { id: 'projects', label: 'Projects', icon: <FiFileText className="w-5 h-5" />, required: false }
      ],
      SimplePortfolioTemplate: [
        { id: 'basics', label: 'Basic Info', icon: <FiUser className="w-5 h-5" />, required: true },
        { id: 'about', label: 'About', icon: <FiInfo className="w-5 h-5" />, required: false },
        { id: 'education', label: 'Education', icon: <FiBook className="w-5 h-5" />, required: false },
        { id: 'publications', label: 'Publications', icon: <FiFileText className="w-5 h-5" />, required: false },
        { id: 'certifications', label: 'Certifications', icon: <FiAward className="w-5 h-5" />, required: false },
        { id: 'awards', label: 'Awards', icon: <FiStar className="w-5 h-5" />, required: false },
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
      case 'education':
        return <EducationForm data={formData.education} onUpdate={(data) => handleFormUpdate('education', data)} />;
      case 'publications':
        return <PublicationsForm data={formData.publications} onUpdate={(data) => handleFormUpdate('publications', data)} />;
      case 'certifications':
        return <CertificationsForm data={formData.certifications} onUpdate={(data) => handleFormUpdate('certifications', data)} />;
      case 'awards':
        return <AwardsForm data={formData.awards} onUpdate={(data) => handleFormUpdate('awards', data)} />;
      case 'settings':
        return <SettingsForm 
          data={formData.theme} 
          onUpdate={(data) => handleFormUpdate('theme', data)}
          onSettingsSaved={handleSettingsSaved}
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
          key={sidebarRefreshKey}
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