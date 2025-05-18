import React from 'react';
import { FaCode, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HeroSection = ({ data, hasSectionData, theme }) => {
  const basics = data?.basics || {};
  
  const overlayStyle = {
    backgroundColor: theme.primary,
    opacity: 0.7,
    backdropFilter: 'blur(8px)'
  };

  const primaryButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    backgroundColor: theme.highlight,
    color: 'white',
    fontWeight: '400',
    transition: 'all 0.3s',
    boxShadow: `0 4px 15px ${theme.highlight}40`
  };

  const secondaryButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    border: `2px solid ${theme.highlight}`,
    color: theme.highlight,
    fontWeight: '400',
    transition: 'all 0.3s',
    boxShadow: `0 4px 15px ${theme.highlight}20`
  };

  const profileBorderStyle = {
    border: `4px solid ${theme.highlight}`,
    boxShadow: `0 0 30px ${theme.highlight}40`,
  };

  const nameStyle = {
    color: theme.text,
    textShadow: `0 2px 10px ${theme.highlight}20`
  };

  const roleStyle = {
    color: theme.highlight,
    textShadow: `0 2px 10px ${theme.highlight}30`
  };

  const bioStyle = {
    color: theme.text,
    opacity: 0.9,
    lineHeight: 1.8
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-12">
      <div className="absolute inset-0" style={overlayStyle}></div>
      
      <div className="container mx-auto px-8 lg:px-16 xl:px-24 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="w-full md:w-1/2 text-center md:text-left space-y-6 order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.span 
                  style={nameStyle}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {basics.name || 'Your Name'}
                </motion.span>
                <br />
                <motion.span 
                  style={roleStyle} 
                  className="break-words"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {basics.role || 'Your Role'}
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-lg max-w-xl" 
                style={bioStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {basics.bio || 'Your professional bio will appear here'}
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {hasSectionData('projects') && data?.projects?.length > 0 && (
                <motion.a 
                  href="#projects" 
                  style={primaryButtonStyle}
                  whileHover={{ scale: 1.05, boxShadow: `0 8px 20px ${theme.highlight}50` }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaCode className="w-5 h-5" />
                  View Projects
                </motion.a>
              )}
              <motion.a 
                href="#contact" 
                style={secondaryButtonStyle}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: theme.highlight,
                  color: 'white',
                  boxShadow: `0 8px 20px ${theme.highlight}40`
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FaEnvelope className="w-5 h-5" />
                Contact Me
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div 
            className="w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
              <motion.div 
                className="absolute inset-0 rounded-full overflow-hidden"
                style={profileBorderStyle}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                animate={{ 
                  boxShadow: [
                    `0 0 30px ${theme.highlight}40`,
                    `0 0 50px ${theme.highlight}30`,
                    `0 0 30px ${theme.highlight}40`
                  ]
                }}
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
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 