import React, { useState, useEffect } from 'react';
import { Box, Container, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, AppBar, Toolbar, Typography, Link, Divider, Avatar } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, Home as HomeIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { alpha } from '@mui/material/styles';

const Navigation = ({ sectionsToRender, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Track scroll position and active section
  useEffect(() => {
    const handleScroll = () => {
      // Update scrolled state
      setIsScrolled(window.scrollY > 50);
      
      // Determine active section based on scroll position
      const sections = sectionsToRender || defaultNavLinks.map(link => link.id);
      const scrollPosition = window.scrollY + 100; // Offset for better detection
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionsToRender]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const defaultNavLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' },
  ];

  const navLinksToShow = sectionsToRender && sectionsToRender.length > 0
    ? defaultNavLinks.filter(link => sectionsToRender.includes(link.id))
    : defaultNavLinks;

  const navStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: isScrolled 
      ? alpha(theme.palette.background.paper, 0.95) 
      : alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(10px)',
    boxShadow: isScrolled ? theme.shadows[4] : 'none',
    transition: 'all 0.3s ease-in-out',
    borderBottom: isScrolled 
      ? `1px solid ${alpha(theme.palette.divider, 0.1)}` 
      : 'none',
  };

  const containerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingY: 1.5,
    [theme.breakpoints.down('sm')]: {
      paddingY: 1,
    },
  };

  const logoStyles = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
    textDecoration: 'none',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  };

  const navLinksContainerStyles = {
    display: 'flex',
    gap: 3,
    [theme.breakpoints.down('lg')]: {
      gap: 2,
    },
  };

  const getNavLinkStyles = (isActive) => ({
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: isActive ? 600 : 500,
    position: 'relative',
    paddingY: 1,
    transition: 'all 0.3s ease-in-out',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: isActive ? '100%' : '0%',
      height: '2px',
      backgroundColor: theme.palette.primary.main,
      transition: 'width 0.3s ease-in-out',
    },
    '&:hover': {
      color: theme.palette.primary.main,
      '&::after': {
        width: '100%',
      },
    },
  });

  const menuButtonStyles = {
    color: theme.palette.text.primary,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      transform: 'scale(1.1)',
    },
  };

  const drawerStyles = {
    '& .MuiDrawer-paper': {
      width: '280px',
      backgroundColor: theme.palette.background.paper,
      padding: 0,
      boxShadow: theme.shadows[8],
      border: 'none',
    },
  };

  const drawerHeaderStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 3,
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
    position: 'relative',
  };

  const drawerProfileStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 2,
  };

  const drawerAvatarStyles = {
    width: 80,
    height: 80,
    marginBottom: 1,
    border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.dark, 0.2)}`,
  };

  const drawerNameStyles = {
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginBottom: 0.5,
  };

  const drawerRoleStyles = {
    color: theme.palette.primary.main,
    fontSize: '0.9rem',
  };

  const drawerCloseButtonStyles = {
    position: 'absolute',
    top: 16,
    right: 16,
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main,
      transform: 'scale(1.1)',
    },
  };

  const drawerListStyles = {
    padding: 2,
    width: '100%',
  };

  const getDrawerItemStyles = (isActive) => ({
    paddingY: 1.5,
    paddingX: 2,
    borderRadius: 1,
    marginBottom: 0.5,
    backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
    '&:hover': {
      backgroundColor: isActive 
        ? alpha(theme.palette.primary.main, 0.12) 
        : alpha(theme.palette.action.hover, 0.04),
    },
  });

  const getDrawerItemTextStyles = (isActive) => ({
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    fontWeight: isActive ? 600 : 500,
    '& .MuiListItemText-primary': {
      fontWeight: isActive ? 600 : 500,
    }
  });

  const renderNavLinks = () => (
    <Box sx={navLinksContainerStyles}>
      {navLinksToShow.map((link) => {
        const isActive = activeSection === link.id;
        return (
          <motion.div
            key={link.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={`#${link.id}`}
              sx={getNavLinkStyles(isActive)}
            >
              {link.label}
            </Link>
          </motion.div>
        );
      })}
    </Box>
  );

  const renderDrawer = () => (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={toggleDrawer}
      sx={drawerStyles}
    >
      <Box sx={drawerHeaderStyles}>
        <IconButton 
          onClick={toggleDrawer} 
          aria-label="close drawer"
          sx={drawerCloseButtonStyles}
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={drawerProfileStyles}>
          <Avatar 
            src={data?.basics?.profileImage} 
            alt={data?.basics?.name || 'Profile'} 
            sx={drawerAvatarStyles}
          />
          <Typography variant="h6" sx={drawerNameStyles}>
            {data?.basics?.name || 'Portfolio'}
          </Typography>
          <Typography variant="body2" sx={drawerRoleStyles}>
            {data?.basics?.role || 'Developer'}
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      <Box sx={drawerListStyles} role="presentation">
        <List>
          <ListItem
            button
            component={Link}
            href="#"
            onClick={toggleDrawer}
            sx={getDrawerItemStyles(activeSection === '')}
          >
            <ListItemText
              primary="Home"
              sx={getDrawerItemTextStyles(activeSection === '')}
            />
          </ListItem>
          
          {navLinksToShow.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <ListItem
                key={link.id}
                button
                component={Link}
                href={`#${link.id}`}
                onClick={toggleDrawer}
                sx={getDrawerItemStyles(isActive)}
              >
                <ListItemText
                  primary={link.label}
                  sx={getDrawerItemTextStyles(isActive)}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar
      component={motion.nav}
      sx={navStyles}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={0}
    >
      <Container maxWidth="lg" sx={containerStyles}>
        <Typography
          variant="h6"
          component={motion.a}
          href="#"
          sx={logoStyles}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {data?.basics?.name || 'Portfolio'}
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              sx={menuButtonStyles}
              onClick={toggleDrawer}
              aria-label="menu"
              edge="end"
            >
              <MenuIcon />
            </IconButton>
            {renderDrawer()}
          </>
        ) : (
          renderNavLinks()
        )}
      </Container>
    </AppBar>
  );
};

export default Navigation; 