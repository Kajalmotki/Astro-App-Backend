import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, CheckCircle, Activity, Info, BookOpen, X, Volume2, VolumeX } from 'lucide-react';
import './AsanaPlayWindow.css';

const AsanaPlayWindow = ({ asana, color = '#10b981', onClose, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [viewMode, setViewMode] = useState('steps'); // 'steps' or 'benefits'

    // Abstract premium placeholder based on chakra color
    const abstractBg = `radial-gradient(circle at 50% 30%, ${color}40 0%, #000000 70%)`;

    useEffect(() => {
        // Cleanup speech on unmount
        return () => window.speechSynthesis.cancel();
    }, []);

    const speak = (text) => {
        if (!window.speechSynthesis || isMuted) return;
        window.speechSynthesis.cancel(); // Stop current
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85; // Calming, slow pace
        utterance.pitch = 0.9;

        // Try to find a calming female or smooth voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Samantha'));
        if (preferred) utterance.voice = preferred;

        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            } else {
                // If starting fresh, speak the current step
                if (asana.steps && asana.steps[currentStep]) {
                    speak(asana.steps[currentStep]);
                } else if (asana.description) {
                    speak(asana.description);
                }
            }
            setIsPlaying(true);
        }
    };

    const toggleMute = () => {
        if (!isMuted && isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        }
        setIsMuted(!isMuted);
    };

    const handleNext = () => {
        if (asana.steps && currentStep < asana.steps.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            if (!isMuted) speak(asana.steps[nextStep]);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            if (!isMuted) speak(asana.steps[prevStep]);
        }
    };

    const handleComplete = () => {
        window.speechSynthesis.cancel();
        if (onComplete) onComplete();
        onClose();
    };

    // If asana is just a string (legacy fallback)
    if (typeof asana === 'string') {
        return (
            <div className="apw-overlay">
                <div className="apw-modal" style={{ background: abstractBg }}>
                    <button className="apw-close" onClick={onClose}><X size={24} /></button>
                    <div className="apw-content apw-legacy">
                        <h2>{asana}</h2>
                        <p>Follow your standard practice for this pose.</p>
                        <button className="apw-complete-btn" onClick={handleComplete}>
                            <CheckCircle size={20} /> Mark Complete
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const stepsLen = asana.steps?.length || 0;
    const progressPct = stepsLen > 1 ? (currentStep / (stepsLen - 1)) * 100 : 100;

    return (
        <div className="apw-overlay">
            <div className="apw-modal" style={{ '--theme-color': color }}>
                {/* Header Actions */}
                <div className="apw-top-bars">
                    <button className="apw-icon-btn" onClick={toggleMute}>
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button className="apw-close" onClick={handleComplete}><X size={24} /></button>
                </div>

                {/* Hero Top Section */}
                <div className="apw-hero" style={{ background: abstractBg }}>
                    <div className="apw-hero-icon">{asana.emoji || '🧘'}</div>
                    <div className="apw-hero-text">
                        <span className="apw-category-badge">{asana.category || 'practice'}</span>
                        <h2 className="apw-title">{asana.name}</h2>
                        <p className="apw-sanskrit">{asana.sanskrit || asana.name}</p>
                    </div>
                    {/* View Toggle */}
                    <div className="apw-view-toggles">
                        <button
                            className={`apw-toggle-btn ${viewMode === 'steps' ? 'active' : ''}`}
                            onClick={() => setViewMode('steps')}
                        >
                            <Play size={14} /> Practice
                        </button>
                        <button
                            className={`apw-toggle-btn ${viewMode === 'benefits' ? 'active' : ''}`}
                            onClick={() => setViewMode('benefits')}
                        >
                            <Activity size={14} /> Uplift
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="apw-body">
                    {viewMode === 'benefits' ? (
                        <div className="apw-benefits-view animate-fade-in">
                            <div className="apw-info-card">
                                <h4><Info size={16} /> Cosmic Connection</h4>
                                <p>{asana.why || asana.description}</p>
                            </div>

                            {asana.healthBenefits && (
                                <div className="apw-health-list">
                                    <h4><Activity size={16} /> Health Uplift</h4>
                                    <ul>
                                        {asana.healthBenefits.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {asana.source && (
                                <div className="apw-source-box">
                                    <BookOpen size={16} color={color} />
                                    <span>{asana.source}</span>
                                </div>
                            )}

                            {asana.contraindications && (
                                <p className="apw-warning">⚠ {asana.contraindications}</p>
                            )}
                        </div>
                    ) : (
                        <div className="apw-steps-view animate-fade-in">
                            {/* Step Text */}
                            <div className="apw-step-display">
                                <span className="apw-step-counter" style={{ color: color }}>
                                    Step {currentStep + 1} of {stepsLen}
                                </span>
                                <h3 className="apw-step-text">
                                    {asana.steps ? asana.steps[currentStep] : asana.description}
                                </h3>
                            </div>

                            {/* Audio Controls */}
                            <div className="apw-audio-controls">
                                <button
                                    className="apw-ctrl-btn"
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                >
                                    <ChevronLeft size={24} />
                                </button>

                                <button
                                    className="apw-play-large"
                                    style={{ background: color }}
                                    onClick={handlePlayPause}
                                >
                                    {isPlaying ? <Pause size={28} color="#000" /> : <Play size={28} color="#000" style={{ marginLeft: '4px' }} />}
                                </button>

                                <button
                                    className="apw-ctrl-btn"
                                    onClick={handleNext}
                                    disabled={currentStep === stepsLen - 1}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="apw-progress-bar">
                                <div className="apw-progress-fill" style={{ width: `${progressPct}%`, background: color }} />
                            </div>

                            {/* Mark Done */}
                            {currentStep === stepsLen - 1 && (
                                <button className="apw-complete-btn animate-pop" onClick={handleComplete}>
                                    <CheckCircle size={20} /> Complete Practice
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AsanaPlayWindow;
