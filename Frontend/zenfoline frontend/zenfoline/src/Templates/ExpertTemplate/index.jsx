import React, { useEffect } from 'react';
import WebFont from 'webfontloader';
import { useTemplateMode } from '../TemplateContext';
import { expertStyles } from './styles/expertStyles';
import { isSectionEnabled, shouldRenderSection } from './utils/helpers';
import { FaCheckCircle } from 'react-icons/fa';
import HeroSection from './components/HeroSection';
import Navigation from './components/Navigation';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import PublicationsSection from './components/PublicationsSection';
import CertificationsSection from './components/CertificationsSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';

const ExpertPortfolioTemplate = ({ 
  fontStyle = 'Poppins', 
  template, 
  data, 
  availableSections, 
  checkSectionData, 
  sectionVisibility = {} 
}) => {
  const { mode } = useTemplateMode();
  const isPreviewMode = mode === 'preview';
  const currentFontStyle = fontStyle || (data?.theme?.fontStyle) || 'Poppins';

  useEffect(() => {
    if (currentFontStyle) {
      WebFont.load({
        google: {
          families: [currentFontStyle],
        },
      });
    }
  }, [currentFontStyle]);

  // Check if any sections are available
  const hasAvailableSections = availableSections && availableSections.length > 0;

  // Default sections for expert category
  const defaultExpertSections = [
    'basics', 
    'about', 
    'skills', 
    'experience', 
    'projects', 
    'publications', 
    'certifications', 
    'services'
  ];

  // Use default sections if no sections are available, but filter out disabled ones
  const sectionsToRender = (hasAvailableSections ? availableSections : defaultExpertSections)
    .filter(sectionId => isSectionEnabled(sectionId, sectionVisibility, data));

  // Check if we should show the empty state message
  const showEmptyState = isPreviewMode && sectionsToRender.length === 0;

  if (showEmptyState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white p-4">
          <h3 className="text-2xl font-medium mb-4">Expert Portfolio Template</h3>
          <p className="text-lg text-gray-300 mb-2">No sections are currently enabled.</p>
          <p className="text-gray-400">Available sections for the expert category include:</p>
          <ul className="mt-4 space-y-2 text-gray-300">
            {defaultExpertSections.map((section) => (
              <li key={section} className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-orange-500" />
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-gray-400">Enable sections in the template settings to start building your portfolio.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: `${currentFontStyle}, ${
          ["Inria Serif", "Crimson Text", "Source Serif Pro", "Playfair Display", "Lobster"].includes(
            currentFontStyle
          )
            ? "serif"
            : "sans-serif"
        }`,
      }}
      className={`min-h-screen ${isPreviewMode ? 'preview-mode relative' : 'public-mode'} bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white`}
    >
      {/* Navigation */}
      <Navigation 
        data={data} 
        sectionsToRender={sectionsToRender}
        isPreviewMode={isPreviewMode}
      />

      {/* Hero Section */}
      {sectionsToRender.includes('basics') && (
        <HeroSection 
          data={data} 
          hasSectionData={checkSectionData}
        />
      )}

      {/* About Section */}
      {sectionsToRender.includes('about') && (
        <AboutSection data={data} />
      )}

      {/* Skills Section */}
      {sectionsToRender.includes('skills') && (
        <SkillsSection data={data} />
      )}

      {/* Projects Section */}
      {sectionsToRender.includes('projects') && (
        <ProjectsSection data={data} />
      )}

      {/* Experience Section */}
      {sectionsToRender.includes('experience') && (
        <ExperienceSection data={data} />
      )}

      {/* Publications Section */}
      {sectionsToRender.includes('publications') && (
        <PublicationsSection data={data} />
      )}

      {/* Certifications Section */}
      {sectionsToRender.includes('certifications') && (
        <CertificationsSection data={data} />
      )}

      {/* Services Section */}
      {sectionsToRender.includes('services') && (
        <ServicesSection data={data} />
      )}

      {/* Contact Section */}
      {sectionsToRender.includes('basics') && checkSectionData('basics') && (
        <ContactSection data={data} />
      )}

      {/* Footer */}
      <footer className="py-8 bg-black">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {data?.basics?.name || 'Developer Portfolio'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ExpertPortfolioTemplate; 