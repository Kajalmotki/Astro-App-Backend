import React from 'react';
import { Link } from 'react-router-dom';

const sampleInsights = [
    // Left Column
    { category: 'Love', icon: '❤️', x: 60, y: 120 },
    { category: 'Marriage', icon: '💍', x: 60, y: 220 },
    { category: 'Career', icon: '💼', x: 60, y: 320 },
    { category: 'Money', icon: '💰', x: 60, y: 420 },
    { category: 'Health', icon: '🏥', x: 60, y: 520 },
    { category: 'Education', icon: '🎓', x: 60, y: 620 },
    { category: 'Lustre', icon: '✨', x: 60, y: 720 },

    // Right Column
    { category: 'Family', icon: '👨‍👩‍👧‍👦', x: 740, y: 120 },
    { category: 'Spirituality', icon: '🧘', x: 740, y: 220 },
    { category: 'Travel', icon: '✈️', x: 740, y: 320 },
    { category: 'Property', icon: '🏠', x: 740, y: 420 },
    { category: 'Business', icon: '🚀', x: 740, y: 520 },
    { category: 'Legal', icon: '⚖️', x: 740, y: 620 },
    { category: 'Children', icon: '👶', x: 740, y: 720 },

    // Top Row
    { category: 'Karma', icon: '🌀', x: 280, y: 80 },
    { category: 'Moksha', icon: '📿', x: 520, y: 80 },

    // Bottom Row
    { category: 'Finance', icon: '📈', x: 280, y: 800 },
    { category: 'Enemies', icon: '🛡️', x: 520, y: 800 },
    { category: 'Parents', icon: '👴', x: 400, y: 850 },
];

const SampleChart = () => {
    const renderPath = (x1, y1, x2, y2) => {
        // Use more direct lines but with soft curves to avoid mess
        const midX = (x1 + x2) / 2;
        return (
            <path
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="rgba(255, 215, 0, 0.2)"
                strokeWidth="1.5"
                className="sample-path-animated"
                style={{ transition: 'stroke 0.3s ease' }}
            />
        );
    };

    return (
        <div className="sample-page bg-deep">
            {/* Global Styles for SVG 3D Nodes */}
            <style>{`
                .sample-insight-node {
                    transition: transform 0.2s ease, filter 0.2s ease;
                    cursor: pointer;
                }
                .sample-insight-node:hover {
                    transform: translateY(-5px) scale(1.02) !important;
                    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
                }
                .sample-insight-node:hover ellipse, 
                .sample-insight-node:hover rect {
                    stroke: var(--primary) !important;
                    stroke-width: 2 !important;
                }
                @keyframes dash-flow {
                    from { stroke-dashoffset: 20; }
                    to { stroke-dashoffset: 0; }
                }
                .sample-path-animated {
                    stroke-dasharray: 4,4;
                    animation: dash-flow 0.5s linear infinite;
                }
            `}</style>

            <header className="header glass">
                <Link to="/" className="logo gold-text">AstroRevo</Link>
                <nav className="nav">
                    <Link to="/">Back to Home</Link>
                    <button className="cta-btn shadow-3d">Initialize Engine</button>
                </nav>
            </header>

            <main className="sample-content">
                <div className="sample-intro">
                    <h1 className="gold-text">AstroRevo AI Diagnostics</h1>
                    <p>Live visualization of the 21 neural pathways connecting Vedic Siddhanta to AI Interpretation.</p>
                </div>

                <div className="sample-chart-canvas no-grid">
                    <svg viewBox="0 0 1000 950" className="sample-svg">
                        <defs>
                            <filter id="neonGlowSample">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Central Node */}
                        <g transform="translate(500, 450)" className="central-chart-node">
                            <circle r="140" fill="rgba(255, 215, 0, 0.03)" stroke="var(--primary)" strokeWidth="1" strokeDasharray="10,5" />
                            <circle r="110" fill="rgba(10, 10, 25, 0.95)" stroke="var(--primary)" strokeWidth="2" filter="url(#neonGlowSample)" />

                            <text textAnchor="middle" dy="-5" fill="var(--primary)" fontWeight="bold" fontSize="18" letterSpacing="2px">VEDIC ENGINE</text>
                            <text textAnchor="middle" dy="15" fill="rgba(255,255,255,0.6)" fontSize="9">Neural Interpretation Matrix</text>
                        </g>

                        {sampleInsights.map((insight, i) => {
                            const nodeWidth = 200;
                            const nodeHeight = 50;

                            // Calculate anchor point on the box closest to the center
                            const isLeft = insight.x < 400;
                            const isRight = insight.x > 600;

                            let anchorX = insight.x + nodeWidth / 2;
                            if (isLeft) anchorX = insight.x + nodeWidth;
                            else if (isRight) anchorX = insight.x;

                            const anchorY = insight.y + nodeHeight / 2;

                            return (
                                <g key={i}>
                                    {renderPath(anchorX, anchorY, 500, 450)}
                                    <g transform={`translate(${insight.x}, ${insight.y})`} className="sample-insight-node">
                                        <rect
                                            width={nodeWidth} height={nodeHeight} rx="12"
                                            fill="rgba(20, 20, 40, 0.8)"
                                            stroke="rgba(255, 215, 0, 0.2)"
                                            strokeWidth="1"
                                        />
                                        <text x="15" y="32" fontSize="20">{insight.icon}</text>
                                        <text x="45" y="30" fill="var(--primary)" fontSize="11" fontWeight="bold" letterSpacing="1px">{insight.category.toUpperCase()}</text>
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
