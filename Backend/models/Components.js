const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the component
    category: { type: String, required: true }, // Matches the linked template category
    linkedTemplate: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Template", 
      required: true 
    }, // Reference to the Template model
    componentType: { type: String, required: true }, // Type: Header, Footer, etc.
    componentSubType: { type: String, required: true }, // E.g., 'Modern Header', 'Stylish Footer'
    isActive: { type: Boolean, default: true }, // Default Active
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

const Component = mongoose.model("Component", componentSchema);

module.exports = Component;
