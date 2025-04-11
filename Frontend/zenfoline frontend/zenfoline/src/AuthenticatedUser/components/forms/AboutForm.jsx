import React, { useState, useEffect, useRef } from 'react';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import useAuthStore from '../../../store/userAuthStore';
import axios from 'axios';
import Spinner from '../../../components/Spinner';

const AboutForm = ({ data, onUpdate }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    vision: '',
    highlights: []
  });
  const userId = useAuthStore((state) => state.userId);
  const isInitialMount = useRef(true);

  // Load data from database only on initial mount
  useEffect(() => {
    const fetchAboutInfo = async () => {
      if (!userId || !isInitialMount.current) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/portfolio-save/about/${userId}`);
        if (response.data && response.data.data) {
          setFormData(response.data.data);
          onUpdate(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching about info:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
    isInitialMount.current = false;
  }, [userId]);

  const commonClasses = {
    section: "space-y-6",
    infoBox: "bg-blue-50 p-4 rounded-lg",
    infoText: "text-blue-700 text-sm",
    grid: "grid grid-cols-2 gap-6",
    label: "block text-sm font-medium text-gray-700 mb-1",
    input: "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    addButton: "mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center",
    removeButton: "p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
  };

  const handleDescriptionChange = (e) => {
    const newData = {
      ...formData,
      description: e.target.value
    };
    setFormData(newData);
    onUpdate(newData);
  };

  const handleVisionChange = (e) => {
    const newData = {
      ...formData,
      vision: e.target.value
    };
    setFormData(newData);
    onUpdate(newData);
  };

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...(formData.highlights || [])];
    newHighlights[index] = {
      ...newHighlights[index],
      [field]: value
    };
    const newData = {
      ...formData,
      highlights: newHighlights
    };
    setFormData(newData);
    onUpdate(newData);
  };

  const addHighlight = () => {
    const newHighlights = [...(formData.highlights || []), { text: '', isVisible: true }];
    const newData = {
      ...formData,
      highlights: newHighlights
    };
    setFormData(newData);
    onUpdate(newData);
  };

  const removeHighlight = (index) => {
    const newHighlights = [...(formData.highlights || [])];
    newHighlights.splice(index, 1);
    const newData = {
      ...formData,
      highlights: newHighlights
    };
    setFormData(newData);
    onUpdate(newData);
  };

  const validateForm = () => {
    if (!formData.description?.trim()) {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    try {
      setError('');
      if (!validateForm()) {
        setStatus('error');
        setError('Please fill all the fields');
        setTimeout(() => {
          setStatus(null);
          setError('');
        }, 3000);
        return;
      }

      setStatus('saving');
      
      const response = await axios.post(
        `http://localhost:3000/portfolio-save/about/${userId}`,
        formData
      );

      if (response.data) {
        setStatus('success');
        setTimeout(() => {
          setStatus(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving about info:', error);
      setStatus('error');
      setError('Failed to save');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className={commonClasses.section}>
        <div className={commonClasses.infoBox}>
          <p className={commonClasses.infoText}>Tell your story. Share your professional journey and what drives you.</p>
        </div>

        <div className={commonClasses.grid}>
          <div className="col-span-2">
            <label className={commonClasses.label}>About Me *</label>
            <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
              <Spinner size="sm" color="orange-500" />
            </div>
          </div>

          <div className="col-span-2">
            <label className={commonClasses.label}>Vision</label>
            <div className="h-24 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
              <Spinner size="sm" color="orange-500" />
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-between mb-3">
              <label className={commonClasses.label}>Key Highlights</label>
              <button
                disabled
                className="px-3 py-1 bg-gray-100 text-gray-400 rounded-md flex items-center text-sm cursor-not-allowed"
              >
                <FiPlus className="mr-1" />
                Add Highlight
              </button>
            </div>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="h-20 flex items-center justify-center">
                <Spinner size="sm" color="orange-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            disabled
            className="w-full px-4 py-2 rounded-md text-white bg-gray-400 cursor-not-allowed"
          >
            Loading...
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={commonClasses.section}>
      <div className={commonClasses.infoBox}>
        <p className={commonClasses.infoText}>Tell your story. Share your professional journey and what drives you.</p>
      </div>

      <div className={commonClasses.grid}>
        <div className="col-span-2">
          <label className={commonClasses.label}>About Me *</label>
          <textarea
            value={formData.description || ''}
            onChange={handleDescriptionChange}
            rows="6"
            className={commonClasses.input}
            placeholder="Share your professional journey, passion, and expertise..."
            required
          />
        </div>

        <div className="col-span-2">
          <label className={commonClasses.label}>Vision</label>
          <textarea
            value={formData.vision || ''}
            onChange={handleVisionChange}
            rows="4"
            className={commonClasses.input}
            placeholder="Share your vision and goals..."
          />
        </div>

        <div className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <label className={commonClasses.label}>Key Highlights</label>
            <button
              onClick={addHighlight}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center text-sm"
            >
              <FiPlus className="mr-1" />
              Add Highlight
            </button>
          </div>
          
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {(formData.highlights || []).length === 0 ? (
              <p className="text-gray-500 text-sm italic">No highlights added yet. Click the button above to add one.</p>
            ) : (
              (formData.highlights || []).map((highlight, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-md shadow-sm">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={highlight.text || ''}
                      onChange={(e) => handleHighlightChange(index, 'text', e.target.value)}
                      className={commonClasses.input}
                      placeholder="Add a key highlight..."
                    />
                  </div>
                  <button
                    onClick={() => removeHighlight(index)}
                    className={commonClasses.removeButton}
                    title="Remove highlight"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className={`w-full px-4 py-2 rounded-md text-white ${
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
                : 'Save About Info'}
        </button>
      </div>
    </div>
  );
};

export default AboutForm; 