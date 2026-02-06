import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const sourcesData = [
    {
        id: 1,
        name: 'Atharva Veda',
        category: 'Foundation',
        x: 100, y: 150,
        author: 'Rishi Atharvan',
        significance: 'Source of Ayurveda & Occult Sciences',
        desc: 'Contains the earliest references to planetary remedies, healing mantras, and the mystical connection between the cosmos and human physiology.'
    },
    {
        id: 2,
        name: 'Vedanga Jyotisha',
        category: 'Astronomy',
        x: 100, y: 300,
        author: 'Lagadha',
        significance: 'Earliest treatise on Astronomy',
        desc: 'The foundational text dealing with time-keeping (Kala) for Vedic rituals, establishing the soli-lunar calendar system still used today.'
    },
    {
        id: 3,
        name: 'Brihat Parashara',
        category: 'Core Principles',
        x: 100, y: 450,
        author: 'Maharishi Parashara',
        significance: 'Bible of Vedic Astrology',
        desc: 'The most comprehensive classic (Hora Shastra) covering foundational rules, divisional charts, dasha systems, and planetary states (Avasthas).'
    },
    {
        id: 4,
        name: 'Brihat Jataka',
        category: 'Natal Astrology',
        x: 100, y: 600,
        author: 'Varahamihira',
        significance: 'Analytical & Mathematical Precision',
        desc: 'A masterpiece known for its terse, potent verses on natal horoscopy, offering complex yogas and precise predictive methods.'
    },
    {
        id: 5,
        name: 'Saravali',
        category: 'Classical Compendium',
        x: 300, y: 100,
        author: 'Kalyana Varma',
        significance: 'Detailed Yoga Analysis',
        desc: 'Expands on the brief aphorisms of earlier rishis, providing elaborate results for planetary conjunctions and Nabhasa Yogas.'
    },
    {
        id: 6,
        name: 'Phaladeepika',
        category: 'Predictive Insights',
        x: 300, y: 250,
        author: 'Mantreswara',
        significance: 'Practical Predictive Gems',
        desc: 'Revered for its clarity on Transits (Gochar), Dusthana houses, and specific effects of planetary positions not found elsewhere.'
    },
    {
        id: 7,
        name: 'Jataka Parijata',
        category: 'Planetary Logic',
        x: 300, y: 500,
        author: 'Vaidyanatha Dikshita',
        significance: 'Complex Planetary Conditions',
        desc: 'dives deep into planetary strengths, Raja Yogas, and the intricate calculation of longevity and death (Maraka) periods.'
    },
    {
        id: 8,
        name: 'Hora Ratnam',
        category: 'Gem of Time',
        x: 300, y: 650,
        author: 'Balabhadra',
        significance: 'Compilation of Diverse Schools',
        desc: 'An encyclopedic work referencing diverse opinions from ancient sages like Garga and Narada, reconciling contradictions.'
    },
    {
        id: 9,
        name: 'Uttara Kalamrita',
        category: 'Ultimate Wisdom',
        x: 300, y: 750,
        author: 'Kalidasa',
        significance: 'Retrograde & Nodes Secrets',
        desc: 'A specialized text famous for its unique principles on Retrograde planets (Vakri) and the nodes Rahu/Ketu.'
    },
];

const KnowledgeSources = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNode, setSelectedNode] = useState(null);

    const filteredSources = sourcesData.map(source => ({
        ...source,
        isDimmed: searchTerm && !source.name.toLowerCase().includes(searchTerm.toLowerCase()) && !source.category.toLowerCase().includes(searchTerm.toLowerCase())
    }));

    const renderPath = (x1, y1, x2, y2, isDimmed) => {
        const cx = (x1 + x2) / 2;
        return (
            <path
                d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={isDimmed ? "rgba(255, 255, 255, 0.05)" : "var(--primary)"}
                strokeWidth="1.5"
                strokeDasharray="5,5"
                className="source-path"
                style={{ transition: 'stroke 0.3s ease' }}
            />
        );
    };

    return (
        <div className="knowledge-page bg-deep">
            <header className="header glass">
                <Link to="/" className="logo gold-text">AstroRevo</Link>
                <nav className="nav">
                    <Link to="/">Back to Home</Link>
                </nav>
            </header>

            <main className="knowledge-content">
                <style>{`
                    .source-node {
                        transition: all 0.3s ease;
                        cursor: pointer;
                    }
                    .source-node:hover {
                        transform: translateY(-5px) scale(1.05);
                        filter: drop-shadow(0 0 15px var(--primary));
                    }
                    .source-node.dimmed {
                        opacity: 0.2;
                        filter: grayscale(100%);
                    }
                    .search-container {
                        position: absolute;
                        top: 100px;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 20;
                        width: 100%;
                        max-width: 500px;
                    }
                    .search-input {
                        width: 100%;
                        padding: 15px 25px;
                        background: rgba(10, 15, 30, 0.8);
                        border: 1px solid var(--primary);
                        border-radius: 30px;
                        color: #fff;
                        font-family: inherit;
                        font-size: 1.1rem;
                        backdrop-filter: blur(10px);
                        box-shadow: 0 0 20px rgba(0,0,0,0.5);
                        outline: none;
                        transition: box-shadow 0.3s ease;
                    }
                    .search-input:focus {
                        box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
                    }
                    .detail-panel {
                        position: fixed;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        width: 400px;
                        background: rgba(11, 19, 43, 0.95);
                        backdrop-filter: blur(20px);
                        border-left: 1px solid var(--primary);
                        padding: 40px;
                        z-index: 100;
                        transform: translateX(100%);
                        transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                        box-shadow: -10px 0 30px rgba(0,0,0,0.8);
                        overflow-y: auto;
                    }
                    .detail-panel.open {
                        transform: translateX(0);
                    }
                    .detail-label {
                        color: var(--text-dim);
                        font-size: 0.9rem;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 5px;
                        display: block;
                    }
                    .detail-value {
                        color: #fff;
                        font-size: 1.1rem;
                        margin-bottom: 20px;
                        line-height: 1.6;
                    }
                    .close-btn {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background: none;
                        border: none;
                        color: var(--primary);
                        font-size: 1.5rem;
                        cursor: pointer;
                    }
                `}</style>

                <div className="knowledge-intro">
                    <h1 className="gold-text">The Knowledge Core</h1>
                    <p>Interactive Archive of Vedic Wisdom</p>
                </div>

                {/* Search Bar */}
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search scriptures, authors, or topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="knowledge-canvas-container glass-card" onClick={() => setSelectedNode(null)}>
                    <svg viewBox="0 0 1000 850" className="knowledge-svg" onClick={(e) => e.stopPropagation()}>
                        <defs>
                            <filter id="neonGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Central Engine Node */}
                        <g transform="translate(750, 425)" className="engine-node">
                            <circle r="120" className="engine-outer-glow" />
                            <circle r="100" fill="rgba(15, 12, 41, 0.9)" stroke="var(--primary)" strokeWidth="3" filter="url(#neonGlow)" />

                            <text textAnchor="middle" dy="-20" fill="var(--primary)" fontWeight="bold" fontSize="16">AstroRevo</text>
                            <text textAnchor="middle" dy="5" fill="#fff" fontWeight="bold" fontSize="14">Chart Engine</text>
                            <text textAnchor="middle" dy="25" fill="var(--text-dim)" fontSize="10">Quantum Calibration Active</text>

                            <circle r="6" fill="#fff" filter="url(#neonGlow)">
                                <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* Knowledge Source Nodes */}
                        {filteredSources.map((s, i) => (
                            <g key={s.id} onClick={() => setSelectedNode(s)}>
                                <path
                                    d={`M ${s.x + 150} ${s.y} C ${(s.x + 150 + 650) / 2} ${s.y}, ${(s.x + 150 + 650) / 2} 425, 650 425`}
                                    fill="none"
                                    stroke={s.isDimmed ? "rgba(255, 215, 0, 0.05)" : "rgba(255, 215, 0, 0.3)"}
                                    strokeWidth="1.5"
                                    className="source-path-animated"
                                />
                                <g
                                    transform={`translate(${s.x}, ${s.y})`}
                                    className={`source-node ${s.isDimmed ? 'dimmed' : ''}`}
                                >
                                    <rect x="0" y="-30" width="180" height="60" rx="10" className="node-rect" fill="rgba(20, 20, 40, 0.9)" stroke={selectedNode?.id === s.id ? "var(--primary)" : "rgba(255, 215, 0, 0.3)"} strokeWidth={selectedNode?.id === s.id ? "2" : "1"} />
                                    <text x="15" y="-10" fill="var(--primary)" fontSize="8" fontWeight="bold" opacity="0.7">{s.category}</text>
                                    <text x="15" y="10" fill="#fff" fontSize="10" fontWeight="600">{s.name}</text>
                                    <circle cx="180" cy="0" r="3" fill="var(--primary)" filter="url(#neonGlow)" />
                                </g>
                            </g>
                        ))}

                        {/* Output Streams */}
                        <g transform="translate(900, 425)">
                            {renderPath(850, 425, 950, 300, false)}
                            {renderPath(850, 425, 950, 425, false)}
                            {renderPath(850, 425, 950, 550, false)}
                            <text x="60" y="-130" fill="var(--primary)" fontSize="10" writingMode="tb">PREDICTIVE DATA</text>
                        </g>
                    </svg>
                </div>

                {/* Search overlay hints if no results */}
                {searchTerm && filteredSources.every(s => s.isDimmed) && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff' }}>
                        <h3>No scrolls found matching "{searchTerm}"</h3>
                    </div>
                )}
            </main>

            {/* Details Panel Sidebar */}
            <div className={`detail-panel ${selectedNode ? 'open' : ''}`}>
                {selectedNode && (
                    <>
                        <button className="close-btn" onClick={() => setSelectedNode(null)}>×</button>

                        <h2 className="gold-text" style={{ fontSize: '2rem', marginBottom: '10px' }}>{selectedNode.name}</h2>
                        <div style={{ width: '50px', height: '2px', background: 'var(--primary)', marginBottom: '30px' }}></div>

                        <div>
                            <span className="detail-label">Origin / Category</span>
                            <p className="detail-value">{selectedNode.category}</p>
                        </div>

                        <div>
                            <span className="detail-label">Attributed To</span>
                            <p className="detail-value">{selectedNode.author}</p>
                        </div>

                        <div>
                            <span className="detail-label">Core Significance</span>
                            <p className="detail-value" style={{ color: '#4ade80' }}>{selectedNode.significance}</p>
                        </div>

                        <div style={{ marginTop: '30px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
                            <span className="detail-label">About the Text</span>
                            <p className="detail-value" style={{ fontSize: '1rem', color: '#e0e0e0' }}>
                                {selectedNode.desc}
                            </p>
                        </div>

                        <button className="cta-btn secondary" style={{ width: '100%', marginTop: '40px' }}>
                            Access Original Verses
                        </button>
                    </>
                )}
            </div>

            <footer className="footer" style={{ marginTop: 'auto' }}>
                <p>&copy; 2026 AstroRevo. Ancient Wisdom Digitally Synchronized.</p>
            </footer>
        </div>
    );
};

export default KnowledgeSources;
