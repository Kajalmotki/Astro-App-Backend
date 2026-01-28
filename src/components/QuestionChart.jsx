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
        <div className="question-chart-container glass-card">
            <div className="chart-header">
                <h3 className="gold-text text-center">AstroRevo Insight Chart</h3>
                <p className="text-dim text-center">Representative examples of what our AI Engine analyzes in your chart.</p>
            </div>

            <div className="chart-grid">
                {/* Basic Section */}
                <div className="chart-section basic">
                    <div className="section-header basic-header">
                        <span className="section-badge">Standard</span>
                        <h4>Basic Questions</h4>
                    </div>
                    <div className="chart-table">
                        <div className="table-row table-head">
                            <div className="cell-q">The Inquiry</div>
                            <div className="cell-a">Sample AI Insight</div>
                        </div>
                        {basicQuestions.map((item, i) => (
                            <div key={i} className="table-row clickable" onClick={() => handleRowClick(item.q, 'Basic')}>
                                <div className="cell-q">{item.q}</div>
                                <div className="cell-a italic">{item.a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Advanced Section */}
                <div className="chart-section advance">
                    <div className="section-header advance-header">
                        <span className="section-badge gold">Advanced</span>
                        <h4>Advanced Analytics</h4>
                    </div>
                    <div className="chart-table">
                        <div className="table-row table-head">
                            <div className="cell-q">Complex Query</div>
                            <div className="cell-a">Sample Logic Trace</div>
                        </div>
                        {advancedQuestions.map((item, i) => (
                            <div key={i} className="table-row clickable" onClick={() => handleRowClick(item.q, 'Advanced')}>
                                <div className="cell-q">{item.q}</div>
                                <div className="cell-a italic">{item.a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="chart-footer">
                <p className="pulse-text text-center">Explore all 52+ pathways by starting your personal cosmic reading below.</p>
            </div>
        </div>
    );
};

export default QuestionChart;
