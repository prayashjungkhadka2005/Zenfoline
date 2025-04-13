import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiCalendar, FiLink, FiImage, FiFileText } from 'react-icons/fi';
import { format } from 'date-fns';
import axios from 'axios';
import useAuthStore from '../../../store/userAuthStore';
import Spinner from '../../../components/Spinner';

const PublicationsForm = ({ data, onUpdate }) => {
  const [publications, setPublications] = useState([]);
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
    textarea: "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]",
    loadingPlaceholder: "h-10 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200",
    loadingTextareaPlaceholder: "h-24 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200"
  };

  useEffect(() => {
    const fetchPublicationData = async () => {
      if (!userId || !isInitialMount.current) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/portfolio-save/publications/${userId}`);
        if (response.data && Array.isArray(response.data.data)) {
          const formattedData = response.data.data.map(pub => ({
            ...pub,
            publicationDate: pub.publicationDate ? format(new Date(pub.publicationDate), 'yyyy-MM') : ''
          }));
          setPublications(formattedData);
          onUpdate(formattedData);
        } else {
          setPublications([]);
          onUpdate([]);
        }
      } catch (fetchError) {
        console.error('Error fetching publication data:', fetchError);
        setError('Failed to load publication data.');
        setPublications([]);
        onUpdate([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicationData();
    isInitialMount.current = false;
  }, [userId, onUpdate]);

  const handleAddPublication = () => {
    const newPublication = {
      title: '',
      publisher: '',
      publicationDate: '',
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
    const newErrors = { ...fieldErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`${index}-`)) {
        delete newErrors[key];
      }
    });
    setFieldErrors(newErrors);
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

    if (pub.url && !/^https?:\/\//.test(pub.url)) {
      errors[`${index}-url`] = 'Invalid URL format';
      isValid = false;
    }

    if (pub.image && !/^https?:\/\//.test(pub.image)) {
      errors[`${index}-image`] = 'Invalid URL format';
      isValid = false;
    }

    isValid = Object.keys(errors).length === 0;
    return { isValid, errors };
  };

  const handleSavePublications = async () => {
    let isValid = true;
    let allErrors = {};
    
    if (publications.length > 0) {
      for (let i = 0; i < publications.length; i++) {
        const { isValid: entryValid, errors } = validatePublication(publications[i], i);
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
      const apiData = publications.map(pub => ({
        ...pub,
        publicationDate: pub.publicationDate ? new Date(pub.publicationDate + '-01') : null
      }));

      const response = await axios.post(`http://localhost:3000/portfolio-save/publications/${userId}`, {
        publications: apiData
      });

      if (response.data && response.data.data) {
        const formattedData = response.data.data.map(pub => ({
          ...pub,
          publicationDate: pub.publicationDate ? format(new Date(pub.publicationDate), 'yyyy-MM') : ''
        }));
        setPublications(formattedData);
        onUpdate(formattedData);
        setStatus('success');
        setTimeout(() => {
          setStatus(null);
        }, 2000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (saveError) {
      console.error('Error saving publication data:', saveError);
      setStatus('error');
      setError(saveError.response?.data?.message || 'Failed to save publication data.');
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedPublications = [...publications];
    updatedPublications[index] = {
      ...updatedPublications[index],
      [field]: value
    };
    setPublications(updatedPublications);
    
    if (fieldErrors[`${index}-${field}`]) {
      setFieldErrors({
        ...fieldErrors,
        [`${index}-${field}`]: null
      });
    }
    
    onUpdate(updatedPublications);
  };

  const renderLoadingPublicationCard = (key) => (
    <div key={key} className={commonClasses.card}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Publication Details</h3>
          <div className={commonClasses.iconButtonDanger}>
            <FiTrash2 />
          </div>
        </div>
        
        <div className={commonClasses.grid}>
          <div>
            <label className={commonClasses.label}>Title*</label>
            <div className={commonClasses.loadingPlaceholder}>
              <Spinner size="sm" color="orange-500" />
            </div>
          </div>
          <div>
            <label className={commonClasses.label}>Publisher*</label>
            <div className={commonClasses.loadingPlaceholder}>
              <Spinner size="sm" color="orange-500" />
            </div>
          </div>
        </div>

        <div>
          <label className={commonClasses.label}>Publication Date*</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <div className={commonClasses.loadingPlaceholder}>
              <Spinner size="sm" color="orange-500" />
            </div>
          </div>
        </div>

        <div>
          <label className={commonClasses.label}>Description</label>
          <div className={commonClasses.loadingTextareaPlaceholder}>
            <Spinner size="sm" color="orange-500" />
          </div>
        </div>

        <div className={commonClasses.grid}>
          <div>
            <label className={commonClasses.label}>URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLink className="text-gray-400" />
              </div>
              <div className={commonClasses.loadingPlaceholder}>
                <Spinner size="sm" color="orange-500" />
              </div>
            </div>
          </div>
          <div>
            <label className={commonClasses.label}>Image URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiImage className="text-gray-400" />
              </div>
              <div className={commonClasses.loadingPlaceholder}>
                <Spinner size="sm" color="orange-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={commonClasses.section}>
        <div className={commonClasses.infoBox}>
          <p className={commonClasses.infoText}>Add your publications to showcase your research, articles, or books.</p>
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
            className={`${commonClasses.addButton} max-w-xs mx-auto`}
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
                      value={pub.title || ''}
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
                      value={pub.publicationDate || ''}
                      onChange={(e) => handleInputChange(index, 'publicationDate', e.target.value)}
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
            Add Another Publication
          </button>
        </div>
      )}

      <button
        onClick={handleSavePublications}
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
         'Save Publications'}
      </button>
      {status === 'error' && !Object.keys(fieldErrors).length && error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
};

export default PublicationsForm; 