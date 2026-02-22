import React, { useState } from 'react';
import { Menu, X, MessageCircle, BookOpen, Crown, LogOut, Music, Feather, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthModal';
import { useMusic } from '../../contexts/MusicContext';
import './MobileHeader.css';

const MobileHeader = ({ onLoginClick, onMembershipClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { isPlaying, togglePlay } = useMusic();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="mobile-main-header glass">
                <div className="mobile-logo" onClick={() => handleNavigation('/mobile/home')}>
                    <span className="mobile-logo-text">AstroRevo</span>
                </div>



                <button className="mobile-menu-trigger" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} color="#ecf0f1" /> : <Menu size={24} color="#ecf0f1" />}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <div className="menu-items">
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

                        {user ? (
                            <>
                                <div className="menu-item highlight" onClick={() => {
                                    navigate('/mobile/reports', { state: { openPremium: true } });
                                    setIsMenuOpen(false);
                                }}>
                                    <Crown size={20} />
                                    <span>Premium Dashboard</span>
                                </div>
                                <div className="menu-item" onClick={() => { logout(); setIsMenuOpen(false); }}>
                                    <LogOut size={20} />
                                    <span>Sign Out</span>
                                </div>
                            </>
                        ) : (
                            <div className="menu-item highlight" onClick={() => { onLoginClick(); setIsMenuOpen(false); }}>
                                <Crown size={20} />
                                <span>Unlock Your Chart</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileHeader;
