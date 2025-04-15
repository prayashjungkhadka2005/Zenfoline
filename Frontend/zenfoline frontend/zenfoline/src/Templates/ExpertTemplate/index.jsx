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
import EducationSection from './components/EducationSection';
import PublicationsSection from './components/PublicationsSection';
import CertificationsSection from './components/CertificationsSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { getThemeColors } from './styles/theme';

const ExpertPortfolioTemplate = ({ 
  fontStyle = 'Poppins', 
  template, 
  data, 
  availableSections, 
  checkSectionData, 
  sectionVisibility = {}, 
  isPreviewMode = false
}) => {
  const { mode } = useTemplateMode();
  
  // Get theme data from either template or data
  const themeData = template?.theme || data?.theme;
  const currentFontStyle = fontStyle || themeData?.fontStyle || 'Poppins';

  // Get theme colors based on theme data
  const currentTheme = getThemeColors(themeData);

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
    'education',
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
      className="min-h-screen antialiased" 
      style={{ 
        fontFamily: currentFontStyle, 
        backgroundColor: currentTheme.background,
        color: currentTheme.text
      }}
    >
      <Navigation data={data} sectionsToRender={sectionsToRender} isPreviewMode={isPreviewMode} theme={currentTheme} />
      
      {/* Render Hero Section (usually always present or tied to basics) */}
      {checkSectionData('basics') && 
        <HeroSection data={data} hasSectionData={checkSectionData} theme={currentTheme} />
      }
      
      {/* Conditionally render other sections */}
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {sectionsToRender.includes('about') && checkSectionData('about') && 
          <AboutSection data={data.about} theme={currentTheme} />
        }
        {sectionsToRender.includes('skills') && checkSectionData('skills') && 
          <SkillsSection data={data.skills} theme={currentTheme} />
        }
        {sectionsToRender.includes('projects') && checkSectionData('projects') && 
          <ProjectsSection data={data.projects} theme={currentTheme} />
        }
        {sectionsToRender.includes('experience') && checkSectionData('experience') && 
          <ExperienceSection data={data.experience} theme={currentTheme} />
        }
        {sectionsToRender.includes('education') && checkSectionData('education') && 
          <EducationSection data={data.education} theme={currentTheme} />
        }
        {sectionsToRender.includes('publications') && checkSectionData('publications') && 
          <PublicationsSection data={data.publications} theme={currentTheme} />
        }
        {sectionsToRender.includes('certifications') && checkSectionData('certifications') && 
          <CertificationsSection data={data.certifications} theme={currentTheme} />
        }
        {sectionsToRender.includes('services') && checkSectionData('services') && 
          <ServicesSection data={data.services} theme={currentTheme} />
        }
      </main>

      {/* Contact Section (Often linked to basics or separate) */}
      {checkSectionData('basics') && 
        <ContactSection data={data} theme={currentTheme} />
      }

      <Footer theme={currentTheme} />
    </div>
  );
};

export default ExpertPortfolioTemplate; 