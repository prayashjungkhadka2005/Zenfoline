const mongoose = require('mongoose');

const portfolioDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  // Reference to the template used to create this portfolio
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  // Section Configuration - Controls which sections are enabled and their order
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
  // Basic Information
  basics: {
    name: String,
    role: String,
    bio: String,
    title: String,
    summary: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    profileImage: String,
    coverImage: String,
    isVisible: { type: Boolean, default: true }
  },
  // Social Links - Enhanced structure
  socialLinks: [{
    platform: {
      type: String,
      required: true,
      enum: [
        'linkedin', 'github', 'twitter', 'facebook', 'instagram', 
        'youtube', 'medium', 'dev.to', 'behance', 'dribbble', 
        'pinterest', 'reddit', 'tiktok', 'snapchat', 'twitch',
        'stackoverflow', 'gitlab', 'bitbucket', 'codepen', 'codesandbox',
        'hackerrank', 'leetcode', 'other'
      ]
    },
    url: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      default: function() {
        // Capitalize first letter of platform name
        return this.platform.charAt(0).toUpperCase() + this.platform.slice(1);
      }
    },
    icon: {
      type: String,
      default: function() {
        // Default icon based on platform
        return `fa-${this.platform}`;
      }
    },
    isVisible: { 
      type: Boolean, 
      default: true 
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  // About Section
  about: {
    description: String,
    vision: String,
    mission: String,
    highlights: [{
      text: String,
      isVisible: { type: Boolean, default: true }
    }],
    isVisible: { type: Boolean, default: true }
  },
  // Skills Section
  skills: [{
    name: String,
    category: String, // e.g., Technical, Soft Skills, Design, Legal, etc.
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    },
    isVisible: { type: Boolean, default: true }
  }],
  // Experience Section
  experience: [{
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String,
    achievements: [String],
    isVisible: { type: Boolean, default: true }
  }],
  // Education Section
  education: [{
    institution: String,
    degree: String,
    field: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    gpa: String,
    achievements: [String],
    isVisible: { type: Boolean, default: true }
  }],
  // Projects Section
  projects: [{
    title: String,
    description: String,
    role: String,
    technologies: [String],
    images: [String],
    liveUrl: String,
    sourceUrl: String,
    startDate: Date,
    endDate: Date,
    achievements: [String],
    isVisible: { type: Boolean, default: true }
  }],
  // Certifications Section
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String,
    description: String,
    isVisible: { type: Boolean, default: true }
  }],
  // Publications/Blogs Section
  publications: [{
    title: String,
    publisher: String,
    publicationDate: Date,
    description: String,
    url: String,
    image: String,
    isVisible: { type: Boolean, default: true }
  }],
  // Awards and Achievements
  awards: [{
    title: String,
    issuer: String,
    date: Date,
    description: String,
    image: String,
    isVisible: { type: Boolean, default: true }
  }],
  // Services (for freelancers/professionals)
  services: [{
    title: String,
    description: String,
    image: String,
    price: String,
    features: [String],
    isVisible: { type: Boolean, default: true }
  }],
  // Custom Sections for flexibility
  customSections: [{
    title: String,
    content: String,
    type: String, // can be 'text', 'gallery', 'list', etc.
    items: [{
      title: String,
      description: String,
      image: String,
      url: String
    }],
    order: Number,
    isVisible: { type: Boolean, default: true }
  }],
  // Portfolio Type
  portfolioType: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const PortfolioData = mongoose.model('PortfolioData', portfolioDataSchema);
module.exports = PortfolioData; 