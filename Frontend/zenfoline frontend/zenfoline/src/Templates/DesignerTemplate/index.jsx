import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { getThemeColors, createTheme } from './styles/theme';
import {
  Root,
  MainContainer,
  Section,
  SectionTitle,
  SectionSubtitle,
  LoadingContainer,
  Loader,
  ErrorContainer
} from './styles/designerStyles';
import { useTemplateMode } from '../TemplateContext';
import { FaCheckCircle } from 'react-icons/fa';

// Import sections
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import PublicationsSection from './components/PublicationsSection';
import CertificationsSection from './components/CertificationsSection';
import ServicesSection from './components/ServicesSection';
import AwardsSection from './components/AwardsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const DesignerTemplate = ({ 
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

  // Default sections for designer category
  const defaultDesignerSections = [
    'basics', 
    'about', 
    'skills', 
    'experience',
    'education',
    'projects', 
    'publications',
    'certifications',
    'services',
    'awards',
    'contact'
  ];

  // Check if any sections are available
  const hasAvailableSections = availableSections && availableSections.length > 0;

  // Use default sections if no sections are available, but filter out disabled ones
  const sectionsToRender = (hasAvailableSections ? availableSections : defaultDesignerSections)
    .filter(sectionId => {
      // First check if section has data (if checkSectionData is provided)
      const hasData = checkSectionData ? checkSectionData(sectionId) : true;
      
      // Then check visibility settings
      const isVisible = !sectionVisibility[sectionId] || (
        typeof sectionVisibility[sectionId] === 'boolean' 
          ? sectionVisibility[sectionId] 
          : sectionVisibility[sectionId]?.isEnabled
      );

      return hasData && isVisible;
    });

  // Check if we should show the empty state message
  const showEmptyState = isPreviewMode && sectionsToRender.length === 0;

  if (showEmptyState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white p-4">
          <h3 className="text-2xl font-medium mb-4">Designer Portfolio Template</h3>
          <p className="text-lg text-gray-300 mb-2">No sections are currently enabled.</p>
          <p className="text-gray-400">Available sections for the designer category include:</p>
          <ul className="mt-4 space-y-2 text-gray-300">
            {defaultDesignerSections.map((section) => (
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

  const theme = createTheme(currentTheme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root>
        <Navigation data={data} sectionsToRender={sectionsToRender} isPreviewMode={isPreviewMode} />
        
        {/* Render Hero Section (usually always present or tied to basics) */}
        {sectionsToRender.includes('basics') && checkSectionData('basics') && 
          <HeroSection data={data} hasSectionData={checkSectionData} />
        }

        {/* Render other sections based on sectionsToRender */}
        {sectionsToRender.includes('about') && checkSectionData('about') && 
          <AboutSection data={data?.about} />
        }

        {sectionsToRender.includes('skills') && checkSectionData('skills') && 
          <SkillsSection data={data?.skills} />
        }

        {sectionsToRender.includes('projects') && checkSectionData('projects') && 
          <ProjectsSection data={data?.projects} />
        }

        {sectionsToRender.includes('experience') && checkSectionData('experience') && 
          <ExperienceSection data={data?.experience} />
        }

        {sectionsToRender.includes('education') && checkSectionData('education') && 
          <EducationSection data={data?.education} />
        }

        {sectionsToRender.includes('publications') && checkSectionData('publications') && 
          <PublicationsSection data={data?.publications} />
        }

        {sectionsToRender.includes('certifications') && checkSectionData('certifications') && 
          <CertificationsSection data={data?.certifications} />
        }

        {sectionsToRender.includes('services') && checkSectionData('services') && 
          <ServicesSection data={data?.services} />
        }

        {sectionsToRender.includes('awards') && checkSectionData('awards') && 
          <AwardsSection data={data?.awards} />
        }

        {/* Contact Section (tied to basics data) */}
        {sectionsToRender.includes('contact') && checkSectionData('basics') && 
          <ContactSection data={data} />
        }
        
        <Footer />
        <ScrollToTop />
      </Root>
    </ThemeProvider>
  );
};

export default DesignerTemplate; 