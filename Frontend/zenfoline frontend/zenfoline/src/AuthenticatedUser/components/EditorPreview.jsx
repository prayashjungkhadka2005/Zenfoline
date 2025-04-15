import React, { useState, useEffect } from 'react';
import { TemplateProvider } from '../../Templates/TemplateContext';
import { templateComponents } from '../../Templates/templateComponents';
import axios from 'axios';
import { FiMonitor, FiSmartphone, FiMaximize, FiShare2, FiX } from 'react-icons/fi';
import IframePreview from './IframePreview';

const EditorPreview = ({ activeTemplate, formData, fontStyle, userId, showNotification, sectionVisibility, previewMode, setPreviewMode }) => {
  // --- LOG PROPS --- 
  console.log("\n--- EditorPreview RENDER START ---");
  console.log("EditorPreview RENDER: formData prop:", JSON.stringify(formData)?.substring(0, 300) + '...'); // Log truncated data
  console.log("EditorPreview RENDER: sectionVisibility prop:", JSON.stringify(sectionVisibility));
  // --- END LOG PROPS ---

  const [loadingState, setLoadingState] = useState({ data: true });
  // Use state for derived values that need to be passed down
  const [derivedProps, setDerivedProps] = useState({ 
    processedData: null, 
    sectionsForTemplate: [] 
  });
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Combined effect for processing data and calculating available sections
  useEffect(() => {
    console.log("EditorPreview EFFECT [formData, sectionVisibility] START");
    let newProcessedData = null;
    let newAvailableSections = [];
    let dataIsLoading = true;

    // --- Determine availableSections FIRST ---
    if (sectionVisibility && Object.keys(sectionVisibility).length > 0) {
      console.log("EditorPreview EFFECT: Processing sectionVisibility:", JSON.stringify(sectionVisibility));

      // Check the structure of the first value (excluding potential 'customSections')
      const firstSectionKey = Object.keys(sectionVisibility).find(k => k !== 'customSections');
      const isComplexStructure = firstSectionKey && typeof sectionVisibility[firstSectionKey] === 'object' && sectionVisibility[firstSectionKey] !== null && 'isEnabled' in sectionVisibility[firstSectionKey];

      if (isComplexStructure) {
        console.log("EditorPreview EFFECT: Detected COMPLEX sectionVisibility structure.");
        newAvailableSections = Object.entries(sectionVisibility)
          .filter(([key, value]) => key !== 'customSections' && value && value.isEnabled === true) // Filter complex structure
          .map(([key]) => key);
      } else {
        console.log("EditorPreview EFFECT: Detected FLAT sectionVisibility structure.");
        newAvailableSections = Object.entries(sectionVisibility)
          .filter(([key, isEnabled]) => key !== 'customSections' && isEnabled === true) // Filter flat structure
          .map(([key]) => key);
      }
      console.log("EditorPreview EFFECT: Calculated availableSections:", newAvailableSections);

    } else {
      console.log("EditorPreview EFFECT: sectionVisibility empty, using fallback.");
      const templateSections = activeTemplate?.sections || [];
      newAvailableSections = templateSections
        .filter(section => section.enabled !== false)
        .map(s => s.id);
      console.log("EditorPreview EFFECT: Fallback availableSections:", newAvailableSections);
    }

    // --- Process formData --- 
    if (formData) {
      console.log("EditorPreview EFFECT: Processing formData");
      newProcessedData = JSON.parse(JSON.stringify(formData));
      
      // Format basics section (Example - keep all formatting logic)
      if (newProcessedData.basics) {
        newProcessedData.basics = {
          ...newProcessedData.basics,
          name: newProcessedData.basics.name || '',
          title: newProcessedData.basics.role || '',
          summary: newProcessedData.basics.bio || '',
          email: newProcessedData.basics.email || '',
          phone: newProcessedData.basics.phone || '',
          location: newProcessedData.basics.location || '',
          profileImage: newProcessedData.basics.profileImage || null
        };
      }
      // ... include ALL other formatting logic here (about, skills, projects, etc.) ...
       // Format about section
      if (newProcessedData.about) {
        newProcessedData.about = {
          ...newProcessedData.about,
          description: newProcessedData.about.description || '',
          highlights: newProcessedData.about.highlights || []
        };
      }

      // Format skills section
      if (newProcessedData.skills) {
        if (Array.isArray(newProcessedData.skills)) {
          const technicalSkills = newProcessedData.skills.filter(skill => skill.category === 'Technical');
          const softSkills = newProcessedData.skills.filter(skill => skill.category === 'Soft');
          newProcessedData.skills = { technical: technicalSkills, soft: softSkills };
        } else {
          newProcessedData.skills = { technical: newProcessedData.skills.technical || [], soft: newProcessedData.skills.soft || [] };
        }
      }

      // Format experience section
      if (newProcessedData.experience) {
        newProcessedData.experience = (newProcessedData.experience || []).map(exp => ({
          ...exp, company: exp.company || '', title: exp.title || '', position: exp.title || '', location: exp.location || '', startDate: exp.startDate || '', endDate: exp.isCurrentPosition ? null : (exp.endDate || ''), current: exp.isCurrentPosition || false, description: exp.description || '', achievements: exp.achievements || []
        }));
      }

       // Format projects section
      if (newProcessedData.projects) {
        newProcessedData.projects = (newProcessedData.projects || []).map(project => {
          let processedImages = [];
          if (project.images && project.images.length > 0) {
            processedImages = project.images.map(img => img.startsWith('data:image') ? img : (img.startsWith('/uploads/') ? `${window.location.origin}${img}` : img));
          } else if (project.image) {
            processedImages = [project.image.startsWith('data:image') ? project.image : (project.image.startsWith('/uploads/') ? `${window.location.origin}${project.image}` : project.image)];
          }
          return { ...project, title: project.title || '', description: project.description || '', technologies: project.technologies || [], images: processedImages, liveUrl: project.liveUrl || project.liveLink || '', sourceUrl: project.sourceUrl || project.sourceCode || '', isVisible: project.isVisible !== false };
        });
      }

      // Format publications section
      if (newProcessedData.publications) {
        newProcessedData.publications = (newProcessedData.publications || []).map(pub => ({ ...pub, title: pub.title || '', publisher: pub.publisher || '', date: pub.publicationDate || '', description: pub.description || '', url: pub.url || '', image: pub.image || '' }));
      }

      // Format certifications section
      if (newProcessedData.certifications) {
        newProcessedData.certifications = (newProcessedData.certifications || []).map(cert => ({ ...cert, name: cert.name || '', issuer: cert.issuer || '', issueDate: cert.issueDate || '', expiryDate: cert.expiryDate || '', credentialId: cert.credentialId || '', credentialUrl: cert.credentialUrl || '' }));
      }

      // Format services section
      if (newProcessedData.services) {
        newProcessedData.services = (newProcessedData.services || []).map(service => ({ ...service, title: service.title || '', description: service.description || '', icon: service.icon || 'FaCode' }));
      }

      console.log("EditorPreview EFFECT: Finished initial data formatting.");
    } else {
       console.log("EditorPreview EFFECT: formData is null/undefined, initializing empty object.");
       newProcessedData = {}; // Start with an empty object if formData is null
    }
    
    // --- Ensure keys exist for all available sections --- 
    console.log("EditorPreview EFFECT: Ensuring data keys exist for available sections.");
    newAvailableSections.forEach(sectionId => {
      if (!(sectionId in newProcessedData)) {
        console.log(`EditorPreview EFFECT: Initializing placeholder data for missing section: ${sectionId}`);
        // Initialize with empty array/object based on common patterns
        if (['experience', 'projects', 'education', 'publications', 'certifications', 'awards', 'services', 'highlights'].includes(sectionId)) {
           newProcessedData[sectionId] = [];
        } else if (sectionId === 'skills') {
           newProcessedData[sectionId] = { technical: [], soft: [] };
        } else if (sectionId === 'about'){
           newProcessedData[sectionId] = { description: '', highlights: [] };
        } else if (sectionId === 'basics'){ // Ensure basics has a placeholder if enabled but missing
           newProcessedData[sectionId] = { name: '', role: '', bio: '', email: '', phone: '', location: '', profileImage: null };
        } else {
           newProcessedData[sectionId] = {}; // Default to object
        }
      }
    });
    console.log("EditorPreview EFFECT: Finished ensuring data keys.");

    // --- Update State --- 
    setDerivedProps({ 
      processedData: newProcessedData, 
      sectionsForTemplate: newAvailableSections 
    });

    // --- Update Loading State --- 
    dataIsLoading = !newProcessedData; // Loading if no processed data object exists
    setLoadingState({ data: dataIsLoading });

    console.log("EditorPreview EFFECT [formData, sectionVisibility] END");

  }, [formData, sectionVisibility, activeTemplate]); // Dependencies


  // Check if section has data (now uses derivedProps.processedData)
  const hasSectionData = (sectionId) => {
    const currentProcessedData = derivedProps.processedData;
    // Log here to see what processedData is when check is called
    // console.log(`EditorPreview: hasSectionData check for ${sectionId}, processedData keys: ${currentProcessedData ? Object.keys(currentProcessedData) : 'null'}`); 
    if (!currentProcessedData || !currentProcessedData[sectionId]) return false;
    
    switch (sectionId) {
      case 'basics':
        return currentProcessedData.basics?.name || currentProcessedData.basics?.title || currentProcessedData.basics?.summary;
      case 'about':
        return currentProcessedData.about?.description && currentProcessedData.about.description.trim() !== '';
      case 'skills':
        return currentProcessedData.skills?.technical?.length > 0 || currentProcessedData.skills?.soft?.length > 0;
      case 'experience':
        return currentProcessedData.experience?.length > 0;
      case 'education':
        return currentProcessedData.education?.length > 0;
      case 'projects':
        return currentProcessedData.projects?.length > 0;
      case 'publications':
        return currentProcessedData.publications?.length > 0;
      case 'certifications':
        return currentProcessedData.certifications?.length > 0;
      case 'awards':
        return currentProcessedData.awards?.length > 0;
      case 'services':
        return currentProcessedData.services?.length > 0;
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
  
  // --- LOG STATE BEFORE RENDER --- 
  console.log("EditorPreview RENDER: loadingState:", loadingState);
  console.log("EditorPreview RENDER: derivedProps.processedData keys:", derivedProps.processedData ? Object.keys(derivedProps.processedData) : 'null');
  console.log("EditorPreview RENDER: derivedProps.sectionsForTemplate:", derivedProps.sectionsForTemplate);
  console.log("--- EditorPreview RENDER END ---");
  // --- END LOG STATE BEFORE RENDER ---

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
                  width={iframeWidth}
                  height={iframeHeight}
                  fontStyle={fontStyle || derivedProps.processedData?.theme?.fontStyle}
                >
                  <TemplateProvider mode="preview">
                    <TemplateComponent 
                      template={activeTemplate} 
                      data={derivedProps.processedData}
                      fontStyle={fontStyle}
                      availableSections={derivedProps.sectionsForTemplate}
                      checkSectionData={hasSectionData}
                      sectionVisibility={sectionVisibility}
                      isPreviewMode={true}
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
                width="100%"
                height="100%"
                fontStyle={fontStyle || derivedProps.processedData?.theme?.fontStyle}
              >
                <TemplateProvider mode="preview">
                  <TemplateComponent 
                    template={activeTemplate} 
                    data={derivedProps.processedData}
                    fontStyle={fontStyle}
                    availableSections={derivedProps.sectionsForTemplate}
                    checkSectionData={hasSectionData}
                    sectionVisibility={sectionVisibility}
                    isPreviewMode={true}
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