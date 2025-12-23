import { ModeSwitchProps } from '../types';

/**
 * Mode switch component for toggling between creative and security modes
 * Displays as a link to the other mode's site
 */
export function ModeSwitch({ currentMode, className = '' }: ModeSwitchProps) {
    if (currentMode === 'hub') {
        return null;
    }

    const otherMode = currentMode === 'creative' ? 'security' : 'creative';
    const otherUrl =
        otherMode === 'creative'
            ? 'https://creative.stealinglight.hk'
            : 'https://security.stealinglight.hk';

    const label = otherMode === 'creative' ? 'Creative' : 'Security';

    return (
        <a
            href={otherUrl}
            className={`mode-switch mode-switch--${otherMode} ${className}`.trim()}
            title={`Switch to ${label} mode`}
        >
            <span className="mode-switch-label">→ {label}</span>
        </a>
    );
}
