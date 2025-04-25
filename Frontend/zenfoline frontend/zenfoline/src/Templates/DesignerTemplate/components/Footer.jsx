import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = ({ data }) => {
  const theme = useTheme();

  const footerStyles = {
    paddingY: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderTop: `1px solid ${theme.palette.primary.light}30`,
    position: 'relative',
    overflow: 'hidden',
  };

  const containerStyles = {
    position: 'relative',
    zIndex: 1,
  };

  const textStyles = {
    textAlign: 'center',
    color: 'text.secondary',
    opacity: 0.8,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const heartStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginX: '0.25rem',
    color: 'primary.main',
    fontSize: '1rem',
    filter: `drop-shadow(0 0 3px ${theme.palette.primary.main}30)`,
  };

  const designElementStyles = {
    position: 'absolute',
    opacity: 0.1,
    zIndex: 0,
  };

  const circle1Styles = {
    ...designElementStyles,
    top: '50%',
    left: '10%',
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: theme.palette.primary.main,
    transform: 'translateY(-50%)',
  };

  const circle2Styles = {
    ...designElementStyles,
    top: '50%',
    right: '10%',
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: theme.palette.secondary.main,
    transform: 'translateY(-50%)',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const textVariants = {
    hidden: { y: 20 },
    visible: {
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  const heartVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.5,
      },
    },
  };

  return (
    <Box component="footer" sx={footerStyles}>
      <Box component={motion.div} sx={circle1Styles} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      <Box component={motion.div} sx={circle2Styles} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} />

      <Container maxWidth="lg" sx={containerStyles}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={textVariants}>
            <Typography sx={textStyles}>
              &copy; {new Date().getFullYear()} {'Zenfoline'}. All rights reserved.
              <Box component={motion.span} variants={heartVariants} sx={heartStyles} whileHover={{ scale: 1.2, rotate: 5 }} transition={{ duration: 0.2 }}>
                <FavoriteIcon fontSize="inherit" />
              </Box>
            </Typography>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer; 