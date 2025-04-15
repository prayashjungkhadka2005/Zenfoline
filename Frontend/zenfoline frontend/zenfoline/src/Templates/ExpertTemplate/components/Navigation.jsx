import React, { useState } from 'react';
import { expertStyles } from '../styles/expertStyles';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navigation = ({ data, sectionsToRender, isPreviewMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full ${isPreviewMode ? 'bg-gray-800 top-0' : 'bg-black bg-opacity-50 backdrop-blur-sm top-0'} z-40`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">{data?.basics?.name || 'Developer Portfolio'}</h1>
          
          {/* Mobile menu button - Block by default, hidden on sm and larger */}
          <button 
            className="block sm:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          
          {/* Desktop menu - Hidden by default, flex on sm and larger */}
          <div className="hidden sm:flex gap-6 text-base">
            {sectionsToRender.includes('about') && (
              <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
            )}
            {sectionsToRender.includes('skills') && (
              <a href="#skills" className="hover:text-orange-500 transition-colors">Skills</a>
            )}
            {sectionsToRender.includes('projects') && (
              <a href="#projects" className="hover:text-orange-500 transition-colors">Projects</a>
            )}
            {sectionsToRender.includes('experience') && (
              <a href="#experience" className="hover:text-orange-500 transition-colors">Experience</a>
            )}
            {sectionsToRender.includes('publications') && (
              <a href="#publications" className="hover:text-orange-500 transition-colors">Publications</a>
            )}
            {sectionsToRender.includes('certifications') && (
              <a href="#certifications" className="hover:text-orange-500 transition-colors">Certifications</a>
            )}
            {sectionsToRender.includes('services') && (
              <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
            )}
            {sectionsToRender.includes('basics') && (
              <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
            )}
          </div>
        </div>
        
        {/* Mobile menu - Block by default (controlled by isMenuOpen), hidden on sm and larger */}
        <div className={`block sm:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4 pb-2`}>
          <div className="flex flex-col space-y-3">
            {sectionsToRender.includes('about') && (
              <a href="#about" className="hover:text-orange-500 transition-colors" onClick={closeMenu}>About</a>
            )}
            {sectionsToRender.includes('skills') && (
              <a href="#skills" className="hover:text-orange-500 transition-colors" onClick={closeMenu}>Skills</a>
            )}
            {sectionsToRender.includes('projects') && (
              <a href="#projects" className="hover:text-orange-500 transition-colors" onClick={closeMenu}>Projects</a>
            )}
            {sectionsToRender.includes('experience') && (
              <a href="#experience" className="hover:text-orange-500 transition-colors" onClick={closeMenu}>Experience</a>
            )}
            {sectionsToRender.includes('publications') && (
              <a href="#publications" className="hover:text-orange-500 transition-colors" onClick={closeMenu}>Publications</a>
            )}
            {sectionsToRender.includes('certifications') && (
              <a href="#certifications" className="hover:text-orange-500 transition-colors" onClick={closeMenu}>Certifications</a>
            )}
            {sectionsToRender.includes('services') && (
              <a href="#services" className="hover:text-orange-500 transition-colors" onClick={closeMenu}>Services</a>
            )}
            {sectionsToRender.includes('basics') && (
              <a href="#contact" className="hover:text-orange-500 transition-colors" onClick={closeMenu}>Contact</a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 