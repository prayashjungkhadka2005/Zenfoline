import React from 'react';
import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/helpers';

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
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    border: `1px solid ${theme.palette.primary.light}30`,
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
      border: `1px solid ${theme.palette.primary.light}50`,
    },
  },
  imageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  content: {
    padding: theme.spacing(3),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  awardTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  issuer: {
    display: 'inline-block',
    padding: theme.spacing(0.5, 1.5),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: theme.shape.borderRadius * 3,
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  description: {
    color: theme.palette.text.secondary,
    lineHeight: 1.6,
    flexGrow: 1,
  },
  designElement: {
    position: 'absolute',
    opacity: 0.1,
    zIndex: 0,
  },
  circle1: {
    top: '10%',
    right: '5%',
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: theme.palette.primary.main,
  },
  circle2: {
    bottom: '10%',
    left: '5%',
    width: 150,
    height: 150,
    borderRadius: '50%',
    background: theme.palette.secondary.main,
  },
  awardIcon: {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))',
  },
  awardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
}));

const AwardsSection = ({ data }) => {
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

  return (
    <Box id="awards" className={classes.section}>
      <motion.div
        className={`${classes.designElement} ${classes.circle1}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className={`${classes.designElement} ${classes.circle2}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
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
              Awards & Recognition
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {data?.map((award, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <Box className={classes.card}>
                    {award.image && (
                      <Box className={classes.imageContainer}>
                        <motion.img
                          src={award.image}
                          alt={award.title}
                          className={classes.image}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x200?text=Award+Image';
                          }}
                        />
                      </Box>
                    )}
                    <Box className={classes.content}>
                      <Box className={classes.awardHeader}>
                        <motion.svg
                          className={classes.awardIcon}
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path d="M20 2H4v2h16V2zm-9 2h2v2h-2V4zM4 6h16v2H4V6zm0 4h16v2H4v-2zm0 4h16v2H4v-2zm0 4h16v2H4v-2z" />
                        </motion.svg>
                        <Typography variant="h6" className={classes.awardTitle}>
                          {award.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" className={classes.issuer}>
                        {award.issuer} • {formatDate(award.date)}
                      </Typography>
                      <Typography variant="body1" className={classes.description}>
                        {award.description}
                      </Typography>
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

export default AwardsSection; 