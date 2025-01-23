import React, { useEffect } from 'react';
import useTemplateStore from '../store/templateStore';
import useAuthStore from '../store/userAuthStore';

const Templates = () => {
  const {
    templates,
    activeTemplateId,
    loading,
    error,
    fetchTemplates,
    activateTemplate,
  } = useTemplateStore();

  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    if (userId) {
      fetchTemplates(userId); // Fetch templates for the logged-in user
    }
  }, [userId, fetchTemplates]);

  const handleActivate = async (templateId) => {
    await activateTemplate(templateId, userId); // Activate the selected template
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <button className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-md text-orange-600 font-medium">
          Sort by <i className="fas fa-chevron-down"></i>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template._id}
            className={`border rounded-lg overflow-hidden shadow-sm ${
              activeTemplateId === template._id ? 'border-green-500' : ''
            }`}
          >
            <img
              src={`http://localhost:3000${template.image}`}
              alt={template.name}
              className="w-full h-60 object-cover"
            />

            <div className="p-4 py-4">
              <h2 className="text-lg font-bold mb-2">{template.name}</h2>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleActivate(template._id)}
                  className={`px-4 py-2 rounded-md text-sm ${
                    activeTemplateId === template._id
                      ? 'bg-green-500 text-white'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {activeTemplateId === template._id ? 'Current' : 'Activate'}
                </button>
                {activeTemplateId === template._id && (
                  <div className="flex items-center gap-2 text-green-500 font-bold">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Active
                  </div>
                )}
                <button className="bg-transparent border border-orange-500 text-orange-500 px-4 py-2 rounded-md text-sm">
                  Live Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
