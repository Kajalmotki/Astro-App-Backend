import React from 'react';
import { Link } from 'react-router-dom';
import OmPlayer from './OmPlayer';
import { useAuth } from './AuthModal';

const Header = ({ onLoginClick, onMembershipClick }) => {
    const { user, logout } = useAuth();

    return (
        <header className="header glass">
            <Link to="/" className="logo gold-text">AstroRevo</Link>
            <nav className="nav">
                <OmPlayer />
                <Link to="/knowledge">Knowledge Source</Link>
                <Link to="/sample">View Sample</Link>
                <a href="#questions">The Chart</a>
                <a href="#chat-window">Instant Chat</a>

                {user ? (
                    <>
                        <button
                            className="cta-btn golden-highlight"
                            onClick={onMembershipClick}
                            style={{ marginRight: '10px' }}
                        >
                            ✨ Premium
                        </button>
                        <button className="cta-btn secondary" onClick={logout}>Sign Out</button>
                    </>
                ) : (
                    <button className="cta-btn" onClick={onLoginClick}>Unlock Your Chart</button>
                )}
            </nav>
        </header>
    );
};

export default Header;
