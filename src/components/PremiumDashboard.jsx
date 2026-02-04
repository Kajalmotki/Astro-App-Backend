import React, { useState } from 'react';
import './PremiumDashboard.css';

const PremiumDashboard = ({ isOpen, onClose, user }) => {
    const [activeTab, setActiveTab] = useState('home');

    if (!isOpen) return null;

    const sidebarItems = [
        { id: 'home', label: 'Dashboard Home', icon: '🏠', desc: 'Your personalized astrology overview' },
        { id: 'predictions', label: 'Period Analysis', icon: '📈', premium: true, desc: 'Focused forecasts and life trends' },
        { id: 'calculations', label: 'Shodashvarga', icon: '🔢', premium: true, desc: 'Divisional charts for deeper insights' },
        { id: 'transits', label: 'Current Transits', icon: '🌍', desc: 'Live planetary movements & effects' },
        { id: 'compatibility', label: 'Chart Compatibility', icon: '🤝', premium: true, desc: 'Relationship synastry analysis' },
        { id: 'settings', label: 'Account Settings', icon: '⚙️', desc: 'Manage your profile & preferences' },
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
                                <div className="btn-content">
                                    <span className="btn-label">{item.label}</span>
                                    <span className="btn-desc">{item.desc}</span>
                                </div>
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
                        {/* HOME Tab Content */}
                        {activeTab === 'home' && (
                            <>
                                {/* Welcome Card */}
                                <section className="welcome-banner glass-card">
                                    <span className="welcome-tag">WELCOME TO ASTROREVO PREMIUM!</span>
                                    <div className="astro-score-display">
                                        <div className="score-ring">
                                            <div className="tick-marks">
                                                {[...Array(36)].map((_, i) => (
                                                    <div key={i} className={`tick ${i % 4 === 0 ? 'major' : ''}`} style={{ transform: `rotate(${i * 10}deg)` }}></div>
                                                ))}
                                            </div>
                                            <svg viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="48" className="ring-bg outer-ring" />
                                                <circle cx="50" cy="50" r="48" className="ring-fill outer-ring" />
                                                <circle cx="50" cy="50" r="38" className="ring-bg middle-ring" />
                                                <circle cx="50" cy="50" r="38" style={{ strokeDasharray: 238, strokeDashoffset: 40 }} className="ring-fill secondary middle-ring" />
                                                <circle cx="50" cy="50" r="28" className="ring-bg inner-ring" />
                                                <circle cx="50" cy="50" r="28" style={{ strokeDasharray: 175, strokeDashoffset: 80 }} className="ring-fill tertiary inner-ring" />
                                            </svg>
                                            <div className="compass-glyph"></div>
                                            <div className="score-value">
                                                <span className="number">92.0</span>
                                                <span className="unit">PCT_OPTIMAL</span>
                                            </div>
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
                                                { name: 'Sun', level: 85.0, color: '#FFD700', status: 'STRONG' },
                                                { name: 'Moon', level: 92.5, color: '#C0C0C0', status: 'Exalted' },
                                                { name: 'Mars', level: 45.2, color: '#FF4500', status: 'Weak' },
                                                { name: 'Jupiter', level: 78.4, color: '#FF8C00', status: 'Moderate' },
                                                { name: 'Venus', level: 65.0, color: '#FF69B4', status: 'Neutral' }
                                            ].map(p => (
                                                <div key={p.name} className="strength-item">
                                                    <span className="p-name">{p.name}</span>
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${p.level}%`, backgroundColor: p.color }}></div>
                                                    </div>
                                                    <span className="p-val">{p.level.toFixed(1)}%</span>
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

                                {/* Vimshottari Timeline */}
                                <section className="dasha-section glass-card">
                                    <div className="section-header">
                                        <h3 className="gold-text">Vimshottari Timeline</h3>
                                        <p>Your current dasha stack and progress markers.</p>
                                    </div>
                                    <div className="dasha-grid">
                                        <div className="dasha-card">
                                            <span className="dasha-label">Mahadasha [L1]</span>
                                            <h4>Venus <span className="status-active">ACTIVE</span></h4>
                                            <p className="dasha-dates">START: 2007.02 · END: 2027.02</p>
                                            <div className="dasha-progress"><span style={{ width: '95.2%' }} /></div>
                                            <div className="dasha-percent">95.2%</div>
                                        </div>
                                        <div className="dasha-card">
                                            <span className="dasha-label">Antardasha [L2]</span>
                                            <h4>Ketu <span className="status-active">ACTIVE</span></h4>
                                            <p className="dasha-dates">START: 2025.12 · END: 2027.02</p>
                                            <div className="dasha-progress"><span style={{ width: '11.4%' }} /></div>
                                            <div className="dasha-percent">11.4%</div>
                                        </div>
                                        <div className="dasha-card">
                                            <span className="dasha-label">Pratyantar [L3]</span>
                                            <h4>Venus <span className="status-transition">TRANSITION</span></h4>
                                            <p className="dasha-dates">START: 2026.01 · END: 2026.03</p>
                                            <div className="dasha-progress"><span style={{ width: '30.8%' }} /></div>
                                            <div className="dasha-percent">30.8%</div>
                                        </div>
                                    </div>
                                    <div className="dasha-note">
                                        You are in Venus Mahadasha, Ketu Antardasha, Venus Pratyantardasha.
                                    </div>
                                </section>
                            </>
                        )}

                        {/* PREDICTIONS / PERIOD ANALYSIS Tab */}
                        {activeTab === 'predictions' && (
                            <>
                                <section className="tab-intro glass-card">
                                    <h2 className="tab-title">📈 Period Analysis</h2>
                                    <p className="tab-subtitle">Deep dive into your planetary periods and their influences on different life areas.</p>
                                </section>

                                <div className="analysis-grid">
                                    <section className="analysis-card glass-card">
                                        <h3>Current Dasha Overview</h3>
                                        <div className="dasha-overview">
                                            <div className="current-dasha-stack">
                                                <div className="dasha-level">
                                                    <span className="level-tag">Mahadasha</span>
                                                    <span className="planet-badge venus">Venus</span>
                                                    <span className="duration">2007 - 2027 (20 years)</span>
                                                </div>
                                                <div className="dasha-level">
                                                    <span className="level-tag">Antardasha</span>
                                                    <span className="planet-badge ketu">Ketu</span>
                                                    <span className="duration">Dec 2025 - Feb 2027 (14 months)</span>
                                                </div>
                                                <div className="dasha-level active-level">
                                                    <span className="level-tag">Pratyantardasha</span>
                                                    <span className="planet-badge venus">Venus</span>
                                                    <span className="duration">Jan 2026 - Mar 2026 (70 days)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="analysis-card glass-card">
                                        <h3>Period Themes & Predictions</h3>
                                        <div className="predictions-list">
                                            <div className="prediction-item">
                                                <div className="prediction-icon">💼</div>
                                                <div className="prediction-content">
                                                    <h4>Career & Professional Growth</h4>
                                                    <p>Venus-Ketu period brings introspection in career. Avoid major job changes until March. Focus on skill development and spiritual growth in professional life.</p>
                                                    <span className="period-intensity moderate">Moderate Influence</span>
                                                </div>
                                            </div>
                                            <div className="prediction-item">
                                                <div className="prediction-icon">💰</div>
                                                <div className="prediction-content">
                                                    <h4>Finances & Wealth</h4>
                                                    <p>Unexpected expenses possible. Avoid speculative investments. Good period for clearing old debts and financial restructuring.</p>
                                                    <span className="period-intensity cautious">Requires Caution</span>
                                                </div>
                                            </div>
                                            <div className="prediction-item">
                                                <div className="prediction-icon">❤️</div>
                                                <div className="prediction-content">
                                                    <h4>Relationships & Family</h4>
                                                    <p>Venus influence brings harmony in relationships. Ketu adds depth to emotional connections. Perfect time for rekindling old bonds.</p>
                                                    <span className="period-intensity favorable">Favorable</span>
                                                </div>
                                            </div>
                                            <div className="prediction-item">
                                                <div className="prediction-icon">🏥</div>
                                                <div className="prediction-content">
                                                    <h4>Health & Wellness</h4>
                                                    <p>Pay attention to digestive health and skin. Yoga and meditation highly beneficial during this period. Avoid excessive indulgence.</p>
                                                    <span className="period-intensity moderate">Moderate</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="analysis-card glass-card full-width">
                                        <h3>Upcoming Period Transitions</h3>
                                        <div className="timeline-visual">
                                            <div className="timeline-item completed">
                                                <div className="timeline-marker"></div>
                                                <div className="timeline-content">
                                                    <span className="timeline-date">Nov 2025</span>
                                                    <span className="timeline-event">Moon Antardasha ended</span>
                                                </div>
                                            </div>
                                            <div className="timeline-item current">
                                                <div className="timeline-marker"></div>
                                                <div className="timeline-content">
                                                    <span className="timeline-date">Dec 2025</span>
                                                    <span className="timeline-event">Ketu Antardasha began</span>
                                                </div>
                                            </div>
                                            <div className="timeline-item upcoming">
                                                <div className="timeline-marker"></div>
                                                <div className="timeline-content">
                                                    <span className="timeline-date">Feb 2027</span>
                                                    <span className="timeline-event">Sun Mahadasha begins</span>
                                                </div>
                                            </div>
                                            <div className="timeline-item future">
                                                <div className="timeline-marker"></div>
                                                <div className="timeline-content">
                                                    <span className="timeline-date">Feb 2033</span>
                                                    <span className="timeline-event">Moon Mahadasha begins</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </>
                        )}

                        {/* CALCULATIONS / SHODASHVARGA Tab */}
                        {activeTab === 'calculations' && (
                            <>
                                <section className="tab-intro glass-card">
                                    <h2 className="tab-title">🔢 Shodashvarga - 16 Divisional Charts</h2>
                                    <p className="tab-subtitle">Explore the 16 divisional charts that reveal hidden dimensions of your life areas.</p>
                                </section>

                                <div className="varga-grid">
                                    {[
                                        { name: 'D-1 Rashi', desc: 'Birth Chart - Overall life blueprint', strength: 92 },
                                        { name: 'D-2 Hora', desc: 'Wealth & Financial prosperity', strength: 78 },
                                        { name: 'D-3 Drekkana', desc: 'Siblings & Courage', strength: 65 },
                                        { name: 'D-4 Chaturthamsa', desc: 'Property & Fixed assets', strength: 81 },
                                        { name: 'D-7 Saptamsa', desc: 'Children & Progeny', strength: 74 },
                                        { name: 'D-9 Navamsa', desc: 'Marriage & Dharma', strength: 88 },
                                        { name: 'D-10 Dasamsa', desc: 'Career & Profession', strength: 85 },
                                        { name: 'D-12 Dwadasamsa', desc: 'Parents & Lineage', strength: 70 },
                                        { name: 'D-16 Shodasamsa', desc: 'Vehicles & Comforts', strength: 62 },
                                        { name: 'D-20 Vimsamsa', desc: 'Spiritual progress', strength: 90 },
                                        { name: 'D-24 Chaturvimsamsa', desc: 'Education & Learning', strength: 83 },
                                        { name: 'D-27 Bhamsa', desc: 'Strengths & Weaknesses', strength: 71 },
                                        { name: 'D-30 Trimsamsa', desc: 'Misfortunes & Evils', strength: 55 },
                                        { name: 'D-40 Khavedamsa', desc: 'Maternal legacy', strength: 67 },
                                        { name: 'D-45 Akshavedamsa', desc: 'Paternal legacy', strength: 72 },
                                        { name: 'D-60 Shashtiamsa', desc: 'Past life karma', strength: 85 }
                                    ].map(varga => (
                                        <div key={varga.name} className="varga-card glass-card">
                                            <div className="varga-header">
                                                <h4>{varga.name}</h4>
                                                <span className="varga-strength" style={{
                                                    color: varga.strength >= 80 ? 'var(--accent-emerald)' :
                                                        varga.strength >= 60 ? 'var(--accent-gold)' : 'var(--accent-coral)'
                                                }}>{varga.strength}%</span>
                                            </div>
                                            <p className="varga-desc">{varga.desc}</p>
                                            <div className="varga-bar">
                                                <div className="varga-fill" style={{
                                                    width: `${varga.strength}%`,
                                                    background: varga.strength >= 80 ? 'var(--accent-emerald)' :
                                                        varga.strength >= 60 ? 'var(--accent-gold)' : 'var(--accent-coral)'
                                                }}></div>
                                            </div>
                                            <button className="view-chart-btn">View Chart →</button>
                                        </div>
                                    ))}
                                </div>

                                <section className="calculation-summary glass-card">
                                    <h3>Varga Vimshopaka Strength</h3>
                                    <p>Your overall divisional chart strength is <strong>76.8%</strong> indicating good planetary dignity across life areas. D-9 Navamsa and D-20 Vimsamsa show exceptional strength, indicating blessed marriage prospects and strong spiritual inclination.</p>
                                </section>
                            </>
                        )}

                        {/* TRANSITS Tab */}
                        {activeTab === 'transits' && (
                            <>
                                <section className="tab-intro glass-card">
                                    <h2 className="tab-title">🌍 Current Planetary Transits</h2>
                                    <p className="tab-subtitle">Real-time planetary positions and their effects on your natal chart.</p>
                                </section>

                                <div className="transits-grid">
                                    <section className="transit-card glass-card">
                                        <h3>Live Planet Positions</h3>
                                        <div className="planet-positions">
                                            {[
                                                { planet: 'Sun', sign: 'Aquarius', degree: '21°14\'', nakshatra: 'Purva Bhadrapada', house: '3rd', effect: 'neutral' },
                                                { planet: 'Moon', sign: 'Sagittarius', degree: '8°45\'', nakshatra: 'Mula', house: '1st', effect: 'positive' },
                                                { planet: 'Mars', sign: 'Gemini', degree: '12°30\'', nakshatra: 'Ardra', house: '7th', effect: 'challenging' },
                                                { planet: 'Mercury', sign: 'Capricorn', degree: '28°55\'', nakshatra: 'Dhanishta', house: '2nd', effect: 'positive' },
                                                { planet: 'Jupiter', sign: 'Taurus', degree: '15°22\'', nakshatra: 'Rohini', house: '6th', effect: 'neutral' },
                                                { planet: 'Venus', sign: 'Pisces', degree: '3°18\'', nakshatra: 'Uttara Bhadrapada', house: '4th', effect: 'positive' },
                                                { planet: 'Saturn', sign: 'Aquarius', degree: '25°40\'', nakshatra: 'Purva Bhadra', house: '3rd', effect: 'challenging' },
                                                { planet: 'Rahu', sign: 'Pisces', degree: '18°05\'', nakshatra: 'Revati', house: '4th', effect: 'neutral' },
                                                { planet: 'Ketu', sign: 'Virgo', degree: '18°05\'', nakshatra: 'Hasta', house: '10th', effect: 'transformative' }
                                            ].map(p => (
                                                <div key={p.planet} className={`planet-row ${p.effect}`}>
                                                    <span className="transit-planet">{p.planet}</span>
                                                    <span className="transit-sign">{p.sign}</span>
                                                    <span className="transit-degree">{p.degree}</span>
                                                    <span className="transit-nakshatra">{p.nakshatra}</span>
                                                    <span className="transit-house">{p.house} House</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="transit-card glass-card">
                                        <h3>Key Transit Effects on Your Chart</h3>
                                        <div className="transit-effects">
                                            <div className="effect-item positive">
                                                <h4>🟢 Venus in Pisces (Exalted)</h4>
                                                <p>Venus transiting your 4th house brings domestic harmony, property gains, and emotional fulfillment. Excellent for home improvements and family bonding.</p>
                                                <span className="effect-duration">Until March 15, 2026</span>
                                            </div>
                                            <div className="effect-item challenging">
                                                <h4>🔴 Saturn in 3rd House</h4>
                                                <p>Saturn's aspect on your communication house may slow down short travels and create delays in paperwork. Practice patience in daily communications.</p>
                                                <span className="effect-duration">Until March 2028</span>
                                            </div>
                                            <div className="effect-item transformative">
                                                <h4>🟣 Ketu in 10th House</h4>
                                                <p>Ketu transiting your career house brings spiritual detachment from worldly success. Focus on service-oriented work and let go of ego-driven ambitions.</p>
                                                <span className="effect-duration">Until October 2026</span>
                                            </div>
                                            <div className="effect-item neutral">
                                                <h4>🟡 Jupiter in 6th House</h4>
                                                <p>Jupiter's transit supports overcoming obstacles and enemies. Good period for health improvements and resolving legal matters.</p>
                                                <span className="effect-duration">Until May 2026</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="transit-card glass-card full-width">
                                        <h3>Upcoming Major Transits</h3>
                                        <div className="upcoming-transits">
                                            <div className="upcoming-item">
                                                <span className="transit-date">Feb 13, 2026</span>
                                                <span className="transit-event">Mercury enters Aquarius</span>
                                                <span className="transit-impact">Enhanced communication skills</span>
                                            </div>
                                            <div className="upcoming-item">
                                                <span className="transit-date">Mar 15, 2026</span>
                                                <span className="transit-event">Venus enters Aries</span>
                                                <span className="transit-impact">New romantic opportunities</span>
                                            </div>
                                            <div className="upcoming-item">
                                                <span className="transit-date">Apr 22, 2026</span>
                                                <span className="transit-event">Mars enters Cancer</span>
                                                <span className="transit-impact">Focus on home matters</span>
                                            </div>
                                            <div className="upcoming-item highlight">
                                                <span className="transit-date">May 14, 2026</span>
                                                <span className="transit-event">Jupiter enters Gemini</span>
                                                <span className="transit-impact">Major career expansion period</span>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </>
                        )}

                        {/* COMPATIBILITY Tab */}
                        {activeTab === 'compatibility' && (
                            <>
                                <section className="tab-intro glass-card">
                                    <h2 className="tab-title">🤝 Chart Compatibility Analysis</h2>
                                    <p className="tab-subtitle">Vedic synastry and Ashtakoota matching for relationship insights.</p>
                                </section>

                                <section className="compatibility-intro glass-card">
                                    <h3>Add Partner's Birth Details</h3>
                                    <p>Enter your partner's birth information to generate a comprehensive compatibility report including Ashtakoota matching, Manglik analysis, and synastry insights.</p>
                                    <div className="partner-form">
                                        <div className="form-row">
                                            <input type="text" placeholder="Partner's Name" className="form-input" />
                                            <input type="date" placeholder="Date of Birth" className="form-input" />
                                        </div>
                                        <div className="form-row">
                                            <input type="time" placeholder="Time of Birth" className="form-input" />
                                            <input type="text" placeholder="Place of Birth" className="form-input" />
                                        </div>
                                        <button className="analyze-btn">Generate Compatibility Report</button>
                                    </div>
                                </section>

                                <section className="compatibility-preview glass-card">
                                    <h3>What You'll Get</h3>
                                    <div className="compatibility-features">
                                        <div className="compat-feature">
                                            <h4>🎯 Ashtakoota Score</h4>
                                            <p>Traditional 36-point matching covering Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi.</p>
                                        </div>
                                        <div className="compat-feature">
                                            <h4>♂️ Manglik Analysis</h4>
                                            <p>Detailed Mars dosha assessment for both charts with remedial measures if applicable.</p>
                                        </div>
                                        <div className="compat-feature">
                                            <h4>🔗 Planetary Synastry</h4>
                                            <p>How your planets interact with your partner's chart - aspects, conjunctions, and house overlays.</p>
                                        </div>
                                        <div className="compat-feature">
                                            <h4>💫 Nakshatra Compatibility</h4>
                                            <p>Birth star compatibility and the subtle emotional resonance between partners.</p>
                                        </div>
                                        <div className="compat-feature">
                                            <h4>🏠 7th House Analysis</h4>
                                            <p>Deep dive into both partners' marriage houses and their planetary influences.</p>
                                        </div>
                                        <div className="compat-feature">
                                            <h4>📅 Timing Guidance</h4>
                                            <p>Auspicious periods for marriage, engagement, and important relationship milestones.</p>
                                        </div>
                                    </div>
                                </section>
                            </>
                        )}

                        {/* SETTINGS Tab */}
                        {activeTab === 'settings' && (
                            <>
                                <section className="tab-intro glass-card">
                                    <h2 className="tab-title">⚙️ Account Settings</h2>
                                    <p className="tab-subtitle">Manage your profile, preferences, and subscription details.</p>
                                </section>

                                <div className="settings-grid">
                                    <section className="settings-card glass-card">
                                        <h3>Profile Information</h3>
                                        <div className="profile-section">
                                            <div className="profile-avatar-large">
                                                {user?.displayName?.[0] || 'U'}
                                            </div>
                                            <div className="profile-details">
                                                <div className="detail-row">
                                                    <span className="detail-label">Name</span>
                                                    <span className="detail-value">{user?.displayName || 'Guest User'}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">Email</span>
                                                    <span className="detail-value">{user?.email || 'Not provided'}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">Member Since</span>
                                                    <span className="detail-value">January 2024</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="edit-profile-btn">Edit Profile</button>
                                    </section>

                                    <section className="settings-card glass-card">
                                        <h3>Birth Details</h3>
                                        <div className="birth-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Date of Birth</span>
                                                <span className="detail-value">July 15, 1995</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Time of Birth</span>
                                                <span className="detail-value">10:30 AM</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Place of Birth</span>
                                                <span className="detail-value">New Delhi, India</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Timezone</span>
                                                <span className="detail-value">IST (UTC+5:30)</span>
                                            </div>
                                        </div>
                                        <button className="edit-profile-btn">Update Birth Details</button>
                                    </section>

                                    <section className="settings-card glass-card">
                                        <h3>Subscription</h3>
                                        <div className="subscription-info">
                                            <div className="plan-badge">Premium Plan</div>
                                            <div className="detail-row">
                                                <span className="detail-label">Status</span>
                                                <span className="detail-value status-active">Active</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Renewal Date</span>
                                                <span className="detail-value">March 1, 2026</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Billing Cycle</span>
                                                <span className="detail-value">Monthly</span>
                                            </div>
                                        </div>
                                        <button className="manage-sub-btn">Manage Subscription</button>
                                    </section>

                                    <section className="settings-card glass-card">
                                        <h3>Preferences</h3>
                                        <div className="preferences-list">
                                            <div className="pref-item">
                                                <span className="pref-label">Ayanamsa</span>
                                                <select className="pref-select">
                                                    <option>Lahiri (Chitrapaksha)</option>
                                                    <option>Raman</option>
                                                    <option>KP</option>
                                                    <option>True Chitrapaksha</option>
                                                </select>
                                            </div>
                                            <div className="pref-item">
                                                <span className="pref-label">Chart Style</span>
                                                <select className="pref-select">
                                                    <option>North Indian</option>
                                                    <option>South Indian</option>
                                                    <option>Western</option>
                                                </select>
                                            </div>
                                            <div className="pref-item">
                                                <span className="pref-label">Email Notifications</span>
                                                <label className="toggle">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                            <div className="pref-item">
                                                <span className="pref-label">Daily Horoscope</span>
                                                <label className="toggle">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PremiumDashboard;
