import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, RotateCcw } from 'lucide-react';
import './TarotRevealPage.css';

const TarotRevealPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isRevealed, setIsRevealed] = useState(false);

    // Get card data from navigation state or fallback
    const cardData = location.state?.card;

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
                <h1 className="reveal-title">Your Reading</h1>
                <div className="spacer"></div>
            </div>

            <div className="reveal-content">
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
                            <span className="large-card-name">{cardData.name}</span>
                            {/* Decorative corners */}
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
                    {cardData.keywords && (
                        <div className="keywords-container">
                            {cardData.keywords.map((kw, i) => (
                                <span key={i} className="keyword-tag">{kw}</span>
                            ))}
                        </div>
                    )}
                    <div className="divider-line"></div>
                    <p className="revealed-card-meaning">{cardData.meaning}</p>
                </div>

                <div className={`reveal-actions ${isRevealed ? 'visible' : ''}`}>
                    <button className="action-btn secondary" onClick={handleBack}>
                        <RotateCcw size={18} />
                        <span>Draw Again</span>
                    </button>
                    <button className="action-btn primary" onClick={handleMajorArcana}>
                        <BookOpen size={18} />
                        <span>Major Arcana</span>
                    </button>
                </div>
            </div>

            {/* Decorative Fan at Bottom */}
            <div className="decorative-fan">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="fan-card"
                        style={{
                            '--index': i,
                            '--total': 12
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default TarotRevealPage;
