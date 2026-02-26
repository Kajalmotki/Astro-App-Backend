import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Map, Activity, Heart, Star, Compass, Lock, ChevronRight, ChevronDown, Globe, Sun, Moon, MessageCircle, Crown, Zap } from 'lucide-react';
import BirthDetailsForm from '../components/BirthDetailsForm';
import AstroChart from '../components/AstroChart';
import { getLocalVedicChart } from '../services/vedicAstroApi';
import ChakraYogaPage from '../components/pages/ChakraYogaPage';
import MembershipModal from '../components/MembershipModal';
import BCAAnalysis from '../components/BCAAnalysis';
import { useAuth } from '../components/AuthModal';
import { checkMembershipStatus } from '../services/razorpayService';
import MobilePremiumDashboard from '../components/mobile/MobilePremiumDashboard';
import { useLanguage } from '../contexts/LanguageContext';
import './MobileReports.css';

const MobileReports = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    // Check for navigation state to open specific sections automatically
    useEffect(() => {
        if (location.state?.openPremium) {
            setActiveSection('premium');
        }
        if (location.state?.openBCA) {
            setActiveSection('bca');
            // Wait a tiny bit for the accordion to animate open, then reveal the modal
            setTimeout(() => setIsBCAOpen(true), 150);
        }
    }, [location.state]);

    // State for Accordion
    const [activeSection, setActiveSection] = useState(null); // 'birth-chart', 'astrorevo-chart', 'premium', 'yoga', 'bca'

    // State for Birth Chart
    const [chartData, setChartData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [isChartGenerated, setIsChartGenerated] = useState(false);

    // State for Modals
    const [selectedChakra, setSelectedChakra] = useState(null);
    const [isMembershipOpen, setIsMembershipOpen] = useState(false);
    const [isBCAOpen, setIsBCAOpen] = useState(false);

    // State for Nakshatra Expansion
    const [isNakshatraExpanded, setIsNakshatraExpanded] = useState(false);
    const [liveNakshatra, setLiveNakshatra] = useState(null);

    // Fetch Live Nakshatra on mount via dynamic import to isolate dependency
    useEffect(() => {
        const fetchLiveNakshatra = async () => {
            try {
                // Determine nakshatra calculation dynamically
                const { getCurrentTransitNakshatra } = await import('../utils/nakshatraUtils.js');
                const transitData = getCurrentTransitNakshatra();
                if (transitData) {
                    setLiveNakshatra(transitData);
                }
            } catch (err) {
                console.error("Error loading Nakshatra data:", err);
            }
        };

        fetchLiveNakshatra();
    }, []);

    // Auth & Premium State
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            if (user) {
                const status = await checkMembershipStatus(user.uid);
                setIsPremium(status);
            }
        };
        checkStatus();
    }, [user, isMembershipOpen]); // Re-check when membership modal closes (e.g. after purchase)

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    // Chakra Data
    const chakras = [
        { name: 'Sahasrara', color: '#E9D8FD', rgb: '233, 216, 253', symbol: 'ॐ', description: 'Crown: Pure Consciousness', petals: 1000, yantra: 'circle' },
        { name: 'Ajna', color: '#B794F4', rgb: '183, 148, 244', symbol: 'ॐ', description: 'Third Eye: Intuition', petals: 2, yantra: 'circle' },
        { name: 'Vishuddha', color: '#63B3ED', rgb: '99, 179, 237', symbol: 'हं', description: 'Throat: Expression', petals: 16, yantra: 'circle' },
        { name: 'Anahata', color: '#68D391', rgb: '104, 211, 145', symbol: 'यं', description: 'Heart: Love & Balance', petals: 12, yantra: 'hexagram' },
        { name: 'Manipura', color: '#F6E05E', rgb: '246, 224, 94', symbol: 'रं', description: 'Solar Plexus: Power', petals: 10, yantra: 'triangle' },
        { name: 'Svadhisthana', color: '#F6AD55', rgb: '246, 173, 85', symbol: 'वं', description: 'Sacral: Creativity', petals: 6, yantra: 'crescent' },
        { name: 'Muladhara', color: '#FC8181', rgb: '252, 129, 129', symbol: 'लं', description: 'Root: Stability', petals: 4, yantra: 'square' }
    ];

    const handleChartSubmit = async (data) => {
        setUserData(data);
        setIsChartLoading(true);
        setIsChartGenerated(true);
        try {
            const result = await getLocalVedicChart(data);
            setChartData(result.data);
        } catch (error) {
            console.error("Chart generation failed", error);
        } finally {
            setIsChartLoading(false);
        }
    };

    return (
        <div className="mobile-reports-container">
            <header className="page-header">
                <h2>{t('Your Cosmic Reports')}</h2>
                <p>{t('Unlock destiny, health, and spiritual growth.')}</p>
            </header>

            <div className="reports-accordion">
                {/* 1. Birth Chart Accordion */}
                <div className={`accordion-item ${activeSection === 'birth-chart' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('birth-chart')}>
                        <div className="header-icon-box" style={{ background: 'rgba(255, 215, 0, 0.15)', color: '#FFD700', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Star size={20} />
                        </div>
                        <div className="header-info">
                            <h3>{t('Birth Chart')}</h3>
                            <span>{t('Quick Vedic Calculation')}</span>
                        </div>
                        {activeSection === 'birth-chart' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'birth-chart' && (
                        <div className="accordion-content">
                            <div className="chart-card glass-panel">
                                {!isChartGenerated ? (
                                    <div className="embedded-form-wrapper">
                                        <BirthDetailsForm
                                            onSubmit={handleChartSubmit}
                                            title=""
                                            submitLabel="Reveal My Chart"
                                        />
                                    </div>
                                ) : (
                                    <div className="embedded-chart-view">
                                        <div className="chart-header-mini">
                                            <h4>{userData?.name}'s Chart</h4>
                                            <button className="reset-btn" onClick={() => setIsChartGenerated(false)}>New</button>
                                        </div>
                                        <div className="chart-viz-wrapper">
                                            <AstroChart chartData={chartData} isLoading={isChartLoading} />
                                        </div>
                                        <div className="chart-summary-mini">
                                            <p>Your planetary blueprint is ready. Unlock the full report for deep analysis.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. The AstroRevo Chart Accordion */}
                <div className={`accordion-item ${activeSection === 'astrorevo-chart' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('astrorevo-chart')}>
                        <div className="header-icon-box" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Compass size={20} />
                        </div>
                        <div className="header-info">
                            <h3>{t('The AstroRevo Chart')}</h3>
                            <span>{t("Your Soul's Blueprint")}</span>
                        </div>
                        {activeSection === 'astrorevo-chart' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'astrorevo-chart' && (
                        <div className="accordion-content">
                            <div className="astrorevo-promo-card" onClick={() => navigate('/mobile/sample')}>
                                <div className="promo-bg-glow"></div>
                                <div className="promo-content">
                                    <div className="promo-badge">{t('RECOMMENDED')}</div>
                                    <h3>{t('Discover Your True Self')}</h3>
                                    <p>{t('A comprehensive map of your destiny, engraved in the stars at the moment of your birth. Discover hidden potentials and karmic paths.')}</p>
                                    <div className="sample-chart-container" style={{ marginTop: '16px' }}>
                                        <button className="sample-chart-preview-btn" onClick={(e) => { e.stopPropagation(); navigate('/mobile/sample'); }}>
                                            <div className="preview-icon">
                                                <span style={{ fontSize: '20px' }}>📊</span>
                                            </div>
                                            <div className="preview-text">
                                                <span className="preview-title">{t('View Sample Report')}</span>
                                                <span className="preview-subtitle">{t('See what your future holds')}</span>
                                            </div>
                                            <div className="preview-arrow">→</div>
                                        </button>

                                        <button className="razorpay-buy-btn" onClick={(e) => { e.stopPropagation(); setIsMembershipOpen(true); }}>
                                            <span className="buy-text">{t('Unlock Full Report')}</span>
                                            <span className="buy-price">₹99</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Nakshatra / Stars Accordion */}
                <div className={`accordion-item ${activeSection === 'nakshatra' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('nakshatra')}>
                        <div className="header-icon-box" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Star size={20} />
                        </div>
                        <div className="header-info">
                            <h3>{t('Nakshatra / Stars')}</h3>
                            <span>{t('Your Birth Star Insights')}</span>
                        </div>
                        {activeSection === 'nakshatra' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'nakshatra' && liveNakshatra && (
                        <div className="accordion-content">
                            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '6rem', opacity: 0.05, pointerEvents: 'none' }}>✨</div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.05))', border: '1px solid rgba(236, 72, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#f472b6', boxShadow: 'inset 0 0 10px rgba(236, 72, 153, 0.2)' }}>
                                            {liveNakshatra.name.substring(0, 1)}
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--vp-w90)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{liveNakshatra.name} NAKSHATRA</div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--vp-w50)', letterSpacing: '0.05em', marginTop: '4px' }}>The {liveNakshatra.details.nature} Star · {liveNakshatra.details.rulingPlanet} Ruled</div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: 'var(--vp-w60)', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: 'bold' }}>
                                            <span>TRANSIT PROGRESS</span>
                                            <span>{liveNakshatra.percentComplete}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: `${liveNakshatra.percentComplete}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #f472b6)', borderRadius: '10px', transition: 'width 1s ease-out' }}></div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>DEITY</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{liveNakshatra.details.deity}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>SYMBOL</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{liveNakshatra.details.symbol}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>ANIMAL</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{liveNakshatra.details.animal}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>NATURE</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{liveNakshatra.details.nature}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>ELEMENT / DOSHA</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{liveNakshatra.details.element}</div>
                                        </div>
                                    </div>

                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)', lineHeight: '1.5', marginBottom: '20px' }}>
                                        {liveNakshatra.details.description}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ background: 'rgba(52, 211, 153, 0.05)', padding: '12px', borderRadius: '12px', borderLeft: '3px solid rgba(52, 211, 153, 0.5)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '0.6rem', color: '#34d399' }}>✓</span>
                                                </div>
                                                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#a7f3d0', letterSpacing: '0.1em', fontWeight: 'bold' }}>FAVORABLE FOR</span>
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--vp-w80)', lineHeight: '1.4' }}>
                                                {liveNakshatra.details.favorable}
                                            </div>
                                        </div>
                                        <div style={{ background: 'rgba(248, 113, 113, 0.05)', padding: '12px', borderRadius: '12px', borderLeft: '3px solid rgba(248, 113, 113, 0.5)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(248, 113, 113, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '0.5rem', color: '#f87171' }}>✕</span>
                                                </div>
                                                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#fecaca', letterSpacing: '0.1em', fontWeight: 'bold' }}>UNFAVORABLE FOR</span>
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--vp-w80)', lineHeight: '1.4' }}>
                                                {liveNakshatra.details.unfavorable}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsNakshatraExpanded(!isNakshatraExpanded);
                                    }}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(236, 72, 153, 0.1)',
                                        border: '1px solid rgba(236, 72, 153, 0.3)',
                                        padding: '14px',
                                        borderRadius: '24px',
                                        color: '#fbcfe8',
                                        fontFamily: 'var(--font-ui)',
                                        letterSpacing: '0.1em',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        backdropFilter: 'blur(16px)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                    {isNakshatraExpanded ? '✦ CLOSE REPORT' : '✦ EXPLORE FULL NAKSHATRA REPORT'}
                                </button>

                                {isNakshatraExpanded && (
                                    <div style={{ marginTop: '8px', animation: 'fadeIn 0.4s ease', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
                                            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#f472b6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Star size={18} /> Deep Psychological Profile
                                            </h4>

                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#ec4899', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: 'bold' }}>KEY STRENGTHS</div>
                                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)', lineHeight: '1.5' }}>
                                                    {liveNakshatra.details.strengths}
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#ec4899', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: 'bold' }}>SHADOW TRAITS</div>
                                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)', lineHeight: '1.5' }}>
                                                    {liveNakshatra.details.shadow}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#ec4899', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: 'bold' }}>CAREER SYNERGIES</div>
                                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)', lineHeight: '1.5' }}>
                                                    {liveNakshatra.details.career}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(255, 255, 255, 0.02))', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: '24px', padding: '24px', textAlign: 'center' }}>
                                            <Crown size={24} color="#f472b6" style={{ margin: '0 auto 12px auto' }} />
                                            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--vp-w90)', marginBottom: '8px' }}>Padas (Quarters) Analysis</h4>
                                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--vp-w70)', lineHeight: '1.5', marginBottom: '16px' }}>
                                                Each Nakshatra is divided into 4 quarters. Unlock the premium report to discover exactly which Pada your moon resides in and its unique micro-influence on your destiny.
                                            </p>
                                            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {liveNakshatra.details.padas.map((pada, idx) => (
                                                    <div key={pada.id} style={{ background: pada.id === liveNakshatra.pada ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', borderLeft: `3px solid ${pada.id === liveNakshatra.pada ? '#f472b6' : ['#fecaca', '#fde047', '#a7f3d0', '#bfdbfe'][idx]}` }}>
                                                        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: pada.id === liveNakshatra.pada ? '#f472b6' : ['#fecaca', '#fde047', '#a7f3d0', '#bfdbfe'][idx], fontWeight: 'bold', marginBottom: '4px' }}>
                                                            Pada {pada.id} ({pada.navamsa} Navamsa) {pada.id === liveNakshatra.pada && ' - CURRENT'}
                                                        </div>
                                                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--vp-w80)', lineHeight: '1.4' }}>
                                                            {pada.desc}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className={`accordion-item ${activeSection === 'premium' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('premium')}>
                        <div className="header-icon-box" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Lock size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Premium Access</h3>
                            <span>{isPremium ? 'Your Premium Dashboard' : 'Unlock Ultimate Clarity'}</span>
                        </div>
                        {activeSection === 'premium' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'premium' && (
                        <div className="accordion-content">
                            {isPremium ? (
                                <MobilePremiumDashboard user={user} />
                            ) : (
                                <div className="premium-promo-card" onClick={() => setIsMembershipOpen(true)}>
                                    <div className="premium-bg-glow"></div>
                                    <div className="premium-content">
                                        <div className="premium-badge">FULL VERSION</div>
                                        <h3>Included with AstroRevo Chart</h3>
                                        <p style={{ color: '#e0e7ff', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6', textAlign: 'left' }}>
                                            Get instant access to all premium features when you unlock your full <strong>AstroRevo Chart</strong>.
                                        </p>
                                        <ul style={{ color: '#e0e7ff', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', textAlign: 'left' }}>
                                            <li>50+ Pages of Detailed Analysis</li>
                                            <li>Vimshottari Dasha Predictions (5 Years)</li>
                                            <li>Gemstone & Rudraksha Recommendations</li>
                                            <li>Sadhesati & Mangal Dosha Remedies</li>
                                        </ul>
                                        <button className="premium-cta-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setIsMembershipOpen(true); }}>
                                            Unlock via AstroRevo Chart • ₹99
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 4. Yoga Remedies Accordion */}
                <div className={`accordion-item ${activeSection === 'yoga' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('yoga')}>
                        <div className="header-icon-box" style={{ background: 'rgba(67, 233, 123, 0.15)', color: '#43e97b', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Activity size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Yoga Remedies</h3>
                            <span>Balance your 7 Chakras</span>
                            <span className="premium-badge-text">Premium Access Recommended</span>
                        </div>
                        {activeSection === 'yoga' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'yoga' && (
                        <div className="accordion-content">
                            <div className="chakra-list">
                                {chakras.map((chakra, index) => (
                                    <div
                                        key={chakra.name}
                                        className="chakra-item-card"
                                        style={{ '--chakra-color': chakra.color }}
                                        onClick={() => setSelectedChakra(chakra)}
                                    >
                                        <div className="chakra-symbol-box" style={{ borderColor: chakra.color }}>
                                            <span className="chakra-symbol" style={{ color: chakra.color }}>{chakra.symbol}</span>
                                        </div>
                                        <div className="chakra-info">
                                            <h4>{chakra.name}</h4>
                                            <span>{chakra.description.split(':')[0]}</span>
                                        </div>
                                        <ChevronRight size={20} className="arrow-icon" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. Body Composition Accordion */}
                <div className={`accordion-item ${activeSection === 'bca' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('bca')}>
                        <div className="header-icon-box" style={{ background: 'rgba(240, 147, 251, 0.15)', color: '#f093fb', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Compass size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Body Composition</h3>
                            <span>Ayurvedic Health Insights</span>
                        </div>
                        {activeSection === 'bca' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'bca' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => setIsBCAOpen(true)}>
                                <div className="bca-icon-circle">
                                    <Activity size={24} color="#ffffff" />
                                </div>
                                <div className="bca-text">
                                    <h3>Body Composition Analysis</h3>
                                    <p>Discover how your physical form aligns with your energy centers. Get a personalized health & yoga plan.</p>
                                </div>
                                <button className="bca-btn">Start Analysis</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 6. Western Zodiac Natal Chart Accordion */}
                <div className={`accordion-item ${activeSection === 'western-chart' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('western-chart')}>
                        <div className="header-icon-box" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Globe size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Western Zodiac Natal Chart</h3>
                            <span>Tropical Astrology Insights</span>
                        </div>
                        {activeSection === 'western-chart' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'western-chart' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/western-chart')} style={{ background: 'linear-gradient(135deg, rgba(46, 16, 101, 0.3), rgba(15, 23, 42, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(168, 85, 247, 0.3)' }}>
                                    <Globe size={24} color="#ffffff" />
                                </div>
                                <div className="bca-text">
                                    <h3>Western Birth Chart</h3>
                                    <p>Explore your Sun, Moon, and Rising signs through the Western Tropical Zodiac system.</p>
                                </div>
                                <button className="bca-btn" style={{ background: '#a855f7' }}>View Western Chart</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 7. Planet Tracker Accordion */}
                <div className={`accordion-item ${activeSection === 'planet-tracker' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('planet-tracker')}>
                        <div className="header-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Globe size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Planet Tracker</h3>
                            <span>Master 9 Planetary Energies</span>
                            <span className="premium-badge-text">New Feature</span>
                        </div>
                        {activeSection === 'planet-tracker' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'planet-tracker' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/planet-trackers')} style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.3), rgba(15, 23, 42, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(255, 215, 0, 0.2)' }}>
                                    <Globe size={24} color="#FFD700" />
                                </div>
                                <div className="bca-text">
                                    <h3>Your Daily Karmic Journey</h3>
                                    <p>Track habits, build discipline, and balance your cosmic energies across all 9 planets.</p>
                                </div>
                                <button className="bca-btn" style={{ background: '#8b5cf6' }}>Open Tracker Hub</button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Spacer for bottom nav */}
            <div style={{ height: '70px' }}></div>

            {/* Modals */}
            <ChakraYogaPage
                isOpen={!!selectedChakra}
                onClose={() => setSelectedChakra(null)}
                chakra={selectedChakra}
            />

            <MembershipModal
                isOpen={isMembershipOpen}
                onClose={() => setIsMembershipOpen(false)}
                onSuccess={() => {
                    setIsMembershipOpen(false);
                    // Immediately grant access (for Guest Mode & instant feedback)
                    setIsPremium(true);
                    setActiveSection('premium');

                    // Verify with backend if user exists (to ensure persistence)
                    const checkStatus = async () => {
                        if (user) {
                            const status = await checkMembershipStatus(user.uid);
                            // Only update if verifiable status is returned
                            if (status) setIsPremium(true);
                        }
                    };
                    checkStatus();
                }}
            />



            <BCAAnalysis
                isOpen={isBCAOpen}
                onClose={() => setIsBCAOpen(false)}
            />
        </div>
    );
};

export default MobileReports;
