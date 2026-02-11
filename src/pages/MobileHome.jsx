import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TarotCardPicker from '../components/mobile/TarotCardPicker';
import './MobileHome.css';

const MobileHome = () => {
    const navigate = useNavigate();
    const userName = "Seeker"; // TODO: Get from auth context

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

            {/* Tarot Card Picker - Above Cosmic Loop */}
            <TarotCardPicker />

            {/* Bottom spacer for nav bar */}
            <div style={{ height: '130px' }}></div>
        </div>
    );
};

export default MobileHome;
