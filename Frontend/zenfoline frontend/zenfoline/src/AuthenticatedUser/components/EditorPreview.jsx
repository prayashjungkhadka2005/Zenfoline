import React, { useState, useEffect } from 'react';
import { TemplateProvider } from '../../Templates/TemplateContext';
import { templateComponents } from '../../Templates/templateComponents';
import axios from 'axios';
import { FiMonitor, FiSmartphone, FiMaximize, FiShare2, FiX } from 'react-icons/fi';
import IframePreview from './IframePreview';

const EditorPreview = ({ activeTemplate, formData, fontStyle, userId, showNotification, sectionVisibility, previewMode, setPreviewMode }) => {
  const [loadingState, setLoadingState] = useState({
    data: true
  });
  const [availableSections, setAvailableSections] = useState([]);
  const [processedFormData, setProcessedFormData] = useState(formData);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

      // Format publications section
      if (newFormData.publications) {
        newFormData.publications = (newFormData.publications || []).map(pub => ({
          ...pub,
          title: pub.title || '',
          publisher: pub.publisher || '',
          date: pub.publicationDate || '',
          description: pub.description || '',
          url: pub.url || '',
          image: pub.image || ''
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
          icon: service.icon || 'FaCode'
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
    } else {
      const templateSections = activeTemplate?.sections || []; 
      setAvailableSections(templateSections.filter(section => section.enabled !== false).map(s => s.id));
    }
    setLoadingState(prev => ({ ...prev, data: false }));
  }, [sectionVisibility, activeTemplate]);

  // Check if section has data
  const hasSectionData = (sectionId) => {
    if (!processedFormData || !processedFormData[sectionId]) return false;
    
    switch (sectionId) {
      case 'basics':
        return processedFormData.basics?.name || processedFormData.basics?.title || processedFormData.basics?.summary;
      case 'about':
        return processedFormData.about?.description && processedFormData.about.description.trim() !== '';
      case 'skills':
        return processedFormData.skills?.technical?.length > 0 || processedFormData.skills?.soft?.length > 0;
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

  // Get the appropriate template component
  const TemplateComponent = templateComponents[activeTemplate?.predefinedTemplate];
  
  // Determine iframe dimensions based on previewMode
  const iframeWidth = previewMode === 'mobile' ? '375px' : '100%';
  const iframeHeight = '100%';

  // Toggle full screen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      {!isFullScreen ? (
        <>
          <div className="h-16 px-4 sm:px-6 border-b bg-white flex items-center justify-between flex-shrink-0">
            <h2 className={`text-lg font-semibold text-gray-800 hidden sm:block`}>
              Preview
            </h2>
            <div className={`flex items-center ${previewMode === 'mobile' ? 'space-x-2' : 'space-x-3 sm:space-x-4'}`}>
              <div className="flex items-center space-x-1 border border-gray-200 rounded-md p-0.5">
                <button
                  onClick={() => setPreviewMode('responsive')}
                  title="Responsive Preview"
                  className={`p-1.5 rounded ${
                    previewMode === 'responsive'
                      ? 'bg-orange-100 text-orange-600'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } transition-colors`}
                >
                  <FiMaximize className="w-4 h-4" />
                </button>
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
              <button
                onClick={toggleFullScreen}
                title="Full Screen Preview"
                className="px-2 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-1.5"
              >
                <FiMaximize className="w-4 h-4" />
                <span className={`${previewMode === 'mobile' ? 'hidden' : 'hidden lg:inline'}`}>Full Screen</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-100 to-blue-50 flex justify-center items-start">
            <div className="shadow-lg border border-gray-300 bg-white relative w-full h-full flex justify-center items-center overflow-hidden">
              {loadingState.data && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-3 text-gray-600 text-sm">Loading preview...</p>
                  </div>
                </div>
              )}
              
              {!loadingState.data && !TemplateComponent && (
                <div className="text-gray-500 text-center p-8">
                  <h2 className="text-2xl font-bold mb-2">Template Not Supported</h2>
                  <p>The template type "{activeTemplate?.predefinedTemplate}" is not currently supported.</p>
                </div>
              )}
              
              {!loadingState.data && TemplateComponent && (
                <IframePreview 
                  key={activeTemplate?.predefinedTemplate || 'no-template'}
                  width={iframeWidth}
                  height={iframeHeight}
                  fontStyle={fontStyle}
                >
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
                </IframePreview>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-16 px-4 sm:px-6 border-b bg-white flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">Full Screen Preview</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleFullScreen}
                title="Exit Full Screen"
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-1.5"
              >
                <FiX className="w-4 h-4" />
                <span>Exit Preview</span>
              </button>
            </div>
          </div>
          <div className="h-[calc(100vh-4rem)] overflow-hidden">
            {!loadingState.data && TemplateComponent && (
              <IframePreview 
                key={activeTemplate?.predefinedTemplate || 'no-template'}
                width="100%"
                height="100%"
                fontStyle={fontStyle}
              >
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
              </IframePreview>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditorPreview;