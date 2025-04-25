import React from 'react';
import { Box, Container, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import { styled, alpha } from '@mui/material/styles'; // Import alpha
import { motion } from 'framer-motion';

// Re-add helper function
const getSkillLevelPercentage = (level) => {
  switch (level?.toLowerCase()) {
    case 'beginner': return 25;
    case 'intermediate': return 50;
    case 'advanced': return 75;
    case 'expert': return 90;
    default: return 50;
  }
};

// --- Styled Components ---

const StyledSkillsSection = styled(Box)(({ theme }) => ({
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
      45deg,
      ${alpha(theme.palette.secondary.main, 0.02)} 0px,
      ${alpha(theme.palette.secondary.main, 0.02)} 2px,
      transparent 2px,
      transparent 10px
    )`,
    zIndex: 0,
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
}));

// Consistent Title styling with AboutSection
const SectionTitle = styled(motion.h2)(({ theme }) => ({
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
    backgroundColor: theme.palette.secondary.main, // Use secondary color for consistency
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

// Updated Category Title
const CategoryTitle = styled(motion.h3)(({ theme }) => ({
    ...theme.typography.h4,
    fontSize: 'clamp(1.5rem, 4vw, 1.8rem)',
    fontWeight: 600,
    marginBottom: theme.spacing(4),
    color: theme.palette.text.primary,
    position: 'relative',
    paddingLeft: theme.spacing(3), // Make space for the pseudo-element
    // Remove borderBottom and paddingBottom
    // borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    // paddingBottom: theme.spacing(1),
    '&::before': { // Add decorative element
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: theme.spacing(1.5), // size of the square
        height: theme.spacing(1.5),
        backgroundColor: theme.palette.primary.main, // Use theme color
        borderRadius: '2px',
        boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.5)}`,
    },
}));

// Updated SkillCard for Row Layout
const SkillCard = styled(motion.div)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(2, 2.5), // Adjust padding for row layout
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'border-color 0.3s ease, transform 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'row', // Explicitly row (default)
  alignItems: 'center', // Align items vertically center in the row
  gap: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-3px)',
    borderColor: theme.palette.primary.main,
  },
  minWidth: '180px', // Add a minimum width to prevent cards from becoming too narrow
}));

const SkillName = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  fontSize: '0.95rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  flexGrow: 1, // Name takes up available space
  margin: 0, // Reset margin
  whiteSpace: 'nowrap', // Prevent wrapping if possible
  overflow: 'hidden',
  textOverflow: 'ellipsis', // Add ellipsis if name is too long
}));

// Container for Progress Bar and Level Text
const SkillProgressContainer = styled(Box)(({ theme }) => ({
    width: '100px', // Fixed width for progress bar + level area
    flexShrink: 0, // Prevent shrinking
    textAlign: 'right', // Align level text to the right
}));

const ProgressBar = styled(Box)(({ theme }) => ({
    height: '6px', // Slightly thinner bar
    backgroundColor: alpha(theme.palette.primary.light, 0.15),
    borderRadius: '3px',
    overflow: 'hidden',
    width: '100%', // Full width within its container
    marginBottom: theme.spacing(0.5), // Space between bar and level text
}));

const ProgressFill = styled(motion.div)(({ theme }) => ({
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '3px',
}));

const SkillLevel = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  fontSize: '0.7rem',
  lineHeight: 1, // Adjust line height
  // Removed marginTop and textAlign (handled by container)
}));

// Renamed and updated to use Flexbox row layout
const SkillsRowContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row', // Explicitly row
    gap: theme.spacing(3), // Spacing between cards
    overflowX: 'auto', // Enable horizontal scrolling
    paddingBottom: theme.spacing(2), // Space for scrollbar
    // Optional: add some horizontal padding if needed
    // paddingLeft: theme.spacing(1),
    // paddingRight: theme.spacing(1),
    // Hide scrollbar visually (optional, depends on browser/OS)
    '&::-webkit-scrollbar': {
        height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: alpha(theme.palette.text.primary, 0.2),
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
    },
    // Only show scrollbar when content overflows
    '&::-webkit-scrollbar-thumb:not(:hover)': {
        backgroundColor: alpha(theme.palette.text.primary, 0.1),
    },
    // Hide scrollbar when not needed
    '&::-webkit-scrollbar-thumb:not(:hover):not(:active)': {
        backgroundColor: 'transparent',
    },
    // Add flex-wrap for smaller screens
    [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
        overflowX: 'visible',
        paddingBottom: 0,
    },
}));

// --- Component Implementation ---

const SkillsSection = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }, // Faster stagger for skills
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 }, // Slide in from left slightly
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Animation variants for the progress bar fill
  const progressVariants = {
    hidden: { width: '0%' },
    visible: (percentage) => ({
      width: `${percentage}%`,
      transition: { duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.3 }, // Added delay
    }),
  };

  return (
    <StyledSkillsSection id="skills">
      {/* Removed Background Circles */}
      <StyledContainer maxWidth="lg"> {/* Use lg for potentially wider skill sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // Trigger earlier
        >
          <SectionTitle variants={itemVariants}>
            Skills
          </SectionTitle>

          <ContentGrid container spacing={{ xs: 4, md: 6 }}>
            {/* Technical Skills */}
            {data?.technical && data.technical.length > 0 && (
              <Grid item xs={12} md={6}>
                <CategoryTitle variants={itemVariants}>
                  Technical Skills
                </CategoryTitle>
                {/* Use the new SkillsRowContainer */}
                <SkillsRowContainer> 
                  {data.technical.map((skill, index) => {
                    const percentage = getSkillLevelPercentage(skill.level);
                    return (
                      <SkillCard 
                        key={index}
                        variants={itemVariants} 
                        layout 
                        whileHover={{ y: -3 }}
                        sx={{ 
                          minWidth: isMobile ? '100%' : '180px',
                          marginBottom: isMobile ? theme.spacing(2) : 0
                        }}
                      >
                        <SkillName title={skill.name}>{skill.name}</SkillName>
                        <SkillProgressContainer>
                            <ProgressBar>
                                <ProgressFill
                                    variants={progressVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    custom={percentage}
                                />
                            </ProgressBar>
                            {skill.level && <SkillLevel>{skill.level}</SkillLevel>}
                        </SkillProgressContainer>
                      </SkillCard>
                    );
                  })}
                </SkillsRowContainer>
              </Grid>
            )}

            {/* Soft Skills */}            
            {data?.soft && data.soft.length > 0 && (
              <Grid item xs={12} md={6}>
                <CategoryTitle variants={itemVariants}>
                  Soft Skills
                </CategoryTitle>
                 {/* Use the new SkillsRowContainer */}
                 <SkillsRowContainer>
                  {data.soft.map((skill, index) => {
                     const percentage = getSkillLevelPercentage(skill.level);
                    return (
                       <SkillCard 
                          key={index}
                          variants={itemVariants} 
                          layout
                          whileHover={{ y: -3 }}
                          sx={{ 
                            minWidth: isMobile ? '100%' : '180px',
                            marginBottom: isMobile ? theme.spacing(2) : 0
                          }}
                        >
                        <SkillName title={skill.name}>{skill.name}</SkillName>
                        <SkillProgressContainer>
                            <ProgressBar>
                            <ProgressFill
                                variants={progressVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={percentage}
                            />
                            </ProgressBar>
                            {skill.level && <SkillLevel>{skill.level}</SkillLevel>}
                        </SkillProgressContainer>
                      </SkillCard>
                     );
                  })}
                </SkillsRowContainer>
              </Grid>
            )}
          </ContentGrid>
        </motion.div>
      </StyledContainer>
    </StyledSkillsSection>
  );
};

export default SkillsSection; 