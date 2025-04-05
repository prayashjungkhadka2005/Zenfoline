import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCalendar, FiLink, FiAward, FiCheck, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

const CertificationsForm = ({ data, onUpdate }) => {
  const [certifications, setCertifications] = useState([]);
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
      // Check if data is an array (direct certifications array) or has a certifications property
      if (Array.isArray(data)) {
        setCertifications(data);
      } else if (data.certifications) {
        setCertifications(data.certifications);
      } else {
        // If no certifications data is provided, initialize with empty array
        setCertifications([]);
      }
    } else {
      // If no data is provided at all, initialize with empty array
      setCertifications([]);
    }
  }, [data]);

  const handleAddCertification = () => {
    const newCertification = {
      name: '',
      issuer: '',
      issueDate: new Date(),
      expiryDate: null,
      credentialId: '',
      credentialUrl: '',
      description: '',
      isVisible: true
    };
    
    const updatedCertifications = [...certifications, newCertification];
    setCertifications(updatedCertifications);
    setFieldErrors({});
    
    // Update parent component with the new certifications array
    onUpdate(updatedCertifications);
  };

  const handleDeleteCertification = (index) => {
    const updatedCertifications = [...certifications];
    updatedCertifications.splice(index, 1);
    setCertifications(updatedCertifications);
    onUpdate(updatedCertifications);
  };

  const validateCertification = (cert, index) => {
    const errors = {};
    let isValid = true;

    if (!cert.name?.trim()) {
      errors[`${index}-name`] = 'Name is required';
      isValid = false;
    }
    
    if (!cert.issuer?.trim()) {
      errors[`${index}-issuer`] = 'Issuer is required';
      isValid = false;
    }
    
    if (!cert.issueDate) {
      errors[`${index}-issueDate`] = 'Issue date is required';
      isValid = false;
    }

    return { isValid, errors };
  };

  const handleSaveCertifications = () => {
    // Validate all certification entries
    let isValid = true;
    let allErrors = {};
    
    if (certifications.length === 0) {
      setError('Please add at least one certification');
      setStatus('error');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 2000);
      return;
    }
    
    for (let i = 0; i < certifications.length; i++) {
      const { isValid: entryValid, errors } = validateCertification(certifications[i], i);
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
      // Update the parent component with the certifications data
      onUpdate(certifications);
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
      }, 2000);
    }, 1000);
  };

  const handleInputChange = (index, field, value) => {
    const updatedCertifications = [...certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value
    };
    setCertifications(updatedCertifications);
    
    // Clear error for this field when user starts typing
    if (fieldErrors[`${index}-${field}`]) {
      setFieldErrors({
        ...fieldErrors,
        [`${index}-${field}`]: null
      });
    }
    
    // Update parent component with the updated certifications array
    onUpdate(updatedCertifications);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMMM yyyy');
  };

  return (
    <div className={commonClasses.section}>
      <div className={commonClasses.infoBox}>
        <p className={commonClasses.infoText}>Add your certifications to showcase your professional qualifications and achievements.</p>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-6">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiAward className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Certifications Added</h3>
          <p className="text-gray-500 mb-4">Add your certifications to showcase your professional qualifications</p>
          <button
            onClick={handleAddCertification}
            className={commonClasses.addButton}
          >
            <FiPlus className="w-4 h-4" />
            Add Certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div key={index} className={commonClasses.card}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Certification Details</h3>
                  <button
                    onClick={() => handleDeleteCertification(index)}
                    className={commonClasses.iconButtonDanger}
                  >
                    <FiTrash2 />
                  </button>
                </div>
                
                <div className={commonClasses.grid}>
                  <div>
                    <label className={commonClasses.label}>Name*</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      className={fieldErrors[`${index}-name`] ? commonClasses.inputError : commonClasses.input}
                      placeholder="Certification Name"
                    />
                    {fieldErrors[`${index}-name`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-name`]}</p>
                    )}
                  </div>
                  <div>
                    <label className={commonClasses.label}>Issuer*</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => handleInputChange(index, 'issuer', e.target.value)}
                      className={fieldErrors[`${index}-issuer`] ? commonClasses.inputError : commonClasses.input}
                      placeholder="Issuing Organization"
                    />
                    {fieldErrors[`${index}-issuer`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-issuer`]}</p>
                    )}
                  </div>
                </div>

                <div className={commonClasses.grid}>
                  <div>
                    <label className={commonClasses.label}>Issue Date*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="month"
                        value={cert.issueDate ? format(new Date(cert.issueDate), 'yyyy-MM') : ''}
                        onChange={(e) => handleInputChange(index, 'issueDate', new Date(e.target.value))}
                        className={`${fieldErrors[`${index}-issueDate`] ? commonClasses.inputError : commonClasses.input} pl-10`}
                      />
                    </div>
                    {fieldErrors[`${index}-issueDate`] && (
                      <p className={commonClasses.errorText}>{fieldErrors[`${index}-issueDate`]}</p>
                    )}
                  </div>
                  <div>
                    <label className={commonClasses.label}>Expiry Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="month"
                        value={cert.expiryDate ? format(new Date(cert.expiryDate), 'yyyy-MM') : ''}
                        onChange={(e) => handleInputChange(index, 'expiryDate', e.target.value ? new Date(e.target.value) : null)}
                        className={`${commonClasses.input} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                <div className={commonClasses.grid}>
                  <div>
                    <label className={commonClasses.label}>Credential ID</label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) => handleInputChange(index, 'credentialId', e.target.value)}
                      className={commonClasses.input}
                      placeholder="Credential ID or License Number"
                    />
                  </div>
                  <div>
                    <label className={commonClasses.label}>Credential URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLink className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={cert.credentialUrl}
                        onChange={(e) => handleInputChange(index, 'credentialUrl', e.target.value)}
                        className={`${commonClasses.input} pl-10`}
                        placeholder="https://example.com/credential"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={commonClasses.label}>Description</label>
                  <textarea
                    value={cert.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    className={commonClasses.textarea}
                    placeholder="Brief description of the certification"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddCertification}
            className={commonClasses.addButton}
          >
            <FiPlus className="w-4 h-4" />
            Add Certification
          </button>
        </div>
      )}

      <button
        onClick={handleSaveCertifications}
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
              : 'Save Certifications'}
      </button>
    </div>
  );
};

export default CertificationsForm; 