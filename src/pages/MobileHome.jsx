import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, X } from 'lucide-react';
import './MobileHome.css';

const MobileHome = () => {
    const navigate = useNavigate();
    const userName = "Seeker"; // TODO: Get from auth context
    const [showInsight, setShowInsight] = useState(false);

    // Services List from ScrollingTicker (Desktop)
    const services = [
        { name: "Chart", image: "/images/chart_symbol.png", action: () => navigate('/mobile/astro-chart') },
        { name: "Matchmaking", image: "/images/matchmaking_symbol.png", action: () => navigate('/mobile/matchmaking') },
        { name: "Panchang", image: "/images/panchang_symbol.png", action: () => navigate('/mobile/panchang') },
        { name: "Virtual Pooja", image: "/images/virtual_pooja_symbol.png", action: () => navigate('/mobile/virtual-pooja') },
        { name: "Horoscope", image: "/images/horoscope_symbol.png", action: () => navigate('/mobile/horoscope') },
        { name: "Gemstones", image: "/images/gemstones_symbol.png", action: () => navigate('/mobile/gemstones') },
        { name: "Karmic Reading", image: "/images/karma_symbol.png", action: () => navigate('/mobile/karmic-reading') },
        { name: "Numerology", image: "/images/numerology_symbol.png", action: () => navigate('/mobile/numerology') }
    ];

    // Dummy data for planetary strengths
    const planetaryStrengths = [
        { name: 'Sun', level: 85.0, color: '#FFD700', status: 'STRONG' },
        { name: 'Moon', level: 92.5, color: '#C0C0C0', status: 'Exalted' },
        { name: 'Mars', level: 45.2, color: '#FF4500', status: 'Weak' },
        { name: 'Jupiter', level: 78.4, color: '#FF8C00', status: 'Moderate' },
        { name: 'Venus', level: 65.0, color: '#FF69B4', status: 'Neutral' }
    ];

    return (
        <div className="mobile-home-container" style={{ position: 'relative', zIndex: 1, background: 'transparent', minHeight: '100vh' }}>
            {/* Header Section */}
            <header className="mobile-header">
                <div className="greeting-container">
                    <h1 className="greeting-text">Namaste, {userName}</h1>
                    <p className="greeting-sub">The stars align for you today.</p>
                </div>
            </header>

            {/* Hero / Daily Insight Card */}
            <section className="daily-insight-card">
                <div className="insight-content">
                    <div className="insight-icon-wrapper">
                        <Sun size={32} />
                    </div>
                    <div className="insight-text">
                        <h3>Daily Cosmic Pulse</h3>
                        <p>Moon in Taurus suggests grounding energy today. Focus on stability.</p>
                    </div>
                </div>
                <button className="insight-action-btn" onClick={() => setShowInsight(true)}>
                    Read More
                </button>
            </section>

            {/* Insight Modal */}
            {showInsight && (
                <div className="insight-modal-overlay">
                    <div className="insight-modal-content">
                        <button className="close-modal-btn" onClick={() => setShowInsight(false)}>
                            <X size={24} />
                        </button>
                        <div className="modal-header">
                            <Sun size={40} className="modal-icon" />
                            <h2>Daily Cosmic Pulse</h2>
                            <p className="date-tag">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="modal-body-scroll">
                            <div className="insight-section">
                                <h3>🌙 Moon in Taurus</h3>
                                <p>Today, the Moon travels through the stable and sensual sign of Taurus. This planetary placement encourages you to slow down and appreciate the tangible pleasures of life. It's an excellent day for financial planning, enjoying a good meal, or spending time in nature.</p>
                            </div>
                            <div className="insight-section">
                                <h3>✨ Tithi: Shukla Paksha Dashami</h3>
                                <p>The bright lunar phase supports constructive activities and new beginnings. Energy levels are rising, making this a great time to tackle pending tasks with renewed vigor.</p>
                            </div>
                            <div className="insight-section">
                                <h3>🕉️ Daily Mantra</h3>
                                <p className="mantra-text">"Om Som Somaya Namah"</p>
                                <p className="mantra-desc">Chant this mantra 108 times to harmonize your emotions and enhance mental peace.</p>
                            </div>
                            <div className="insight-tip">
                                <strong>Tip of the Day:</strong> Wear white or cream colors to attract positive lunar energy.
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {/* Mobile Ticker Track */}
            <section className="mobile-ticker-section">
                <div className="ticker-scroll-container">
                    <div className="ticker-track-mobile">
                        {/* Static Grid Layout */}
                        {services.map((service, index) => (
                            <div key={`${service.name}-${index}`} className="ticker-item" onClick={service.action}>
                                <div className="ticker-icon-box">
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="ticker-img"
                                    />
                                </div>
                                <span>{service.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom spacer for nav bar */}
            <div style={{ height: '70px' }}></div>
        </div>
    );
};

export default MobileHome;
