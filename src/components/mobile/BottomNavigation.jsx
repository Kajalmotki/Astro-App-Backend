import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, FileText, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import './BottomNavigation.css';

const BottomNavigation = () => {
    const { t } = useLanguage();

    return (
        <>
            <nav className="mobile-bottom-nav">
                <NavLink to="/mobile/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon-container">
                        <Home size={24} />
                    </div>
                    <span className="nav-label">{t('Home')}</span>
                </NavLink>

                <NavLink to="/mobile/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon-container">
                        <MessageCircle size={24} />
                    </div>
                    <span className="nav-label">{t('Veda AI')}</span>
                </NavLink>

                <NavLink to="/mobile/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon-container">
                        <FileText size={24} />
                    </div>
                    <span className="nav-label">{t('Reports')}</span>
                </NavLink>

                <NavLink to="/mobile/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon-container">
                        <User size={24} />
                    </div>
                    <span className="nav-label">{t('Profile')}</span>
                </NavLink>
            </nav>
        </>
    );
};

export default BottomNavigation;
