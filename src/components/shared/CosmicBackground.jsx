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
            {/* Nebula gradient layers */}
            <div className="nebula-layer nebula-1"></div>
            <div className="nebula-layer nebula-2"></div>
            <div className="nebula-layer nebula-3"></div>

            {/* Stars at different depths */}
            <div className="stars-container">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className={`star depth-${star.depth}`}
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDelay: `${star.delay}s`,
                            animationDuration: `${star.duration}s`,
                        }}
                    />
                ))}
            </div>

            {/* Floating particles */}
            <div className="particles-container">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="floating-particle"
                        style={{
                            left: `${particle.left}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`,
                        }}
                    />
                ))}
            </div>

            {/* Central glow */}
            <div className="center-glow"></div>
        </div>
    );
};

export default CosmicBackground;
