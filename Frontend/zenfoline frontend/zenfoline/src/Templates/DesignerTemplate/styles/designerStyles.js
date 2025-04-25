import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';

export const Root = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at top right, ${theme.palette.primary.main}15, transparent 50%),
                radial-gradient(circle at bottom left, ${theme.palette.secondary.main}15, transparent 50%)`,
    zIndex: 0,
    pointerEvents: 'none'
  }
}));

export const MainContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  }
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default
}));

export const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
  '& .MuiTypography-root': {
    marginBottom: theme.spacing(2)
  }
}));

export const SectionWrapper = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}));

export const SectionTitle = styled(motion.h2)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.primary,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 60,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
    marginBottom: theme.spacing(3)
  }
}));

export const SectionSubtitle = styled(motion.p)(({ theme }) => ({
  fontSize: '1.1rem',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(6),
  maxWidth: '800px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    marginBottom: theme.spacing(4)
  }
}));

export const Card = styled(motion.div)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3)
  }
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2),
  '& svg': {
    width: 24,
    height: 24
  }
}));

export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(4),
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(3)
  }
}));

export const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 2,
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    opacity: 0.2
  },
  [theme.breakpoints.down('sm')]: {
    '&::before': {
      left: 20
    }
  }
}));

export const TimelineItem = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '50%',
    top: 0,
    transform: 'translateX(-50%)',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    zIndex: 1
  },
  [theme.breakpoints.down('sm')]: {
    '&::before': {
      left: 20
    }
  }
}));

export const TimelineContent = styled(Box)(({ theme }) => ({
  width: 'calc(50% - 30px)',
  marginLeft: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100% - 50px)',
    marginLeft: 50
  }
}));

export const Tag = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '0.875rem',
  margin: theme.spacing(0.5),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

export const Button = styled(motion.button)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 500,
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  },
  '& svg': {
    marginLeft: theme.spacing(1)
  }
}));

export const Section = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  position: 'relative',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const CardMedia = styled('div')(({ theme }) => ({
  paddingTop: '56.25%', // 16:9 aspect ratio
  position: 'relative',
  overflow: 'hidden',
  '& img': {
    transition: 'transform 0.5s ease-in-out',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

export const CardActions = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  justifyContent: 'flex-end',
}));

export const SkillChip = styled('div')(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 20,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

export const SkillBar = styled('div')(({ theme }) => ({
  width: '100%',
  height: 8,
  backgroundColor: theme.palette.grey[200],
  borderRadius: 4,
  overflow: 'hidden',
  marginTop: theme.spacing(1),
}));

export const SkillBarProgress = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.primary.main,
  borderRadius: 4,
  transition: 'width 1s ease-in-out',
}));

export const ProjectGrid = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

export const ProjectCard = styled('div')(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[10],
    transform: 'translateY(-8px)',
  },
}));

export const ProjectImage = styled('div')(({ theme }) => ({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

export const ProjectOverlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  '&:hover': {
    opacity: 1,
  },
}));

export const ProjectTitle = styled('h3')(({ theme }) => ({
  color: '#fff',
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));

export const ProjectDescription = styled('p')(({ theme }) => ({
  color: '#fff',
  textAlign: 'center',
  padding: theme.spacing(2),
}));

export const ProjectLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export const Timeline = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4, 0),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 2,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const ContactItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

export const ContactIcon = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
}));

export const ContactText = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const SocialLinks = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(3),
}));

export const SocialIcon = styled('a')(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: theme.palette.text.secondary,
  transition: 'color 0.3s ease-in-out',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

export const Loader = styled('div')(({ theme }) => ({
  width: 50,
  height: 50,
  border: `5px solid ${theme.palette.grey[300]}`,
  borderRadius: '50%',
  borderTopColor: theme.palette.primary.main,
  animation: '$spin 1s linear infinite',
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
})); 