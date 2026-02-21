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
