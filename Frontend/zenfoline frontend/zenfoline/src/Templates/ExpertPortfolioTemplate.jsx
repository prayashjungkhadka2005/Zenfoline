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
  FaHeart,
  FaEdit,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { useTemplateMode } from './TemplateContext';

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

const ExpertPortfolioTemplate = ({ fontStyle = 'Poppins', template, data, availableSections, checkSectionData, sectionVisibility = {} }) => {
  const { mode } = useTemplateMode();
  const isPreviewMode = mode === 'preview';
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
    // Check the sectionVisibility prop directly (it's { sectionId: boolean })
    if (sectionVisibility && sectionVisibility[sectionId] !== undefined) {
      return sectionVisibility[sectionId]; // Directly return the boolean value
    }
    
    // Fallback to theme settings if visibility prop doesn't have the section
    return data?.theme?.enabledSections?.[sectionId] !== false;
  };

  // Helper function to get social link URL
  const getSocialLink = (platform) => {
    return data?.socialLinks?.find(link => link.platform === platform)?.url || '';
  };

  // Helper function to check if a section has data
  const hasSectionData = (sectionId) => {
    return checkSectionData(sectionId);
  };

  // Helper function to check if a section should be rendered
  const shouldRenderSection = (sectionId) => {
    // In preview mode, only render enabled sections
    if (isPreviewMode) {
      return isSectionEnabled(sectionId);
    }
    // In public mode, only render sections with data
    return isSectionEnabled(sectionId) && hasSectionData(sectionId);
  };

  // Log available sections for debugging
  console.log('Available sections in template:', availableSections);
  console.log('Section visibility in template:', sectionVisibility);
  console.log('Data in template:', data);

  // Check if any sections are available
  const hasAvailableSections = availableSections && availableSections.length > 0;

  // Default sections for expert category
  const defaultExpertSections = [
    'basics', 
    'about', 
    'skills', 
    'experience', 
    'projects', 
    'publications', 
    'certifications', 
    'services'
  ];

  // Use default sections if no sections are available, but filter out disabled ones
  const sectionsToRender = (hasAvailableSections ? availableSections : defaultExpertSections)
    .filter(sectionId => isSectionEnabled(sectionId));

  // Check if we should show the empty state message
  const showEmptyState = isPreviewMode && sectionsToRender.length === 0;

  // Preview mode section indicator component
  const SectionIndicator = ({ sectionId }) => {
    return null; // Disabled section indicators
  };

  // Empty section placeholder component
  const EmptySectionPlaceholder = ({ sectionId }) => {
    return null; // Disabled empty section placeholders
  };

  // Preview mode edit button component
  const EditButton = ({ sectionId }) => {
    return null; // Disabled edit buttons
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
      className={`min-h-screen ${isPreviewMode ? 'preview-mode relative' : 'public-mode'} bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white`}
    >
      {/* Empty State for Preview Mode */}
      {showEmptyState ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center text-white p-4">
            <h3 className="text-2xl font-medium mb-4">Expert Portfolio Template</h3>
            <p className="text-lg text-gray-300 mb-2">No sections are currently enabled.</p>
            <p className="text-gray-400">Available sections for the expert category include:</p>
            <ul className="mt-4 space-y-2 text-gray-300">
              {defaultExpertSections.map((section) => (
                <li key={section} className="flex items-center justify-center gap-2">
                  <FaCheckCircle className="text-orange-500" />
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-gray-400">Enable sections in the template settings to start building your portfolio.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Navigation */}
          <nav className={`fixed w-full ${isPreviewMode ? 'bg-gray-800 top-0' : 'bg-black bg-opacity-50 backdrop-blur-sm top-0'} z-40`}>
            <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
                <h1 className="text-xl md:text-2xl font-bold">{data?.basics?.name || 'Developer Portfolio'}</h1>
                <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm md:text-base">
                  {sectionsToRender.includes('about') && (
                    <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
                  )}
                  {sectionsToRender.includes('skills') && (
                    <a href="#skills" className="hover:text-orange-500 transition-colors">Skills</a>
                  )}
                  {sectionsToRender.includes('projects') && (
                    <a href="#projects" className="hover:text-orange-500 transition-colors">Projects</a>
                  )}
                  {sectionsToRender.includes('experience') && (
                    <a href="#experience" className="hover:text-orange-500 transition-colors">Experience</a>
                  )}
                  {sectionsToRender.includes('publications') && (
                    <a href="#publications" className="hover:text-orange-500 transition-colors">Publications</a>
                  )}
                  {sectionsToRender.includes('certifications') && (
                    <a href="#certifications" className="hover:text-orange-500 transition-colors">Certifications</a>
                  )}
                  {sectionsToRender.includes('services') && (
                    <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
                  )}
                  {sectionsToRender.includes('basics') && (
                    <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          {sectionsToRender.includes('basics') && (
            <section className={`relative h-screen flex items-center justify-center overflow-hidden ${isPreviewMode ? 'pt-16' : ''}`}>
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
                    {shouldRenderSection('projects') && data?.projects?.length > 0 && (
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
              <SectionIndicator sectionId="basics" />
              {!hasSectionData('basics') && <EmptySectionPlaceholder sectionId="basics" />}
              <EditButton sectionId="basics" />
            </section>
          )}

          {/* About Section */}
          {sectionsToRender.includes('about') && (
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
              <SectionIndicator sectionId="about" />
              {!hasSectionData('about') && <EmptySectionPlaceholder sectionId="about" />}
              <EditButton sectionId="about" />
            </section>
          )}

          {/* Skills Section */}
          {sectionsToRender.includes('skills') && (
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
                              <span className="text-orange-500">{skill.proficiency || skill.level}</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2 rounded-full">
                              <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${getSkillLevelPercentage(skill.proficiency || skill.level)}%` }}
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
                              <span className="text-orange-500">{skill.proficiency || skill.level}</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2 rounded-full">
                              <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${getSkillLevelPercentage(skill.proficiency || skill.level)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <SectionIndicator sectionId="skills" />
              {!hasSectionData('skills') && <EmptySectionPlaceholder sectionId="skills" />}
              <EditButton sectionId="skills" />
            </section>
          )}

          {/* Projects Section */}
          {sectionsToRender.includes('projects') && (
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
                          src={project.images && project.images.length > 0 ? project.images[0] : [
                            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            'https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                          ][index % 4]}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image load error:', e.target.src);
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
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-lg"
                            >
                              <FaGlobe className="w-5 h-5" />
                              Live Demo
                            </a>
                          )}
                          {project.sourceUrl && (
                            <a
                              href={project.sourceUrl}
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
              <SectionIndicator sectionId="projects" />
              {!hasSectionData('projects') && <EmptySectionPlaceholder sectionId="projects" />}
              <EditButton sectionId="projects" />
            </section>
          )}

          {/* Publications Section */}
          {sectionsToRender.includes('publications') && (
            <section id="publications" className="py-20 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
              <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-12">Publications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                  {data.publications.map((publication, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={publication.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                          alt={publication.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold mb-4">{publication.title}</h3>
                        <p className="text-gray-400 mb-2">{publication.publisher}</p>
                        <p className="text-gray-400 mb-6">{formatDate(publication.date)}</p>
                        <p className="text-gray-300 mb-6 line-clamp-3">{publication.description}</p>
                        {publication.url && (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-lg"
                          >
                            <FaLink className="w-5 h-5" />
                            Read Publication
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <SectionIndicator sectionId="publications" />
              {!hasSectionData('publications') && <EmptySectionPlaceholder sectionId="publications" />}
              <EditButton sectionId="publications" />
            </section>
          )}

          {/* Certifications Section */}
          {sectionsToRender.includes('certifications') && (
            <section id="certifications" className="py-20 bg-black bg-opacity-50 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
              <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-12">Certifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                  {data.certifications.map((certification, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="p-8">
                        <h3 className="text-2xl font-bold mb-4">{certification.name}</h3>
                        <p className="text-gray-400 mb-2">{certification.issuer}</p>
                        <div className="flex gap-4 mb-4">
                          <p className="text-gray-400">Issued: {formatDate(certification.issueDate)}</p>
                          {certification.expiryDate && (
                            <p className="text-gray-400">Expires: {formatDate(certification.expiryDate)}</p>
                          )}
                        </div>
                        <p className="text-gray-300 mb-6">{certification.description}</p>
                        {certification.credentialUrl && (
                          <a
                            href={certification.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-lg"
                          >
                            <FaLink className="w-5 h-5" />
                            View Credential
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <SectionIndicator sectionId="certifications" />
              {!hasSectionData('certifications') && <EmptySectionPlaceholder sectionId="certifications" />}
              <EditButton sectionId="certifications" />
            </section>
          )}

          {/* Awards Section */}
          {shouldRenderSection('awards') && data?.awards?.length > 0 && (
            <section id="awards" className="py-20 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
              <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-12">Awards & Recognition</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                  {data.awards.map((award, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={award.image || 'https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                          alt={award.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold mb-4">{award.title}</h3>
                        <p className="text-gray-400 mb-2">{award.issuer}</p>
                        <p className="text-gray-400 mb-6">{formatDate(award.date)}</p>
                        <p className="text-gray-300">{award.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <SectionIndicator sectionId="awards" />
              {!hasSectionData('awards') && <EmptySectionPlaceholder sectionId="awards" />}
              <EditButton sectionId="awards" />
            </section>
          )}

          {/* Experience Section */}
          {sectionsToRender.includes('experience') && (
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
                      <p className="text-gray-300 mb-4">{exp.description}</p>
                      {/* Render achievements if they exist */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <h4 className="text-lg font-semibold mb-2 text-gray-200">Key Achievements:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-400">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <SectionIndicator sectionId="experience" />
              {!hasSectionData('experience') && <EmptySectionPlaceholder sectionId="experience" />}
              <EditButton sectionId="experience" />
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
                  {data?.basics?.location && (
                    <div className="flex items-center gap-2 text-gray-300 px-6 py-3">
                      <FaMapMarkerAlt className="w-5 h-5 text-orange-500" />
                      <span>{data.basics.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <SectionIndicator sectionId="contact" />
              {!hasSectionData('basics') && <EmptySectionPlaceholder sectionId="basics" />}
              <EditButton sectionId="basics" />
            </section>
          )}

          {/* Services Section */}
          {sectionsToRender.includes('services') && (
            <section id="services" className="py-20 bg-black bg-opacity-50 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
              <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-3xl font-bold text-center mb-12">Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data?.services?.map((service, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                      <div className="p-6">
                        <div className="text-orange-500 mb-4">
                          {service.icon && getIconComponent(service.icon)({ className: "w-8 h-8" })}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                        <p className="text-gray-300">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <SectionIndicator sectionId="services" />
              {!hasSectionData('services') && <EmptySectionPlaceholder sectionId="services" />}
              <EditButton sectionId="services" />
            </section>
          )}

          {/* Footer */}
          <footer className="py-8 bg-black">
            <div className="container mx-auto px-6 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} {data?.basics?.name || 'Developer Portfolio'}. All rights reserved.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default ExpertPortfolioTemplate; 