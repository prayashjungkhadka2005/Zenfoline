import React from 'react';
import { FaCode, FaGlobe } from 'react-icons/fa';

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
    backgroundColor: theme.primary,
    opacity: 0.9,
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column'
  };

  const projectTitleStyle = {
    color: theme.text
  };

  const descriptionStyle = {
    color: theme.text,
    opacity: 0.9
  };

  const tagStyle = {
    backgroundColor: theme.highlight,
    opacity: 0.9,
    color: theme.text,
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500'
  };

  const linkStyle = {
    color: theme.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    transition: 'color 0.3s'
  };

  const handleLinkHover = (e, isHover) => {
    e.target.style.color = isHover ? theme.highlight : theme.secondary;
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
    <section id="projects" className="py-8 md:py-12">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={titleStyle}>Projects</h2>
        {/* Optional Subtitle */}
        {/* <p className={`text-lg md:text-xl ${textColor} max-w-3xl mx-auto`}>Selected works showcasing my skills.</p> */}
      </div>

      {/* Using flex-grow and basis for flexible item sizing */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-10 max-w-6xl mx-auto px-4"> {/* Changed from 7xl */}
        {data?.map((project, index) => {
          const imageSource = getImageSource(project);
          
          return (
            // Removed fixed widths, added flex-grow and basis
            <div 
              key={index} 
              style={cardStyle} 
              className="flex-grow flex-shrink-0 basis-[350px] max-w-full" // Adjust basis-[...] as needed 
            >
              {imageSource && (
                <img 
                  src={imageSource} 
                  alt={project.title} 
                  className="w-full h-48 object-cover" 
                  onError={(e) => { e.target.style.display = 'none' }} // Hide broken images
                />
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2" style={projectTitleStyle}>{project.title}</h3>
                <p className="text-sm mb-4 flex-grow" style={descriptionStyle}>{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} style={tagStyle}>{tech}</span>
                    ))}
                  </div>
                )}
                
                <div className="mt-auto flex justify-end space-x-4">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={linkStyle}
                      onMouseOver={(e) => handleLinkHover(e, true)}
                      onMouseOut={(e) => handleLinkHover(e, false)}
                      title="Live Demo"
                    >
                      <FaGlobe /> Live
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a 
                      href={project.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={linkStyle}
                      onMouseOver={(e) => handleLinkHover(e, true)}
                      onMouseOut={(e) => handleLinkHover(e, false)}
                      title="Source Code"
                    >
                      <FaCode /> Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsSection; 