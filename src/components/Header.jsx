import React from 'react';
import { Link } from 'react-router-dom';
import OmPlayer from './OmPlayer';
import { useAuth } from './AuthModal';
import logo from '../assets/logo.png';

const Header = ({ onLoginClick, onMembershipClick }) => {
    const { user, logout } = useAuth();

    return (
        <header className="header glass">
            <Link to="/" className="logo-container">
                <span className="logo-text">AstroRevo</span>
            </Link>

            <div className="header-center">
                <OmPlayer />
            </div>

            <nav className="nav">
                <Link to="/knowledge">Knowledge Source</Link>
                <Link to="/chat" className="nav-chat-link">AI Chat</Link>


                {user ? (
                    <>
                        <button
                            className="cta-btn white-highlight pulse-glow"
                            onClick={onMembershipClick}
                            style={{ marginRight: '2px' }}
                        >
                            ✨ Premium
                        </button>
                        <button className="cta-btn secondary" onClick={logout}>Sign Out</button>

                    </>
                ) : (
                    <button className="cta-btn white-highlight pulse-glow" onClick={onLoginClick}>Unlock Your Chart</button>
                )}
            </nav>
        </header>
    );
};

export default Header;
