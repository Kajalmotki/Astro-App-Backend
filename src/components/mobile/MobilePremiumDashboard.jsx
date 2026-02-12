import React, { useState } from 'react';
import './MobilePremiumDashboard.css';

const MobilePremiumDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'panchang', label: 'Daily Panchang', premium: true },
        { id: 'periods', label: 'Predictions', premium: true },
        { id: 'varga', label: 'Shodashvarga', premium: true },
        { id: 'transits', label: 'Transits' },
        { id: 'compatibility', label: 'Compatibility', premium: true },
    ];

    return (
        <div className="mobile-premium-dashboard">
            {/* Tab Nav */}
            <div className="mobile-dash-tabs-scroll">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`mobile-dash-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                        {tab.premium && <span className="mobile-tab-pro">PRO</span>}
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
                                    <span className="mobile-score-val">96.5</span>
                                    <span className="mobile-score-label">EXALTED</span>
                                </div>
                                <p style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.5', marginTop: '10px', textAlign: 'center' }}>
                                    Your cosmic consciousness is peaking. Current planetary alignments support spiritual breakthroughs and high-stakes decision making.
                                </p>
                            </div>
                        </div>

                        <div className="mobile-dash-card">
                            <h3>Cosmic Highlights</h3>
                            <ul className="mobile-highlights-list">
                                <li><strong>Moon in Mula Nakshatra:</strong> Ideal for getting to the root of complex problems. Healing energy is strong.</li>
                                <li><strong>Gajakesari Yoga Active:</strong> Jupiter and Moon forming a powerful angle. Expect respect and wisdom to flow.</li>
                                <li><strong>Mercury-Sun Conjunction:</strong> Budhaditya Yoga active in the 10th house. Professional intelligence is sharpened.</li>
                                <li><strong>Saturn Retrograde:</strong> Review karmic lessons in relationships. Patience is your golden key today.</li>
                            </ul>
                        </div>
                    </>
                )}

                {/* PANCHANG TAB (NEW) */}
                {activeTab === 'panchang' && (
                    <div className="mobile-dash-card">
                        <h3>☀️ Daily Panchang</h3>
                        <p className="mobile-section-desc">The five limbs of time. Align your actions with cosmic rhythm.</p>

                        <div className="mobile-panchang-grid">
                            <div className="panchang-item">
                                <span className="pi-label">Tithi (Lunar Day)</span>
                                <span className="pi-value">Shukla Ekadashi</span>
                                <span className="pi-sub">Victory & Fasting</span>
                            </div>
                            <div className="panchang-item">
                                <span className="pi-label">Nakshatra (Star)</span>
                                <span className="pi-value">Rohini</span>
                                <span className="pi-sub">Growth & Creation</span>
                            </div>
                            <div className="panchang-item">
                                <span className="pi-label">Yoga (Union)</span>
                                <span className="pi-value">Siddha</span>
                                <span className="pi-sub">Accomplishment</span>
                            </div>
                            <div className="panchang-item">
                                <span className="pi-label">Karana (Half-Day)</span>
                                <span className="pi-value">Bava</span>
                                <span className="pi-sub">Honorable Actions</span>
                            </div>
                            <div className="panchang-item full-width">
                                <span className="pi-label">Vara (Weekday)</span>
                                <span className="pi-value">Brihaspativar (Thursday)</span>
                                <span className="pi-sub">Ruled by Jupiter - Wisdom & Expansion</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* PERIOD ANALYSIS (PRO) */}
                {activeTab === 'periods' && (
                    <div className="mobile-dash-card">
                        <h3>📈 Vimshottari Prediction</h3>
                        <div className="current-dasha-banner">
                            <span className="cd-label">Current Mahadasha</span>
                            <span className="cd-value">Jupiter (Brihaspati)</span>
                            <span className="cd-dates">2022 - 2038</span>
                        </div>

                        <div className="mobile-predictions-list">
                            <div className="mobile-prediction-item">
                                <div className="mp-icon">✨</div>
                                <div className="mp-content">
                                    <h4>Antardasha: Saturn (Shani)</h4>
                                    <p><strong>Focus:</strong> Karma, Career Structure, Discipline.</p>
                                    <p>Jupiter's expansion meets Saturn's restriction. A period for converting big ideas into solid, long-lasting structures. Hard work will pay off exponentially.</p>
                                    <span className="mp-intensity favorable">Karmic Growth</span>
                                </div>
                            </div>

                            <div className="mobile-prediction-item">
                                <div className="mp-icon">💼</div>
                                <div className="mp-content">
                                    <h4>Career Forecast</h4>
                                    <p>The 10th house is activated. Possible promotion or increase in authority. Leadership roles entice you. Avoid shortcuts.</p>
                                    <span className="mp-intensity moderate">High Impact</span>
                                </div>
                            </div>
                            <div className="mobile-prediction-item">
                                <div className="mp-icon">💰</div>
                                <div className="mp-content">
                                    <h4>Wealth & Finance</h4>
                                    <p>Dhana Yoga is forming. Investments in land or long-term assets are favored. Avoid speculative gambling.</p>
                                    <span className="mp-intensity favorable">Prosperous</span>
                                </div>
                            </div>
                            <div className="mobile-prediction-item">
                                <div className="mp-icon">❤️</div>
                                <div className="mp-content">
                                    <h4>Relationships</h4>
                                    <p>Saturn may bring some coldness or distance. Conscious effort is needed to maintain warmth. Good for committed, serious relationships.</p>
                                    <span className="mp-intensity cautious">Requires Patience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SHODASHVARGA (PRO) */}
                {activeTab === 'varga' && (
                    <div className="mobile-dash-card">
                        <h3>🔢 Shodashvarga (16 Charts)</h3>
                        <p className="mobile-section-desc">Micro-analysis of specific life areas.</p>

                        <div className="mobile-varga-list-detailed">
                            {[
                                { code: 'D-1', name: 'Rashi', purpose: 'Root / General Destiny', deity: 'Parameshwara', strength: 92 },
                                { code: 'D-2', name: 'Hora', purpose: 'Wealth & Resources', deity: 'Kubera', strength: 78 },
                                { code: 'D-3', name: 'Drekkana', purpose: 'Siblings & Courage', deity: 'Narada', strength: 65 },
                                { code: 'D-4', name: 'Chaturthamsa', purpose: 'Fortune & Property', deity: 'Brahma', strength: 81 },
                                { code: 'D-7', name: 'Saptamsa', purpose: 'Progeny & Creativity', deity: 'Shiva', strength: 74 },
                                { code: 'D-9', name: 'Navamsa', purpose: 'Spouse & Dharma', deity: 'Vishnu', strength: 88 },
                                { code: 'D-10', name: 'Dasamsa', purpose: 'Career & Status', deity: 'Indra', strength: 85 },
                                { code: 'D-12', name: 'Dwadasamsa', purpose: 'Parents & Lineage', deity: 'Ganesha', strength: 70 },
                                { code: 'D-16', name: 'Shodashamsa', purpose: 'Vehicles & Comforts', deity: 'Sukra', strength: 60 },
                                { code: 'D-20', name: 'Vimsamsa', purpose: 'Spirituality & Occult', deity: 'Kali', strength: 95 },
                                { code: 'D-24', name: 'Chaturvimsamsa', purpose: 'Knowledge & Learning', deity: 'Saraswati', strength: 82 },
                                { code: 'D-27', name: 'Saptavimsamsa', purpose: 'Inner Strength', deity: 'Skanda', strength: 76 },
                                { code: 'D-30', name: 'Trimsamsa', purpose: 'Misfortunes & Evil', deity: 'Yama', strength: 50 },
                                { code: 'D-40', name: 'Khavedamsa', purpose: 'Auspicious/Inauspicious', deity: 'Vishnu', strength: 88 },
                                { code: 'D-45', name: 'Akshavedamsa', purpose: 'Moral Character', deity: 'Shiva', strength: 91 },
                                { code: 'D-60', name: 'Shashtiamsa', purpose: 'Past Life Karma', deity: 'Brahman', strength: 85 },
                            ].map(varga => (
                                <div key={varga.code} className="varga-detailed-row">
                                    <div className="vd-left">
                                        <div className="vd-code">{varga.code}</div>
                                        <div className="vd-info">
                                            <h5>{varga.name}</h5>
                                            <span>{varga.purpose}</span>
                                        </div>
                                    </div>
                                    <div className="vd-right">
                                        <div className="vd-strength-box">
                                            <span style={{ color: varga.strength > 80 ? '#48bb78' : '#ecc94b' }}>{varga.strength}%</span>
                                        </div>
                                        <span className="vd-deity">{varga.deity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TRANSITS */}
                {activeTab === 'transits' && (
                    <div className="mobile-dash-card">
                        <h3>🌍 Precise Planetary Transits</h3>
                        <p className="mobile-section-desc">Real-time geocentric positions active now.</p>
                        <div className="mobile-transits-list">
                            {[
                                { p: 'Sun', s: 'Aquarius', deg: '12° 45\'', n: 'Shatabhisha', pada: '2', h: '3rd', e: 'neutral' },
                                { p: 'Moon', s: 'Sagittarius', deg: '04° 10\'', n: 'Mula', pada: '1', h: '1st', e: 'positive' },
                                { p: 'Mars', s: 'Gemini', deg: '28° 15\'', n: 'Punarvasu', pada: '3', h: '7th', e: 'challenging', retro: true },
                                { p: 'Mercury', s: 'Capricorn', deg: '15° 20\'', n: 'Shravana', pada: '2', h: '2nd', e: 'positive' },
                                { p: 'Jupiter', s: 'Taurus', deg: '08° 05\'', n: 'Krittika', pada: '4', h: '6th', e: 'favorable' },
                                { p: 'Venus', s: 'Pisces', deg: '22° 30\'', n: 'Revati', pada: '2', h: '4th', e: 'exalted' },
                                { p: 'Saturn', s: 'Aquarius', deg: '19° 55\'', n: 'Shatabhisha', pada: '4', h: '3rd', e: 'challenging', retro: true },
                                { p: 'Rahu', s: 'Pisces', deg: '01° 10\'', n: 'Purva Bhadra', pada: '4', h: '4th', e: 'karmic' },
                                { p: 'Ketu', s: 'Virgo', deg: '01° 10\'', n: 'Uttara Phalguni', pada: '2', h: '10th', e: 'spiritual' },
                                { p: 'Uranus', s: 'Aries', deg: '14° 22\'', n: 'Bharani', pada: '1', h: '5th', e: 'sudden' },
                                { p: 'Neptune', s: 'Pisces', deg: '29° 01\'', n: 'Revati', pada: '4', h: '4th', e: 'mystical' },
                                { p: 'Pluto', s: 'Capricorn', deg: '28° 50\'', n: 'Dhanishta', pada: '2', h: '2nd', e: 'transformative' },
                            ].map((t, i) => (
                                <div key={i} className={`mobile-transit-row ${t.e}`}>
                                    <div className="mt-info">
                                        <div className="mt-top">
                                            <span className="mt-planet">{t.p} {t.retro && 'IsRetro'}</span>
                                            <span className="mt-deg">{t.deg}</span>
                                        </div>
                                        <span className="mt-details">{t.s} • {t.h} H</span>
                                        <span className="mt-nakshatra">★ {t.n} (Pada {t.pada})</span>
                                    </div>
                                    <span className={`mt-effect ${t.e}`}>
                                        {t.e === 'exalted' ? '👑 Exalted' : t.e}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* COMPATIBILITY (PRO) */}
                {activeTab === 'compatibility' && (
                    <div className="mobile-dash-card">
                        <h3>🤝 Ashtakoota Match</h3>
                        <p className="mobile-section-desc">Traditional 36-point Guna Milan system.</p>

                        <div className="mobile-partner-form">
                            <h4>New Match Report</h4>
                            <div className="mobile-input-row">
                                <input type="text" placeholder="Partner's Name" className="mobile-input" style={{ flex: 2 }} />
                                <button className="mobile-action-btn-small" style={{ flex: 1 }}>Analyze</button>
                            </div>
                        </div>

                        <div className="guna-milan-table">
                            <div className="gm-header">
                                <span>Koota (Area)</span>
                                <span>Max</span>
                                <span>Score</span>
                            </div>
                            {[
                                { name: 'Varna (Work)', max: 1, score: 1 },
                                { name: 'Vashya (Dominance)', max: 2, score: 1.5 },
                                { name: 'Tara (Destiny)', max: 3, score: 3 },
                                { name: 'Yoni (Nature)', max: 4, score: 2 },
                                { name: 'Graha Maitri (Friendship)', max: 5, score: 5 },
                                { name: 'Gana (Temperament)', max: 6, score: 6 },
                                { name: 'Bhakoot (Love)', max: 7, score: 7 },
                                { name: 'Nadi (Health/Genes)', max: 8, score: 0 },
                            ].map((k, i) => (
                                <div key={i} className="gm-row">
                                    <span className="gm-name">{k.name}</span>
                                    <span className="gm-max">{k.max}</span>
                                    <span className="gm-score" style={{ color: k.score === k.max ? '#48bb78' : k.score === 0 ? '#fc8181' : 'white' }}>
                                        {k.score}
                                    </span>
                                </div>
                            ))}
                            <div className="gm-total">
                                <span>Total Guna Score</span>
                                <span className="gm-total-score">25.5 / 36</span>
                            </div>
                        </div>

                        <div className="compatibility-conclusion">
                            <h4>Verdict: Good Match (Adminable)</h4>
                            <p>Significant spiritual and emotional bond (Bhakoot & Maitri). However, Nadi Dosha is present (0 points), indicating possible health concerns for progeny. Remedial measures recommended.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobilePremiumDashboard;
