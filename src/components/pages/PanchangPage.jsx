import React, { useState, useEffect } from 'react';
import './PanchangPage.css';
import { calculateChoghadiya, formatTime } from '../../utils/choghadiyaUtils';

const PanchangPage = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('Day');
    const [mainTab, setMainTab] = useState('Overview');
    const [choghadiyaItems, setChoghadiyaItems] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 18 || currentHour < 6) {
            setActiveTab('Night');
        } else {
            setActiveTab('Day');
        }
    }, []);

    useEffect(() => {
        const panchangData = calculateChoghadiya(new Date(), 23.0225, 72.5714);
        const items = activeTab === 'Day' ? panchangData.day : panchangData.night;

        const formattedItems = items.map(item => ({
            time_slot: `${formatTime(item.start)} - ${formatTime(item.end)}`,
            name: item.name,
            meaning: item.meaning,
            quality: item.quality
        }));

        setChoghadiyaItems(formattedItems);
    }, [activeTab]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    if (!isOpen) return null;

    // Advanced dynamic check for current time slot
    const isCurrentTimeSlot = (timeString) => {
        try {
            const [startStr, endStr] = timeString.split(' - ');
            if (!startStr || !endStr) return false;

            const parseTime = (time12h) => {
                const [time, modifier] = time12h.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') hours = '00';
                if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
                return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
            };

            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            const startMins = parseTime(startStr);
            const endMins = parseTime(endStr);

            // Handle wrap-around midnight
            if (endMins < startMins) {
                return currentMinutes >= startMins || currentMinutes < endMins;
            }
            return currentMinutes >= startMins && currentMinutes < endMins;
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="panchang-cosmic-container">
            {/* ── Header ── */}
            <div className="panchang-header-card">
                <div className="panchang-top-info-box">
                    <div className="sun-pill pulse-glow-subtle">
                        <span className="sun-icon">☀️</span>
                        <span className="sun-text">AstroRevo Live</span>
                    </div>
                    <div className="header-date">
                        TUESDAY · PHALGUNA · SHUKLA PAKSHA
                    </div>
                </div>
            </div>

            <h1 className="panchang-main-title">Panchang</h1>
            <p className="panchang-subtitle">Vikram Samvat 2082 · 24 February 2026</p>

            {/* ── Rise & Set Row ── */}
            <div className="rise-row">
                <div className="rise-chip sun-chip">
                    <span className="rise-icon">🌅</span>
                    <div className="rise-details">
                        <span className="rise-label">SUNRISE</span>
                        <span className="rise-time">07:06 am</span>
                    </div>
                </div>
                <div className="rise-chip moon-chip">
                    <span className="rise-icon">🌙</span>
                    <div className="rise-details">
                        <span className="rise-label">MOONRISE</span>
                        <span className="rise-time">08:42 pm</span>
                    </div>
                </div>
            </div>

            <div className="rise-row" style={{ marginTop: '-12px' }}>
                <div className="rise-chip sun-chip" style={{ opacity: 0.8 }}>
                    <span className="rise-icon">🌇</span>
                    <div className="rise-details">
                        <span className="rise-label">SUNSET</span>
                        <span className="rise-time">06:48 pm</span>
                    </div>
                </div>
                <div className="rise-chip moon-chip" style={{ opacity: 0.8 }}>
                    <span className="rise-icon">🌌</span>
                    <div className="rise-details">
                        <span className="rise-label">MOONSET</span>
                        <span className="rise-time">09:14 am</span>
                    </div>
                </div>
            </div>

            {/* ── Main Tabs ── */}
            <div className="panchang-main-tabs">
                <button
                    className={`main-tab-btn ${mainTab === 'Overview' ? 'active' : ''}`}
                    onClick={() => setMainTab('Overview')}
                >
                    Overview
                </button>
                <button
                    className={`main-tab-btn ${mainTab === 'Choghadiya' ? 'active' : ''}`}
                    onClick={() => setMainTab('Choghadiya')}
                >
                    Choghadiya
                </button>
            </div>

            {/* ── OVERVIEW TAB ── */}
            {mainTab === 'Overview' && (
                <>
                    {/* Panch Tatva */}
                    <h3 className="panchang-section-title">Panch Tatva</h3>
                    <div className="tatva-grid">
                        <div className="tatva-card">
                            <span className="tatva-icon">🔥</span>
                            <span className="tatva-name">Agni</span>
                            <span className="tatva-value">Fire</span>
                        </div>
                        <div className="tatva-card">
                            <span className="tatva-icon">💨</span>
                            <span className="tatva-name">Vayu</span>
                            <span className="tatva-value">Air</span>
                        </div>
                        <div className="tatva-card">
                            <span className="tatva-icon">🌿</span>
                            <span className="tatva-name">Prithvi</span>
                            <span className="tatva-value">Earth</span>
                        </div>
                        <div className="tatva-card">
                            <span className="tatva-icon">💧</span>
                            <span className="tatva-name">Jal</span>
                            <span className="tatva-value">Water</span>
                        </div>
                        <div className="tatva-card">
                            <span className="tatva-icon">✨</span>
                            <span className="tatva-name">Akash</span>
                            <span className="tatva-value">Ether</span>
                        </div>
                    </div>

                    {/* Today's Panchang Core Info */}
                    <h3 className="panchang-section-title">Today's Panchang</h3>
                    <div className="info-grid">
                        <div className="info-card">
                            <div className="card-label">Tithi</div>
                            <span className="card-icon">🌙</span>
                            <div className="card-value">Dwadashi</div>
                            <div className="card-sub">12th Lunar Day</div>
                            <span className="card-badge">Shukla Paksha</span>
                        </div>

                        <div className="info-card">
                            <div className="card-label">Nakshatra</div>
                            <span className="card-icon">⭐</span>
                            <div className="card-value">Ashlesha</div>
                            <div className="card-sub">Pada 3</div>
                            <span className="card-badge">67% Complete</span>
                        </div>

                        <div className="info-card">
                            <div className="card-label">Yoga</div>
                            <span className="card-icon">🪷</span>
                            <div className="card-value">Siddhi</div>
                            <div className="card-sub">Auspicious</div>
                            <span className="card-badge">Till 11:40 pm</span>
                        </div>

                        <div className="info-card">
                            <div className="card-label">Karan</div>
                            <span className="card-icon">🔱</span>
                            <div className="card-value">Bava</div>
                            <div className="card-sub">Movable</div>
                            <span className="card-badge">Till 08:20 pm</span>
                        </div>

                        <div className="info-card">
                            <div className="card-label">Var (Day)</div>
                            <span className="card-icon">♂️</span>
                            <div className="card-value">Mangalvar</div>
                            <div className="card-sub">Tuesday</div>
                            <span className="card-badge">Mars Lord</span>
                        </div>

                        <div className="info-card">
                            <div className="card-label">Masa</div>
                            <span className="card-icon">📅</span>
                            <div className="card-value">Phalguna</div>
                            <div className="card-sub">12th Month</div>
                            <span className="card-badge">Shaka 1947</span>
                        </div>
                    </div>

                    {/* Nakshatra Detail */}
                    <h3 className="panchang-section-title">Nakshatra Detail</h3>
                    <div className="nakshatra-card">
                        <span className="nakshatra-icon">🐍</span>
                        <div className="nakshatra-info">
                            <div className="nakshatra-label">Current Nakshatra</div>
                            <div className="nakshatra-name">Ashlesha</div>
                            <div className="nakshatra-pada">Pada 3 · Lord: Mercury · Deity: Sarpa</div>
                            <div className="nakshatra-bar-bg">
                                <div className="nakshatra-bar-fill" style={{ width: '67%' }}></div>
                            </div>
                        </div>
                        <div className="nakshatra-pct">67%</div>
                    </div>

                    {/* Moon Phase */}
                    <h3 className="panchang-section-title">Moon Phase</h3>
                    <div className="moon-phase-card">
                        <span className="moon-big">🌔</span>
                        <div className="nakshatra-info">
                            <div className="nakshatra-label">Waxing Gibbous</div>
                            <div className="nakshatra-name">Shukla Dwadashi</div>
                            <div className="nakshatra-pada" style={{ margin: 0 }}>Moon in Cancer · 78% illuminated</div>
                        </div>
                    </div>

                    {/* Timings */}
                    <h3 className="panchang-section-title">Auspicious Timings</h3>
                    <div className="timing-grid">
                        <div className="timing-strip auspicious">
                            <div className="timing-left">
                                <div className="timing-label">✦ Abhijit Muhurat</div>
                                <div className="timing-value">11:58 am – 12:48 pm</div>
                                <div className="timing-sub">Most auspicious time of the day</div>
                            </div>
                            <span className="timing-icon">⭐</span>
                        </div>
                        <div className="timing-strip auspicious">
                            <div className="timing-left">
                                <div className="timing-label">✦ Brahma Muhurat</div>
                                <div className="timing-value" style={{ color: '#90b8ff' }}>05:20 am – 06:10 am</div>
                                <div className="timing-sub">Ideal for meditation & study</div>
                            </div>
                            <span className="timing-icon">🧘</span>
                        </div>
                    </div>

                    <h3 className="panchang-section-title">Inauspicious Timings</h3>
                    <div className="timing-grid">
                        <div className="timing-strip inauspicious">
                            <div className="timing-left">
                                <div className="timing-label">☠ Rahukaal</div>
                                <div className="timing-value" style={{ color: '#fda4af' }}>03:21 pm – 04:52 pm</div>
                                <div className="timing-sub">Avoid important work during this period</div>
                            </div>
                            <span className="timing-icon">🚫</span>
                        </div>
                        <div className="timing-strip inauspicious">
                            <div className="timing-left">
                                <div className="timing-label" style={{ color: '#fb923c' }}>⚠ Yamaganda</div>
                                <div className="timing-value" style={{ color: '#fbd38d' }}>07:06 am – 08:37 am</div>
                                <div className="timing-sub">Inauspicious for new beginnings</div>
                            </div>
                            <span className="timing-icon">⚠️</span>
                        </div>
                    </div>
                </>
            )}

            {/* ── CHOGHADIYA TAB ── */}
            {mainTab === 'Choghadiya' && (
                <>
                    <div className="day-night-toggle">
                        <div className="toggle-pill-container">
                            <button
                                className={`toggle-btn ${activeTab === 'Day' ? 'active-day' : ''}`}
                                onClick={() => setActiveTab('Day')}
                            >
                                <span className="toggle-icon">☀️</span> Day
                            </button>
                            <button
                                className={`toggle-btn ${activeTab === 'Night' ? 'active-night' : ''}`}
                                onClick={() => setActiveTab('Night')}
                            >
                                <span className="toggle-icon">🌙</span> Night
                            </button>
                        </div>
                    </div>

                    <div className="table-header-glass">
                        <div className="th-col th-left">Time</div>
                        <div className="th-col th-center">Muhurat</div>
                        <div className="th-col th-right">Quality</div>
                    </div>

                    <div className="table-body-glass custom-scrollbar">
                        {choghadiyaItems.map((item, index) => {
                            const isActive = isCurrentTimeSlot(item.time_slot);

                            // Map quality to simple class
                            let qualityClass = 'neutral';
                            if (item.quality.toLowerCase() === 'good') qualityClass = 'good';
                            if (item.quality.toLowerCase() === 'bad') qualityClass = 'bad';

                            return (
                                <div key={index} className={`choghadiya-glass-row ${qualityClass} ${isActive ? 'is-active' : ''}`}>
                                    <div className="ch-time-col">
                                        <span className="ch-time-text">
                                            {item.time_slot.split(' - ')[0]}<br />
                                            {item.time_slot.split(' - ')[1]}
                                        </span>
                                        {isActive && <div className="ch-current-badge">NOW</div>}
                                    </div>
                                    <div className="ch-name-col">
                                        <span className="ch-muhurat-name">{item.name}</span>
                                        <span className="ch-muhurat-meaning">{item.meaning}</span>
                                    </div>
                                    <div className="ch-quality-col">
                                        <span className="ch-quality-pill">{item.quality}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="legend-glass">
                        <div className="legend-item"><span className="legend-circle good-circle"></span> Good</div>
                        <div className="legend-item"><span className="legend-circle neutral-circle"></span> Neutral</div>
                        <div className="legend-item"><span className="legend-circle bad-circle"></span> Bad</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PanchangPage;
