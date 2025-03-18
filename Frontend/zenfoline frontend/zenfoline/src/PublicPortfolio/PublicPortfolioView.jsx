import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { templateComponents } from '../RenderedTemplate/templateComponents';
import axios from 'axios';

const PublicPortfolioView = () => {
  const { userId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Fetch both portfolio data and template information
        const [portfolioResponse, templateResponse] = await Promise.all([
          axios.get(`http://localhost:3000/portfolio/${userId}`),
          axios.get(`http://localhost:3000/portfolio/template/${userId}`)
        ]);

        if (portfolioResponse.data.success && templateResponse.data.success) {
          setPortfolioData(portfolioResponse.data.data);
          setTemplate(templateResponse.data.data);
          setLoading(false);
        } else {
          throw new Error(portfolioResponse.data.message || templateResponse.data.message);
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError(err.response?.data?.message || 'Failed to load portfolio');
        setLoading(false);
      }
    };

    if (userId) {
      fetchPortfolioData();
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

  return (
    <div className="min-h-screen">
      <TemplateComponent
        template={template}
        data={portfolioData}
        fontStyle={portfolioData.theme?.fontStyle || 'Poppins'}
      />
    </div>
  );
};

export default PublicPortfolioView; 