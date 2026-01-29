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
                {/* Future Mirror Globe - REMOVED */}
                {/* <g className="mirror-globe"> ... </g> */}

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
