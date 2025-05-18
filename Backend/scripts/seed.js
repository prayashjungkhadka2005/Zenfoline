const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Adjust if your .env is elsewhere

// Import models
const User = require('../models/User');
const Template = require('../models/Templates');
const Theme = require('../models/ThemeSchema');
const PortfolioData = require('../models/PortfolioData');

// Sample data
const templates = [
  {
    name: 'Professional Developer',
    description: 'A clean and professional template for developers',
    image: 'professional',
    category: 'developer',
    predefinedTemplate: 'professional',
    sectionConfiguration: {
      basics: { isEnabled: true, order: 1 },
      about: { isEnabled: true, order: 2 },
      skills: { isEnabled: true, order: 3, displayStyle: 'grid' },
      experience: { isEnabled: true, order: 4 },
      education: { isEnabled: true, order: 5 },
      projects: { isEnabled: true, order: 6, displayStyle: 'grid' },
      certifications: { isEnabled: true, order: 7 },
      publications: { isEnabled: true, order: 8 },
      awards: { isEnabled: true, order: 9 },
      services: { isEnabled: true, order: 10 },
      customSections: { isEnabled: true }
    }
  },
  {
    name: 'Creative Designer',
    description: 'A modern and creative template for designers',
    image: 'creative',
    category: 'designer',
    predefinedTemplate: 'creative',
    sectionConfiguration: {
      basics: { isEnabled: true, order: 1 },
      about: { isEnabled: true, order: 2 },
      skills: { isEnabled: true, order: 3, displayStyle: 'cloud' },
      experience: { isEnabled: true, order: 4 },
      education: { isEnabled: true, order: 5 },
      projects: { isEnabled: true, order: 6, displayStyle: 'grid' },
      certifications: { isEnabled: true, order: 7 },
      publications: { isEnabled: true, order: 8 },
      awards: { isEnabled: true, order: 9 },
      services: { isEnabled: true, order: 10 },
      customSections: { isEnabled: true }
    }
  }
];

const users = [
  {
    email: 'admin@zenfoline.com',
    password: 'securepassword', // Should be hashed in production
    verified: true,
    status: 'active'
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGOURL); // Use environment variable for connection string
  console.log('Connected to MongoDB for seeding.');

  // Seed Templates
  for (const t of templates) {
    const exists = await Template.findOne({ name: t.name });
    if (!exists) {
      await Template.create(t);
      console.log(`Seeded template: ${t.name}`);
    }
  }

  // Seed Users
  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u);
      console.log(`Seeded user: ${u.email}`);
    }
  }

  // Optionally, seed PortfolioData and Theme for the user
  const user = await User.findOne({ email: users[0].email });
  const template = await Template.findOne({ name: templates[0].name });

  if (user && template) {
    // PortfolioData
    const pdExists = await PortfolioData.findOne({ userId: user._id });
    if (!pdExists) {
      await PortfolioData.create({
        userId: user._id,
        templateId: template._id,
        basics: { name: 'Admin User', email: user.email, isVisible: true },
        portfolioType: 'developer' // Changed to developer as default
      });
      console.log('Seeded portfolio data for user.');
    }

    // Theme
    const themeExists = await Theme.findOne({ userId: user._id });
    if (!themeExists) {
      await Theme.create({
        userId: user._id,
        activeTemplateId: template._id,
        colorMode: 'light', // Updated to match your theme
        fontStyle: 'Poppins',
        presetTheme: 'professional' // Added to match your theme data
      });
      console.log('Seeded theme for user.');
    }
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
}); 