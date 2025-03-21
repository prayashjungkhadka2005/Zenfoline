import React, { useEffect } from 'react';
import useTemplateStore from '../store/userTemplateStore';
import useAuthStore from '../store/userAuthStore';
import { useNavigate } from 'react-router-dom';

const Templates = () => {
  const {
    templates,
    activeTemplateId,
    loading,
    error,
    fetchTemplates,
    activateTemplate,
    updateTheme
  } = useTemplateStore();

  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchTemplates(userId);
    }
  }, [userId, fetchTemplates]);

  const handleActivate = async (templateId) => {
    await activateTemplate(templateId, userId); 
    await updateTheme(templateId, userId);
  };

  const handleDeactivate = async () => {
    if (activeTemplateId) {
      await activateTemplate(null, userId); 
      await updateTheme(null, userId);
    }
  };

  const handleEdit = (templateId) => {
    window.open(`/template-editor/${templateId}`, '_blank');
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
              <div className="flex justify-between items-center mb-3">
                <button
                  onClick={() =>
                    activeTemplateId === template._id
                      ? handleDeactivate()
                      : handleActivate(template._id)
                  }
                  className={`px-4 py-2 rounded-md text-sm ${
                    activeTemplateId === template._id
                      ? 'bg-red-500 text-white'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {activeTemplateId === template._id ? 'Deactivate' : 'Activate'}
                </button>
                {activeTemplateId === template._id && (
                  <div className="flex items-center gap-2 text-green-500 font-bold">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Active
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => handleEdit(template._id)}
                  className={`px-4 py-2 rounded-md text-sm ${
                    activeTemplateId === template._id
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={activeTemplateId !== template._id}
                >
                  Edit Template
                </button>
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
