import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { templateComponents } from '../RenderedTemplate/templateComponents';
import axios from 'axios';

const PublicPortfolioView = () => {
  const { userId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [template, setTemplate] = useState(null);
  const [themeSettings, setThemeSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setPortfolioData(portfolioResponse.data.data);
          setTemplate(templateResponse.data.data);
          
          // Set theme settings from the response
          if (themeResponse.data.theme) {
            setThemeSettings(themeResponse.data.theme);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!portfolioData || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600">The requested portfolio could not be found.</p>
        </div>
      </div>
    );
  }

  const TemplateComponent = templateComponents[template.predefinedTemplate];

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Template Not Found</h1>
          <p className="text-gray-600">The template for this portfolio is not available.</p>
        </div>
      </div>
    );
  }

  // Merge theme settings with portfolio data
  const enhancedData = {
    ...portfolioData,
    theme: {
      ...portfolioData.theme,
      ...themeSettings,
      fontStyle: themeSettings?.fontStyle || 'Poppins',
      colorMode: themeSettings?.colorMode || 'default',
      presetTheme: themeSettings?.presetTheme || 0
    }
  };

  return (
    <div className="min-h-screen">
      <TemplateComponent
        template={template}
        data={enhancedData}
        fontStyle={themeSettings?.fontStyle || 'Poppins'}
      />
    </div>
  );
};

export default PublicPortfolioView;