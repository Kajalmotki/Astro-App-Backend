import React, { useState } from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './HoroscopePage.css';

const HoroscopePage = ({ isOpen, onClose }) => {
    const [selectedSign, setSelectedSign] = useState(null);
    const [activePeriod, setActivePeriod] = useState('daily');

    const zodiacSigns = [
        { name: "Aries", sanskrit: "मेष", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire", ruler: "Mars", color: "#ef4444" },
        { name: "Taurus", sanskrit: "वृषभ", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth", ruler: "Venus", color: "#22c55e" },
        { name: "Gemini", sanskrit: "मिथुन", symbol: "♊", dates: "May 21 - Jun 20", element: "Air", ruler: "Mercury", color: "#eab308" },
        { name: "Cancer", sanskrit: "कर्क", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water", ruler: "Moon", color: "#64748b" },
        { name: "Leo", sanskrit: "सिंह", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire", ruler: "Sun", color: "#f97316" },
        { name: "Virgo", sanskrit: "कन्या", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth", ruler: "Mercury", color: "#84cc16" },
        { name: "Libra", sanskrit: "तुला", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air", ruler: "Venus", color: "#ec4899" },
        { name: "Scorpio", sanskrit: "वृश्चिक", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water", ruler: "Mars", color: "#dc2626" },
        { name: "Sagittarius", sanskrit: "धनु", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire", ruler: "Jupiter", color: "#8b5cf6" },
        { name: "Capricorn", sanskrit: "मकर", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth", ruler: "Saturn", color: "#6b7280" },
        { name: "Aquarius", sanskrit: "कुम्भ", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air", ruler: "Saturn", color: "#06b6d4" },
        { name: "Pisces", sanskrit: "मीन", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water", ruler: "Jupiter", color: "#3b82f6" }
    ];

    // Sample predictions (would come from API in production)
    const getPrediction = (sign, period) => {
        const predictions = {
            daily: {
                overview: `Today brings positive energy for ${sign.name}. The cosmic alignment favors your endeavors, and you may find unexpected opportunities arising. Trust your instincts and take calculated risks.`,
                love: "Romance is in the air. Singles may meet someone special through work or social gatherings. Couples should plan quality time together.",
                career: "Professional growth is indicated. A superior may notice your efforts. Avoid conflicts with colleagues and focus on collaborative projects.",
                health: "Physical energy is high. Good day for starting a new fitness routine. Watch your diet and stay hydrated.",
                finance: "Financial gains are possible through wise investments. Avoid impulsive purchases and review your budget."
            },
            weekly: {
                overview: `This week marks a period of transformation for ${sign.name}. Planetary transits bring both challenges and opportunities for growth. Stay adaptable and open to change.`,
                love: "Mid-week brings romantic opportunities. Communication with partner improves. Singles should attend social events for potential connections.",
                career: "Career momentum builds through the week. Important meetings may lead to advancement. Weekend is good for networking.",
                health: "Energy fluctuates - rest well at week's start. Exercise and meditation recommended mid-week for balance.",
                finance: "Early week favors savings. Weekend may bring unexpected expenses. Plan budgets carefully."
            },
            monthly: {
                overview: `This month holds significant potential for ${sign.name}. Major planetary movements influence your sector of growth and relationships. Embrace the transformative energy.`,
                love: "Deep emotional connections await. Existing relationships strengthen or face necessary revelations. Singles attract meaningful encounters.",
                career: "Month-long projects reach completion. Recognition from superiors likely. New opportunities emerge around the third week.",
                health: "Focus on long-term wellness goals. Best time for health checkups and establishing new routines.",
                finance: "Financial planning for the long term is favored. Investments made now may yield returns in coming months."
            }
        };
        return predictions[period];
    };

    const luckyElements = {
        numbers: [3, 7, 12],
        colors: ["Gold", "Royal Blue"],
        days: ["Tuesday", "Friday"],
        compatible: ["Leo", "Sagittarius"]
    };

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="राशिफल - Daily Horoscope" variant="default">
            <div className="horoscope-container">
                {!selectedSign ? (
                    <>
                        <p className="horoscope-intro">
                            Select your zodiac sign to reveal your cosmic guidance.
                            Each sign carries unique energies influenced by planetary movements.
                        </p>

                        <div className="zodiac-wheel">
                            {zodiacSigns.map((sign, index) => (
                                <div
                                    key={sign.name}
                                    className="zodiac-card"
                                    style={{
                                        '--sign-color': sign.color,
                                        '--delay': `${index * 0.05}s`
                                    }}
                                    onClick={() => setSelectedSign(sign)}
                                >
                                    <span className="zodiac-symbol">{sign.symbol}</span>
                                    <div className="zodiac-info">
                                        <span className="zodiac-name">{sign.name}</span>
                                        <span className="zodiac-sanskrit">{sign.sanskrit}</span>
                                    </div>
                                    <span className="zodiac-dates">{sign.dates}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="prediction-view">
                        <button className="back-btn" onClick={() => setSelectedSign(null)}>
                            ← Back to Signs
                        </button>

                        {/* Sign Header */}
                        <div className="sign-header" style={{ '--sign-color': selectedSign.color }}>
                            <span className="sign-symbol">{selectedSign.symbol}</span>
                            <div className="sign-details">
                                <h3>{selectedSign.name} <span className="sanskrit">{selectedSign.sanskrit}</span></h3>
                                <div className="sign-meta">
                                    <span>🔥 {selectedSign.element}</span>
                                    <span>🪐 Ruled by {selectedSign.ruler}</span>
                                    <span>📅 {selectedSign.dates}</span>
                                </div>
                            </div>
                        </div>

                        {/* Period Tabs */}
                        <div className="period-tabs">
                            {['daily', 'weekly', 'monthly'].map(period => (
                                <button
                                    key={period}
                                    className={`period-tab ${activePeriod === period ? 'active' : ''}`}
                                    onClick={() => setActivePeriod(period)}
                                >
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Predictions */}
                        <div className="predictions-grid">
                            <div className="prediction-card overview">
                                <h4>✨ Overview</h4>
                                <p>{getPrediction(selectedSign, activePeriod).overview}</p>
                            </div>

                            <div className="prediction-card love">
                                <h4>❤️ Love & Relationships</h4>
                                <p>{getPrediction(selectedSign, activePeriod).love}</p>
                            </div>

                            <div className="prediction-card career">
                                <h4>💼 Career & Finance</h4>
                                <p>{getPrediction(selectedSign, activePeriod).career}</p>
                            </div>

                            <div className="prediction-card health">
                                <h4>🏃 Health & Wellness</h4>
                                <p>{getPrediction(selectedSign, activePeriod).health}</p>
                            </div>
                        </div>

                        {/* Lucky Elements */}
                        <div className="lucky-section">
                            <h4>🍀 Lucky Elements</h4>
                            <div className="lucky-grid">
                                <div className="lucky-item">
                                    <span className="lucky-label">Numbers</span>
                                    <span className="lucky-value">{luckyElements.numbers.join(', ')}</span>
                                </div>
                                <div className="lucky-item">
                                    <span className="lucky-label">Colors</span>
                                    <span className="lucky-value">{luckyElements.colors.join(', ')}</span>
                                </div>
                                <div className="lucky-item">
                                    <span className="lucky-label">Days</span>
                                    <span className="lucky-value">{luckyElements.days.join(', ')}</span>
                                </div>
                                <div className="lucky-item">
                                    <span className="lucky-label">Compatible</span>
                                    <span className="lucky-value">{luckyElements.compatible.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FullScreenOverlay>
    );
};

export default HoroscopePage;
