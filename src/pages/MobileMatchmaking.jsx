import React, { useState } from 'react';
import BirthDetailsForm from '../components/BirthDetailsForm';
import './Matchmaking.css';
import { useNavigate } from 'react-router-dom';
import { calculateAshtakoot } from '../utils/matchmakingUtils';
import { precalculateChartData } from '../services/localAIApi';

const MobileMatchmaking = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('boy_input'); // boy_input, girl_input, loading, result
    const [boyData, setBoyData] = useState(null);
    const [girlData, setGirlData] = useState(null);
    const [score, setScore] = useState(0);
    const [gunaBreakdown, setGunaBreakdown] = useState([]);

    const handleBoySubmit = (data) => {
        setBoyData(data);
        setStep('girl_input');
    };

    const handleGirlSubmit = async (data) => {
        setGirlData(data);
        setStep('loading');

        // Exact Mathematical Evaluation 
        setTimeout(() => {
            try {
                const boyMath = precalculateChartData(boyData);
                const girlMath = precalculateChartData(data);

                if (boyMath && girlMath) {
                    const breakdown = calculateAshtakoot(boyMath.moonLong, girlMath.moonLong);
                    const totalScore = breakdown.reduce((sum, item) => sum + item.obtained, 0);
                    setGunaBreakdown(breakdown);
                    setScore(totalScore);
                } else {
                    setScore(0);
                }
            } catch (err) {
                console.error("Matchmaking calculation failed:", err);
                setScore(0);
            }
            setStep('result');
        }, 1500); // Artificial delay to build anticipation
    };

    return (
        <div className="match-overlay">
            {/* Video Background */}
            <video
                autoPlay loop muted playsInline className="match-video-bg"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
            >
                <source src="/videos/night_sky_timelapse.mp4" type="video/mp4" />
            </video>
            <div className="match-video-overlay" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 3, 13, 0.6)', zIndex: 0
            }}></div>

            <div className="sc-container">
                <div className="topbar">
                    <div className="back-btn" onClick={() => step !== 'boy_input' ? setStep('boy_input') : navigate('/mobile/home')}>
                        ← Back
                    </div>
                    <div className="topbar-title">Kundli Milan</div>
                    <div className="close-btn" onClick={() => navigate('/mobile/home')}>✕</div>
                </div>

                <div className="scroll">
                    <div className="sec-head">
                        <h2>Vedic Match</h2>
                        <div className="sub">Sacred Compatibility Check</div>
                        <div className="rule"></div>
                    </div>

                    {/* Steps bar */}
                    {step !== 'loading' && (
                        <div className="steps-bar">
                            <div className={`s-node ${step !== 'boy_input' ? 'done' : 'active'}`}>1</div>
                            <div className="s-line"></div>
                            <div className={`s-node ${step === 'girl_input' ? 'active' : (step === 'result' ? 'done' : '')}`}>2</div>
                            <div className="s-line"></div>
                            <div className={`s-node ${step === 'result' ? 'active' : ''}`}>3</div>
                        </div>
                    )}

                    {step === 'boy_input' && (
                        <>
                            <div className="step-desc">Enter details for the Groom</div>
                            <div className="match-form">
                                <div className="form-glass-wrap">
                                    <BirthDetailsForm onSubmit={handleBoySubmit} title="" submitLabel="Next: Bride's Details" />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 'girl_input' && (
                        <>
                            <div className="step-desc">Enter details for the Bride</div>
                            <div className="match-form">
                                <div className="form-glass-wrap">
                                    <BirthDetailsForm onSubmit={handleGirlSubmit} title="" submitLabel="Analyze Compatibility" />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 'loading' && (
                        <div className="compat-ring-wrap" style={{ height: '60vh' }}>
                            <div className="c-ring-outer" style={{ width: '120px', height: '120px' }}></div>
                            <div className="sec-head" style={{ marginTop: '20px' }}>
                                <h2>Aligning Stars...</h2>
                                <div className="sub">Calculating Gunas & Doshas</div>
                            </div>
                        </div>
                    )}

                    {step === 'result' && (
                        <>
                            <div className="match-hero">
                                <div className="mc-circle">♂</div>
                                <div className="mc-conn">
                                    <div className="mc-line"></div>
                                    <div className="mc-heart">♥</div>
                                    <div className="mc-line"></div>
                                </div>
                                <div className="mc-circle">♀</div>
                            </div>

                            <div className="compat-ring-wrap">
                                <div className="c-ring-outer">
                                    <div className="c-ring-inner">
                                        <div className="c-score">{score}</div>
                                        <div className="c-of">OUT OF 36</div>
                                    </div>
                                </div>
                                <div className="c-desc">
                                    {score >= 18 ? "A promising cosmic alignment with strong foundations." : "Challenging alignment requiring remedies."}
                                </div>
                            </div>

                            <div className="guna-panel">
                                <div className="guna-header">
                                    <div className="guna-title">ASHTAKOOT GUNA SUMMARY</div>
                                    <div className="guna-total">{score}/36</div>
                                </div>
                                <div className="guna-items">
                                    {gunaBreakdown.length > 0 ? gunaBreakdown.map(g => (
                                        <div key={g.name} className="gi-row">
                                            <div className="gi-lbl">{g.name.toUpperCase()}</div>
                                            <div className="gi-bg"><div className="gi-fill" style={{ width: `${(g.obtained / g.maxPoints) * 100}%` }}></div></div>
                                            <div className="gi-pts">{g.obtained}</div>
                                        </div>
                                    )) : (
                                        <div style={{ color: 'var(--k-w40)', textAlign: 'center', fontSize: '0.8rem', padding: '20px' }}>Calculation failed.</div>
                                    )}
                                </div>
                            </div>

                            <div style={{ padding: '0 16px', marginBottom: '24px' }}>
                                <button style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    padding: '16px',
                                    borderRadius: '24px',
                                    color: 'white',
                                    fontFamily: 'var(--font-ui)',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    backdropFilter: 'blur(16px)'
                                }}>
                                    ✦ GET DETAILED REPORT
                                </button>
                            </div>

                            <div className="compat-tags" style={{ marginBottom: '16px', justifyContent: 'center', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <div className={`s-node ${score >= 25 ? 'done' : ''}`} style={{ width: 'auto', padding: '6px 16px', borderRadius: '16px', fontSize: '0.65rem', borderColor: score < 18 ? 'rgba(255,100,100,0.3)' : undefined, color: score < 18 ? 'rgba(255,100,100,0.8)' : undefined }}>
                                    {score >= 25 ? 'Excellent Match' : score >= 18 ? 'Average Match' : 'Challenging Match'}
                                </div>
                                {gunaBreakdown.find(g => g.name === 'Nadi')?.obtained === 0 && (
                                    <div className="s-node" style={{ width: 'auto', padding: '6px 16px', borderRadius: '16px', color: 'rgba(255,100,100,0.8)', borderColor: 'rgba(255,100,100,0.3)', fontSize: '0.65rem' }}>Nadi Dosha</div>
                                )}
                                {gunaBreakdown.find(g => g.name === 'Bhakoot')?.obtained === 0 && (
                                    <div className="s-node" style={{ width: 'auto', padding: '6px 16px', borderRadius: '16px', color: 'rgba(255,100,100,0.8)', borderColor: 'rgba(255,100,100,0.3)', fontSize: '0.65rem' }}>Bhakoot Dosha</div>
                                )}
                                {gunaBreakdown.find(g => g.name === 'Gana')?.obtained <= 1 && (
                                    <div className="s-node" style={{ width: 'auto', padding: '6px 16px', borderRadius: '16px', color: 'rgba(255,200,100,0.8)', borderColor: 'rgba(255,200,100,0.3)', fontSize: '0.65rem' }}>Gana Dosha</div>
                                )}
                            </div>

                            <div style={{ padding: '0 16px', marginBottom: '32px' }}>
                                <button onClick={() => { setStep('boy_input'); setScore(0); }} style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    padding: '16px',
                                    borderRadius: '24px',
                                    color: 'var(--vp-w50)',
                                    fontFamily: 'var(--font-ui)',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer'
                                }}>
                                    NEW MATCH
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileMatchmaking;
