import React, { useState } from 'react';
import { Menu, X, MessageCircle, BookOpen, Crown, LogOut, Music, Feather, PieChart, ShoppingBag, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthModal';
import { useMusic } from '../../contexts/MusicContext';
import { useTheme } from '../../contexts/ThemeContext';
import AstroStore from './AstroStore';
import './MobileHeader.css';

const MobileHeader = ({ onLoginClick, onMembershipClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showStore, setShowStore] = useState(false);
    const { user, logout } = useAuth();
    const { isPlaying, togglePlay } = useMusic();
    const { theme, toggleTheme, isDarkMode } = useTheme();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const handleOpenStore = () => {
        setIsMenuOpen(false);
        setShowStore(true);
    };

    return (
        <>
            <header className="mobile-main-header glass">
                <div className="mobile-logo" onClick={() => handleNavigation('/mobile/home')}>
                    <span className="mobile-logo-text">AstroRevo</span>
                </div>

                <div className="mobile-header-actions">
                    <button className="mobile-menu-trigger" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} color={isDarkMode ? "#ecf0f1" : "#2c2010"} /> : <Menu size={24} color={isDarkMode ? "#ecf0f1" : "#2c2010"} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <div className="menu-items">
                        <button className="theme-toggle-pill theme-toggle-menu" onClick={toggleTheme}>
                            {isDarkMode ? (
                                <><Sun size={16} fill="currentColor" /> <span className="theme-text">Switch to Day Mode</span></>
                            ) : (
                                <><Moon size={16} fill="currentColor" /> <span className="theme-text">Switch to Night Mode</span></>
                            )}
                        </button>
                        <div className="menu-item" onClick={() => handleNavigation('/mobile/chat')}>
                            <MessageCircle size={20} />
                            <span>AI Chat</span>
                        </div>
                        <div className="menu-item" onClick={() => handleNavigation('/knowledge')}>
                            <BookOpen size={20} />
                            <span>Knowledge Source</span>
                        </div>
                        <div className="menu-item" onClick={() => handleNavigation('/mobile/about')}>
                            <Feather size={20} />
                            <span>About AstroRevo</span>
                        </div>
                        <div className="menu-item" onClick={() => handleNavigation('/mobile/ambience')}>
                            <Music size={20} />
                            <span>Ambience & Music</span>
                        </div>
                        <div className="menu-item" onClick={() => handleNavigation('/mobile/blogs')}>
                            <Feather size={20} />
                            <span>Astrological Blogs</span>
                        </div>
                        <div className="menu-item" onClick={() => handleNavigation('/mobile/case-studies')}>
                            <PieChart size={20} />
                            <span>Case Studies</span>
                        </div>
                        <div className="menu-item menu-item-store" onClick={handleOpenStore}>
                            <ShoppingBag size={20} />
                            <span>The AstroRevo Store</span>
                        </div>
                        <div className="menu-item highlight" onClick={() => { onLoginClick(); setIsMenuOpen(false); }}>
                            <Crown size={20} />
                            <span>Unlock Your Chart</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AstroStore Modal */}
            <AstroStore isOpen={showStore} onClose={() => setShowStore(false)} />
        </>
    );
};

export default MobileHeader;
