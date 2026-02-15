import React, { useState, useRef, useEffect } from 'react';
import { useMusic } from '../contexts/MusicContext'; // Import Context
import '../App.css';

const CalmMusicPlayer = () => {
    // Use Global Context
    const { isPlaying, currentTrack, togglePlay, playTrack, tracks } = useMusic();

    // Local state for menu visibility only
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

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
        playTrack(track);
        setIsMenuOpen(false);
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
