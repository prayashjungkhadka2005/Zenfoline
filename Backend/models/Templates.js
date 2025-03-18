const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true, 
    },
    category: {
      type: String,
      enum: ['developer', 'student', 'content-creator', 'designer', 'lawyer', 'expert'],
      required: true,
    },
    predefinedTemplate: {
      type: String,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', 
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    // Section Configuration
    sectionConfiguration: {
      basics: {
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 1 }
      },
      about: {
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 2 }
      },
      skills: {
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 3 },
        displayStyle: { 
          type: String, 
          enum: ['grid', 'list', 'cloud'], 
          default: 'grid' 
        }
      },
      experience: {
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 4 }
      },
      education: {
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 5 }
      },
      projects: {
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 6 },
        displayStyle: { 
          type: String, 
          enum: ['grid', 'list'], 
          default: 'grid' 
        }
      },
      certifications: {
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 7 }
      },
      publications: {
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 8 }
      },
      awards: {
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 9 }
      },
      services: {
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 10 }
      },
      customSections: {
        isEnabled: { type: Boolean, default: true }
      }
    },
    // Default sections based on portfolio type
    defaultSections: {
      type: Map,
      of: [String],
      default: {
        'developer': ['basics', 'about', 'skills', 'experience', 'projects', 'education', 'certifications'],
        'student': ['basics', 'about', 'education', 'skills', 'projects', 'certifications', 'awards'],
        'content-creator': ['basics', 'about', 'services', 'publications', 'projects', 'skills'],
        'designer': ['basics', 'about', 'projects', 'skills', 'experience', 'services'],
        'lawyer': ['basics', 'about', 'experience', 'education', 'certifications', 'services', 'publications'],
        'expert': ['basics', 'about', 'experience', 'skills', 'projects', 'publications', 'certifications', 'services']
      }
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

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
