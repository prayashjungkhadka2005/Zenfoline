import React, { useEffect, useState } from 'react';
import useTemplateStore from '../store/userTemplateStore';
import useAuthStore from '../store/userAuthStore';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

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

  const [sortBy, setSortBy] = useState('name');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
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

  const handleSort = (sortType) => {
    setSortBy(sortType);
    setShowSortDropdown(false);
  };

  const sortedTemplates = [...templates].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'active') {
      if (a._id === activeTemplateId) return -1;
      if (b._id === activeTemplateId) return 1;
      return 0;
    } else if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-xl font-semibold text-gray-800">My Templates</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 flex justify-center items-center min-h-[300px]">
          <div className="text-center">
            <Spinner size="md" color="orange-500" />
            <p className="mt-4 text-gray-600">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-xl font-semibold text-gray-800">My Templates</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px]">
          <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
          <button 
            onClick={() => fetchTemplates(userId)}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl font-semibold text-gray-800">My Templates</h1>
        <div className="relative">
          <button 
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md text-sm text-gray-700 border border-gray-200 hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            <i className={`fas fa-chevron-${showSortDropdown ? 'up' : 'down'} text-xs`}></i>
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-md shadow-sm border border-gray-200 py-1">
              <button
                onClick={() => handleSort('name')}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 hover:text-orange-500 transition-colors"
              >
                Name
              </button>
              <button
                onClick={() => handleSort('active')}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 hover:text-orange-500 transition-colors"
              >
                Active First
              </button>
              <button
                onClick={() => handleSort('newest')}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 hover:text-orange-500 transition-colors"
              >
                Newest First
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTemplates.map((template) => (
          <div
            key={template._id}
            className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
              activeTemplateId === template._id ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <div className="relative">
              <img
                src={`http://localhost:3000${template.image}`}
                alt={template.name}
                className="w-full h-40 object-cover"
              />
              {activeTemplateId === template._id && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Active
                </div>
              )}
            </div>

            <div className="p-4">
              <h2 className="text-base font-semibold mb-3 text-gray-800">{template.name}</h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() =>
                    activeTemplateId === template._id
                      ? handleDeactivate()
                      : handleActivate(template._id)
                  }
                  className={`w-full py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTemplateId === template._id
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {activeTemplateId === template._id ? 'Deactivate' : 'Activate'}
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(template._id)}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTemplateId === template._id
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={activeTemplateId !== template._id}
                  >
                    Edit Template
                  </button>
                  <button className="flex-1 py-1.5 rounded-md text-sm font-medium border border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors">
                    Live Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
