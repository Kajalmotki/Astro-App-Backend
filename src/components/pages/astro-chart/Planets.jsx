import React from 'react';

const Planets = ({ chartData }) => {
    // Determine the data array ensuring it handles the transition safely
    const planets = chartData?.math?.planets || [];
    const ascSign = chartData?.math?.ascSign || "Unknown";
    const ascDeg = chartData?.math?.ascDeg || "0°00'";
    const ascLord = chartData?.math?.ascLord || "Unknown";

    if (!planets.length) {
        return <div style={{ color: 'var(--k-w40)', padding: '20px', textAlign: 'center' }}>Planetary data unavailable.</div>;
    }

    // Exact Dignity logic calculation
    const getDignityStyle = (planetName, sign) => {
        const rules = {
            'Sun': { exalted: 'Aries', own: 'Leo', debilitated: 'Libra' },
            'Moon': { exalted: 'Taurus', own: 'Cancer', debilitated: 'Scorpio' },
            'Mars': { exalted: 'Capricorn', own: ['Aries', 'Scorpio'], debilitated: 'Cancer' },
            'Mercury': { exalted: 'Virgo', own: ['Gemini', 'Virgo'], debilitated: 'Pisces' },
            'Jupiter': { exalted: 'Cancer', own: ['Sagittarius', 'Pisces'], debilitated: 'Capricorn' },
            'Venus': { exalted: 'Pisces', own: ['Taurus', 'Libra'], debilitated: 'Virgo' },
            'Saturn': { exalted: 'Libra', own: ['Capricorn', 'Aquarius'], debilitated: 'Aries' },
            'Rahu': { exalted: 'Taurus', own: 'Aquarius', debilitated: 'Scorpio' },
            'Ketu': { exalted: 'Scorpio', own: 'Scorpio', debilitated: 'Taurus' }
        };
        const rule = rules[planetName];
        if (!rule) return 'Neutral';
        if (rule.exalted === sign) return 'Exalted';
        if (rule.debilitated === sign) return 'Debilitated';
        if (Array.isArray(rule.own) ? rule.own.includes(sign) : rule.own === sign) return 'Own Sign';
        return 'Neutral';
    };

    return (
        <div className="planets-section" style={{ paddingBottom: '40px' }}>
            <div className="sec-head" style={{ marginBottom: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--k-w90)' }}>Planetary Positions</h3>
            </div>

            <div className="planet-tbl">
                {/* Responsive horizontal scroll for detailed table */}
                <div style={{ overflowX: 'auto', paddingBottom: '12px' }}>
                    <div className="pt-head" style={{ gridTemplateColumns: 'minmax(100px, 1.5fr) 1.2fr 1fr 1.5fr 1fr 1fr 1fr', minWidth: '600px' }}>
                        <div className="pt-hc">PLANET</div>
                        <div className="pt-hc">SIGN</div>
                        <div className="pt-hc">DEGREE</div>
                        <div className="pt-hc">NAKSHATRA</div>
                        <div className="pt-hc">PADA</div>
                        <div className="pt-hc">HOUSE</div>
                        <div className="pt-hc">DIGNITY</div>
                    </div>
                    {planets.map((p, i) => {
                        const dignity = getDignityStyle(p.name, p.sign);
                        const pillClass = dignity === 'Exalted' || dignity === 'Own Sign' ? 'pill-pos'
                            : dignity === 'Neutral' ? 'pill-neu' : 'pill-neg';

                        return (
                            <div className="pt-row" key={i} style={{ gridTemplateColumns: 'minmax(100px, 1.5fr) 1.2fr 1fr 1.5fr 1fr 1fr 1fr', minWidth: '600px' }}>
                                <div className="pt-c" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--k-w85)' }}>{p.name}</span>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--k-w40)', fontStyle: 'italic' }}>{p.name}</span>
                                </div>
                                <div className="pt-c">{p.sign}</div>
                                <div className="pt-c">{p.deg}</div>
                                <div className="pt-c">{p.nakshatra || '-'}</div>
                                <div className="pt-c">{p.pada || '-'}</div>
                                <div className="pt-c">{p.house}</div>
                                <div className="pt-c">
                                    <span className={`pill ${pillClass}`}>
                                        {dignity}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)', marginTop: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--k-w80)', marginBottom: '10px', letterSpacing: '0.1em' }}>Ascendant (Lagna) details</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--k-w60)', lineHeight: '1.6' }}>
                    Rising Sign: <strong style={{ color: 'var(--k-w90)' }}>{ascSign}</strong><br />
                    Degree: <strong style={{ color: 'var(--k-w90)' }}>{ascDeg}</strong><br />
                    Lord: <strong style={{ color: 'var(--k-w90)' }}>{ascLord}</strong>
                </p>
            </div>
        </div>
    );
};

export default Planets;
