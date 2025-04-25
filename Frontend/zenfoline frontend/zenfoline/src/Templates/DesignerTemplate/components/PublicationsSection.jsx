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
  publicationCard: {
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
  publicationTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  publisher: {
    display: 'inline-block',
    padding: theme.spacing(0.5, 1.5),
    backgroundColor: `${theme.palette.primary.main}15`,
    color: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius * 3,
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: theme.spacing(2),
  },
  description: {
    color: theme.palette.text.secondary,
    opacity: 0.8,
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: theme.spacing(2),
    flexGrow: 1,
  },
  linkContainer: {
    marginTop: 'auto',
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: theme.spacing(0.75, 1.5),
    backgroundColor: `${theme.palette.primary.main}15`,
    color: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius * 3,
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main}30`,
      transform: 'translateY(-2px)',
    },
  },
  linkIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1rem',
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

const PublicationsSection = ({ data }) => {
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

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <Box id="publications" className={classes.section}>
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
              Publications
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {data?.map((pub, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box className={classes.publicationCard}>
                    {pub.image && (
                      <Box className={classes.imageContainer}>
                        <motion.img
                          src={pub.image}
                          alt={pub.title}
                          className={classes.image}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x200?text=Publication+Image';
                          }}
                        />
                      </Box>
                    )}
                    <Box className={classes.content}>
                      <Typography variant="h6" className={classes.publicationTitle}>
                        {pub.title}
                      </Typography>
                      <Typography className={classes.publisher}>
                        {pub.publisher} - {formatDate(pub.date || pub.publicationDate)}
                      </Typography>
                      <Typography variant="body2" className={classes.description}>
                        {pub.description}
                      </Typography>
                      
                      {pub.url && (
                        <Box className={classes.linkContainer}>
                          <motion.a
                            href={pub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.link}
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                          >
                            <motion.svg
                              className={classes.linkIcon}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </motion.svg>
                            Read More
                          </motion.a>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PublicationsSection; 