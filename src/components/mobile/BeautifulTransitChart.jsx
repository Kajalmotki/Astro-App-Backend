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

const BeautifulTransitChart = ({ data }) => {
    if (!data || !data.planets) return null;

    return (
        <div className="beautiful-d1-container">
            {/* Header / Lagna Info */}
            <div className="d1-header">
                <h3>Live Transit Chart</h3>
                <div className="d1-header-sub">
                    <span>{data.date || 'Today'} • {data.time || 'Now'}</span>
                    <span className="lagna-badge">Current Lagna: {data.lagna}</span>
                </div>
            </div>

            {/* Planetary Placements Table */}
            <div className="d1-section" style={{ borderBottom: 'none' }}>
                <h4 className="d1-section-title">Current Transit Placements</h4>
                <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
                    <table className="planet-table" style={{ minWidth: '460px' }}>
                        <thead>
                            <tr>
                                <th>Planet</th>
                                <th>Sign & Degree</th>
                                <th style={{ textAlign: 'center' }}>House</th>
                                <th>Nakshatra</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.planets.map((p, i) => (
                                <tr key={i}>
                                    <td className="planet-name-cell">
                                        <span className="planet-icon">{ICONS[p.name] || '✦'}</span>
                                        {p.name}
                                    </td>
                                    <td>
                                        {p.sign} <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{p.deg || p.degree}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className="house-badge">{p.house}</span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem' }}>
                                        <span style={{ color: '#ffd700' }}>{p.nakshatra}</span> (P{p.pada})
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="d1-section" style={{ borderBottom: 'none', paddingTop: 0 }}>
                <p className="dasha-insight" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    ℹ️ Transit houses are calculated from the current real-time active Ascendant at your birth location. Nakshatras define the exact cosmic frequency the planets are currently emitting.
                </p>
            </div>
        </div>
    );
};

export default BeautifulTransitChart;
