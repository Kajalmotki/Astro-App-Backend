import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, RotateCcw, Sparkles, Send } from 'lucide-react';
import { getLocalTarotReading } from '../../services/localTarotService';
import { useAuth } from '../AuthModal';
import './TarotRevealPage.css';

const TarotRevealPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isRevealed, setIsRevealed] = useState(false);

    // New State for Q&A Flow
    const [userQuestion, setUserQuestion] = useState("");
    const [isReadingLoading, setIsReadingLoading] = useState(false);
    const [aiReading, setAiReading] = useState(null);
    const [error, setError] = useState(null);

    // Get card data from navigation state or fallback
    const { card: cardData } = location.state || {};

    useEffect(() => {
        // Trigger reveal animation on mount
        const timer = setTimeout(() => {
            setIsRevealed(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const handleMajorArcana = () => {
        navigate('/mobile/major-arcana');
    };

    const handleReset = () => {
        setAiReading(null);
        setError(null);
        setUserQuestion("");
        setIsReadingLoading(false);
    };

    const handleRevealPrediction = async () => {
        // if (!userQuestion.trim()) return; // Removed check for generic reading

        setIsReadingLoading(true);
        setError(null);

        try {
            const userName = user?.displayName || "Seeker";
            console.log("Calling Local Tarot Service...");
            // Use local service now
            const result = await getLocalTarotReading(userName, userQuestion, cardData.name, cardData.meaning);
            console.log("Prediction Result:", result);

            if (result) {
                setAiReading(result);
            } else {
                throw new Error("No response received");
            }
        } catch (error) {
            console.error("Failed to get reading", error);
            setError("The spirits are confusing. Please try again.");
        } finally {
            setIsReadingLoading(false);
        }
    };

    if (!cardData) {
        return (
            <div className="tarot-reveal-page error">
                <p>No card selected.</p>
                <button onClick={handleBack}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="tarot-reveal-page">
            <div className="reveal-header">
                <button className="icon-btn back-btn" onClick={handleBack}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="reveal-title">Your Card</h1>
            </div>

            <div className="reveal-content-scroll">
                <div className={`large-card-container ${isRevealed ? 'revealed' : ''}`}>
                    <div className="large-card-inner">
                        <div className="large-card-back">
                            <div className="card-back-pattern">
                                <span className="card-back-symbol">☽</span>
                            </div>
                        </div>
                        <div className="large-card-front">
                            <span className="large-card-numeral">{cardData.numeral}</span>
                            <span className="large-card-emoji">{cardData.emoji}</span>
                            <span className="large-card-name" style={{ fontFamily: 'Cinzel, serif', fontSize: '18px', color: '#FFD700', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{cardData.name}</span>
                            <div className="corner-decor top-left"></div>
                            <div className="corner-decor top-right"></div>
                            <div className="corner-decor bottom-left"></div>
                            <div className="corner-decor bottom-right"></div>
                        </div>
                    </div>
                </div>

                <div className={`reveal-text-container ${isRevealed ? 'visible' : ''}`}>
                    <h2 className="revealed-card-name">{cardData.name}</h2>

                    <div className="card-attributes">
                        {cardData.element && <span className="attribute-badge">{cardData.element}</span>}
                        {cardData.planet && <span className="attribute-badge">{cardData.planet}</span>}
                    </div>

                    {/* INTERACTIVE SECTION */}
                    {!aiReading && !isReadingLoading ? (
                        <div className="prediction-input-area premium-glass-panel">
                            <p className="revealed-card-meaning" style={{ marginBottom: '20px' }}>{cardData.meaning}</p>

                            <button
                                className="reveal-prediction-btn"
                                onClick={handleRevealPrediction}
                            >
                                <Sparkles size={18} />
                                <span>Reveal Prediction</span>
                            </button>
                        </div>
                    ) : isReadingLoading ? (
                        <div className="ai-loading-container">
                            <div className="mystic-loader">
                                <Sparkles className="ai-sparkle-icon" size={32} color="#FFD700" />
                            </div>
                            <p className="loading-text">Channeling Cosmic Wisdom...</p>
                        </div>
                    ) : (
                        <div className="ai-reading-result premium-glass-panel">
                            <div className="user-question-box">
                                <p className="user-question-label">Your Query</p>
                                <p className="user-question-text">"{userQuestion}"</p>
                            </div>

                            {/* YES / NO VERDICT */}
                            {(aiReading.yes_no_verdict || aiReading.verdict_phrase) && (
                                <div className="verdict-banner" data-verdict={(aiReading.yes_no_verdict || "uncertain").toLowerCase()}>
                                    <span className="verdict-label">The Answer is</span>
                                    <span className="verdict-value">{aiReading.verdict_phrase || aiReading.yes_no_verdict}</span>
                                </div>
                            )}

                            <div className="emotional-context">
                                <span className="context-label">Energy Detected:</span> {aiReading.emotion_analysis}
                            </div>

                            <div className="reading-content">
                                <p className="ai-reading-text">{aiReading.reading}</p>
                            </div>

                            <div className="key-advice-box">
                                <strong style={{ color: '#FFD700', display: 'block', marginBottom: '5px' }}>Cosmic Guidance:</strong>
                                {aiReading.key_advice}
                            </div>

                            <button className="action-btn secondary full-width" onClick={handleReset} style={{ marginTop: '15px', width: '100%', justifyContent: 'center' }}>
                                <RotateCcw size={16} />
                                <span>Ask Another Question</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className={`reveal-actions ${isRevealed ? 'visible' : ''}`}>
                    <button className="action-btn secondary" onClick={handleBack}>
                        <RotateCcw size={18} />
                        <span>Draw New Card</span>
                    </button>
                    <button className="action-btn primary" onClick={handleMajorArcana}>
                        <BookOpen size={18} />
                        <span>All Cards</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TarotRevealPage;
