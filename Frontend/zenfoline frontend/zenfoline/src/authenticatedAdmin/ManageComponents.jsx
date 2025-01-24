import React, { useState } from 'react';
import DeveloperHeader from '../TemplateComponents/Developer/DeveloperHeader'; // Import Developer Header
import SimpleFooter from '../TemplateComponents/Simple/SimpleFooter'; // Import Simple Footer
import DeveloperFooter from '../TemplateComponents/Developer/DeveloperFooter'; // Import Simple Footer

const ManageComponents = () => {
  // Dummy components data with actual components included
  const [components, setComponents] = useState([
    { id: '1', name: 'Header', category: 'Developer', isActive: true, component: <DeveloperHeader /> },
    { id: '2', name: 'Footer', category: 'Developer', isActive: false , component: <DeveloperFooter /> },
    { id: '3', name: 'Footer', category: 'Simple', isActive: true, component: <SimpleFooter /> },
   
  ]);

  const [category, setCategory] = useState('Developer'); // Current category

  // Filter components by selected category
  const filteredComponents = components.filter((component) => component.category === category);

  // Toggle the active status of a component
  const handleToggle = (id) => {
    setComponents((prev) =>
      prev.map((component) =>
        component.id === id
          ? { ...component, isActive: !component.isActive }
          : component
      )
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-[#000042] mb-6">Manage Components</h1>

      {/* Category Selector */}
      <div className="mb-6">
        <label className="font-medium text-gray-700">Select Category:</label>
        <select
          className="ml-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Developer">Developer</option>
          <option value="Simple">Simple</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      {/* Components Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-[#000042] text-white text-left">
            <tr>
              <th className="px-6 py-4">S.N.</th>
              <th className="px-6 py-4">Component Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComponents.map((component, index) => (
              <tr key={component.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4">{component.name}</td>
                <td className="px-6 py-4">{component.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-white text-sm ${
                      component.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {component.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(component.id)}
                    className={`px-4 py-2 rounded-md text-white text-sm ${
                      component.isActive ? 'bg-red-500' : 'bg-green-500'
                    }`}
                  >
                    {component.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-[#000042] mb-4">Preview</h2>
        <div className="border p-4 bg-white rounded-lg">
          {filteredComponents
            .filter((component) => component.isActive && component.component)
            .map((component) => (
              <div key={component.id} className="mb-6">
                <h3 className="text-lg font-medium mb-3">{component.name}</h3>
                <div className="border rounded-lg p-4">{component.component}</div>
              </div>
            ))}
          {filteredComponents.filter((component) => component.isActive && component.component).length === 0 && (
            <p className="text-gray-500">No active components available for preview.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageComponents;
