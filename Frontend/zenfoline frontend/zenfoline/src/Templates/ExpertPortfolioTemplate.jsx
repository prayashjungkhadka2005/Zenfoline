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

  // Helper function to get social link URL
  const getSocialLink = (platform) => {
    return data?.socialLinks?.find(link => link.platform === platform)?.url || '';
  };

  // Helper function to check if a section has meaningful data
  const hasSectionData = (sectionId) => {
    switch (sectionId) {
      case 'basics':
        return data?.basics?.name || data?.basics?.title || data?.basics?.summary;
      case 'about':
        return data?.about?.description && data?.about?.description.trim() !== '';
      case 'skills':
        return (data?.skills?.technical?.some(skill => skill.name && skill.name.trim() !== '') ||
                data?.skills?.soft?.some(skill => skill.name && skill.name.trim() !== ''));
      case 'experience':
        return data?.experience?.some(exp => exp.title || exp.company || exp.description);
      case 'projects':
        return data?.projects?.some(project => project.title || project.description);
      default:
        return false;
    }
  };

  // Helper function to check if a section is enabled and has data
  const shouldShowSection = (sectionId) => {
    return isSectionEnabled(sectionId) && hasSectionData(sectionId);
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
            {shouldShowSection('about') && (
              <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
            )}
            {shouldShowSection('skills') && (
              <a href="#skills" className="hover:text-orange-500 transition-colors">Skills</a>
            )}
            {shouldShowSection('projects') && (
              <a href="#projects" className="hover:text-orange-500 transition-colors">Projects</a>
            )}
            {shouldShowSection('experience') && (
              <a href="#experience" className="hover:text-orange-500 transition-colors">Experience</a>
            )}
            {hasSectionData('basics') && (
              <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {hasSectionData('basics') && (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 animate-gradient"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                {data?.basics?.name || 'Full Stack'}
                <br />
                <span className="text-orange-500 break-words">{data?.basics?.title || 'Developer'}</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {data?.basics?.summary || 'Crafting exceptional digital experiences with cutting-edge technology'}
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                {shouldShowSection('projects') && data?.projects?.length > 0 && (
                  <a href="#projects" className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors flex items-center gap-2">
                    <FaCode className="w-5 h-5" />
                    View Projects
                  </a>
                )}
                <a href="#contact" className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2">
                  <FaEnvelope className="w-5 h-5" />
                  Contact Me
                </a>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-orange-500 shadow-2xl transform hover:scale-105 transition-transform">
                <img
                  src={data?.basics?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                  alt={data?.basics?.name || 'Profile'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {shouldShowSection('about') && data?.about?.description && (
        <section id="about" className="py-20 bg-black bg-opacity-50 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-300 mb-8">{data.about.description}</p>
              {data.about.highlights?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.about.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg">
                      <FaCode className="text-orange-500 w-5 h-5" />
                      <span className="text-gray-300">{highlight.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {shouldShowSection('skills') && (data?.skills?.technical?.length > 0 || data?.skills?.soft?.length > 0) && (
        <section id="skills" className="py-20 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-12">Technical Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Technical Skills */}
              {data.skills.technical?.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Technical Skills</h3>
                  <div className="space-y-4">
                    {data.skills.technical.map((skill, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-300">{skill.name}</span>
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
                          <span className="font-medium text-gray-300">{skill.name}</span>
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
      {shouldShowSection('projects') && data?.projects?.length > 0 && (
        <section id="projects" className="py-20 bg-black bg-opacity-50 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {data.projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image || [
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                      ][index % 4]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = [
                          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                          'https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                          'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        ][index % 4];
                      }}
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                    <p className="text-gray-400 mb-6 line-clamp-3 text-lg">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(Array.isArray(project.technologies) 
                        ? project.technologies 
                        : project.technologies?.split(',').map(tech => tech.trim())
                      )?.map((tech, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-orange-500 bg-opacity-20 text-orange-500 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-6">
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-lg"
                        >
                          <FaGlobe className="w-5 h-5" />
                          Live Demo
                        </a>
                      )}
                      {project.sourceCode && (
                        <a
                          href={project.sourceCode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-lg"
                        >
                          <FaCode className="w-5 h-5" />
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
      {shouldShowSection('experience') && data?.experience?.length > 0 && (
        <section id="experience" className="py-20 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-12">Work Experience</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {data.experience.map((exp, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg hover:transform hover:scale-102 transition-all duration-300">
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
      {hasSectionData('basics') && (
        <section id="contact" className="py-20 bg-black bg-opacity-50 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
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
                  <FaEnvelope className="w-5 h-5" />
                  Email Me
                </a>
              )}
              {getSocialLink('linkedin') && (
                <a
                  href={`https://linkedin.com/in/${getSocialLink('linkedin')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all"
                >
                  <FaLinkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              )}
              {getSocialLink('github') && (
                <a
                  href={`https://github.com/${getSocialLink('github')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all"
                >
                  <FaGithub className="w-5 h-5" />
                  GitHub
                </a>
              )}
              {data?.basics?.phone && (
                <a
                  href={`tel:${data.basics.phone}`}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all"
                >
                  <FaPhone className="w-5 h-5" />
                  Call Me
                </a>
              )}
            </div>
          </div>
        </section>
      )}

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