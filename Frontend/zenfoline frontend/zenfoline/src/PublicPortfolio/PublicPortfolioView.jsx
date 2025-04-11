import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { templateComponents } from '../RenderedTemplate/templateComponents';
import { TemplateProvider } from '../Templates/TemplateContext';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';

const PublicPortfolioView = () => {
  const { userId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [template, setTemplate] = useState(null);
  const [themeSettings, setThemeSettings] = useState(null);
  const [sectionVisibility, setSectionVisibility] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to check if a section has data
  const checkSectionData = (sectionId) => {
    if (!portfolioData || !portfolioData[sectionId]) return false;
    
    switch (sectionId) {
      case 'basics':
        return portfolioData.basics?.name || portfolioData.basics?.title || portfolioData.basics?.summary;
      case 'about':
        return portfolioData.about?.description && portfolioData.about.description.trim() !== '';
      case 'skills':
        return portfolioData.skills?.length > 0;
      case 'experience':
        return portfolioData.experience?.length > 0;
      case 'education':
        return portfolioData.education?.length > 0;
      case 'projects':
        return portfolioData.projects?.length > 0;
      case 'publications':
        return portfolioData.publications?.length > 0;
      case 'certifications':
        return portfolioData.certifications?.length > 0;
      case 'awards':
        return portfolioData.awards?.length > 0;
      case 'services':
        return portfolioData.services?.length > 0;
      default:
        return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch portfolio data, template information, and theme settings
        const [portfolioResponse, templateResponse, themeResponse] = await Promise.all([
          axios.get(`http://localhost:3000/portfolio/${userId}`),
          axios.get(`http://localhost:3000/portfolio/template/${userId}`),
          axios.get(`http://localhost:3000/authenticated-user/gettheme?userId=${userId}`)
        ]);

        if (portfolioResponse.data.success && templateResponse.data.success) {
          const portfolioData = portfolioResponse.data.data;
          
          // Transform skills data into the format expected by the template
          if (portfolioData.skills && Array.isArray(portfolioData.skills)) {
            const transformedSkills = {
              technical: portfolioData.skills
                .filter(skill => skill.category === 'Technical')
                .map(skill => ({
                  name: skill.name,
                  level: skill.proficiency,
                  isVisible: skill.isVisible
                })),
              soft: portfolioData.skills
                .filter(skill => skill.category === 'Soft')
                .map(skill => ({
                  name: skill.name,
                  level: skill.proficiency,
                  isVisible: skill.isVisible
                }))
            };
            portfolioData.skills = transformedSkills;
          }
          
          setPortfolioData(portfolioData);
          setTemplate(templateResponse.data.data);
          
          // Set theme settings from the response
          if (themeResponse.data.theme) {
            setThemeSettings(themeResponse.data.theme);
          }
          
          // Extract and transform section visibility
          if (portfolioData.sectionConfiguration) {
            const config = portfolioData.sectionConfiguration;
            const transformedVisibility = {};
            Object.keys(config).forEach(key => {
              // Ensure we only process sections with an isEnabled property
              if (config[key] && typeof config[key].isEnabled === 'boolean') {
                transformedVisibility[key] = config[key].isEnabled;
              }
            });
            console.log('Transformed Visibility (Public View):', transformedVisibility); // Debug log
            setSectionVisibility(transformedVisibility); // Set state with the simple object
          } else {
             // Handle cases where sectionConfiguration might be missing - perhaps set a default?
             console.warn('sectionConfiguration not found in portfolioData');
             // setSectionVisibility({}); // Or set based on theme/template defaults if needed
          }
        } else {
          throw new Error(portfolioResponse.data.message || templateResponse.data.message);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError(err.response?.data?.message || 'Failed to load portfolio');
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return <LoadingScreen showMessages={false} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Template Not Found</h2>
          <p>The template for this portfolio is not available.</p>
        </div>
      </div>
    );
  }

  // Merge theme settings with portfolio data
  const enhancedData = {
    ...portfolioData,
    theme: themeSettings
  };

  const TemplateComponent = templateComponents[template.predefinedTemplate];

  return (
    <div className="min-h-screen">
      <TemplateProvider mode="public">
        <TemplateComponent
          template={template}
          data={enhancedData}
          fontStyle={themeSettings?.fontStyle || 'Poppins'}
          checkSectionData={checkSectionData}
          sectionVisibility={sectionVisibility}
        />
      </TemplateProvider>
    </div>
  );
};

export default PublicPortfolioView;