import React, { useMemo } from 'react';
import './VedicD1Chart.css';

// Vedic signs in order (1-indexed: Aries=1 ... Pisces=12)
const VEDIC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const VedicD1Chart = ({ chartData }) => {
    const mathData = chartData?.math || null;
    const planets = mathData?.planets || [];
    const ascSign = mathData?.ascSign || 'Unknown';

    // Ascendant sign index (0-based)
    const ascSignIndex = VEDIC_SIGNS.findIndex(s => s.toLowerCase() === ascSign.toLowerCase());

    // Rashi number for a given house
    const getRashiNum = (houseNum) => {
        if (ascSignIndex < 0) return houseNum;
        return ((ascSignIndex + houseNum - 1) % 12) + 1;
    };

    // Group planets by house
    const planetsByHouse = useMemo(() => {
        const grouped = {};
        for (let i = 1; i <= 12; i++) grouped[i] = [];
        planets.forEach(p => {
            const h = p.house;
            if (h >= 1 && h <= 12) grouped[h].push(p);
        });
        return grouped;
    }, [planets]);

    // Render planets inside a house
    const renderHouse = (houseNum) => {
        const housePlanets = planetsByHouse[houseNum] || [];
        const isLagna = houseNum === 1;

        return (
            <div key={houseNum} className={`d1-house d1-h${houseNum}`}>
                {isLagna && <div className="d1-asc-marker">ASC</div>}
                <div className="d1-planets">
                    {housePlanets.map((p, i) => (
                        <div key={i} className="d1-planet">
                            <span className="d1-planet-name">{p.name}</span>
                            <span className="d1-planet-deg">{p.deg || ''}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Placeholder
    if (!mathData || planets.length === 0) {
        return (
            <div className="vedic-d1-wrapper">
                <div className="vedic-d1-title">
                    <h3>D-1 Birth Chart</h3>
                    <div className="d1-subtitle">Rashi Chakra · 12 Houses</div>
                </div>
                <div className="vedic-d1-chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Raleway', sans-serif", fontSize: '0.75rem', textAlign: 'center', padding: '20px' }}>
                        Generate a chart to see planetary placements
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="vedic-d1-wrapper">
            <div className="vedic-d1-title">
                <h3>Classical D-1 Birth Chart</h3>
                <div className="d1-subtitle">Rashi Chakra · 12 Houses</div>
            </div>

            <div className="vedic-d1-chart">
                {/* SVG diamond grid */}
                <svg className="d1-lines" viewBox="0 0 400 400" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(212,175,55,0.5)" />
                            <stop offset="50%" stopColor="rgba(212,175,55,0.25)" />
                            <stop offset="100%" stopColor="rgba(212,175,55,0.5)" />
                        </linearGradient>
                    </defs>
                    <rect x="1" y="1" width="398" height="398" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" />
                    {/* Main diagonals */}
                    <line x1="0" y1="0" x2="200" y2="200" stroke="url(#goldLine)" strokeWidth="1" />
                    <line x1="400" y1="0" x2="200" y2="200" stroke="url(#goldLine)" strokeWidth="1" />
                    <line x1="0" y1="400" x2="200" y2="200" stroke="url(#goldLine)" strokeWidth="1" />
                    <line x1="400" y1="400" x2="200" y2="200" stroke="url(#goldLine)" strokeWidth="1" />
                    {/* Inner diamond */}
                    <line x1="200" y1="0" x2="400" y2="200" stroke="rgba(212,175,55,0.18)" strokeWidth="0.8" />
                    <line x1="400" y1="200" x2="200" y2="400" stroke="rgba(212,175,55,0.18)" strokeWidth="0.8" />
                    <line x1="200" y1="400" x2="0" y2="200" stroke="rgba(212,175,55,0.18)" strokeWidth="0.8" />
                    <line x1="0" y1="200" x2="200" y2="0" stroke="rgba(212,175,55,0.18)" strokeWidth="0.8" />
                    {/* House division lines */}
                    <line x1="100" y1="100" x2="200" y2="0" stroke="rgba(212,175,55,0.15)" strokeWidth="0.6" />
                    <line x1="300" y1="100" x2="200" y2="0" stroke="rgba(212,175,55,0.15)" strokeWidth="0.6" />
                    <line x1="300" y1="100" x2="400" y2="200" stroke="rgba(212,175,55,0.15)" strokeWidth="0.6" />
                    <line x1="300" y1="300" x2="400" y2="200" stroke="rgba(212,175,55,0.15)" strokeWidth="0.6" />
                    <line x1="100" y1="300" x2="200" y2="400" stroke="rgba(212,175,55,0.15)" strokeWidth="0.6" />
                    <line x1="300" y1="300" x2="200" y2="400" stroke="rgba(212,175,55,0.15)" strokeWidth="0.6" />
                    <line x1="100" y1="100" x2="0" y2="200" stroke="rgba(212,175,55,0.15)" strokeWidth="0.6" />
                    <line x1="100" y1="300" x2="0" y2="200" stroke="rgba(212,175,55,0.15)" strokeWidth="0.6" />
                </svg>

                {/* Rashi numbers — positioned absolutely on the chart */}
                {/* Kite houses: clustered around center */}
                <span className="d1-rashi rashi-1">{getRashiNum(1)}</span>
                <span className="d1-rashi rashi-4">{getRashiNum(4)}</span>
                <span className="d1-rashi rashi-7">{getRashiNum(7)}</span>
                <span className="d1-rashi rashi-10">{getRashiNum(10)}</span>

                {/* Triangle houses */}
                <span className="d1-rashi rashi-2">{getRashiNum(2)}</span>
                <span className="d1-rashi rashi-3">{getRashiNum(3)}</span>
                <span className="d1-rashi rashi-5">{getRashiNum(5)}</span>
                <span className="d1-rashi rashi-6">{getRashiNum(6)}</span>
                <span className="d1-rashi rashi-8">{getRashiNum(8)}</span>
                <span className="d1-rashi rashi-9">{getRashiNum(9)}</span>
                <span className="d1-rashi rashi-11">{getRashiNum(11)}</span>
                <span className="d1-rashi rashi-12">{getRashiNum(12)}</span>

                {/* Planet overlays for each house */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => renderHouse(h))}
            </div>

            <div className="vedic-d1-info">
                <div>Ascendant</div>
                <div className="d1-lagna-pill">{ascSign} {mathData.ascDeg || ''}</div>
            </div>
        </div>
    );
};

export default VedicD1Chart;
