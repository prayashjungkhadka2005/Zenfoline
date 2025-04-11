import React, { useState, useEffect } from 'react';
import { TemplateProvider } from '../../Templates/TemplateContext';
import axios from 'axios';

const EditorPreview = ({ scale, setScale, TemplateComponent, activeTemplate, formData, fontStyle, userId, showNotification, sectionVisibility }) => {
  const [loadingState, setLoadingState] = useState({
    data: true
  });
  const [availableSections, setAvailableSections] = useState([]);
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
          title: exp.title || '',
          position: exp.title || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.isCurrentPosition ? null : (exp.endDate || ''),
          current: exp.isCurrentPosition || false,
          description: exp.description || '',
          achievements: exp.achievements || []
        }));
      }

      // Format projects section
      if (newFormData.projects) {
        newFormData.projects = (newFormData.projects || []).map(project => {
          // Handle both base64 and file path image formats
          let processedImages = [];
          if (project.images && project.images.length > 0) {
            processedImages = project.images.map(img => {
              if (img.startsWith('data:image')) {
                // Base64 image
                return img;
              } else if (img.startsWith('/uploads/')) {
                // File path - construct full URL
                return `${window.location.origin}${img}`;
              }
              return img;
            });
          } else if (project.image) {
            // Fallback to image field - handle both base64 and file path
            if (project.image.startsWith('data:image')) {
              processedImages = [project.image];
            } else if (project.image.startsWith('/uploads/')) {
              processedImages = [`${window.location.origin}${project.image}`];
            } else {
              processedImages = [project.image];
            }
          }
          
          return {
            ...project,
            title: project.title || '',
            description: project.description || '',
            technologies: project.technologies || [],
            images: processedImages,
            liveUrl: project.liveUrl || project.liveLink || '',
            sourceUrl: project.sourceUrl || project.sourceCode || '',
            isVisible: project.isVisible !== false
          };
        });
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

  // Determine availableSections based on the sectionVisibility prop
  useEffect(() => {
    if (sectionVisibility && Object.keys(sectionVisibility).length > 0) {
      const enabledSections = Object.entries(sectionVisibility)
        .filter(([key, isEnabled]) => isEnabled)
        .map(([key]) => key);
      setAvailableSections(enabledSections);
      console.log('Available sections from prop:', enabledSections); 
    } else {
      // Fallback or default if visibility prop is empty/undefined
      // You might want a more robust fallback based on activeTemplate
      const templateSections = activeTemplate?.sections || []; 
      setAvailableSections(templateSections.filter(section => section.enabled !== false));
      console.log('Available sections (fallback):', availableSections);
    }
    // Set data loading state to false once sections are determined
    setLoadingState(prev => ({ ...prev, data: false }));

  }, [sectionVisibility, activeTemplate]); // Depend on the prop

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

  return (
    <>
      <div className="h-16 px-6 border-b bg-white flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-800">Preview</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const portfolioUrl = `${window.location.origin}/portfolio/${userId}`;
              navigator.clipboard.writeText(portfolioUrl);
              showNotification('Portfolio URL copied to clipboard!');
            }}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            <span>Share</span>
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
              className="w-20 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
        <div 
          className="min-h-full relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            height: `${100/scale}%`,
            width: '100%'
          }}
        >
          {loadingState.data && (
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