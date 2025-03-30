const mongoose = require('mongoose');

const portfolioDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  // Basic Information
  basics: {
    name: String,
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
  // Social Links
  socialLinks: [{
    platform: String,
    url: String,
    isVisible: { type: Boolean, default: true }
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
    enum: ['developer', 'student', 'content-creator', 'designer', 'lawyer'],
    required: true
  }
}, {
  timestamps: true
});

const PortfolioData = mongoose.model('PortfolioData', portfolioDataSchema);
module.exports = PortfolioData; 