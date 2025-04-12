import React, { useState, useEffect } from 'react';
import { TemplateProvider } from '../../Templates/TemplateContext';
import axios from 'axios';
import { FiMonitor, FiSmartphone, FiTablet, FiShare2 } from 'react-icons/fi';

const EditorPreview = ({ scale, setScale, TemplateComponent, activeTemplate, formData, fontStyle, userId, showNotification, sectionVisibility, previewMode, setPreviewMode }) => {
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
        .filter(([key, value]) => value.isEnabled)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([key]) => key);
      setAvailableSections(enabledSections);
      console.log('Available sections from prop:', enabledSections); 
    } else {
      // Fallback or default if visibility prop is empty/undefined
      // You might want a more robust fallback based on activeTemplate
      const templateSections = activeTemplate?.sections || []; 
      setAvailableSections(templateSections.filter(section => section.enabled !== false).map(s => s.id));
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
      <div className="h-16 px-4 sm:px-6 border-b bg-white flex items-center justify-between flex-shrink-0">
        <h2 className={`text-lg font-semibold text-gray-800 hidden sm:block`}>
          Preview
        </h2>
        <div className={`flex items-center ${previewMode === 'mobile' ? 'space-x-2' : 'space-x-3 sm:space-x-4'}`}>
          <div className="flex items-center space-x-1 border border-gray-200 rounded-md p-0.5">
            <button
              onClick={() => setPreviewMode('desktop')}
              title="Desktop Preview"
              className={`p-1.5 rounded ${
                previewMode === 'desktop'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              } transition-colors`}
            >
              <FiMonitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              title="Tablet Preview"
              className={`p-1.5 rounded ${
                previewMode === 'tablet'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              } transition-colors`}
            >
              <FiTablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              title="Mobile Preview"
              className={`p-1.5 rounded ${
                previewMode === 'mobile'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              } transition-colors`}
            >
              <FiSmartphone className="w-4 h-4" />
            </button>
          </div>
          {/* Show scale slider only for desktop */}
          {previewMode === 'desktop' && (
            <div className="flex items-center space-x-1">
              <label className={`text-sm text-gray-600 hidden md:block`}>Scale:</label>
              <input
                type="range"
                min="0.3"
                max="1"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className={`h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 w-16 md:w-24`}
              />
              <span className={`text-xs text-gray-500 w-8 text-right`}>
                {(scale * 100).toFixed(0)}%
              </span>
            </div>
          )}
          <button
            onClick={() => {
              const portfolioUrl = `${window.location.origin}/portfolio/${userId}`;
              navigator.clipboard.writeText(portfolioUrl);
              showNotification('Portfolio URL copied to clipboard!');
            }}
            title="Copy Portfolio Link"
            className="px-2 py-1.5 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors flex items-center space-x-1.5"
          >
            <FiShare2 className="w-4 h-4" />
            <span className={`${previewMode === 'mobile' ? 'hidden' : 'hidden lg:inline'}`}>Share</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-100 to-blue-50 flex justify-center items-start">
        <div
          className={`
            transition-all duration-300 ease-in-out shadow-lg border border-gray-300 bg-white relative
            ${previewMode === 'mobile' ? 'w-[375px] h-full' : 
              previewMode === 'tablet' ? 'w-[768px] h-full' : 
              'w-full'
            }
          `}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {loadingState.data && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-3 text-gray-600 text-sm">Loading preview...</p>
              </div>
            </div>
          )}
          <div className={`w-full h-full overflow-hidden ${previewMode === 'mobile' || previewMode === 'tablet' ? 'overflow-y-auto' : ''}`}>
            {!loadingState.data && TemplateComponent && (
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
      </div>
    </>
  );
};

export default EditorPreview; 