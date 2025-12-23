import { NavProps, NavLink } from '../types';
import { ModeSwitch } from './ModeSwitch';

/**
 * Navigation component shared across all sites
 * Displays logo, navigation links, and mode switch
 */
export function Nav({ currentMode, links = [], showModeSwitch = true }: NavProps) {
    const logoText = currentMode === 'hub' ? 'stealinglight' : `stealinglight.${currentMode}`;

    const logoHref =
        currentMode === 'hub'
            ? '/'
            : currentMode === 'creative'
                ? 'https://creative.stealinglight.hk'
                : 'https://security.stealinglight.hk';

    return (
        <nav className="nav">
            <div className="nav-container">
                <a href={logoHref} className="nav-logo">
                    {logoText}
                </a>

                {links.length > 0 && (
                    <ul className="nav-links">
                        {links.map((link: NavLink) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="nav-link"
                                    target={link.external ? '_blank' : undefined}
                                    rel={link.external ? 'noopener noreferrer' : undefined}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}

                {showModeSwitch && currentMode !== 'hub' && <ModeSwitch currentMode={currentMode} />}
            </div>
        </nav>
    );
}
