import React, { useEffect, useState } from 'react';
import useTemplateStore from '../store/userTemplateStore';
import useAuthStore from '../store/userAuthStore';
import { templateComponents } from './templateComponents';

const TemplateRenderer = () => {
  const { fetchActiveTemplate } = useTemplateStore(); // Fetch active template
  const userId = useAuthStore((state) => state.userId);
  console.log('User ID:', userId);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [fontStyle, setFontStyle] = useState('Poppins'); // Default font style
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplateAndSettings = async () => {
      if (!userId) {
        console.error('User ID is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch active template
        const activeTemplate = await fetchActiveTemplate(userId);
        setSelectedTemplate(activeTemplate);

        // Fetch font style (from database or API)
        const response = await fetch(
          `http://localhost:3000/authenticated-user/gettheme?userId=${userId}`
        );
        if (response.ok) {
          const { theme } = await response.json();
          console.log('Fetched theme:', theme); // Debugging fetched theme
          setFontStyle(theme.fontStyle || 'Poppins');
        } else {
          console.error('Failed to fetch theme settings');
        }
      } catch (error) {
        console.error('Error fetching active template or theme:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateAndSettings();
  }, [fetchActiveTemplate, userId]);

  // Log when fontStyle changes
  useEffect(() => {
    console.log('Updated font style:', fontStyle);
  }, [fontStyle]);

  if (loading) {
    return <p>Loading template...</p>;
  }

  if (!selectedTemplate) {
    return <p>No active template found.</p>;
  }

  const TemplateComponent = templateComponents[selectedTemplate.predefinedTemplate];

  if (!TemplateComponent) {
    return <p>Template not found for {selectedTemplate.name}</p>;
  }

  return (
    <div>
      {/* Pass the fontStyle prop to the template */}
      <TemplateComponent fontStyle={fontStyle} />
    </div>
  );
};

export default TemplateRenderer;
