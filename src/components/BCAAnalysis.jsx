import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from './AuthModal';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { processPayment } from '../services/razorpayService';
import { getYogaRemedies } from '../services/yogaRemediesEngine';
import { generateYogaPlan } from '../services/yogaPlanEngine';
import YogaPlanModal from './mobile/YogaPlanModal';
import LocalAIBirthPortal from './mobile/LocalAIBirthPortal';
import { getLocalAIAstrologerResponse } from '../services/localAIApi';
import './BCAAnalysis.css';

const BCAAnalysis = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [hasAccess, setHasAccess] = useState(false);
    const [step, setStep] = useState('INTRO'); // INTRO, HOME, PORTAL, LOADING, RESULT, JOURNEY
    const [result, setResult] = useState(null);
    const [savedChart, setSavedChart] = useState(null);

    // --- ROUTINE PLAYER STATE ---
    const [activeRoutine, setActiveRoutine] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep('INTRO');
            checkAccess();
            const stored = localStorage.getItem('localai_birth_profile');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.savedChart) {
                        setSavedChart(parsed);
                    }
                } catch (e) { console.error("Could not parse saved chart", e); }
            }
        }
    }, [isOpen, user]);

    const checkAccess = async () => {
        if (!user) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            const snap = await getDoc(userRef);
            if (snap.exists()) {
                const data = snap.data();
                if (data.purchases?.bca || data.purchases?.bundle) {
                    setHasAccess(true);
                }
            }
        } catch (e) {
            console.error("Error checking BCA access", e);
        }
    };

    const handleUnlock = async () => {
        try {
            const response = await processPayment(199, 'Unlock 21-Day Transformation Plan');
            if (response.razorpay_payment_id) {
                if (user?.uid) {
                    await setDoc(doc(db, 'users', user.uid), {
                        purchases: { bca: true, updatedAt: new Date().toISOString() }
                    }, { merge: true });
                    setHasAccess(true);
                    alert("Plan Unlocked! Access granted.");
                }
            }
        } catch (e) {
            console.error(e);
            alert("Payment failed.");
        }
    };

    const processAstroData = (astroChakras) => {
        const uiChakras = [
            { name: "Root", score: 0, icon: "🔴", desc: "Foundation & Stability" },
            { name: "Sacral", score: 0, icon: "🟠", desc: "Fluidity & Creation" },
            { name: "Solar Plexus", score: 0, icon: "🟡", desc: "Energy & Digest" },
            { name: "Heart", score: 0, icon: "🟢", desc: "Balance & Flow" },
            { name: "Throat", score: 0, icon: "🔵", desc: "Metabolism" },
            { name: "Third Eye", score: 0, icon: "🟣", desc: "Clarity" },
            { name: "Crown", score: 0, icon: "⚪", desc: "Harmony" }
        ];

        const mappedAstroForUI = astroChakras.map(ac => {
            const uiTheme = uiChakras.find(c => c.name === ac.chakra) || {};
            return {
                name: ac.chakra,
                score: Math.round(ac.strengthPercent),
                icon: uiTheme.icon || "✨",
                desc: ac.state || uiTheme.desc
            };
        });

        const remediesList = getYogaRemedies(astroChakras);
        const plan21Day = generateYogaPlan(remediesList);

        const weakestChakra = [...mappedAstroForUI].sort((a, b) => a.score - b.score)[0];
        let yogaPrescription = [];
        if (weakestChakra.name === "Solar Plexus") {
            yogaPrescription = [
                { name: "Navasana (Boat)", purpose: "Ignite Agni (Fire)", icon: "🔥" },
                { name: "Paschimottanasana", purpose: "Compress Abdomen", icon: "🧘" },
                { name: "Kapalabhati", purpose: "Detox Breath", icon: "💨" }
            ];
        } else if (weakestChakra.name === "Root") {
            yogaPrescription = [
                { name: "Vrikshasana (Tree)", purpose: "Grounding", icon: "🌳" }
            ];
        } else {
            yogaPrescription = [
                { name: "Surya Namaskar", purpose: "Total Flow", icon: "☀️" }
            ];
        }

        setResult({
            chakras: mappedAstroForUI,
            yogaPrescription,
            plan21Day,
        });
        setStep('RESULT');
    };

    const handleSavedProfile = () => {
        if (savedChart && savedChart.savedChart && savedChart.savedChart.chakras) {
            processAstroData(savedChart.savedChart.chakras);
        } else {
            alert("No chakra data found in saved profile.");
        }
    };

    const handleBirthSubmit = async (data) => {
        setStep('LOADING');
        try {
            const response = await getLocalAIAstrologerResponse('GENERATE_FULL_D1', data.name, data, null);
            if (response.isChartData && response.data.chakras) {
                // Save it for future
                const saved = { ...data, savedChart: response.data, savedAt: new Date().toLocaleDateString() };
                localStorage.setItem('localai_birth_profile', JSON.stringify(saved));
                setSavedChart(saved);
                processAstroData(response.data.chakras);
            } else {
                alert("Failed to calculate chakras from birth details.");
                setStep('HOME');
            }
        } catch (err) {
            console.error(err);
            alert("Error generating plan.");
            setStep('HOME');
        }
    };

    // --- RENDERERS ---

    const renderIntro = () => (
        <div className="bca-intro">
            <h2 className="bca-title">Holistic Body Blueprint</h2>
            <p className="bca-subtitle">
                Discover the harmony between your physical structure and vital energy centers based on your Kundli geometry.
            </p>
            <div className="bca-benefits">
                <span className="benefit-pill">✨ 7 Chakra Analysis</span>
                <span className="benefit-pill">🌿 21-Day Journey</span>
                <span className="benefit-pill">🧬 Astrological Core</span>
            </div>
            <button className="bca-action-btn" onClick={() => setStep('HOME')}>Begin Healing</button>
        </div>
    );

    const renderHome = () => (
        <div className="bca-form-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔮</div>
                <h2 style={{ color: '#ffd700', fontFamily: 'Cinzel, serif', margin: 0, fontSize: '1.3rem' }}>Choose a Chart</h2>
                <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: '0.9rem' }}>Select a birth profile to scan your Chakras.</p>
            </div>

            {savedChart && (
                <div style={{ background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '16px', padding: '18px', width: '100%', maxWidth: '400px' }}>
                    <p style={{ color: '#ffd700', fontWeight: 'bold', margin: '0 0 10px', fontSize: '1rem' }}>📋 Saved Profile</p>
                    <p style={{ color: '#cbd5e1', margin: '4px 0', fontSize: '0.9rem' }}>👤 {savedChart.name} ({savedChart.gender})</p>
                    <p style={{ color: '#cbd5e1', margin: '4px 0', fontSize: '0.9rem' }}>📅 {savedChart.date} · {savedChart.time}</p>
                    <button
                        onClick={handleSavedProfile}
                        style={{ width: '100%', marginTop: '14px', padding: '13px', background: 'linear-gradient(135deg, #ffd700, #f59e0b)', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Cinzel, serif' }}
                    >
                        ✨ Use This Profile
                    </button>
                </div>
            )}

            <button
                onClick={() => setStep('PORTAL')}
                style={{ width: '100%', maxWidth: '400px', padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer' }}
            >
                ＋ Create New Chart
            </button>
        </div>
    );

    const renderPortal = () => (
        <div className="bca-form-container" style={{ padding: 0, height: '100%', overflowY: 'auto' }}>
            <LocalAIBirthPortal onSubmit={handleBirthSubmit} />
        </div>
    );

    const renderLoading = () => (
        <div className="bca-form-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
            <div style={{ color: '#ffd700', fontSize: '3rem', animation: 'spin 4s linear infinite' }}>✨</div>
            <h3 style={{ color: '#fff', margin: 0 }}>Aligning with the cosmic grid...</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Calculating planetary strengths and chakra vitality.</p>
        </div>
    );

    const renderResult = () => (
        <div className="bca-results" style={{ zIndex: 2147483647, position: 'relative' }}>
            <div className="blueprint-header">
                <div>
                    <h2 className="blueprint-title">Energy Blueprint</h2>
                    <p style={{ color: '#A0AEC0', marginTop: '5px' }}>Harmony Score: <strong style={{ color: '#fff' }}>{Math.round((result.chakras.reduce((a, b) => a + b.score, 0) / 7))}%</strong></p>
                </div>
                <button className="bca-close-btn" onClick={() => setStep('HOME')} style={{ position: 'static', fontSize: '1rem', border: '1px solid #aaa', padding: '8px 15px', borderRadius: '20px' }}>Back</button>
            </div>

            {!hasAccess && (
                <div className="glass-card premium-paywall-overlay" style={{
                    position: 'absolute',
                    top: '80px', left: 0, width: '100%', height: 'calc(100% - 80px)',
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
                    <h2 className="gold-text" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Unlock Your Blueprint</h2>
                    <p style={{
                        marginBottom: '30px',
                        color: '#E2E8F0',
                        textAlign: 'center',
                        padding: '0 30px',
                        lineHeight: '1.5',
                        fontSize: '0.95rem'
                    }}>
                        Get your 21-Day Transformation Plan, detailed Chakra scores, and corrective Yoga prescription.
                    </p>
                    <button className="buy-btn golden-action-btn" style={{
                        width: '220px',
                        padding: '15px 30px',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                    }} onClick={() => handleUnlock()}>
                        Unlock Full Plan (₹199)
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

            <div className="result-main" style={{ flex: 1, paddingRight: '20px' }}>
                <div className="chart-container">
                    <div className="energy-panel" style={{ marginTop: 0 }}>
                        <div className="energy-title">
                            <span>7-Chakra Vitality Scan</span>
                            <span>Astrological Feedback</span>
                        </div>
                        <div className="chakra-grid">
                            {result.chakras.map((c, i) => (
                                <div key={i} className={`chakra-item ${c.score < 50 ? 'issue' : ''}`}>
                                    <span className="chakra-icon-sm">{c.icon}</span>
                                    <span className="chakra-name">{c.name}</span>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '10px 0' }}>
                                        <div style={{ width: `${c.score}%`, height: '100%', background: c.score < 50 ? '#F6AD55' : '#68D391', borderRadius: '2px' }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: '#CBD5E1' }}>{c.score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="result-right">
                <div style={{ marginTop: 'auto' }}>
                    <button className="bca-action-btn" onClick={() => setStep('JOURNEY')} style={{ width: '100%', textAlign: 'center' }}>
                        Reveal 21-Day Plan
                    </button>
                </div>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="bca-modal-overlay" onClick={onClose} style={{ zIndex: 2147483647 }}>
            <div className={`bca-modal-content ${step === 'INTRO' || step === 'HOME' || step === 'LOADING' ? '' : 'full-page'}`} onClick={e => e.stopPropagation()}>
                {(step === 'INTRO' || step === 'HOME') && <button className="bca-close-btn" onClick={onClose}>&times;</button>}

                {step === 'INTRO' && renderIntro()}
                {step === 'HOME' && renderHome()}
                {step === 'PORTAL' && renderPortal()}
                {step === 'LOADING' && renderLoading()}
                {step === 'RESULT' && result && renderResult()}
                {step === 'JOURNEY' && result && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647 }}>
                        <YogaPlanModal plan={result.plan21Day} onClose={() => setStep('RESULT')} />
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default BCAAnalysis;
