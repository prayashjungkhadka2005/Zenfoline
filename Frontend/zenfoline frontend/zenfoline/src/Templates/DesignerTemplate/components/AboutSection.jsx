import React from 'react';
import { Box, Container, Typography, Grid, useTheme, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// --- Styled Components (Modernized) ---

const StyledAboutSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(14, 2),
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
      padding: theme.spacing(20, 2),
  },
  // Add unique background pattern
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

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const Title = styled(motion.h2)(({ theme }) => ({
  ...theme.typography.h2,
  fontSize: 'clamp(2.1rem, 5.5vw, 2.9rem)',
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
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

const ContentGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(12),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -30,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: 1,
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.divider, 0.3)}, transparent)`,
  },
}));

const SummaryTypography = styled(motion.p)(({ theme }) => ({
  ...theme.typography.body1,
  fontSize: 'clamp(1rem, 2.2vw, 1.1rem)',
  lineHeight: 1.8,
  color: theme.palette.text.secondary,
  maxWidth: '700px',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    margin: `0 0 ${theme.spacing(3)}px 0`,
    textAlign: 'left',
  },
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
  },
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

// Container for the highlights section
const HighlightsSectionContainer = styled(motion.div)(({ theme }) => ({
    marginTop: theme.spacing(8),
    width: '100%', // Ensure it takes full width of its parent Grid item
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60%',
      height: 1,
      background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.divider, 0.3)}, transparent)`,
    },
}));

// Styling for each highlight item within the Grid
const HighlightItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 0), // Add some padding
    position: 'relative',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateX(5px)',
    },
}));

const HighlightIcon = styled(CheckCircleOutlineIcon)(({ theme }) => ({
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1.5),
    fontSize: '1.2rem', // Adjust icon size
}));

const HighlightText = styled(Typography)(({ theme }) => ({
    ...theme.typography.body1,
    color: theme.palette.text.secondary,
    lineHeight: 1.6, // Adjust line height if needed
}));

// --- Background Shapes ---
const BackgroundShape = styled(motion.div)(({ theme }) => ({
    position: 'absolute',
    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', // Organic blob shape
    opacity: 0.08, // Very subtle
    zIndex: 1, // Behind content
    pointerEvents: 'none', // Ignore pointer events
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
    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', // Different blob shape
    animation: 'rotate 50s linear infinite reverse',
}));

// Keyframes for rotation (optional, could be simple positioning)
const Keyframes = `
  @keyframes rotate {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.05); }
    100% { transform: rotate(360deg) scale(1); }
  }
`;

// Inject keyframes globally (or manage via CSS-in-JS solution)
// For simplicity, adding a hidden element to include keyframes string
const GlobalStylesInjector = () => <style>{Keyframes}</style>; 

// --- Component Implementation ---

const AboutSection = ({ data }) => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const descriptionText = data?.description || 
    'Passionate designer crafting intuitive and engaging digital experiences. Bringing ideas to life with clean code and user-centered design.';

  return (
    <StyledAboutSection id="about">
      {/* Inject Keyframes */}
      <GlobalStylesInjector /> 

      {/* Background Shapes */}
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

      <StyledContainer maxWidth="md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Title variants={itemVariants}>
            About Me
          </Title>

          <ContentGrid container spacing={{ xs: 4, md: 6 }} justifyContent="center">
            <Grid item xs={12} md={data?.vision ? 6 : 10} lg={data?.vision ? 6 : 8}>
              <SummaryTypography variants={itemVariants}>
                {descriptionText}
              </SummaryTypography>
            </Grid>

            {data?.vision && (
              <Grid item xs={12} md={6} lg={6}>
                <SummaryTypography variants={itemVariants}>
                  {data.vision}
                </SummaryTypography>
              </Grid>
            )}

            {data?.highlights && data.highlights.length > 0 && (
              <Grid item xs={12}>
                <HighlightsSectionContainer variants={itemVariants}>
                  <Typography variant="h5" component="h3" sx={{ mb: 4, textAlign: 'center', fontWeight: 600, color: 'text.secondary' }}>
                    Key Strengths
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    {data.highlights.map((highlight, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <motion.div variants={itemVariants}>
                          <HighlightItem>
                            <HighlightIcon fontSize="small" />
                            <HighlightText>
                              {typeof highlight === 'object' ? highlight.text : highlight}
                            </HighlightText>
                          </HighlightItem>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </HighlightsSectionContainer>
              </Grid>
            )}
          </ContentGrid>
        </motion.div>
      </StyledContainer>
    </StyledAboutSection>
  );
};

export default AboutSection; 