import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCalendar, FiMapPin, FiAward } from 'react-icons/fi';
import { format } from 'date-fns';

const EducationForm = ({ data, onUpdate }) => {
  const [education, setEducation] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
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
    addButton: "w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm font-medium"
  };

  useEffect(() => {
    if (data) {
      // Check if data is an array (direct education array) or has an education property
      if (Array.isArray(data)) {
        setEducation(data);
        // If there are education entries, set isEditing to true
        if (data.length > 0) {
          setIsEditing(true);
        }
      } else if (data.education) {
        setEducation(data.education);
        // If there are education entries, set isEditing to true
        if (data.education.length > 0) {
          setIsEditing(true);
        }
      } else {
        // If no education data is provided, initialize with empty array
        setEducation([]);
      }
    } else {
      // If no data is provided at all, initialize with empty array
      setEducation([]);
    }
  }, [data]);

  const handleAddEducation = () => {
    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: new Date(),
      endDate: new Date(),
      current: false,
      gpa: '',
      achievements: [],
      isVisible: true
    };
    
    const updatedEducation = [...education, newEducation];
    setEducation(updatedEducation);
    setCurrentIndex(education.length);
    setIsEditing(true);
    setFieldErrors({});
    
    // Update parent component with the new education array
    onUpdate(updatedEducation);
  };

  const handleEditEducation = (index) => {
    setCurrentIndex(index);
    setIsEditing(true);
    setFieldErrors({});
  };

  const handleDeleteEducation = (index) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
    onUpdate(updatedEducation);
    
    // If we're deleting the last education entry, reset editing state
    if (updatedEducation.length === 0) {
      setIsEditing(false);
      setCurrentIndex(null);
    }
  };

  const validateEducation = (edu, index) => {
    const errors = {};
    let isValid = true;

    if (!edu.institution?.trim()) {
      errors[`${index}-institution`] = 'Institution is required';
      isValid = false;
    }
    
    if (!edu.degree?.trim()) {
      errors[`${index}-degree`] = 'Degree is required';
      isValid = false;
    }
    
    if (!edu.field?.trim()) {
      errors[`${index}-field`] = 'Field of study is required';
      isValid = false;
    }
    
    if (!edu.startDate) {
      errors[`${index}-startDate`] = 'Start date is required';
      isValid = false;
    }
    
    if (!edu.current && !edu.endDate) {
      errors[`${index}-endDate`] = 'End date is required';
      isValid = false;
    }

    return { isValid, errors };
  };

  const handleSaveEducation = () => {
    // Validate all education entries
    let isValid = true;
    let allErrors = {};
    
    if (education.length === 0) {
      setError('Please add at least one education entry');
      setStatus('error');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 2000);
      return;
    }
    
    for (let i = 0; i < education.length; i++) {
      const { isValid: entryValid, errors } = validateEducation(education[i], i);
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
      // Don't set isEditing to false here
      // setIsEditing(false);
      // Update the parent component with the education data
      onUpdate(education);
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
      }, 2000);
    }, 1000);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentIndex(null);
  };

  const handleInputChange = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setEducation(updatedEducation);
    
    // Clear error for this field when user starts typing
    if (fieldErrors[`${index}-${field}`]) {
      setFieldErrors({
        ...fieldErrors,
        [`${index}-${field}`]: null
      });
    }
    
    // Update parent component with the updated education array
    onUpdate(updatedEducation);
  };

  const handleAchievementChange = (eduIndex, achievementIndex, value) => {
    const updatedEducation = [...education];
    updatedEducation[eduIndex].achievements[achievementIndex] = value;
    setEducation(updatedEducation);
    
    // Update parent component with the updated education array
    onUpdate(updatedEducation);
  };

  const handleAddAchievement = (eduIndex) => {
    const updatedEducation = [...education];
    updatedEducation[eduIndex].achievements.push('');
    setEducation(updatedEducation);
    
    // Update parent component with the updated education array
    onUpdate(updatedEducation);
  };

  const handleRemoveAchievement = (eduIndex, achievementIndex) => {
    const updatedEducation = [...education];
    updatedEducation[eduIndex].achievements.splice(achievementIndex, 1);
    setEducation(updatedEducation);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMMM yyyy');
  };

  return (
    <div className={commonClasses.section}>
      <div className={commonClasses.infoBox}>
        <p className={commonClasses.infoText}>Add your educational background to showcase your qualifications and academic achievements.</p>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-6">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiAward className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Education Added</h3>
          <p className="text-gray-500 mb-4">Add your educational background to showcase your qualifications</p>
          <button
            onClick={handleAddEducation}
            className={commonClasses.addButton}
          >
            <FiPlus className="w-4 h-4" />
            Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className={commonClasses.card}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Education Details</h3>
                  <button
                    onClick={() => handleDeleteEducation(index)}
                    className={commonClasses.iconButtonDanger}
                  >
                    <FiTrash2 />
                  </button>
                </div>
                
                <div className={commonClasses.grid}>
                  <div>
                    <label className={commonClasses.label}>Institution*</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleInputChange(index, 'institution', e.target.value)}
                      className={fieldErrors[`${index}-institution`] ? commonClasses.inputError : commonClasses.input}
                      placeholder="University Name"
                    />
                    {fieldErrors[`${index}-institution`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-institution`]}</p>
                    )}
                  </div>
                  <div>
                    <label className={commonClasses.label}>Degree*</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
                      className={fieldErrors[`${index}-degree`] ? commonClasses.inputError : commonClasses.input}
                      placeholder="Bachelor of Science"
                    />
                    {fieldErrors[`${index}-degree`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-degree`]}</p>
                    )}
                  </div>
                </div>

                <div className={commonClasses.grid}>
                  <div>
                    <label className={commonClasses.label}>Field of Study*</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => handleInputChange(index, 'field', e.target.value)}
                      className={fieldErrors[`${index}-field`] ? commonClasses.inputError : commonClasses.input}
                      placeholder="Computer Science"
                    />
                    {fieldErrors[`${index}-field`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-field`]}</p>
                    )}
                  </div>
                  <div>
                    <label className={commonClasses.label}>Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => handleInputChange(index, 'location', e.target.value)}
                        className={`${commonClasses.input} pl-10`}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                <div className={commonClasses.grid}>
                  <div>
                    <label className={commonClasses.label}>Start Date*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="month"
                        value={edu.startDate ? format(new Date(edu.startDate), 'yyyy-MM') : ''}
                        onChange={(e) => handleInputChange(index, 'startDate', new Date(e.target.value))}
                        className={`${fieldErrors[`${index}-startDate`] ? commonClasses.inputError : commonClasses.input} pl-10`}
                      />
                    </div>
                    {fieldErrors[`${index}-startDate`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-startDate`]}</p>
                    )}
                  </div>
                  <div>
                    <label className={commonClasses.label}>End Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="month"
                        value={edu.endDate ? format(new Date(edu.endDate), 'yyyy-MM') : ''}
                        onChange={(e) => handleInputChange(index, 'endDate', new Date(e.target.value))}
                        className={`${fieldErrors[`${index}-endDate`] ? commonClasses.inputError : commonClasses.input} pl-10`}
                        disabled={edu.current}
                      />
                    </div>
                    {fieldErrors[`${index}-endDate`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-endDate`]}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`current-${index}`}
                    checked={edu.current}
                    onChange={(e) => handleInputChange(index, 'current', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-700">
                    Currently Studying
                  </label>
                </div>

                <div>
                  <label className={commonClasses.label}>GPA</label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => handleInputChange(index, 'gpa', e.target.value)}
                    className={commonClasses.input}
                    placeholder="3.8/4.0"
                  />
                </div>

                <div>
                  <label className={commonClasses.label}>Achievements</label>
                  <div className="space-y-2">
                    {edu.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => handleAchievementChange(index, achievementIndex, e.target.value)}
                          className={`${commonClasses.input} flex-1`}
                          placeholder="Dean's List, Academic Scholarship, etc."
                        />
                        <button
                          onClick={() => handleRemoveAchievement(index, achievementIndex)}
                          className={commonClasses.iconButtonDanger}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddAchievement(index)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FiPlus className="mr-1" />
                      Add Achievement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddEducation}
            className={commonClasses.addButton}
          >
            <FiPlus className="w-4 h-4" />
            Add Education
          </button>
        </div>
      )}

      <button
        onClick={handleSaveEducation}
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
              : 'Save Education'}
      </button>
    </div>
  );
};

export default EducationForm; 