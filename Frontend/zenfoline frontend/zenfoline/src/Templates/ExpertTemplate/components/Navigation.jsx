import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navigation = ({ data, sectionsToRender, isPreviewMode, theme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [menuItemsCount, setMenuItemsCount] = useState(0);

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
    backgroundColor: isPreviewMode ? theme.primary : theme.background,
    opacity: 1,
    backdropFilter: 'blur(8px)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  };

  const titleStyle = {
    color: theme.text
  };

  const menuButtonStyle = {
    color: theme.text
  };

  const linkStyle = {
    color: theme.text,
    transition: 'color 0.3s'
  };

  const mobileMenuStyle = {
    backgroundColor: theme.primary,
    borderRadius: '0.375rem',
    marginTop: '0.5rem',
    paddingTop: '1rem',
    paddingBottom: '0.5rem'
  };

  const desktopMenuStyle = {
    backgroundColor: theme.primary,
    borderRadius: '0.375rem',
    marginTop: '0.5rem',
    paddingTop: '1rem',
    paddingBottom: '0.5rem',
    position: 'absolute',
    right: '1rem',
    width: '200px',
    zIndex: 50
  };

  const handleLinkHover = (e, isHover) => {
    e.target.style.color = isHover ? theme.highlight : theme.text;
  };

  // Render menu items
  const renderMenuItems = (onClick) => {
    return (
      <>
        {sectionsToRender.includes('about') && (
          <a 
            href="#about" 
            style={linkStyle}
            onMouseOver={(e) => handleLinkHover(e, true)}
            onMouseOut={(e) => handleLinkHover(e, false)}
            onClick={onClick}
            className="py-1"
          >About</a>
        )}
        {sectionsToRender.includes('skills') && (
          <a 
            href="#skills" 
            style={linkStyle}
            onMouseOver={(e) => handleLinkHover(e, true)}
            onMouseOut={(e) => handleLinkHover(e, false)}
            onClick={onClick}
            className="py-1"
          >Skills</a>
        )}
        {sectionsToRender.includes('projects') && (
          <a 
            href="#projects" 
            style={linkStyle}
            onMouseOver={(e) => handleLinkHover(e, true)}
            onMouseOut={(e) => handleLinkHover(e, false)}
            onClick={onClick}
            className="py-1"
          >Projects</a>
        )}
        {sectionsToRender.includes('experience') && (
          <a 
            href="#experience" 
            style={linkStyle}
            onMouseOver={(e) => handleLinkHover(e, true)}
            onMouseOut={(e) => handleLinkHover(e, false)}
            onClick={onClick}
            className="py-1"
          >Experience</a>
        )}
        {sectionsToRender.includes('education') && (
          <a 
            href="#education" 
            style={linkStyle}
            onMouseOver={(e) => handleLinkHover(e, true)}
            onMouseOut={(e) => handleLinkHover(e, false)}
            onClick={onClick}
            className="py-1"
          >Education</a>
        )}
        {sectionsToRender.includes('publications') && (
          <a 
            href="#publications" 
            style={linkStyle}
            onMouseOver={(e) => handleLinkHover(e, true)}
            onMouseOut={(e) => handleLinkHover(e, false)}
            onClick={onClick}
            className="py-1"
          >Publications</a>
        )}
        {sectionsToRender.includes('certifications') && (
          <a 
            href="#certifications" 
            style={linkStyle}
            onMouseOver={(e) => handleLinkHover(e, true)}
            onMouseOut={(e) => handleLinkHover(e, false)}
            onClick={onClick}
            className="py-1"
          >Certifications</a>
        )}
        {sectionsToRender.includes('services') && (
          <a 
            href="#services" 
            style={linkStyle}
            onMouseOver={(e) => handleLinkHover(e, true)}
            onMouseOut={(e) => handleLinkHover(e, false)}
            onClick={onClick}
            className="py-1"
          >Services</a>
        )}
        {sectionsToRender.includes('awards') && (
          <a 
            href="#awards" 
            style={linkStyle}
            onMouseOver={(e) => handleLinkHover(e, true)}
            onMouseOut={(e) => handleLinkHover(e, false)}
            onClick={onClick}
            className="py-1"
          >Awards</a>
        )}
        {sectionsToRender.includes('basics') && (
          <a 
            href="#contact" 
            style={linkStyle}
            onMouseOver={(e) => handleLinkHover(e, true)}
            onMouseOut={(e) => handleLinkHover(e, false)}
            onClick={onClick}
            className="py-1"
          >Contact</a>
        )}
      </>
    );
  };

  return (
    <nav className="fixed w-full z-40" style={navStyle}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold" style={titleStyle}>
            {data?.basics?.name || 'Developer Portfolio'}
          </h1>
          
          {/* Mobile menu button */}
          <button 
            className="block sm:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={menuButtonStyle}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          
          {/* Desktop menu - show hamburger if more than 6 items */}
          {menuItemsCount <= 6 ? (
            <div className="hidden sm:flex gap-6 text-base">
              {renderMenuItems()}
            </div>
          ) : (
            <div className="hidden sm:block relative">
              <button 
                className="focus:outline-none"
                onClick={toggleDesktopMenu}
                aria-label="Toggle desktop menu"
                style={menuButtonStyle}
              >
                {isDesktopMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
              
              {isDesktopMenuOpen && (
                <div className="flex flex-col space-y-3 px-4" style={desktopMenuStyle}>
                  {renderMenuItems(closeDesktopMenu)}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Mobile menu */}
        <div className={`block sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`} style={mobileMenuStyle}>
          <div className="flex flex-col space-y-3 px-4">
            {renderMenuItems(closeMenu)}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 