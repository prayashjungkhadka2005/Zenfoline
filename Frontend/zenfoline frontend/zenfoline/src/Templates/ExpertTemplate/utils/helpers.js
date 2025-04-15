// Format date helper
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Get skill level percentage helper
export const getSkillLevelPercentage = (level) => {
  switch (level?.toLowerCase()) {
    case 'expert': return 100;
    case 'advanced': return 85;
    case 'intermediate': return 70;
    case 'beginner': return 50;
    default: return 50;
  }
};

// Section visibility helper
export const isSectionEnabled = (sectionId, sectionVisibility, data) => {
  if (sectionVisibility && sectionVisibility[sectionId] !== undefined) {
    return sectionVisibility[sectionId];
  }
  return data?.theme?.enabledSections?.[sectionId] !== false;
};

// Social link helper
export const getSocialLink = (platform, socialLinks) => {
  if (!socialLinks) return '';
  
  // Handle array format
  if (Array.isArray(socialLinks)) {
    return socialLinks.find(link => link.platform === platform)?.url || '';
  }
  
  // Handle object format
  return socialLinks[platform] || '';
};

// Section rendering helper
export const shouldRenderSection = (sectionId, isPreviewMode, isSectionEnabled, hasSectionData) => {
  if (isPreviewMode) {
    return isSectionEnabled;
  }
  return isSectionEnabled && hasSectionData;
}; 