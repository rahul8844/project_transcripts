// UI Constants for colors and sizes used across screens

export const COLORS = {
  // Primary colors
  PRIMARY_GREEN: '#2E7D32',
  PRIMARY_BLUE: '#1976D2',
  PRIMARY_PURPLE: '#7B1FA2',
  PRIMARY_ORANGE: '#FF9800',

  // App theme colors
  PRIMARY_APP: '#F8F3CE', // Warm cream background
  SECONDARY_APP: '#8B4513', // Rich brown for headers
  ACCENT_APP: '#D2691E', // Warm orange accent

  // Header and card colors
  HEADER_BG: '#8B4513', // Rich brown header
  CARD_BG: '#FFFFFF', // Clean white cards
  CARD_BORDER: '#E6D7C3', // Soft border

  // Text colors
  TEXT_PRIMARY: '#2C1810', // Dark brown for main text
  TEXT_SECONDARY: '#8B4513', // Medium brown for secondary text
  TEXT_MUTED: '#A0522D', // Muted brown for subtle text
  TEXT_WHITE: '#FFFFFF', // White text for dark backgrounds

  // Neutral colors
  WHITE: '#fff',
  LIGHT_GRAY: '#E6D7C3',
  VERY_LIGHT_GRAY: '#F5F0E8',
  EXTRA_LIGHT_GRAY: '#FAF7F2',
  DARK_GRAY: '#8B4513',

  BLACK: '#2C1810',

  // Semantic colors
  SUCCESS_GREEN: '#2E7D32',
  ERROR_RED: '#d32f2f',
  WARNING_ORANGE: '#FF9800',
  INFO_BLUE: '#1976D2',
  HOT_RED: '#8B0000',
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
