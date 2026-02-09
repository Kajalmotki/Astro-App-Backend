import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Activity, Shield, Settings, ChevronRight, Zap, Star, Gem } from 'lucide-react';
import { useAuth } from '../components/AuthModal';
import './MobileProfile.css';

const MobileProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Mock Vital Stats (In real app, fetch from context/API)
    const stats = [
        { label: 'Gemstone', value: 'Ruby', icon: <Gem size={18} />, color: '#FF4136' },
        { label: 'Lucky No.', value: '7', icon: <Star size={18} />, color: '#FFD700' },
        { label: 'Energy', value: 'High', icon: <Zap size={18} />, color: '#2ECC40' },
    ];

    const menuItems = [
        { icon: <Activity size={20} />, label: 'My Reports', sub: 'Birth Chart, D9, & More', action: () => navigate('/mobile/reports') },
        { icon: <Shield size={20} />, label: 'Membership', sub: 'Premium Plan Active', action: () => { } }, // Open membership modal logic
        { icon: <Settings size={20} />, label: 'Settings', sub: 'App Preferences', action: () => { } },
    ];

    return (
        <div className="mobile-profile-container">
            {/* Header Section */}
            <header className="profile-header">
                <div className="profile-avatar-container">
                    <div className="profile-avatar">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" />
                        ) : (
                            <User size={32} />
                        )}
                    </div>
                    <div className="avatar-pulse"></div>
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">{user?.displayName || 'Cosmic Seeker'}</h2>
                    <span className="profile-badge">Premium Member</span>
                </div>
            </header>

            {/* Vital Stats Carousel */}
            <div className="stats-carousel">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card" style={{ '--accent': stat.color }}>
                        <div className="stat-icon-wrapper">{stat.icon}</div>
                        <div className="stat-content">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Menu Grid */}
            <div className="profile-menu">
                <h3 className="section-title">Quick Actions</h3>
                <div className="menu-list">
                    {menuItems.map((item, idx) => (
                        <div key={idx} className="menu-item glass-card" onClick={item.action}>
                            <div className="menu-icon-box">{item.icon}</div>
                            <div className="menu-text">
                                <span className="menu-label">{item.label}</span>
                                <span className="menu-sub">{item.sub}</span>
                            </div>
                            <ChevronRight size={18} className="menu-arrow" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Zen Quote */}
            <div className="zen-quote">
                <p>"The universe is not outside of you. Look inside yourself; everything that you want, you already are."</p>
                <span>- Rumi</span>
            </div>
        </div>
    );
};

export default MobileProfile;
