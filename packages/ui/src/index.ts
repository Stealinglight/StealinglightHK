/**
 * @stealinglight/ui - Shared UI components for stealinglight.hk
 *
 * Components:
 * - Nav: Navigation component with logo and links
 * - Footer: Site footer with copyright and links
 * - ModeSwitch: Toggle between creative/security modes
 * - Button: Reusable button with multiple variants
 *
 * Usage:
 * import { Nav, Footer, Button } from '@stealinglight/ui';
 * import '@stealinglight/ui/styles';
 */

// Components
export { Nav } from './components/Nav';
export { Footer } from './components/Footer';
export { ModeSwitch } from './components/ModeSwitch';
export { Button } from './components/Button';

// Types
export type {
    NavLink,
    ModeConfig,
    ContactFormData,
    ContactFormResponse,
    CurrentMode,
    NavProps,
    FooterProps,
    ButtonVariant,
    ButtonSize,
    ButtonProps,
    ModeSwitchProps,
} from './types';

// Theme
export * from './theme/tokens';
