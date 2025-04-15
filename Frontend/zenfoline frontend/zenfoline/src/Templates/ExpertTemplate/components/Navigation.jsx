import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = ({ data, sectionsToRender, isPreviewMode, theme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [menuItemsCount, setMenuItemsCount] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Count the number of menu items
  useEffect(() => {
    let count = 0;
    if (sectionsToRender.includes('about')) count++;
    if (sectionsToRender.includes('skills')) count++;
    if (sectionsToRender.includes('projects')) count++;
    if (sectionsToRender.includes('experience')) count++;
    if (sectionsToRender.includes('education')) count++;
    if (sectionsToRender.includes('publications')) count++;
    if (sectionsToRender.includes('certifications')) count++;
    if (sectionsToRender.includes('services')) count++;
    if (sectionsToRender.includes('awards')) count++;
    if (sectionsToRender.includes('basics')) count++;
    setMenuItemsCount(count);
  }, [sectionsToRender]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(!isDesktopMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeDesktopMenu = () => {
    setIsDesktopMenuOpen(false);
  };

  const navStyle = {
    backgroundColor: isPreviewMode ? `${theme.primary}80` : `${theme.background}90`,
    backdropFilter: 'blur(12px)',
    boxShadow: `0 4px 20px ${theme.highlight}20`,
    borderBottom: `1px solid ${theme.highlight}15`
  };

  const titleStyle = {
    color: theme.text,
    textShadow: `0 0 20px ${theme.highlight}20`
  };

  const menuButtonStyle = {
    color: theme.text,
    transition: 'all 0.3s ease',
    ':hover': {
      color: theme.highlight,
      transform: 'scale(1.1)'
    }
  };

  const getLinkStyle = (itemId) => {
    const isHovered = hoveredItem === itemId;
    return {
      color: isHovered ? theme.highlight : theme.text,
      transition: 'all 0.3s ease',
      position: 'relative',
      padding: '0.5rem 0',
      cursor: 'pointer',
      opacity: isHovered ? 1 : 0.85,
      textShadow: isHovered ? `0 0 8px ${theme.highlight}40` : 'none'
    };
  };

  const mobileMenuStyle = {
    backgroundColor: theme.primary,
    backdropFilter: 'blur(16px)',
    padding: '1rem',
    width: '100%',
    left: 0,
    right: 0,
    boxShadow: `0 4px 20px ${theme.highlight}30`,
    position: 'absolute',
    top: '100%'
  };

  const desktopMenuStyle = {
    backgroundColor: theme.primary,
    backdropFilter: 'blur(16px)',
    padding: '1rem',
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '250px',
    zIndex: 50,
    boxShadow: `0 8px 32px ${theme.highlight}30`,
    border: `1px solid ${theme.highlight}15`,
    marginTop: 17,
    borderRadius: '8px 8px'
  };

  // Render menu items
  const renderMenuItems = (onClick) => {
    return (
      <>
        {sectionsToRender.includes('about') && (
          <a 
            href="#about" 
            style={getLinkStyle('about')}
            onClick={onClick}
            className="py-1 block"
            onMouseEnter={() => setHoveredItem('about')}
            onMouseLeave={() => setHoveredItem(null)}
          >About</a>
        )}
        {sectionsToRender.includes('skills') && (
          <a 
            href="#skills" 
            style={getLinkStyle('skills')}
            onClick={onClick}
            className="py-1 block"
            onMouseEnter={() => setHoveredItem('skills')}
            onMouseLeave={() => setHoveredItem(null)}
          >Skills</a>
        )}
        {sectionsToRender.includes('projects') && (
          <a 
            href="#projects" 
            style={getLinkStyle('projects')}
            onClick={onClick}
            className="py-1 block"
            onMouseEnter={() => setHoveredItem('projects')}
            onMouseLeave={() => setHoveredItem(null)}
          >Projects</a>
        )}
        {sectionsToRender.includes('experience') && (
          <a 
            href="#experience" 
            style={getLinkStyle('experience')}
            onClick={onClick}
            className="py-1 block"
            onMouseEnter={() => setHoveredItem('experience')}
            onMouseLeave={() => setHoveredItem(null)}
          >Experience</a>
        )}
        {sectionsToRender.includes('education') && (
          <a 
            href="#education" 
            style={getLinkStyle('education')}
            onClick={onClick}
            className="py-1 block"
            onMouseEnter={() => setHoveredItem('education')}
            onMouseLeave={() => setHoveredItem(null)}
          >Education</a>
        )}
        {sectionsToRender.includes('publications') && (
          <a 
            href="#publications" 
            style={getLinkStyle('publications')}
            onClick={onClick}
            className="py-1 block"
            onMouseEnter={() => setHoveredItem('publications')}
            onMouseLeave={() => setHoveredItem(null)}
          >Publications</a>
        )}
        {sectionsToRender.includes('certifications') && (
          <a 
            href="#certifications" 
            style={getLinkStyle('certifications')}
            onClick={onClick}
            className="py-1 block"
            onMouseEnter={() => setHoveredItem('certifications')}
            onMouseLeave={() => setHoveredItem(null)}
          >Certifications</a>
        )}
        {sectionsToRender.includes('services') && (
          <a 
            href="#services" 
            style={getLinkStyle('services')}
            onClick={onClick}
            className="py-1 block"
            onMouseEnter={() => setHoveredItem('services')}
            onMouseLeave={() => setHoveredItem(null)}
          >Services</a>
        )}
        {sectionsToRender.includes('awards') && (
          <a 
            href="#awards" 
            style={getLinkStyle('awards')}
            onClick={onClick}
            className="py-1 block"
            onMouseEnter={() => setHoveredItem('awards')}
            onMouseLeave={() => setHoveredItem(null)}
          >Awards</a>
        )}
        {sectionsToRender.includes('basics') && (
          <a 
            href="#contact" 
            style={getLinkStyle('contact')}
            onClick={onClick}
            className="py-1 block"
            onMouseEnter={() => setHoveredItem('contact')}
            onMouseLeave={() => setHoveredItem(null)}
          >Contact</a>
        )}
      </>
    );
  };

  return (
    <motion.nav 
      className="fixed w-full z-40" 
      style={navStyle}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto py-3 sm:py-4">
        <div className="flex justify-between items-center px-4 sm:px-6">
          <motion.h1 
            className="text-xl sm:text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity" 
            style={titleStyle}
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {data?.basics?.name || 'Developer Portfolio'}
          </motion.h1>
          
          {/* Mobile menu button */}
          <motion.button 
            className="block sm:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={menuButtonStyle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </motion.button>
          
          {/* Desktop menu - show hamburger if more than 6 items */}
          {menuItemsCount <= 6 ? (
            <div className="hidden sm:flex gap-6 text-base">
              {renderMenuItems()}
            </div>
          ) : (
            <div className="hidden sm:block relative h-full">
              <motion.button 
                className="focus:outline-none h-full"
                onClick={toggleDesktopMenu}
                aria-label="Toggle desktop menu"
                style={menuButtonStyle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDesktopMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </motion.button>
              
              <AnimatePresence>
                {isDesktopMenuOpen && (
                  <motion.div 
                    className="absolute right-0"
                    style={desktopMenuStyle}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col space-y-3 px-4">
                      {renderMenuItems(closeDesktopMenu)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="block sm:hidden" 
              style={mobileMenuStyle}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-3 px-4">
                {renderMenuItems(closeMenu)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation; 