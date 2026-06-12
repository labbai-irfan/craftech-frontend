// Design System Tokens for Craftech — Premium Luxury Brand

export const colors = {
  // Primary Brand Colors
  primary: {
    navy: '#0A2647',        // Deep navy — authority, trust
    accent: '#C41B1F',      // Crimson red — premium, power
    gold: '#D4AF37',        // Gold accents — luxury
  },

  // Neutral Palette (grays)
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',          // "mid" in current scheme
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Backgrounds
  background: {
    light: '#F5F7FA',        // Light background
    surface: '#FFFFFF',       // Card surfaces
    dark: '#0F172A',         // Dark mode surface
  },

  // Text Colors
  text: {
    primary: '#0A2647',      // navy
    secondary: '#6B7280',    // mid-gray
    tertiary: '#9CA3AF',     // light gray
    inverse: '#FFFFFF',      // For dark backgrounds
  },
};

export const typography = {
  // Font families
  families: {
    display: '"Playfair Display", serif',  // Headlines (luxury serif)
    body: '"Inter", sans-serif',           // Body (clean, modern)
    mono: '"Fira Code", monospace',        // Code
  },

  // Font sizes (with clamp for responsive)
  sizes: {
    xs: 'clamp(0.75rem, 1vw, 0.875rem)',
    sm: 'clamp(0.875rem, 1.2vw, 1rem)',
    base: 'clamp(1rem, 1.5vw, 1.125rem)',
    lg: 'clamp(1.25rem, 2vw, 1.5rem)',
    xl: 'clamp(1.5rem, 2.5vw, 1.875rem)',
    '2xl': 'clamp(1.875rem, 3vw, 2.25rem)',
    '3xl': 'clamp(2.25rem, 4vw, 2.5rem)',
    '4xl': 'clamp(2.5rem, 5vw, 3.5rem)',
    '5xl': 'clamp(3rem, 8vw, 4.5rem)',
  },

  // Font weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  // Line heights
  lineHeights: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.01em',
    normal: '0em',
    wide: '0.05em',
    wider: '0.1em',
    widest: '0.2em',
  },
};

export const spacing = {
  // Consistent spacing scale
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
};

export const shadows = {
  // Subtle shadows for depth
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // Premium shadows (deeper for elevation)
  premium: '0 20px 40px rgba(0, 0, 0, 0.15)',
  premiumHover: '0 30px 60px rgba(0, 0, 0, 0.2)',

  // Navy shadow (brand-specific)
  navyGlow: '0 0 30px rgba(10, 38, 71, 0.2)',
};

export const borders = {
  radius: {
    none: '0',
    sm: '0.375rem',
    base: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },

  width: {
    hairline: '0.5px',
    thin: '1px',
    base: '1.5px',
    thick: '2px',
  },
};

export const transitions = {
  // Smooth, premium transitions
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  slowest: '800ms cubic-bezier(0.4, 0, 0.2, 1)',

  // Easing functions
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
};

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const aspectRatios = {
  square: '1 / 1',
  video: '16 / 9',
  '4/3': '4 / 3',
  '3/2': '3 / 2',
  golden: '1.618 / 1',
};

export default {
  colors,
  typography,
  spacing,
  shadows,
  borders,
  transitions,
  zIndex,
  breakpoints,
  aspectRatios,
};
