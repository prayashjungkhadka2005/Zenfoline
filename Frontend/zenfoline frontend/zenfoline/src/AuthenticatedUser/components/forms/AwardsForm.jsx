import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCalendar, FiImage, FiAward, FiCheck, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

const AwardsForm = ({ data, onUpdate }) => {
  const [awards, setAwards] = useState([]);
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
      // Check if data is an array (direct awards array) or has an awards property
      if (Array.isArray(data)) {
        setAwards(data);
      } else if (data.awards) {
        setAwards(data.awards);
      } else {
        // If no awards data is provided, initialize with empty array
        setAwards([]);
      }
    } else {
      // If no data is provided at all, initialize with empty array
      setAwards([]);
    }
  }, [data]);

  const handleAddAward = () => {
    const newAward = {
      title: '',
      issuer: '',
      date: new Date(),
      description: '',
      image: '',
      isVisible: true
    };
    
    const updatedAwards = [...awards, newAward];
    setAwards(updatedAwards);
    setFieldErrors({});
    
    // Update parent component with the new awards array
    onUpdate(updatedAwards);
  };

  const handleDeleteAward = (index) => {
    const updatedAwards = [...awards];
    updatedAwards.splice(index, 1);
    setAwards(updatedAwards);
    onUpdate(updatedAwards);
  };

  const validateAward = (award, index) => {
    const errors = {};
    let isValid = true;

    if (!award.title?.trim()) {
      errors[`${index}-title`] = 'Title is required';
      isValid = false;
    }
    
    if (!award.issuer?.trim()) {
      errors[`${index}-issuer`] = 'Issuer is required';
      isValid = false;
    }
    
    if (!award.date) {
      errors[`${index}-date`] = 'Date is required';
      isValid = false;
    }

    return { isValid, errors };
  };

  const handleSaveAwards = () => {
    // Validate all award entries
    let isValid = true;
    let allErrors = {};
    
    if (awards.length === 0) {
      setError('Please add at least one award');
      setStatus('error');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 2000);
      return;
    }
    
    for (let i = 0; i < awards.length; i++) {
      const { isValid: entryValid, errors } = validateAward(awards[i], i);
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
      // Update the parent component with the awards data
      onUpdate(awards);
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
      }, 2000);
    }, 1000);
  };

  const handleInputChange = (index, field, value) => {
    const updatedAwards = [...awards];
    updatedAwards[index] = {
      ...updatedAwards[index],
      [field]: value
    };
    setAwards(updatedAwards);
    
    // Clear error for this field when user starts typing
    if (fieldErrors[`${index}-${field}`]) {
      setFieldErrors({
        ...fieldErrors,
        [`${index}-${field}`]: null
      });
    }
    
    // Update parent component with the updated awards array
    onUpdate(updatedAwards);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMMM yyyy');
  };

  return (
    <div className={commonClasses.section}>
      <div className={commonClasses.infoBox}>
        <p className={commonClasses.infoText}>Add your awards and achievements to showcase your recognition and accomplishments.</p>
      </div>

      {awards.length === 0 ? (
        <div className="text-center py-6">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiAward className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Awards Added</h3>
          <p className="text-gray-500 mb-4">Add your awards to showcase your recognition and accomplishments</p>
          <button
            onClick={handleAddAward}
            className={commonClasses.addButton}
          >
            <FiPlus className="w-4 h-4" />
            Add Award
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {awards.map((award, index) => (
            <div key={index} className={commonClasses.card}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Award Details</h3>
                  <button
                    onClick={() => handleDeleteAward(index)}
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
                      value={award.title}
                      onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                      className={fieldErrors[`${index}-title`] ? commonClasses.inputError : commonClasses.input}
                      placeholder="Award Title"
                    />
                    {fieldErrors[`${index}-title`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-title`]}</p>
                    )}
                  </div>
                  <div>
                    <label className={commonClasses.label}>Issuer*</label>
                    <input
                      type="text"
                      value={award.issuer}
                      onChange={(e) => handleInputChange(index, 'issuer', e.target.value)}
                      className={fieldErrors[`${index}-issuer`] ? commonClasses.inputError : commonClasses.input}
                      placeholder="Issuing Organization"
                    />
                    {fieldErrors[`${index}-issuer`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-issuer`]}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={commonClasses.label}>Date*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="month"
                      value={award.date ? format(new Date(award.date), 'yyyy-MM') : ''}
                      onChange={(e) => handleInputChange(index, 'date', new Date(e.target.value))}
                      className={`${fieldErrors[`${index}-date`] ? commonClasses.inputError : commonClasses.input} pl-10`}
                    />
                  </div>
                  {fieldErrors[`${index}-date`] && (
                    <p className={commonClasses.errorText}>{fieldErrors[`${index}-date`]}</p>
                  )}
                </div>

                <div>
                  <label className={commonClasses.label}>Image URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiImage className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={award.image}
                      onChange={(e) => handleInputChange(index, 'image', e.target.value)}
                      className={`${commonClasses.input} pl-10`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className={commonClasses.label}>Description</label>
                  <textarea
                    value={award.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    className={commonClasses.textarea}
                    placeholder="Brief description of the award"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddAward}
            className={commonClasses.addButton}
          >
            <FiPlus className="w-4 h-4" />
            Add Award
          </button>
        </div>
      )}

      <button
        onClick={handleSaveAwards}
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
              : 'Save Awards'}
      </button>
    </div>
  );
};

export default AwardsForm; 