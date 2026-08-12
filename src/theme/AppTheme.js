import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Custom color palette
const colors = {
  // Primary colors
  primary: '#6366f1', // Indigo
  primaryContainer: '#e0e7ff',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#1e1b4b',
  
  // Secondary colors
  secondary: '#f59e0b', // Amber
  secondaryContainer: '#fef3c7',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#451a03',
  
  // Tertiary colors
  tertiary: '#10b981', // Emerald
  tertiaryContainer: '#d1fae5',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#064e3b',
  
  // Error colors
  error: '#ef4444', // Red
  errorContainer: '#fee2e2',
  onError: '#ffffff',
  onErrorContainer: '#7f1d1d',
  
  // Neutral colors
  background: '#fafafa',
  surface: '#ffffff',
  surfaceVariant: '#f3f4f6',
  onBackground: '#1f2937',
  onSurface: '#1f2937',
  onSurfaceVariant: '#6b7280',
  
  // Outline and borders
  outline: '#d1d5db',
  outlineVariant: '#e5e7eb',
  
  // Shadow colors
  shadow: '#000000',
  scrim: '#000000',
  
  // Success colors
  success: '#10b981',
  successContainer: '#d1fae5',
  onSuccess: '#ffffff',
  onSuccessContainer: '#064e3b',
  
  // Warning colors
  warning: '#f59e0b',
  warningContainer: '#fef3c7',
  onWarning: '#ffffff',
  onWarningContainer: '#451a03',
  
  // Info colors
  info: '#3b82f6',
  infoContainer: '#dbeafe',
  onInfo: '#ffffff',
  onInfoContainer: '#1e3a8a',
};

// Dark theme colors
const darkColors = {
  ...colors,
  background: '#111827',
  surface: '#1f2937',
  surfaceVariant: '#374151',
  onBackground: '#f9fafb',
  onSurface: '#f9fafb',
  onSurfaceVariant: '#9ca3af',
  outline: '#4b5563',
  outlineVariant: '#6b7280',
};

// Typography configuration
const typography = {
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400',
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400',
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400',
  },
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400',
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400',
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400',
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400',
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
};

// Spacing configuration
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius configuration
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Elevation configuration
const elevation = {
  none: 0,
  sm: 1,
  md: 2,
  lg: 4,
  xl: 8,
  xxl: 16,
};

// Animation configuration
const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Create light theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  typography,
  spacing,
  borderRadius,
  elevation,
  animation,
  isDark: false,
};

// Create dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
  typography,
  spacing,
  borderRadius,
  elevation,
  animation,
  isDark: true,
};

// Default theme (light)
export const defaultTheme = lightTheme;

// Theme utilities
export const getThemeColor = (theme, colorKey) => {
  return theme.colors[colorKey] || colors[colorKey];
};

export const getSpacing = (theme, size) => {
  return theme.spacing[size] || spacing[size];
};

export const getBorderRadius = (theme, size) => {
  return theme.borderRadius[size] || borderRadius[size];
};

export const getElevation = (theme, level) => {
  return theme.elevation[level] || elevation[level];
};

// Responsive utilities
export const isTablet = () => {
  const { width, height } = require('react-native').Dimensions.get('window');
  return Math.max(width, height) >= 768;
};

export const isSmallDevice = () => {
  const { width, height } = require('react-native').Dimensions.get('window');
  return Math.max(width, height) < 375;
};

// Responsive spacing
export const getResponsiveSpacing = (theme, size) => {
  const baseSpacing = getSpacing(theme, size);
  if (isTablet()) {
    return baseSpacing * 1.5;
  }
  if (isSmallDevice()) {
    return baseSpacing * 0.8;
  }
  return baseSpacing;
};

// Responsive typography
export const getResponsiveFontSize = (baseSize) => {
  if (isTablet()) {
    return baseSize * 1.2;
  }
  if (isSmallDevice()) {
    return baseSize * 0.9;
  }
  return baseSize;
}; 