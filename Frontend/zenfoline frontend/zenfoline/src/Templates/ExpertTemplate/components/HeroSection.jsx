import React from 'react';
import { FaCode, FaEnvelope } from 'react-icons/fa';
import { expertStyles } from '../styles/expertStyles';

const HeroSection = ({ data, hasSectionData }) => {
  const basics = data?.basics || {};
  
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden py-20`}>
      <div className={expertStyles.backgrounds.overlay}></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className={`${expertStyles.section.container} flex flex-col md:flex-row items-center gap-12`}>
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              {basics.name || 'Your Name'}
              <br />
              <span className="text-orange-500 break-words">{basics.role || 'Your Role'}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              {basics.bio || 'Your professional bio will appear here'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {hasSectionData('projects') && data?.projects?.length > 0 && (
              <a href="#projects" className={expertStyles.buttons.primary}>
                <FaCode className="w-5 h-5" />
                View Projects
              </a>
            )}
            <a href="#contact" className={expertStyles.buttons.secondary}>
              <FaEnvelope className="w-5 h-5" />
              Contact Me
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-orange-500 shadow-2xl transform hover:scale-105 transition-transform duration-300">
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