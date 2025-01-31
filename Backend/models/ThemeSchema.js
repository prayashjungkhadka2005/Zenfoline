const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    activeTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template', 
      required: true,
    },
    colorMode: {
      type: String,
      enum: ['default', 'light', 'dark'], 
      default: 'default',
    },
    presetTheme: {
      type: String, 
      default: null,
    },
    fontStyle: {
      type: String,
      default: 'Poppins', 
    },
    navigationBar: {
      type: String, 
    },
    footer: {
      type: String, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
