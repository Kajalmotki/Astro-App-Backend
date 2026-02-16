import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, X } from 'lucide-react';
import {
    KundliIcon, MatchmakingIcon, PanchangIcon, PoojaIcon,
    HoroscopeIcon, GemstoneIcon, KarmicIcon, NumerologyIcon
} from '../components/icons/GoldIcons';
import MagicCrystalBall from '../components/mobile/MagicCrystalBall';
import TarotCardPicker from '../components/mobile/TarotCardPicker';
import WhyAstroRevo from '../components/WhyAstroRevo';
import PlanetTransitTicker from '../components/mobile/PlanetTransitTicker';
import './MobileHome.css?v=9';

import { useLanguage } from '../contexts/LanguageContext';

const MobileHome = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [showVideo, setShowVideo] = useState(false);
    const userName = "Seeker"; // TODO: Get from auth context

    // Services List with Custom Gold Icons
    const services = [
        { name: t("Chart"), icon: <KundliIcon size={32} />, action: () => navigate('/mobile/astro-chart') },
        { name: t("Matchmaking"), icon: <MatchmakingIcon size={32} />, action: () => navigate('/mobile/matchmaking') },
        { name: t("Panchang"), icon: <PanchangIcon size={32} />, action: () => navigate('/mobile/panchang') },
        { name: t("Virtual Pooja"), icon: <PoojaIcon size={32} />, action: () => navigate('/mobile/virtual-pooja') },
        { name: t("Horoscope"), icon: <HoroscopeIcon size={32} />, action: () => navigate('/mobile/horoscope') },
        { name: t("Gemstones"), icon: <GemstoneIcon size={32} />, action: () => navigate('/mobile/gemstones') },
        { name: t("Karmic Reading"), icon: <KarmicIcon size={32} />, action: () => navigate('/mobile/karmic-reading') },
        { name: t("Numerology"), icon: <NumerologyIcon size={32} />, action: () => navigate('/mobile/numerology') }
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
        <div className="mobile-home-container" style={{ position: 'relative', zIndex: 1, background: 'transparent', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header Section */}
            <header className="mobile-header">
                <div className="greeting-container">
                    <h1 className="greeting-text">{t("Namaste")}, {userName}</h1>
                    <p className="greeting-sub">{t("The stars align for you today.")}</p>
                </div>
            </header>

            {/* Why AstroRevo Button (Fixed Position handled inside component or CSS) */}
            <WhyAstroRevo />

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

            {/* Bottom spacer for nav bar and ticker */}
            <div style={{ height: '140px' }}></div>

            {/* Planet Transit Ticker - Fixed at Bottom */}
            <PlanetTransitTicker />

            {/* Video Modal */}
            {showVideo && (
                <div className="video-modal-overlay">
                    <button className="video-modal-close" onClick={() => setShowVideo(false)}>
                        <X size={32} />
                    </button>
                    <div className="video-modal-content">
                        <video
                            controls
                            autoPlay
                            playsInline
                            muted
                            className="marketing-video-player"
                        >
                            <source src="/videos/marketing_video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileHome;
