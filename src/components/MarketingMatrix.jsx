import React from 'react';

const domainData = [
    {
        id: 1,
        title: "Classical Jyotisha",
        icon: "🕉️",
        desc: "Foundational Parasharian building blocks. 9 Grahas, 12 Rashis, and the Pancha-tatva matrix.",
        details: ["Grahas (Sun - Ketu)", "12 Zodiac Signs", "27 Nakshatras", "Pancha-tatva Logic"]
    },
    {
        id: 2,
        title: "D-1 Rashi Logic",
        icon: "📐",
        desc: "Precision Chart Analysis. Evaluating planetary strength, functional nature, and house lordship.",
        details: ["Planetary Avasthas", "Exaltation/Debilitation", "Kendra & Trikona", "House & Lord Synergy"]
    },
    {
        id: 3,
        title: "Nakshatra Secrets",
        icon: "🌙",
        desc: "Deep psychological and behavioral profiling. Unlocking fate from randomness.",
        details: ["Behavioral Patterns", "Career Instincts", "Karmic Tendencies", "Fated Outcomes"]
    },
    {
        id: 4,
        title: "Vimshottari Timing",
        icon: "⏳",
        desc: "Our strongest predictive engine. Analyzing Mahadasha to Sukshma levels for timing success.",
        details: ["Cosmic Timeline", "Risk/Opportunity", "Marriage & Finance", "Event Confirmation"]
    },
    {
        id: 5,
        title: "Life Area Mapping",
        icon: "💼",
        desc: "Targeted insights for real-life domains. Career, wealth, health, and spiritual growth.",
        details: ["10th House (Profession)", "7th House (Marriage)", "2nd/11th (Wealth)", "Lagna/6th (Health)"]
    },
    {
        id: 6,
        title: "Behavioral Profile",
        icon: "🧠",
        desc: "Decoding core temperament and stress patterns through Moon and Lagna metrics.",
        details: ["Decision Style", "Strengths/Weaknesses", "Leadership Nature", "Emotional Matrix"]
    },
    {
        id: 7,
        title: "Analytical Style",
        icon: "📊",
        desc: "No fear. No absolutes. Just structured, probability-based actionable guidance.",
        details: ["Structured Timelines", "Comparative Logic", "Action over Superstition", "Trend Analysis"]
    },
    {
        id: 8,
        title: "Advanced Domains",
        icon: "📱",
        desc: "Deep-dive analysis including D-9, D-10, and Transit based event triggers.",
        details: ["Navamsha (D-9)", "Dashamsha (D-10)", "Transit Triggers", "App Exclusive Logic"]
    },
    {
        id: 9,
        title: "Vedic Purity",
        icon: "🚫",
        desc: "Shielded against distractions. No Tarot, No Numerology, No Western Astrology. Pure Jyotisha.",
        details: ["Original Parashara", "No Death Dates", "No Magic Remedies", "Pure Science"]
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
                                <div className="node-details">
                                    {domain.details.map((detail, i) => (
                                        <span key={i} className="detail-tag">{detail}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


        </section>
    );
};

export default MarketingMatrix;
