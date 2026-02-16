import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Settings, ChevronRight, Star,
    LogOut, CreditCard, FileText,
    History, MessageSquare, HelpCircle, Globe, ShieldCheck, Music
} from 'lucide-react';
import { useAuth } from '../components/AuthModal';
import './MobileProfile.css?v=2'; // Force reload

import { useLanguage } from '../contexts/LanguageContext';

const MobileProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { language, getLanguageName, t } = useLanguage();

    // Grouped Menu Structure
    const menuGroups = [
        {
            title: t("My Activity"),
            items: [
                { icon: <FileText size={20} />, label: t('My Reports'), sub: t('Chart Analysis & Predictions'), action: () => navigate('/mobile/reports') },
                { icon: <History size={20} />, label: t('Order History'), sub: t('Past Consultations & Purchases'), action: () => navigate('/mobile/order-history') },
                { icon: <MessageSquare size={20} />, label: t('Chat History'), sub: t('Conversations with Astrologers'), action: () => navigate('/mobile/chat-history') },
            ]
        },
        {
            title: t("App Settings"),
            items: [
                { icon: <Music size={20} />, label: t('Ambience & Music'), sub: t('Om, Rain, Cosmic Sounds'), action: () => navigate('/mobile/ambience') },
                { icon: <Globe size={20} />, label: t('Language'), sub: getLanguageName(language), action: () => navigate('/mobile/settings/language') },
                { icon: <ShieldCheck size={20} />, label: t('Privacy & Security'), sub: t('Manage your data'), action: () => navigate('/mobile/settings/privacy') },
                { icon: <HelpCircle size={20} />, label: t('Help & Support'), sub: t('FAQs & Contact Us'), action: () => navigate('/mobile/help-support') },
            ]
        }
    ];

    return (
        <div className="mobile-profile-container">
            {/* Premium Header */}
            <header className="profile-header">
                <div className="profile-avatar-container">
                    <div className="profile-avatar">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" />
                        ) : (
                            <User size={32} />
                        )}
                    </div>
                    <div className="avatar-ring"></div>
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">{user?.displayName || 'Cosmic Seeker'}</h2>
                    <span className="profile-badge">
                        <Star size={12} fill="black" /> {t('Premium Member')}
                    </span>
                    <p className="profile-membership-expiry">{t('Valid until')}: Dec 31, 2026</p>
                </div>
            </header>

            <div className="profile-content-scroll">
                {/* Wallet / Credits Card - High Priority for Business */}
                <section className="wallet-card">
                    <div className="wallet-info">
                        <span className="wallet-label">{t('Wallet Balance')}</span>
                        <h3 className="wallet-amount">₹ 0.00</h3>
                        <p className="wallet-sub">{t('Use for calls & chats')}</p>
                    </div>
                    <button className="add-money-btn">
                        <CreditCard size={16} /> {t('Add Money')}
                    </button>
                </section>

                {/* Menu Groups */}
                {menuGroups.map((group, groupIdx) => (
                    <section key={groupIdx} className="menu-group">
                        <h3 className="group-title">{group.title}</h3>
                        <div className="menu-list">
                            {group.items.map((item, idx) => (
                                <div key={idx} className="menu-item" onClick={item.action}>
                                    <div className="menu-icon-box">{item.icon}</div>
                                    <div className="menu-text">
                                        <span className="menu-label">{item.label}</span>
                                        <span className="menu-sub">{item.sub}</span>
                                    </div>
                                    <ChevronRight size={18} className="menu-arrow" />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Settings & Logout */}
                <section className="menu-group">
                    <div className="menu-list">
                        <div className="menu-item" onClick={() => { }}>
                            <div className="menu-icon-box logout-icon"><LogOut size={20} /></div>
                            <div className="menu-text">
                                <span className="menu-label logout-text">{t('Log Out')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Version Info */}
                <footer className="profile-footer">
                    <p>AstroRevo v1.0.0</p>
                    <p className="footer-links">Terms • Privacy Policy</p>
                </footer>
            </div>

            {/* Bottom spacer for nav bar */}
            <div style={{ height: '100px' }}></div>
        </div>
    );
};

export default MobileProfile;
