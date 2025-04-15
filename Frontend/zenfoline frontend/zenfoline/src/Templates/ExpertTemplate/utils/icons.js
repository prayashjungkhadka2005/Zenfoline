import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaCode, 
  FaServer, 
  FaDatabase, 
  FaTools, 
  FaCloud,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaStar,
  FaRocket,
  FaLightbulb,
  FaCheckCircle,
  FaTrophy,
  FaUsers,
  FaCogs,
  FaChartLine,
  FaShieldAlt,
  FaHeart,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaLink
} from 'react-icons/fa';

// Icon mapping object
export const iconMap = {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaCode,
  FaServer,
  FaDatabase,
  FaTools,
  FaCloud,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaStar,
  FaRocket,
  FaLightbulb,
  FaCheckCircle,
  FaTrophy,
  FaUsers,
  FaCogs,
  FaChartLine,
  FaShieldAlt,
  FaHeart,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaLink
};

// Helper function to get icon component
export const getIconComponent = (iconName) => {
  return iconMap[iconName] || FaCode;
}; 