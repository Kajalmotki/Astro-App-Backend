import React, { useMemo } from 'react';

const AstroChart = ({ chartData, chartType, chartSvg, isLoading, error }) => {
    // Generate complex fractal-like patterns for a premium look
    const orbits = useMemo(() => [
        { r: 95, dash: "2,4", speed: "40s", opacity: 0.2 },
        { r: 85, dash: "10,5", speed: "60s", opacity: 0.4 },
        { r: 75, dash: "1,1", speed: "30s", opacity: 0.15 },
        { r: 60, dash: "0", speed: "120s", opacity: 0.5, glow: true },
        { r: 40, dash: "5,15", speed: "20s", opacity: 0.3 }
    ], []);

    const zodiacSigns = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

    // South Indian Chart Layout (Fixed Signs)
    // 12 Boxes. 
    // Pisces (0), Aries (1), Taurus (2), Gemini (3) - TOP ROW
    // Cancer (4) - Right Upper
    // Leo (5) - Right Lower
    // Virgo (6), Libra (7), Scorpio (8), Sagittarius (9) - BOTTOM ROW
    // Capricorn (10) - Left Lower
    // Aquarius (11) - Left Upper

    // Coords relative to 0-200 viewbox (each box approx 50x50)
    // Adjusted to match the grid lines we will draw
    const boxCenters = [
        { id: "Pisces", x: 25, y: 25, label: "Pisces" }, // 12
        { id: "Aries", x: 75, y: 25, label: "Aries" }, // 1
        { id: "Taurus", x: 125, y: 25, label: "Taurus" }, // 2
        { id: "Gemini", x: 175, y: 25, label: "Gemini" }, // 3

        { id: "Cancer", x: 175, y: 75, label: "Cancer" }, // 4
        { id: "Leo", x: 175, y: 125, label: "Leo" }, // 5

        { id: "Virgo", x: 175, y: 175, label: "Virgo" }, // 6
        { id: "Libra", x: 125, y: 175, label: "Libra" }, // 7
        { id: "Scorpio", x: 75, y: 175, label: "Scorpio" }, // 8
        { id: "Sagittarius", x: 25, y: 175, label: "Sagittarius" }, // 9

        { id: "Capricorn", x: 25, y: 125, label: "Capric" }, // 10
        { id: "Aquarius", x: 25, y: 75, label: "Aquar" } // 11
    ];

    if (error) {
        return (
            <div className="astro-chart-wrapper error-state">
                <div className="error-message" style={{ color: '#ff6b6b', textAlign: 'center', padding: '20px' }}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // Render JSON Data (South Indian Chart)
    // Supports chartType='json' OR if chartData is an object (autodetect)
    if ((chartType === 'json' || typeof chartData === 'object') && chartData && !chartData.substring) {
        // Prepare Planet Positions
        const planetsBySign = {};

        if (chartData.Planets) {
            Object.entries(chartData.Planets).forEach(([planet, data]) => {
                const sign = data.sign;
                if (!planetsBySign[sign]) planetsBySign[sign] = [];
                // Use short names
                const shorts = { "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me", "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke" };
                const pName = shorts[planet] || planet.substring(0, 2);
                planetsBySign[sign].push(`${pName} ${Math.floor(data.longitude % 30)}°`);
            });
        }

        // Add Ascendant
        if (chartData.Ascendant) {
            // Handle if Ascendant is object (python) or scalar
            const ascSign = chartData.Ascendant.sign || chartData.Ascendant;
            if (ascSign) {
                if (!planetsBySign[ascSign]) planetsBySign[ascSign] = [];
                planetsBySign[ascSign].push("Asc");
            }
        }

        return (
            <div className="astro-chart-wrapper" style={{ animation: 'none' }}>
                <div className="glow-effect"></div>
                <svg viewBox="0 0 200 200" className="chart-svg">
                    <defs>
                        <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Outer Box */}
                    <rect x="2" y="2" width="196" height="196" fill="none" stroke="#D4AF37" strokeWidth="2" />

                    {/* Grid Lines for South Indian Chart */}
                    <line x1="50" y1="0" x2="50" y2="200" stroke="#D4AF37" strokeWidth="1" />
                    <line x1="150" y1="0" x2="150" y2="200" stroke="#D4AF37" strokeWidth="1" />
                    <line x1="0" y1="50" x2="50" y2="50" stroke="#D4AF37" strokeWidth="1" />
                    <line x1="150" y1="50" x2="200" y2="50" stroke="#D4AF37" strokeWidth="1" />
                    <line x1="0" y1="150" x2="50" y2="150" stroke="#D4AF37" strokeWidth="1" />
                    <line x1="150" y1="150" x2="200" y2="150" stroke="#D4AF37" strokeWidth="1" />

                    {/* Internal Square (Brahmasthan/Center - Empty) */}
                    <rect x="50" y="50" width="100" height="100" fill="none" stroke="#D4AF37" strokeWidth="1" />

                    {/* Render Planets in Boxes */}
                    {boxCenters.map((box) => {
                        const planets = planetsBySign[box.id] || [];
                        return (
                            <g key={box.id}>
                                <text x={box.x} y={box.y - 12} fill="#D4AF37" fontSize="5" opacity="0.5" textAnchor="middle" fontFamily="serif">{box.label}</text>
                                {planets.map((p, idx) => (
                                    <text
                                        key={idx}
                                        x={box.x}
                                        y={box.y + (idx * 8) - 2}
                                        fill={p.includes("Asc") ? "#FFD700" : "#FFF"}
                                        fontSize="6"
                                        fontWeight={p.includes("Asc") ? "bold" : "normal"}
                                        textAnchor="middle"
                                    >
                                        {p}
                                    </text>
                                ))}
                            </g>
                        );
                    })}

                    <text x="100" y="95" textAnchor="middle" fill="#D4AF37" fontSize="8" filter="url(#goldGlow)">VEDIC CHART</text>
                    <text x="100" y="110" textAnchor="middle" fill="#FFF" fontSize="5" opacity="0.8">South Indian Style</text>

                </svg>
            </div>
        );
    }

    // Render SVG String (Legacy/Fallback)
    const svgToRender = (typeof chartData === 'string' ? chartData : null) || chartSvg;

    if (svgToRender) {
        return (
            <div className="astro-chart-wrapper" style={{ animation: 'none' }}>
                <div className="glow-effect"></div>
                <div
                    className="vedic-chart-svg-container"
                    dangerouslySetInnerHTML={{ __html: svgToRender }}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))'
                    }}
                />
            </div>
        );
    }

    // Default / Loading State
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

                {/* Center Star */}
                <circle cx="100" cy="100" r="4" fill="url(#goldGradient)" filter="url(#goldGlow)">
                    <animate attributeName="r" values="4;6;4" dur="4s" repeatCount="indefinite" />
                </circle>
            </svg>

            <div className="chart-label">
                <span className="gold-text">
                    {isLoading ? "Aligning Planets..." : "Calibrating Destiny..."}
                </span>
            </div>
        </div>
    );
};

export default AstroChart;
