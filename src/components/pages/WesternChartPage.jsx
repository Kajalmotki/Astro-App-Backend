import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Edit2 } from 'lucide-react';
import './WesternChartPage.css';
import WesternBirthForm from '../WesternBirthForm';
import { calculateWesternChart } from '../../utils/westernUtils';

const WesternChartPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('planets');
    const [showForm, setShowForm] = useState(true);
    const [chartData, setChartData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = (data) => {
        setLoading(true);
        // Simulate calculation delay for effect
        setTimeout(() => {
            const calculatedData = calculateWesternChart(data);
            if (calculatedData) {
                setChartData(calculatedData);
                setUserData(data);
                setShowForm(false);
            } else {
                // Fallback specific mock if calc fails
                alert("Calculation library issue. Loading demo chart.");
                setChartData(getMockData());
                setShowForm(false);
            }
            setLoading(false);
        }, 1500);
    };

    const getMockData = () => ({
        planets: [
            { name: 'Sun', sign: 'Leo', degree: '15° 22\'', house: '5th House', icon: '☀️' },
            { name: 'Moon', sign: 'Aries', degree: '04° 10\'', house: '1st House', icon: '🌙' },
            { name: 'Ascendant', sign: 'Pisces', degree: '28° 45\'', house: '1st House', icon: '⬆️' },
            { name: 'Mercury', sign: 'Virgo', degree: '12° 05\'', house: '6th House', icon: '☿️' },
            { name: 'Venus', sign: 'Libra', degree: '08° 30\'', house: '7th House', icon: '♀️' },
            { name: 'Mars', sign: 'Scorpio', degree: '21° 15\'', house: '8th House', icon: '♂️' },
        ],
        aspects: [
            { p1: 'Sun', p2: 'Jupiter', type: 'Trine', angle: '120°', nature: 'Harmonious', class: 'trine' },
            { p1: 'Mars', p2: 'Venus', type: 'Square', angle: '90°', nature: 'Challenging', class: 'square' },
        ]
    });

    return (
        <div className="western-chart-container">
            {/* Header */}
            <header className="western-header">
                <button className="western-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <div className="western-title">
                    <h2>Western Natal Chart</h2>
                    <span>Tropical Zodiac System</span>
                </div>
                {!showForm && (
                    <button className="western-back-btn" style={{ marginLeft: 'auto' }} onClick={() => setShowForm(true)}>
                        <Edit2 size={16} />
                    </button>
                )}
            </header>

            {/* FORM OVERLAY */}
            {showForm && (
                <WesternBirthForm
                    onSubmit={handleFormSubmit}
                    onClose={() => {
                        // If checking out existing chart, just close form. If no chart, go back.
                        if (chartData) setShowForm(false);
                        else navigate(-1);
                    }}
                />
            )}

            {loading && (
                <div className="western-loading-overlay">
                    <div className="spinner"></div>
                    <p>Calculating Planetary Positions...</p>
                </div>
            )}

            {/* MAIN DASHBOARD */}
            {!showForm && chartData && (
                <>
                    {/* User Info Bar */}
                    <div className="western-user-bar" style={{ padding: '0 20px', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#a855f7' }}>{userData?.name}</h3>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                            {userData?.date} • {userData?.time} • {userData?.city}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="western-tabs">
                        <button
                            className={`western-tab ${activeTab === 'wheel' ? 'active' : ''}`}
                            onClick={() => setActiveTab('wheel')}
                        >
                            Chart Wheel
                        </button>
                        <button
                            className={`western-tab ${activeTab === 'planets' ? 'active' : ''}`}
                            onClick={() => setActiveTab('planets')}
                        >
                            Planets
                        </button>
                        <button
                            className={`western-tab ${activeTab === 'aspects' ? 'active' : ''}`}
                            onClick={() => setActiveTab('aspects')}
                        >
                            Aspects
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="western-content">

                        {/* 1. CHART WHEEL TAB */}
                        {activeTab === 'wheel' && (
                            <div className="wheel-section">
                                <div className="wheel-container">
                                    <svg className="wheel-svg" viewBox="0 0 100 100">
                                        {/* Simple Rings for Visualization */}
                                        <circle cx="50" cy="50" r="48" fill="none" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.5" />
                                        <circle cx="50" cy="50" r="35" fill="none" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.3" />
                                        <circle cx="50" cy="50" r="15" fill="none" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.8" />

                                        {/* House Lines (12) */}
                                        {[...Array(12)].map((_, i) => (
                                            <line
                                                key={i}
                                                x1="50" y1="50"
                                                x2={50 + 48 * Math.cos((i * 30) * Math.PI / 180)}
                                                y2={50 + 48 * Math.sin((i * 30) * Math.PI / 180)}
                                                stroke="#a855f7"
                                                strokeWidth="0.2"
                                            />
                                        ))}

                                        {/* Visual Placeholder for Wheel - SVG mapping is complex */}
                                        <text x="50" y="55" fontSize="6" fill="#a855f7" textAnchor="middle">♈</text>
                                    </svg>
                                    <div className="wheel-center-info">
                                        <h3>{userData.name}</h3>
                                        <span>Natal Chart</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. PLANETS TAB */}
                        {activeTab === 'planets' && (
                            <div className="planets-section">
                                <div className="planets-table-container">
                                    {chartData.planets.map((planet, index) => (
                                        <div className="pt-row" key={index}>
                                            <div className="pt-icon">{planet.icon}</div>
                                            <div className="pt-info">
                                                <span className="pt-name">{planet.name}</span>
                                                <span className="pt-sign">{planet.sign} • {planet.house || 'N/A'}</span>
                                            </div>
                                            <div className="pt-degree">{planet.degree}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* 3. ASPECTS TAB */}
                        {activeTab === 'aspects' && (
                            <div className="aspects-section">
                                <div className="aspects-grid">
                                    {chartData.aspects.map((aspect, index) => (
                                        <div className={`aspect-card ${aspect.class}`} key={index}>
                                            <div className="ac-glyph">
                                                {aspect.type === 'Trine' && '△'}
                                                {aspect.type === 'Square' && '□'}
                                                {aspect.type === 'Sextile' && '✱'}
                                                {aspect.type === 'Conjunction' && '☌'}
                                                {aspect.type === 'Opposition' && '☍'}
                                            </div>
                                            <div className="ac-info">
                                                <h4>{aspect.p1} & {aspect.p2}</h4>
                                                <span>{aspect.nature} ({aspect.angle})</span>
                                            </div>
                                            <div className="ac-type">{aspect.type}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PLANET LEGEND SECTION (New) */}
                    <div className="planet-legend-container">
                        <h4 className="legend-title">Planetary Keys</h4>
                        <div className="planet-legend-grid">
                            <LegendCard icon="☀️" name="Sun" desc="Self & Ego" />
                            <LegendCard icon="🌙" name="Moon" desc="Emotions" />
                            <LegendCard icon="⬆️" name="Asc" desc="Persona" />
                            <LegendCard icon="☿️" name="Mercury" desc="Mind" />
                            <LegendCard icon="♀️" name="Venus" desc="Love" />
                            <LegendCard icon="♂️" name="Mars" desc="Action" />
                            <LegendCard icon="♃" name="Jupiter" desc="Luck" />
                            <LegendCard icon="♄" name="Saturn" desc="Updates" />
                            <LegendCard icon="♅" name="Uranus" desc="Change" />
                            <LegendCard icon="♆" name="Neptune" desc="Dreams" />
                            <LegendCard icon="♇" name="Pluto" desc="Power" />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Helper Component for Legend
const LegendCard = ({ icon, name, desc }) => (
    <div className="legend-card">
        <div className="legend-icon">{icon}</div>
        <span className="legend-name">{name}</span>
        <span className="legend-desc">{desc}</span>
    </div>
);

export default WesternChartPage;
