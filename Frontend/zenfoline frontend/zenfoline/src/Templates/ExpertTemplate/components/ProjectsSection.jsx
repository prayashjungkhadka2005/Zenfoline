import React from 'react';
import { FaCode, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Accept theme prop
const ProjectsSection = ({ data, theme }) => {
  const titleStyle = {
    color: theme.highlight
  };

  const textStyle = {
    color: theme.text,
    opacity: 0.9
  };

  const cardStyle = {
    backgroundColor: `${theme.primary}80`,
    backdropFilter: 'blur(8px)',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: `0 10px 30px ${theme.primary}20`,
    border: `1px solid ${theme.highlight}20`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: `0 15px 35px ${theme.primary}30`,
      border: `1px solid ${theme.highlight}40`,
    }
  };

  const projectTitleStyle = {
    color: theme.text
  };

  const descriptionStyle = {
    color: theme.text,
    opacity: 0.9
  };

  const tagStyle = {
    backgroundColor: `${theme.highlight}20`,
    color: theme.highlight,
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: `${theme.highlight}40`,
    }
  };

  const linkStyle = {
    color: theme.highlight,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    padding: '0.5rem 0.75rem',
    borderRadius: '9999px',
    backgroundColor: `${theme.highlight}10`,
    ':hover': {
      backgroundColor: `${theme.highlight}30`,
    }
  };

  const handleLinkHover = (e, isHover) => {
    e.target.style.backgroundColor = isHover ? `${theme.highlight}30` : `${theme.highlight}10`;
  };

  // Function to get the image source
  const getImageSource = (project) => {
    // First check if there's a direct image property
    if (project.image) {
      return project.image;
    }
    
    // Then check if there are images in the array
    if (project.images && project.images.length > 0) {
      const imageUrl = project.images[0];
      
      // Check if it's a base64 image
      if (imageUrl.startsWith('data:image')) {
        return imageUrl;
      }
      
      // Check if it's a file path
      if (imageUrl.startsWith('/uploads/')) {
        // Construct the full URL
        return `http://localhost:3000${imageUrl}`;
      }
      
      return imageUrl;
    }
    
    return null;
  };

  return (
    <section id="projects" className="py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4" 
          style={titleStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Projects
        </motion.h2>
        {/* Optional Subtitle */}
        {/* <p className={`text-lg md:text-xl ${textColor} max-w-3xl mx-auto`}>Selected works showcasing my skills.</p> */}
      </div>

      {/* Using flex-grow and basis for flexible item sizing */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-10 max-w-6xl mx-auto px-4"> {/* Changed from 7xl */}
        {data?.map((project, index) => {
          const imageSource = getImageSource(project);
          
          return (
            // Removed fixed widths, added flex-grow and basis
            <motion.div 
              key={index} 
              style={cardStyle} 
              className="flex-grow flex-shrink-0 basis-[350px] max-w-full" // Adjust basis-[...] as needed 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {imageSource && (
                <div className="overflow-hidden h-64">
                  <motion.img 
                    src={imageSource} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }} // Hide broken images
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-medium mb-2" style={projectTitleStyle}>{project.title}</h3>
                <p className="text-sm mb-4 flex-grow" style={descriptionStyle}>{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} style={tagStyle}>{tech}</span>
                    ))}
                  </div>
                )}
                
                <div className="mt-auto flex justify-end space-x-3">
                  {project.liveUrl && (
                    <motion.a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={linkStyle}
                      onMouseOver={(e) => handleLinkHover(e, true)}
                      onMouseOut={(e) => handleLinkHover(e, false)}
                      title="Live Demo"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaGlobe className="w-4 h-4" /> Live
                    </motion.a>
                  )}
                  {project.sourceUrl && (
                    <motion.a 
                      href={project.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={linkStyle}
                      onMouseOver={(e) => handleLinkHover(e, true)}
                      onMouseOut={(e) => handleLinkHover(e, false)}
                      title="Source Code"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCode className="w-4 h-4" /> Code
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsSection; 