import { format } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMMM yyyy');
};

export const calculateExperience = (startDate, endDate) => {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  
  let experience = '';
  
  if (years > 0) {
    experience += `${years} year${years > 1 ? 's' : ''} `;
  }
  
  if (months > 0) {
    experience += `${months} month${months > 1 ? 's' : ''}`;
  }
  
  return experience.trim();
};

export const getSkillLevel = (level) => {
  const levels = {
    beginner: 25,
    intermediate: 50,
    advanced: 75,
    expert: 90,
  };
  
  return levels[level?.toLowerCase()] || 0;
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

export const getContrastTextColor = (hexColor) => {
  // Remove the hash if it exists
  hexColor = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export const getRandomGradient = () => {
  const gradients = [
    'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)',
    'linear-gradient(45deg, #4ECDC4 30%, #7EDCD6 90%)',
    'linear-gradient(45deg, #FFE66D 30%, #FFF0A3 90%)',
    'linear-gradient(45deg, #2C3E50 30%, #3498DB 90%)',
    'linear-gradient(45deg, #E74C3C 30%, #F39C12 90%)',
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
};

export const isSectionEnabled = (sectionId, sectionVisibility, data) => {
  if (sectionVisibility && sectionVisibility[sectionId] !== undefined) {
    return sectionVisibility[sectionId];
  }
  return data?.theme?.enabledSections?.[sectionId] !== false;
};

export const getSocialLink = (platform, socialLinks) => {
  if (!socialLinks) return '';
  
  // Handle array format
  if (Array.isArray(socialLinks)) {
    return socialLinks.find(link => link.platform === platform)?.url || '';
  }
  
  // Handle object format
  return socialLinks[platform] || '';
};

export const shouldRenderSection = (sectionId, isPreviewMode, isSectionEnabled, hasSectionData) => {
  if (isPreviewMode) {
    return isSectionEnabled;
  }
  return isSectionEnabled && hasSectionData;
}; 