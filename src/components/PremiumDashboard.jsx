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

    const exploreSections = [
        {
            title: 'Predictions',
            items: [
                {
                    title: 'Period Analysis',
                    desc: 'Review a chosen time window with focused forecasts and trends.',
                    premium: true
                },
                {
                    title: 'Samhita Analysis',
                    desc: 'Compare your chart with notable charts to surface patterns.'
                }
            ]
        },
        {
            title: 'Tools',
            items: [
                {
                    title: 'Chart Rectification',
                    desc: 'Fine‑tune your birth time using life events and astrological markers.'
                },
                {
                    title: 'Events Calibration',
                    desc: 'Validate accuracy by mapping past events to dasha timelines.'
                },
                {
                    title: 'Zodiac Calibration',
                    desc: 'Align planetary positions with zodiac precision.'
                },
                {
                    title: 'Biodata Calibration',
                    desc: 'Refine chart accuracy using personal biodata indicators.'
                }
            ]
        },
        {
            title: 'Calculations',
            items: [
                {
                    title: 'Shodashvarga Charts',
                    desc: 'Explore divisional charts for deeper life‑area insights.'
                },
                {
                    title: 'Ashtakvarga Strength',
                    desc: 'Assess planetary strength using bindu scoring.'
                },
                {
                    title: 'Shadbala Energy',
                    desc: 'Measure six‑fold planetary power across the chart.'
                },
                {
                    title: 'Vimshottari Dasha',
                    desc: 'Navigate Mahadasha, Antardasha, and Pratyantardasha cycles.'
                },
                {
                    title: 'Shadow Planets',
                    desc: 'Understand the impact of Rahu, Ketu, and other shadow factors.'
                }
            ]
        },
        {
            title: 'Global Tools',
            items: [
                {
                    title: 'Current Transits',
                    desc: 'Track live planetary movements and their effects.'
                },
                {
                    title: 'Panchang',
                    desc: 'Daily tithi, nakshatra, yoga, karana, and vaar details.'
                },
                {
                    title: 'Muhuratas',
                    desc: 'Find auspicious timings for key activities.'
                },
                {
                    title: 'Chart Compatibility',
                    desc: 'Analyze relationship compatibility using Vedic techniques.',
                    premium: true
                }
            ]
        }
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
                            <span>📍 New Delhi, India</span>
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

                        {/* Yogas Section */}
                        <section className="insight-section glass-card">
                            <div className="section-header">
                                <h3 className="gold-text">Yogas in Your Chart</h3>
                                <p>Highlighted planetary combinations shaping key life themes.</p>
                            </div>
                            <div className="yoga-grid">
                                <div className="yoga-group">
                                    <h4>Raja Yogas</h4>
                                    <ul>
                                        <li>Sukha‑Putra Raja Yoga</li>
                                        <li>Putra‑Kalatra Raja Yoga</li>
                                    </ul>
                                </div>
                                <div className="yoga-group">
                                    <h4>Dhana Yogas</h4>
                                    <ul>
                                        <li>Dhana‑Labha Yoga</li>
                                        <li>Putra‑Labha Yoga</li>
                                    </ul>
                                </div>
                                <div className="yoga-group">
                                    <h4>Conjunction Yogas</h4>
                                    <ul>
                                        <li>Budha Aditya Yoga</li>
                                        <li>Guru Mangal Yoga</li>
                                        <li>Sun Jupiter Yoga</li>
                                    </ul>
                                </div>
                                <div className="yoga-group">
                                    <h4>Nabhasa Yogas</h4>
                                    <ul>
                                        <li>Kedaara Yoga</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Birth Panchang */}
                        <section className="panchang-section glass-card">
                            <div className="section-header">
                                <h3 className="gold-text">Birth Panchang</h3>
                                <p>Key lunar details at your birth moment.</p>
                            </div>
                            <div className="panchang-grid">
                                <div className="panchang-item">
                                    <span className="panchang-label">🌙 Tithi</span>
                                    <span className="panchang-value">Trayodashi (Shukla)</span>
                                </div>
                                <div className="panchang-item">
                                    <span className="panchang-label">⭐ Nakshatra</span>
                                    <span className="panchang-value">Mula</span>
                                </div>
                                <div className="panchang-item">
                                    <span className="panchang-label">🕉️ Yoga</span>
                                    <span className="panchang-value">Indra</span>
                                </div>
                                <div className="panchang-item">
                                    <span className="panchang-label">⚡ Karana</span>
                                    <span className="panchang-value">Kaulava</span>
                                </div>
                                <div className="panchang-item">
                                    <span className="panchang-label">📅 Vaar</span>
                                    <span className="panchang-value">Monday</span>
                                </div>
                            </div>
                            <div className="panchang-detail">
                                <div>
                                    <h4>Sun</h4>
                                    <p>Sign: Cancer · Rise: 05:47 AM · Set: 07:08 PM</p>
                                </div>
                                <div>
                                    <h4>Moon</h4>
                                    <p>Sign: Sagittarius · Nakshatra: Mula · Paksha: Shukla</p>
                                </div>
                            </div>
                        </section>

                        {/* Vimshottari Timeline */}
                        <section className="dasha-section glass-card">
                            <div className="section-header">
                                <h3 className="gold-text">Vimshottari Timeline</h3>
                                <p>Your current dasha stack and progress markers.</p>
                            </div>
                            <div className="dasha-grid">
                                <div className="dasha-card">
                                    <span className="dasha-label">Mahadasha</span>
                                    <h4>Venus</h4>
                                    <p>Feb 2007 – Feb 2027</p>
                                    <div className="dasha-progress"><span style={{ width: '95%' }} /></div>
                                </div>
                                <div className="dasha-card">
                                    <span className="dasha-label">Antardasha</span>
                                    <h4>Ketu</h4>
                                    <p>Dec 2025 – Feb 2027</p>
                                    <div className="dasha-progress"><span style={{ width: '11%' }} /></div>
                                </div>
                                <div className="dasha-card">
                                    <span className="dasha-label">Pratyantardasha</span>
                                    <h4>Venus</h4>
                                    <p>Jan 2026 – Mar 2026</p>
                                    <div className="dasha-progress"><span style={{ width: '30%' }} /></div>
                                </div>
                            </div>
                            <div className="dasha-note">
                                You are in Venus Mahadasha, Ketu Antardasha, Venus Pratyantardasha.
                            </div>
                        </section>

                        {/* Current Muhurata */}
                        <section className="muhurata-section glass-card">
                            <div className="section-header">
                                <h3 className="gold-text">Current Muhurata</h3>
                                <p>Live auspicious timing with activity suggestions.</p>
                            </div>
                            <div className="muhurata-card">
                                <div className="muhurata-time">00:00 – 01:20</div>
                                <div className="muhurata-meta">Duration: 1h 20m · Score: 65/100</div>
                                <div className="muhurata-good">
                                    <span>🌟 Lifestyle & Leisure</span>
                                    <span>❤️ Relationships & Family</span>
                                    <span>🏥 Health & Wellness</span>
                                </div>
                                <div className="muhurata-next">Next Muhurata in 41m 54s</div>
                            </div>
                        </section>

                        {/* Current Tithi */}
                        <section className="tithi-section glass-card">
                            <div className="section-header">
                                <h3 className="gold-text">Current Tithi</h3>
                                <p>Ongoing lunar phase and completion status.</p>
                            </div>
                            <div className="tithi-card">
                                <div>
                                    <h4>Chaturdashi</h4>
                                    <p>Shukla Paksha · 11% complete</p>
                                </div>
                                <div className="tithi-progress"><span style={{ width: '11%' }} /></div>
                                <div className="tithi-meta">
                                    <span>Started: 12:00 AM</span>
                                    <span>Ends: 05:52 AM</span>
                                </div>
                            </div>
                        </section>

                        {/* Explore Your Chart */}
                        <section className="explore-section glass-card">
                            <div className="section-header">
                                <h3 className="gold-text">Explore Your Chart</h3>
                                <p>All premium tools and insights in one place.</p>
                            </div>
                            <div className="explore-grid">
                                {exploreSections.map((section) => (
                                    <div key={section.title} className="explore-column">
                                        <h4>{section.title}</h4>
                                        <div className="explore-list">
                                            {section.items.map((item) => (
                                                <div key={item.title} className="explore-item">
                                                    <div className="explore-item-title">
                                                        {item.title}
                                                        {item.premium && <span className="premium-badge">PRO</span>}
                                                    </div>
                                                    <p>{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PremiumDashboard;
