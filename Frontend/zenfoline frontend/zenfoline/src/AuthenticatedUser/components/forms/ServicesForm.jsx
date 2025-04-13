import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiImage, FiDollarSign, FiList, FiServer } from 'react-icons/fi';
import axios from 'axios';
import useAuthStore from '../../../store/userAuthStore';
import Spinner from '../../../components/Spinner';

const ServicesForm = ({ data, onUpdate }) => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((state) => state.userId);
  const isInitialMount = useRef(true);

  // Common classes for consistent styling
  const commonClasses = {
    section: "space-y-6",
    infoBox: "bg-blue-50 p-4 rounded-lg mb-6",
    infoText: "text-blue-700 text-sm",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
    label: "block text-sm font-medium text-gray-700 mb-1",
    input: "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
    inputError: "w-full px-3 py-2 border border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500",
    errorText: "text-red-500 text-xs mt-1",
    button: "w-full px-4 py-2 rounded-md text-white font-medium",
    buttonPrimary: "bg-blue-500 hover:bg-blue-600",
    buttonSuccess: "bg-green-500",
    buttonError: "bg-red-500",
    buttonDisabled: "bg-gray-400 cursor-not-allowed",
    card: "bg-white rounded-lg mb-4 p-6 relative border border-gray-200 shadow-sm",
    iconButton: "p-2 text-gray-500 hover:text-gray-700",
    iconButtonDanger: "absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 transition-colors",
    addButton: "w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm font-medium",
    featureAddButton: "inline-flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100",
    featureRemoveButton: "p-2 text-red-400 hover:text-red-600 transition-colors",
    textarea: "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]",
    loadingPlaceholder: "h-10 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200",
    loadingTextareaPlaceholder: "h-24 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200",
    featureSection: "mt-6 space-y-4",
    featureHeader: "flex items-center justify-between"
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!userId || !isInitialMount.current) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/portfolio-save/services/${userId}`);
        if (response.data && Array.isArray(response.data.data)) {
          // Ensure each service has all required fields with defaults
          const formattedData = response.data.data.map(service => ({
            title: service.title || '',
            description: service.description || '',
            image: service.image || '',
            price: service.price || '',
            features: Array.isArray(service.features) ? service.features : [],
            isVisible: service.isVisible !== undefined ? service.isVisible : true,
            _id: service._id // Preserve the MongoDB ID
          }));
          setServices(formattedData);
          onUpdate(formattedData);
        } else {
          setServices([]);
          onUpdate([]);
        }
      } catch (fetchError) {
        console.error('Error fetching service data:', fetchError);
        setError('Failed to load service data.');
        setServices([]);
        onUpdate([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceData();
    isInitialMount.current = false;
  }, [userId, onUpdate]);

  const handleAddService = () => {
    const newService = {
      title: '',
      description: '',
      image: '',
      price: '',
      features: [],
      isVisible: true
    };
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    setFieldErrors({});
    onUpdate(updatedServices);
  };

  const handleDeleteService = (index) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    // Clear errors
    const newErrors = { ...fieldErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`${index}-`)) {
        delete newErrors[key];
      }
    });
    setFieldErrors(newErrors);
    setServices(updatedServices);
    onUpdate(updatedServices);
  };

  const validateService = (service, index) => {
    const errors = {};
    let isValid = true;

    if (!service.title?.trim()) {
      errors[`${index}-title`] = 'Title is required';
      isValid = false;
    }
    if (!service.description?.trim()) {
      errors[`${index}-description`] = 'Description is required';
      isValid = false;
    }
    // Optional URL validation for image
    if (service.image && !/^https?:\/\//.test(service.image)) {
      errors[`${index}-image`] = 'Invalid URL format';
      isValid = false;
    }

    return { isValid, errors };
  };

  const handleSaveServices = async () => {
    let isValid = true;
    let allErrors = {};
    
    if (services.length > 0) {
      for (let i = 0; i < services.length; i++) {
        const { isValid: entryValid, errors } = validateService(services[i], i);
        if (!entryValid) {
          isValid = false;
          allErrors = { ...allErrors, ...errors };
        }
      }
    }
    
    if (!isValid) {
      setFieldErrors(allErrors);
      setStatus('error');
      setError('Please fill in all required fields correctly.');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 3000);
      return;
    }

    setStatus('saving');
    setError('');
    setFieldErrors({});

    try {
      // Prepare data for API, preserving _id if it exists
      const apiData = services.map(service => ({
        ...service,
        features: Array.isArray(service.features) ? service.features.filter(f => f.trim()) : []
      }));

      const response = await axios.post(`http://localhost:3000/portfolio-save/services/${userId}`, {
        services: apiData
      });

      if (response.data && response.data.data) {
        // Update local state with the response data, preserving _id
        const formattedData = response.data.data.map(service => ({
          ...service,
          features: Array.isArray(service.features) ? service.features : []
        }));
        setServices(formattedData);
        onUpdate(formattedData);
        setStatus('success');
        setTimeout(() => {
          setStatus(null);
        }, 2000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (saveError) {
      console.error('Error saving service data:', saveError);
      setStatus('error');
      setError(saveError.response?.data?.message || 'Failed to save service data.');
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    setServices(updatedServices);
    if (fieldErrors[`${index}-${field}`]) {
      setFieldErrors({
        ...fieldErrors,
        [`${index}-${field}`]: null
      });
    }
    onUpdate(updatedServices);
  };

  const handleFeatureChange = (serviceIndex, featureIndex, value) => {
    const updatedServices = [...services];
    if (!updatedServices[serviceIndex].features) {
      updatedServices[serviceIndex].features = [];
    }
    updatedServices[serviceIndex].features[featureIndex] = value;
    setServices(updatedServices);
    onUpdate(updatedServices);
  };

  const handleAddFeature = (serviceIndex) => {
    const updatedServices = [...services];
    if (!updatedServices[serviceIndex].features) {
      updatedServices[serviceIndex].features = [];
    }
    updatedServices[serviceIndex].features.push('');
    setServices(updatedServices);
    onUpdate(updatedServices);
  };

  const handleRemoveFeature = (serviceIndex, featureIndex) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].features.splice(featureIndex, 1);
    setServices(updatedServices);
    onUpdate(updatedServices);
  };

  // Skeleton loader function
  const renderLoadingServiceCard = (key) => (
    <div key={key} className={commonClasses.card}>
      <div className={commonClasses.grid}>
        <div>
          <label className={commonClasses.label}>Title*</label>
          <div className={commonClasses.loadingPlaceholder}><Spinner size="sm" color="orange-500" /></div>
        </div>
        <div>
          <label className={commonClasses.label}>Price</label>
          <div className={commonClasses.loadingPlaceholder}><Spinner size="sm" color="orange-500" /></div>
        </div>
      </div>
      <div className="mt-4">
        <label className={commonClasses.label}>Description*</label>
        <div className={commonClasses.loadingTextareaPlaceholder}><Spinner size="sm" color="orange-500" /></div>
      </div>
      <div className="mt-4">
        <label className={commonClasses.label}>Image URL</label>
        <div className={commonClasses.loadingPlaceholder}><Spinner size="sm" color="orange-500" /></div>
      </div>
      <div className={commonClasses.featureSection}>
        <label className={commonClasses.label}>Features</label>
        <div className={commonClasses.loadingPlaceholder}><Spinner size="sm" color="orange-500" /></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={commonClasses.section}>
        <div className={commonClasses.infoBox}>
          <p className={commonClasses.infoText}>Add your professional services and offerings with detailed descriptions and pricing.</p>
        </div>
        <div className="space-y-4">
          {renderLoadingServiceCard('loading-service-0')}
        </div>
        <button type="button" disabled className={`${commonClasses.addButton} bg-gray-100 text-gray-400 cursor-not-allowed`}>
          <FiPlus className="w-4 h-4" /> Add Service
        </button>
        <button disabled className={`${commonClasses.button} ${commonClasses.buttonDisabled}`}>Loading...</button>
      </div>
    );
  }

  return (
    <div className={commonClasses.section}>
      <div className={commonClasses.infoBox}>
        <p className={commonClasses.infoText}>Add your professional services and offerings with detailed descriptions and pricing.</p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-6">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiServer className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Services Added</h3>
          <p className="text-gray-500 mb-4">Add the professional services you offer to potential clients.</p>
          <button
            onClick={handleAddService}
            className={`${commonClasses.addButton} max-w-xs mx-auto`}
          >
            <FiPlus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className={commonClasses.card}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Service Details</h3>
                  <button
                    onClick={() => handleDeleteService(index)}
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
                      value={service.title || ''}
                      onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                      className={fieldErrors[`${index}-title`] ? commonClasses.inputError : commonClasses.input}
                      placeholder="e.g., Web Development"
                    />
                    {fieldErrors[`${index}-title`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-title`]}</p>
                    )}
                  </div>
                  <div>
                    <label className={commonClasses.label}>Price</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={service.price || ''}
                        onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                        className={`${commonClasses.input} pl-8`}
                        placeholder="e.g., $100/hour or $1000/project"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={commonClasses.label}>Description*</label>
                  <textarea
                    value={service.description || ''}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    className={fieldErrors[`${index}-description`] ? `${commonClasses.textarea} ${commonClasses.inputError}` : commonClasses.textarea}
                    placeholder="Describe your service in detail..."
                    rows={3}
                  />
                  {fieldErrors[`${index}-description`] && (
                    <p className={commonClasses.errorText}>{fieldErrors[`${index}-description`]}</p>
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
                      value={service.image || ''}
                      onChange={(e) => handleInputChange(index, 'image', e.target.value)}
                      className={`${commonClasses.input} pl-10 ${fieldErrors[`${index}-image`] ? commonClasses.inputError : ''}`}
                      placeholder="https://example.com/service-image.jpg"
                    />
                  </div>
                  {fieldErrors[`${index}-image`] && (
                    <p className={commonClasses.errorText}>{fieldErrors[`${index}-image`]}</p>
                  )}
                </div>

                <div className={commonClasses.featureSection}>
                  <div className={commonClasses.featureHeader}>
                    <label className={commonClasses.label}>Key Features</label>
                    <button
                      type="button"
                      onClick={() => handleAddFeature(index)}
                      className={commonClasses.featureAddButton}
                    >
                      <FiPlus className="w-4 h-4 mr-1" />
                      Add Feature
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(service.features || []).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, featureIndex, e.target.value)}
                          className={commonClasses.input}
                          placeholder="Enter a key feature of this service"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index, featureIndex)}
                          className={commonClasses.featureRemoveButton}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddService}
            className={commonClasses.addButton}
          >
            <FiPlus className="w-4 h-4" />
            Add Another Service
          </button>
        </div>
      )}

      <button
        onClick={handleSaveServices}
        className={`${commonClasses.button} ${
          status === 'saving' ? commonClasses.buttonDisabled :
          status === 'success' ? commonClasses.buttonSuccess :
          status === 'error' ? commonClasses.buttonError :
          commonClasses.buttonPrimary
        }`}
        disabled={status === 'saving'}
      >
        {status === 'saving' ? 'Saving...' :
         status === 'success' ? 'Saved Successfully!' :
         status === 'error' ? error || 'Save Failed - Check Fields' :
         'Save Services'}
      </button>
      {status === 'error' && !Object.keys(fieldErrors).length && error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
};

export default ServicesForm;
