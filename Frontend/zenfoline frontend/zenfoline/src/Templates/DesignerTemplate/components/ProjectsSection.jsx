import React, { useState } from 'react';
import { Box, Container, Typography, Grid, useTheme, Link, useMediaQuery } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link as LinkIcon, GitHub as GitHubIcon } from '@mui/icons-material';

// --- Styled Components ---

const StyledProjectsSection = styled(Box)(({ theme }) => ({
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

// Project Card with unique design
const ProjectCard = styled(motion.div)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.05)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 15px 40px ${alpha(theme.palette.common.black, 0.1)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
    '& .project-image': {
      transform: 'scale(1.05)',
    },
    '& .project-overlay': {
      opacity: 1,
    },
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '56.25%', // 16:9 aspect ratio
  overflow: 'hidden',
  backgroundColor: alpha(theme.palette.grey[200], 0.5),
}));

const ProjectImage = styled(motion.img)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
}));

const ProjectOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0.2)}, ${alpha(theme.palette.common.black, 0.7)})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const ProjectContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  background: theme.palette.background.paper,
}));

const ProjectTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  fontWeight: 600,
  marginBottom: theme.spacing(1),
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
  },
}));

const ProjectDescription = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  flexGrow: 1,
}));

const TechnologiesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const TechnologyTag = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius * 3,
  fontSize: '0.75rem',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: 'translateY(-2px)',
  },
}));

const LinksContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  marginTop: 'auto',
}));

const ProjectLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.75, 1.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius * 3,
  fontSize: '0.875rem',
  fontWeight: 500,
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: 'translateY(-2px)',
  },
}));

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
  left: '5%',
  width: 200,
  height: 200,
  borderRadius: '50%',
  background: theme.palette.primary.main,
}));

const Circle2 = styled(DecorativeShape)(({ theme }) => ({
  bottom: '10%',
  right: '5%',
  width: 150,
  height: 150,
  borderRadius: '50%',
  background: theme.palette.secondary.main,
}));

// --- Component Implementation ---

const ProjectsSection = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredProject, setHoveredProject] = useState(null);

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

  const getImageSource = (project) => {
    if (project.image) return project.image;
    if (project.images && project.images.length > 0) {
      const imageUrl = project.images[0];
      if (imageUrl.startsWith('data:image')) return imageUrl;
      if (imageUrl.startsWith('/uploads/')) return `http://localhost:3000${imageUrl}`;
      return imageUrl;
    }
    return null;
  };

  return (
    <StyledProjectsSection id="projects">
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
            Projects
          </SectionTitle>

          <ContentGrid container spacing={4}>
            {data?.map((project, index) => {
              const imageSource = getImageSource(project);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={project._id || index}>
                  <ProjectCard
                    variants={itemVariants}
                    onHoverStart={() => setHoveredProject(index)}
                    onHoverEnd={() => setHoveredProject(null)}
                  >
                    <ImageContainer>
                      {imageSource ? (
                        <ProjectImage
                          className="project-image"
                          src={imageSource}
                          alt={project.title}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(theme.palette.grey[300], 0.5),
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            No image available
                          </Typography>
                        </Box>
                      )}
                      <ProjectOverlay className="project-overlay">
                        <LinksContainer>
                          {project.link && (
                            <ProjectLink
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <LinkIconWrapper>
                                <LinkIcon fontSize="small" />
                              </LinkIconWrapper>
                              Live Demo
                            </ProjectLink>
                          )}
                          {project.github && (
                            <ProjectLink
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <LinkIconWrapper>
                                <GitHubIcon fontSize="small" />
                              </LinkIconWrapper>
                              GitHub
                            </ProjectLink>
                          )}
                        </LinksContainer>
                      </ProjectOverlay>
                    </ImageContainer>
                    <ProjectContent>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectDescription>
                        {project.description}
                      </ProjectDescription>
                      {project.technologies && (
                        <TechnologiesContainer>
                          {project.technologies.map((tech, techIndex) => (
                            <TechnologyTag key={techIndex}>
                              {tech}
                            </TechnologyTag>
                          ))}
                        </TechnologiesContainer>
                      )}
                      {!isMobile && (
                        <LinksContainer>
                          {project.link && (
                            <ProjectLink
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <LinkIconWrapper>
                                <LinkIcon fontSize="small" />
                              </LinkIconWrapper>
                              Live Demo
                            </ProjectLink>
                          )}
                          {project.github && (
                            <ProjectLink
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <LinkIconWrapper>
                                <GitHubIcon fontSize="small" />
                              </LinkIconWrapper>
                              GitHub
                            </ProjectLink>
                          )}
                        </LinksContainer>
                      )}
                    </ProjectContent>
                  </ProjectCard>
                </Grid>
              );
            })}
          </ContentGrid>
        </motion.div>
      </StyledContainer>
    </StyledProjectsSection>
  );
};

export default ProjectsSection;