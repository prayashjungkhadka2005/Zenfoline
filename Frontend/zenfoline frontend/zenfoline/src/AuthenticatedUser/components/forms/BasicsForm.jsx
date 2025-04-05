import React, { useState } from 'react';
import profile from "../../../assets/profile.png";

const BasicsForm = ({ data, onUpdate }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  const commonClasses = {
    section: "space-y-6",
    infoBox: "bg-blue-50 p-4 rounded-lg",
    infoText: "text-blue-700 text-sm",
    grid: "grid grid-cols-2 gap-6",
    label: "block text-sm font-medium text-gray-700 mb-1",
    input: "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          ...data,
          profileImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  const validateForm = () => {
    const requiredFields = {
      name: 'Name',
      role: 'Role',
      bio: 'Bio',
      email: 'Email',
      phone: 'Phone',
      location: 'Location'
    };

    for (const [field] of Object.entries(requiredFields)) {
      if (!data[field]?.trim()) {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    try {
      setError('');
      if (!validateForm()) {
        setStatus('error');
        setError('Empty fields');
        setTimeout(() => {
          setStatus(null);
          setError('');
        }, 1000);
        return;
      }

      setStatus('saving');
      // Here you would typically call an API to save the data
      // For now, we'll just simulate a successful save
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          setStatus(null);
        }, 1000);
      }, 1000);
    } catch (error) {
      setStatus('error');
      setError('Failed to save');
      setTimeout(() => {
        setStatus(null);
        setError('');
      }, 1000);
    }
  };

  return (
    <div className={commonClasses.section}>
      <div className={commonClasses.infoBox}>
        <p className={commonClasses.infoText}>This section contains your basic information that appears at the top of your portfolio.</p>
      </div>
      
      <div className={commonClasses.grid}>
        <div className="col-span-2">
          <label className={commonClasses.label}>Profile Image</label>
          <div className="flex items-center space-x-6">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg">
              <img
                src={data.profileImage || profile}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = profile;
                }}
              />
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-xs text-gray-500">Recommended: Square image of at least 400x400 pixels</p>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <label className={commonClasses.label}>Name</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={commonClasses.input}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className={commonClasses.label}>Role</label>
          <input
            type="text"
            value={data.role || ''}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className={commonClasses.input}
            placeholder="e.g. Full Stack Developer"
          />
        </div>

        <div>
          <label className={commonClasses.label}>Email</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={commonClasses.input}
            placeholder="your@email.com"
          />
        </div>

        <div className="col-span-2">
          <label className={commonClasses.label}>Bio</label>
          <textarea
            value={data.bio || ''}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows="4"
            className={commonClasses.input}
            placeholder="Write a short bio about yourself"
          />
        </div>

        <div>
          <label className={commonClasses.label}>Phone</label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={commonClasses.input}
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label className={commonClasses.label}>Location</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={commonClasses.input}
            placeholder="City, Country"
          />
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
                ? error || 'Empty fields' 
                : 'Save Basic Info'}
        </button>
      </div>
    </div>
  );
};

export default BasicsForm; 