import React from 'react';
import { Link } from 'react-router-dom';
import OmPlayer from './OmPlayer';

const Header = () => {
    return (
        <header className="header glass">
            <Link to="/" className="logo gold-text">AstroRevo</Link>
            <nav className="nav">
                <OmPlayer />
                <Link to="/knowledge">Knowledge Source</Link>
                <Link to="/sample">View Sample</Link>
                <a href="#questions">The Chart</a>
                <a href="#chat-window">Instant Chat</a>
                <button className="cta-btn">Unlock Your Chart</button>
            </nav>
        </header>
    );
};

export default Header;
