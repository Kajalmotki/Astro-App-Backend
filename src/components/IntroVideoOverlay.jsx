import React, { useState, useEffect, useRef } from 'react';
import './IntroVideoOverlay.css';

const SCENES = [
    {
        id: 1,
        text: "Your journey begins... with your Janma Kundli.\nIt reveals the cosmic blueprint... your strengths, your weaknesses...\nand the karmic patterns you were born to master.",
        visual: "chart",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1080&q=80", // Starry Night / Galaxy (Reliable)
        voice: "Your journey begins... with your Janma Kundli. It reveals the cosmic blueprint... your strengths... your weaknesses... and the karmic patterns... you were born to master."
    },
    {
        id: 2,
        text: "But planets aren't just in the sky... they live inside you.\nA weak Mars becomes a blocked Root Chakra.\nA troubled Mercury clouds your Throat Chakra.\nAstrology is the diagnosis... Chakras are the symptoms.",
        visual: "connection",
        image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1080&q=80", // Yoga Silhouette Sunset (Reliable)
        voice: "But planets aren't just in the sky... they live inside you. A weak Mars... becomes a blocked Root Chakra. A troubled Mercury... clouds your Throat Chakra. Astrology is the diagnosis... Chakras... are the symptoms."
    },
    {
        id: 3,
        text: "You don't need expensive gems to fix your fate.\nYou simply... need to move.\nOur custom Yoga Routines are the remedy...\nto strengthen your weak planets by activating their Chakras.",
        visual: "yoga",
        image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1080&q=80", // Yoga Pose Indoors (Reliable)
        voice: "You don't need expensive gems to fix your fate. You simply... need to move. Our custom Yoga Routines are the low-cost... high-impact remedy... to strengthen your weak planets... by activating their corresponding Chakras."
    },
    {
        id: 4,
        text: "How do you know it's working?\nOur Body Composition Analysis tracks your physical transformation.\nAs your body aligns with the Golden Ratio...\nyour vessel becomes strong enough to hold higher cosmic energy.",
        visual: "bca",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1080&q=80", // Science / Lab / Analytical (Reliable)
        voice: "How do you know it's working? Our Body Composition Analysis... tracks your physical transformation. As your body aligns with the Golden Ratio... your vessel becomes strong enough... to hold higher... cosmic energy."
    },
    {
        id: 5,
        text: "AstroRevo.\nUnderstand your Fate.\nHeal your Energy.\nBuild your Body.\nComplete... the Loop.",
        visual: "holistic",
        image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1080&q=80", // Galaxy Gradient / Loop (Reliable)
        voice: "AstroRevo. Understand your Fate. Heal your Energy. Build your Body. Complete... the Loop."
    }
];

const IntroVideoOverlay = ({ onClose, startMaximized = false, isHidden = false }) => {
    const [isMaximized, setIsMaximized] = useState(startMaximized); // Default to small button unless startMaximized is true
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
                // End of video loop
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
        // We do not call onClose (unmount) unless user explicitly wants to remove it from DOM entirely,
        // but for this interaction pattern, we just minimize back to button.
        // If "onClose" is passed from parent intending to unmount, we can call it too.
        // For now, let's keep it mounted as a button.
    };

    // Render Scene Visuals (Images)
    const renderVisual = (scene) => {
        return (
            <div className="scene-visual-container">
                <img
                    src={scene.image}
                    alt={scene.visual}
                    className="scene-cinematic-image"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?auto=format&fit=crop&w=1080&q=80'; }} // Fallback
                />
                <div className="visual-overlay-gradient"></div>
            </div>
        );
    };

    if (!speechSupported) return null;

    // Small Button State (only show if not starting maximized)
    if (!isMaximized && !startMaximized) {
        return (
            <div className={`intro-video-trigger ${isHidden ? 'hidden' : ''}`} onClick={handleMaximize}>
                <div className="trigger-icon">▶</div>
                <span className="trigger-text">Cosmic Loop</span>
            </div>
        );
    }

    // If startMaximized is true but isMaximized is false, don't render anything
    if (!isMaximized && startMaximized) {
        return null;
    }

    // Maximized Modal State
    return (
        <div className="intro-video-overlay-container maximized">
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
                        {/* Show First Scene Background logic */}
                        {renderVisual(SCENES[0])}
                        <div className="play-overlay" onClick={handlePlay}>
                            <div className="play-icon">▶</div>
                            <p>Watch "The Cosmic Loop"</p>
                        </div>
                    </>
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
