import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCalendar, FiLink, FiImage, FiFileText } from 'react-icons/fi';
import { format } from 'date-fns';

const PublicationsForm = ({ data, onUpdate }) => {
  const [publications, setPublications] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Common classes for consistent styling
  const commonClasses = {
    section: "space-y-4",
    infoBox: "bg-blue-50 p-4 rounded-lg",
    infoText: "text-blue-700 text-sm",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
    label: "block text-sm font-medium text-gray-700 mb-1",
    input: "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    inputError: "w-full px-3 py-2 border border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500",
    errorText: "text-red-500 text-xs mt-1",
    button: "w-full px-4 py-2 rounded-md text-white",
    buttonPrimary: "bg-blue-500 hover:bg-blue-600",
    buttonSuccess: "bg-green-500",
    buttonError: "bg-red-500",
    buttonDisabled: "bg-gray-400 cursor-not-allowed",
    card: "border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors",
    iconButton: "p-2 text-gray-500 hover:text-gray-700",
    iconButtonDanger: "p-2 text-red-500 hover:text-red-700",
    addButton: "w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm font-medium",
    textarea: "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
  };

  useEffect(() => {
    if (data) {
      // Check if data is an array (direct publications array) or has a publications property
      if (Array.isArray(data)) {
        setPublications(data);
      } else if (data.publications) {
        setPublications(data.publications);
      } else {
        // If no publications data is provided, initialize with empty array
        setPublications([]);
      }
    } else {
      // If no data is provided at all, initialize with empty array
      setPublications([]);
    }
  }, [data]);

  const handleAddPublication = () => {
    const newPublication = {
      title: '',
      publisher: '',
      publicationDate: new Date(),
      description: '',
      url: '',
      image: '',
      isVisible: true
    };
    
    const updatedPublications = [...publications, newPublication];
    setPublications(updatedPublications);
    setFieldErrors({});
    
    // Update parent component with the new publications array
    onUpdate(updatedPublications);
  };

  const handleDeletePublication = (index) => {
    const updatedPublications = [...publications];
    updatedPublications.splice(index, 1);
    setPublications(updatedPublications);
    onUpdate(updatedPublications);
  };

  const validatePublication = (pub, index) => {
    const errors = {};
    let isValid = true;

    if (!pub.title?.trim()) {
      errors[`${index}-title`] = 'Title is required';
      isValid = false;
    }
    
    if (!pub.publisher?.trim()) {
      errors[`${index}-publisher`] = 'Publisher is required';
      isValid = false;
    }
    
    if (!pub.publicationDate) {
      errors[`${index}-publicationDate`] = 'Publication date is required';
      isValid = false;
    }

    return { isValid, errors };
  };

  const handleSavePublications = () => {
    // Validate all publication entries
    let isValid = true;
    let allErrors = {};
    
    if (publications.length === 0) {
      setError('Please add at least one publication');
      setStatus('error');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 2000);
      return;
    }
    
    for (let i = 0; i < publications.length; i++) {
      const { isValid: entryValid, errors } = validatePublication(publications[i], i);
      if (!entryValid) {
        isValid = false;
        allErrors = { ...allErrors, ...errors };
      }
    }
    
    if (!isValid) {
      setFieldErrors(allErrors);
      setStatus('error');
      setError('Please fill in all required fields');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 2000);
      return;
    }

    setStatus('saving');
    // Simulate API call
    setTimeout(() => {
      // Update the parent component with the publications data
      onUpdate(publications);
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
      }, 2000);
    }, 1000);
  };

  const handleInputChange = (index, field, value) => {
    const updatedPublications = [...publications];
    updatedPublications[index] = {
      ...updatedPublications[index],
      [field]: value
    };
    setPublications(updatedPublications);
    
    // Clear error for this field when user starts typing
    if (fieldErrors[`${index}-${field}`]) {
      setFieldErrors({
        ...fieldErrors,
        [`${index}-${field}`]: null
      });
    }
    
    // Update parent component with the updated publications array
    onUpdate(updatedPublications);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMMM yyyy');
  };

  return (
    <div className={commonClasses.section}>
      <div className={commonClasses.infoBox}>
        <p className={commonClasses.infoText}>Add your publications to showcase your research, articles, or books.</p>
      </div>

      {publications.length === 0 ? (
        <div className="text-center py-6">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiFileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Publications Added</h3>
          <p className="text-gray-500 mb-4">Add your publications to showcase your research and writing</p>
          <button
            onClick={handleAddPublication}
            className={commonClasses.addButton}
          >
            <FiPlus className="w-4 h-4" />
            Add Publication
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {publications.map((pub, index) => (
            <div key={index} className={commonClasses.card}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Publication Details</h3>
                  <button
                    onClick={() => handleDeletePublication(index)}
                    className={commonClasses.iconButtonDanger}
                  >
                    <FiTrash2 />
                  </button>
                </div>
                
                <div className={commonClasses.grid}>
                  <div>
                    <label className={commonClasses.label}>Title*</label>
                    <input
                      type="text"
                      value={pub.title}
                      onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                      className={fieldErrors[`${index}-title`] ? commonClasses.inputError : commonClasses.input}
                      placeholder="Publication Title"
                    />
                    {fieldErrors[`${index}-title`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-title`]}</p>
                    )}
                  </div>
                  <div>
                    <label className={commonClasses.label}>Publisher*</label>
                    <input
                      type="text"
                      value={pub.publisher}
                      onChange={(e) => handleInputChange(index, 'publisher', e.target.value)}
                      className={fieldErrors[`${index}-publisher`] ? commonClasses.inputError : commonClasses.input}
                      placeholder="Publisher Name"
                    />
                    {fieldErrors[`${index}-publisher`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-publisher`]}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={commonClasses.label}>Publication Date*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="month"
                      value={pub.publicationDate ? format(new Date(pub.publicationDate), 'yyyy-MM') : ''}
                      onChange={(e) => handleInputChange(index, 'publicationDate', new Date(e.target.value))}
                      className={`${fieldErrors[`${index}-publicationDate`] ? commonClasses.inputError : commonClasses.input} pl-10`}
                    />
                  </div>
                  {fieldErrors[`${index}-publicationDate`] && (
                    <p className={commonClasses.errorText}>{fieldErrors[`${index}-publicationDate`]}</p>
                  )}
                </div>

                <div>
                  <label className={commonClasses.label}>Description</label>
                  <textarea
                    value={pub.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    className={commonClasses.textarea}
                    placeholder="Brief description of the publication"
                  />
                </div>

                <div>
                  <label className={commonClasses.label}>URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLink className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={pub.url}
                      onChange={(e) => handleInputChange(index, 'url', e.target.value)}
                      className={`${commonClasses.input} pl-10`}
                      placeholder="https://example.com/publication"
                    />
                  </div>
                </div>

                <div>
                  <label className={commonClasses.label}>Image URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiImage className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={pub.image}
                      onChange={(e) => handleInputChange(index, 'image', e.target.value)}
                      className={`${commonClasses.input} pl-10`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddPublication}
            className={commonClasses.addButton}
          >
            <FiPlus className="w-4 h-4" />
            Add Publication
          </button>
        </div>
      )}

      <button
        onClick={handleSavePublications}
        className={`w-full px-4 py-2 rounded-md text-white ${
          status === 'saving' 
            ? commonClasses.buttonDisabled
            : status === 'success' 
              ? commonClasses.buttonSuccess
              : status === 'error' 
                ? commonClasses.buttonError
                : commonClasses.buttonPrimary
        }`}
        disabled={status === 'saving'}
      >
        {status === 'saving' 
          ? 'Saving...' 
          : status === 'success' 
            ? 'Saved!' 
            : status === 'error' 
              ? error || 'Error'
              : 'Save Publications'}
      </button>
    </div>
  );
};

export default PublicationsForm; 