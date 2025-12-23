import { Button } from '@stealinglight/ui';

/**
 * Hub Home Page - Landing page with mode selection cards
 * Allows users to choose between Creative and Security modes
 */
export function Home() {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">stealinglight</h1>
                    <p className="hero-subtitle">
                        Creative storytelling meets technical security
                    </p>
                </div>
            </section>

            <section className="mode-selection">
                <div className="container">
                    <h2 className="section-title">Choose Your Path</h2>
                    <div className="mode-cards">
                        <a href="https://creative.stealinglight.hk" className="mode-card mode-card--creative">
                            <div className="mode-card-content">
                                <div className="mode-card-icon">🎬</div>
                                <h3 className="mode-card-title">Creative</h3>
                                <p className="mode-card-description">
                                    Video production, visual storytelling, and creative projects
                                    that bring ideas to life through motion and sound.
                                </p>
                                <Button variant="creative" size="lg">
                                    Explore Creative →
                                </Button>
                            </div>
                        </a>

                        <a href="https://security.stealinglight.hk" className="mode-card mode-card--security">
                            <div className="mode-card-content">
                                <div className="mode-card-icon">🔐</div>
                                <h3 className="mode-card-title">Security</h3>
                                <p className="mode-card-description">
                                    Cybersecurity research, technical writing, and security
                                    projects protecting digital infrastructure.
                                </p>
                                <Button variant="security" size="lg">
                                    Explore Security →
                                </Button>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
