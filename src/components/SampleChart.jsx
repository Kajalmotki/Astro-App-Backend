import React from 'react';
import { Link } from 'react-router-dom';

const sampleInsights = [
    { category: 'Love', icon: '❤️', question: 'When will I meet my soulmate?', x: 50, y: 100 },
    { category: 'Marriage', icon: '💍', question: 'Is my partnership auspicious?', x: 50, y: 200 },
    { category: 'Career', icon: '💼', question: 'When is my next breakthrough?', x: 50, y: 300 },
    { category: 'Money', icon: '💰', question: 'When will my wealth stabilize?', x: 50, y: 400 },
    { category: 'Health', icon: '🏥', x: 50, y: 500, question: 'How can I optimize my energy?' },
    { category: 'Education', icon: '🎓', x: 50, y: 600, question: 'Which study path is best?' },
    { category: 'Lustre', icon: '💎', x: 50, y: 700, question: 'How to enhance my aura?' },

    { category: 'Family', icon: '👨‍👩‍👧‍👦', question: 'How do I harmonize my home?', x: 850, y: 100 },
    { category: 'Spirituality', icon: '🧘', question: 'What is my soul’s purpose?', x: 850, y: 200 },
    { category: 'Travel', icon: '✈️', question: 'When is travel indicated?', x: 850, y: 300 },
    { category: 'Property', icon: '🏠', question: 'When should I buy property?', x: 850, y: 400 },
    { category: 'Business', icon: '🚀', x: 850, y: 500, question: 'Is my venture ready for scale?' },
    { category: 'Legal', icon: '⚖️', x: 850, y: 600, question: 'What is the case outcome?' },
    { category: 'Children', icon: '👶', x: 850, y: 700, question: 'When is a child indicated?' },

    { category: 'Karma', icon: '🌀', x: 300, y: 50, question: 'What is my karmic debt?' },
    { category: 'Moksha', icon: '✨', x: 600, y: 50, question: 'Am I on the path to liberation?' },
    { category: 'Finance', icon: '📈', x: 300, y: 800, question: 'How to optimize my portfolio?' },
    { category: 'Enemies', icon: '⚔️', x: 600, y: 800, question: 'How to overcome competition?' },
    { category: 'Parents', icon: '👴', x: 450, y: 800, question: 'Support for my elders?' },
];

const SampleChart = () => {
    const renderPath = (x1, y1, x2, y2) => {
        const cx = (x1 + x2) / 2;
        return (
            <path
                d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                className="sample-path"
            />
        );
    };

    return (
        <div className="sample-page bg-deep">
            <header className="header glass">
                <Link to="/" className="logo gold-text">AstroRevo</Link>
                <nav className="nav">
                    <Link to="/">Back to Home</Link>
                    <button className="cta-btn">Initialize Engine</button>
                </nav>
            </header>

            <main className="sample-content">
                <div className="sample-intro">
                    <h1 className="gold-text">AstroRevo Chart Sample</h1>
                    <p>Explore the dimensions of destiny through our AI-integrated Vedic engine.</p>
                </div>

                <div className="sample-chart-canvas glass-card">
                    <svg viewBox="0 0 1000 900" className="sample-svg">
                        <defs>
                            <pattern id="sampleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.05)" />
                            </pattern>
                            <filter id="neonGlowSample">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <rect width="1000" height="900" fill="url(#sampleGrid)" />

                        <g transform="translate(500, 425)" className="central-chart-node">
                            <circle r="140" className="engine-outer-glow" />
                            <circle r="120" fill="rgba(10, 10, 25, 0.9)" stroke="var(--primary)" strokeWidth="3" filter="url(#neonGlowSample)" />

                            <path d="M0 -100 L86 50 L-86 50 Z" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.3" />
                            <path d="M0 100 L-86 -50 L86 -50 Z" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.3" />

                            <text textAnchor="middle" dy="-20" fill="var(--primary)" fontWeight="bold" fontSize="20">VEDIC CORE</text>
                            <text textAnchor="middle" dy="10" fill="#fff" fontWeight="bold" fontSize="16">Destiny Blueprint</text>
                            <text textAnchor="middle" dy="35" fill="var(--text-dim)" fontSize="10">Active Interpretation Engine</text>

                            <circle r="8" fill="#fff" filter="url(#neonGlowSample)">
                                <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {sampleInsights.map((insight, i) => {
                            const isLeft = insight.x < 400;
                            const isRight = insight.x > 600;
                            const nodeWidth = 200;

                            let anchorX = insight.x;
                            if (isLeft) anchorX = insight.x + nodeWidth;
                            else if (isRight) anchorX = insight.x;
                            else anchorX = insight.x + nodeWidth / 2;

                            let anchorY = insight.y;

                            return (
                                <g key={i}>
                                    {renderPath(anchorX, anchorY, 500, 425)}
                                    <g transform={`translate(${insight.x}, ${insight.y - 35})`} className="sample-insight-node">
                                        <rect width={nodeWidth} height="70" rx="15" className="node-rect-glass" />
                                        <text x="15" y="25" fontSize="18">{insight.icon}</text>
                                        <text x="45" y="25" fill="var(--primary)" fontSize="10" fontWeight="bold" letterSpacing="1px">{insight.category}</text>
                                        <text x="15" y="50" fill="#fff" fontSize="10" fontWeight="500">{insight.question}</text>
                                    </g>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <div className="sample-cta-footer">
                    <h2 className="gold-text">Ready to mirror your future?</h2>
                    <Link to="/" className="cta-btn large">Get Started Now</Link>
                </div>
            </main>

            <footer className="footer">
                <p>&copy; 2026 AstroRevo. Precise. Instant. Vedic.</p>
            </footer>
        </div>
    );
};

export default SampleChart;
