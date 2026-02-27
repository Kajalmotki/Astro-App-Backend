import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './WhyAstroRevo.css';

const SCENES = [
    {
        id: 1,
        text: "Your Janma Kundli is your cosmic blueprint.\nIt maps the exact positions of planets at your birth.\nEach planet's strength or weakness shapes your destiny.\nThis is where your journey begins.",
        visual: "chart",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1080&q=80", // Constellation/Star map
        voice: "Your Janma Kundli is your cosmic blueprint. It maps the exact positions of planets at your birth. Each planet's strength or weakness shapes your destiny. This is where your journey begins."
    },
    {
        id: 2,
        text: "Planets are not just celestial bodies.\nThey are energy centers within you.\nSun governs your core... Mars your foundation...\nMoon your emotions... Mercury your expression... Jupiter your wisdom.",
        visual: "connection",
        image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1080&q=80", // Meditation/Energy
        voice: "Planets are not just celestial bodies. They are energy centers within you. Sun governs your core... Mars your foundation... Moon your emotions... Mercury your expression... Jupiter your wisdom."
    },
    {
        id: 3,
        text: "When a planet is weak... its chakra becomes blocked.\nBlocked Root Chakra? Weak Mars.\nBlocked Throat Chakra? Troubled Mercury.\nYour energy cannot flow... and you feel stuck.",
        visual: "kundalini",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1080&q=80", // Chakra/Energy body
        voice: "When a planet is weak... its chakra becomes blocked. Blocked Root Chakra? Weak Mars. Blocked Throat Chakra? Troubled Mercury. Your energy cannot flow... and you feel stuck."
    },
    {
        id: 4,
        text: "Kundalini is your dormant power.\nCoiled at the base of your spine... waiting to rise.\nWhen chakras open... Kundalini awakens.\nThis is the key to transformation.",
        visual: "kundalini_rising",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1080&q=80", // Sunrise/Energy rising
        voice: "Kundalini is your dormant power. Coiled at the base of your spine... waiting to rise. When chakras open... Kundalini awakens. This is the key to transformation."
    },
    {
        id: 5,
        text: "The remedy is Yoga.\nNot generic routines... but planetary-specific asanas.\nWarrior Pose for Mars... Shoulder Stand for Mercury...\nFish Pose for Moon... Sun Salutations for the Sun.",
        visual: "yoga",
        image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=1080&q=80", // Yoga practice silhouette
        voice: "The remedy is Yoga. Not generic routines... but planetary specific asanas. Warrior Pose for Mars... Shoulder Stand for Mercury... Fish Pose for Moon... Sun Salutations for the Sun."
    },
    {
        id: 6,
        text: "As you practice daily... your body transforms.\nMuscles grow... fat melts... posture aligns.\nThis is not vanity... this is vessel preparation.\nA strong body can hold more cosmic energy.",
        visual: "transformation",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1080&q=80", // Fitness/Strength
        voice: "As you practice daily... your body transforms. Muscles grow... fat melts... posture aligns. This is not vanity... this is vessel preparation. A strong body can hold more cosmic energy."
    },
    {
        id: 7,
        text: "Track your progress with your 21-Day Yoga Plan.\nMuscle mass... body fat... metabolic age.\nAs you approach the Golden Ratio...\nyou become capable of holding divine energy.",
        visual: "bca",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1080&q=80", // Scientific/Data visualization
        voice: "Track your progress with your 21 Day Yoga Plan. Muscle mass... body fat... metabolic age. As you approach the Golden Ratio... you become capable of holding divine energy."
    },
    {
        id: 8,
        text: "This is the Cosmic Loop.\nKundli reveals weakness... Planets show blocked chakras...\nYoga awakens Kundalini... Practice builds the Body...\nStrong Body holds more energy... and the cycle deepens.",
        visual: "loop",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1080&q=80", // Circular galaxy/Cosmic loop
        voice: "This is the Cosmic Loop. Kundli reveals weakness... Planets show blocked chakras... Yoga awakens Kundalini... Practice builds the Body... Strong Body holds more energy... and the cycle deepens."
    },
    {
        id: 9,
        text: "Your Simple Remedies:\n21-Day Planetary Yoga Challenge.\nSurya Namaskar at sunrise.\nChandra meditation at moonrise.\nPlanetary fasting on weak planet days.\nNo gems needed... just dedication.",
        visual: "remedies",
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1080&q=80", // Peaceful meditation/Practice
        voice: "Your Simple Remedies. Twenty one Day Planetary Yoga Challenge. Surya Namaskar at sunrise. Chandra meditation at moonrise. Planetary fasting on weak planet days. No gems needed... just dedication."
    }
];

const WhyAstroRevo = ({ onClose, startMaximized = false, isHidden = false }) => {
    const { t } = useLanguage();
    const [isMaximized, setIsMaximized] = useState(startMaximized);
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

    // Handle Maximized State (Reset on minimize)
    useEffect(() => {
        if (!isMaximized) {
            handleStop();
        }
    }, [isMaximized]);

    // Handle Scene Transition and Speech
    useEffect(() => {
        if (!isPlaying || !speechSupported || !isMaximized) return;

        const scene = SCENES[currentSceneIndex];

        // Cancel any ongoing speech
        synthRef.current.cancel();

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(scene.voice);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        // Try to find appropriate voice
        const voices = synthRef.current.getVoices();

        // English Logic (Female priority)
        const preferredVoices = [
            'Google US English',
            'Microsoft Zira',
            'Samantha',
            'Karen',
            'Moira',
            'Tessa',
            'Veena',
            'Fiona'
        ];
        let femaleVoice = voices.find(v => preferredVoices.some(name => v.name.includes(name)));
        if (!femaleVoice) {
            femaleVoice = voices.find(v => v.name.includes('Female'));
        }
        if (femaleVoice) {
            utterance.voice = femaleVoice;
            if (femaleVoice.name.includes('Zira')) utterance.pitch = 0.95;
            if (femaleVoice.name.includes('Google')) utterance.pitch = 1.0;
        }

        utterance.onend = () => {
            if (currentSceneIndex < SCENES.length - 1) {
                // Auto-advance to next scene after speech ends
                setTimeout(() => setCurrentSceneIndex(prev => prev + 1), 1000);
            } else {
                // End of presentation
                setIsPlaying(false);
            }
        };

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);

        return () => {
            synthRef.current.cancel();
        };
    }, [currentSceneIndex, isPlaying, speechSupported, isMaximized]);


    const handlePlay = () => {
        setIsPlaying(true);
        setCurrentSceneIndex(0);
    };

    const handleStop = () => {
        setIsPlaying(false);
        synthRef.current.cancel();
    };

    const handleMaximize = () => {
        setIsMaximized(true);
    };

    const handleMinimize = (e) => {
        e.stopPropagation();
        setIsMaximized(false);
    };

    // Render Scene Visuals (Images)
    const renderVisual = (scene) => {
        return (
            <div className="scene-visual-container">
                <img
                    src={scene.image}
                    alt={scene.visual}
                    className="scene-cinematic-image"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?auto=format&fit=crop&w=1080&q=80'; }}
                />
                <div className="visual-overlay-gradient"></div>
            </div>
        );
    };

    if (!speechSupported) return null;

    // Small Button State (only show if not starting maximized)
    if (!isMaximized && !startMaximized) {
        return (
            <div className={`why-astrorevo-trigger ${isHidden ? 'hidden' : ''}`} onClick={handleMaximize}>
                <div className="trigger-icon">▶</div>
                <span className="trigger-text">{t('Why AstroRevo')}</span>
            </div>
        );
    }

    // If startMaximized is true but isMaximized is false, don't render anything
    if (!isMaximized && startMaximized) {
        return null;
    }

    // Maximized Modal State
    return (
        <div className="why-astrorevo-overlay-container maximized">
            <button className="close-btn" onClick={handleMinimize}>×</button>

            <div className={`video-screen ${isPlaying ? 'playing' : 'paused'}`}>
                {isPlaying ? (
                    <>
                        {renderVisual(SCENES[currentSceneIndex])}
                        <div className="lyrics-overlay-compact">
                            {SCENES[currentSceneIndex].text.split('\n').map((line, i) => (
                                <p key={i} className={`lyric-line-compact`}>{line}</p>
                            ))}
                        </div>
                        <div className="audio-visualizer">
                            <span className="bar"></span><span className="bar"></span><span className="bar"></span>
                        </div>
                    </>
                ) : (
                    <>
                        {renderVisual(SCENES[0])}
                        <div className="play-overlay" onClick={handlePlay}>
                            <div className="play-icon">▶</div>
                            <p>{t('Why AstroRevo?')}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="video-controls">
                {isPlaying && (
                    <button className="stop-btn" onClick={handleStop}>{t('Stop')}</button>
                )}
            </div>
        </div>
    );
};

export default WhyAstroRevo;
