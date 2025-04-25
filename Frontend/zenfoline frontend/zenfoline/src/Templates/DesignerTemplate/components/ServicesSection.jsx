import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Code as CodeIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';

const StyledServicesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(14, 2),
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  position: 'relative',
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

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  padding: theme.spacing(0, 4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2),
  },
}));

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
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
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

const ServiceCard = styled(motion.div)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.05)}`,
  border: `2px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 15px 40px ${alpha(theme.palette.common.black, 0.1)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
    '& .service-image': {
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
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '56.25%', // 16:9 aspect ratio
  overflow: 'hidden',
  backgroundColor: alpha(theme.palette.grey[200], 0.5),
}));

const ServiceImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  background: theme.palette.background.paper,
}));

const ServiceTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  position: 'relative',
  paddingLeft: theme.spacing(2),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: theme.spacing(1),
    height: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    borderRadius: '2px',
    boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

const ServiceDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  flexGrow: 1,
  lineHeight: 1.6,
}));

const PriceTag = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.75, 1.5),
  marginBottom: theme.spacing(2),
  backgroundColor: alpha(theme.palette.secondary.main, 0.08),
  color: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius * 3,
  fontSize: '0.875rem',
  fontWeight: 500,
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '1.1rem',
  },
}));

const FeaturesList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius * 3,
  fontSize: '0.875rem',
  fontWeight: 500,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  '& svg': {
    marginRight: theme.spacing(0.5),
    fontSize: '1rem',
  },
}));

const FloatingShape = styled(motion.div)(({ theme, $top, $left, $right, $bottom, $size, $color }) => ({
  position: 'absolute',
  top: $top,
  left: $left,
  right: $right,
  bottom: $bottom,
  width: $size,
  height: $size,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${alpha($color, 0.2)}, ${alpha($color, 0.1)})`,
  filter: 'blur(40px)',
  zIndex: 0,
  opacity: 0.5,
}));

const ServicesSection = ({ data = [] }) => {
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

  return (
    <StyledServicesSection id="services">
      <FloatingShape
        $top="5%"
        $right="15%"
        $size="300px"
        $color="#4A90E2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <FloatingShape
        $bottom="10%"
        $left="10%"
        $size="250px"
        $color="#E24A84"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      />

      <StyledContainer maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionTitle variants={itemVariants}>
            Services
          </SectionTitle>

          <ContentGrid container spacing={6}>
            {data.map((service, index) => (
              service.isVisible !== false && (
                <Grid 
                  item 
                  key={service._id || index} 
                  xs={12} 
                  sm={6} 
                  md={4}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    padding: theme => theme.spacing(2),
                  }}
                >
                  <ServiceCard variants={itemVariants}>
                    {service.image && (
                      <ImageContainer>
                        <ServiceImage
                          className="service-image"
                          src={service.image}
                          alt={service.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x225?text=Service';
                          }}
                        />
                      </ImageContainer>
                    )}
                    <ContentContainer>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <ServiceTitle variant="h6">
                          {service.title}
                        </ServiceTitle>

                        {service.price && (
                          <PriceTag>
                            <AttachMoneyIcon />
                            {service.price}
                          </PriceTag>
                        )}
                      </Box>

                      <ServiceDescription variant="body1">
                        {service.description}
                      </ServiceDescription>

                      {service.features && service.features.length > 0 && (
                        <FeaturesList>
                          {service.features.map((feature, idx) => (
                            <FeatureItem key={idx}>
                              <CodeIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                              {feature}
                            </FeatureItem>
                          ))}
                        </FeaturesList>
                      )}
                    </ContentContainer>
                  </ServiceCard>
                </Grid>
              )
            ))}
          </ContentGrid>
        </motion.div>
      </StyledContainer>
    </StyledServicesSection>
  );
};

export default ServicesSection; 