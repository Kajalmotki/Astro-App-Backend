import React, { useState } from 'react';
import './MobilePremiumDashboard.css';

const MobilePremiumDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'transits', label: 'Transits' },
        { id: 'dasha', label: 'Timeline' },
        { id: 'strengths', label: 'Strengths' },
    ];

    return (
        <div className="mobile-premium-dashboard">
            {/* Tab Nav */}
            <div className="mobile-dash-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`mobile-dash-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="mobile-dash-content">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <>
                        <div className="mobile-dash-card">
                            <h3>AstroScore Live</h3>
                            <div className="mobile-score-display">
                                <div className="mobile-score-circle">
                                    <span className="mobile-score-val">92.0</span>
                                    <span className="mobile-score-label">OPTIMAL</span>
                                </div>
                                <p style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.5' }}>
                                    Your cosmic vitality is high today. Excellent time for initiating new projects.
                                </p>
                            </div>
                        </div>

                        <div className="mobile-dash-card">
                            <h3>Key Highlights</h3>
                            <ul style={{ fontSize: '13px', paddingLeft: '20px', lineHeight: '1.6', color: '#ddd' }}>
                                <li><strong>Moon in Sagittarius:</strong> Seek wisdom and adventure.</li>
                                <li><strong>Venus Exalted:</strong> Relationship harmony is peaked.</li>
                                <li><strong>Jupiter Transit:</strong> Growth in career sector.</li>
                            </ul>
                        </div>
                    </>
                )}

                {/* TRANSITS TAB */}
                {activeTab === 'transits' && (
                    <div className="mobile-dash-card">
                        <h3>Current Planetary Positions</h3>
                        <div className="mobile-transits-list">
                            {[
                                { p: 'Sun', s: 'Aquarius', h: '3rd' },
                                { p: 'Moon', s: 'Sagittarius', h: '1st' },
                                { p: 'Mars', s: 'Gemini', h: '7th' },
                                { p: 'Mercury', s: 'Capricorn', h: '2nd' },
                                { p: 'Jupiter', s: 'Taurus', h: '6th' },
                                { p: 'Venus', s: 'Pisces', h: '4th' },
                                { p: 'Saturn', s: 'Aquarius', h: '3rd' },
                            ].map((t, i) => (
                                <div key={i} className="mobile-transit-row">
                                    <span className="mobile-t-planet">{t.p}</span>
                                    <span className="mobile-t-sign">{t.s}</span>
                                    <span className="mobile-t-house">{t.h} House</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DASH TAB */}
                {activeTab === 'dasha' && (
                    <div className="mobile-dash-card">
                        <h3>Vimshottari Timeline</h3>
                        <div className="mobile-dasha-timeline">
                            <div className="mobile-dasha-event">
                                <span className="mobile-dasha-date">Now - Feb 2027</span>
                                <span className="mobile-dasha-title">Venus Mahadasha (Active)</span>
                            </div>
                            <div className="mobile-dasha-event">
                                <span className="mobile-dasha-date">Dec 2025 - Feb 2027</span>
                                <span className="mobile-dasha-title">Ketu Antardasha</span>
                            </div>
                            <div className="mobile-dasha-event">
                                <span className="mobile-dasha-date">Feb 2027</span>
                                <span className="mobile-dasha-title">Sun Mahadasha Begins</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* STRENGTHS TAB */}
                {activeTab === 'strengths' && (
                    <div className="mobile-dash-card">
                        <h3>Planetary Shadbala</h3>
                        <div className="mobile-strengths-list">
                            {[
                                { name: 'Sun', level: 85, color: '#FFD700' },
                                { name: 'Moon', level: 92, color: '#C0C0C0' },
                                { name: 'Mars', level: 45, color: '#FF4500' },
                                { name: 'Jupiter', level: 78, color: '#FF8C00' },
                                { name: 'Venus', level: 65, color: '#FF69B4' },
                                { name: 'Saturn', level: 88, color: '#4682B4' },
                            ].map(p => (
                                <div key={p.name} className="mobile-strength-item">
                                    <span className="mobile-p-name">{p.name}</span>
                                    <div className="mobile-p-bar">
                                        <div className="mobile-p-fill" style={{ width: `${p.level}%`, background: p.color }}></div>
                                    </div>
                                    <span className="mobile-p-val">{p.level}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobilePremiumDashboard;
