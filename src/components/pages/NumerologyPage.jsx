import React, { useState } from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './NumerologyPage.css';

const NumerologyPage = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [results, setResults] = useState(null);
    const [calculating, setCalculating] = useState(false);

    const letterValues = {
        A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
        J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
        S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    };

    const compatibilityChart = {
        1: { lucky: [1, 2, 3, 5, 6, 9], enemy: [8], neutral: [4, 7] },
        2: { lucky: [1, 2, 3, 5], enemy: [4, 8, 9], neutral: [6, 7] },
        3: { lucky: [1, 2, 3, 5, 7], enemy: [6], neutral: [4, 8, 9] },
        4: { lucky: [1, 5, 6, 7, 8], enemy: [2, 9], neutral: [3] },
        5: { lucky: [1, 2, 3, 5, 6], enemy: [], neutral: [4, 7, 8, 9] },
        6: { lucky: [1, 4, 5, 6, 7], enemy: [3], neutral: [2, 8, 9] },
        7: { lucky: [1, 3, 4, 5, 6], enemy: [], neutral: [2, 8, 9] },
        8: { lucky: [3, 4, 5, 6, 7], enemy: [1, 2, 8], neutral: [9] },
        9: { lucky: [1, 3, 5], enemy: [2, 4], neutral: [6, 7, 8, 9] }
    };

    const vowels = ['A', 'E', 'I', 'O', 'U'];

    const reduceToSingleDigit = (num) => {
        // Master numbers can be kept for display, but for compatibility usually reduced to 1-9
        if (num === 11 || num === 22 || num === 33) return num;
        while (num > 9) {
            num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
            if (num === 11 || num === 22 || num === 33) return num;
        }
        return num;
    };

    const reduceToBasicDigit = (num) => {
        while (num > 9) {
            num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
        }
        return num;
    };

    const calculateMulank = (dateString) => {
        // Mulank is sum of DAY only
        const day = parseInt(dateString.split('-')[2]);
        return reduceToSingleDigit(day);
    };

    const calculateBhagyank = (dateString) => {
        // Bhagyank is sum of FULL DATE
        const digits = dateString.replace(/-/g, '').split('').map(Number);
        const sum = digits.reduce((a, b) => a + b, 0);
        return reduceToSingleDigit(sum);
    };

    const calculateDestinyFromName = (fullName) => {
        const upperName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
        const sum = upperName.split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
        return reduceToSingleDigit(sum);
    };

    const numberMeanings = {
        1: { trait: "The Leader (Sun)", description: "Independent, ambitious, and pioneering. Ruled by Sun.", color: "#f97316" },
        2: { trait: "The Diplomat (Moon)", description: "Cooperative, sensitive, and intuitive. Ruled by Moon.", color: "#3b82f6" },
        3: { trait: "The Creator (Jupiter)", description: "Expressive, creative, and joyful. Ruled by Jupiter.", color: "#eab308" },
        4: { trait: "The Builder (Rahu)", description: "Practical, organized, and disciplined. Ruled by Rahu.", color: "#22c55e" },
        5: { trait: "The Adventurer (Mercury)", description: "Dynamic, versatile, and freedom-loving. Ruled by Mercury.", color: "#8b5cf6" },
        6: { trait: "The Nurturer (Venus)", description: "Responsible, loving, and domestic. Ruled by Venus.", color: "#ec4899" },
        7: { trait: "The Seeker (Ketu)", description: "Analytical, introspective, and spiritual. Ruled by Ketu.", color: "#06b6d4" },
        8: { trait: "The Achiever (Saturn)", description: "Ambitious, authoritative, and business-minded. Ruled by Saturn.", color: "#dc2626" },
        9: { trait: "The Humanitarian (Mars)", description: "Compassionate, generous, and idealistic. Ruled by Mars.", color: "#6366f1" },
        11: { trait: "The Intuitive (Master)", description: "Spiritually gifted with heightened intuition. Master Number.", color: "#a855f7" },
        22: { trait: "The Master Builder", description: "Visionary with immense potential. Master Number.", color: "#f59e0b" },
        33: { trait: "The Master Teacher", description: "The teacher of teachers. Master Number.", color: "#14b8a6" }
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        if (!name || !birthDate) return;

        setCalculating(true);

        setTimeout(() => {
            const mulank = calculateMulank(birthDate);
            const bhagyank = calculateBhagyank(birthDate);
            const nameNumber = calculateDestinyFromName(name);

            // For compatibility, we use the basic 1-9 version of Mulank
            const baseMulank = reduceToBasicDigit(mulank);
            const compatibility = compatibilityChart[baseMulank];

            setResults({ mulank, bhagyank, nameNumber, compatibility });
            setCalculating(false);
        }, 1500);
    };

    const resetForm = () => {
        setName('');
        setBirthDate('');
        setResults(null);
    };

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="अंक ज्योतिष - Numerology" variant="cool">
            <div className="numerology-container">
                {!results && !calculating && (
                    <>
                        <p className="num-intro">
                            Discover your **Mulank** (Root Number) and **Bhagyank** (Destiny Number)
                            to unlock your compatibility and hidden potential.
                        </p>

                        <form className="num-form" onSubmit={handleCalculate}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="gold-btn">
                                🔮 Calculate Mulank & Bhagyank
                            </button>
                        </form>
                    </>
                )}

                {calculating && (
                    <div className="calculating-view">
                        <div className="number-spinner">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                <span key={n} className="spin-number" style={{ '--i': n }}>{n}</span>
                            ))}
                        </div>
                        <h3>Calculating Cosmic Numbers...</h3>
                    </div>
                )}

                {results && (
                    <div className="results-view">
                        <h3 className="results-for">Report for {name}</h3>

                        <div className="numbers-grid">
                            {/* Mulank */}
                            <div className="number-card main-card" style={{ '--num-color': numberMeanings[results.mulank]?.color || '#fff' }}>
                                <div className="number-circle">{results.mulank}</div>
                                <div className="number-info">
                                    <span className="number-type">Mulank (Driver)</span>
                                    <span className="number-trait">{numberMeanings[results.mulank]?.trait}</span>
                                </div>
                                <p className="number-desc">{numberMeanings[results.mulank]?.description}</p>
                                <span className="number-note">Derived from Day of Birth</span>
                            </div>

                            {/* Bhagyank */}
                            <div className="number-card" style={{ '--num-color': numberMeanings[results.bhagyank]?.color || '#fff' }}>
                                <div className="number-circle">{results.bhagyank}</div>
                                <div className="number-info">
                                    <span className="number-type">Bhagyank (Conductor)</span>
                                    <span className="number-trait">{numberMeanings[results.bhagyank]?.trait}</span>
                                </div>
                                <p className="number-desc">{numberMeanings[results.bhagyank]?.description}</p>
                                <span className="number-note">Derived from Full Date</span>
                            </div>

                            {/* Name Number */}
                            <div className="number-card" style={{ '--num-color': numberMeanings[results.nameNumber]?.color || '#fff' }}>
                                <div className="number-circle">{results.nameNumber}</div>
                                <div className="number-info">
                                    <span className="number-type">Name Number</span>
                                    <span className="number-trait">Expression</span>
                                </div>
                                <span className="number-note">Derived from Name Sum</span>
                            </div>
                        </div>

                        {/* Compatibility Section */}
                        <div className="compatibility-section glass-card" style={{ marginTop: '30px', padding: '20px' }}>
                            <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>❤️ Compatibility Chart (Based on Mulank)</h3>
                            <div className="compat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', textAlign: 'center' }}>
                                <div className="compat-col">
                                    <h4 style={{ color: '#4ade80' }}>Compatible ✅</h4>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        {results.compatibility?.lucky.join(', ') || 'None'}
                                    </p>
                                    <span className="text-dim">Lucky Numbers</span>
                                </div>
                                <div className="compat-col">
                                    <h4 style={{ color: '#9ca3af' }}>Neutral ⚖️</h4>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        {results.compatibility?.neutral.join(', ') || 'None'}
                                    </p>
                                    <span className="text-dim">Okay Match</span>
                                </div>
                                <div className="compat-col">
                                    <h4 style={{ color: '#f87171' }}>Avoid ❌</h4>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        {results.compatibility?.enemy.length > 0 ? results.compatibility.enemy.join(', ') : 'None'}
                                    </p>
                                    <span className="text-dim">Challenging</span>
                                </div>
                            </div>
                        </div>

                        <button className="gold-btn" onClick={resetForm} style={{ marginTop: '30px' }}>
                            Calculate Another
                        </button>
                    </div>
                )}
            </div>
        </FullScreenOverlay>
    );
};

export default NumerologyPage;
