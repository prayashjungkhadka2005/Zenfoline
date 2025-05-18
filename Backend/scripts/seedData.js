const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Template = require('../models/Templates');
const PortfolioData = require('../models/PortfolioData');
const Analytics = require('../models/Analytics');
const Theme = require('../models/ThemeSchema');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGOURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample templates data
const templatesData = [
  {
    name: "Professional Developer",
    description: "A clean and professional template for developers",
    image: "professional", // Using the image name you provided
    category: "developer",
    predefinedTemplate: "professional",
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
    name: "Creative Designer",
    description: "A modern and creative template for designers",
    image: "creative", // Using the image name you provided
    category: "designer",
    predefinedTemplate: "creative",
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

// Sample users data with data type
const usersData = [
  {
    email: "developer1@example.com",
    password: "password123",
    portfolioType: "developer",
    dataType: "complete" // Complete profile
  },
  {
    email: "developer2@example.com",
    password: "password123",
    portfolioType: "developer",
    dataType: "minimal" // Minimal profile
  },
  {
    email: "developer3@example.com",
    password: "password123",
    portfolioType: "developer",
    dataType: "partial" // Partial profile
  },
  {
    email: "designer1@example.com",
    password: "password123",
    portfolioType: "designer",
    dataType: "complete" // Complete profile
  },
  {
    email: "designer2@example.com",
    password: "password123",
    portfolioType: "designer",
    dataType: "minimal" // Minimal profile
  },
  {
    email: "designer3@example.com",
    password: "password123",
    portfolioType: "designer",
    dataType: "partial" // Partial profile
  }
];

// Sample portfolio data for different types
const portfolioData = {
  developer: {
    complete: {
      basics: {
        name: "John Doe",
        role: "Senior Full Stack Developer",
        bio: "Passionate about building scalable web applications",
        title: "Full Stack Developer",
        summary: "Experienced developer with expertise in MERN stack",
        email: "developer1@example.com",
        phone: "+1234567890",
        location: "San Francisco, CA",
        website: "https://johndoe.dev",
        profileImage: "/uploads/1745896277859-Screenshot 2025-04-29 023739.png",
        coverImage: "/uploads/1745896493488-Screenshot 2025-04-29 085702.png",
        isVisible: true
      },
      socialLinks: [
        {
          platform: "github",
          url: "https://github.com/johndoe",
          displayName: "GitHub",
          icon: "fa-github",
          isVisible: true,
          order: 1
        },
        {
          platform: "linkedin",
          url: "https://linkedin.com/in/johndoe",
          displayName: "LinkedIn",
          icon: "fa-linkedin",
          isVisible: true,
          order: 2
        }
      ],
      about: {
        description: "Full stack developer with 8+ years of experience",
        vision: "To build innovative solutions that make a difference",
        mission: "Delivering high-quality, scalable applications",
        highlights: [
          { text: "8+ years of experience", isVisible: true },
          { text: "Expert in MERN stack", isVisible: true }
        ],
        isVisible: true
      },
      skills: [
        {
          name: "JavaScript",
          category: "Technical",
          proficiency: "Expert",
          isVisible: true
        },
        {
          name: "React",
          category: "Frontend",
          proficiency: "Expert",
          isVisible: true
        }
      ],
      experience: [
        {
          title: "Senior Developer",
          company: "Tech Corp",
          location: "San Francisco",
          startDate: new Date("2020-01-01"),
          endDate: null,
          current: true,
          description: "Leading development team",
          achievements: ["Improved performance by 50%"],
          isVisible: true
        }
      ],
      education: [
        {
          institution: "Stanford University",
          degree: "MS",
          field: "Computer Science",
          location: "Stanford, CA",
          startDate: new Date("2014-09-01"),
          endDate: new Date("2016-06-01"),
          current: false,
          gpa: "3.8",
          achievements: ["Dean's List"],
          isVisible: true
        }
      ],
      projects: [
        {
          title: "E-commerce Platform",
          description: "Full stack e-commerce solution",
          role: "Lead Developer",
          technologies: ["React", "Node.js", "MongoDB"],
          images: ["/uploads/1737719923127-Screenshot 2025-01-18 163951.png"],
          liveUrl: "https://project1.com",
          sourceUrl: "https://github.com/project1",
          startDate: new Date("2022-01-01"),
          endDate: new Date("2022-06-01"),
          achievements: ["100k+ users"],
          isVisible: true
        }
      ],
      certifications: [
        {
          name: "AWS Certified Developer",
          issuer: "Amazon",
          issueDate: new Date("2021-01-01"),
          expiryDate: new Date("2024-01-01"),
          credentialId: "AWS123",
          credentialUrl: "https://aws.com/cert",
          description: "Professional certification",
          isVisible: true
        }
      ],
      publications: [
        {
          title: "Building Scalable Applications",
          publisher: "Tech Journal",
          publicationDate: new Date("2022-01-01"),
          description: "Best practices for scaling",
          url: "https://techjournal.com/article",
          image: "/uploads/1737628322754-c0a9e0ca62d84e149b5633446d899969-free.png",
          isVisible: true
        }
      ],
      awards: [
        {
          title: "Best Developer 2022",
          issuer: "Tech Awards",
          date: new Date("2022-12-01"),
          description: "Recognition for excellence",
          image: "/uploads/1743864245507-pin.png",
          isVisible: true
        }
      ],
      services: [
        {
          title: "Web Development",
          description: "Custom web applications",
          image: "/uploads/1737628322754-c0a9e0ca62d84e149b5633446d899969-free.png",
          price: "$100/hour",
          features: ["Custom Development", "24/7 Support"],
          isVisible: true
        }
      ]
    },
    minimal: {
      basics: {
        name: "Dev Minimal",
        role: "Junior Developer",
        bio: "Starting my journey in web development",
        title: "Junior Web Developer",
        summary: "Fresh graduate with passion for coding",
        email: "developer2@example.com",
        phone: "+1234567890",
        location: "New York, NY",
        profileImage: "/uploads/1742217153698-download.jfif",
        isVisible: true
      },
      skills: [
        {
          name: "HTML",
          category: "Frontend",
          proficiency: "Intermediate",
          isVisible: true
        },
        {
          name: "CSS",
          category: "Frontend",
          proficiency: "Intermediate",
          isVisible: true
        },
        {
          name: "JavaScript",
          category: "Programming",
          proficiency: "Beginner",
          isVisible: true
        }
      ],
      education: [
        {
          institution: "City University",
          degree: "BS",
          field: "Computer Science",
          location: "New York",
          startDate: new Date("2019-09-01"),
          endDate: new Date("2023-06-01"),
          current: false,
          isVisible: true
        }
      ]
    },
    partial: {
      basics: {
        name: "Dev Partial",
        role: "Web Developer",
        bio: "Building the web, one line at a time",
        title: "Web Developer",
        summary: "Focused on frontend development",
        email: "developer3@example.com",
        phone: "+1234567890",
        location: "Chicago, IL",
        isVisible: true
      },
      skills: [
        {
          name: "React",
          category: "Frontend",
          proficiency: "Intermediate",
          isVisible: true
        },
        {
          name: "Node.js",
          category: "Backend",
          proficiency: "Beginner",
          isVisible: true
        }
      ],
      projects: [
        {
          title: "Personal Blog",
          description: "A blog built with React and Node.js",
          role: "Developer",
          technologies: ["React", "Node.js", "MongoDB"],
          liveUrl: "https://myblog.com",
          images: ["/uploads/1737719923127-Screenshot 2025-01-18 163951.png"],
          isVisible: true
        }
      ],
      education: [
        {
          institution: "Tech Bootcamp",
          degree: "Certificate",
          field: "Full Stack Development",
          location: "Chicago",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2023-06-01"),
          current: false,
          isVisible: true
        }
      ]
    }
  },
  designer: {
    complete: {
      basics: {
        name: "Sarah Jones",
        role: "Senior UI/UX Designer",
        bio: "Creating beautiful user experiences",
        title: "UI/UX Designer",
        summary: "Passionate about design",
        email: "designer1@example.com",
        phone: "+1234567890",
        location: "London, UK",
        website: "https://sarahjones.design",
        profileImage: "/uploads/1743857012711-eleven-stranger-things-uamb92s7v4syrz9e.jpg",
        coverImage: "/uploads/1743864245507-pin.png",
        isVisible: true
      },
      socialLinks: [
        {
          platform: "behance",
          url: "https://behance.net/sarahjones",
          displayName: "Behance",
          icon: "fa-behance",
          isVisible: true,
          order: 1
        },
        {
          platform: "dribbble",
          url: "https://dribbble.com/sarahjones",
          displayName: "Dribbble",
          icon: "fa-dribbble",
          isVisible: true,
          order: 2
        }
      ],
      about: {
        description: "UI/UX designer with 6+ years of experience",
        vision: "To create intuitive and beautiful interfaces",
        mission: "Designing for the user",
        highlights: [
          { text: "6+ years of experience", isVisible: true },
          { text: "Expert in UI/UX", isVisible: true }
        ],
        isVisible: true
      },
      skills: [
        {
          name: "UI Design",
          category: "Design",
          proficiency: "Expert",
          isVisible: true
        },
        {
          name: "UX Research",
          category: "Design",
          proficiency: "Expert",
          isVisible: true
        }
      ],
      experience: [
        {
          title: "Senior Designer",
          company: "Design Studio",
          location: "London",
          startDate: new Date("2019-01-01"),
          endDate: null,
          current: true,
          description: "Leading design team",
          achievements: ["Improved user satisfaction by 40%"],
          isVisible: true
        }
      ],
      education: [
        {
          institution: "Royal College of Art",
          degree: "MA",
          field: "Design",
          location: "London, UK",
          startDate: new Date("2015-09-01"),
          endDate: new Date("2017-06-01"),
          current: false,
          achievements: ["Best Thesis Award"],
          isVisible: true
        }
      ],
      projects: [
        {
          title: "Mobile App Redesign",
          description: "Complete UI/UX overhaul",
          role: "Lead Designer",
          technologies: ["Figma", "Sketch"],
          images: ["/uploads/1738326003525-467105749_1760507594726565_350810348785686048_n.gif"],
          liveUrl: "https://project1.com",
          startDate: new Date("2022-01-01"),
          endDate: new Date("2022-06-01"),
          achievements: ["50k+ downloads"],
          isVisible: true
        }
      ],
      certifications: [
        {
          name: "Google UX Design",
          issuer: "Google",
          issueDate: new Date("2021-01-01"),
          expiryDate: new Date("2024-01-01"),
          credentialId: "GOOGLE123",
          credentialUrl: "https://google.com/cert",
          description: "Professional certification",
          isVisible: true
        }
      ],
      publications: [
        {
          title: "The Future of UI Design",
          publisher: "Design Journal",
          publicationDate: new Date("2022-01-01"),
          description: "Trends in UI design",
          url: "https://designjournal.com/article",
          image: "/uploads/1743864375838-pin.png",
          isVisible: true
        }
      ],
      awards: [
        {
          title: "Best Designer 2022",
          issuer: "Design Awards",
          date: new Date("2022-12-01"),
          description: "Recognition for excellence",
          image: "/uploads/1738326003525-467105749_1760507594726565_350810348785686048_n.gif",
          isVisible: true
        }
      ],
      services: [
        {
          title: "UI/UX Design",
          description: "Custom design solutions",
          image: "/uploads/1737721007815-c0a9e0ca62d84e149b5633446d899969-free.png",
          price: "$100/hour",
          features: ["UI Design", "UX Research"],
          isVisible: true
        }
      ]
    },
    minimal: {
      basics: {
        name: "Design Minimal",
        role: "UI Designer",
        bio: "Beginning my design journey",
        title: "Junior UI Designer",
        summary: "Fresh graduate with an eye for design",
        email: "designer2@example.com",
        phone: "+1234567890",
        location: "Los Angeles, CA",
        profileImage: "/uploads/1742217213963-download.jfif",
        isVisible: true
      },
      skills: [
        {
          name: "Figma",
          category: "Design",
          proficiency: "Intermediate",
          isVisible: true
        },
        {
          name: "Adobe XD",
          category: "Design",
          proficiency: "Beginner",
          isVisible: true
        }
      ],
      education: [
        {
          institution: "Design Institute",
          degree: "BA",
          field: "Graphic Design",
          location: "Los Angeles",
          startDate: new Date("2019-09-01"),
          endDate: new Date("2023-06-01"),
          current: false,
          isVisible: true
        }
      ]
    },
    partial: {
      basics: {
        name: "Design Partial",
        role: "UX Designer",
        bio: "Creating user-centered experiences",
        title: "UX Designer",
        summary: "Focused on user experience and interaction design",
        email: "designer3@example.com",
        phone: "+1234567890",
        location: "Seattle, WA",
        isVisible: true
      },
      skills: [
        {
          name: "User Research",
          category: "UX",
          proficiency: "Intermediate",
          isVisible: true
        },
        {
          name: "Prototyping",
          category: "UX",
          proficiency: "Intermediate",
          isVisible: true
        },
        {
          name: "Wireframing",
          category: "UX",
          proficiency: "Advanced",
          isVisible: true
        }
      ],
      projects: [
        {
          title: "Food Delivery App",
          description: "UX design for a food delivery application",
          role: "UX Designer",
          technologies: ["Figma", "Miro"],
          images: ["/uploads/1737719923127-Screenshot 2025-01-18 163951.png"],
          isVisible: true
        }
      ],
      education: [
        {
          institution: "UX Design School",
          degree: "Certificate",
          field: "User Experience Design",
          location: "Seattle",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2023-06-01"),
          current: false,
          isVisible: true
        }
      ]
    }
  }
};

// Sample analytics data
const analyticsData = {
  developer: [
    {
      sessionId: "session1",
      deviceType: "desktop",
      country: "United States",
      trafficSource: "google",
      browser: "Chrome",
      browserVersion: "120.0.0",
      os: "Windows",
      osVersion: "10",
      pageViews: 5,
      sessionDuration: 300,
      isUniqueVisitor: true,
      isBounce: false
    },
    {
      sessionId: "session2",
      deviceType: "mobile",
      country: "United Kingdom",
      trafficSource: "linkedin",
      browser: "Safari",
      browserVersion: "17.0",
      os: "iOS",
      osVersion: "17.0",
      pageViews: 3,
      sessionDuration: 180,
      isUniqueVisitor: true,
      isBounce: true
    }
  ],
  designer: [
    {
      sessionId: "session3",
      deviceType: "desktop",
      country: "Canada",
      trafficSource: "direct",
      browser: "Firefox",
      browserVersion: "121.0",
      os: "macOS",
      osVersion: "13.0",
      pageViews: 8,
      sessionDuration: 600,
      isUniqueVisitor: true,
      isBounce: false
    },
    {
      sessionId: "session4",
      deviceType: "tablet",
      country: "Australia",
      trafficSource: "facebook",
      browser: "Safari",
      browserVersion: "16.0",
      os: "iPadOS",
      osVersion: "16.0",
      pageViews: 4,
      sessionDuration: 240,
      isUniqueVisitor: true,
      isBounce: false
    }
  ]
};

// Sample theme data
const themeData = {
  developer: {
    colorMode: "light",
    presetTheme: "professional",
    fontStyle: "Roboto",
    navigationBar: "fixed",
    footer: "minimal"
  },
  designer: {
    colorMode: "dark",
    presetTheme: "creative",
    fontStyle: "Poppins",
    navigationBar: "floating",
    footer: "modern"
  }
};

// Function to seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Template.deleteMany({});
    await PortfolioData.deleteMany({});
    await Analytics.deleteMany({});
    await Theme.deleteMany({});

    // Create templates
    const templates = await Template.insertMany(templatesData);
    console.log('Templates created successfully');

    // Create users and their portfolio data
    for (const userData of usersData) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await User.create({
        email: userData.email,
        password: hashedPassword,
        selectedTemplate: templates.find(t => t.category === userData.portfolioType)._id,
        verified: true,
        status: 'active'
      });

      // Get template for this user
      const template = templates.find(t => t.category === userData.portfolioType);

      // Create portfolio data based on data type
      const userPortfolioData = portfolioData[userData.portfolioType][userData.dataType];
      
      const portfolio = await PortfolioData.create({
        userId: user._id.toString(), // Convert ObjectId to string
        templateId: template._id,
        portfolioType: userData.portfolioType, // Required field
        ...userPortfolioData
      });

      // Create theme data
      await Theme.create({
        userId: user._id,
        activeTemplateId: template._id,
        ...themeData[userData.portfolioType]
      });

      // Create analytics data
      const userAnalytics = analyticsData[userData.portfolioType].map(analytics => ({
        userId: user._id.toString(),
        ...analytics
      }));
      await Analytics.insertMany(userAnalytics);

      // Update user with portfolio reference
      user.portfolioData = portfolio._id;
      await user.save();

      console.log(`Created user ${userData.email} with ${userData.dataType} profile`);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase(); 