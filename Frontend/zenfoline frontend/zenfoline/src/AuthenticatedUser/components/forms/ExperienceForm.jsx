import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import useAuthStore from '../../../store/userAuthStore';
import axios from 'axios';

const ExperienceForm = ({ data, onUpdate }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState([]);
  const userId = useAuthStore((state) => state.userId);
  const isInitialMount = useRef(true);

  // Load data from database only on initial mount
  useEffect(() => {
    const fetchExperienceInfo = async () => {
      if (!userId || !isInitialMount.current) return;
      
      try {
        const response = await axios.get(`http://localhost:3000/portfolio-save/experience/${userId}`);
        if (response.data && response.data.data) {
          // Format the dates to YYYY-MM-DD format for the date inputs
          const formattedData = response.data.data.map(exp => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
            isCurrentPosition: exp.current || false
          }));
          
          setFormData(formattedData);
          onUpdate(formattedData);
        }
      } catch (error) {
        console.error('Error fetching experience info:', error);
        setError('Failed to load data');
      }
    };

    fetchExperienceInfo();
    isInitialMount.current = false;
  }, [userId]);

  const commonClasses = {
    section: "max-w-3xl mx-auto space-y-8",
    infoBox: "bg-blue-50 p-4 rounded-lg mb-8",
    infoText: "text-blue-700 text-sm",
    experienceSection: "space-y-6",
    sectionTitle: "text-xl font-medium text-gray-900",
    experienceCard: "bg-white rounded-lg mb-4 p-6 relative border border-gray-200",
    grid: "grid grid-cols-2 gap-6",
    inputGroup: "space-y-2",
    label: "block text-sm font-medium text-gray-600",
    input: "w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    removeButton: "absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors",
    addButton: "w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm font-medium",
    achievementSection: "mt-6 space-y-4",
    achievementHeader: "flex items-center justify-between",
    achievementAddButton: "inline-flex items-center px-3 py-1.5 text-sm text-green-600 bg-green-50 rounded-md hover:bg-green-100",
    errorText: "text-red-500 text-xs mt-1",
    errorInput: "border-red-300 focus:ring-red-500 focus:border-red-500",
    checkbox: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",
    checkboxLabel: "ml-2 block text-sm text-gray-600"
  };

  const handleExperienceChange = (index, field, value) => {
    const newData = [...formData];
    newData[index] = {
      ...newData[index],
      [field]: value
    };

    // Clear error for this field
    setFieldErrors(prev => ({
      ...prev,
      [`${index}-${field}`]: false
    }));

    setFormData(newData);
    onUpdate(newData);
  };

  const handleAchievementChange = (expIndex, achievementIndex, value) => {
    const newData = [...formData];
    if (!newData[expIndex].achievements) {
      newData[expIndex].achievements = [];
    }
    newData[expIndex].achievements[achievementIndex] = value;

    // Clear error for this achievement
    setFieldErrors(prev => ({
      ...prev,
      [`${expIndex}-achievement-${achievementIndex}`]: false
    }));

    setFormData(newData);
    onUpdate(newData);
  };

  const addExperience = () => {
    const newData = [
      ...formData,
      {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentPosition: false,
        description: '',
        achievements: [],
        isVisible: true
      }
    ];
    setFormData(newData);
    onUpdate(newData);
  };

  const removeExperience = (index) => {
    const newData = [...formData];
    newData.splice(index, 1);
    
    // Clear errors for this experience
    const newErrors = { ...fieldErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`${index}-`)) {
        delete newErrors[key];
      }
    });
    setFieldErrors(newErrors);
    
    setFormData(newData);
    onUpdate(newData);
  };

  const addAchievement = (index) => {
    const newData = [...formData];
    if (!newData[index].achievements) {
      newData[index].achievements = [];
    }
    newData[index].achievements.push('');
    setFormData(newData);
    onUpdate(newData);
  };

  const removeAchievement = (expIndex, achievementIndex) => {
    const newData = [...formData];
    newData[expIndex].achievements.splice(achievementIndex, 1);
    
    // Clear error for this achievement
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${expIndex}-achievement-${achievementIndex}`];
      return newErrors;
    });
    
    setFormData(newData);
    onUpdate(newData);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.length) {
      setError('Please fill all the fields');
      isValid = false;
      return isValid;
    }

    formData.forEach((exp, index) => {
      if (!exp.title?.trim()) {
        newErrors[`${index}-title`] = true;
        isValid = false;
      }
      if (!exp.company?.trim()) {
        newErrors[`${index}-company`] = true;
        isValid = false;
      }
      if (!exp.location?.trim()) {
        newErrors[`${index}-location`] = true;
        isValid = false;
      }
      if (!exp.startDate) {
        newErrors[`${index}-startDate`] = true;
        isValid = false;
      }
      if (!exp.isCurrentPosition && !exp.endDate) {
        newErrors[`${index}-endDate`] = true;
        isValid = false;
      }
      if (!exp.description?.trim()) {
        newErrors[`${index}-description`] = true;
        isValid = false;
      }

      exp.achievements?.forEach((achievement, achievementIndex) => {
        if (!achievement.trim()) {
          newErrors[`${index}-achievement-${achievementIndex}`] = true;
          isValid = false;
        }
      });
    });

    if (!isValid) {
      setError('Please fill all the fields');
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
          setError('');
        }, 3000);
        return;
      }

      setStatus('saving');
      
      // Prepare data for API, removing endDate if isCurrentPosition is true
      const apiData = formData.map(exp => {
        const experienceData = {
          title: exp.title,
          company: exp.company,
          location: exp.location,
          startDate: exp.startDate,
          current: exp.isCurrentPosition,
          description: exp.description,
          achievements: exp.achievements || [],
          isVisible: exp.isVisible !== undefined ? exp.isVisible : true
        };
        
        // Only include endDate if not current position
        if (!exp.isCurrentPosition) {
          experienceData.endDate = exp.endDate;
        }
        
        return experienceData;
      });
      
      const response = await axios.post(
        `http://localhost:3000/portfolio-save/experience/${userId}`,
        { experience: apiData }
      );

      if (response.data) {
        setStatus('success');
        setTimeout(() => {
          setStatus(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving experience info:', error);
      setStatus('error');
      setError('Failed to save');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 2000);
    }
  };

  return (
    <div className={commonClasses.section}>
      <div className={commonClasses.infoBox}>
        <p className={commonClasses.infoText}>Add your work experience, including current and previous positions.</p>
      </div>

      <div className={commonClasses.experienceSection}>
        {formData.map((experience, index) => (
          <div key={index} className={commonClasses.experienceCard}>
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className={commonClasses.removeButton}
            >
              <FiTrash2 className="h-5 w-5" />
            </button>

            <div className={commonClasses.grid}>
              <div className="col-span-2">
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Job Title</label>
                  <input
                    type="text"
                    value={experience.title || ''}
                    onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                    className={`${commonClasses.input} ${fieldErrors[`${index}-title`] ? commonClasses.errorInput : ''}`}
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {fieldErrors[`${index}-title`] && (
                    <p className={commonClasses.errorText}>Job title is required</p>
                  )}
                </div>
              </div>

              <div>
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Company</label>
                  <input
                    type="text"
                    value={experience.company || ''}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    className={`${commonClasses.input} ${fieldErrors[`${index}-company`] ? commonClasses.errorInput : ''}`}
                    placeholder="Company name"
                  />
                  {fieldErrors[`${index}-company`] && (
                    <p className={commonClasses.errorText}>Company name is required</p>
                  )}
                </div>
              </div>

              <div>
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Location</label>
                  <input
                    type="text"
                    value={experience.location || ''}
                    onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                    className={`${commonClasses.input} ${fieldErrors[`${index}-location`] ? commonClasses.errorInput : ''}`}
                    placeholder="City, Country"
                  />
                  {fieldErrors[`${index}-location`] && (
                    <p className={commonClasses.errorText}>Location is required</p>
                  )}
                </div>
              </div>

              <div>
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Start Date</label>
                  <input
                    type="date"
                    value={experience.startDate || ''}
                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                    className={`${commonClasses.input} ${fieldErrors[`${index}-startDate`] ? commonClasses.errorInput : ''}`}
                  />
                  {fieldErrors[`${index}-startDate`] && (
                    <p className={commonClasses.errorText}>Start date is required</p>
                  )}
                </div>
              </div>

              <div>
                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>End Date</label>
                  <input
                    type="date"
                    value={experience.endDate || ''}
                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    disabled={experience.isCurrentPosition}
                    className={`${commonClasses.input} ${fieldErrors[`${index}-endDate`] ? commonClasses.errorInput : ''}`}
                  />
                  {fieldErrors[`${index}-endDate`] && !experience.isCurrentPosition && (
                    <p className={commonClasses.errorText}>End date is required</p>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={experience.isCurrentPosition || false}
                    onChange={(e) => handleExperienceChange(index, 'isCurrentPosition', e.target.checked)}
                    className={commonClasses.checkbox}
                  />
                  <label className={commonClasses.checkboxLabel}>
                    I currently work here
                  </label>
                </div>

                <div className={commonClasses.inputGroup}>
                  <label className={commonClasses.label}>Description</label>
                  <textarea
                    value={experience.description || ''}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    rows={3}
                    className={`${commonClasses.input} ${fieldErrors[`${index}-description`] ? commonClasses.errorInput : ''}`}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                  {fieldErrors[`${index}-description`] && (
                    <p className={commonClasses.errorText}>Description is required</p>
                  )}
                </div>
              </div>
            </div>

            <div className={commonClasses.achievementSection}>
              <div className={commonClasses.achievementHeader}>
                <label className={commonClasses.label}>Key Achievements</label>
                <button
                  type="button"
                  onClick={() => addAchievement(index)}
                  className={commonClasses.achievementAddButton}
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Achievement
                </button>
              </div>

              <div className="space-y-3">
                {(experience.achievements || []).map((achievement, achievementIndex) => (
                  <div key={achievementIndex} className="flex items-start space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, achievementIndex, e.target.value)}
                        className={`${commonClasses.input} ${
                          fieldErrors[`${index}-achievement-${achievementIndex}`] ? commonClasses.errorInput : ''
                        }`}
                        placeholder="Enter achievement..."
                      />
                      {fieldErrors[`${index}-achievement-${achievementIndex}`] && (
                        <p className={commonClasses.errorText}>Achievement cannot be empty</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAchievement(index, achievementIndex)}
                      className={commonClasses.removeButton}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addExperience}
          className={commonClasses.addButton}
        >
          <FiPlus className="w-4 h-4" />
          Add Experience
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
              ? error || 'Please fill all the fields' 
              : 'Save Experience'}
      </button>
    </div>
  );
};

export default ExperienceForm; 