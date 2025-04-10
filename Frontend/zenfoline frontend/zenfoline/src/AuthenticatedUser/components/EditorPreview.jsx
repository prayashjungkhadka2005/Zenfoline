import React, { useState, useEffect } from 'react';
import { TemplateProvider } from '../../Templates/TemplateContext';
import axios from 'axios';

const EditorPreview = ({ scale, setScale, TemplateComponent, activeTemplate, formData, fontStyle, userId, showNotification }) => {
  const [loadingState, setLoadingState] = useState({
    sections: true,
    data: true
  });
  const [availableSections, setAvailableSections] = useState([]);
  const [sectionVisibility, setSectionVisibility] = useState({});
  const [processedFormData, setProcessedFormData] = useState(formData);

  // Update processedFormData when formData changes
  useEffect(() => {
    if (formData) {
      // Create a deep copy of formData to avoid reference issues
      const newFormData = JSON.parse(JSON.stringify(formData));
      
      // Format basics section
      if (newFormData.basics) {
        newFormData.basics = {
          ...newFormData.basics,
          name: newFormData.basics.name || '',
          title: newFormData.basics.role || '',
          summary: newFormData.basics.bio || '',
          email: newFormData.basics.email || '',
          phone: newFormData.basics.phone || '',
          location: newFormData.basics.location || '',
          profileImage: newFormData.basics.profileImage || null
        };
      }

      // Format about section
      if (newFormData.about) {
        newFormData.about = {
          ...newFormData.about,
          description: newFormData.about.description || '',
          highlights: newFormData.about.highlights || []
        };
      }

      // Format skills section
      if (newFormData.skills) {
        // Check if skills is an array (from API) or an object (from form)
        if (Array.isArray(newFormData.skills)) {
          // Convert array format to object format
          const technicalSkills = newFormData.skills.filter(skill => skill.category === 'Technical');
          const softSkills = newFormData.skills.filter(skill => skill.category === 'Soft');
          
          newFormData.skills = {
            technical: technicalSkills,
            soft: softSkills
          };
        } else {
          // Already in object format
          newFormData.skills = {
            technical: newFormData.skills.technical || [],
            soft: newFormData.skills.soft || []
          };
        }
      }

      // Format experience section
      if (newFormData.experience) {
        newFormData.experience = (newFormData.experience || []).map(exp => ({
          ...exp,
          company: exp.company || '',
          position: exp.position || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || '',
          highlights: exp.highlights || []
        }));
      }

      // Format projects section
      if (newFormData.projects) {
        newFormData.projects = (newFormData.projects || []).map(project => ({
          ...project,
          title: project.title || '',
          description: project.description || '',
          technologies: project.technologies || [],
          images: project.images || (project.image ? [project.image] : []),
          liveUrl: project.liveUrl || project.liveLink || '',
          sourceUrl: project.sourceUrl || project.sourceCode || '',
          isVisible: project.isVisible !== false
        }));
      }

      // Format education section
      if (newFormData.education) {
        newFormData.education = (newFormData.education || []).map(edu => ({
          ...edu,
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          description: edu.description || ''
        }));
      }

      // Format publications section
      if (newFormData.publications) {
        newFormData.publications = (newFormData.publications || []).map(pub => ({
          ...pub,
          title: pub.title || '',
          authors: pub.authors || '',
          publicationDate: pub.publicationDate || '',
          description: pub.description || '',
          link: pub.link || ''
        }));
      }

      // Format certifications section
      if (newFormData.certifications) {
        newFormData.certifications = (newFormData.certifications || []).map(cert => ({
          ...cert,
          name: cert.name || '',
          issuer: cert.issuer || '',
          issueDate: cert.issueDate || '',
          expiryDate: cert.expiryDate || '',
          credentialId: cert.credentialId || '',
          credentialUrl: cert.credentialUrl || ''
        }));
      }

      // Format services section
      if (newFormData.services) {
        newFormData.services = (newFormData.services || []).map(service => ({
          ...service,
          title: service.title || '',
          description: service.description || '',
          price: service.price || '',
          duration: service.duration || ''
        }));
      }
      
      setProcessedFormData(newFormData);
    }
  }, [formData]);

  // Fetch available sections and section visibility from the backend
  useEffect(() => {
    const fetchSectionsAndVisibility = async () => {
      try {
        setLoadingState(prev => ({ ...prev, sections: true }));
        
        // Get template ID from activeTemplate
        const templateId = activeTemplate?.id || activeTemplate?._id;
        
        if (!templateId) {
          console.error('No template ID found');
          setLoadingState(prev => ({ ...prev, sections: false }));
          return;
        }
        
        // Fetch available sections from the backend
        const sectionsResponse = await axios.get(`/api/portfolio/templates/${templateId}/sections`);
        
        // Fetch section visibility - using the exact URL format provided by the user
        const visibilityResponse = await axios.get(`/portfolio-save/section-visibility/${userId}`);
        
        console.log('Visibility API response:', visibilityResponse.data);
        
        if (visibilityResponse.data && visibilityResponse.data.data) {
          setSectionVisibility(visibilityResponse.data.data);
          
          // Filter sections based on visibility
          const enabledSections = Object.entries(visibilityResponse.data.data)
            .filter(([key, value]) => key !== 'customSections' && value.isEnabled)
            .map(([key]) => key);
            
          console.log('Enabled sections from visibility API:', enabledSections);
          
          // If we have enabled sections, use them
          if (enabledSections.length > 0) {
            setAvailableSections(enabledSections);
          } else {
            // Fallback to template sections if no enabled sections
            console.log('No enabled sections found, using template sections');
            const templateSections = activeTemplate?.sections || [];
            setAvailableSections(templateSections.filter(section => section.enabled !== false));
          }
        } else if (sectionsResponse.data && sectionsResponse.data.sections) {
          // Fallback to template sections if visibility API doesn't return expected format
          console.log('Using sections from template API');
          setAvailableSections(sectionsResponse.data.sections);
        } else {
          // Fallback to template sections if API doesn't return expected format
          console.log('Using sections from activeTemplate');
          const templateSections = activeTemplate?.sections || [];
          setAvailableSections(templateSections.filter(section => section.enabled !== false));
        }
        
        setLoadingState(prev => ({ ...prev, sections: false }));
      } catch (error) {
        console.error('Error fetching sections and visibility:', error);
        // Fallback to template sections if API call fails
        console.log('Error occurred, using sections from activeTemplate');
        const templateSections = activeTemplate?.sections || [];
        setAvailableSections(templateSections.filter(section => section.enabled !== false));
        setLoadingState(prev => ({ ...prev, sections: false }));
      }
    };

    if (activeTemplate && userId) {
      fetchSectionsAndVisibility();
    }
  }, [activeTemplate, userId]);

  // Check if section has data
  const hasSectionData = (sectionId) => {
    if (!processedFormData || !processedFormData[sectionId]) return false;
    
    switch (sectionId) {
      case 'basics':
        return processedFormData.basics?.name || processedFormData.basics?.title || processedFormData.basics?.summary;
      case 'about':
        return processedFormData.about?.description && processedFormData.about.description.trim() !== '';
      case 'skills':
        // Check if skills is an array or an object
        if (Array.isArray(processedFormData.skills)) {
          return processedFormData.skills.length > 0;
        } else {
          return (processedFormData.skills?.technical?.length > 0 || processedFormData.skills?.soft?.length > 0);
        }
      case 'experience':
        return processedFormData.experience?.length > 0;
      case 'education':
        return processedFormData.education?.length > 0;
      case 'projects':
        return processedFormData.projects?.length > 0;
      case 'publications':
        return processedFormData.publications?.length > 0;
      case 'certifications':
        return processedFormData.certifications?.length > 0;
      case 'awards':
        return processedFormData.awards?.length > 0;
      case 'services':
        return processedFormData.services?.length > 0;
      default:
        return false;
    }
  };

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      if (!loadingState.sections) {
        setLoadingState(prev => ({ ...prev, data: true }));
        // Simulate data loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoadingState(prev => ({ ...prev, data: false }));
      }
    };

    loadData();
  }, [loadingState.sections]);

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
          className="min-h-full relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            height: `${100/scale}%`
          }}
        >
          {loadingState.sections && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading sections...</p>
              </div>
            </div>
          )}
          
          {loadingState.data && !loadingState.sections && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading data...</p>
              </div>
            </div>
          )}

          {TemplateComponent && (
            <TemplateProvider mode="preview">
              <TemplateComponent 
                template={activeTemplate} 
                data={processedFormData}
                fontStyle={fontStyle}
                availableSections={availableSections}
                checkSectionData={hasSectionData}
                sectionVisibility={sectionVisibility}
              />
            </TemplateProvider>
          )}
        </div>
      </div>
    </>
  );
};

export default EditorPreview; 