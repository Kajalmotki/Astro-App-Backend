import React, { useState, useRef, useEffect } from 'react';
import './VirtualPooja.css';

const VirtualPooja = ({ isOpen, onClose }) => {
    const [selectedGod, setSelectedGod] = useState('shivling');
    const [isAbhishekActive, setIsAbhishekActive] = useState(false);
    const [flowersOffered, setFlowersOffered] = useState([]);
    const [isMantraPlaying, setIsMantraPlaying] = useState(false);
    const audioRef = useRef(null);
    const waterAudioRef = useRef(null);

    const gods = [
        { id: 'shivling', name: 'Shivling', image: '/images/shivling_mountains.png' },
        { id: 'ganesh', name: 'Lord Ganesh', image: '/images/shivling_mountains.png' },
        { id: 'krishna', name: 'Lord Krishna', image: '/images/shivling_mountains.png' },
        { id: 'hanuman', name: 'Lord Hanuman', image: '/images/shivling_mountains.png' }
    ];

    const currentGod = gods.find(g => g.id === selectedGod) || gods[0];

    // Handle Abhishek (water pouring)
    const handleAbhishek = () => {
        setIsAbhishekActive(true);
        // Play water sound if available
        if (waterAudioRef.current) {
            waterAudioRef.current.currentTime = 0;
            waterAudioRef.current.play().catch(() => { });
        }
        setTimeout(() => setIsAbhishekActive(false), 3000);
    };

    // Handle flower offering
    const handleOfferFlowers = () => {
        const newFlower = {
            id: Date.now(),
            left: 20 + Math.random() * 60,
            delay: Math.random() * 0.5
        };
        setFlowersOffered(prev => [...prev, newFlower]);

        // Remove flower after animation
        setTimeout(() => {
            setFlowersOffered(prev => prev.filter(f => f.id !== newFlower.id));
        }, 3000);
    };

    // Handle mantra play
    const handlePlayMantra = () => {
        if (audioRef.current) {
            if (isMantraPlaying) {
                audioRef.current.pause();
                setIsMantraPlaying(false);
            } else {
                audioRef.current.play().catch(() => { });
                setIsMantraPlaying(true);
            }
        }
    };

    // Handle audio end
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => setIsMantraPlaying(false);
            audio.addEventListener('ended', handleEnded);
            return () => audio.removeEventListener('ended', handleEnded);
        }
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="virtual-pooja-overlay" onClick={onClose}>
            <div className="virtual-pooja-modal" onClick={e => e.stopPropagation()}>
                <button className="pooja-close-btn" onClick={onClose}>×</button>

                <h2 className="pooja-title">🙏 Virtual Pooja</h2>

                {/* God Selection */}
                <div className="god-selection">
                    <label htmlFor="god-select">Select Deity:</label>
                    <select
                        id="god-select"
                        value={selectedGod}
                        onChange={(e) => setSelectedGod(e.target.value)}
                        className="god-select"
                    >
                        {gods.map(god => (
                            <option key={god.id} value={god.id}>{god.name}</option>
                        ))}
                    </select>
                </div>

                {/* Deity Image with Effects */}
                <div className="deity-container">
                    <div className={`deity-image-wrapper ${isAbhishekActive ? 'abhishek-active' : ''}`}>
                        <img
                            src={currentGod.image}
                            alt={currentGod.name}
                            className="deity-image"
                        />

                        {/* Water Abhishek Effect */}
                        {isAbhishekActive && (
                            <div className="abhishek-effect">
                                <div className="water-stream"></div>
                                <div className="water-stream delay-1"></div>
                                <div className="water-stream delay-2"></div>
                                <div className="water-splash"></div>
                            </div>
                        )}

                        {/* Flower Effects */}
                        {flowersOffered.map(flower => (
                            <div
                                key={flower.id}
                                className="flower-offering"
                                style={{
                                    left: `${flower.left}%`,
                                    animationDelay: `${flower.delay}s`
                                }}
                            >
                                🌸
                            </div>
                        ))}
                    </div>

                    <p className="deity-name">{currentGod.name}</p>
                </div>

                {/* Pooja Action Buttons */}
                <div className="pooja-actions">
                    <button
                        className={`pooja-btn abhishek-btn ${isAbhishekActive ? 'active' : ''}`}
                        onClick={handleAbhishek}
                        disabled={isAbhishekActive}
                    >
                        <span className="btn-icon">💧</span>
                        <span className="btn-label">Abhishek</span>
                        <span className="btn-sublabel">Pour Holy Water</span>
                    </button>

                    <button
                        className="pooja-btn flowers-btn"
                        onClick={handleOfferFlowers}
                    >
                        <span className="btn-icon">🌺</span>
                        <span className="btn-label">Offer Flowers</span>
                        <span className="btn-sublabel">Pushpanjali</span>
                    </button>

                    <button
                        className={`pooja-btn mantra-btn ${isMantraPlaying ? 'playing' : ''}`}
                        onClick={handlePlayMantra}
                    >
                        <span className="btn-icon">{isMantraPlaying ? '🔊' : '🕉️'}</span>
                        <span className="btn-label">{isMantraPlaying ? 'Stop Mantra' : 'ॐ नमः शिवाय'}</span>
                        <span className="btn-sublabel">Om Namah Shivay</span>
                    </button>
                </div>

                {/* Audio Elements */}
                <audio ref={audioRef} src="/audio/om-namah-shivay.mp3" preload="auto" />
                <audio ref={waterAudioRef} src="/audio/water-sound.mp3" preload="auto" />

                {/* Blessing Message */}
                <div className="blessing-message">
                    <p>🙏 May Lord Shiva bless you with peace, prosperity, and spiritual growth 🙏</p>
                </div>
            </div>
        </div>
    );
};

export default VirtualPooja;
