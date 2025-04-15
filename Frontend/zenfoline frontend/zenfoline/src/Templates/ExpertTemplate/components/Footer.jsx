import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

// Accept theme prop
const Footer = ({ data, theme }) => {
  const footerStyle = {
    backgroundColor: `${theme.primary}80`,
    backdropFilter: 'blur(8px)',
    borderTop: `1px solid ${theme.highlight}20`
  };

  const textStyle = {
    color: theme.text,
    opacity: 0.8
  };

  const heartStyle = {
    color: theme.highlight,
    display: 'inline-block',
    margin: '0 0.25rem',
    filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))'
  };

  return (
    // Apply theme primary as background
    <motion.footer 
      className="py-8" 
      style={footerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 text-center">
        {/* Use theme text color */}
        <motion.p 
          className="text-sm" 
          style={textStyle}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          &copy; {new Date().getFullYear()} {'Zenfoline'}. All rights reserved.
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.5 
            }}
          >
            <FaHeart style={heartStyle} />
          </motion.span>
        </motion.p>
      </div>
    </motion.footer>
  );
};

export default Footer; 