import React, { useEffect, useState } from 'react';
import useTemplateStore from '../store/templateStore';
import useAuthStore from '../store/userAuthStore'; 
import { templateComponents } from './templateComponents';

const TemplateRenderer = () => {
  const { fetchActiveTemplate } = useTemplateStore(); //fetch active template
  const { userId } = useAuthStore(); // get userid from auth store
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!userId) {
        console.error('User ID is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const activeTemplate = await fetchActiveTemplate(userId);
        setSelectedTemplate(activeTemplate);
      } catch (error) {
        console.error('Error fetching active template:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [fetchActiveTemplate, userId]);

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
      <TemplateComponent />
    </div>
  );
};

export default TemplateRenderer;
