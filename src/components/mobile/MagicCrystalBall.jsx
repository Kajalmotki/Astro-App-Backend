import React, { useState, useRef, useEffect } from 'react';
import './MagicCrystalBall.css';
import { fortuneLines } from '../../data/fortunes';
import { motivationalQuotes } from '../../data/motivationalQuotes';

import { useLanguage } from '../../contexts/LanguageContext';

// Ad lines that orbit the crystal ball like Saturn rings
const AD_LINES = [
    { text: "👟 Nike's New Launch — Flat 40% Off!", color: '#ff6b00' },
    { text: "💎 Tanishq Akshaya Tritiya Collection is Live!", color: '#e6c200' },
    { text: "🧘 Premium Yoga Mat — Only ₹499 Today!", color: '#8b5cf6' },
    { text: "🌿 Forest Essentials — Buy 2 Get 1 Free", color: '#22c55e' },
    { text: "📱 iPhone 16 Pro — EMI Starts ₹2999/mo", color: '#3b82f6' },
    { text: "✨ Nykaa Summer Sale — Up to 50% Off!", color: '#ec4899' },
    { text: "🏋️ Cult.fit Annual Pass — ₹999 Only!", color: '#ef4444' },
    { text: "🍵 Organic India — Immunity Boosters 30% Off", color: '#16a34a' },
];

const MagicCrystalBall = () => {
    const { t } = useLanguage();
    const [isRevealed, setIsRevealed] = useState(false);
    const [fortune, setFortune] = useState("");
    const [isShaking, setIsShaking] = useState(false);
    const [showMist, setShowMist] = useState(false);
    const [quote, setQuote] = useState("");
    const [showAd, setShowAd] = useState(false);
    const [currentAd, setCurrentAd] = useState(null);
    const [adPhase, setAdPhase] = useState('idle'); // idle, orbiting, sparkle, done

    const videoRef = useRef(null);

    // Initial random fortune and quote
    useEffect(() => {
        setFortune(fortuneLines[Math.floor(Math.random() * fortuneLines.length)]);
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, []);

    const handleReveal = () => {
        if (isRevealed) {
            // Reset
            setIsRevealed(false);
            setFortune("");
            setAdPhase('idle');
            return;
        }

        // Pick a random ad
        const ad = AD_LINES[Math.floor(Math.random() * AD_LINES.length)];
        setCurrentAd(ad);

        setIsShaking(true);
        setShowMist(true);

        // Phase 1: After short shake, start the ad orbit
        setTimeout(() => {
            setShowAd(true);
            setAdPhase('orbiting');
        }, 400);

        // Phase 2: Ad orbit completes, sparkle burst
        setTimeout(() => {
            setAdPhase('sparkle');
        }, 3200); // orbit runs for ~2.8s

        // Phase 3: Sparkle fades, reveal fortune
        setTimeout(() => {
            setShowAd(false);
            setAdPhase('done');

            const randomFortune = fortuneLines[Math.floor(Math.random() * fortuneLines.length)];
            setFortune(randomFortune);
            setIsShaking(false);
            setIsRevealed(true);

            // Hide mist after reveal
            setTimeout(() => setShowMist(false), 1000);
        }, 4000);
    };

    return (
        <div className="crystal-ball-container">

            <div className={`crystal-ball-wrapper ${isShaking ? 'shaking' : ''}`} onClick={handleReveal}>
                <div className="crystal-ball-sphere">
                    {/* Video Background Layer */}
                    <div className="sphere-video-container">
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="sphere-video"
                        >
                            <source src="/videos/night_sky_timelapse.mp4" type="video/mp4" />
                        </video>
                        <div className="sphere-video-overlay"></div>
                    </div>

                    {/* Glass Effects */}
                    <div className="sphere-reflection"></div>
                    <div className="sphere-inner-glow"></div>
                    <div className="sphere-shine-spark"></div>

                    {/* Mist Effect */}
                    <div className={`sphere-mist ${showMist ? 'active' : ''}`}></div>

                    {/* Content Layer */}
                    <div className={`sphere-content ${isRevealed ? 'revealed' : ''}`}>
                        {isRevealed ? (
                            <p className="fortune-text">{fortune}</p>
                        ) : (
                            <div className="sphere-idle-content">
                            </div>
                        )}
                    </div>
                </div>

                {/* Saturn Ring Ad Orbit — OUTSIDE the sphere so it's not clipped */}
                {showAd && currentAd && (
                    <div className={`ad-ring-orbit ${adPhase}`}>
                        <div className="ad-ring-track">
                            <span
                                className="ad-ring-text"
                                style={{ '--ad-color': currentAd.color }}
                            >
                                {currentAd.text}
                            </span>
                            {/* Sparkle particles at the end */}
                            <div className="ad-sparkle-trail">
                                {[...Array(12)].map((_, i) => {
                                    const angle = (i * 30) * Math.PI / 180;
                                    const dist = 20 + Math.random() * 30;
                                    return (
                                        <span key={i} className="sparkle-particle" style={{
                                            '--delay': `${i * 0.06}s`,
                                            '--tx': `${Math.cos(angle) * dist}px`,
                                            '--ty': `${Math.sin(angle) * dist}px`,
                                            '--size': `${2 + Math.random() * 3}px`,
                                        }}></span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Golden Stand/Base */}
                <div className="crystal-ball-stand"></div>
            </div>

            {/* Curved Quote Section */}
            <div className="crystal-ball-quote-container">
                <svg width="300" height="80" viewBox="0 0 300 80" className="curved-quote-svg">
                    <defs>
                        <path id="quoteCurvePath" d="M10,20 Q150,80 290,20" fill="none" />
                    </defs>
                    <text>
                        {quote.length > 60 ? (
                            <>
                                <textPath href="#quoteCurvePath" startOffset="50%" textAnchor="middle" className="curved-quote-text" style={{ fontSize: '10px' }}>
                                    <tspan dy="-5">{quote.substring(0, Math.ceil(quote.length / 2)).trim()}</tspan>
                                </textPath>
                                <textPath href="#quoteCurvePath" startOffset="50%" textAnchor="middle" className="curved-quote-text" style={{ fontSize: '10px' }}>
                                    <tspan dy="12">{quote.substring(Math.ceil(quote.length / 2)).trim()}</tspan>
                                </textPath>
                            </>
                        ) : (
                            <textPath href="#quoteCurvePath" startOffset="50%" textAnchor="middle" className="curved-quote-text">
                                "{quote}"
                            </textPath>
                        )}
                    </text>
                </svg>
            </div>

            {isRevealed && (
                <button className="reset-ball-btn" onClick={handleReveal}>
                    {t("Ask Again")}
                </button>
            )}
        </div>
    );
};

export default MagicCrystalBall;
