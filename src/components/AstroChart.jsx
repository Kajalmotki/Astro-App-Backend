import React, { useMemo } from 'react';

const AstroChart = () => {
    // Generate complex fractal-like patterns for a premium look
    const orbits = useMemo(() => [
        { r: 95, dash: "2,4", speed: "40s", opacity: 0.2 },
        { r: 85, dash: "10,5", speed: "60s", opacity: 0.4 },
        { r: 75, dash: "1,1", speed: "30s", opacity: 0.15 },
        { r: 60, dash: "0", speed: "120s", opacity: 0.5, glow: true },
        { r: 40, dash: "5,15", speed: "20s", opacity: 0.3 }
    ], []);

    const zodiacSigns = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

    return (
        <div className="astro-chart-wrapper">
            <div className="glow-effect"></div>
            <svg viewBox="0 0 200 200" className="chart-svg">
                <defs>
                    <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style={{ stopColor: '#FFE770', stopOpacity: 1 }} />
                        <stop offset="70%" style={{ stopColor: '#D4AF37', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#8B6508', stopOpacity: 1 }} />
                    </radialGradient>

                    <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <filter id="innerGlow">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feFlood floodColor="#FFD700" floodOpacity="0.5" result="color" />
                        <feComposite in="color" in2="blur" operator="in" />
                        <feComposite in="SourceGraphic" operator="over" />
                    </filter>
                </defs>

                {/* Background Rings with different rotation speeds */}
                {orbits.map((o, i) => (
                    <circle
                        key={i}
                        cx="100" cy="100" r={o.r}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth={o.glow ? "1" : "0.5"}
                        strokeDasharray={o.dash}
                        opacity={o.opacity}
                        style={{
                            animation: `rotate ${o.speed} linear infinite`,
                            transformOrigin: 'center',
                            filter: o.glow ? 'url(#goldGlow)' : 'none'
                        }}
                    />
                ))}

                {/* Zodiac Belt */}
                <g style={{ animation: 'rotate 180s linear infinite', transformOrigin: 'center' }}>
                    {zodiacSigns.map((sign, i) => {
                        const angle = (i * 30) * (Math.PI / 180);
                        const x = 100 + 72 * Math.cos(angle);
                        const y = 100 + 72 * Math.sin(angle);
                        return (
                            <text
                                key={i} x={x} y={y}
                                fill="var(--primary)"
                                fontSize="6"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                opacity="0.6"
                                style={{ transform: `rotate(${(i * 30) + 90}deg)`, transformOrigin: `${x}px ${y}px` }}
                            >
                                {sign}
                            </text>
                        );
                    })}
                </g>

                {/* Future Mirror Globe */}
                <g className="mirror-globe">
                    <defs>
                        <radialGradient id="globeBase" cx="40%" cy="40%" r="50%">
                            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.9 }} />
                            <stop offset="30%" style={{ stopColor: '#FFD700', stopOpacity: 0.6 }} />
                            <stop offset="100%" style={{ stopColor: '#1a1a2e', stopOpacity: 1 }} />
                        </radialGradient>

                        <linearGradient id="globeReflection" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.4 }} />
                            <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                        </linearGradient>

                        <filter id="globeGlow">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Outer Atmosphere/Glow */}
                    <circle cx="100" cy="100" r="35" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.2" filter="url(#goldGlow)" />

                    {/* Tech Rings around Globe */}
                    <g style={{ animation: 'rotate 10s linear infinite', transformOrigin: 'center' }}>
                        <path d="M70 100 A30 30 0 0 1 130 100" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.6" strokeDasharray="2,2" />
                    </g>
                    <g style={{ animation: 'rotate 15s reverse linear infinite', transformOrigin: 'center' }}>
                        <path d="M100 70 A30 30 0 0 1 100 130" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.6" strokeDasharray="1,2" />
                    </g>

                    {/* Main Globe Body */}
                    <circle cx="100" cy="100" r="28" fill="url(#globeBase)" filter="url(#globeGlow)" />

                    {/* Mirror Highlight / Reflection */}
                    <ellipse cx="92" cy="88" rx="12" ry="8" fill="url(#globeReflection)" transform="rotate(-30 92 88)" />

                    {/* Tech Grid on Globe */}
                    <path d="M75 100 Q100 115 125 100 M75 90 Q100 105 125 90 M75 110 Q100 125 125 110" fill="none" stroke="var(--primary)" strokeWidth="0.2" opacity="0.3" />
                    <path d="M100 75 Q115 100 100 125 M90 75 Q105 100 90 125 M110 75 Q125 100 110 125" fill="none" stroke="var(--primary)" strokeWidth="0.2" opacity="0.3" />

                    {/* Core Pulse */}
                    <circle cx="100" cy="100" r="2" fill="#fff" filter="url(#goldGlow)">
                        <animate attributeName="r" values="1;3;1" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Interactive Dots for 21 Questions */}
                <g>
                    {[...Array(21)].map((_, i) => {
                        const angle = (i * 360 / 21) * (Math.PI / 180);
                        const r = 85;
                        const x = 100 + r * Math.cos(angle);
                        const y = 100 + r * Math.sin(angle);
                        return (
                            <circle
                                key={i} cx={x} cy={y} r="1.5"
                                fill="var(--primary)"
                                filter="url(#innerGlow)"
                            >
                                <animate attributeName="r" values="1;2.5;1" dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.3;1;0.3" dur={`${3 + Math.random() * 2}s`} repeatCount="indefinite" />
                            </circle>
                        );
                    })}
                </g>

                {/* Center Star */}
                <circle cx="100" cy="100" r="4" fill="url(#goldGradient)" filter="url(#goldGlow)">
                    <animate attributeName="r" values="4;6;4" dur="4s" repeatCount="indefinite" />
                </circle>
            </svg>

            <div className="chart-label">
                <span className="gold-text">Calibrating Destiny...</span>
            </div>
        </div>
    );
};

export default AstroChart;
