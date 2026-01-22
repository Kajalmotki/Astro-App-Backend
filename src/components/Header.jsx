import React from 'react';
import { Link } from 'react-router-dom';
import OmPlayer from './OmPlayer';
import { useAuth } from './AuthModal';

const Header = ({ onLoginClick, onMembershipClick, onConsultationClick }) => {
    const { user, logout } = useAuth();

    const handleConsultationClick = () => {
        if (!user) {
            onLoginClick();
        } else {
            onConsultationClick();
        }
    };

    return (
        <header className="header glass">
            <Link to="/" className="logo gold-text">AstroRevo</Link>
            <nav className="nav">
                <OmPlayer />
                <Link to="/knowledge">Knowledge Source</Link>
                <Link to="/chat" className="nav-chat-link">AI Chat</Link>
                <button
                    className="cta-btn golden-highlight pulse-glow"
                    onClick={handleConsultationClick}
                >
                    📞 Call Our Astrologer
                </button>


                {user ? (
                    <>
                        <button
                            className="cta-btn golden-highlight pulse-glow"
                            onClick={onMembershipClick}
                            style={{ marginRight: '10px' }}
                        >
                            ✨ Premium
                        </button>
                        <button className="cta-btn secondary" onClick={logout}>Sign Out</button>

                    </>
                ) : (
                    <button className="cta-btn golden-highlight pulse-glow" onClick={onLoginClick}>Unlock Your Chart</button>
                )}
            </nav>
        </header>
    );
};

export default Header;
