import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
// We will use the generated image here. Assuming it will be placed in /images or imported.
// For now, I'll use a placeholder path that we should ensure exists or update after generation.
// The generate_image tool saves to artifacts, I will need to move it or user will need to confirm path.
// I'll assume standard /images/white_lotus_opening.png for the code, and ensure I move the artifact there.

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Total splash duration: 3.5 seconds
        // 0-0.5s: Fade In
        // 0.5s-2.5s: Static/Pulse
        // 2.5s-3.5s: Fade Out

        const fadeOutTimer = setTimeout(() => {
            setIsFading(true);
        }, 2500); // Start fading out at 2.5s

        const removeTimer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
        }, 3500); // Remove from DOM at 3.5s

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`splash-screen ${isFading ? 'fade-out' : ''}`}>
            <div className="rain-container">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="rain-drop" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${0.5 + Math.random()}s`
                    }}></div>
                ))}
            </div>
            <div className="splash-content">
                <div className="lotus-glow-container">
                    <img
                        src="/src/assets/white_lotus_rain_splash.svg"
                        alt="AstroRevo"
                        className="splash-lotus"
                    />
                    <div className="fallback-text" style={{ display: 'none', color: '#fff', fontSize: '2rem' }}>🪷</div>
                </div>
                <h1 className="splash-title">AstroRevo</h1>
                <p className="splash-subtitle">Ancient Wisdom. Instant Clarity.</p>
            </div>
        </div>
    );
};

export default SplashScreen;
