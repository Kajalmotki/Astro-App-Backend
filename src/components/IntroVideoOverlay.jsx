import React, { useState, useEffect, useRef } from 'react';
import './IntroVideoOverlay.css';

const SCENES = [
    {
        id: 1,
        text: "Written in the stars, before you took a breath...\nYour map was drawn, defying life and death.",
        visual: "chart",
        voice: "Your journey begins with your Janma Kundli. It reveals the cosmic blueprint—your strengths, your weaknesses, and the karmic patterns you were born to master."
    },
    {
        id: 2,
        text: "Planets pull the strings, deep within your core...\nAwakening the energy, opening the door.",
        visual: "connection",
        voice: "But planets aren't just in the sky—they live inside you. A weak Mars becomes a blocked Root Chakra. A troubled Mercury clouds your Throat Chakra. Astrology is the diagnosis; Chakras are the symptoms."
    },
    {
        id: 3,
        text: "Move the body, heal the soul...\nAncient movements make you whole.",
        visual: "yoga",
        voice: "You don't need expensive gems to fix your fate. You simply need to move. Our custom Yoga Routines are the low-cost, high-impact remedy to strengthen your weak planets by activating their corresponding Chakras."
    },
    {
        id: 4,
        text: "Measure the change, see the power rise...\nA temple built before your very eyes.",
        visual: "bca",
        voice: "How do you know it's working? Our Body Composition Analysis tracks your physical transformation. As your body aligns with the Golden Ratio, your vessel becomes strong enough to hold higher cosmic energy."
    },
    {
        id: 5,
        text: "Star to Cell, Sky to Ground...\nIn AstroRevo, your true self is found.",
        visual: "holistic",
        voice: "AstroRevo. Understand your Fate. Heal your Energy. Build your Body. Complete the Loop."
    }
];

const IntroVideoOverlay = ({ onClose }) => {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const synthRef = useRef(window.speechSynthesis);
    const utteranceRef = useRef(null);

    // Initial check for speech synthesis support
    useEffect(() => {
        if (!window.speechSynthesis) {
            setSpeechSupported(false);
        }
    }, []);

    // Handle Scene Transition and Speech
    useEffect(() => {
        if (!isPlaying || !speechSupported) return;

        const scene = SCENES[currentSceneIndex];

        // Cancel any ongoing speech
        synthRef.current.cancel();

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(scene.voice);
        utterance.rate = 0.95; // Slightly slower for clarity
        utterance.pitch = 1.1; // Slightly feminine/higher pitch

        // Try to find a female voice
        const voices = synthRef.current.getVoices();
        const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google US English'));
        if (femaleVoice) utterance.voice = femaleVoice;

        utterance.onend = () => {
            if (currentSceneIndex < SCENES.length - 1) {
                // Auto-advance to next scene after speech ends
                setTimeout(() => setCurrentSceneIndex(prev => prev + 1), 1000); // 1s pause between scenes
            } else {
                // End of video loop
                setIsPlaying(false);
            }
        };

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);

        return () => {
            synthRef.current.cancel();
        };
    }, [currentSceneIndex, isPlaying, speechSupported]);


    const handlePlay = () => {
        setIsPlaying(true);
        setCurrentSceneIndex(0);
    };

    const handleStop = () => {
        setIsPlaying(false);
        synthRef.current.cancel();
    };

    // Render Scene Visuals (CSS Only since Images failed)
    const renderVisual = (visualType) => {
        switch (visualType) {
            case 'chart':
                return (
                    <div className="scene-visual cosmic-chart">
                        <div className="star-field"></div>
                        <div className="rotating-chart-icon">☸️</div>
                    </div>
                );
            case 'connection':
                return (
                    <div className="scene-visual connection">
                        <div className="planet-icon">🪐</div>
                        <div className="energy-beam"></div>
                        <div className="chakra-icon">🧘</div>
                    </div>
                );
            case 'yoga':
                return (
                    <div className="scene-visual yoga-action">
                        <div className="yoga-pose-icon">🤸</div>
                        <div className="chakra-glow-points">
                            <span className="c-point p1"></span>
                            <span className="c-point p2"></span>
                            <span className="c-point p3"></span>
                        </div>
                    </div>
                );
            case 'bca':
                return (
                    <div className="scene-visual bca-scan">
                        <div className="body-wireframe">🧍</div>
                        <div className="scanner-line"></div>
                        <div className="data-points">
                            <span>Ratio: 1.618</span>
                            <span>Vitality: 98%</span>
                        </div>
                    </div>
                );
            default: // holistic
                return (
                    <div className="scene-visual holistic">
                        <div className="aura-ring"></div>
                        <div className="meditation-icon">🧘‍♂️</div>
                        <div className="logo-text">AstroRevo</div>
                    </div>
                );
        }
    };

    if (!speechSupported) return null; // Or show error

    return (
        <div className="intro-video-overlay-container">
            <button className="close-btn" onClick={onClose}>×</button>

            <div className={`video-screen ${isPlaying ? 'playing' : 'paused'}`}>
                {isPlaying ? (
                    <>
                        {renderVisual(SCENES[currentSceneIndex].visual)}
                        <div className="lyrics-overlay">
                            {SCENES[currentSceneIndex].text.split('\n').map((line, i) => (
                                <p key={i} className={`lyric-line line-${i}`}>{line}</p>
                            ))}
                        </div>
                        <div className="audio-visualizer">
                            <span className="bar"></span><span className="bar"></span><span className="bar"></span>
                        </div>
                    </>
                ) : (
                    <div className="play-overlay" onClick={handlePlay}>
                        <div className="play-icon">▶</div>
                        <p>Watch "The Cosmic Loop"</p>
                    </div>
                )}
            </div>

            <div className="video-controls">
                {isPlaying && (
                    <button className="stop-btn" onClick={handleStop}>Stop</button>
                )}
            </div>
        </div>
    );
};

export default IntroVideoOverlay;
