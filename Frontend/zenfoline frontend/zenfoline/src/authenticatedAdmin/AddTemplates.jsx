import React, { useState, useEffect } from 'react';
import useAdminTemplateStore from '../store/adminTemplateStore';
import useAuthStore from '../store/userAuthStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import SimplePortfolioTemplate from '../Templates/SimplePortfolioTemplate';
import ExpertPortfolioTemplate from '../Templates/ExpertPortfolioTemplate';

const AdminTemplates = () => {
  const {
    templates,
    fetchTemplates,
    saveTemplate,
    deleteTemplate,
    error,
    success,
    resetMessages,
  } = useAdminTemplateStore();

  const templateComponents = {
    SimplePortfolioTemplate,
    ExpertPortfolioTemplate,
  };

  const adminId = useAuthStore((state) => state.adminId);

  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [name, setName] = useState('');
  const [predefinedTemplate, setPredefinedTemplate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Get all available categories and predefined templates
  const allCategories = ['developer', 'expert', 'student', 'content-creator', 'designer', 'lawyer'];
  const allPredefinedTemplates = ['SimplePortfolioTemplate', 'ExpertPortfolioTemplate'];

  // Filter out categories and predefined templates that are already in use
  const usedCategories = templates.map(template => template.category);
  const usedPredefinedTemplates = templates.map(template => template.predefinedTemplate);

  const availableCategories = allCategories.filter(cat => !usedCategories.includes(cat));
  const availablePredefinedTemplates = allPredefinedTemplates.filter(temp => !usedPredefinedTemplates.includes(temp));

  // If editing, add the current template's category and predefined template to the available options
  const categoriesToShow = editingTemplate 
    ? [...availableCategories, editingTemplate.category] 
    : availableCategories;
  
  const predefinedTemplatesToShow = editingTemplate 
    ? [...availablePredefinedTemplates, editingTemplate.predefinedTemplate] 
    : availablePredefinedTemplates;

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    useAdminTemplateStore.getState().setSuccess('');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      resetMessages();
      setModalError('');
      setModalSuccess('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, error, resetMessages]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setImage(null);
    setCategory('');
    setPredefinedTemplate('');
    setEditingTemplate(null);
    setModalError('');
    setModalSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !predefinedTemplate || (!editingTemplate && !image)) {
      setModalError('Please fill out all required fields.');
      return;
    }

    if (editingTemplate && !image) {
      setModalError('Please upload an image.');
      return;
    }

    const template = {
      name,
      description,
      image,
      category,
      predefinedTemplate,
      _id: editingTemplate?._id,
    };

    try {
      await saveTemplate(template, adminId);
      setModalSuccess(editingTemplate ? 'Template updated successfully!' : 'Template added successfully!');
      resetForm();
      setShowModal(false);
    } catch (err) {
      setModalError(err.message || 'An error occurred while processing the template.');
    }
  };

  const handleEdit = (template) => {
    resetForm();
    setEditingTemplate(template);
    setName(template.name);
    setDescription(template.description);
    setCategory(template.category);
    setPredefinedTemplate(template.predefinedTemplate);
    setShowModal(true);
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(templateId);
    }
  };

  const handleModalOpen = () => {
    resetForm();
    setShowModal(true);
  };

  const handleModalClose = () => {
    resetForm();
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#000042]">Admin Templates</h1>
        <button
          onClick={handleModalOpen}
          className="bg-[#000042] text-white px-4 py-2 rounded-md hover:bg-[#000061]"
        >
          Add New Template
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-[#000042] text-white text-left">
            <tr>
              <th className="px-6 py-4">S.N.</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Predefined Template</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, index) => (
              <tr
                key={template._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4">{template.category}</td>
                <td className="px-6 py-4">{template.description}</td>
                <td className="px-6 py-4">{template.predefinedTemplate}</td>
                <td className="px-6 py-4">
                  <img
                    src={`http://localhost:3000${template.image}`}
                    alt={template.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(template)}
                      className="flex items-center text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(template._id)}
                      className="flex items-center text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-50 flex justify-center items-center">
          <div className="bg-white w-[600px] shadow-lg rounded-lg p-8 relative">
            <h1 className="text-2xl font-bold text-[#000042] mb-6">
              {editingTemplate ? 'Edit Template' : 'Add Template'}
            </h1>

            {modalError && <p className="text-red-500 text-sm mb-4">{modalError}</p>}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
                  {categoriesToShow.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Predefined Template <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000042]"
                  value={predefinedTemplate}
                  onChange={(e) => setPredefinedTemplate(e.target.value)}
                >
                  <option value="">Select a predefined template</option>
                  {predefinedTemplatesToShow.map((temp) => (
                    <option key={temp} value={temp}>
                      {temp.replace('PortfolioTemplate', ' Portfolio')}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#000042] text-white text-lg font-medium py-2 rounded-md hover:bg-[#000061]"
              >
                {editingTemplate ? 'Update Template' : 'Add Template'}
              </button>
            </form>

            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplates;
