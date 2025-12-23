import type { ButtonHTMLAttributes } from 'react';

/**
 * Shared TypeScript types for stealinglight.hk portfolio
 * Used across all three SPAs (hub, creative, security)
 */

/**
 * Navigation link configuration
 */
export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Mode configuration for creative/security switching
 */
export interface ModeConfig {
  name: 'creative' | 'security';
  displayName: string;
  url: string;
  description: string;
}

/**
 * Contact form submission data
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string; // spam prevention - should be empty
}

/**
 * Contact form API response
 */
export interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Current mode context for components
 */
export type CurrentMode = 'hub' | 'creative' | 'security';

/**
 * Navigation props shared across sites
 */
export interface NavProps {
  currentMode: CurrentMode;
  links?: NavLink[];
  showModeSwitch?: boolean;
}

/**
 * Footer props
 */
export interface FooterProps {
  currentMode: CurrentMode;
}

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'creative' | 'security';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  as?: 'button' | 'a';
  href?: string;
  external?: boolean;
}

/**
 * Mode switch component props
 */
export interface ModeSwitchProps {
  currentMode: CurrentMode;
  className?: string;
}
