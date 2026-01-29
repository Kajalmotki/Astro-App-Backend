import React, { useState } from 'react';
import './PremiumDashboard.css';

const PremiumDashboard = ({ isOpen, onClose, user }) => {
    const [activeTab, setActiveTab] = useState('home');

    if (!isOpen) return null;

    const sidebarItems = [
        { id: 'home', label: 'Dashboard Home', icon: '🏠' },
        { id: 'predictions', label: 'Period Analysis', icon: '📈', premium: true },
        { id: 'calculations', label: 'Shodashvarga', icon: '🔢', premium: true },
        { id: 'transits', label: 'Current Transits', icon: '🌍' },
        { id: 'compatibility', label: 'Chart Compatibility', icon: '🤝', premium: true },
        { id: 'settings', label: 'Account Settings', icon: '⚙️' },
    ];

    return (
        <div className="dashboard-overlay">
            <div className="dashboard-window glass-card">
                <button className="dashboard-close" onClick={onClose}>&times;</button>

                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <div className="sidebar-header">
                        <div className="premium-logo-small">ॐ</div>
                        <span className="gold-text">AstroRevo Premium</span>
                    </div>
                    <nav className="sidebar-nav">
                        {sidebarItems.map(item => (
                            <button
                                key={item.id}
                                className={`sidebar-btn ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className="btn-icon">{item.icon}</span>
                                <span className="btn-label">{item.label}</span>
                                {item.premium && <span className="premium-tag">PRO</span>}
                            </button>
                        ))}
                    </nav>
                    <div className="sidebar-footer">
                        <div className="user-mini-profile">
                            <div className="user-avatar-small">
                                {user?.displayName?.[0] || 'U'}
                            </div>
                            <div className="user-mini-info">
                                <p className="user-name">{user?.displayName || 'Seeker'}</p>
                                <p className="user-status">Premium Member</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="dashboard-main">
                    <header className="dashboard-content-header">
                        <div className="active-chart-info">
                            <span className="label">ACTIVE CHART:</span>
                            <h2 className="current-seeker-name">{user?.displayName || 'Global Seeker'}</h2>
                            <button className="get-reading-btn pulse-glow">Get a Reading</button>
                        </div>
                        <div className="location-time">
                            <span>🕒 {new Date().toLocaleTimeString()}</span>
                            <span>📍 Surat, India</span>
                        </div>
                    </header>

                    <div className="dashboard-scroll-area">
                        {/* Welcome Card */}
                        <section className="welcome-banner glass-card">
                            <span className="welcome-tag">WELCOME TO ASTROREVO PREMIUM!</span>
                            <div className="astro-score-display">
                                <div className="score-ring">
                                    <svg viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" className="ring-bg" />
                                        <circle cx="50" cy="50" r="45" className="ring-fill" />
                                    </svg>
                                    <span className="score-value">92</span>
                                </div>
                                <div className="score-details">
                                    <h3>AstroScore <span className="text-dim">Right Now</span></h3>
                                    <p>Your real-time cosmic pulse - combining all Jyotish forces affecting you at this moment. Check back throughout the day!</p>
                                    <button className="see-full-score-btn">See Full Score</button>
                                </div>
                            </div>
                        </section>

                        {/* Grid Widgets */}
                        <div className="widgets-grid">
                            <div className="widget-card glass-card">
                                <h3>North Indian Chart</h3>
                                <div className="chart-placeholder">
                                    {/* Simplified Chart Visual */}
                                    <div className="diamond-grid">
                                        <div className="grid-line horizontal"></div>
                                        <div className="grid-line vertical"></div>
                                        <div className="grid-line diag-1"></div>
                                        <div className="grid-line diag-2"></div>
                                        <span className="planet mo">Mo</span>
                                        <span className="planet ju">Ju</span>
                                        <span className="planet sa">Sa</span>
                                    </div>
                                </div>
                                <div className="chart-tabs">
                                    <button className="active">North</button>
                                    <button>South</button>
                                </div>
                            </div>

                            <div className="widget-card glass-card">
                                <h3>Planetary Strengths</h3>
                                <div className="strengths-list">
                                    {[
                                        { name: 'Sun', level: 85, color: '#FFD700' },
                                        { name: 'Moon', level: 92, color: '#C0C0C0' },
                                        { name: 'Mars', level: 45, color: '#FF4500' },
                                        { name: 'Jupiter', level: 78, color: '#FF8C00' }
                                    ].map(p => (
                                        <div key={p.name} className="strength-item">
                                            <span className="p-name">{p.name}</span>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${p.level}%`, backgroundColor: p.color }}></div>
                                            </div>
                                            <span className="p-val">{p.level}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Calculations Section */}
                        <section className="calculations-preview glass-card">
                            <h3 className="gold-text">Premium Calculations</h3>
                            <div className="calc-chips">
                                <span>Shodashvarga</span>
                                <span>Ashtakvarga Strength</span>
                                <span>Shadbala Energy</span>
                                <span>Vimshottari Dasha</span>
                                <span>Shadow Planets</span>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PremiumDashboard;
