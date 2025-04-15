import React from 'react';
import { FaEnvelope, FaLinkedin, FaGithub, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { getSocialLink } from '../utils/helpers';

const ContactSection = ({ data, theme }) => {
  const basics = data?.basics || {};
  const socialLinks = data?.socialLinks || {};
  
  const sectionStyle = {
    backgroundColor: theme.primary,
    opacity: 0.9
  };

  const titleStyle = {
    color: theme.highlight
  };

  const textStyle = {
    color: theme.text,
    opacity: 0.9
  };

  const primaryButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: theme.highlight,
    color: 'white',
    borderRadius: '9999px',
    fontWeight: 'normal',
    transition: 'opacity 0.3s'
  };

  const secondaryButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    border: `2px solid ${theme.highlight}`,
    color: theme.highlight,
    borderRadius: '9999px',
    fontWeight: '600',
    transition: 'all 0.3s'
  };

  const infoStyle = {
    color: theme.text,
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem'
  };

  const iconStyle = {
    color: theme.highlight
  };

  const handleButtonHover = (e, isHover, isPrimary) => {
    if (isPrimary) {
      e.target.style.opacity = isHover ? '0.9' : '1';
    } else {
      e.target.style.backgroundColor = isHover ? theme.highlight : 'transparent';
      e.target.style.color = isHover ? 'white' : theme.highlight;
    }
  };

  return (
    <section id="contact" className="pt-8 pb-16 relative overflow-hidden" style={sectionStyle}>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl font-bold mb-8" style={titleStyle}>Let's Connect</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto" style={textStyle}>
          Ready to start your next project? Get in touch!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {basics.email && (
            <a
              href={`mailto:${basics.email}`}
              style={primaryButtonStyle}
              onMouseOver={(e) => handleButtonHover(e, true, true)}
              onMouseOut={(e) => handleButtonHover(e, false, true)}
            >
              <FaEnvelope className="w-5 h-5" />
              Email Me
            </a>
          )}
          
          {getSocialLink('linkedin', socialLinks) && (
            <a
              href={`https://linkedin.com/in/${getSocialLink('linkedin', socialLinks)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={secondaryButtonStyle}
              onMouseOver={(e) => handleButtonHover(e, true, false)}
              onMouseOut={(e) => handleButtonHover(e, false, false)}
            >
              <FaLinkedin className="w-5 h-5" />
              LinkedIn
            </a>
          )}
          
          {getSocialLink('github', socialLinks) && (
            <a
              href={`https://github.com/${getSocialLink('github', socialLinks)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={secondaryButtonStyle}
              onMouseOver={(e) => handleButtonHover(e, true, false)}
              onMouseOut={(e) => handleButtonHover(e, false, false)}
            >
              <FaGithub className="w-5 h-5" />
              GitHub
            </a>
          )}
          
          {basics.phone && (
            <a
              href={`tel:${basics.phone}`}
              style={secondaryButtonStyle}
              onMouseOver={(e) => handleButtonHover(e, true, false)}
              onMouseOut={(e) => handleButtonHover(e, false, false)}
            >
              <FaPhone className="w-5 h-5" />
              Call Me
            </a>
          )}
          
          {basics.location && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-1" style={infoStyle}>
              <FaMapMarkerAlt className="w-5 h-5" style={iconStyle} />
              <span className="truncate">{basics.location}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 