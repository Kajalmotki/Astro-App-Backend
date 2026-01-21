import React, { useState, useEffect } from 'react';

const AstroWorkflowChart = () => {
    // --- Configuration ---
    // Deep Blue & Gold Theme (RESTORED)
    const COLORS = {
        primary: '#FFD700',   // Gold
        primaryGlow: 'rgba(255, 215, 0, 0.4)',
        bg: 'transparent',
        nodeBg: 'rgba(20, 20, 40, 0.8)', // Glassy dark
        nodeBorder: 'rgba(255, 215, 0, 0.3)',
        text: '#E0E0E0',
        textHighlight: '#FFD700',
        line: 'rgba(255, 215, 0, 0.15)'
    };

    const NODE_DATA = [
        { id: 'n1', label: 'START TRIGGER', sub: 'Webhook', type: 'trigger' },
        { id: 'n2', label: 'SIDDHANTA', sub: 'Surya Siddhanta', type: 'calc' },
        { id: 'n3', label: 'AYANAMSA', sub: 'Lahiri / D1', type: 'calc' },
        { id: 'n4', label: 'PANCHANGA', sub: 'Graha Laghava', type: 'calc' },
        { id: 'n5', label: 'RASHI & BHAVA', sub: 'B.P.H.S.', type: 'logic' },
        { id: 'n6', label: 'KARAKA', sub: '7 Karakas', type: 'logic' },
        { id: 'n7', label: 'DRISHTI', sub: 'Aspects', type: 'logic' },
        { id: 'n8', label: 'ARUDHA', sub: 'AL / A7 / A10', type: 'logic' },
        { id: 'n9', label: 'DASHA', sub: 'Chara Dasha', type: 'logic' },
        { id: 'n10', label: 'NIMITTA', sub: 'Modifiers', type: 'mod' },
        { id: 'n11', label: 'KUNDLI GEN', sub: 'Output', type: 'output' },
        { id: 'n12', label: 'MUHURTHA', sub: 'Delivery', type: 'gate' },
    ];

    // --- Circular Layout Calculation ---
    const calculateNodes = () => {
        const cx = 500;
        const cy = 400;
        const r = 280; // Radius for main nodes

        return NODE_DATA.map((node, i) => {
            const startAngle = -Math.PI / 2;
            const theta = startAngle + (i * (Math.PI * 2 / 12));

            return {
                ...node,
                x: cx + r * Math.cos(theta),
                y: cy + r * Math.sin(theta)
            };
        });
    };

    const nodes = calculateNodes();

    const generateLoopPath = () => {
        let d = `M ${nodes[0].x} ${nodes[0].y}`;
        nodes.forEach((node, i) => {
            if (i === 0) return;
            d += ` L ${node.x} ${node.y}`;
        });
        d += ` Z`;
        return d;
    };

    const loopPath = generateLoopPath();

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            userSelect: 'none'
        }}>
            <style>{`
                @keyframes dash {
                    to { stroke-dashoffset: -1000; }
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes orbit {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes rot-reverse {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .orbit-ring {
                    stroke: rgba(255, 215, 0, 0.1);
                    fill: none;
                }
                .planet {
                @keyframes chanting-pulse {
                    0% { transform: scale(0.65); opacity: 0.8; filter: drop-shadow(0 0 5px gold); }
                    50% { transform: scale(0.75); opacity: 1; filter: drop-shadow(0 0 15px gold); }
                    100% { transform: scale(0.65); opacity: 0.8; filter: drop-shadow(0 0 5px gold); }
                }
                .om-symbol {
                    animation: chanting-pulse 3s ease-in-out infinite;
                    transform-origin: center;
                }
                @keyframes om-breathe {
                    0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
                    20% { opacity: 0.8; }
                    80% { opacity: 0.8; }
                    100% { transform: translate(var(--tx), var(--ty)) scale(var(--s)) rotate(var(--r)); opacity: 0; }
                }
                .breathing-om {
                    animation: om-breathe var(--d) ease-in-out infinite;
                    font-size: 8px;
                    fill: gold;
                    pointer-events: none;
                    filter: drop-shadow(0 0 3px gold);
                }
            `}</style>

            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="1000" height="800" viewBox="0 0 1000 800" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* --- CENTRAL AREA (CLEANED) --- */}
                    <g transform="translate(500, 400)">
                        {/* Breathing OM Particles (Emanating from Center) */}
                        <g>
                            {[...Array(24)].map((_, i) => {
                                const angle = (i / 24) * Math.PI * 2;
                                const dist = 80 + Math.random() * 100;
                                return (
                                    <text
                                        key={i}
                                        className="breathing-om"
                                        textAnchor="middle"
                                        style={{
                                            '--tx': `${Math.cos(angle) * dist}px`,
                                            '--ty': `${Math.sin(angle) * dist}px`,
                                            '--s': 0.5 + Math.random() * 1.5,
                                            '--r': `${Math.random() * 360}deg`,
                                            '--d': `${3 + Math.random() * 4}s`,
                                            animationDelay: `${i * 0.2}s`
                                        }}
                                    >
                                        ॐ
                                    </text>
                                );
                            })}
                        </g>

                        {/* Brand Group */}
                        <g transform="translate(0, 0)">
                            {/* AstroRevo Text (Centered) */}
                            <text
                                textAnchor="middle"
                                y="0"
                                fill={COLORS.primary}
                                style={{ fontSize: '38px', fontWeight: '800', fontFamily: "'Playfair Display', serif", filter: 'url(#glow)' }}
                            >
                                AstroRevo
                            </text>

                            {/* Slogan */}
                            <text
                                textAnchor="middle"
                                y="25"
                                fill="#ffffff"
                                opacity="0.8"
                                style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase' }}
                            >
                                Ancient Wisdom, Instant Clarity.
                            </text>
                        </g>
                    </g>

                    {/* Passive Loop Path */}
                    <path
                        d={loopPath}
                        fill="none"
                        stroke={COLORS.line}
                        strokeWidth="1.5"
                    />

                    {/* Active Scanning Beam */}
                    <path
                        d={loopPath}
                        fill="none"
                        stroke={COLORS.primary}
                        strokeWidth="2.5"
                        strokeDasharray="40 160"
                        style={{
                            animation: 'dash 4s linear infinite',
                            filter: 'url(#glow)'
                        }}
                    />

                    {/* Nodes */}
                    {nodes.map((node, i) => (
                        <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                            {/* Glow behind node */}
                            <circle r="10" fill={COLORS.primaryGlow} filter="url(#glow)" opacity="0.5" />

                            {/* Node Content */}
                            <foreignObject x="-65" y="-28" width="130" height="56" style={{ overflow: 'visible' }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: COLORS.nodeBg,
                                    backdropFilter: 'blur(8px)',
                                    border: `1px solid ${COLORS.nodeBorder}`,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '4px',
                                    boxShadow: `0 8px 16px rgba(0,0,0,0.4), 0 0 5px ${COLORS.nodeBorder}`,
                                    animation: 'float 4s ease-in-out infinite',
                                    animationDelay: `${i * 0.3}s`
                                }}>
                                    <div style={{ fontSize: '7px', color: COLORS.textHighlight, marginBottom: '2px', textTransform: 'uppercase', opacity: 0.8 }}>{node.sub}</div>
                                    <div style={{ fontSize: '9px', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: '0.5px' }}>{node.label}</div>
                                </div>
                            </foreignObject>

                            {/* Connecting Anchor Point */}
                            <circle r="3" fill={COLORS.primary} filter="url(#glow)" />
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default AstroWorkflowChart;
