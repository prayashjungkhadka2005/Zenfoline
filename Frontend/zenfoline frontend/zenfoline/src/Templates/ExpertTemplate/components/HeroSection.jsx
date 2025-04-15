import React from 'react';
import { FaCode, FaEnvelope } from 'react-icons/fa';

const HeroSection = ({ data, hasSectionData, theme }) => {
  const basics = data?.basics || {};
  
  const overlayStyle = {
    backgroundColor: theme.primary,
    opacity: 0.7,
  };

  const primaryButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    backgroundColor: theme.highlight,
    color: 'white',
    fontWeight: '600',
    transition: 'opacity 0.3s',
  };

  const secondaryButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    border: `2px solid ${theme.highlight}`,
    color: theme.highlight,
    fontWeight: '600',
    transition: 'all 0.3s',
  };

  const profileBorderStyle = {
    border: `4px solid ${theme.highlight}`,
  };

  const nameStyle = {
    color: theme.text,
  };

  const roleStyle = {
    color: theme.highlight,
  };

  const bioStyle = {
    color: theme.text,
    opacity: 0.9,
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-12">
      <div className="absolute inset-0" style={overlayStyle}></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              <span style={nameStyle}>{basics.name || 'Your Name'}</span>
              <br />
              <span style={roleStyle} className="break-words">{basics.role || 'Your Role'}</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl" style={bioStyle}>
              {basics.bio || 'Your professional bio will appear here'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {hasSectionData('projects') && data?.projects?.length > 0 && (
              <a 
                href="#projects" 
                style={primaryButtonStyle}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                <FaCode className="w-5 h-5" />
                View Projects
              </a>
            )}
            <a 
              href="#contact" 
              style={secondaryButtonStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.highlight;
                e.currentTarget.style.color = 'white';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  icon.style.fill = 'white';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.highlight;
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  icon.style.fill = theme.highlight;
                }
              }}
            >
              <FaEnvelope className="w-5 h-5" />
              Contact Me
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div 
              className="absolute inset-0 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
              style={profileBorderStyle}
            >
              <img
                src={basics.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                alt={basics.name || 'Profile'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 