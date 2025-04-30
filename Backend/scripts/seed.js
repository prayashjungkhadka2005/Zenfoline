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
    name: 'Modern Portfolio',
    description: 'A clean, modern template for professionals.',
    image: '/images/templates/modern.png',
    category: 'professional',
    predefinedTemplate: 'modern',
  },
  {
    name: 'Creative Portfolio',
    description: 'A vibrant template for creatives.',
    image: '/images/templates/creative.png',
    category: 'creative',
    predefinedTemplate: 'creative',
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
  await mongoose.connect('mongodb+srv://prayashjungkhadka:1415@user.uvnkq.mongodb.net/?retryWrites=true&w=majority&appName=User'); // Atlas connection string
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
        portfolioType: 'professional'
      });
      console.log('Seeded portfolio data for user.');
    }

    // Theme
    const themeExists = await Theme.findOne({ userId: user._id });
    if (!themeExists) {
      await Theme.create({
        userId: user._id,
        activeTemplateId: template._id,
        colorMode: 'default',
        fontStyle: 'Poppins'
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