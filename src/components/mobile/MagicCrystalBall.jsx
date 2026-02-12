import React, { useState, useRef, useEffect } from 'react';
import './MagicCrystalBall.css';
import { fortuneLines } from '../../data/fortunes';

const MagicCrystalBall = () => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [fortune, setFortune] = useState("");
    const [isShaking, setIsShaking] = useState(false);
    const [showMist, setShowMist] = useState(false);

    const videoRef = useRef(null);

    // Initial random fortune
    useEffect(() => {
        setFortune(fortuneLines[Math.floor(Math.random() * fortuneLines.length)]);
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
            <h2 className="crystal-ball-title">Daily Horoscope</h2>
            <p className="crystal-ball-subtitle">Tap the orb to reveal your destiny</p>

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

                    {/* Mist Effect */}
                    <div className={`sphere-mist ${showMist ? 'active' : ''}`}></div>

                    {/* Content Layer */}
                    <div className={`sphere-content ${isRevealed ? 'revealed' : ''}`}>
                        {isRevealed ? (
                            <p className="fortune-text">{fortune}</p>
                        ) : (
                            <div className="sphere-idle-content">
                                {/* Icon Removed per user request */}
                                <span className="tap-text">TAP TO REVEAL</span>
                            </div>
                        )}
                    </div>
                </div>
                {/* Golden Stand/Base */}
                <div className="crystal-ball-stand"></div>
            </div>

            {isRevealed && (
                <button className="reset-ball-btn" onClick={handleReveal}>
                    Ask Again
                </button>
            )}
        </div>
    );
};

export default MagicCrystalBall;
