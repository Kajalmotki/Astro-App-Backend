import React from 'react';
import './MarketingMatrix.css';

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
            <div className="roadmap-main-message">
                <h3 className="gold-text">Efficiency Through Cosmic Precision</h3>
                <p>The AstroRevo Chart isn't just a reading; it's a strategic bypass for the trial-and-error of life. Designed by master Vedic practitioners, this matrix automates the identification of root causes, suggesting the precise questions you need to ask while providing instant, actionable remedies.</p>
            </div>



            <div className="roadmap-container">


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
