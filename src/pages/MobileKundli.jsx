import React, { useState } from 'react';
import BirthDetailsForm from '../components/BirthDetailsForm';
import './MobileHome.css'; // Reusing styles
import { Star, Calendar, MapPin, Clock } from 'lucide-react';

const MobileKundli = () => {
    const [step, setStep] = useState('input'); // input, loading, result
    const [birthData, setBirthData] = useState(null);

    const handleGenerate = (data) => {
        setBirthData(data);
        setStep('loading');
        // Simulate API call
        setTimeout(() => {
            setStep('result');
        }, 1500);
    };

    return (
        <div className="mobile-page-container" style={{ padding: '20px', paddingBottom: '100px' }}>
            {step === 'input' && (
                <>
                    <div className="section-header">
                        <h2>Create New Kundli</h2>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>Enter birth details to generate horoscope</p>
                    </div>
                    <BirthDetailsForm onSubmit={handleGenerate} title="" submitLabel="Generate Horoscope" />
                </>
            )}

            {step === 'loading' && (
                <div className="loading-container" style={{ textAlign: 'center', marginTop: '100px' }}>
                    <div className="spinner" style={{
                        width: '40px', height: '40px', border: '4px solid #e0f2fe',
                        borderTop: '4px solid #0284c7', borderRadius: '50%', margin: '0 auto 20px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <h3>Aligning the Stars...</h3>
                    <p>Calculating planetary positions</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {step === 'result' && birthData && (
                <div className="kundli-result">
                    <div className="section-header">
                        <h2>Your Janam Kundli</h2>
                        <button onClick={() => setStep('input')} style={{
                            background: 'none', border: 'none', color: '#0284c7', fontWeight: 600
                        }}>New Search</button>
                    </div>

                    {/* Basic Info Card */}
                    <div className="daily-insight-card">
                        <div className="insight-content">
                            <div className="insight-icon-wrapper">
                                <Star size={24} />
                            </div>
                            <div className="insight-text">
                                <h3>{birthData.name}</h3>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={12} /> {birthData.day}/{birthData.month}/{birthData.year}
                                    </span>
                                    <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12} /> {birthData.hour}:{birthData.min}
                                    </span>
                                    <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={12} /> {birthData.place}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Visualization (Simplified North Indian) */}
                    <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#0c4a6e' }}>Lagna Chart</h3>
                    <div className="chart-placeholder" style={{
                        aspectRatio: '1', background: 'rgba(255,255,255,0.5)', border: '1px solid #bae6fd',
                        position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        {/* Simple Diamond SVG for North Indian Chart */}
                        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                            <rect x="0" y="0" width="100" height="100" fill="none" stroke="#0284c7" strokeWidth="1" />
                            <line x1="0" y1="0" x2="100" y2="100" stroke="#0284c7" strokeWidth="1" />
                            <line x1="100" y1="0" x2="0" y2="100" stroke="#0284c7" strokeWidth="1" />
                            <line x1="50" y1="0" x2="0" y2="50" stroke="#0284c7" strokeWidth="1" />
                            <line x1="50" y1="0" x2="100" y2="50" stroke="#0284c7" strokeWidth="1" />
                            <line x1="0" y1="50" x2="50" y2="100" stroke="#0284c7" strokeWidth="1" />
                            <line x1="100" y1="50" x2="50" y2="100" stroke="#0284c7" strokeWidth="1" />
                            {/* House Numbers */}
                            <text x="50" y="25" fontSize="4" fill="#64748b" textAnchor="middle">1</text>
                            <text x="25" y="15" fontSize="4" fill="#64748b" textAnchor="middle">2</text>
                            <text x="15" y="25" fontSize="4" fill="#64748b" textAnchor="middle">3</text>
                            <text x="25" y="50" fontSize="4" fill="#64748b" textAnchor="middle">4</text>

                            {/* Planets (Mock Data) */}
                            <text x="50" y="40" fontSize="5" fill="#0284c7" fontWeight="bold" textAnchor="middle">Asc</text>
                            <text x="20" y="20" fontSize="5" fill="#d97706" fontWeight="bold" textAnchor="middle">Sun</text>
                            <text x="80" y="20" fontSize="5" fill="#9333ea" fontWeight="bold" textAnchor="middle">Jup</text>
                            <text x="80" y="80" fontSize="5" fill="#ef4444" fontWeight="bold" textAnchor="middle">Mar</text>
                        </svg>
                    </div>

                    {/* Planet List */}
                    <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#0c4a6e' }}>Planetary Positions</h3>
                    <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        {[
                            { name: 'Sun', sign: 'Leo', house: '5th' },
                            { name: 'Moon', sign: 'Cancer', house: '4th' },
                            { name: 'Mars', sign: 'Aries', house: '1st' },
                            { name: 'Jupiter', sign: 'Pisces', house: '9th' },
                            { name: 'Venus', sign: 'Libra', house: '7th' },
                            { name: 'Saturn', sign: 'Aquarius', house: '11th' },
                        ].map((p, i) => (
                            <div key={i} className="action-card" style={{ flexDirection: 'row', padding: '10px', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%', background: '#e0f2fe',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '10px'
                                }}>
                                    {p.name.substring(0, 2)}
                                </div>
                                <div>
                                    <span style={{ fontSize: '14px', fontWeight: '600', display: 'block' }}>{p.name}</span>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{p.sign} • {p.house}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="insight-action-btn" style={{ marginTop: '20px' }}>Download Full Report (PDF)</button>
                </div>
            )}
        </div>
    );
};

export default MobileKundli;
