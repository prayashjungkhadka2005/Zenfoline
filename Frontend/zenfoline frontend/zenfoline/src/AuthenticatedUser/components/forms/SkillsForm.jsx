import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import useAuthStore from '../../../store/userAuthStore';
import axios from 'axios';
import Spinner from '../../../components/Spinner';

const SkillsForm = ({ data, onUpdate }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ technical: {}, soft: {} });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    technical: [],
    soft: []
  });
  const userId = useAuthStore((state) => state.userId);
  const isInitialMount = useRef(true);

  // Load data from database only on initial mount
  useEffect(() => {
    const fetchSkillsInfo = async () => {
      if (!userId || !isInitialMount.current) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/portfolio-save/skills/${userId}`);
        if (response.data && response.data.data) {
          // Transform the data to match our form structure
          const transformedData = {
            technical: [],
            soft: []
          };
          
          response.data.data.forEach(skill => {
            if (skill.category === "Technical") {
              transformedData.technical.push({
                name: skill.name,
                level: skill.proficiency,
                isVisible: skill.isVisible
              });
            } else if (skill.category === "Soft") {
              transformedData.soft.push({
                name: skill.name,
                level: skill.proficiency,
                isVisible: skill.isVisible
              });
            }
          });
          
          setFormData(transformedData);
          onUpdate(transformedData);
        }
      } catch (error) {
        console.error('Error fetching skills info:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsInfo();
    isInitialMount.current = false;
  }, [userId]);

  const commonClasses = {
    section: "max-w-3xl mx-auto space-y-8",
    infoBox: "bg-blue-50 p-4 rounded-lg",
    infoText: "text-blue-700 text-sm",
    skillSection: "space-y-6",
    sectionTitle: "text-xl font-medium text-gray-900",
    skillContainer: "space-y-4",
    skillCard: "relative",
    skillGrid: "grid grid-cols-[1fr,1fr,40px] gap-6 items-start",
    inputGroup: "space-y-2",
    label: "block text-sm text-gray-600",
    input: "w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    select: "w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer",
    removeButton: "mt-8 text-red-400 hover:text-red-600 transition-colors",
    addButton: "w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm font-medium",
    errorText: "text-red-500 text-xs mt-1",
    errorInput: "border-red-300 focus:ring-red-500 focus:border-red-500",
    loadingPlaceholder: "h-16 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200"
  };

  const handleSkillChange = (type, index, field, value) => {
    const newData = { ...formData };
    if (!newData[type]) {
      newData[type] = [];
    }
    if (!newData[type][index]) {
      newData[type][index] = {};
    }
    newData[type][index] = {
      ...newData[type][index],
      [field]: value
    };

    // Clear error for this field when user types
    setFieldErrors(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [index]: false
      }
    }));

    setFormData(newData);
    onUpdate(newData);
  };

  const addSkill = (type) => {
    const newData = { ...formData };
    if (!newData[type]) {
      newData[type] = [];
    }
    newData[type] = [...newData[type], { name: '', level: 'Beginner' }];
    setFormData(newData);
    onUpdate(newData);
  };

  const removeSkill = (type, index) => {
    const newData = { ...formData };
    newData[type] = newData[type].filter((_, i) => i !== index);
    
    // Remove error for this index
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[type][index];
      return newErrors;
    });

    setFormData(newData);
    onUpdate(newData);
  };

  const validateForm = () => {
    let isValid = true;
    const newFieldErrors = { technical: {}, soft: {} };

    // Check if both sections have at least one skill
    if (!formData.technical?.length) {
      setError('Please add at least one technical skill');
      isValid = false;
    }
    
    if (!formData.soft?.length) {
      setError('Please add at least one soft skill');
      isValid = false;
    }

    // Check for empty skill names in technical skills
    formData.technical?.forEach((skill, index) => {
      if (!skill.name?.trim()) {
        newFieldErrors.technical[index] = true;
        isValid = false;
        setError('Please fill in all skill names');
      }
    });

    // Check for empty skill names in soft skills
    formData.soft?.forEach((skill, index) => {
      if (!skill.name?.trim()) {
        newFieldErrors.soft[index] = true;
        isValid = false;
        setError('Please fill in all skill names');
      }
    });

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSave = async () => {
    try {
      setError('');
      setFieldErrors({ technical: {}, soft: {} });

      if (!validateForm()) {
        setStatus('error');
        setTimeout(() => {
          setStatus(null);
          // Don't clear the specific error message here
        }, 3000);
        return;
      }

      setStatus('saving');
      
      // Transform the data to match the API expected format
      const apiData = {
        skills: [
          ...(formData.technical || []).map(skill => ({
            name: skill.name,
            category: "Technical",
            proficiency: skill.level,
            isVisible: skill.isVisible !== undefined ? skill.isVisible : true
          })),
          ...(formData.soft || []).map(skill => ({
            name: skill.name,
            category: "Soft",
            proficiency: skill.level,
            isVisible: skill.isVisible !== undefined ? skill.isVisible : true
          }))
        ]
      };
      
      const response = await axios.post(
        `http://localhost:3000/portfolio-save/skills/${userId}`,
        apiData
      );

      if (response.data) {
        setStatus('success');
        setTimeout(() => {
          setStatus(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving skills info:', error);
      setStatus('error');
      setError('Failed to save');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 2000);
    }
  };

  const renderSkillSection = (type, title, placeholder) => (
    <div className={commonClasses.skillSection}>
      <h3 className={commonClasses.sectionTitle}>{title}</h3>
      <div className={commonClasses.skillContainer}>
        {(formData[type] || []).map((skill, index) => (
          <div key={index} className={commonClasses.skillCard}>
            <div className={commonClasses.skillGrid}>
              <div className={commonClasses.inputGroup}>
                <label className={commonClasses.label}>Skill Name</label>
                <input
                  type="text"
                  value={skill.name || ''}
                  onChange={(e) => handleSkillChange(type, index, 'name', e.target.value)}
                  className={`${commonClasses.input} ${fieldErrors[type][index] ? commonClasses.errorInput : ''}`}
                  placeholder={placeholder}
                />
                {fieldErrors[type][index] && (
                  <p className={commonClasses.errorText}>Skill name is required</p>
                )}
              </div>
              <div className={commonClasses.inputGroup}>
                <label className={commonClasses.label}>Proficiency Level</label>
                <div className="relative">
                  <select
                    value={skill.level || 'Beginner'}
                    onChange={(e) => handleSkillChange(type, index, 'level', e.target.value)}
                    className={commonClasses.select}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeSkill(type, index)}
                className={commonClasses.removeButton}
                title="Remove skill"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => addSkill(type)}
          className={commonClasses.addButton}
        >
          <FiPlus className="w-4 h-4" />
          Add {type === 'technical' ? 'Technical Skills' : 'Soft Skills'}
        </button>
      </div>
    </div>
  );

  const renderLoadingSection = (title) => (
    <div className={commonClasses.skillSection}>
      <h3 className={commonClasses.sectionTitle}>{title}</h3>
      <div className={commonClasses.skillContainer}>
        <div className={commonClasses.loadingPlaceholder}>
          <Spinner size="sm" color="orange-500" />
        </div>
        <button
          disabled
          className={`${commonClasses.addButton} bg-gray-100 cursor-not-allowed text-gray-400`}
        >
          <FiPlus className="w-4 h-4" />
          Loading...
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={commonClasses.section}>
        <div className={commonClasses.infoBox}>
          <p className={commonClasses.infoText}>List your technical and soft skills with proficiency levels.</p>
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
        <p className={commonClasses.infoText}>List your technical and soft skills with proficiency levels.</p>
      </div>

      {renderSkillSection('technical', 'Technical Skills', 'Skill name (e.g., JavaScript)')}
      {renderSkillSection('soft', 'Soft Skills', 'Skill name (e.g., Leadership)')}

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
              ? error || 'Error occurred' 
              : 'Save Skills'}
      </button>
    </div>
  );
};

export default SkillsForm; 