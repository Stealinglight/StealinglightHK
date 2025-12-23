/**
 * Design tokens for the stealinglight.hk portfolio
 * Shared across all three SPAs (hub, creative, security)
 */

export const colors = {
  // Primary colors
  primary: '#0a0a0a',
  primaryLight: '#1a1a1a',
  primaryDark: '#000000',

  // Accent colors
  accent: '#ffffff',
  accentMuted: '#a0a0a0',
  accentSubtle: '#666666',

  // Mode-specific accents
  creative: {
    primary: '#ff6b35',
    secondary: '#f7c59f',
    muted: '#2d1810',
  },
  security: {
    primary: '#00d4aa',
    secondary: '#7fefce',
    muted: '#0d2921',
  },

  // Semantic colors
  background: '#0a0a0a',
  backgroundAlt: '#111111',
  surface: '#1a1a1a',
  surfaceHover: '#252525',

  text: '#ffffff',
  textMuted: '#a0a0a0',
  textSubtle: '#666666',

  border: '#333333',
  borderLight: '#444444',

  // Status colors
  success: '#00d4aa',
  error: '#ff4757',
  warning: '#ffa502',
  info: '#3742fa',
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
} as const;

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  full: '9999px',
} as const;

// Type exports for TypeScript consumers
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Breakpoints = typeof breakpoints;
export type Transitions = typeof transitions;
export type Shadows = typeof shadows;
export type BorderRadius = typeof borderRadius;
