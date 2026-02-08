import React, { useState } from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import BirthDetailsForm from '../BirthDetailsForm';
import { calculateAshtakoot } from '../../utils/matchmakingUtils';
import './MatchmakingPage.css';

const MatchmakingPage = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1); // 1: input, 2: analyzing, 3: results
    const [profile1, setProfile1] = useState(null);
    const [profile2, setProfile2] = useState(null);
    const [results, setResults] = useState([]);

    const handleCalculate = () => {
        if (profile1 && profile2) {
            setStep(2);
            // Simulate processing delay for dramatic effect
            setTimeout(() => {
                const calculatedResults = calculateAshtakoot(profile1, profile2);
                setResults(calculatedResults);
                setStep(3);
            }, 2500);
        }
    };

    const kootaResults = results.length > 0 ? results : [];

    const totalObtained = kootaResults.reduce((sum, k) => sum + (k.obtained || 0), 0);
    const totalMax = 36;
    const percentage = Math.round((totalObtained / totalMax) * 100);

    const getCompatibilityLevel = (score) => {
        if (score >= 32) return { level: "Excellent", color: "#22c55e", message: "An exceptional celestial union blessed by the stars." };
        if (score >= 25) return { level: "Very Good", color: "#84cc16", message: "A highly compatible match with strong foundations." };
        if (score >= 18) return { level: "Good", color: "#eab308", message: "A compatible match. Minor remedies may enhance harmony." };
        return { level: "Needs Analysis", color: "#f97316", message: "Detailed analysis and remedies recommended." };
    };

    const compatibility = getCompatibilityLevel(totalObtained);

    const resetForm = () => {
        setStep(1);
        setProfile1(null);
        setProfile2(null);
        setResults([]);
    };

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="अष्टकूट मिलान - Divine Union Analysis" variant="love">
            <div className="matchmaking-container">
                {step === 1 && (
                    <div className="input-phase">
                        <p className="mm-intro">
                            Enter the birth details of both partners to calculate the Ashtakoot (8 Koota)
                            compatibility score based on ancient Vedic matchmaking principles.
                        </p>

                        <div className="profiles-container">
                            <div className="profile-form-wrapper">
                                <BirthDetailsForm
                                    title="Bride's Details"
                                    submitLabel="Save Details"
                                    onSubmit={(data) => setProfile1(data)}
                                />
                                {profile1 && <div className="status-badge">✅ {profile1.name}</div>}
                            </div>

                            <div className="connector">
                                <div className="hearts-animation">
                                    <span className="heart h1">💕</span>
                                    <span className="heart h2">💖</span>
                                </div>
                            </div>

                            <div className="profile-form-wrapper">
                                <BirthDetailsForm
                                    title="Groom's Details"
                                    submitLabel="Save Details"
                                    onSubmit={(data) => setProfile2(data)}
                                />
                                {profile2 && <div className="status-badge">✅ {profile2.name}</div>}
                            </div>
                        </div>

                        {profile1 && profile2 && (
                            <button className="gold-btn calculate-btn pulse-animation" onClick={handleCalculate}>
                                ✨ Analyze Compatibility ✨
                            </button>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="analyzing-phase">
                        <div className="cosmic-loader">
                            <div className="orbit orbit-1"><div className="planet"></div></div>
                            <div className="orbit orbit-2"><div className="planet"></div></div>
                            <div className="orbit orbit-3"><div className="planet"></div></div>
                            <div className="center-sun"></div>
                        </div>
                        <h3>Analyzing Cosmic Compatibility...</h3>
                        <p>Comparing Nakshatras, Moon signs, and planetary positions</p>
                    </div>
                )}

                {step === 3 && (
                    <div className="results-phase">
                        {/* Names */}
                        <div className="couple-names">
                            <span className="name bride">{profile1?.name || 'Bride'}</span>
                            <span className="heart-divider">💕</span>
                            <span className="name groom">{profile2?.name || 'Groom'}</span>
                        </div>

                        {/* Main Score Circle */}
                        <div className="score-section">
                            <div className="score-circle" style={{ '--score-color': compatibility.color }}>
                                <svg viewBox="0 0 120 120" className="progress-ring">
                                    <circle cx="60" cy="60" r="54" className="progress-bg" />
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="54"
                                        className="progress-fill"
                                        style={{
                                            strokeDasharray: `${percentage * 3.39} 339`,
                                            stroke: compatibility.color
                                        }}
                                    />
                                </svg>
                                <div className="score-content">
                                    <span className="score-value">{totalObtained}</span>
                                    <span className="score-max">/ {totalMax}</span>
                                </div>
                            </div>
                            <div className="compatibility-level" style={{ color: compatibility.color }}>
                                {compatibility.level} Match
                            </div>
                            <p className="compatibility-message">{compatibility.message}</p>
                        </div>

                        {/* Koota Breakdown */}
                        <h4 className="section-title">अष्टकूट विवरण - Eight Koota Breakdown</h4>
                        <div className="kootas-grid">
                            {kootaResults.map((koota, index) => (
                                <div key={koota.name} className="koota-card" style={{ '--delay': `${index * 0.1}s` }}>
                                    <div className="koota-header">
                                        <div className="koota-name">
                                            <span className="sanskrit">{koota.sanskrit}</span>
                                            <span className="english">{koota.name}</span>
                                        </div>
                                        <div className="koota-score">
                                            <span className="obtained">{koota.obtained}</span>
                                            <span className="max">/{koota.maxPoints}</span>
                                        </div>
                                    </div>
                                    <p className="koota-description">{koota.description}</p>
                                    <div className="koota-bar">
                                        <div
                                            className="koota-fill"
                                            style={{ width: `${(koota.obtained / koota.maxPoints) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="koota-detail">{koota.detail}</p>
                                </div>
                            ))}
                        </div>

                        {/* Conclusion */}
                        <div className="conclusion-card">
                            <h4>🕉️ Final Verdict</h4>
                            <p>
                                Based on the Ashtakoot analysis, this union shows <strong>{compatibility.level.toLowerCase()}</strong> compatibility
                                with a score of <strong>{totalObtained} out of 36</strong> gunas.
                                {totalObtained >= 18 ?
                                    " This match is recommended for marriage with blessings for a harmonious life together." :
                                    " A detailed consultation with an astrologer is recommended for remedies."
                                }
                            </p>
                        </div>

                        <button className="gold-btn" onClick={resetForm}>
                            Check Another Match
                        </button>
                    </div>
                )}
            </div>
        </FullScreenOverlay>
    );
};

export default MatchmakingPage;
