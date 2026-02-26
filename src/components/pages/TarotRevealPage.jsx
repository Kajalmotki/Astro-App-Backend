import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, RotateCcw, Sparkles, Star, Heart, Zap, CheckCircle } from 'lucide-react';
import { getLocalTarotReading } from '../../services/localTarotService';
import { useAuth } from '../AuthModal';
import './TarotRevealPage.css';

const TarotRevealPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isRevealed, setIsRevealed] = useState(false);
    const [isReadingLoading, setIsReadingLoading] = useState(false);
    const [aiReading, setAiReading] = useState(null);
    const [error, setError] = useState(null);
    const [userQuestion] = useState("");

    const { card: cardData } = location.state || {};

    useEffect(() => {
        const timer = setTimeout(() => setIsRevealed(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleBack = () => navigate(-1);
    const handleMajorArcana = () => navigate('/mobile/major-arcana');
    const handleReset = () => { setAiReading(null); setError(null); setIsReadingLoading(false); };

    const handleRevealPrediction = async () => {
        setIsReadingLoading(true);
        setError(null);
        try {
            const userName = user?.displayName || "Seeker";
            const result = await getLocalTarotReading(userName, userQuestion, cardData.name, cardData.meaning, cardData);
            if (result) setAiReading(result);
            else throw new Error("No response");
        } catch (e) {
            setError("The spirits are quiet. Please try again.");
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


            <div className="reveal-content-scroll">
                {/* Animated Card */}
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
                            <div className="corner-decor top-left" />
                            <div className="corner-decor top-right" />
                            <div className="corner-decor bottom-left" />
                            <div className="corner-decor bottom-right" />
                        </div>
                    </div>
                </div>

                <div className={`reveal-text-container ${isRevealed ? 'visible' : ''}`}>
                    <h2 className="revealed-card-name">{cardData.name}</h2>

                    {/* Attributes */}
                    <div className="card-attributes">
                        {cardData.element && <span className="attribute-badge">{cardData.element}</span>}
                        {cardData.planet && <span className="attribute-badge">{cardData.planet}</span>}
                        {(cardData.keywords || []).map(kw => (
                            <span key={kw} className="attribute-badge attribute-kw">{kw}</span>
                        ))}
                    </div>

                    {/* INTERACTIVE SECTION */}
                    {!aiReading && !isReadingLoading ? (
                        <div className="prediction-input-area premium-glass-panel">
                            <p className="revealed-card-meaning">{cardData.meaning}</p>
                            <button className="reveal-prediction-btn" onClick={handleRevealPrediction}>
                                <Sparkles size={18} />
                                <span>Reveal Deep Reading</span>
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
                        <div className="ai-reading-result">

                            {/* Verdict Banner */}
                            {(aiReading.yes_no_verdict || aiReading.verdict_phrase) && (
                                <div className="verdict-banner" data-verdict={(aiReading.yes_no_verdict || "uncertain").toLowerCase()}>
                                    <span className="verdict-label">The Answer is</span>
                                    <span className="verdict-value">{aiReading.verdict_phrase || aiReading.yes_no_verdict}</span>
                                </div>
                            )}

                            {/* Energy Badge */}
                            <div className="emotional-context">
                                <span className="context-label">Energy Detected:</span> {aiReading.emotion_analysis}
                            </div>

                            {/* Deep Reading */}
                            <div className="reading-section">
                                <div className="reading-section-header">
                                    <Star size={16} color="#FFD700" />
                                    <span>Your Cosmic Reading</span>
                                </div>
                                <div className="reading-section-body">
                                    {(aiReading.deep_reading || aiReading.reading).split('\n\n').map((para, i) => (
                                        <p key={i} className="reading-paragraph">{para}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Spiritual Insight */}
                            {aiReading.spiritual_insight && (
                                <div className="reading-section reading-section--spiritual">
                                    <div className="reading-section-header">
                                        <Zap size={16} color="#c084fc" />
                                        <span>Spiritual Insight</span>
                                    </div>
                                    <div className="reading-section-body">
                                        <p className="reading-paragraph">{aiReading.spiritual_insight}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Steps */}
                            {aiReading.action_steps && aiReading.action_steps.length > 0 && (
                                <div className="reading-section reading-section--actions">
                                    <div className="reading-section-header">
                                        <CheckCircle size={16} color="#34d399" />
                                        <span>Sacred Action Steps</span>
                                    </div>
                                    <ol className="action-steps-list">
                                        {aiReading.action_steps.map((step, i) => (
                                            <li key={i} className="action-step-item">
                                                <span className="step-number">{i + 1}</span>
                                                <span className="step-text">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {/* Affirmation */}
                            {aiReading.affirmation && (
                                <div className="reading-section reading-section--affirmation">
                                    <div className="reading-section-header">
                                        <Heart size={16} color="#f472b6" />
                                        <span>Your Affirmation</span>
                                    </div>
                                    <blockquote className="affirmation-text">
                                        "{aiReading.affirmation}"
                                    </blockquote>
                                </div>
                            )}

                            {/* Key Advice */}
                            <div className="key-advice-box">
                                <strong style={{ color: '#FFD700', display: 'block', marginBottom: '5px' }}>Cosmic Guidance:</strong>
                                {aiReading.key_advice}
                            </div>

                            <button className="action-btn secondary full-width" onClick={handleReset}
                                style={{ marginTop: '15px', width: '100%', justifyContent: 'center' }}>
                                <RotateCcw size={16} />
                                <span>Read Again</span>
                            </button>
                        </div>
                    )}

                    {error && <p style={{ color: '#f87171', textAlign: 'center', marginTop: '12px' }}>{error}</p>}
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
