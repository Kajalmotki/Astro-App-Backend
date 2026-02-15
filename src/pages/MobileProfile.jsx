import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Settings, ChevronRight, Star,
    LogOut, CreditCard, FileText,
    History, MessageSquare, HelpCircle, Globe, ShieldCheck, Music
} from 'lucide-react';
import { useAuth } from '../components/AuthModal';
import './MobileProfile.css?v=2'; // Force reload

const MobileProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Grouped Menu Structure
    const menuGroups = [
        {
            title: "My Activity",
            items: [
                { icon: <FileText size={20} />, label: 'My Reports', sub: 'Chart Analysis & Predictions', action: () => navigate('/mobile/reports') },
                { icon: <History size={20} />, label: 'Order History', sub: 'Past Consultations & Purchases', action: () => navigate('/mobile/order-history') },
                { icon: <MessageSquare size={20} />, label: 'Chat History', sub: 'Conversations with Astrologers', action: () => navigate('/mobile/chat-history') },
            ]
        },
        {
            title: "App Settings",
            items: [
                { icon: <Music size={20} />, label: 'Ambience & Music', sub: 'Om, Rain, Cosmic Sounds', action: () => navigate('/mobile/ambience') },
                { icon: <Globe size={20} />, label: 'Language', sub: 'English (Default)', action: () => navigate('/mobile/settings/language') },
                { icon: <ShieldCheck size={20} />, label: 'Privacy & Security', sub: 'Manage your data', action: () => navigate('/mobile/settings/privacy') },
                { icon: <HelpCircle size={20} />, label: 'Help & Support', sub: 'FAQs & Contact Us', action: () => navigate('/mobile/help-support') },
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
                        <Star size={12} fill="black" /> Premium Member
                    </span>
                    <p className="profile-membership-expiry">Valid until: Dec 31, 2026</p>
                </div>
            </header>

            <div className="profile-content-scroll">
                {/* Wallet / Credits Card - High Priority for Business */}
                <section className="wallet-card">
                    <div className="wallet-info">
                        <span className="wallet-label">Wallet Balance</span>
                        <h3 className="wallet-amount">₹ 0.00</h3>
                        <p className="wallet-sub">Use for calls & chats</p>
                    </div>
                    <button className="add-money-btn">
                        <CreditCard size={16} /> Add Money
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
                                <span className="menu-label logout-text">Log Out</span>
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
