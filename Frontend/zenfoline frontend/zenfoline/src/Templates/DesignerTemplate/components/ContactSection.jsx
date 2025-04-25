import React from 'react';
import { Box, Container, Typography, Grid, Link, useTheme } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { getSocialLink } from '../utils/helpers';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const StyledSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(14, 2),
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(20, 2),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `repeating-linear-gradient(
      135deg,
      ${alpha(theme.palette.primary.main, 0.02)} 0px,
      ${alpha(theme.palette.primary.main, 0.02)} 2px,
      transparent 2px,
      transparent 10px
    )`,
    zIndex: 0,
  },
}));

// Background Shapes similar to AboutSection
const BackgroundShape = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
  opacity: 0.08,
  zIndex: 1,
  pointerEvents: 'none',
}));

const Shape1 = styled(BackgroundShape)(({ theme }) => ({
  width: 'clamp(300px, 40vw, 500px)',
  height: 'clamp(300px, 40vw, 500px)',
  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
  top: '-10%',
  left: '-15%',
  animation: 'rotate 40s linear infinite',
}));

const Shape2 = styled(BackgroundShape)(({ theme }) => ({
  width: 'clamp(200px, 30vw, 400px)',
  height: 'clamp(200px, 30vw, 400px)',
  background: `linear-gradient(45deg, ${theme.palette.secondary.light}, ${theme.palette.info.light})`,
  bottom: '-15%',
  right: '-10%',
  borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
  animation: 'rotate 50s linear infinite reverse',
}));

const Keyframes = `
  @keyframes rotate {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.05); }
    100% { transform: rotate(360deg) scale(1); }
  }
`;

const GlobalStylesInjector = () => <style>{Keyframes}</style>;

const Title = styled(motion.h2)(({ theme }) => ({
  ...theme.typography.h2,
  fontSize: 'clamp(2.1rem, 5.5vw, 2.9rem)',
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  color: theme.palette.text.primary,
  position: 'relative',
  paddingBottom: theme.spacing(2.5),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 50,
    height: 3,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 3,
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  marginBottom: theme.spacing(12),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  maxWidth: '700px',
  margin: '0 auto',
  letterSpacing: '0.3px',
  lineHeight: 1.8,
}));

const ContactGrid = styled(Grid)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: theme.spacing(8),
  width: '100%',
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
  }
}));

const ContactItem = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(6),
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  backdropFilter: 'blur(20px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.1)}`,
  transition: 'all 0.4s ease-in-out',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  position: 'relative',
  height: '100%',
  minHeight: '280px',
  width: '350px',
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxWidth: 'calc(100vw - 32px)',
  },
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: `linear-gradient(180deg, 
      ${alpha(theme.palette.primary.main, 0.03)} 0%,
      transparent 100%
    )`,
    borderRadius: `${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0 0`,
  },
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: `
      0 20px 40px ${alpha(theme.palette.common.black, 0.15)},
      0 0 20px ${alpha(theme.palette.primary.main, 0.1)}
    `,
    borderColor: alpha(theme.palette.primary.main, 0.3),
    '& .icon-container': {
      transform: 'scale(1.1) rotate(10deg)',
      boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.3)}`,
    }
  }
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main},
    ${theme.palette.secondary.main}
  )`,
  boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
  color: theme.palette.common.white,
  transition: 'all 0.4s ease-in-out',
  position: 'relative',
  className: 'icon-container',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: '50%',
    background: `linear-gradient(135deg,
      ${theme.palette.primary.main},
      ${theme.palette.secondary.main}
    )`,
    opacity: 0.3,
    zIndex: -1,
  }
}));

const ContactTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  fontSize: '1.25rem',
  letterSpacing: '0.5px',
  textAlign: 'center',
}));

const ContactText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  fontSize: '1rem',
  lineHeight: 1.6,
  padding: theme.spacing(0, 2),
}));

const ContactLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: theme.palette.common.white,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  padding: theme.spacing(1.2, 2.5),
  borderRadius: theme.shape.borderRadius * 3,
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.secondary.main}
  )`,
  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.25)}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  }
}));

const ContactSection = ({ data }) => {
  const basics = data?.basics || {};
  const socialLinks = data?.socialLinks || {};

  return (
    <StyledSection id="contact">
      <GlobalStylesInjector />
      
      <Shape1 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <Shape2 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          px: { xs: 0, sm: 2 }
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Title
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Let's Connect
          </Title>
          <Subtitle
            component={motion.p}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Ready to start your next project? Get in touch!
          </Subtitle>

          <ContactGrid>
            {basics.email && (
              <ContactItem
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <IconContainer>
                  <EmailIcon sx={{ fontSize: 35 }} />
                </IconContainer>
                <ContactTitle variant="h6">Email</ContactTitle>
                <ContactText>{basics.email}</ContactText>
              </ContactItem>
            )}

            {basics.phone && (
              <ContactItem
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <IconContainer>
                  <PhoneIcon sx={{ fontSize: 35 }} />
                </IconContainer>
                <ContactTitle variant="h6">Phone</ContactTitle>
                <ContactText>{basics.phone}</ContactText>
              </ContactItem>
            )}

            {basics.location && (
              <ContactItem
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <IconContainer>
                  <LocationOnIcon sx={{ fontSize: 35 }} />
                </IconContainer>
                <ContactTitle variant="h6">Location</ContactTitle>
                <ContactText>{basics.location}</ContactText>
              </ContactItem>
            )}

            {getSocialLink('linkedin', socialLinks) && (
              <ContactItem
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <IconContainer>
                  <LinkedInIcon sx={{ fontSize: 35 }} />
                </IconContainer>
                <ContactTitle variant="h6">LinkedIn</ContactTitle>
                <ContactText>Connect with me professionally</ContactText>
              </ContactItem>
            )}

            {getSocialLink('github', socialLinks) && (
              <ContactItem
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <IconContainer>
                  <GitHubIcon sx={{ fontSize: 35 }} />
                </IconContainer>
                <ContactTitle variant="h6">GitHub</ContactTitle>
                <ContactText>Check out my code repositories</ContactText>
              </ContactItem>
            )}
          </ContactGrid>
        </motion.div>
      </Container>
    </StyledSection>
  );
};

export default ContactSection;