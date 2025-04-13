import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiFileText } from 'react-icons/fi';
import useAuthStore from '../../../store/userAuthStore';
import axios from 'axios';
import Spinner from '../../../components/Spinner';

// API base URL
const API_BASE_URL = 'http://localhost:3000';

const ProjectsForm = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState(data || []);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((state) => state.userId);
  const isInitialMount = useRef(true);

  const commonClasses = {
    section: "max-w-3xl mx-auto space-y-8",
    infoBox: "bg-blue-50 p-4 rounded-lg mb-8",
    infoText: "text-blue-700 text-sm",
    projectSection: "space-y-6",
    projectCard: "bg-white rounded-lg mb-4 p-6 relative border border-gray-200",
    grid: "grid grid-cols-2 gap-6",
    inputGroup: "space-y-2",
    label: "block text-sm font-medium text-gray-600",
    input: "w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    removeButton: "absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors",
    addButton: "w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm font-medium",
    techSection: "mt-6 space-y-4",
    techInput: "flex gap-2",
    techTag: "inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800",
    techTagRemove: "ml-2 text-blue-600 hover:text-blue-800",
    errorText: "text-red-500 text-xs mt-1",
    errorInput: "border-red-300 focus:ring-red-500 focus:border-red-500",
    loadingPlaceholder: "h-10 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200",
    loadingTextareaPlaceholder: "h-20 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200",
    loadingImagePlaceholder: "w-40 h-40 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200 shadow-lg"
  };

  // Fetch projects data from the API on initial mount
  useEffect(() => {
    const fetchProjectsInfo = async () => {
      if (!userId || !isInitialMount.current) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/portfolio-save/projects/${userId}`);
        if (response.data && response.data.data) {
          // Transform the API data to match the form's expected format
          const transformedData = response.data.data.map(project => {
            // Handle both base64 and file path image formats
            let imageUrl = '';
            if (project.images && project.images.length > 0) {
              if (project.images[0].startsWith('data:image')) {
                // Base64 image
                imageUrl = project.images[0];
              } else if (project.images[0].startsWith('/uploads/')) {
                // File path - construct full URL
                imageUrl = `${API_BASE_URL}${project.images[0]}`;
              }
            }
            
            return {
              title: project.title || '',
              description: project.description || '',
              technologies: project.technologies || [],
              newTech: '',
              image: imageUrl,
              images: project.images || [],
              liveUrl: project.liveUrl || '',
              sourceUrl: project.sourceUrl || '',
              liveLink: project.liveUrl || '',
              sourceCode: project.sourceUrl || '',
              isVisible: project.isVisible !== false
            };
          });
          
          setFormData(transformedData);
          onUpdate(transformedData);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsInfo();
    isInitialMount.current = false;
  }, [userId]);

  const handleProjectChange = (index, field, value) => {
    const newData = [...formData];
    newData[index] = {
      ...newData[index],
      [field]: value
    };

    // Keep URL fields in sync
    if (field === 'liveLink') {
      newData[index].liveUrl = value;
    } else if (field === 'sourceCode') {
      newData[index].sourceUrl = value;
    }

    // Clear error for this field
    setFieldErrors(prev => ({
      ...prev,
      [`${index}-${field}`]: false
    }));

    setFormData(newData);
    onUpdate(newData);
  };

  const addProject = () => {
    const newData = [
      ...formData,
      {
        title: '',
        description: '',
        technologies: [],
        newTech: '',
        image: '',
        liveLink: '',
        sourceCode: '',
        isVisible: true
      }
    ];
    setFormData(newData);
    onUpdate(newData);
  };

  const removeProject = (index) => {
    const newData = [...formData];
    newData.splice(index, 1);
    setFormData(newData);
    onUpdate(newData);

    // Clear errors for this project
    const newErrors = { ...fieldErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`${index}-`)) {
        delete newErrors[key];
      }
    });
    setFieldErrors(newErrors);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the image as a base64 string
        const base64Image = reader.result;
        handleProjectChange(index, 'image', base64Image);
        
        // Also update the images array for API compatibility
        const newData = [...formData];
        newData[index] = {
          ...newData[index],
          images: [base64Image]
        };
        setFormData(newData);
        onUpdate(newData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTechnology = (index, tech) => {
    if (!tech?.trim()) return;

    const newData = [...formData];
    if (!newData[index].technologies) {
      newData[index].technologies = [];
    }
    newData[index].technologies.push(tech.trim());
    newData[index].newTech = '';
    setFormData(newData);
    onUpdate(newData);
  };

  const handleRemoveTechnology = (projectIndex, techIndex) => {
    const newData = [...formData];
    newData[projectIndex].technologies.splice(techIndex, 1);
    setFormData(newData);
    onUpdate(newData);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.length) {
      setError('Please add at least one project');
      isValid = false;
      return isValid;
    }

    formData.forEach((project, index) => {
      if (!project.title?.trim()) {
        newErrors[`${index}-title`] = true;
        isValid = false;
      }
      if (!project.description?.trim()) {
        newErrors[`${index}-description`] = true;
        isValid = false;
      }
      if (!project.technologies?.length) {
        newErrors[`${index}-technologies`] = true;
        isValid = false;
      }
    });

    if (!isValid) {
      setError('Please fill in all required fields');
    }
    setFieldErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    try {
      setError('');
      setFieldErrors({});

      if (!validateForm()) {
        setStatus('error');
        setTimeout(() => {
          setStatus(null);
        }, 3000);
        return;
      }

      setStatus('saving');
      
      // Transform the form data to match the API's expected format
      const apiData = formData.map(project => ({
        title: project.title,
        description: project.description,
        technologies: project.technologies || [],
        // Keep existing images if no new image was uploaded
        images: project.images || [],
        liveUrl: project.liveLink,
        sourceUrl: project.sourceCode,
        isVisible: project.isVisible !== false
      }));

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('projects', JSON.stringify(apiData));
      
      // Only process and upload images that have actually changed
      formData.forEach((project, index) => {
        // Check if this is a new base64 image that's different from the original
        const hasNewImage = project.image && 
                           project.image.startsWith('data:image') && 
                           (!project.images || 
                            !project.images[0] || 
                            project.images[0] !== project.image);
        
        if (hasNewImage) {
          // Convert base64 to file
          const base64Data = project.image.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteArrays = [];
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays.push(byteCharacters.charCodeAt(i));
          }
          
          const byteArray = new Uint8Array(byteArrays);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          const file = new File([blob], `project-${index}.jpg`, { type: 'image/jpeg' });
          
          formDataToSend.append('projectImages', file);
          
          // Update the images array in apiData to include the new image
          apiData[index].images = [project.image];
        }
      });

      // Save to the API
      const response = await axios.post(
        `${API_BASE_URL}/portfolio-save/projects/${userId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data) {
        setStatus('success');
        setTimeout(() => {
          setStatus(null);
          setError('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving projects:', error);
      setStatus('error');
      setError('Failed to save projects');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className={commonClasses.section}>
        <div className={commonClasses.infoBox}>
          <p className={commonClasses.infoText}>Add your notable projects here. Include details about technologies used and your role.</p>
        </div>
        <div className="flex justify-center items-center h-40">
          <Spinner size="lg" color="orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className={commonClasses.section}>
      <div className={commonClasses.infoBox}>
        <p className={commonClasses.infoText}>Add your notable projects here. Include details about technologies used and your role.</p>
      </div>

      <div className={commonClasses.projectSection}>
        {formData.map((project, index) => (
          <div key={index} className={commonClasses.projectCard}>
            <button
              type="button"
              onClick={() => removeProject(index)}
              className={commonClasses.removeButton}
            >
              <FiTrash2 className="h-5 w-5" />
            </button>

            <div className={commonClasses.grid}>
              <div className="col-span-2">
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Project Image</label>
                  <div className="flex items-start space-x-6 mt-2">
                    <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg hover:border-blue-500 transition-colors bg-gray-50 relative group">
                      {(project.image || (project.images && project.images.length > 0)) ? (
                        <img
                          src={project.image || project.images[0]}
                          alt={project.title || 'Project preview'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-gray-400">
                          <FiFileText className="w-10 h-10 mb-2" />
                          <p className="text-sm text-center">No image uploaded</p>
                          <p className="text-xs text-center mt-1">Click to upload</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500">Recommended: Square image of at least 400x400 pixels</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Project Title</label>
                  <input
                    type="text"
                    value={project.title || ''}
                    onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                    className={`${commonClasses.input} ${fieldErrors[`${index}-title`] ? commonClasses.errorInput : ''}`}
                    placeholder="Project name"
                  />
                  {fieldErrors[`${index}-title`] && (
                    <p className={commonClasses.errorText}>Project title is required</p>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Description</label>
                  <textarea
                    value={project.description || ''}
                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    rows="3"
                    className={`${commonClasses.input} ${fieldErrors[`${index}-description`] ? commonClasses.errorInput : ''}`}
                    placeholder="Describe your project"
                  />
                  {fieldErrors[`${index}-description`] && (
                    <p className={commonClasses.errorText}>Project description is required</p>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Technologies Used</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(project.technologies || []).map((tech, techIndex) => (
                        <span key={techIndex} className={commonClasses.techTag}>
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTechnology(index, techIndex)}
                            className={commonClasses.techTagRemove}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className={commonClasses.techInput}>
                      <input
                        type="text"
                        value={project.newTech || ''}
                        onChange={(e) => handleProjectChange(index, 'newTech', e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && project.newTech?.trim()) {
                            e.preventDefault();
                            handleAddTechnology(index, project.newTech);
                          }
                        }}
                        className={`${commonClasses.input} ${fieldErrors[`${index}-technologies`] ? commonClasses.errorInput : ''}`}
                        placeholder="Type a technology and press Enter"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTechnology(index, project.newTech)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {fieldErrors[`${index}-technologies`] && (
                      <p className={commonClasses.errorText}>At least one technology is required</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Project URL</label>
                  <input
                    type="url"
                    value={project.liveLink || ''}
                    onChange={(e) => handleProjectChange(index, 'liveLink', e.target.value)}
                    className={commonClasses.input}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Source Code URL</label>
                  <input
                    type="url"
                    value={project.sourceCode || ''}
                    onChange={(e) => handleProjectChange(index, 'sourceCode', e.target.value)}
                    className={commonClasses.input}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addProject}
          className={commonClasses.addButton}
        >
          <FiPlus className="w-4 h-4" />
          Add Another Project
        </button>
      </div>

      <button
        onClick={handleSave}
        className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-colors ${
          status === 'saving' 
            ? 'bg-gray-400 cursor-not-allowed' 
            : status === 'success' 
              ? 'bg-green-500' 
              : status === 'error' 
                ? 'bg-red-500' 
                : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={status === 'saving'}
      >
        {status === 'saving' 
          ? 'Saving...' 
          : status === 'success' 
            ? 'Saved Successfully!' 
            : status === 'error' 
              ? error || 'Please fix the errors above' 
              : 'Save Projects'}
      </button>
    </div>
  );
};

export default ProjectsForm; 