import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ContactSection = ({ data, theme }) => {
  const basics = data?.basics || {};
  
  const sectionStyle = {
    backgroundColor: `${theme.primary}80`,
    backdropFilter: 'blur(8px)',
    borderTop: `1px solid ${theme.highlight}20`
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
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 15px ${theme.highlight}30`,
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px ${theme.highlight}40`
    }
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
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: theme.highlight,
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 15px ${theme.highlight}30`
    }
  };

  const infoStyle = {
    color: theme.text,
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: `${theme.primary}40`,
    borderRadius: '9999px',
    border: `1px solid ${theme.highlight}20`,
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: `${theme.primary}60`,
      border: `1px solid ${theme.highlight}40`
    }
  };

  const iconStyle = {
    color: theme.highlight,
    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
  };

  return (
    <section id="contact" className="pt-12 pb-20 relative overflow-hidden" style={sectionStyle}>
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h2 
          className="text-4xl font-bold mb-8" 
          style={titleStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Let's Connect
        </motion.h2>
        <motion.p 
          className="text-xl mb-12 max-w-2xl mx-auto" 
          style={textStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Ready to start your next project? Get in touch!
        </motion.p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {basics.email && (
            <motion.a
              href={`mailto:${basics.email}`}
              style={primaryButtonStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -2 }}
            >
              <FaEnvelope className="w-5 h-5" />
              Email Me
            </motion.a>
          )}
          
          {basics.phone && (
            <motion.a
              href={`tel:${basics.phone}`}
              style={secondaryButtonStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -2 }}
            >
              <FaPhone className="w-5 h-5" />
              Call Me
            </motion.a>
          )}
          
          {basics.location && (
            <motion.div 
              className="col-span-1 sm:col-span-2 lg:col-span-1" 
              style={infoStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -2 }}
            >
              <FaMapMarkerAlt className="w-5 h-5" style={iconStyle} />
              <span className="truncate">{basics.location}</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 