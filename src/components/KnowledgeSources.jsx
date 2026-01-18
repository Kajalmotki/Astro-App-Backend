import React from 'react';
import { Link } from 'react-router-dom';

const sources = [
    { name: 'Atharva Veda', category: 'Foundation', x: 100, y: 150 },
    { name: 'Vedanga Jyotisha', category: 'Astronomy', x: 100, y: 300 },
    { name: 'Brihat Parashara Hora Shastra', category: 'Core Principles', x: 100, y: 450 },
    { name: 'Brihat Jataka', category: 'Natal Astrology', x: 100, y: 600 },
    { name: 'Saravali', category: 'Classical Compendium', x: 300, y: 100 },
    { name: 'Phaladeepika', category: 'Predictive Insights', x: 300, y: 250 },
    { name: 'Jataka Parijata', category: 'Planetary Logic', x: 300, y: 500 },
    { name: 'Hora Ratnam', category: 'Gem of Time', x: 300, y: 650 },
    { name: 'Uttara Kalamrita', category: 'Ultimate Wisdom', x: 300, y: 750 },
];

const KnowledgeSources = () => {
    const renderPath = (x1, y1, x2, y2) => {
        const cx = (x1 + x2) / 2;
        return (
            <path
                d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeDasharray="5,5"
                className="source-path"
            />
        );
    };

    return (
        <div className="knowledge-page bg-deep">
            <header className="header glass">
                <Link to="/" className="logo gold-text">AstroRevo</Link>
                <nav className="nav">
                    <Link to="/">Back to Home</Link>
                    <button className="cta-btn">Initialize Engine</button>
                </nav>
            </header>

            <main className="knowledge-content">
                <div className="knowledge-intro">
                    <h1 className="gold-text">The Knowledge Core</h1>
                    <p>Processing the foundations of Vedic Ancient Wisdom through the AstroRevo Neural Engine.</p>
                </div>

                <div className="knowledge-canvas-container glass-card">
                    <svg viewBox="0 0 1000 850" className="knowledge-svg">
                        <defs>
                            <pattern id="gridLarge" width="80" height="80" patternUnits="userSpaceOnUse">
                                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            </pattern>
                            <filter id="neonGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <rect width="1000" height="850" fill="url(#gridLarge)" />

                        {/* Central Engine Node */}
                        <g transform="translate(750, 425)" className="engine-node">
                            <circle r="120" className="engine-outer-glow" />
                            <circle r="100" fill="rgba(15, 12, 41, 0.9)" stroke="var(--primary)" strokeWidth="3" filter="url(#neonGlow)" />
                            {/* Sacred Geometry Overlays */}
                            <path d="M-60-35 L60-35 L0 70 Z" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.3" />
                            <path d="M-60 35 L60 35 L0 -70 Z" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.3" />

                            <text textAnchor="middle" dy="-20" fill="var(--primary)" fontWeight="bold" fontSize="16">AstroRevo</text>
                            <text textAnchor="middle" dy="5" fill="#fff" fontWeight="bold" fontSize="14">Chart Engine</text>
                            <text textAnchor="middle" dy="25" fill="var(--text-dim)" fontSize="10">Quantum Calibration Active</text>

                            <circle r="6" fill="#fff" filter="url(#neonGlow)">
                                <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* Knowledge Source Nodes */}
                        {sources.map((s, i) => (
                            <g key={i}>
                                {renderPath(s.x + 150, s.y, 650, 425)}
                                <g transform={`translate(${s.x}, ${s.y})`} className="source-node">
                                    <rect x="0" y="-30" width="180" height="60" rx="10" className="node-rect" />
                                    <text x="15" y="-10" fill="var(--primary)" fontSize="8" fontWeight="bold" opacity="0.7">{s.category}</text>
                                    <text x="15" y="10" fill="#fff" fontSize="10" fontWeight="600">{s.name}</text>
                                    <circle cx="180" cy="0" r="3" fill="var(--primary)" filter="url(#neonGlow)" />
                                </g>
                            </g>
                        ))}

                        {/* Predictive Output Streams */}
                        <g transform="translate(900, 425)">
                            {renderPath(850, 425, 950, 300)}
                            {renderPath(850, 425, 950, 425)}
                            {renderPath(850, 425, 950, 550)}
                            <text x="60" y="-130" fill="var(--primary)" fontSize="10" writingMode="tb">PREDICTIVE DATA</text>
                        </g>

                    </svg>
                </div>
            </main>

            <footer className="footer" style={{ marginTop: 'auto' }}>
                <p>&copy; 2026 AstroRevo. Ancient Wisdom Digitally Synchronized.</p>
            </footer>
        </div>
    );
};

export default KnowledgeSources;
