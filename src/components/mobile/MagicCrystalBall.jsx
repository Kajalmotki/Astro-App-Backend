import React, { useState, useRef, useEffect } from 'react';
import './MagicCrystalBall.css';
import { fortuneLines } from '../../data/fortunes';
import { motivationalQuotes } from '../../data/motivationalQuotes';

import { useLanguage } from '../../contexts/LanguageContext';

const MagicCrystalBall = () => {
    const { t } = useLanguage();
    const [isRevealed, setIsRevealed] = useState(false);
    const [fortune, setFortune] = useState("");
    const [isShaking, setIsShaking] = useState(false);
    const [showMist, setShowMist] = useState(false);
    const [quote, setQuote] = useState("");

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
            return;
        }

        setIsShaking(true);
        setShowMist(true);

        // Simulate reading time
        setTimeout(() => {
            const randomFortune = fortuneLines[Math.floor(Math.random() * fortuneLines.length)];
            setFortune(randomFortune);
            setIsShaking(false);
            setIsRevealed(true);

            // Hide mist after reveal
            setTimeout(() => setShowMist(false), 1000);
        }, 2000);
    };

    return (
        <div className="crystal-ball-container">
            {/* Curved Title */}
            <div className="crystal-ball-title-container">
                <svg width="220" height="50" viewBox="0 0 220 50" className="curved-title-svg">
                    <defs>
                        <path id="curvePath" d="M10,50 Q110,0 210,50" />
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFD700" />
                            <stop offset="50%" stopColor="#F0E68C" />
                            <stop offset="100%" stopColor="#FFD700" />
                        </linearGradient>
                    </defs>
                    <text>
                        <textPath href="#curvePath" startOffset="50%" textAnchor="middle" className="curved-title-text">
                            {t("Magic Crystal Ball")}
                        </textPath>
                    </text>
                </svg>
            </div>

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
                {/* Golden Stand/Base */}
                <div className="crystal-ball-stand"></div>
            </div>

            {/* Curved Quote Section */}
            <div className="crystal-ball-quote-container">
                <svg width="280" height="60" viewBox="0 0 280 60" className="curved-quote-svg">
                    <defs>
                        <path id="quoteCurvePath" d="M10,10 Q140,60 270,10" />
                    </defs>
                    <text>
                        <textPath href="#quoteCurvePath" startOffset="50%" textAnchor="middle" className="curved-quote-text">
                            "{quote}"
                        </textPath>
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
