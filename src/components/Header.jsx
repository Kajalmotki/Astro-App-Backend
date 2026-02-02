import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthModal';
import SlidingChartButton from './SlidingChartButton';

const Header = ({ onLoginClick, onMembershipClick }) => {
    const { user, logout } = useAuth();
    const [isHidden, setIsHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSlideButton, setShowSlideButton] = useState(false);

    useEffect(() => {
        // Show sliding button after 1 second delay
        const timer = setTimeout(() => {
            setShowSlideButton(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const heroSection = document.querySelector('.hero-section');
            if (!heroSection) {
                setIsHidden(false);
                return;
            }

            const heroBounds = heroSection.getBoundingClientRect();
            setIsHidden(heroBounds.bottom <= 0);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header className={`header glass ${isHidden ? 'hidden' : ''}`}>
                <nav className="nav nav-left">
                    <Link to="/knowledge" className="nav-chat-link desktop-only">Knowledge Source</Link>
                    <Link to="/chat" className="nav-chat-link desktop-only">AI Chat</Link>
                </nav>

                <Link to="/" className="logo-container logo-center">
                    <span className="logo-text">AstroRevo</span>
                </Link>

                <nav className="nav nav-right">
                    {user ? (
                        <>
                            <button
                                className="cta-btn white-highlight pulse-glow desktop-only"
                                onClick={onMembershipClick}
                                style={{ marginRight: '2px' }}
                            >
                                Premium
                            </button>
                            <button className="cta-btn secondary desktop-only" onClick={logout}>Sign Out</button>
                        </>
                    ) : (
                        <button className="cta-btn white-highlight pulse-glow desktop-only" onClick={onLoginClick}>Unlock Your Chart</button>
                    )}

                    <div className="mobile-actions">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            aria-label="Open menu"
                        >
                            ⋮
                        </button>
                        {isMobileMenuOpen && (
                            <div className="mobile-menu">
                                <Link to="/chat" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>
                                    AI Chat
                                </Link>
                                <Link to="/knowledge" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>
                                    Knowledge Base
                                </Link>
                                {user ? (
                                    <>
                                        <button className="mobile-menu-item" onClick={() => { setIsMobileMenuOpen(false); onMembershipClick(); }}>
                                            Premium
                                        </button>
                                        <button className="mobile-menu-item" onClick={() => { setIsMobileMenuOpen(false); logout(); }}>
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <button className="mobile-menu-item" onClick={() => { setIsMobileMenuOpen(false); onLoginClick(); }}>
                                        Unlock Your Chart
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {/* Sliding Chart Button */}
            <SlidingChartButton isVisible={showSlideButton} />
        </>
    );
};

export default Header;
