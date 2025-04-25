import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons"; 
import DeveloperHeader from "../TemplateComponents/Developer/DeveloperHeader";
import SimpleFooter from "../TemplateComponents/Simple/SimpleFooter";
import DeveloperFooter from "../TemplateComponents/Developer/DeveloperFooter";
import useTemplateStore from "../store/adminTemplateStore";
import useAuthStore from "../store/userAuthStore";

const ManageComponents = () => {
  const { components, fetchComponents, templates, fetchTemplates, addComponent } = useTemplateStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const adminId = useAuthStore((state) => state.adminId);
  const [newComponent, setNewComponent] = useState({
    name: "",
    category: "",
    linkedTemplate: "",
    componentType: "",
    componentSubType: "",
  });
  const [previewComponent, setPreviewComponent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tablePreviewComponent, setTablePreviewComponent] = useState(null);
  const [previewComponentId, setPreviewComponentId] = useState(null); 

  useEffect(() => {
    useTemplateStore.getState().setSuccess('');

  }, []);
  

  useEffect(() => {
 
    if (adminId) {
      fetchTemplates();
      fetchComponents();
    }
  }, [adminId, fetchTemplates, fetchComponents]);

  const handleAddComponent = async () => {
    if (!newComponent.name || !newComponent.linkedTemplate || !newComponent.componentType || !newComponent.componentSubType) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    // Prevent duplicate component while adding
    const isDuplicate = components.some(
      (comp) =>
        comp.componentType === newComponent.componentType &&
        comp.componentSubType === newComponent.componentSubType &&
        comp.category === newComponent.category
    );

    if (isDuplicate) {
      setErrorMessage("This component already exists for the selected template.");
      return;
    }

    try {
      await addComponent(newComponent, adminId);
      setSuccessMessage("Component added successfully!");
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message || "Failed to add component.");
    }
  };

  const resetForm = () => {
    setNewComponent({
      name: "",
      category: "",
      linkedTemplate: "",
      componentType: "",
      componentSubType: "",
    });
    setPreviewComponent(null);
    setErrorMessage("");
  };

  const handleToggleStatus = async (componentId, currentStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/authenticated-admin/togglecomponentstatus/${componentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: !currentStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle component status");
      }

      // Update the component status in the local state
      const updatedComponents = components.map((comp) =>
        comp._id === componentId ? { ...comp, status: !currentStatus } : comp
      );
      useTemplateStore.setState({ components: updatedComponents });
      setSuccessMessage("Component status updated successfully!");
    } catch (error) {
      setErrorMessage(error.message || "Failed to toggle component status");
    }
  };

const handleDeleteComponent = async (componentId) => {
  if (window.confirm("Are you sure you want to delete this component?")) {
    try {
      const response = await fetch(
        `http://localhost:3000/authenticated-admin/deletecomponent/${componentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete component");
      }

      // Remove the component from the local state
      const updatedComponents = components.filter((comp) => comp._id !== componentId);
      useTemplateStore.setState({ components: updatedComponents });
      setSuccessMessage("Component deleted successfully!");
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete component");
    }
  }
};

  const availableComponents = {
    Developer: {
      Header: {
        "Modern Header": <DeveloperHeader />,
        "Classic Header": <div>Classic Developer Header</div>,
        "Minimal Header": <div>Minimal Developer Header</div>,
      },
      Footer: {
        "Modern Footer": <DeveloperFooter />,
      },
    },
    Simple: {
      Footer: {
        "Stylish Footer": <SimpleFooter />,
      },
    },
    Designer: {
      Header: {
        "Modern Designer Header": <div>Modern Designer Header</div>,
        "Creative Header": <div>Creative Designer Header</div>,
      },
      Footer: {
        "Designer Footer": <div>Designer Footer</div>,
      },
      Hero: {
        "Design Hero": <div>Design Hero Section</div>,
      },
      About: {
        "Design About": <div>Design About Section</div>,
      },
      Skills: {
        "Design Skills": <div>Design Skills Section</div>,
      },
      Projects: {
        "Design Projects": <div>Design Projects Section</div>,
      },
      Contact: {
        "Design Contact": <div>Design Contact Section</div>,
      },
    },
  };

  const handleTogglePreview = (componentId) => {
    setPreviewComponentId(prevId => (prevId === componentId ? null : componentId)); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComponent((prev) => ({ ...prev, [name]: value }));

    if (name === "linkedTemplate") {
      const selectedTemplate = templates.find((template) => template._id === value);
      if (selectedTemplate) {
        setNewComponent((prev) => ({
          ...prev,
          category: selectedTemplate.category,
          componentType: "",
          componentSubType: "",
        }));
      }
    }

    if (name === "componentType") {
      const selectedType = availableComponents[newComponent.category]?.[newComponent.componentSubType]?.[value];
      setPreviewComponent(selectedType || null);
    }
  };

    // Get available types
    const getAvailableSubTypes = () => {
      if (!newComponent.category) return [];
      return Object.keys(availableComponents[newComponent.category] || {});
    };
  
  // Get available components to remove existing components
const getAvailableComponents = () => {
  if (!newComponent.category || !newComponent.componentSubType) return [];

  const allComponents = Object.keys(
    availableComponents[newComponent.category]?.[newComponent.componentSubType] || {}
  );

  // Filters already added components
  const addedComponentNames = components.map((comp) => comp.componentType);
  return allComponents.filter((comp) => !addedComponentNames.includes(comp));
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header & Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#000042]">Manage Components</h1>
        <button
          onClick={() =>   { setErrorMessage(""); setIsModalOpen(true);}}
          className="bg-[#000042] text-white px-4 py-2 rounded-md hover:bg-[#000061]"
        >
          Add Component
        </button>
      </div>

      {errorMessage && !isModalOpen && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

   {/* Components Table */}
<div className="overflow-x-auto rounded-lg shadow-lg bg-white">
  <table className="w-full border-collapse">
    <thead className="bg-[#000042] text-white text-left">
      <tr>
        <th className="px-6 py-4 text-center">S.N.</th>
        <th className="px-6 py-4">Component Name</th>
        <th className="px-6 py-4">Template Category</th>
        <th className="px-6 py-4">Type</th>
        <th className="px-6 py-4 text-center">Status</th>
        <th className="px-6 py-4 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {components?.map((component, index) => {
        const previewContent = availableComponents[component.category]?.[component.componentSubType]?.[component.componentType];
        return (
          <React.Fragment key={component._id || index}>
            {/* Component Row */}
            <tr className="border-b hover:bg-gray-100 transition-all">
              <td className="px-6 py-4 text-center">{index + 1}</td>
              <td className="px-6 py-4 font-medium">{component.componentType}</td>
              <td className="px-6 py-4">{component.category}</td>
              <td className="px-6 py-4">{component.componentSubType}</td>

              {/* Clickable Status Column */}
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleToggleStatus(component._id, component.isActive)}
                    className={`text-sm font-medium transition-all ${
                      component.isActive
                        ? "text-green-500 hover:text-green-700"
                        : "text-red-500 hover:text-red-700"
                    }`}
                  >
                    <FontAwesomeIcon icon={component.isActive ? faEye : faEyeSlash} className="mr-1" />
                    {component.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
              </td>

              {/* Actions Column */}
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-4">
                  {/* Show and Hide Preview Button */}
                  <button
                    onClick={() => handleTogglePreview(component._id)}
                    className="flex items-center text-blue-500 hover:text-blue-700"
                    title={previewComponentId === component._id ? "Hide Preview" : "Show Preview"}
                  >
                    <FontAwesomeIcon icon={previewComponentId === component._id ? faEyeSlash : faEye} className="mr-1" />
                    {previewComponentId === component._id ? "Hide" : "Show"}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteComponent(component._id)}
                    className="flex items-center text-red-500 hover:text-red-700"
                    title="Delete Component"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            {/* Preview Row */}
            {previewComponentId === component._id && (
              <tr>
                <td colSpan="7" className="p-4 bg-gray-50 text-center border-b">
                  {previewContent || <p className="text-gray-500">No preview available</p>}
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  </table>
</div>


      {/* Table Preview */}
      {tablePreviewComponent && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#000042] mb-4">Table Preview</h2>
          <div className="border p-4 bg-white rounded-lg h-48">
            {availableComponents[tablePreviewComponent.category]?.[tablePreviewComponent.componentSubType]?.[tablePreviewComponent.componentType] ||
              <p className="text-center text-gray-500">No preview available</p>}
          </div>
        </div>
      )}

{isModalOpen && (
 <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-center z-50">

    <div className="bg-white w-[600px] rounded-lg p-6 shadow-lg relative">
      
      <button 
      
      onClick={() => {
        resetForm(),
        setIsModalOpen(false);
        setErrorMessage("");  // Clear error message modal is closed
      }} 
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>

      <h2 className="text-2xl font-semibold text-[#000042] mb-6">Add New Component</h2>

      {isModalOpen && errorMessage && (
  <p className="text-red-500 text-sm mb-4">
    {errorMessage}
  </p>
)}

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Component Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={newComponent.name}
            onChange={handleInputChange}
            placeholder="Enter component name"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#000042]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Choose Template <span className="text-red-500">*</span></label>
          <select
            name="linkedTemplate"
            value={newComponent.linkedTemplate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#000042]"
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.category}
              </option>
            ))}
          </select>
        </div>

      
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Component Sub-Type <span className="text-red-500">*</span></label>
          <select
            name="componentSubType"
            value={newComponent.componentSubType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#000042]"
            disabled={!newComponent.category}
          >
            <option value="">Select component sub-type</option>
            {getAvailableSubTypes().map((subType) => (
              <option key={subType} value={subType}>
                {subType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Component Type <span className="text-red-500">*</span></label>
          <select
            name="componentType"
            value={newComponent.componentType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#000042]"
            disabled={!newComponent.componentSubType}
          >
            <option value="">Select component type</option>
            {getAvailableComponents().map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

     
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700">Preview</h3>
        <div className="border rounded-md p-4 mt-2 min-h-[100px] flex items-center justify-center bg-gray-100">
          {previewComponent || <span className="text-gray-400">No preview available</span>}
        </div>
      </div>

    
      <button
        onClick={handleAddComponent}
        className="w-full mt-6 bg-[#000042] text-white text-lg font-medium py-2 rounded-md hover:bg-[#000061] transition"
      >
        Confirm
      </button>

    </div>
  </div>
)}


    </div>
  );
};

export default ManageComponents;
