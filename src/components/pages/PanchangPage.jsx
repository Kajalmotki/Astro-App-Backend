import React from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './PanchangPage.css';

const PanchangPage = ({ isOpen, onClose }) => {
    // Get current date info
    const today = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-IN', dateOptions);

    // Sample Panchang data (in production, this would come from an API)
    const panchangData = {
        tithi: {
            name: "Shukla Shashthi",
            endTime: "10:45 PM",
            deity: "Kartikeya",
            description: "Sixth day of the waxing moon, favorable for new beginnings"
        },
        nakshatra: {
            name: "Rohini",
            endTime: "08:32 AM (next day)",
            lord: "Moon",
            symbol: "🐂",
            deity: "Brahma",
            description: "Star of ascent - excellent for growth, beauty, and creativity"
        },
        yoga: {
            name: "Shiva",
            endTime: "03:15 PM",
            nature: "Auspicious",
            description: "Brings spiritual elevation and inner peace"
        },
        karana: {
            name: "Taitila",
            endTime: "10:45 PM",
            nature: "Favorable",
            description: "Good for celebrations and social activities"
        },
        vara: {
            name: "Tuesday",
            lord: "Mars (Mangal)",
            color: "#dc2626",
            description: "Day of courage, action, and determination"
        },
        sunrise: "06:47 AM",
        sunset: "06:12 PM",
        moonrise: "10:23 AM",
        moonset: "11:45 PM",
        rahukalam: "03:00 PM - 04:30 PM",
        gulikakalam: "12:00 PM - 01:30 PM",
        abhijitMuhurta: "12:06 PM - 12:54 PM"
    };

    // Moon phase calculation (simplified)
    const moonPhasePercent = 35; // Would be calculated based on tithi

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="Today's Panchāng" variant="warm">
            <div className="panchang-container">
                {/* Date Header */}
                <div className="panchang-date-header">
                    <span className="hindu-date">श्री शुभ दिनम्</span>
                    <h3>{formattedDate}</h3>
                </div>

                {/* Sun/Moon Times */}
                <div className="celestial-times">
                    <div className="time-card sunrise">
                        <span className="time-icon">🌅</span>
                        <div className="time-info">
                            <span className="time-label">Sunrise</span>
                            <span className="time-value">{panchangData.sunrise}</span>
                        </div>
                    </div>
                    <div className="time-card sunset">
                        <span className="time-icon">🌇</span>
                        <div className="time-info">
                            <span className="time-label">Sunset</span>
                            <span className="time-value">{panchangData.sunset}</span>
                        </div>
                    </div>
                    <div className="time-card moonrise">
                        <span className="time-icon">🌙</span>
                        <div className="time-info">
                            <span className="time-label">Moonrise</span>
                            <span className="time-value">{panchangData.moonrise}</span>
                        </div>
                    </div>
                </div>

                {/* Five Limbs of Panchang */}
                <h4 className="section-title">पञ्चाङ्ग - The Five Limbs</h4>
                <div className="panchang-grid">
                    {/* Tithi Card */}
                    <div className="panchang-card tithi-card">
                        <div className="card-header">
                            <div className="moon-phase-visual">
                                <svg viewBox="0 0 50 50" className="moon-svg">
                                    <circle cx="25" cy="25" r="22" fill="#1a1a2e" />
                                    <circle
                                        cx="25"
                                        cy="25"
                                        r="22"
                                        fill="#FFD700"
                                        clipPath={`inset(0 ${100 - moonPhasePercent}% 0 0)`}
                                    />
                                </svg>
                            </div>
                            <div className="card-title-group">
                                <span className="card-label">तिथि (Tithi)</span>
                                <span className="card-value">{panchangData.tithi.name}</span>
                            </div>
                        </div>
                        <div className="card-body">
                            <p className="card-description">{panchangData.tithi.description}</p>
                            <div className="card-meta">
                                <span>Deity: {panchangData.tithi.deity}</span>
                                <span>Ends: {panchangData.tithi.endTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Nakshatra Card */}
                    <div className="panchang-card nakshatra-card">
                        <div className="card-header">
                            <span className="nakshatra-symbol">{panchangData.nakshatra.symbol}</span>
                            <div className="card-title-group">
                                <span className="card-label">नक्षत्र (Nakshatra)</span>
                                <span className="card-value">{panchangData.nakshatra.name}</span>
                            </div>
                        </div>
                        <div className="card-body">
                            <p className="card-description">{panchangData.nakshatra.description}</p>
                            <div className="card-meta">
                                <span>Lord: {panchangData.nakshatra.lord}</span>
                                <span>Deity: {panchangData.nakshatra.deity}</span>
                            </div>
                            <div className="card-meta">
                                <span>Ends: {panchangData.nakshatra.endTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Yoga Card */}
                    <div className="panchang-card yoga-card">
                        <div className="card-header">
                            <span className="yoga-symbol">☯</span>
                            <div className="card-title-group">
                                <span className="card-label">योग (Yoga)</span>
                                <span className="card-value">{panchangData.yoga.name}</span>
                            </div>
                        </div>
                        <div className="card-body">
                            <p className="card-description">{panchangData.yoga.description}</p>
                            <div className="card-meta">
                                <span className={`nature-badge ${panchangData.yoga.nature.toLowerCase()}`}>
                                    {panchangData.yoga.nature}
                                </span>
                                <span>Ends: {panchangData.yoga.endTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Karana Card */}
                    <div className="panchang-card karana-card">
                        <div className="card-header">
                            <span className="karana-symbol">◐</span>
                            <div className="card-title-group">
                                <span className="card-label">करण (Karana)</span>
                                <span className="card-value">{panchangData.karana.name}</span>
                            </div>
                        </div>
                        <div className="card-body">
                            <p className="card-description">{panchangData.karana.description}</p>
                            <div className="card-meta">
                                <span className={`nature-badge ${panchangData.karana.nature.toLowerCase()}`}>
                                    {panchangData.karana.nature}
                                </span>
                                <span>Ends: {panchangData.karana.endTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Vara Card */}
                    <div className="panchang-card vara-card" style={{ '--vara-color': panchangData.vara.color }}>
                        <div className="card-header">
                            <span className="vara-symbol">♂</span>
                            <div className="card-title-group">
                                <span className="card-label">वार (Vara)</span>
                                <span className="card-value">{panchangData.vara.name}</span>
                            </div>
                        </div>
                        <div className="card-body">
                            <p className="card-description">{panchangData.vara.description}</p>
                            <div className="card-meta">
                                <span>Ruling Planet: {panchangData.vara.lord}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auspicious & Inauspicious Timings */}
                <h4 className="section-title">शुभ-अशुभ काल</h4>
                <div className="timings-grid">
                    <div className="timing-card good">
                        <span className="timing-icon">✨</span>
                        <div className="timing-info">
                            <span className="timing-label">Abhijit Muhurta</span>
                            <span className="timing-value">{panchangData.abhijitMuhurta}</span>
                            <span className="timing-note">Best time for auspicious activities</span>
                        </div>
                    </div>
                    <div className="timing-card caution">
                        <span className="timing-icon">⚠️</span>
                        <div className="timing-info">
                            <span className="timing-label">Rahu Kalam</span>
                            <span className="timing-value">{panchangData.rahukalam}</span>
                            <span className="timing-note">Avoid new beginnings</span>
                        </div>
                    </div>
                    <div className="timing-card caution">
                        <span className="timing-icon">⚠️</span>
                        <div className="timing-info">
                            <span className="timing-label">Gulika Kalam</span>
                            <span className="timing-value">{panchangData.gulikakalam}</span>
                            <span className="timing-note">Avoid important tasks</span>
                        </div>
                    </div>
                </div>

                {/* Info Footer */}
                <div className="panchang-footer">
                    <p>पञ्चाङ्ग is the ancient Vedic calendar system. Consult for festivals, muhurtas, and daily guidance.</p>
                </div>
            </div>
        </FullScreenOverlay>
    );
};

export default PanchangPage;
