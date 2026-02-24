import React, { useState, useEffect } from 'react';
import AstroChart from '../AstroChart';
import { getLocalVedicChart, getVedicChartSvg } from '../../services/vedicAstroApi';
import { precalculateChartData } from '../../services/localAIApi';
import BirthDetailsForm from '../BirthDetailsForm';
import './AstroChartPage.css';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import New Subcomponents
import Overview from './astro-chart/Overview';
import Charts from './astro-chart/Charts';
import Planets from './astro-chart/Planets';
import Doshas from './astro-chart/Doshas';
import Yogas from './astro-chart/Yogas';
import Dashas from './astro-chart/Dashas';
import Remedies from './astro-chart/Remedies';

const AstroChartPage = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [isChartGenerated, setIsChartGenerated] = useState(false);
    const [userData, setUserData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [chartType, setChartType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Overview');

    // Saved Profile state
    const [view, setView] = useState('home'); // 'home' | 'portal'
    const [birthProfile, setBirthProfile] = useState(null);
    const STORAGE_KEY = 'localai_birth_profile';

    const tabs = ['Overview', 'Charts', 'Planets', 'Doshas', 'Yogas', 'Dashas', 'Remedies'];

    // Load saved profile on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setBirthProfile(parsed);
                setView('home');
            } catch {
                setView('portal');
            }
        } else {
            setView('portal');
        }
    }, [isOpen]);

    const handleFormSubmit = async (data) => {
        // If coming from form, ensure we save it
        if (view === 'portal') {
            const profileToSave = {
                ...data,
                cityName: data.place || data.cityName || 'Unknown Location',
                savedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
            setBirthProfile(profileToSave);
        }

        setUserData(data);
        setIsLoading(true);
        setError(null);
        setIsChartGenerated(true);

        try {
            // Compute Exact Mathematical Chart locally via ephemeris
            const mathData = precalculateChartData(data);
            if (!mathData) {
                throw new Error("Local Math Engine failed to calculate planetary positions.");
            }

            const result = await getLocalVedicChart(data);

            setChartData({
                svg: result.data,
                math: mathData
            });
            setChartType('svg');

        } catch (err) {
            console.error("Failed to generate chart:", err);
            setError("Could not generate chart. Please check your internet connection.");
        } finally {
            setIsLoading(false);
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && onClose) onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="kundli-overlay">
            {/* Video Background */}
            <video
                autoPlay loop muted playsInline className="kundli-video-bg"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
            >
                <source src="/videos/night_sky_timelapse.mp4" type="video/mp4" />
            </video>
            <div className="kundli-video-overlay" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 3, 13, 0.6)', zIndex: 0
            }}></div>

            <div className="sc-container">
                <div className="topbar">
                    <div className="back-btn" onClick={() => isChartGenerated ? setIsChartGenerated(false) : navigate('/mobile/home')}>
                        <ArrowLeft size={14} /> Back
                    </div>
                    <div className="topbar-title">Kundli & Chart</div>
                    <div className="close-btn" onClick={onClose}><X size={14} /></div>
                </div>

                <div className="scroll">
                    {/* Header is hidden when in home profile selection view to match the localized screenshot style */}
                    {!(view === 'home' && !isChartGenerated && birthProfile) && (
                        <div className="sec-head" style={{ position: 'relative' }}>
                            <h2>{isChartGenerated ? "Your Blueprint" : "Cosmic Mapping"}</h2>
                            <div className="sub" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {isChartGenerated ? `${userData?.name || 'User'}'s Astral Blueprint` : "Generate your Vedic Kundli"}
                            </div>
                            <div className="rule"></div>
                        </div>
                    )}

                    {!isChartGenerated ? (
                        view === 'home' && birthProfile ? (
                            <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
                                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔮</div>
                                    <h2 style={{ color: '#ffd700', fontFamily: 'Cinzel, serif', margin: 0, fontSize: '1.3rem' }}>Choose a Chart</h2>
                                    <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: '0.9rem' }}>Start a new session</p>
                                </div>

                                {/* Saved profile card */}
                                <div style={{ background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '16px', padding: '18px' }}>
                                    <p style={{ color: '#ffd700', fontWeight: 'bold', margin: '0 0 10px', fontSize: '1rem' }}>📋 Saved Profile</p>
                                    <p style={{ color: '#cbd5e1', margin: '4px 0', fontSize: '0.9rem' }}>👤 {birthProfile.name} {birthProfile.gender ? `(${birthProfile.gender})` : ''}</p>
                                    <p style={{ color: '#cbd5e1', margin: '4px 0', fontSize: '0.9rem' }}>📅 {birthProfile.date} · {birthProfile.time}</p>
                                    <p style={{ color: '#cbd5e1', margin: '4px 0', fontSize: '0.9rem' }}>📍 {birthProfile.cityName || birthProfile.place}</p>
                                    {birthProfile.savedAt && <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: '0.8rem' }}>Last saved: {birthProfile.savedAt}</p>}

                                    <button
                                        onClick={() => handleFormSubmit(birthProfile)}
                                        style={{ width: '100%', marginTop: '14px', padding: '13px', background: 'linear-gradient(135deg, #ffd700, #f59e0b)', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Cinzel, serif' }}
                                    >
                                        ✨ Use This Profile
                                    </button>
                                </div>

                                {/* Create new */}
                                <button
                                    onClick={() => setView('portal')}
                                    style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer' }}
                                >
                                    ＋ Create New Chart
                                </button>
                            </div>
                        ) : (
                            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '90px' }}>
                                <div className="form-glass-wrap">
                                    <div className="mandala-wrap" style={{ position: 'absolute', top: '-60px', right: '-40px', opacity: 0.15, pointerEvents: 'none', transform: 'scale(0.8)' }}>
                                        <div className="m-ring m-r1"></div>
                                        <div className="m-ring m-r2"></div>
                                        <div className="m-ring m-r3"></div>
                                        <div className="m-core"><span className="m-om">ॐ</span></div>
                                    </div>
                                    <BirthDetailsForm onSubmit={handleFormSubmit} hideSubmit={true} />
                                </div>

                                {/* Mockup specifically requests these on input screen as previews */}
                                <div>
                                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--vp-w40)', letterSpacing: '0.15em', marginBottom: '16px' }}>PLANETARY POSITIONS PREVIEW</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[
                                            { name: 'Sun', symbol: '☀️', sign: 'Leo', degree: '12°45\'', house: '1st House', status: 'EXALTED', color: 'rgba(255, 200, 100, 0.2)', dot: '#fbbf24' },
                                            { name: 'Moon', symbol: '🌙', sign: 'Cancer', degree: '24°10\'', house: '4th House', status: 'STRONG', color: 'rgba(200, 230, 255, 0.2)', dot: '#94a3b8' },
                                            { name: 'Mars', symbol: '🔴', sign: 'Aries', degree: '08°22\'', house: '9th House', status: 'OWN SIGN', color: 'rgba(255, 100, 100, 0.2)', dot: '#ef4444' }
                                        ].map(p => (
                                            <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.dot, boxShadow: `0 0 10px ${p.dot}` }}></div>
                                                    <div>
                                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--vp-w90)' }}>{p.name} {p.symbol}</div>
                                                        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--vp-w50)', marginTop: '4px' }}>{p.sign} · {p.degree} · {p.house}</div>
                                                    </div>
                                                </div>
                                                <div style={{ padding: '4px 10px', borderRadius: '12px', background: p.color, border: `1px solid ${p.color}`, fontFamily: 'var(--font-ui)', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--vp-w90)' }}>
                                                    {p.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--vp-w40)', letterSpacing: '0.15em', marginBottom: '16px' }}>ASHTAKAVARGA BINDUS</div>
                                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px 16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px' }}>
                                        {[28, 34, 22, 38, 25, 30, 27].map((val, i) => (
                                            <div key={i} style={{ width: '12%', background: val > 30 ? 'rgba(147, 51, 234, 0.4)' : 'rgba(255,255,255,0.1)', height: `${(val / 40) * 100}%`, borderRadius: '4px 4px 0 0', position: 'relative', borderTop: `1px solid ${val > 30 ? '#d8b4fe' : 'rgba(255,255,255,0.2)'}` }}>
                                                <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: val > 30 ? '#d8b4fe' : 'var(--vp-w60)' }}>{val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--vp-w40)', letterSpacing: '0.15em', marginBottom: '16px' }}>VIMSHOTTARI DASHA TIMELINE</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(147, 51, 234, 0.1)', border: '1px solid rgba(147, 51, 234, 0.3)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: '#d8b4fe', marginBottom: '4px' }}>
                                                <span>JUPITER MAHADASHA</span>
                                                <span>2018 - 2034</span>
                                            </div>
                                            <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '12px' }}>
                                                <div style={{ width: '45%', height: '100%', background: '#a855f7', borderRadius: '2px' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ position: 'fixed', bottom: '24px', left: '16px', right: '16px', zIndex: 10, display: 'flex', gap: '12px' }}>
                                    <button onClick={() => {
                                        const formBtn = document.querySelector('.submit-btn');
                                        if (formBtn) formBtn.click();
                                    }} style={{ flex: '2', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '16px', borderRadius: '24px', color: 'white', fontFamily: 'var(--font-ui)', letterSpacing: '0.1em', fontSize: '0.75rem', cursor: 'pointer', backdropFilter: 'blur(16px)' }}>
                                        ✦ GENERATE FULL KUNDLI
                                    </button>
                                    <button style={{ flex: '1', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '24px', color: 'var(--vp-w50)', fontFamily: 'var(--font-ui)', letterSpacing: '0.1em', fontSize: '0.75rem', cursor: 'pointer', backdropFilter: 'blur(16px)' }}>
                                        SAVE
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        <>
                            <div className="mandala-wrap">
                                <div className="m-ring m-r1"></div>
                                <div className="m-ring m-r2"></div>
                                <div className="m-ring m-r3"></div>
                                <div className="m-core"><span className="m-om">ॐ</span></div>
                                <div className="m-dot" style={{ top: '8px', left: '40px' }}></div>
                                <div className="m-dot" style={{ bottom: '20px', right: '15px' }}></div>
                                <div className="m-dot" style={{ top: '30px', right: '-5px' }}></div>
                            </div>

                            {/* Horizontal Scrollable Pill Tabs */}
                            <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    overflowX: 'auto',
                                    paddingBottom: '8px',
                                    WebkitOverflowScrolling: 'touch'
                                }}>
                                    {tabs.map(tab => (
                                        <div
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pill ${activeTab === tab ? 'pill-hi' : ''}`}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '6px 14px',
                                                fontSize: '0.65rem',
                                                whiteSpace: 'nowrap',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            {tab.toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                                {activeTab === 'Overview' && <Overview userData={userData} />}
                                {activeTab === 'Charts' && <Charts chartData={chartData} chartType={chartType} isLoading={isLoading} error={error} />}
                                {activeTab === 'Planets' && <Planets chartData={chartData} />}
                                {activeTab === 'Doshas' && <Doshas chartData={chartData} />}
                                {activeTab === 'Yogas' && <Yogas chartData={chartData} />}
                                {activeTab === 'Dashas' && <Dashas chartData={chartData} />}
                                {activeTab === 'Remedies' && <Remedies chartData={chartData} />}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AstroChartPage;
