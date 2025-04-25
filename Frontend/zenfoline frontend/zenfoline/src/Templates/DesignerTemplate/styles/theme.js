import { createTheme as createMuiTheme } from '@mui/material/styles';
import { getContrastTextColor } from '../utils/helpers';

// Default theme colors as fallback
export const defaultThemeColors = {
  primary: '#2196f3',      // Material Blue
  secondary: '#f50057',    // Material Pink
  accent: '#ff4081',       // Material Pink Accent
  background: '#ffffff',   // White
  paper: '#ffffff',        // White
  text: '#000000',         // Black
  textSecondary: '#666666', // Dark Gray
  grey: {
    200: '#f5f5f5',
    300: '#e0e0e0'
  }
};

// Theme presets mapping
export const themePresets = {
  'modern': {
    primary: '#2196f3',
    secondary: '#f50057',
    accent: '#ff4081',
    background: '#ffffff',
    paper: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    grey: {
      200: '#f5f5f5',
      300: '#e0e0e0'
    }
  },
  'creative': {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    background: '#F7F7F7',
    paper: '#FFFFFF',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    grey: {
      200: '#f5f5f5',
      300: '#e0e0e0'
    }
  },
  'professional': {
    primary: '#2C3E50',
    secondary: '#3498DB',
    accent: '#E74C3C',
    background: '#ECF0F1',
    paper: '#FFFFFF',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    grey: {
      200: '#f5f5f5',
      300: '#e0e0e0'
    }
  }
};

// Function to get theme colors based on template data
export const getThemeColors = (portfolioData) => {
  if (!portfolioData?.theme) {
    return defaultThemeColors;
  }

  // If a preset is specified, use that
  if (portfolioData.theme.preset && themePresets[portfolioData.theme.preset]) {
    return themePresets[portfolioData.theme.preset];
  }

  // Extract colors from portfolio data, fallback to defaults if not provided
  return {
    primary: portfolioData.theme.primary || defaultThemeColors.primary,
    secondary: portfolioData.theme.secondary || defaultThemeColors.secondary,
    accent: portfolioData.theme.accent || defaultThemeColors.accent,
    background: portfolioData.theme.background || defaultThemeColors.background,
    paper: portfolioData.theme.paper || defaultThemeColors.paper,
    text: portfolioData.theme.text || defaultThemeColors.text,
    textSecondary: portfolioData.theme.textSecondary || defaultThemeColors.textSecondary,
    grey: {
      200: portfolioData.theme.grey?.[200] || defaultThemeColors.grey[200],
      300: portfolioData.theme.grey?.[300] || defaultThemeColors.grey[300]
    }
  };
};

// Create a Material-UI theme based on the colors
export const createTheme = (colors) => {
  const themeColors = colors || defaultThemeColors;
  
  return createMuiTheme({
    palette: {
      primary: {
        main: themeColors.primary,
        light: themeColors.primary,
        dark: themeColors.primary,
        contrastText: getContrastTextColor(themeColors.primary)
      },
      secondary: {
        main: themeColors.secondary,
        light: themeColors.secondary,
        dark: themeColors.secondary,
        contrastText: getContrastTextColor(themeColors.secondary)
      },
      background: {
        default: themeColors.background,
        paper: themeColors.paper || themeColors.background
      },
      text: {
        primary: themeColors.text,
        secondary: themeColors.textSecondary || themeColors.text
      },
      grey: themeColors.grey || defaultThemeColors.grey
    },
    spacing: (factor) => factor * 8,
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '3rem',
        lineHeight: 1.2
      },
      h2: {
        fontWeight: 600,
        fontSize: '2.5rem',
        lineHeight: 1.3
      },
      h3: {
        fontWeight: 600,
        fontSize: '2rem',
        lineHeight: 1.4
      },
      h4: {
        fontWeight: 500,
        fontSize: '1.5rem',
        lineHeight: 1.4
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: 1.4
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.4
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5
      }
    },
    shape: {
      borderRadius: 8
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '8px 24px'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  });
};

// Export a default designer theme for use in previews
export const designerTheme = createTheme(defaultThemeColors); 