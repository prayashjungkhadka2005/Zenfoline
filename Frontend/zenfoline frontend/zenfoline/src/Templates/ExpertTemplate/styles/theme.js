// Default theme colors as fallback
export const defaultThemeColors = {
  primary: '#1E293B',      // Slate Dark
  secondary: '#38BDF8',    // Sky Blue
  background: '#0F172A',   // Slate Black
  text: '#F1F5F9',        // Soft Light
  highlight: '#0EA5E9',    // Bright Blue
};

// Theme presets mapping
const themePresets = {
  '1': {
    primary: '#1E293B',
    secondary: '#38BDF8',
    background: '#0F172A',
    text: '#F1F5F9',
    highlight: '#0EA5E9'
  },
  '2': {
    primary: '#1F2937',
    secondary: '#60A5FA',
    background: '#111827',
    text: '#F9FAFB',
    highlight: '#3B82F6'
  },
  // Add more presets as needed
};

// Function to get theme colors based on template data
export const getThemeColors = (templateData) => {
  if (!templateData) {
    return defaultThemeColors;
  }

  // If theme data has presetTheme, use that
  if (templateData.presetTheme && themePresets[templateData.presetTheme]) {
    return themePresets[templateData.presetTheme];
  }

  // If theme data has direct color values, use those
  if (templateData.colors) {
    return {
      ...defaultThemeColors,
      ...templateData.colors
    };
  }

  // If theme data has colorMode, apply dark/light mode
  if (templateData.colorMode) {
    return templateData.colorMode === 'dark' 
      ? defaultThemeColors  // Dark theme
      : {
          primary: '#F1F5F9',
          secondary: '#0EA5E9',
          background: '#FFFFFF',
          text: '#1E293B',
          highlight: '#38BDF8'
        };
  }

  // Fallback to default theme
  return defaultThemeColors;
};

// Example of generating utility strings (optional, but can be helpful)
export const getThemeStyles = (themeColors) => ({
  textColor: `text-[${themeColors.text}]`,
  bgColor: `bg-[${themeColors.background}]`,
  highlightColor: `text-[${themeColors.highlight}]`,
  // Add more as needed
}); 