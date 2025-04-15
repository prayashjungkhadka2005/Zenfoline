import React from 'react';
import { motion } from 'framer-motion';

// Accept theme prop
const AboutSection = ({ data, theme }) => {
  const sectionStyle = {
    position: 'relative',
    backgroundColor: `${theme.primary}33`,
    color: theme.text,
    width: '100%',
    overflow: 'hidden',
    backdropFilter: 'blur(8px)',
    borderTop: `1px solid ${theme.highlight}20`
  };

  const containerStyle = {
    maxWidth: '1152px',
    margin: '0 auto',
    padding: '4rem 1rem',
    position: 'relative',
    textAlign: 'center'
  };

  const titleStyle = {
    color: theme.highlight,
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textShadow: `0 0 20px ${theme.highlight}20`
  };

  const titleUnderlineStyle = {
    display: 'block',
    width: '60px',
    height: '4px',
    backgroundColor: theme.highlight,
    margin: '0.5rem auto 2rem',
    borderRadius: '2px',
    boxShadow: `0 0 10px ${theme.highlight}40`
  };

  const contentTextStyle = {
    color: theme.text,
    fontSize: '1.15rem',
    lineHeight: '1.8',
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '400',
    marginBottom: '1.5rem',
    maxWidth: '800px',
    margin: '0 auto 1.5rem'
  };

  const highlightTagStyle = {
    display: 'inline-block',
    backgroundColor: `${theme.highlight}2A`,
    color: theme.highlight,
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.9rem',
    fontWeight: '500',
    lineHeight: '1.4',
    margin: '0.25rem',
    transition: 'all 0.3s ease',
    border: `1px solid ${theme.highlight}40`,
    boxShadow: `0 2px 8px ${theme.highlight}20`,
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${theme.highlight}30`,
      backgroundColor: `${theme.highlight}40`
    }
  };

  return (
    <section id="about" style={sectionStyle} className="py-12 md:py-16">
      <div style={containerStyle}>
        <motion.h2 
          style={titleStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>
        <motion.div 
          style={titleUnderlineStyle}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        <div>
          {data?.description && (
            <motion.p 
              style={contentTextStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {data.description}
            </motion.p>
          )}

          {data?.vision && (
            <motion.p 
              style={{ ...contentTextStyle, fontStyle: 'italic', opacity: 0.8, marginBottom: '2.5rem' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {data.vision}
            </motion.p>
          )}

          {data?.highlights && data.highlights.filter(h => h.isVisible).length > 0 && (
            <motion.div 
              className="mt-8 pt-6 border-t border-gray-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            > 
              {data.highlights.map((highlight, index) => (
                highlight.isVisible && (
                  <motion.span 
                    key={index} 
                    style={highlightTagStyle}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    {highlight.text}
                  </motion.span>
                )
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 