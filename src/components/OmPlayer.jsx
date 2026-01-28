import React, { useState, useRef, useEffect } from 'react';

const OmPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Initialize audio element
        audioRef.current = new Audio('/om-432hz.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.6;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(err => console.log('Audio play failed:', err));
            setIsPlaying(true);
        }
    };

    return (
        <div className="om-player-container">
            <button
                className={`om-player-btn ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause Om Sound' : 'Play Om Sound'}
            >
                <div className="om-symbol-container">
                    <svg viewBox="0 0 100 100" className="om-symbol">
                        <defs>
                            <linearGradient id="omGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFD700" />
                                <stop offset="100%" stopColor="#FFA500" />
                            </linearGradient>
                            <filter id="omGlow">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Om Symbol (ॐ) stylized */}
                        <text
                            x="50"
                            y="65"
                            fontSize="60"
                            textAnchor="middle"
                            fill="url(#omGradient)"
                            filter="url(#omGlow)"
                            fontFamily="serif"
                            fontWeight="bold"
                        >
                            ॐ
                        </text>
                    </svg>
                </div>

                <span className="om-label">{isPlaying ? '432 Hz Playing' : 'Play Sacred Om'}</span>
            </button>
        </div>
    );
};

export default OmPlayer;
