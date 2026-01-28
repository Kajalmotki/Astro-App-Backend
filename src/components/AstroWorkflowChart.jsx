import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthModal';
import OmPlayer from './OmPlayer';

const AstroWorkflowChart = ({ onLoginClick, onMembershipClick }) => {
    const { user } = useAuth();
    // --- Configuration ---
    // Deep Blue & Gold Theme (RESTORED)
    const COLORS = {
        primary: '#2E8B57',   // Emerald Green
        primaryGlow: 'rgba(46, 139, 87, 0.3)',
        bg: 'transparent',
        nodeBg: 'rgba(5, 10, 20, 0.8)', // Deep Navy Glass
        nodeBorder: 'rgba(46, 139, 87, 0.4)',
        text: '#FAFAFA', // Moonlight White
        textHighlight: '#2E8B57',
        line: 'rgba(255, 255, 255, 0.08)'
    };

    const NODE_DATA = [
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
        const r = 350; // Increased radius to prevent overlap

        return NODE_DATA.map((node, i) => {
            const startAngle = -Math.PI / 2;
            const theta = startAngle + (i * (Math.PI * 2 / NODE_DATA.length));

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
                @keyframes rotation {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes rotation-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .mandala-ring-1 {
                    animation: rotation 60s linear infinite;
                    transform-origin: center;
                }
                .mandala-ring-2 {
                    animation: rotation-reverse 40s linear infinite;
                    transform-origin: center;
                }
                .orbiting-text {
                    animation: rotation 30s linear infinite;
                    transform-origin: center;
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
                        <clipPath id="circleClip">
                            <circle cx="0" cy="0" r="60" />
                        </clipPath>
                    </defs>

                    {/* --- CENTRAL AREA (CLEANED) --- */}
                    <g transform="translate(500, 400)">
                        {/* Breathing Particles */}
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

                        <g transform="translate(0, 0)">
                            {/* Premium Mandala Elements */}


                            {/* Hexagonal Shield */}
                            <path
                                d="M 0,-75 L 65,-37.5 L 65,37.5 L 0,75 L -65,37.5 L -65,-37.5 Z"
                                fill="rgba(5, 10, 20, 0.8)"
                                stroke="gold"
                                strokeWidth="0.5"
                                opacity="0.6"
                            />

                            {/* Orbiting Insight Text */}
                            <defs>
                                <path id="insightPath" d="M -110, 0 A 110,110 0 1,1 110,0 A 110,110 0 1,1 -110,0" />
                            </defs>
                            <g className="orbiting-text">
                                <text style={{ fontSize: '9px', fill: 'gold', textTransform: 'uppercase', letterSpacing: '4px', opacity: 0.5 }}>
                                    <textPath href="#insightPath" startOffset="0%">
                                        • Vedic Intelligence Engine • Decoding Destiny • Real-time Karma Mapping • Ancient Surya Siddhanta Logic •
                                    </textPath>
                                </text>
                            </g>

                            {/* Central Insight Labels */}
                            <text y="-45" textAnchor="middle" style={{ fontSize: '8px', fill: 'gold', opacity: 0.4, fontWeight: '700', letterSpacing: '2px' }}>CORE ENGINE</text>
                            <text y="55" textAnchor="middle" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>PROCESSING 21 VECTORS</text>

                            <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                    fontSize: '70px',
                                    fill: 'gold',
                                    fontFamily: 'serif',
                                    filter: 'url(#glow)',
                                    opacity: 0.9
                                }}
                            >
                                ॐ
                            </text>
                        </g>
                    </g>

                    {/* Passive Loop Path */}


                    {/* Nodes */}
                    {nodes.map((node, i) => (
                        <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                            {/* Glow behind node */}
                            <circle r="10" fill={COLORS.primaryGlow} filter="url(#glow)" opacity="0.5" />

                            {/* Node Content */}
                            <foreignObject x="-80" y="-35" width="160" height="70" style={{ overflow: 'visible' }}>
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
                                    <div style={{ fontSize: '10px', color: COLORS.textHighlight, marginBottom: '2px', textTransform: 'uppercase', opacity: 0.9, fontWeight: '700' }}>{node.sub}</div>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: COLORS.text, textAlign: 'center', letterSpacing: '0.5px' }}>{node.label}</div>
                                </div>
                            </foreignObject>

                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default AstroWorkflowChart;
