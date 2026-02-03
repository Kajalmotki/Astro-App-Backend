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

    const vowels = ['A', 'E', 'I', 'O', 'U'];

    const reduceToSingleDigit = (num) => {
        // Master numbers 11, 22, 33 are kept
        if (num === 11 || num === 22 || num === 33) return num;
        while (num > 9) {
            num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
            if (num === 11 || num === 22 || num === 33) return num;
        }
        return num;
    };

    const calculateLifePath = (date) => {
        const digits = date.replace(/-/g, '').split('').map(Number);
        const sum = digits.reduce((a, b) => a + b, 0);
        return reduceToSingleDigit(sum);
    };

    const calculateDestiny = (fullName) => {
        const upperName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
        const sum = upperName.split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
        return reduceToSingleDigit(sum);
    };

    const calculateSoulUrge = (fullName) => {
        const upperName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
        const sum = upperName.split('').filter(c => vowels.includes(c)).reduce((acc, char) => acc + (letterValues[char] || 0), 0);
        return reduceToSingleDigit(sum);
    };

    const calculatePersonality = (fullName) => {
        const upperName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
        const sum = upperName.split('').filter(c => !vowels.includes(c)).reduce((acc, char) => acc + (letterValues[char] || 0), 0);
        return reduceToSingleDigit(sum);
    };

    const numberMeanings = {
        1: { trait: "The Leader", description: "Independent, ambitious, and pioneering. You're meant to lead, innovate, and stand out from the crowd.", color: "#f97316" },
        2: { trait: "The Diplomat", description: "Cooperative, sensitive, and intuitive. You thrive in partnerships and bring harmony to relationships.", color: "#3b82f6" },
        3: { trait: "The Creator", description: "Expressive, creative, and joyful. You're blessed with artistic talents and social charisma.", color: "#eab308" },
        4: { trait: "The Builder", description: "Practical, organized, and disciplined. You create lasting foundations through hard work.", color: "#22c55e" },
        5: { trait: "The Adventurer", description: "Dynamic, versatile, and freedom-loving. Change is your friend and travel energizes you.", color: "#8b5cf6" },
        6: { trait: "The Nurturer", description: "Responsible, loving, and domestic. You're a natural caretaker with strong family bonds.", color: "#ec4899" },
        7: { trait: "The Seeker", description: "Analytical, introspective, and spiritual. You're drawn to mysteries and deeper truths.", color: "#06b6d4" },
        8: { trait: "The Achiever", description: "Ambitious, authoritative, and business-minded. Material success and power come naturally.", color: "#dc2626" },
        9: { trait: "The Humanitarian", description: "Compassionate, generous, and idealistic. You're here to serve humanity and see the big picture.", color: "#6366f1" },
        11: { trait: "The Intuitive (Master)", description: "Spiritually gifted with heightened intuition. You're meant for spiritual leadership and inspiration.", color: "#a855f7" },
        22: { trait: "The Master Builder", description: "Visionary with immense potential. You can turn the biggest dreams into reality.", color: "#f59e0b" },
        33: { trait: "The Master Teacher", description: "The teacher of teachers. Your purpose is to uplift and heal on a grand scale.", color: "#14b8a6" }
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        if (!name || !birthDate) return;

        setCalculating(true);

        setTimeout(() => {
            const lifePath = calculateLifePath(birthDate);
            const destiny = calculateDestiny(name);
            const soulUrge = calculateSoulUrge(name);
            const personality = calculatePersonality(name);

            setResults({ lifePath, destiny, soulUrge, personality });
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
                            Numerology reveals the hidden meaning behind numbers in your life.
                            Enter your details to discover your core numbers and their cosmic significance.
                        </p>

                        <form className="num-form" onSubmit={handleCalculate}>
                            <div className="form-group">
                                <label>Full Name (as on birth certificate)</label>
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
                                🔮 Calculate My Numbers
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
                        <h3>Calculating Your Numbers...</h3>
                        <p>Analyzing the cosmic vibrations of your name and birth date</p>
                    </div>
                )}

                {results && (
                    <div className="results-view">
                        <h3 className="results-for">Numerology for {name}</h3>

                        <div className="numbers-grid">
                            {/* Life Path Number */}
                            <div className="number-card main-card" style={{ '--num-color': numberMeanings[results.lifePath].color }}>
                                <div className="number-circle">{results.lifePath}</div>
                                <div className="number-info">
                                    <span className="number-type">Life Path Number</span>
                                    <span className="number-trait">{numberMeanings[results.lifePath].trait}</span>
                                </div>
                                <p className="number-desc">{numberMeanings[results.lifePath].description}</p>
                                <span className="number-note">Your core purpose and life lessons</span>
                            </div>

                            {/* Destiny Number */}
                            <div className="number-card" style={{ '--num-color': numberMeanings[results.destiny].color }}>
                                <div className="number-circle">{results.destiny}</div>
                                <div className="number-info">
                                    <span className="number-type">Destiny Number</span>
                                    <span className="number-trait">{numberMeanings[results.destiny].trait}</span>
                                </div>
                                <p className="number-desc">{numberMeanings[results.destiny].description}</p>
                                <span className="number-note">What you're meant to achieve</span>
                            </div>

                            {/* Soul Urge Number */}
                            <div className="number-card" style={{ '--num-color': numberMeanings[results.soulUrge].color }}>
                                <div className="number-circle">{results.soulUrge}</div>
                                <div className="number-info">
                                    <span className="number-type">Soul Urge Number</span>
                                    <span className="number-trait">{numberMeanings[results.soulUrge].trait}</span>
                                </div>
                                <p className="number-desc">{numberMeanings[results.soulUrge].description}</p>
                                <span className="number-note">Your heart's deepest desires</span>
                            </div>

                            {/* Personality Number */}
                            <div className="number-card" style={{ '--num-color': numberMeanings[results.personality].color }}>
                                <div className="number-circle">{results.personality}</div>
                                <div className="number-info">
                                    <span className="number-type">Personality Number</span>
                                    <span className="number-trait">{numberMeanings[results.personality].trait}</span>
                                </div>
                                <p className="number-desc">{numberMeanings[results.personality].description}</p>
                                <span className="number-note">How others perceive you</span>
                            </div>
                        </div>

                        <button className="gold-btn" onClick={resetForm}>
                            Calculate Another
                        </button>
                    </div>
                )}
            </div>
        </FullScreenOverlay>
    );
};

export default NumerologyPage;
