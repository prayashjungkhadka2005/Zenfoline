import React, { useEffect } from "react";
import WebFont from "webfontloader";
import profile from "../assets/profile.png";
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaCode, 
  FaServer, 
  FaDatabase, 
  FaTools, 
  FaCloud,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaStar,
  FaRocket,
  FaLightbulb,
  FaCheckCircle,
  FaTrophy,
  FaUsers,
  FaCogs,
  FaChartLine,
  FaShieldAlt,
  FaHeart
} from 'react-icons/fa';

// Icon mapping object
const iconMap = {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaCode,
  FaServer,
  FaDatabase,
  FaTools,
  FaCloud,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaStar,
  FaRocket,
  FaLightbulb,
  FaCheckCircle,
  FaTrophy,
  FaUsers,
  FaCogs,
  FaChartLine,
  FaShieldAlt,
  FaHeart
};

// Helper function to get icon component
const getIconComponent = (iconName) => {
  return iconMap[iconName] || FaCode;
};

const ExpertPortfolioTemplate = ({ fontStyle = 'Poppins', template, data }) => {
  const currentFontStyle = fontStyle || (data?.theme?.fontStyle) || 'Poppins';

  useEffect(() => {
    if (currentFontStyle) {
      WebFont.load({
        google: {
          families: [currentFontStyle],
        },
      });
    }
  }, [currentFontStyle]);

  // Helper function to get skill level percentage
  const getSkillLevelPercentage = (level) => {
    switch (level?.toLowerCase()) {
      case 'expert': return 100;
      case 'advanced': return 85;
      case 'intermediate': return 70;
      case 'beginner': return 50;
      default: return 50;
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Helper function to check if a section is enabled
  const isSectionEnabled = (sectionId) => {
    return data?.theme?.enabledSections?.[sectionId] !== false;
  };

  return (
    <div
      style={{
        fontFamily: `${currentFontStyle}, ${
          ["Inria Serif", "Crimson Text", "Source Serif Pro", "Playfair Display", "Lobster"].includes(
            currentFontStyle
          )
            ? "serif"
            : "sans-serif"
        }`,
      }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
    >
      {/* Navigation */}
      <nav className="fixed w-full bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{data?.basics?.name || 'Developer Portfolio'}</h1>
          <div className="flex gap-6">
            {isSectionEnabled('about') && data?.about?.description && (
              <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
            )}
            {isSectionEnabled('skills') && (data?.skills?.technical?.length > 0 || data?.skills?.soft?.length > 0) && (
              <a href="#skills" className="hover:text-orange-500 transition-colors">Skills</a>
            )}
            {isSectionEnabled('projects') && data?.projects?.length > 0 && (
              <a href="#projects" className="hover:text-orange-500 transition-colors">Projects</a>
            )}
            {isSectionEnabled('experience') && data?.experience?.length > 0 && (
              <a href="#experience" className="hover:text-orange-500 transition-colors">Experience</a>
            )}
            <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 animate-gradient"></div>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {data?.basics?.name || 'Full Stack'} <span className="text-orange-500 break-words">{data?.basics?.role || 'Developer'}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {data?.basics?.bio || 'Crafting exceptional digital experiences with cutting-edge technology'}
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              {isSectionEnabled('projects') && data?.projects?.length > 0 && (
                <a href="#projects" className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                  View Projects
                </a>
              )}
              <a href="#contact" className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                Contact Me
              </a>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-orange-500 shadow-2xl transform hover:scale-105 transition-transform">
              <img
                src={data?.basics?.profileImage || profile}
                alt={data?.basics?.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {isSectionEnabled('about') && data?.about?.description && (
        <section id="about" className="py-20 bg-black bg-opacity-50">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-300 mb-8">{data.about.description}</p>
              {data.about.highlights?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.about.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {highlight.icon ? (
                        React.createElement(getIconComponent(highlight.icon), {
                          className: "text-orange-500 w-5 h-5"
                        })
                      ) : (
                        <FaCode className="text-orange-500 w-5 h-5" />
                      )}
                      <span>{highlight.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {isSectionEnabled('skills') && (data?.skills?.technical?.length > 0 || data?.skills?.soft?.length > 0) && (
        <section id="skills" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">Technical Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Technical Skills */}
              {data.skills.technical?.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Technical Skills</h3>
                  <div className="space-y-4">
                    {data.skills.technical.map((skill, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-orange-500">{skill.level}</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${getSkillLevelPercentage(skill.level)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {data.skills.soft?.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Soft Skills</h3>
                  <div className="space-y-4">
                    {data.skills.soft.map((skill, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-orange-500">{skill.level}</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${getSkillLevelPercentage(skill.level)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {isSectionEnabled('projects') && data?.projects?.length > 0 && (
        <section id="projects" className="py-20 bg-black bg-opacity-50">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                >
                  {project.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(Array.isArray(project.technologies) 
                        ? project.technologies 
                        : project.technologies?.split(',').map(tech => tech.trim())
                      )?.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-orange-500 bg-opacity-20 text-orange-500 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-400"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.sourceCode && (
                        <a
                          href={project.sourceCode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-400"
                        >
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {isSectionEnabled('experience') && data?.experience?.length > 0 && (
        <section id="experience" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">Work Experience</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {data.experience.map((exp, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>
                  <div className="text-orange-500 mb-4">{exp.company} | {exp.location}</div>
                  <div className="text-gray-400 mb-4">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black bg-opacity-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
          <p className="text-xl text-gray-400 mb-8">
            Ready to start your next project? Get in touch!
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {data?.basics?.email && (
              <a
                href={`mailto:${data.basics.email}`}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
              >
                {data.basics.socialIcons?.email ? (
                  React.createElement(getIconComponent(data.basics.socialIcons.email), {
                    className: "w-5 h-5"
                  })
                ) : (
                  <FaEnvelope className="w-5 h-5" />
                )}
                Email Me
              </a>
            )}
            {data?.basics?.socialLinks?.linkedin && (
              <a
                href={data.basics.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all"
              >
                {data.basics.socialIcons?.linkedin ? (
                  React.createElement(getIconComponent(data.basics.socialIcons.linkedin), {
                    className: "w-5 h-5"
                  })
                ) : (
                  <FaLinkedin className="w-5 h-5" />
                )}
                LinkedIn
              </a>
            )}
            {data?.basics?.socialLinks?.github && (
              <a
                href={data.basics.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all"
              >
                {data.basics.socialIcons?.github ? (
                  React.createElement(getIconComponent(data.basics.socialIcons.github), {
                    className: "w-5 h-5"
                  })
                ) : (
                  <FaGithub className="w-5 h-5" />
                )}
                GitHub
              </a>
            )}
            {data?.basics?.phone && (
              <a
                href={`tel:${data.basics.phone}`}
                className="flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all"
              >
                {data.basics.socialIcons?.phone ? (
                  React.createElement(getIconComponent(data.basics.socialIcons.phone), {
                    className: "w-5 h-5"
                  })
                ) : (
                  <FaPhone className="w-5 h-5" />
                )}
                Call Me
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {data?.basics?.name || 'Developer Portfolio'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ExpertPortfolioTemplate; 