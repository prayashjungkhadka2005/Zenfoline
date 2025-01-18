import React, { useState } from 'react';
import useAuthStore from '../store/userAuthStore';

const AddTemplates = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); 
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const adminId = useAuthStore((state) => state.adminId); 
  const addTemplate = useAuthStore((state) => state.addTemplate); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image || !category || !adminId) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      await addTemplate(name, description, image, category);
      setSuccess('Template added successfully!');
      setError('');
      setName('');
      setDescription('');
      setImage(null);
      setCategory('');
    } catch (err) {
      setError(err.message || 'An error occurred while adding the template.');
      setSuccess('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-[600px] bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Template</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000042]"
              placeholder="Enter template name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000042]"
              placeholder="Enter template description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000042]"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000042]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Developer">Developer</option>
              <option value="Simple">Simple</option>
              <option value="Expert">Expert</option>
              <option value="Mixed">Mixed</option>
              <option value="Extra">Extra</option>
              <option value="Beginner">Beginner</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#000042] text-white text-lg font-medium py-2 rounded-md hover:bg-[#000061]"
          >
            Add Template
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTemplates;
