import React from 'react';
import { Box, Typography, Button, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { getContrastTextColor } from '../utils/helpers';

// --- Styled Components for Modern Designer Look ---

const StyledHeroSection = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(6, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 0),
    minHeight: '100vh',
  },
  // Unique background with diagonal pattern
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `repeating-linear-gradient(
      45deg,
      ${alpha(theme.palette.primary.main, 0.03)} 0px,
      ${alpha(theme.palette.primary.main, 0.03)} 2px,
      transparent 2px,
      transparent 10px
    )`,
    zIndex: 0,
  },
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
}));

// Asymmetrical grid layout
const HeroGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    '& > div:first-of-type': {
      paddingRight: theme.spacing(4),
    },
    '& > div:last-of-type': {
      paddingLeft: theme.spacing(4),
    },
  },
}));

// Styled component for the text content column
const TextContainer = styled(motion.div)(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
  },
}));

const NameTypography = styled(motion.h1)(({ theme }) => ({
  ...theme.typography.h1,
  fontSize: 'clamp(2.8rem, 8vw, 4.5rem)',
  fontWeight: 700,
  lineHeight: 1.1,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1.5),
  position: 'relative',
  display: 'inline-block',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -10,
    left: 0,
    width: '40px',
    height: '4px',
    background: theme.palette.primary.main,
    borderRadius: '2px',
  },
}));

const HeadlineTypography = styled(motion.h2)(({ theme }) => ({
  ...theme.typography.h4,
  fontSize: 'clamp(1.2rem, 4vw, 1.75rem)',
  fontWeight: 500,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(4),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -5,
    right: 0,
    width: '60%',
    height: '2px',
    background: theme.palette.secondary.main,
    borderRadius: '1px',
  },
}));

const SummaryTypography = styled(motion.p)(({ theme }) => ({
  ...theme.typography.body1,
  fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
  color: theme.palette.text.secondary,
  maxWidth: '600px',
  margin: '0 auto',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    margin: '0 0 ${theme.spacing(4)} 0',
  },
  lineHeight: 1.7,
  position: 'relative',
  paddingLeft: theme.spacing(2),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '3px',
  },
}));

const ButtonContainer = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-start',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '0',
  padding: theme.spacing(1.25, 4),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4],
    '&::before': {
      opacity: 1,
    },
  },
}));

// Visual container with unique styling
const VisualContainer = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  minHeight: '350px',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    minHeight: '450px',
    marginTop: 0,
  },
  // Ensure proper display on mobile
  [theme.breakpoints.down('sm')]: {
    minHeight: '300px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
}));

// Unique profile image container with diagonal cut
const ProfileImageWrapper = styled(motion.div)(({ theme }) => ({
  width: 'clamp(250px, 65vw, 400px)',
  height: 'clamp(250px, 65vw, 400px)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -20,
    right: -20,
    width: '100%',
    height: '100%',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)',
    zIndex: -1,
    opacity: 0.2,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: '100%',
    height: '100%',
    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    clipPath: 'polygon(0% 15%, 15% 0%, 100% 0%, 100% 100%, 0% 100%)',
    zIndex: -1,
    opacity: 0.2,
  },
}));

const ProfileImage = styled('img')({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)',
  border: 'none',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
});

// Decorative elements
const DecorativeElement = styled(motion.div)(({ theme, position, size = '150px', color = 'primary' }) => ({
  position: 'absolute',
  width: size,
  height: size,
  zIndex: 0,
  ...position,
  ...(color === 'primary' && {
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  }),
  ...(color === 'secondary' && {
    background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  }),
}));

// --- Component Implementation ---

const HeroSection = ({ data, hasSectionData }) => {
  const theme = useTheme();
  const basics = data?.basics || {};
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut" 
      }
    }
  };

  const elementVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const defaultImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

  return (
    <StyledHeroSection>
      {/* Decorative elements */}
      <DecorativeElement 
        variants={elementVariants}
        initial="hidden"
        animate="visible"
        position={{ top: '10%', left: '5%' }}
        color="primary"
      />
      <DecorativeElement 
        variants={elementVariants}
        initial="hidden"
        animate="visible"
        position={{ bottom: '15%', right: '10%' }}
        size="100px"
        color="secondary"
      />
      <DecorativeElement 
        variants={elementVariants}
        initial="hidden"
        animate="visible"
        position={{ top: '40%', right: '15%' }}
        size="80px"
        color="primary"
      />
      
      <ContentContainer>
        <HeroGrid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          {/* Text Column */}
          <Grid item xs={12} md={6} sx={{ order: isMobile ? 2 : 1 }}>
            <TextContainer variants={containerVariants} initial="hidden" animate="visible">
              <NameTypography variants={itemVariants}>
                {basics.name || 'Designer Name'}
              </NameTypography>
              <HeadlineTypography variants={itemVariants}>
                {basics.headline || basics.role || 'UI/UX Designer & Developer'} 
              </HeadlineTypography>
              <SummaryTypography variants={itemVariants}>
                {basics.bio || basics.summary || data?.about?.summary ||
                  'Passionate designer crafting intuitive and engaging digital experiences. Bringing ideas to life with clean code and user-centered design.'}
              </SummaryTypography>
              <ButtonContainer variants={itemVariants}>
                <StyledButton variant="contained" color="primary" href="#contact">
                  Get in Touch
                </StyledButton>
                {hasSectionData('projects') && (
                  <StyledButton variant="outlined" color="secondary" href="#projects">
                    View My Work
                  </StyledButton>
                )}
              </ButtonContainer>
            </TextContainer>
          </Grid>

          {/* Visual Column with diagonal cut profile image */}
          <Grid item xs={12} md={6} sx={{ order: isMobile ? 1 : 2 }}>
            <VisualContainer>
              <ProfileImageWrapper variants={imageVariants} initial="hidden" animate="visible">
                <ProfileImage
                  src={basics.profileImage || defaultImage}
                  alt={basics.name || 'Profile Picture'}
                  onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
                />
              </ProfileImageWrapper>
            </VisualContainer>
          </Grid>
        </HeroGrid>
      </ContentContainer>
    </StyledHeroSection>
  );
};

export default HeroSection; 