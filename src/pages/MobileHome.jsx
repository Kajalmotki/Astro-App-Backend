import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Shuffle, Eye, BookOpen } from 'lucide-react';
import {
    KundliIcon, MatchmakingIcon, PanchangIcon, PoojaIcon,
    HoroscopeIcon, GemstoneIcon, KarmicIcon, NumerologyIcon
} from '../components/icons/GoldIcons';
import { Sparkles } from 'lucide-react';
import MagicCrystalBall from '../components/mobile/MagicCrystalBall';
import TarotCardPicker from '../components/mobile/TarotCardPicker';
import WhyAstroRevo from '../components/WhyAstroRevo';
import PlanetTransitTicker from '../components/mobile/PlanetTransitTicker';
import { useTheme } from '../contexts/ThemeContext';
import './MobileHome.css';

import { useLanguage } from '../contexts/LanguageContext';

const MobileHome = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { isDarkMode } = useTheme();
    const [showVideo, setShowVideo] = useState(false);
    const [showTarotModal, setShowTarotModal] = useState(false);
    const userName = "Seeker";
    const tarotPickerRef = useRef(null);

    const services = [
        { name: t("Local AI (New)"), icon: <Sparkles size={32} color={isDarkMode ? "#FFD700" : "#b87333"} />, action: () => navigate('/mobile/local-ai') },
        { name: t("Chart"), icon: <KundliIcon size={32} />, action: () => navigate('/mobile/astro-chart') },
        { name: t("Matchmaking"), icon: <MatchmakingIcon size={32} />, action: () => navigate('/mobile/matchmaking') },
        { name: t("Panchang"), icon: <PanchangIcon size={32} />, action: () => navigate('/mobile/panchang') },
        { name: t("Virtual Pooja"), icon: <PoojaIcon size={32} />, action: () => navigate('/mobile/virtual-pooja') },
        { name: t("Horoscope"), icon: <HoroscopeIcon size={32} />, action: () => navigate('/mobile/horoscope') },
        { name: t("Gemstones"), icon: <GemstoneIcon size={32} />, action: () => navigate('/mobile/gemstones') },
        { name: t("Karmic Reading"), icon: <KarmicIcon size={32} />, action: () => navigate('/mobile/karmic-reading') },
        { name: t("Numerology"), icon: <NumerologyIcon size={32} />, action: () => navigate('/mobile/numerology') }
    ];

    const handleOrbClick = () => {
        setShowTarotModal(true);
    };

    const handleShuffle = () => {
        setShowTarotModal(false);
        if (tarotPickerRef.current && tarotPickerRef.current.shuffle) {
            tarotPickerRef.current.shuffle();
        }
    };

    const handleReveal = () => {
        setShowTarotModal(false);
        if (tarotPickerRef.current && tarotPickerRef.current.revealRandom) {
            tarotPickerRef.current.revealRandom();
        }
    };

    const handleLearnTarot = () => {
        setShowTarotModal(false);
        navigate('/mobile/tarot-guide');
    };

    return (
        <div className="mobile-home-container" style={{ position: 'relative', zIndex: 1, background: 'transparent', minHeight: '100vh', paddingBottom: '100px' }}>
            {!isDarkMode && <div className="day-mode-radial-sun"></div>}

            {/* Header Section */}
            <header className="mobile-header">
                <div className="greeting-container">
                    <h1 className="greeting-text">{t("Namaste")}, {userName}</h1>
                    <p className="greeting-sub">
                        {isDarkMode ? t("The stars align for you tonight.") : t("Cosmic clarity awaits you today.")}
                    </p>
                </div>
            </header>

            {/* Mobile Ticker Track */}
            <section className="mobile-ticker-section">
                <div className="ticker-scroll-container">
                    <div className="ticker-track-mobile">
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

            {/* Why AstroRevo Button - Centered */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <WhyAstroRevo />
            </div>

            {/* Tarot Card Picker */}
            <div id="tarot-section">
                <TarotCardPicker ref={tarotPickerRef} />
            </div>

            {/* Mystic Orb - below tarot cards */}
            <div className="tarot-select-wrapper">
                <button
                    className="tarot-select-btn"
                    onClick={handleOrbClick}
                    aria-label="Open tarot options"
                    type="button"
                >
                    <span className="tarot-select-text">{t('read cards')}</span>
                </button>
            </div>

            {/* Tarot Action Modal */}
            {showTarotModal && (
                <div className="tarot-modal-backdrop" onClick={() => setShowTarotModal(false)}>
                    <div className="tarot-modal-sheet" onClick={e => e.stopPropagation()}>
                        <div className="tarot-modal-handle" />
                        <div className="tarot-modal-header">
                            <span className="tarot-modal-title">✦ {t('Your Cosmic Reading')} ✦</span>
                            <p className="tarot-modal-sub">{t('What does the universe hold for you?')}</p>
                        </div>
                        <div className="tarot-modal-actions">
                            <button className="tarot-action-btn tarot-action-shuffle" onClick={handleShuffle}>
                                <Shuffle size={22} />
                                <div className="tarot-action-text">
                                    <div className="tarot-action-title">{t('Shuffle the Deck')}</div>
                                    <div className="tarot-action-desc">{t('Reveal a new spread')}</div>
                                </div>
                            </button>
                            <button className="tarot-action-btn tarot-action-reveal" onClick={handleReveal}>
                                <Eye size={22} />
                                <div className="tarot-action-text">
                                    <div className="tarot-action-title">{t('Reveal My Card')}</div>
                                    <div className="tarot-action-desc">{t('Let fate choose for you')}</div>
                                </div>
                            </button>
                            <button className="tarot-action-btn tarot-action-learn" onClick={handleLearnTarot}>
                                <BookOpen size={22} />
                                <div className="tarot-action-text">
                                    <div className="tarot-action-title">{t('Learn Tarot')}</div>
                                    <div className="tarot-action-desc">{t('Understand the arcana')}</div>
                                </div>
                            </button>
                        </div>
                        <button className="tarot-modal-close" onClick={() => setShowTarotModal(false)}>
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom spacer for nav bar and ticker */}
            <div style={{ height: '90px' }}></div>

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
