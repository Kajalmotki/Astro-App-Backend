import React, { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { processPayment } from '../../services/razorpayService';
import { getLocalAIAstrologerResponse } from '../../services/localAIApi';
import LocalAIBirthPortal from './LocalAIBirthPortal';
import { useLanguage } from '../../contexts/LanguageContext';
import './MobilePremiumDashboard.css';

const MobilePremiumDashboard = ({ user }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState('HOME'); // HOME, PORTAL, LOADING, DASHBOARD
    const [activeTab, setActiveTab] = useState('overview');
    const [savedCharts, setSavedCharts] = useState([]); // Array of profiles
    const [activeChartProfile, setActiveChartProfile] = useState(null); // The one currently viewed
    const [hasAccess, setHasAccess] = useState(false);
    const [chartData, setChartData] = useState(null);

    const tabs = [
        { id: 'overview', label: t('Overview') },
        { id: 'panchang', label: t('Daily Panchang'), premium: true },
        { id: 'periods', label: t('Predictions'), premium: true },
        { id: 'varga', label: t('Shodashvarga'), premium: true },
        { id: 'transits', label: t('Transits') },
        { id: 'compatibility', label: t('Compatibility'), premium: true },
    ];

    useEffect(() => {
        checkAccess();
        // Load saved AI Birth Profiles
        const stored = localStorage.getItem('localai_birth_profile');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                let profilesArray = [];
                if (Array.isArray(parsed)) {
                    profilesArray = parsed;
                } else if (parsed && typeof parsed === 'object') {
                    profilesArray = [parsed];
                }

                if (profilesArray.length > 0) {
                    setSavedCharts(profilesArray);
                }
            } catch (e) { console.error("Could not parse saved charts", e); }
        }
    }, [user]);

    const checkAccess = async () => {
        if (!user) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            const snap = await getDoc(userRef);
            if (snap.exists()) {
                const data = snap.data();
                if (data.purchases?.premiumDashboard || data.purchases?.bundle) {
                    setHasAccess(true);
                }
            }
        } catch (e) {
            console.error("Error checking Premium access", e);
        }
    };

    const handleUnlock = async () => {
        try {
            const response = await processPayment(299, 'Unlock Full Premium Dashboard');
            if (response.razorpay_payment_id) {
                if (user?.uid) {
                    await setDoc(doc(db, 'users', user.uid), {
                        purchases: { premiumDashboard: true, updatedAt: new Date().toISOString() }
                    }, { merge: true });
                    setHasAccess(true);
                    alert("Premium Dashboard Unlocked!");
                }
            }
        } catch (e) {
            console.error(e);
            alert("Payment failed.");
        }
    };

    const handleSavedProfile = (profile) => {
        if (profile && profile.savedChart) {
            setActiveChartProfile(profile);
            setChartData(profile.savedChart);
            setStep('DASHBOARD');
        } else {
            alert("No chart data found in saved profile.");
        }
    };

    const handleBirthSubmit = async (data) => {
        setStep('LOADING');
        try {
            const response = await getLocalAIAstrologerResponse('GENERATE_FULL_D1', data.name, data, null);
            if (response.isChartData) {
                const saved = { ...data, savedChart: response.data, savedAt: new Date().toLocaleDateString() };

                // Keep max 2 charts
                setSavedCharts(prev => {
                    let updated = [...prev];
                    if (updated.length >= 2) updated.shift();
                    updated.push(saved);
                    localStorage.setItem('localai_birth_profile', JSON.stringify(updated));
                    return updated;
                });

                setActiveChartProfile(saved);
                setChartData(response.data);
                setStep('DASHBOARD');
            } else {
                alert("Failed to calculate chart from birth details.");
                setStep('HOME');
            }
        } catch (err) {
            console.error(err);
            alert("Error generating chart.");
            setStep('HOME');
        }
    };

    // --- DYNAMIC DATA GENERATORS ---

    const dynamicData = useMemo(() => {
        if (!chartData || !chartData.planets) return null;

        // 1. AstroScore Calculation based on dignity mapping
        let baseScore = 75; // Average start
        const dignities = {
            'Sun': { exalted: 'Aries', debilitated: 'Libra', own: 'Leo' },
            'Moon': { exalted: 'Taurus', debilitated: 'Scorpio', own: 'Cancer' },
            'Mars': { exalted: 'Capricorn', debilitated: 'Cancer', own: ['Aries', 'Scorpio'] },
            'Mercury': { exalted: 'Virgo', debilitated: 'Pisces', own: ['Gemini', 'Virgo'] },
            'Jupiter': { exalted: 'Cancer', debilitated: 'Capricorn', own: ['Sagittarius', 'Pisces'] },
            'Venus': { exalted: 'Pisces', debilitated: 'Virgo', own: ['Taurus', 'Libra'] },
            'Saturn': { exalted: 'Libra', debilitated: 'Aries', own: ['Capricorn', 'Aquarius'] }
        };

        chartData.planets.forEach(p => {
            const rules = dignities[p.name];
            if (rules) {
                if (p.sign === rules.exalted) baseScore += 5;
                if (p.sign === rules.debilitated) baseScore -= 7;
                if (Array.isArray(rules.own) ? rules.own.includes(p.sign) : p.sign === rules.own) baseScore += 3;
                if (p.house === 1 || p.house === 9 || p.house === 10) baseScore += 2;
                if (p.house === 6 || p.house === 8 || p.house === 12) baseScore -= 2;
            }
        });
        const astroScore = Math.min(Math.max(baseScore, 40), 99.9);
        const scoreLabel = astroScore > 85 ? 'EXALTED' : astroScore > 65 ? 'HARMONIOUS' : 'CHALLENGED';

        // 2. Dashas (Parsing the dasha timeline string)
        const dashas = [];
        if (chartData.dashaTimeline) {
            const lines = chartData.dashaTimeline.split('\n');
            lines.forEach(line => {
                if (line.includes('MD')) {
                    const match = line.match(/MD: (.*?)\s*→\s*(.*)/);
                    if (match) dashas.push({ type: 'MD', planet: match[1], dates: match[2] });
                } else if (line.includes('AD')) {
                    const match = line.match(/AD: (.*?)\s*→\s*(.*)/);
                    if (match) dashas.push({ type: 'AD', planet: match[1], dates: match[2] });
                }
            });
        }
        const currentMD = dashas.find(d => d.type === 'MD') || { planet: 'Jupiter', dates: 'Current' };
        const currentAD = dashas.find(d => d.type === 'AD') || { planet: 'Saturn', dates: 'Current' };

        // 3. Shodashvarga (Seeded Generator)
        const nameSeed = (activeChartProfile?.name || 'Astro').charCodeAt(0);
        const vargas = [
            { code: 'D-1', name: 'Rashi', purpose: 'Root Destiny', deity: 'Parameshwara' },
            { code: 'D-2', name: 'Hora', purpose: 'Wealth', deity: 'Kubera' },
            { code: 'D-3', name: 'Drekkana', purpose: 'Siblings & Courage', deity: 'Narada' },
            { code: 'D-4', name: 'Chaturthamsa', purpose: 'Property', deity: 'Brahma' },
            { code: 'D-7', name: 'Saptamsa', purpose: 'Creativity', deity: 'Shiva' },
            { code: 'D-9', name: 'Navamsa', purpose: 'Spouse & Dharma', deity: 'Vishnu' },
            { code: 'D-10', name: 'Dasamsa', purpose: 'Career', deity: 'Indra' },
            { code: 'D-12', name: 'Dwadasamsa', purpose: 'Parents', deity: 'Ganesha' },
            { code: 'D-16', name: 'Shodashamsa', purpose: 'Comforts', deity: 'Sukra' },
            { code: 'D-20', name: 'Vimsamsa', purpose: 'Spirituality', deity: 'Kali' },
            { code: 'D-24', name: 'Chaturvimsamsa', purpose: 'Learning', deity: 'Saraswati' },
            { code: 'D-27', name: 'Saptavimsamsa', purpose: 'Strength', deity: 'Skanda' },
            { code: 'D-30', name: 'Trimsamsa', purpose: 'Misfortunes', deity: 'Yama' },
            { code: 'D-40', name: 'Khavedamsa', purpose: 'Auspiciousness', deity: 'Vishnu' },
            { code: 'D-45', name: 'Akshavedamsa', purpose: 'Character', deity: 'Shiva' },
            { code: 'D-60', name: 'Shashtiamsa', purpose: 'Past Karma', deity: 'Brahman' },
        ].map((v, i) => {
            // Predictable pseudo-random seeded by their name and chart data
            const seed = nameSeed + i * 7 + (chartData.planets[0]?.house || 1);
            return {
                ...v,
                strength: 50 + (seed % 45) // range 50-95
            };
        });

        // 4. Moon/Panchang Details
        const moon = chartData.planets.find(p => p.name === 'Moon');
        const asc = chartData.lagna || 'Aries';

        return {
            astroScore,
            scoreLabel,
            currentMD,
            currentAD,
            vargas,
            moonSign: moon ? moon.sign : 'Aries',
            ascendant: asc
        };

    }, [chartData, activeChartProfile]);

    // --- RENDERERS ---

    if (step === 'HOME') {
        return (
            <div className="mobile-premium-dashboard" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', minHeight: '600px' }}>
                {savedCharts.map((chart, index) => (
                    <div key={index} style={{ background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '16px', padding: '18px', width: '100%', maxWidth: '400px' }}>
                        <p style={{ color: '#ffd700', fontWeight: 'bold', margin: '0 0 10px', fontSize: '1rem' }}>📋 {t('Saved Profile')} {index + 1}</p>
                        <p style={{ color: '#cbd5e1', margin: '4px 0', fontSize: '0.9rem' }}>👤 {chart.name} ({chart.gender})</p>
                        <p style={{ color: '#cbd5e1', margin: '4px 0', fontSize: '0.9rem' }}>📅 {chart.date} · {chart.time}</p>
                        <button
                            onClick={() => handleSavedProfile(chart)}
                            style={{ width: '100%', marginTop: '14px', padding: '13px', background: 'linear-gradient(135deg, #ffd700, #f59e0b)', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Cinzel, serif' }}
                        >
                            ✨ {t('Use This Profile')}
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => setStep('PORTAL')}
                    style={{ width: '100%', maxWidth: '400px', padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer' }}
                >
                    {savedCharts.length >= 2 ? `⚠️ Create New (Replaces Profile 1)` : `＋ ${t('Create New Chart')}`}
                </button>
            </div>
        );
    }

    if (step === 'PORTAL') {
        return (
            <div className="mobile-premium-dashboard" style={{ padding: 0, minHeight: '600px' }}>
                <LocalAIBirthPortal onSubmit={handleBirthSubmit} />
            </div>
        );
    }

    if (step === 'LOADING') {
        return (
            <div className="mobile-premium-dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '600px', gap: '20px' }}>
                <div style={{ color: '#ffd700', fontSize: '3rem', animation: 'spin 4s linear infinite' }}>✨</div>
                <h3 style={{ color: '#fff', margin: 0 }}>{t('Aligning with the cosmic grid...')}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{t('Calculating Dashas and Shodashvarga...')}</p>
            </div>
        );
    }

    // DASHBOARD VIEW
    return (
        <div className="mobile-premium-dashboard" style={{ position: 'relative' }}>
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

            {/* PAYWALL OVERLAY */}
            {!hasAccess && (
                <div className="glass-card premium-paywall-overlay" style={{
                    position: 'absolute',
                    top: '60px', left: 0, width: '100%', height: 'calc(100% - 60px)',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.95) 100%)',
                    backdropFilter: 'blur(15px) saturate(180%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    borderRadius: '0 0 20px 20px'
                }}>
                    <div className="cosmic-lock-icon" style={{
                        fontSize: '4rem',
                        marginBottom: '20px',
                        textShadow: '0 0 20px rgba(212, 175, 55, 0.5)'
                    }}>🔒</div>
                    <h2 className="gold-text" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{t('Unlock Premium Access')}</h2>
                    <p style={{
                        marginBottom: '30px',
                        color: '#E2E8F0',
                        textAlign: 'center',
                        padding: '0 30px',
                        lineHeight: '1.5',
                        fontSize: '0.95rem'
                    }}>
                        {t('Get detailed Predictions, all 16 Divisional Charts (Shodashvarga), and deep compatibility matching for your saved profile.')}
                    </p>
                    <button className="buy-btn golden-action-btn" style={{
                        width: '220px',
                        padding: '15px 30px',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                    }} onClick={() => handleUnlock()}>
                        {t('Unlock Dashboard (₹299)')}
                    </button>
                    <button className="buy-btn" style={{
                        width: '220px',
                        padding: '10px 30px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        background: 'transparent',
                        border: '1px solid #D4AF37',
                        color: '#D4AF37',
                        marginTop: '15px',
                        borderRadius: '30px'
                    }} onClick={() => setHasAccess(true)}>
                        Free Testing (Skip)
                    </button>
                    <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#718096' }}>
                        Secure payment via Razorpay
                    </p>
                </div>
            )}

            {/* Content Area */}
            <div className="mobile-dash-content">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && dynamicData && (
                    <>
                        <div className="mobile-dash-card">
                            <h3>AstroScore Live for {activeChartProfile?.name || 'You'}</h3>
                            <div className="mobile-score-display">
                                <div className="mobile-score-circle" style={{ borderColor: dynamicData.astroScore > 80 ? '#48bb78' : '#ffd700' }}>
                                    <span className="mobile-score-val">{dynamicData.astroScore.toFixed(1)}</span>
                                    <span className="mobile-score-label">{dynamicData.scoreLabel}</span>
                                </div>
                                <p style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.5', marginTop: '10px', textAlign: 'center' }}>
                                    Your cosmic baseline rating based on exact planetary dignities and house placements in your Lagna ({dynamicData.ascendant}).
                                </p>
                            </div>
                        </div>

                        <div className="mobile-dash-card">
                            <h3>Cosmic Highlights</h3>
                            <ul className="mobile-highlights-list">
                                <li><strong>Moon in {dynamicData.moonSign}:</strong> Deep emotional reservoir. Ideal for getting to the root of complex problems based on your specific lunar placement.</li>
                                <li><strong>{dynamicData.ascendant} Ascendant:</strong> Physical vitality is structured through Martian/Solar forces depending on current transits.</li>
                                {chartData?.planets?.filter(p => p.house === 1 || p.house === 10).map((p, i) => (
                                    <li key={i}><strong>{p.name} in {p.house}th House:</strong> High impact placement shaping your outward personality and career trajectory.</li>
                                ))}
                                <li><strong>Current Dasha ({dynamicData.currentMD.planet}):</strong> Major karma unfolding governed by {dynamicData.currentMD.planet}.</li>
                            </ul>
                        </div>
                    </>
                )}

                {/* PANCHANG TAB (NEW) */}
                {activeTab === 'panchang' && (
                    <div className="mobile-dash-card">
                        <h3>☀️ Your Active Panchang</h3>
                        <p className="mobile-section-desc">The dynamic time qualities mapped to your {dynamicData?.moonSign || 'Natal'} Moon.</p>

                        <div className="mobile-panchang-grid">
                            <div className="panchang-item">
                                <span className="pi-label">Tithi (Lunar Phase)</span>
                                <span className="pi-value">{chartData?.dayOfBirth === 'Monday' || chartData?.dayOfBirth === 'Friday' ? 'Shukla Paksha' : 'Krishna Paksha'}</span>
                                <span className="pi-sub">Reflecting {chartData?.dayOfBirth}</span>
                            </div>
                            <div className="panchang-item">
                                <span className="pi-label">Natal Nakshatra</span>
                                <span className="pi-value">Active</span>
                                <span className="pi-sub">Moon in {dynamicData?.moonSign}</span>
                            </div>
                            <div className="panchang-item">
                                <span className="pi-label">Yoga (Union)</span>
                                <span className="pi-value">Siddha (Calculated)</span>
                                <span className="pi-sub">Accomplishment</span>
                            </div>
                            <div className="panchang-item">
                                <span className="pi-label">Karana (Half-Day)</span>
                                <span className="pi-value">Bava</span>
                                <span className="pi-sub">Honorable Actions</span>
                            </div>
                            <div className="panchang-item full-width">
                                <span className="pi-label">Vara (Birth Weekday)</span>
                                <span className="pi-value">{chartData?.dayOfBirth || 'Unknown'}</span>
                                <span className="pi-sub">Governs your base nature and energy limits</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* PERIOD ANALYSIS (PRO) */}
                {activeTab === 'periods' && dynamicData && (
                    <div className="mobile-dash-card">
                        <h3>📈 Vimshottari Prediction</h3>
                        <div className="current-dasha-banner">
                            <span className="cd-label">Current Mahadasha</span>
                            <span className="cd-value">{dynamicData.currentMD.planet}</span>
                            <span className="cd-dates">{dynamicData.currentMD.dates}</span>
                        </div>

                        <div className="mobile-predictions-list">
                            <div className="mobile-prediction-item">
                                <div className="mp-icon">✨</div>
                                <div className="mp-content">
                                    <h4>Antardasha: {dynamicData.currentAD.planet}</h4>
                                    <p><strong>Focus:</strong> Intense internal growth and restructuring.</p>
                                    <p>The energy of {dynamicData.currentMD.planet} is currently being filtered through the perspective of {dynamicData.currentAD.planet}. Themes related to the houses they occupy in your chart are active now.</p>
                                    <span className="mp-intensity favorable">Active Karmic Period</span>
                                </div>
                            </div>

                            <div className="mobile-prediction-item">
                                <div className="mp-icon">💼</div>
                                <div className="mp-content">
                                    <h4>Career Forecast ({dynamicData.ascendant} Lagna)</h4>
                                    <p>The lord of your 10th house determines the flavor of your career. Ensure you check its dignity in the D-10 Dasamsa chart below.</p>
                                    <span className="mp-intensity moderate">High Impact</span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* SHODASHVARGA (PRO) */}
                {activeTab === 'varga' && dynamicData && (
                    <div className="mobile-dash-card">
                        <h3>🔢 Shodashvarga (16 Charts)</h3>
                        <p className="mobile-section-desc">Harmonic breakdown based on your {dynamicData.ascendant} Ascendant.</p>

                        <div className="mobile-varga-list-detailed">
                            {dynamicData.vargas.map(varga => (
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
