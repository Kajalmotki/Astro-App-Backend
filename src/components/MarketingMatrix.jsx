import React from 'react';
import './MarketingMatrix.css';

const domainData = [
    {
        id: 1,
        title: "Classical Jyotisha",
        desc: "Foundational Parasharian building blocks. 9 Grahas and 12 Rashis.",
        details: ["Grahas (Sun - Ketu)", "12 Zodiac Signs", "27 Nakshatras"]
    },
    {
        id: 2,
        title: "D-1 Rashi Logic",
        desc: "Precision Chart Analysis. Evaluating planetary strength and house lordship.",
        details: ["Planetary Avasthas", "Exaltation", "House Synergy"]
    },
    {
        id: 3,
        title: "Nakshatra Secrets",
        desc: "Deep behavioral profiling. Unlocking fate from randomness.",
        details: ["Instincts", "Career Tendencies", "Fated Outcomes"]
    },
    {
        id: 4,
        title: "Vimshottari Timing",
        desc: "Our strongest predictive engine. Analyzing Mahadasha for timing success.",
        details: ["Cosmic Timeline", "Risk/Opportunity", "Event Timing"]
    },
    {
        id: 5,
        title: "Life Area Mapping",
        desc: "Targeted insights for real-life domains. Career, wealth, and health.",
        details: ["Professional Path", "Marriage Timing", "Health Matrix"]
    },
    {
        id: 6,
        title: "Behavioral Profile",
        desc: "Decoding core temperament through Moon and Lagna metrics.",
        details: ["Decision Style", "Strengths", "Stress Patterns"]
    },
    {
        id: 7,
        title: "Analytical Style",
        desc: "No fear. Just structured, probability-based actionable guidance.",
        details: ["Timelines", "Trend Analysis", "Logic Over Myth"]
    },
    {
        id: 8,
        title: "Advanced Domains",
        desc: "Deep-dive analysis including D-9, D-10, and Transit triggers.",
        details: ["Navamsha (D-9)", "Dashamsha (D-10)", "Transit Logic"]
    },
    {
        id: 9,
        title: "Vedic Purity",
        desc: "Shielded against distractions. Pure Jyotisha with zero tarot or numerology.",
        details: ["Parashara Core", "No Fear Pred.", "Pure Science"]
    }
];

const roadmapSteps = [
    {
        title: "Map the Unseen",
        desc: "AI identifies dormant karmic blocks across 52 neural pathways instantly."
    },
    {
        title: "Targeted Inquiries",
        desc: "Save months of confusion by asking the exact questions your chart demands."
    },
    {
        title: "Instant Remedies",
        desc: "Get scientific Vedic solutions tied back to your specific planetary periods."
    },
    {
        title: "Life-long Clarity",
        desc: "Your remedial matrix stands as a permanent guide, updating with every transit."
    }
];

const MarketingMatrix = () => {
    return (
        <section className="marketing-matrix-section">
            <div className="circle-grid">
                {domainData.map((domain) => (
                    <div key={domain.id} className="circle-wrapper">
                        <div className="circle-node large-node glass">
                            <div className="node-content">
                                <h4>{domain.title}</h4>
                                <p className="node-desc">{domain.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="roadmap-container">
                <div className="roadmap-main-message">
                    <h3 className="gold-text">Efficiency Through Cosmic Precision</h3>
                    <p>The AstroRevo Chart isn't just a reading; it's a strategic bypass for the trial-and-error of life. Designed by master Vedic practitioners, this matrix automates the identification of root causes, suggesting the precise questions you need to ask while providing instant, actionable remedies.</p>
                </div>

                <div className="roadmap-steps-grid">
                    {roadmapSteps.map((step, i) => (
                        <div key={i} className="roadmap-card glass">
                            <h5>{step.title}</h5>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="vertical-connector"></div>
            </div>
        </section>
    );
};

export default MarketingMatrix;
