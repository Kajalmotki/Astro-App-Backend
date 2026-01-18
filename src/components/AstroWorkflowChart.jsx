import React, { useMemo } from 'react';

const AstroWorkflowChart = () => {
    const categories = [
        { id: 'love', label: 'Heart & Union', icon: '❤️', x: 800, y: 150, questions: ['Soulmate?', 'Marriage?', 'The Ex?'] },
        { id: 'wealth', label: 'Fortune & Assets', icon: '💰', x: 800, y: 350, questions: ['Money?', 'Property?', 'Stocks?'] },
        { id: 'career', label: 'Path & Purpose', icon: '💼', x: 800, y: 550, questions: ['Promotion?', 'Business?', 'Change?'] },
        { id: 'spirit', label: 'Soul & Karma', icon: '🧘', x: 800, y: 750, questions: ['Purpose?', 'Moksha?', 'Karma?'] },
        { id: 'vitality', label: 'Health & Self', icon: '🏥', x: 200, y: 450, questions: ['Health?', 'Charisma?', 'Legal?'] },
    ];

    const renderPath = (x1, y1, x2, y2, dashed = false) => {
        const cx = (x1 + x2) / 2;
        return (
            <path
                d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeDasharray={dashed ? "5,5" : "0"}
                opacity={dashed ? "0.3" : "0.6"}
            />
        );
    };

    return (
        <div className="workflow-container glass-card">
            <svg viewBox="0 0 1100 900" className="workflow-svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.05)" />
                    </pattern>
                    <filter id="glow-gold">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background Grid */}
                <rect width="1100" height="900" fill="url(#grid)" />

                {/* --- Central Engine (The Mirror Globe) --- */}
                <g transform="translate(500, 400)">
                    <circle r="60" fill="rgba(25, 25, 50, 0.8)" stroke="var(--primary)" strokeWidth="2" filter="url(#glow-gold)" />
                    {/* Mirror Globe inner details */}
                    <circle r="45" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.3" strokeDasharray="2,2" />
                    <path d="M-30 0 Q0 20 30 0 M-30 -10 Q0 10 30 -10 M-30 10 Q0 30 30 10" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.4" />
                    <text textAnchor="middle" dy="5" fill="var(--primary)" fontWeight="bold" fontSize="12">AstroAI Agent</text>
                    <text textAnchor="middle" dy="25" fill="var(--text-dim)" fontSize="8">Engine v3.0</text>

                    {/* Pulsing Core */}
                    <circle r="5" fill="#fff" filter="url(#glow-gold)">
                        <animate attributeName="r" values="4;7;4" dur="3s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* --- Connections & Nodes --- */}

                {/* Input Trigger */}
                <g transform="translate(100, 400)">
                    <rect x="-80" y="-40" width="160" height="80" rx="20" className="node-bg" />
                    <text x="0" y="-10" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Birth Details</text>
                    <text x="0" y="10" textAnchor="middle" fill="var(--text-dim)" fontSize="10">Submit Form</text>
                    <circle cx="80" cy="0" r="4" fill="var(--primary)" />
                </g>
                {renderPath(180, 400, 450, 400)}

                {/* Knowledge Sources (Bottom Nodes) */}
                {[
                    { label: 'Vedic Sutras', x: 350, y: 650 },
                    { label: 'Transit Data', x: 500, y: 650 },
                    { label: 'Chart Memory', x: 650, y: 650 }
                ].map((node, i) => (
                    <g key={i} transform={`translate(${node.x}, ${node.y})`}>
                        <circle r="30" className="node-bg-circle" />
                        <text textAnchor="middle" dy="5" fill="var(--text-dim)" fontSize="9">{node.label}</text>
                        <circle cy="-30" r="4" fill="var(--primary)" />
                        {renderPath(node.x, node.y - 30, 500, 460, true)}
                    </g>
                ))}

                {/* 21 Question Category Hubs (The Workflow Flow) */}
                {categories.map((cat, i) => {
                    const isLeft = cat.x < 500;
                    return (
                        <g key={cat.id}>
                            {/* Connection to Engine */}
                            {renderPath(500, 400, cat.x - (isLeft ? -100 : 100), cat.y)}

                            <g transform={`translate(${cat.x}, ${cat.y})`}>
                                <rect x="-100" y="-40" width="200" height="80" rx="15" className="category-node" />
                                <text x="-70" y="5" fontSize="20">{cat.icon}</text>
                                <text x="0" y="-5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">{cat.label}</text>
                                <text x="0" y="15" textAnchor="middle" fill="var(--primary)" fontSize="9" opacity="0.8">Active Mapping</text>

                                {/* Individual Question Branches */}
                                {cat.questions.map((q, j) => {
                                    const qX = cat.x + (isLeft ? -150 : 150);
                                    const qY = cat.y + (j - 1) * 35;
                                    return (
                                        <g key={j}>
                                            {renderPath(cat.x + (isLeft ? -100 : 100), cat.y, qX, qY, true)}
                                            <g transform={`translate(${qX}, ${qY})`}>
                                                <rect x="-60" y="-12" width="120" height="24" rx="12" className="question-node" />
                                                <text textAnchor="middle" dy="4" fill="#fff" fontSize="8">{q}</text>
                                            </g>
                                        </g>
                                    );
                                })}
                            </g>
                        </g>
                    );
                })}

                {/* Animated Data Particles */}
                <circle r="2" fill="var(--primary)">
                    <animateMotion
                        path="M 180 400 C 315 400, 315 400, 450 400"
                        dur="2s" repeatCount="indefinite"
                    />
                </circle>
                <circle r="2" fill="var(--primary)">
                    <animateMotion
                        path="M 510 400 C 630 400, 630 150, 750 150"
                        dur="3s" repeatCount="indefinite"
                    />
                </circle>
            </svg>

            <div className="workflow-overlay">
                <h3 className="gold-text">AstroRevo Workflow Engine</h3>
                <p>Connecting {21} Life Points through AI Precision</p>
            </div>
        </div>
    );
};

export default AstroWorkflowChart;
