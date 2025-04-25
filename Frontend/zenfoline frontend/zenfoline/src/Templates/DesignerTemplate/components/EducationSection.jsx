import React, { useState } from 'react';
import { Box, Container, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/helpers';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GradeIcon from '@mui/icons-material/Grade';
import BookIcon from '@mui/icons-material/Book';

// --- Styled Components ---

const StyledEducationSection = styled(Box)(({ theme }) => ({
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
  zIndex: 1,
}));

// Consistent Title styling with other sections
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

// Timeline container with unique design
const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: '100%',
  margin: '0 auto',
  paddingLeft: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(3),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: theme.spacing(2),
    top: 0,
    bottom: 0,
    width: 2,
    background: `linear-gradient(to bottom, 
      ${alpha(theme.palette.secondary.main, 0.2)}, 
      ${alpha(theme.palette.primary.main, 0.2)}
    )`,
    borderRadius: theme.shape.borderRadius * 3,
  },
}));

// Timeline item with unique design
const TimelineItem = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(6),
  '&:last-child': {
    marginBottom: 0,
  },
}));

// Timeline dot with unique design
const TimelineDot = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  left: -theme.spacing(5),
  top: theme.spacing(0.5),
  width: theme.spacing(2),
  height: theme.spacing(2),
  borderRadius: '50%',
  backgroundColor: theme.palette.secondary.main,
  boxShadow: `0 0 0 ${theme.spacing(1)} ${theme.palette.background.paper}`,
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    left: -theme.spacing(3),
  },
}));

// Education card with unique design
const EducationCard = styled(motion.div)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.05)}`,
  border: `2px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 15px 40px ${alpha(theme.palette.common.black, 0.1)}`,
    borderColor: alpha(theme.palette.secondary.main, 0.3),
    '&::before': {
      transform: 'scale(1.05)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      linear-gradient(135deg, 
        ${alpha(theme.palette.secondary.main, 0.05)}, 
        ${alpha(theme.palette.primary.main, 0.05)}
      ),
      repeating-radial-gradient(
        circle at 50% 50%,
        transparent 10px,
        ${alpha(theme.palette.secondary.main, 0.02)} 11px,
        transparent 12px
      )
    `,
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
    borderRadius: theme.shape.borderRadius,
    pointerEvents: 'none',
  }
}));

// Date badge with unique design
const DateBadge = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(2),
  backgroundColor: alpha(theme.palette.secondary.main, 0.08),
  color: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius * 3,
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '0.3px',
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '1.1rem',
  },
}));

// Degree title with unique design
const DegreeTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  position: 'relative',
  paddingLeft: theme.spacing(3),
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '2px',
    boxShadow: `0 0 10px ${alpha(theme.palette.secondary.main, 0.3)}`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -theme.spacing(1),
    left: theme.spacing(3),
    right: 0,
    height: 1,
    background: `linear-gradient(90deg, 
      ${alpha(theme.palette.secondary.main, 0.3)}, 
      transparent
    )`,
  }
}));

// Institution info with unique design
const InstitutionInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  opacity: 0.9,
  fontSize: '1.1rem',
  fontWeight: 600,
  letterSpacing: '0.3px',
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  '& svg': {
    marginRight: theme.spacing(1.5),
    fontSize: '1.3rem',
    color: theme.palette.secondary.main,
  },
}));

// Field info with unique design
const FieldInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  fontWeight: 500,
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.background.paper, 0.3),
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
  '& svg': {
    marginRight: theme.spacing(1.5),
    fontSize: '1.2rem',
    color: theme.palette.primary.main,
  },
}));

// GPA badge with unique design
const GPABadge = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius * 3,
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '0.3px',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '1.1rem',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
  },
}));

// Achievement section label
const AchievementLabel = styled(Typography)(({ theme }) => ({
  position: 'relative',
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

// Achievements container with unique design
const AchievementsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(3),
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const AchievementsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
}));

// Achievement tag with unique design
const AchievementTag = styled(motion.span)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.75, 1.5),
  backgroundColor: alpha(theme.palette.secondary.main, 0.08),
  color: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius * 3,
  fontSize: '0.875rem',
  fontWeight: 500,
  letterSpacing: '0.3px',
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.15),
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 8px ${alpha(theme.palette.secondary.main, 0.15)}`,
  },
  '&::before': {
    content: '"•"',
    marginRight: theme.spacing(1),
    color: theme.palette.secondary.main,
    fontSize: '1.2rem',
    lineHeight: 0,
  }
}));

// Decorative elements
const DecorativeShape = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  zIndex: 0,
  opacity: 0.1,
}));

const Circle1 = styled(DecorativeShape)(({ theme }) => ({
  top: '10%',
  right: '5%',
  width: 200,
  height: 200,
  borderRadius: '50%',
  background: theme.palette.secondary.main,
}));

const Circle2 = styled(DecorativeShape)(({ theme }) => ({
  bottom: '10%',
  left: '5%',
  width: 150,
  height: 150,
  borderRadius: '50%',
  background: theme.palette.primary.main,
}));

// --- Component Implementation ---

const EducationSection = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeEducation, setActiveEducation] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const dotVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }
    },
    hover: { 
      scale: 1.2,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  return (
    <StyledEducationSection id="education">
      <Circle1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <Circle2
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      />

      <StyledContainer maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionTitle variants={itemVariants}>
            Education
          </SectionTitle>

          <TimelineContainer>
            {data?.map((education, index) => (
              (education.isVisible !== false) && (
                <TimelineItem key={education._id || index} variants={itemVariants}>
                  <TimelineDot 
                    variants={dotVariants}
                    whileHover="hover"
                  />
                  
                  <EducationCard
                    onHoverStart={() => setActiveEducation(index)}
                    onHoverEnd={() => setActiveEducation(null)}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DateBadge variant="body2">
                      <CalendarTodayIcon fontSize="small" />
                      {formatDate(education.startDate)} - {education.current ? 'Present' : formatDate(education.endDate)}
                    </DateBadge>
                    
                    <DegreeTitle variant="h6">
                      {education.degree}
                    </DegreeTitle>
                    
                    <InstitutionInfo>
                      <SchoolIcon />
                      {education.institution}
                    </InstitutionInfo>
                    
                    <FieldInfo>
                      <BookIcon />
                      Field of Study: {education.field}
                    </FieldInfo>
                    
                    {education.gpa && (
                      <GPABadge variant="body2">
                        <GradeIcon fontSize="small" />
                        GPA: {education.gpa}
                      </GPABadge>
                    )}
                    
                    {education.achievements && education.achievements.length > 0 && (
                      <AchievementsContainer>
                        <AchievementLabel>
                          Achievements
                        </AchievementLabel>
                        <AchievementsList>
                          {education.achievements.map((achievement, idx) => (
                            <AchievementTag
                              key={idx}
                              whileHover={{ y: -2 }}
                              transition={{ duration: 0.2 }}
                            >
                              {achievement}
                            </AchievementTag>
                          ))}
                        </AchievementsList>
                      </AchievementsContainer>
                    )}
                  </EducationCard>
                </TimelineItem>
              )
            ))}
          </TimelineContainer>
        </motion.div>
      </StyledContainer>
    </StyledEducationSection>
  );
};

export default EducationSection; 