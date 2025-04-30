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
  const [updatingTemplateId, setUpdatingTemplateId] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      // Clear the store's state before fetching
      useTemplateStore.setState({
        templates: [],
        activeTemplateId: null,
        hasCheckedActiveTemplate: false,
        lastUserId: null
      });
      fetchTemplates(userId);
    }
  }, [userId, fetchTemplates]);

  useEffect(() => {
    if (templates.length > 0) {
      console.log("All Templates:", templates);
      templates.forEach(template => {
        console.log(`Template "${template.name}" image path:`, template.image);
        console.log(`Full image URL:`, `http://localhost:3000${template.image}`);
      });
    }
  }, [templates]);

  const handleActivate = async (templateId) => {
    try {
      setUpdatingTemplateId(templateId);
      setUpdateMessage('');
      await activateTemplate(templateId, userId);
      await updateTheme(templateId, userId);
      setUpdateMessage('Template activated!');
      setTimeout(() => {
        setUpdateMessage('');
      }, 2000);
    } catch (error) {
      setUpdateMessage('Failed to activate');
      setTimeout(() => {
        setUpdateMessage('');
      }, 2000);
    } finally {
      setUpdatingTemplateId(null);
    }
  };

  const handleDeactivate = async () => {
    if (activeTemplateId) {
      try {
        setUpdatingTemplateId(activeTemplateId);
        setUpdateMessage('');
        await activateTemplate(null, userId);
        await updateTheme(null, userId);
        setUpdateMessage('Template deactivated!');
        setTimeout(() => {
          setUpdateMessage('');
        }, 2000);
      } catch (error) {
        setUpdateMessage('Failed to deactivate');
        setTimeout(() => {
          setUpdateMessage('');
        }, 2000);
      } finally {
        setUpdatingTemplateId(null);
      }
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
      if (activeTemplateId) {
        if (a._id === activeTemplateId) return -1;
        if (b._id === activeTemplateId) return 1;
      }
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
        <div>
          <h1 className="text-xl font-semibold text-gray-800">My Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and customize your portfolio templates</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              useTemplateStore.setState({
                templates: [],
                activeTemplateId: null,
                hasCheckedActiveTemplate: false,
                lastUserId: null
              });
              fetchTemplates(userId);
            }}
            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md text-sm text-gray-700 border border-gray-200 hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md text-sm text-gray-700 border border-gray-200 hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              <i className={`fas fa-chevron-${showSortDropdown ? 'up' : 'down'} text-xs`}></i>
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-md shadow-sm border border-gray-200 py-1 z-10">
                <button
                  onClick={() => handleSort('name')}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  Name
                </button>
                <button
                  onClick={() => handleSort('active')}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 hover:text-orange-500 transition-colors ${
                    !activeTemplateId ? 'text-gray-400 cursor-not-allowed' : ''
                  }`}
                  disabled={!activeTemplateId}
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
      </div>

      {sortedTemplates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px]">
          <div className="text-gray-500 text-center">
            <i className="fas fa-file-alt text-4xl mb-3 text-gray-300"></i>
            <p className="text-lg font-medium mb-2">No templates found</p>
            <p className="text-sm mb-4">Create your first template to get started</p>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
              Create Template
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedTemplates.map((template) => (
            <div
              key={template._id}
              className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
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
                <h2 className="text-base font-semibold mb-2 text-gray-800">{template.name}</h2>
                <p className="text-xs text-gray-500 mb-3">Created {new Date(template.createdAt).toLocaleDateString()}</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() =>
                      activeTemplateId === template._id
                        ? handleDeactivate()
                        : handleActivate(template._id)
                    }
                    disabled={updatingTemplateId !== null}
                    className={`w-full py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTemplateId === template._id
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    } ${updatingTemplateId !== null ? 'opacity-75 cursor-not-allowed' : ''} 
                    relative overflow-hidden`}
                  >
                    {updatingTemplateId === template._id ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Updating...</span>
                      </div>
                    ) : updateMessage && template._id === (activeTemplateId || updatingTemplateId) ? (
                      <span className="animate-fade-in">{updateMessage}</span>
                    ) : (
                      activeTemplateId === template._id ? 'Deactivate' : 'Activate'
                    )}
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
      )}
    </div>
  );
};

export default Templates;
