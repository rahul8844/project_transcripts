// UI Constants for colors and sizes used across screens

export const COLORS = {
  // Primary colors
  PRIMARY_GREEN: '#2E7D32',
  PRIMARY_BLUE: '#1976D2',
  PRIMARY_PURPLE: '#7B1FA2',
  PRIMARY_ORANGE: '#FF9800',
  
  // Neutral colors
  WHITE: '#fff',
  LIGHT_GRAY: '#ccc',
  VERY_LIGHT_GRAY: '#e0e0e0',
  EXTRA_LIGHT_GRAY: '#f4f3f4',
  DARK_GRAY: '#666',
  
  // Semantic colors
  SUCCESS_GREEN: '#2E7D32',
  ERROR_RED: '#d32f2f',
  WARNING_ORANGE: '#FF9800',
  INFO_BLUE: '#1976D2',
} as const;

export const SIZES = {
  // Icon sizes
  ICON_SMALL: 20,
  ICON_MEDIUM: 24,
  ICON_LARGE: 32,
  ICON_XLARGE: 48,
  ICON_XXLARGE: 64,
} as const;

// Type exports for better type safety
export type ColorKey = keyof typeof COLORS;
export type SizeKey = keyof typeof SIZES;
