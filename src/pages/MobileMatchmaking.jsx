import React, { useState } from 'react';
import BirthDetailsForm from '../components/BirthDetailsForm';
import './MobileHome.css'; // Reusing global mobile styles
import './Matchmaking.css'; // Specific styles
import { Heart, CheckCircle, AlertTriangle, ChevronLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { motivationalQuotes } from '../data/motivationalQuotes';

const MobileMatchmaking = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('boy_input'); // boy_input, girl_input, loading, result
    const [boyData, setBoyData] = useState(null);
    const [girlData, setGirlData] = useState(null);
    const [quote, setQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

    const changeQuote = () => {
        let newQuote;
        do {
            newQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        } while (newQuote === quote);
        setQuote(newQuote);
    };

    const handleBoySubmit = (data) => {
        setBoyData(data);
        setStep('girl_input');
    };

    const handleGirlSubmit = (data) => {
        setGirlData(data);
        setStep('loading');
        setTimeout(() => setStep('result'), 2500);
    };

    return (
        <div className="mobile-page-container bg-cosmic">
            <header className="page-header-simple quote-header" onClick={changeQuote}>
                <p className="motivational-quote">"{quote.text}"</p>
                <span className="quote-author">- {quote.author}</span>
            </header>

            <main className="content-area">
                {/* Progress */}
                {step !== 'loading' && step !== 'result' && (
                    <div className="match-progress">
                        <div className={`step-dot ${step === 'boy_input' ? 'active' : 'completed'}`}>1</div>
                        <div className="step-line"></div>
                        <div className={`step-dot ${step === 'girl_input' ? 'active' : ''}`}>2</div>
                    </div>
                )}

                {step === 'boy_input' && (
                    <div className="form-slide-view">
                        <div className="form-header">
                            <h2>Boy's Details</h2>
                            <p>Enter details for the groom to begin compatibility check.</p>
                        </div>
                        <div className="glass-panel form-panel">
                            <BirthDetailsForm onSubmit={handleBoySubmit} title="" submitLabel="Next: Girl's Details" />
                        </div>
                    </div>
                )}

                {step === 'girl_input' && (
                    <div className="form-slide-view">
                        <div className="form-header">
                            <h2>Girl's Details</h2>
                            <p>Enter details for the bride to match with {boyData?.name}.</p>
                        </div>
                        <div className="glass-panel form-panel">
                            <BirthDetailsForm onSubmit={handleGirlSubmit} title="" submitLabel="Analyze Compatibility" />
                        </div>
                    </div>
                )}

                {step === 'loading' && (
                    <div className="loading-view centered">
                        <div className="match-loader">
                            <Heart size={64} className="heart-pulse-icon" />
                            <div className="orbit-ring"></div>
                        </div>
                        <h3>Aligning Stars...</h3>
                        <p>Calculating Gunas, Doshas, and Planetary Harmony</p>
                    </div>
                )}

                {step === 'result' && (
                    <div className="match-result-view">
                        <div className="match-summary-card glass-panel">
                            <div className="couple-names">
                                <span className="name">{boyData?.name}</span>
                                <Heart size={20} className="heart-icon-small" fill="#ef4444" color="#ef4444" />
                                <span className="name">{girlData?.name}</span>
                            </div>

                            <div className="score-circle-container">
                                <svg viewBox="0 0 100 100" className="score-svg">
                                    <circle cx="50" cy="50" r="45" className="score-bg" />
                                    <circle cx="50" cy="50" r="45" className="score-progress" strokeDasharray="283" strokeDashoffset="50" />
                                </svg>
                                <div className="score-text">
                                    <span className="score-val">28.5</span>
                                    <span className="score-total">/ 36</span>
                                </div>
                            </div>

                            <div className="verdict-badge success">
                                <CheckCircle size={16} /> Excellent Match
                            </div>
                        </div>

                        <h3 className="section-heading">Detailed Guna Analysis</h3>
                        <div className="guna-grid">
                            {[
                                { label: 'Varna', score: '1/1', type: 'Work' },
                                { label: 'Vashya', score: '2/2', type: 'Dominance' },
                                { label: 'Tara', score: '1.5/3', type: 'Destiny' },
                                { label: 'Yoni', score: '4/4', type: 'Nature' },
                                { label: 'Graha Maitri', score: '5/5', type: 'Friendship' },
                                { label: 'Gana', score: '6/6', type: 'Temperament' },
                                { label: 'Bhakoot', score: '7/7', type: 'Love' },
                                { label: 'Nadi', score: '8/8', type: 'Health' },
                            ].map((guna, i) => (
                                <div key={i} className="guna-card glass-panel-sm">
                                    <span className="guna-label">{guna.label}</span>
                                    <span className="guna-type">{guna.type}</span>
                                    <div className="guna-score">{guna.score}</div>
                                </div>
                            ))}
                        </div>

                        <div className="dosha-alert glass-panel warning">
                            <div className="alert-header">
                                <AlertTriangle size={20} />
                                <h4>Mangal Dosha Analysis</h4>
                            </div>
                            <p>Low Mangal Dosha present in Boy's chart. However, it is cancelled due to Saturn's aspect. Match is safe to proceed.</p>
                        </div>

                        <button onClick={() => setStep('boy_input')} className="restart-btn">
                            Check Another Match
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MobileMatchmaking;
