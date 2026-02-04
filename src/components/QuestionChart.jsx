import React from 'react';

const basicQuestions = [
    {
        q: "When will I get married?",
        a: "Your 7th house lord enters a favorable dasha in June 2026, indicating a strong marriage window."
    },
    {
        q: "When will I get a job?",
        a: "Jupiter's transit over your 10th house suggests a career breakthrough within the next 4 months."
    },
    {
        q: "Will I find true love?",
        a: "Venus is well-placed in your 5th house, promising a romantic connection in late 2025."
    },
    {
        q: "Financial condition improvement?",
        a: "Dhana Yoga is being activated by Saturn's movement. Stability begins after November."
    },
    {
        q: "Will I go abroad or settle overseas?",
        a: "Foreign settlements are indicated as the 12th house is active. Expect opportunities soon."
    },
    {
        q: "Is my health safe in the future?",
        a: "The Sun's position suggests strong vitality, but minor fatigue is possible in the next quarter."
    },
    {
        q: "Which career suits me best?",
        a: "Your chart supports creative leadership. Media, design, or strategic management are ideal."
    },
    {
        q: "When will my problems end?",
        a: "The current Sade Sati peak passes by February, leading to a period of significant relief."
    }
];

const advancedQuestions = [
    {
        q: "Is Kaal Sarp Dosha affecting me?",
        a: "Rahu and Ketu placement indicates a partial Kaal Sarp Yoga. Remedies are recommended to unlock progress."
    },
    {
        q: "Is my relationship karmic?",
        a: "Strong 8th house connections suggest a deep karmic bond of learning and transformation."
    },
    {
        q: "Should I start a startup or side business?",
        a: "Mercury and Sun in the 11th house favor entrepreneurship. The best time to start is after March."
    },
    {
        q: "Which gemstone should I wear?",
        a: "Yellow Sapphire is recommended to strengthen your Ascendant lord and boost overall prosperity."
    },
    {
        q: "Is my current Dasha favorable?",
        a: "You are currently in Rahu Mahadasha; while challenging, it offers massive growth through innovation."
    },
    {
        q: "Why am I facing repeated failures?",
        a: "Mars-Saturn conjunction is creating delays. Patience and discipline will turn these into stepping stones."
    },
    {
        q: "Is my mental stress shown in my chart?",
        a: "Moon's proximity to Ketu indicates high sensitivity. Meditation and moon-related remedies will help."
    },
    {
        q: "Will I regain lost money?",
        a: "The 11th house recovery cycle starts in late 2026. Avoid high-risk debt until then."
    }
];

const QuestionChart = ({ onSelect }) => {
    const handleRowClick = (q, category) => {
        if (onSelect) {
            onSelect({ text: q, category });
        }
    };

    return (
        <div className="question-chart-container glass-panel">
            <div className="chart-header-control">
                <div className="header-title-group">
                    <span className="scifi-icon">◈</span>
                    <div>
                        <h3 className="gold-text">AstroRevo Insight Matrix</h3>
                        <p className="text-dim">AI-Powered Pattern Recognition Engine</p>
                    </div>
                </div>
                <div className="simulation-status">
                    <span className="status-dot blink"></span>
                    <span>SYSTEM READY</span>
                </div>
            </div>

            <div className="chart-grid">
                {/* Basic Section */}
                <div className="chart-section basic-panel">
                    <div className="section-header">
                        <span className="section-icon">⟡</span>
                        <h4>Fundamental Analysis</h4>
                        <span className="line-dec"></span>
                    </div>
                    <div className="chart-list">
                        {basicQuestions.map((item, i) => (
                            <div key={i} className="insight-card clickable" onClick={() => handleRowClick(item.q, 'Basic')}>
                                <div className="card-q">{item.q}</div>
                                <div className="card-a">{item.a}</div>
                                <div className="card-glow"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Advanced Section */}
                <div className="chart-section advance-panel">
                    <div className="section-header">
                        <span className="section-icon">✦</span>
                        <h4>Deep Karmic Patterns</h4>
                        <span className="line-dec"></span>
                    </div>
                    <div className="chart-list">
                        {advancedQuestions.map((item, i) => (
                            <div key={i} className="insight-card clickable advanced-card" onClick={() => handleRowClick(item.q, 'Advanced')}>
                                <div className="card-q">{item.q}</div>
                                <div className="card-a">{item.a}</div>
                                <div className="card-glow"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="chart-footer">
                <div className="data-stream-line"></div>
                <p className="tech-text">INITIALIZING COSMIC DATA STREAM... SELECT A QUERY TO BEGIN</p>
            </div>
        </div>
    );
};

export default QuestionChart;
