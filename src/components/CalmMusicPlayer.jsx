import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

const tracks = [
    { id: 'om', name: 'Om Mantra', icon: '🕉️', src: '/audio/om-namah-shivay.mp3' },
    { id: 'cosmic', name: 'Cosmic 432Hz', icon: '✨', src: '/om-432hz.mp3' },
    { id: 'rain', name: 'Gentle Rain', icon: '🌧️', src: '/audio/rain.mp3' },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊', src: '/audio/ocean.mp3' },
    { id: 'bowl', name: 'Singing Bowl', icon: '🔔', src: '/audio/tibetan-bowl.mp3' },
    { id: 'forest', name: 'Forest Birds', icon: '🐦', src: '/audio/forest.mp3' },
    { id: 'night', name: 'Night Crickets', icon: '🦗', src: '/audio/night.mp3' },
    { id: 'flute', name: 'Deep Flute', icon: '🎍', src: '/audio/flute.mp3' }
];

const CalmMusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(tracks[0]); // Default to Om Mantra (first track)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const audioRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio(currentTrack.src);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        // Handle error if file doesn't exist
        audioRef.current.onerror = () => {
            console.log(`Audio missing for ${currentTrack.name}, pausing.`);
            setIsPlaying(false);
            // Optional: Alert user or show UI state
        };

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Change track effect
    useEffect(() => {
        if (!audioRef.current) return;

        const wasPlaying = isPlaying;
        audioRef.current.pause();
        audioRef.current.src = currentTrack.src;

        if (wasPlaying) {
            audioRef.current.play().catch(e => console.error(e));
        }
    }, [currentTrack]);

    // Handle toggle play
    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => {
                console.error("Play failed", e);
                // Fallback logic could go here
            });
        }
        setIsPlaying(!isPlaying);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChangeTrack = (track) => {
        setCurrentTrack(track);
        setIsMenuOpen(false);
        if (!isPlaying) {
            // Optional: Auto-play on track change? Let's stick to manual for now or auto if user wants
            // But usually better to just set track. User hits play.
            // Actually, implies user wants to hear it. Let's auto-play if they select explicitly.
            setIsPlaying(true);
            setTimeout(() => { // slight delay to ensure src update
                if (audioRef.current) audioRef.current.play().catch(e => console.error(e));
            }, 50);
        }
    };

    return (
        <div className="calm-player-container" ref={menuRef}>
            <button
                className={`calm-player-btn ${isPlaying ? 'playing' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="Calm Music"
            >
                <div className="music-icon-wrapper">
                    {/* Musical Note Icon or Current Track Icon */}
                    <span className="player-icon">{isPlaying ? currentTrack.icon : '🎵'}</span>
                    {isPlaying && <div className="ripple-animation"></div>}
                </div>
            </button>

            {isMenuOpen && (
                <div className="calm-player-menu">
                    <div className="menu-header">
                        <span>Calm Sounds</span>
                        <button
                            className="play-toggle-small"
                            onClick={(e) => {
                                e.stopPropagation();
                                togglePlay();
                            }}
                        >
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>
                    </div>
                    <div className="track-list">
                        {tracks.map(track => (
                            <button
                                key={track.id}
                                className={`track-item ${currentTrack.id === track.id ? 'active' : ''}`}
                                onClick={() => handleChangeTrack(track)}
                            >
                                <span className="track-icon">{track.icon}</span>
                                <span className="track-name">{track.name}</span>
                                {currentTrack.id === track.id && isPlaying && <span className="playing-dot">●</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalmMusicPlayer;
