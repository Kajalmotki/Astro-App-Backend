import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    KundliIcon, MatchmakingIcon, PanchangIcon, PoojaIcon,
    HoroscopeIcon, GemstoneIcon, KarmicIcon, NumerologyIcon
} from '../components/icons/GoldIcons';
import MagicCrystalBall from '../components/mobile/MagicCrystalBall';
import TarotCardPicker from '../components/mobile/TarotCardPicker';
import './MobileHome.css?v=9';

const MobileHome = () => {
    const navigate = useNavigate();
    const userName = "Seeker"; // TODO: Get from auth context

    // Services List with Custom Gold Icons
    const services = [
        { name: "Chart", icon: <KundliIcon size={32} />, action: () => navigate('/mobile/astro-chart') },
        { name: "Matchmaking", icon: <MatchmakingIcon size={32} />, action: () => navigate('/mobile/matchmaking') },
        { name: "Panchang", icon: <PanchangIcon size={32} />, action: () => navigate('/mobile/panchang') },
        { name: "Virtual Pooja", icon: <PoojaIcon size={32} />, action: () => navigate('/mobile/virtual-pooja') },
        { name: "Horoscope", icon: <HoroscopeIcon size={32} />, action: () => navigate('/mobile/horoscope') },
        { name: "Gemstones", icon: <GemstoneIcon size={32} />, action: () => navigate('/mobile/gemstones') },
        { name: "Karmic Reading", icon: <KarmicIcon size={32} />, action: () => navigate('/mobile/karmic-reading') },
        { name: "Numerology", icon: <NumerologyIcon size={32} />, action: () => navigate('/mobile/numerology') }
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
                                <div className="ticker-icon-box-premium">
                                    {service.icon}
                                </div>
                                <span>{service.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Magic Crystal Ball (Daily Horoscope) */}
            <MagicCrystalBall />

            {/* Tarot Card Picker - Above Cosmic Loop */}
            <TarotCardPicker />

            {/* Bottom spacer for nav bar */}
            <div style={{ height: '130px' }}></div>
        </div>
    );
};

export default MobileHome;
