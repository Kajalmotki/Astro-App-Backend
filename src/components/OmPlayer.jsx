import React, { useState, useRef, useEffect } from 'react';

const OmPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Initialize audio element
        audioRef.current = new Audio('/audio/om-namah-shivay.mp3'); // Updated to known path from previous task
        // Fallback if that failed, try root
        audioRef.current.onerror = () => {
            console.log("Audio load failed, trying alternate path");
            audioRef.current.src = '/om-432hz.mp3';
        };
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
                                <feGaussianBlur stdDeviation="3.5" result="blur" />
                                <feFlood floodColor="goldenrod" result="color" />
                                <feComposite in="color" in2="blur" operator="in" result="glow" />
                                <feMerge>
                                    <feMergeNode in="glow" />
                                    <feMergeNode in="glow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Om Symbol (ॐ) perfectly centered */}
                        <text
                            x="48"
                            y="54"
                            fontSize="65"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="url(#omGradient)"
                            filter="url(#omGlow)"
                            fontFamily="'A Marker Script', 'Permanent Marker', cursive, serif"
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
