import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
import LoadingScreen from '../../components/LoadingScreen';
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
  const location = useLocation();
  const userId = useAuthStore((state) => state.userId);
  const { templates, fetchTemplates } = useTemplateStore();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // State management
  const initialSections = [
    { id: 'basics', label: 'Basics', icon: <FiUser />, required: true },
    { id: 'about', label: 'About', icon: <FiInfo />, required: false },
    { id: 'skills', label: 'Skills', icon: <FiCode /> },
    { id: 'experience', label: 'Experience', icon: <FiBriefcase /> },
    { id: 'education', label: 'Education', icon: <FiBook /> },
    { id: 'publications', label: 'Publications', icon: <FiFileText /> },
    { id: 'certifications', label: 'Certifications', icon: <FiAward /> },
    { id: 'awards', label: 'Awards', icon: <FiStar /> },
    { id: 'projects', label: 'Projects', icon: <FiFileText /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings />, required: true }
  ];
  const [sections, setSections] = useState(initialSections);
  
  // Determine initial active section from URL hash
  const getInitialSection = () => {
    const hash = location.hash.substring(1);
    if (hash && initialSections.some(s => s.id === hash)) {
      return hash;
    }
    return 'basics';
  };
  const [activeSection, setActiveSection] = useState(getInitialSection());
  
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
  const [previewMode, setPreviewMode] = useState('desktop');

  // Effect to scroll to section based on hash (after loading)
  useEffect(() => {
    if (!isLoading && location.hash) {
      const id = location.hash.substring(1);
      // We need a way to target the form container. Let's assume EditorForm adds an id.
      // We'll add the scrolling logic inside EditorForm or rely on browser behavior for now.
      // Example if EditorForm had <div id={`form-section-${activeSection}`}> ... </div>
      // const element = document.getElementById(`form-section-${id}`);
      // if (element) {
      //   element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // }
      // console.log("Attempting to scroll to:", id); 
    }
  }, [isLoading, location.hash]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setLoadingProgress(10);
        
        // Fetch templates
        await fetchTemplates(userId);
        setLoadingProgress(20);
        
        const template = templates.find(t => t._id === templateId);
        
        if (template) {
          setActiveTemplate(template);
          setLoadingProgress(30);

          // First fetch section visibility
          const visibilityResponse = await fetch(`${API_BASE_URL}/portfolio-save/section-visibility/${userId}`);
          if (!visibilityResponse.ok) {
            throw new Error('Failed to fetch section visibility');
          }
          const visibilityResult = await visibilityResponse.json();
          const sectionVisibility = visibilityResult.data || {};
          setLoadingProgress(40);

          // Define all possible sections with their endpoints
          const allSections = [
            { id: 'basics', endpoint: 'basic-info' },
            { id: 'about', endpoint: 'about' },
            { id: 'skills', endpoint: 'skills' },
            { id: 'experience', endpoint: 'experience' },
            { id: 'education', endpoint: 'education' },
            { id: 'projects', endpoint: 'projects' },
            { id: 'publications', endpoint: 'publications' },
            { id: 'certifications', endpoint: 'certifications' },
            { id: 'awards', endpoint: 'awards' },
            { id: 'services', endpoint: 'services' }
          ];

          // Filter sections based on visibility
          const sectionsToFetch = allSections.filter(section => 
            sectionVisibility[section.id]?.isEnabled !== false
          );

          const sectionData = {};
          
          // Fetch data only for enabled sections
          const sectionPromises = sectionsToFetch.map(async (section) => {
            try {
              const response = await fetch(`${API_BASE_URL}/portfolio-save/${section.endpoint}/${userId}`);
              if (response.ok) {
                const result = await response.json();
                if (result.data) {
                  sectionData[section.id] = result.data;
                }
              } else {
                console.warn(`Failed to fetch ${section.id} data: ${response.status} ${response.statusText}`);
              }
            } catch (error) {
              console.error(`Error fetching ${section.id} data:`, error);
            }
          });
          
          // Wait for all enabled section data to be fetched
          await Promise.all(sectionPromises);
          
          // Initialize form data with fetched section data
          setFormData(prev => ({
            ...prev,
            basics: sectionData.basics || prev.basics,
            about: sectionData.about || prev.about,
            skills: sectionData.skills || prev.skills,
            experience: sectionData.experience || prev.experience,
            education: sectionData.education || prev.education,
            publications: sectionData.publications || prev.publications,
            certifications: sectionData.certifications || prev.certifications,
            awards: sectionData.awards || prev.awards,
            projects: sectionData.projects || prev.projects,
            services: sectionData.services || prev.services,
            theme: {
              ...prev.theme,
              fontStyle: template.data?.theme?.fontStyle || prev.theme.fontStyle,
              enabledSections: Object.fromEntries(
                Object.entries(sectionVisibility).map(([key, value]) => [key, value.isEnabled])
              )
            }
          }));

          // Update section visibility state
          setSectionVisibility(
            Object.fromEntries(
              Object.entries(sectionVisibility).map(([key, value]) => [key, value.isEnabled])
            )
          );

          setLoadingProgress(100);
          // Add a small delay before hiding the loading screen for smooth transition
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      } catch (error) {
        console.error('Error loading template data:', error);
        showNotification('Error loading template data', 'error');
        setIsLoading(false);
      }
    };

    if (userId && templateId) {
      loadData();
    }
  }, [userId, templateId, fetchTemplates]);

  // Handle form updates
  const handleFormUpdate = (sectionId, data) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: data
    }));
  };

  // Save changes
  const saveChanges = async () => {
    // Basic check: Don't save if essential data like basics is missing
    if (!formData.basics || !formData.basics.name || !formData.basics.email) {
      showNotification('Please fill in at least Name and Email in Basics.', 'warning');
      setActiveSection('basics'); // Navigate to basics section
      return;
    } 

    // Show saving indicator (optional)
    showNotification('Saving changes...', 'info', 2000); // Show for 2 seconds

    try {
      // Construct payload: only include sections that are currently supposed to be enabled
      const payload = {};
      Object.keys(formData).forEach(key => {
        // Include if it's theme or if the section exists in visibility map and is enabled
        if (key === 'theme' || (sectionVisibility && sectionVisibility[key])) {
          payload[key] = formData[key];
        } else if (!sectionVisibility && initialSections.some(s => s.id === key)) {
          // Fallback if visibility hasn't loaded - save all non-theme sections
          // This might be too broad, consider refining based on template defaults if needed
          if (key !== 'theme') payload[key] = formData[key];
        }
      });
      
      // Log the payload being sent
      console.log("Saving payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_BASE_URL}/portfolio-save/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific errors from backend if available
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      } 

      if (data.success) {
        showNotification('Changes saved successfully!', 'success');
      } else {
        // This path might not be reached if backend throws error on !response.ok
        showNotification(data.message || 'Failed to save changes.', 'error');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      showNotification(`Error saving changes: ${error.message}`, 'error');
    }
  };

  // Handle settings saved
  const handleSettingsSaved = (newSectionVisibility) => {
    setSectionVisibility(newSectionVisibility);
    setSidebarRefreshKey(prev => prev + 1);
    // Update sections state based on new visibility
    setSections(prevSections => initialSections.filter(section => {
      if (section.required) return true;
      return newSectionVisibility[section.id] !== false;
    }));
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
    // Give each form container a unique ID based on the section
    const formContainerId = `form-section-${activeSection}`;
    
    let FormComponent;
    switch (activeSection) {
      case 'basics': FormComponent = BasicsForm; break;
      case 'about': FormComponent = AboutForm; break;
      case 'skills': FormComponent = SkillsForm; break;
      case 'experience': FormComponent = ExperienceForm; break;
      case 'projects': FormComponent = ProjectsForm; break;
      case 'education': FormComponent = EducationForm; break;
      case 'publications': FormComponent = PublicationsForm; break;
      case 'certifications': FormComponent = CertificationsForm; break;
      case 'awards': FormComponent = AwardsForm; break;
      case 'settings': FormComponent = SettingsForm; break;
      default: return <div id={formContainerId}>Select a section</div>;
    }

    // Pass data and update handler, include onSettingsSaved for settings
    const props = {
      data: formData[activeSection] || (Array.isArray(initialSections.find(s => s.id === activeSection)?.default) ? [] : {}),
      onUpdate: (data) => handleFormUpdate(activeSection, data),
      ...(activeSection === 'settings' && { onSettingsSaved: handleSettingsSaved, initialData: formData.theme })
    };

    return (
      <div id={formContainerId}> 
        <FormComponent {...props} />
      </div>
    );
  };

  const TemplateComponent = activeTemplate ? templateComponents[activeTemplate.predefinedTemplate] : null;

  if (isLoading) {
    return (
      <LoadingScreen 
        message="Loading Portfolio Editor" 
        subMessage="Please wait while we fetch your data..."
        showProgress={true}
        progress={loadingProgress}
      />
    );
  }

  return (
    <EditorLayout
      previewMode={previewMode}
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
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          TemplateComponent={TemplateComponent}
          activeTemplate={activeTemplate}
          formData={formData}
          fontStyle={fontStyle}
          userId={userId}
          showNotification={showNotification}
          sectionVisibility={sectionVisibility}
        />
      }
    />
  );
};

export default TemplateEditor; 