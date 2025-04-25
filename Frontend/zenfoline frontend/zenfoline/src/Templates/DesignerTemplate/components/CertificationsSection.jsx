import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Link, useTheme, useMediaQuery } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/helpers';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LinkIcon from '@mui/icons-material/Link';
import VerifiedIcon from '@mui/icons-material/Verified';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';

// --- Styled Components ---

const StyledCertificationsSection = styled(Box)(({ theme }) => ({
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
      ${alpha(theme.palette.primary.main, 0.2)}, 
      ${alpha(theme.palette.secondary.main, 0.2)}
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
  backgroundColor: theme.palette.primary.main,
  boxShadow: `0 0 0 ${theme.spacing(1)} ${theme.palette.background.paper}`,
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    left: -theme.spacing(3),
  },
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
    backgroundColor: theme.palette.primary.main,
    borderRadius: 3,
  },
}));

const ContentGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(12),
  position: 'relative',
  width: '100%',
  margin: 0,
  padding: theme.spacing(0, 4)
}));

// Certification card with unique design
const CertificationCard = styled(motion.div)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.05)}`,
  border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 15px 40px ${alpha(theme.palette.common.black, 0.1)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
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
        ${alpha(theme.palette.primary.main, 0.05)}, 
        ${alpha(theme.palette.secondary.main, 0.05)}
      ),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        ${alpha(theme.palette.primary.main, 0.02)} 10px,
        ${alpha(theme.palette.primary.main, 0.02)} 11px
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
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    borderRadius: theme.shape.borderRadius,
    pointerEvents: 'none',
  }
}));

// Certification header with unique design
const CertHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  position: 'relative',
  zIndex: 1
}));

// Certification icon with unique design
const CertIcon = styled(EmojiEventsIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  fontSize: '2.5rem',
  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
  },
}));

// Certification title with unique design
const CertTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  fontWeight: 700,
  color: theme.palette.text.primary,
  flexGrow: 1,
  position: 'relative',
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center'
}));

// Issuer badge with unique design
const IssuerBadge = styled(Typography)(({ theme }) => ({
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
  },
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

// Credential ID with unique design
const CredentialId = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(2),
  opacity: 0.9,
  wordBreak: 'break-all',
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '1.1rem',
    color: theme.palette.primary.main,
  },
}));

// Link container with unique design
const LinkContainer = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  position: 'relative',
  zIndex: 1,
  textAlign: 'right',
}));

// Link with unique design
const CertLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

// Link icon with unique design
const LinkIconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
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
  background: theme.palette.primary.main,
}));

const Circle2 = styled(DecorativeShape)(({ theme }) => ({
  bottom: '10%',
  left: '5%',
  width: 150,
  height: 150,
  borderRadius: '50%',
  background: theme.palette.secondary.main,
}));

// --- Component Implementation ---

const CertificationsSection = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredCert, setHoveredCert] = useState(null);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const dotVariants = {
    hover: {
      scale: 1.2,
      backgroundColor: theme.palette.primary.main,
    },
  };

  return (
    <StyledCertificationsSection id="certifications">
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
            Certifications
          </SectionTitle>

          <TimelineContainer>
            {data?.map((cert, index) => (
              <TimelineItem key={cert._id || index} variants={itemVariants}>
                <TimelineDot 
                  variants={dotVariants}
                  whileHover="hover"
                />
                
                <CertificationCard
                  variants={itemVariants}
                  onHoverStart={() => setHoveredCert(index)}
                  onHoverEnd={() => setHoveredCert(null)}
                >
                  <CertHeader>
                    <CertIcon />
                    <CertTitle variant="h6">
                      {cert.name}
                    </CertTitle>
                  </CertHeader>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flexWrap: 'wrap',
                    marginBottom: 2 
                  }}>
                    <IssuerBadge variant="body2">
                      <BusinessIcon fontSize="small" />
                      Issued by: {cert.issuer}
                    </IssuerBadge>
                    
                    <DateBadge variant="body2">
                      <CalendarTodayIcon fontSize="small" />
                      Issued: {formatDate(cert.issueDate)}
                      {cert.expiryDate && ` - Expires: ${formatDate(cert.expiryDate)}`}
                    </DateBadge>
                  </Box>
                  
                  {cert.credentialId && (
                    <CredentialId variant="body2">
                      <VerifiedIcon fontSize="small" />
                      ID: {cert.credentialId}
                    </CredentialId>
                  )}
                  
                  {cert.credentialUrl && (
                    <LinkContainer>
                      <CertLink
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        component={motion.a}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LinkIconWrapper>
                          <LinkIcon fontSize="small" />
                        </LinkIconWrapper>
                        View Credential
                      </CertLink>
                    </LinkContainer>
                  )}
                </CertificationCard>
              </TimelineItem>
            ))}
          </TimelineContainer>
        </motion.div>
      </StyledContainer>
    </StyledCertificationsSection>
  );
};

export default CertificationsSection; 