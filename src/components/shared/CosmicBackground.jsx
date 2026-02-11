import React, { useMemo } from 'react';
import './CosmicBackground.css';

const CosmicBackground = ({ variant = 'default' }) => {
    // Generate random stars at different depths
    const stars = useMemo(() => {
        const starArray = [];
        for (let i = 0; i < 100; i++) {
            starArray.push({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 3 + 1,
                delay: Math.random() * 5,
                duration: Math.random() * 3 + 2,
                depth: Math.floor(Math.random() * 3) + 1, // 1, 2, or 3
            });
        }
        return starArray;
    }, []);

    // Generate floating particles
    const particles = useMemo(() => {
        const particleArray = [];
        for (let i = 0; i < 30; i++) {
            particleArray.push({
                id: i,
                left: Math.random() * 100,
                size: Math.random() * 4 + 2,
                delay: Math.random() * 10,
                duration: Math.random() * 15 + 10,
            });
        }
        return particleArray;
    }, []);

    return (
        <div className={`cosmic-bg cosmic-bg--${variant}`}>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="cosmic-video-bg"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: -1
                }}
            >
                <source src="/videos/night_sky_timelapse.mp4" type="video/mp4" />
            </video>
            <div
                className="cosmic-video-overlay"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(3px)',
                    zIndex: 0
                }}
            ></div>

            {/* Keeping the glow for subtle effect */}
            <div className="center-glow" style={{ zIndex: 1, opacity: 0.3 }}></div>
        </div>
    );
};

export default CosmicBackground;
