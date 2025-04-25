import React from 'react';
import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(10, 0),
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    position: 'relative',
    zIndex: 1,
  },
  title: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -10,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 60,
      height: 3,
      backgroundColor: theme.palette.primary.main,
      borderRadius: 2,
    },
  },
  serviceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    border: `1px solid ${theme.palette.primary.light}30`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
      border: `1px solid ${theme.palette.primary.light}50`,
    },
  },
  imageContainer: {
    position: 'relative',
    paddingTop: '56.25%', // 16:9 aspect ratio
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    padding: theme.spacing(3),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  iconWrapper: {
    backgroundColor: `${theme.palette.primary.main}15`,
    padding: theme.spacing(1),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main}30`,
      transform: 'scale(1.1) rotate(5deg)',
    },
  },
  icon: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
  },
  serviceTitle: {
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  price: {
    display: 'inline-block',
    padding: theme.spacing(0.5, 1.5),
    backgroundColor: `${theme.palette.primary.main}15`,
    color: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius * 3,
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  description: {
    color: theme.palette.text.secondary,
    opacity: 0.8,
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: theme.spacing(3),
  },
  featuresContainer: {
    marginTop: 'auto',
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  featuresTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
    color: theme.palette.text.primary,
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
  },
  checkIcon: {
    color: theme.palette.primary.main,
    fontSize: '1rem',
    marginTop: 2,
  },
  designElement: {
    position: 'absolute',
    opacity: 0.1,
    zIndex: 0,
  },
  circle1: {
    top: '10%',
    left: '5%',
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: theme.palette.primary.main,
  },
  circle2: {
    bottom: '10%',
    right: '5%',
    width: 150,
    height: 150,
    borderRadius: '50%',
    background: theme.palette.secondary.main,
  },
}));

const ServicesSection = ({ data }) => {
  const classes = useStyles();
  const theme = useTheme();

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

  // Map service types to icons
  const getServiceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'webdevelopment':
        return (
          <motion.svg
            className={classes.icon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
          </motion.svg>
        );
      case 'design':
        return (
          <motion.svg
            className={classes.icon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z" />
          </motion.svg>
        );
      case 'marketing':
        return (
          <motion.svg
            className={classes.icon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
          </motion.svg>
        );
      default:
        return (
          <motion.svg
            className={classes.icon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </motion.svg>
        );
    }
  };

  return (
    <Box id="services" className={classes.section}>
      <motion.div
        className={`${classes.designElement} ${classes.circle1}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        className={`${classes.designElement} ${classes.circle2}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      />

      <Container maxWidth="lg" className={classes.container}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <Typography variant="h2" className={classes.title}>
              Services
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {data?.map((service, index) => (
              service.isVisible && (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box className={classes.serviceCard}>
                      {service.image && (
                        <Box className={classes.imageContainer}>
                          <motion.img
                            src={service.image}
                            alt={service.title}
                            className={classes.image}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400x200?text=Service+Image';
                            }}
                          />
                        </Box>
                      )}
                      <Box className={classes.content}>
                        <Box className={classes.header}>
                          <Box className={classes.iconContainer}>
                            <motion.div 
                              className={classes.iconWrapper}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              {getServiceIcon(service.type)}
                            </motion.div>
                            <Typography variant="h6" className={classes.serviceTitle}>
                              {service.title}
                            </Typography>
                          </Box>
                          {service.price && (
                            <motion.div
                              className={classes.price}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              {service.price}
                            </motion.div>
                          )}
                        </Box>
                        <Typography variant="body2" className={classes.description}>
                          {service.description}
                        </Typography>
                        
                        {service.features && service.features.length > 0 && (
                          <Box className={classes.featuresContainer}>
                            <Typography variant="subtitle1" className={classes.featuresTitle}>
                              Key Features:
                            </Typography>
                            <Box component="ul" className={classes.featuresList}>
                              {service.features.map((feature, idx) => (
                                <motion.li
                                  key={idx}
                                  className={classes.featureItem}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                                >
                                  <motion.svg
                                    className={classes.checkIcon}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                  </motion.svg>
                                  {feature}
                                </motion.li>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              )
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ServicesSection; 