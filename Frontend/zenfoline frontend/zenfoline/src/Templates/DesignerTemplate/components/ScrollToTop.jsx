import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // --- SX Prop Styles ---
  const scrollButtonStyles = {
    // Note: Position/zIndex applied to the wrapping Box for animation correctness
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50%',
    boxShadow: theme.shadows[3],
    border: `1px solid ${theme.palette.primary.light}30`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[6],
      border: `1px solid ${theme.palette.primary.light}50`,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  };

  const arrowIconStyles = {
    color: 'primary.main',
    transition: 'all 0.3s ease-in-out',
  };
  // --- End SX Prop Styles ---

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          sx={{
            position: 'fixed',
            bottom: { xs: theme.spacing(3), sm: theme.spacing(4) },
            right: { xs: theme.spacing(3), sm: theme.spacing(4) },
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={scrollToTop}
            sx={scrollButtonStyles}
            aria-label="Scroll to top"
            size="large"
          >
            <KeyboardArrowUpIcon sx={arrowIconStyles} />
          </IconButton>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop; 