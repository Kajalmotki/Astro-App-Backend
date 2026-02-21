import React from 'react';
import './BeautifulD1Chart.css';

const ICONS = {
    'Sun': '☉',
    'Moon': '☽',
    'Mars': '♂',
    'Mercury': '☿',
    'Jupiter': '♃',
    'Venus': '♀',
    'Saturn': '♄',
    'Rahu': '☊',
    'Ketu': '☋',
    'Ascendant': 'ASC'
};

const parseDashaString = (str) => {
    if (!str) return [];
    return str.split('\n').filter(l => l.trim().length > 0).map(line => {
        const parts = line.split(':');
        if (parts.length < 2) return null;
        const level = parts[0].trim();
        const rest = parts.slice(1).join(':').trim();
        const match = rest.match(/([a-zA-Z]+)\s*(.*)/);
        if (match) {
            return {
                level,
                planet: match[1].trim(),
                dateRange: match[2].trim()
            };
        }
        return { level, raw: rest };
    }).filter(Boolean);
};

const BeautifulD1Chart = ({ data }) => {
    if (!data || !data.planets) return null;

    return (
        <div className="beautiful-d1-container">
            {/* Header / Lagna Info */}
            <div className="d1-header">
                <h3>D1 Kundli Chart</h3>
                <div className="d1-header-sub">
                    <span>{data.dayOfBirth || 'Unknown Day'}</span>
                    <span className="lagna-badge">Lagna: {data.lagna}</span>
                </div>
            </div>

            {/* Planetary Placements Table */}
            <div className="d1-section">
                <h4 className="d1-section-title">Planetary Placements</h4>
                <div style={{ overflowX: 'auto' }}>
                    <table className="planet-table">
                        <thead>
                            <tr>
                                <th>Planet</th>
                                <th>Sign</th>
                                <th>Degree</th>
                                <th style={{ textAlign: 'center' }}>House</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.planets.map((p, i) => (
                                <tr key={i}>
                                    <td className="planet-name-cell">
                                        <span className="planet-icon">{ICONS[p.name] || '✦'}</span>
                                        {p.name}
                                    </td>
                                    <td>{p.sign}</td>
                                    <td style={{ color: '#94a3b8' }}>{p.degree}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className="house-badge">{p.house}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Yogas Section */}
            {data.yogas && data.yogas.length > 0 && (
                <div className="d1-section">
                    <h4 className="d1-section-title">Detected Yogas</h4>
                    <div className="yogas-list">
                        {data.yogas.map((y, i) => (
                            <div key={i} className="yoga-item">
                                <p className="yoga-name">{y.name || y}</p>
                                {y.description && <p className="yoga-desc">{y.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Chakra & Planetary Strength Section */}
            {data.chakras && data.chakras.length > 0 && (
                <div className="d1-section">
                    <h4 className="d1-section-title">Planetary Strength & Chakras</h4>
                    <div className="chakra-list">
                        {data.chakras.map((chakra, i) => (
                            <div key={i} className="chakra-card" style={{ '--chakra-color': chakra.color }}>
                                <div className="chakra-header" style={{ flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h5 className="chakra-name" style={{ margin: 0 }}>{chakra.chakra}</h5>
                                        <div className="chakra-planet-badge" style={{ padding: '2px 8px', margin: 0 }}>
                                            <span className="planet-icon" style={{ color: chakra.color }}>{ICONS[chakra.planet]}</span>
                                            {chakra.planet}
                                        </div>
                                    </div>
                                    <p className="chakra-theme">{chakra.theme}</p>
                                </div>
                                <div className="chakra-progress-wrap">
                                    <div className="chakra-progress-labels">
                                        <span className="chakra-dignity-label">{chakra.state} ({chakra.dignityLabel})</span>
                                        <span className="chakra-percent-label">{chakra.strengthPercent}%</span>
                                    </div>
                                    <div className="chakra-progress-bg">
                                        <div
                                            className="chakra-progress-fill"
                                            style={{ width: `${Math.min(100, chakra.strengthPercent)}%`, background: chakra.color }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dasha Timeline Section */}
            {(data.dashaTimeline || data.dashaInsight) && (
                <div className="d1-section" style={{ borderBottom: 'none' }}>
                    <h4 className="d1-section-title">Current Dasha Sequence</h4>
                    {data.dashaTimeline && (
                        <div className="dasha-stepper">
                            {parseDashaString(data.dashaTimeline).map((d, i) => (
                                <div key={i} className="dasha-step" style={{ marginLeft: `${i * 12}px` }}>
                                    <div className="dasha-step-node"></div>
                                    <div className="dasha-step-content">
                                        <div className="dasha-step-header">
                                            <span className="dasha-level">{d.level}</span>
                                            {d.planet && (
                                                <span className="dasha-planet">
                                                    <span className="planet-icon" style={{ color: '#ffd700' }}>{ICONS[d.planet]}</span>
                                                    {d.planet}
                                                </span>
                                            )}
                                        </div>
                                        <div className="dasha-dates">{d.dateRange || d.raw}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {data.dashaInsight && (
                        <p className="dasha-insight">{data.dashaInsight}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BeautifulD1Chart;
