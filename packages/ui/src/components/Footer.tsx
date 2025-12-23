import { FooterProps } from '../types';

/**
 * Footer component shared across all sites
 * Displays copyright and links
 */
export function Footer({ currentMode }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`footer footer--${currentMode}`}>
            <div className="footer-container">
                <div className="footer-content">
                    <p className="footer-copyright">
                        © {currentYear} stealinglight. All rights reserved.
                    </p>

                    <nav className="footer-links">
                        {currentMode !== 'hub' && (
                            <>
                                <a href="https://stealinglight.hk" className="footer-link">
                                    Hub
                                </a>
                                <span className="footer-divider">·</span>
                            </>
                        )}
                        {currentMode !== 'creative' && (
                            <>
                                <a href="https://creative.stealinglight.hk" className="footer-link">
                                    Creative
                                </a>
                                <span className="footer-divider">·</span>
                            </>
                        )}
                        {currentMode !== 'security' && (
                            <a href="https://security.stealinglight.hk" className="footer-link">
                                Security
                            </a>
                        )}
                    </nav>
                </div>
            </div>
        </footer>
    );
}
