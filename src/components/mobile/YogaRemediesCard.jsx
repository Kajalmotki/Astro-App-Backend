import React, { useState } from 'react';
import './YogaRemediesCard.css';

// ⚙ Set to false and configure Razorpay when ready to go live
const TEST_MODE = true;

const PLANET_ICONS = {
    Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿',
    Jupiter: '♃', Venus: '♀', Saturn: '♄'
};

const STRENGTH_BADGE = (percent) => {
    if (percent >= 80) return { label: 'Very Strong', cls: 'badge-vstrong' };
    if (percent >= 60) return { label: 'Strong', cls: 'badge-strong' };
    if (percent >= 40) return { label: 'Moderate', cls: 'badge-moderate' };
    if (percent >= 20) return { label: 'Weak', cls: 'badge-weak' };
    return { label: 'Very Weak', cls: 'badge-vweak' };
};

const PlanetRemedyCard = ({ remedy }) => {
    const [expanded, setExpanded] = useState(remedy.isWeak); // auto-expand weak planets
    const badge = STRENGTH_BADGE(remedy.strengthPercent);
    const isWeak = remedy.isWeak;

    return (
        <div className={`yrc-planet-card ${isWeak ? 'yrc-weak' : 'yrc-strong'}`}
            style={{ '--chakra-clr': remedy.color }}>

            {/* Card Header */}
            <button className="yrc-card-header" onClick={() => setExpanded(e => !e)}>
                <div className="yrc-card-left">
                    <div className="yrc-planet-orb" style={{ background: remedy.color }}>
                        <span>{PLANET_ICONS[remedy.planet]}</span>
                    </div>
                    <div className="yrc-card-titles">
                        <span className="yrc-planet-name">{remedy.planet}</span>
                        <span className="yrc-chakra-name">{remedy.chakra}</span>
                    </div>
                </div>
                <div className="yrc-card-right">
                    <div className="yrc-strength-bar-mini">
                        <div className="yrc-strength-fill-mini"
                            style={{ width: `${remedy.strengthPercent}%`, background: remedy.color }} />
                    </div>
                    <span className={`yrc-badge ${badge.cls}`}>{badge.label}</span>
                    <span className="yrc-chevron">{expanded ? '▲' : '▼'}</span>
                </div>
            </button>

            {/* Bija Mantra teaser strip */}
            <div className="yrc-mantra-strip">
                <span className="yrc-mantra-label">Bija Mantra</span>
                <span className="yrc-mantra-text">{remedy.bijaMantra}</span>
                <span className="yrc-element-tag">{remedy.element}</span>
            </div>

            {/* Expanded Remedies Body */}
            {expanded && (
                <div className="yrc-body">
                    {isWeak ? (
                        <>
                            {/* Asanas */}
                            {remedy.remedies.asanas && remedy.remedies.asanas.length > 0 && (
                                <div className="yrc-section">
                                    <h5 className="yrc-section-title">🧘 Asanas (Postures)</h5>
                                    {remedy.remedies.asanas.map((a, i) => (
                                        <div key={i} className="yrc-practice-item">
                                            <p className="yrc-practice-name">{a.name}</p>
                                            <p className="yrc-practice-desc">{a.description}</p>
                                            <p className="yrc-source">📖 {a.source}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Pranayama */}
                            {remedy.remedies.pranayama && remedy.remedies.pranayama.length > 0 && (
                                <div className="yrc-section">
                                    <h5 className="yrc-section-title">🌬 Pranayama (Breathwork)</h5>
                                    {remedy.remedies.pranayama.map((p, i) => (
                                        <div key={i} className="yrc-practice-item">
                                            <p className="yrc-practice-name">{p.name}</p>
                                            <p className="yrc-practice-desc">{p.description}</p>
                                            <p className="yrc-source">📖 {p.source}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Mudra */}
                            {remedy.remedies.mudra && (
                                <div className="yrc-section">
                                    <h5 className="yrc-section-title">🤲 Mudra (Sacred Seal)</h5>
                                    <div className="yrc-practice-item">
                                        <p className="yrc-practice-name">{remedy.remedies.mudra.name}</p>
                                        <p className="yrc-practice-desc">{remedy.remedies.mudra.description}</p>
                                        <p className="yrc-source">📖 {remedy.remedies.mudra.source}</p>
                                    </div>
                                </div>
                            )}
                            {/* Meditation + Bija */}
                            {remedy.remedies.meditation && (
                                <div className="yrc-section yrc-meditation-section"
                                    style={{ borderColor: remedy.color }}>
                                    <h5 className="yrc-section-title" style={{ color: remedy.color }}>
                                        🕉 Bija Meditation — {remedy.bijaMantra}
                                    </h5>
                                    <p className="yrc-practice-name">{remedy.remedies.meditation.name}</p>
                                    <p className="yrc-practice-desc">{remedy.remedies.meditation.description}</p>
                                    <p className="yrc-source">📖 {remedy.remedies.meditation.source}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Strong Planet: Balancing advice */
                        <div className="yrc-section yrc-balance-section">
                            <p className="yrc-balance-msg">✨ {remedy.remedies.balance}</p>
                            {remedy.remedies.asanas && (
                                <div className="yrc-practice-item">
                                    <p className="yrc-practice-name">Balancing Practices</p>
                                    <ul className="yrc-balance-list">
                                        {remedy.remedies.asanas.map((a, i) => (
                                            <li key={i}>{a}</li>
                                        ))}
                                    </ul>
                                    {remedy.remedies.pranayama && (
                                        <p className="yrc-practice-desc" style={{ marginTop: '8px' }}>
                                            🌬 {remedy.remedies.pranayama}
                                        </p>
                                    )}
                                    <p className="yrc-source">📖 {remedy.remedies.source}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const YogaRemediesCard = ({ remedies, onUnlockPlan }) => {
    if (!remedies || remedies.length === 0) return null;
    const [showPaywall, setShowPaywall] = useState(false);

    const handleUnlockClick = () => {
        if (TEST_MODE) {
            // Skip payment in test mode
            onUnlockPlan && onUnlockPlan();
        } else {
            setShowPaywall(true);
        }
    };

    const handlePayment = () => {
        // TODO: Integrate Razorpay here for ₹199 charge
        // For now just proceed
        setShowPaywall(false);
        onUnlockPlan && onUnlockPlan();
    };

    const weakCount = remedies.filter(r => r.isWeak).length;
    const strongCount = remedies.filter(r => r.isStrong).length;

    return (
        <div className="yoga-remedies-container">
            {/* Header */}
            <div className="yrc-header">
                <div className="yrc-header-glow" />
                <div className="yrc-header-content">
                    <div className="yrc-header-icon">🌿</div>
                    <div>
                        <h3 className="yrc-title">Yoga Remedies</h3>
                        <p className="yrc-subtitle">Based on your planetary strengths</p>
                    </div>
                </div>
                <div className="yrc-stats-row">
                    {weakCount > 0 && (
                        <span className="yrc-stat yrc-stat-weak">
                            ⚠ {weakCount} planet{weakCount > 1 ? 's' : ''} need healing
                        </span>
                    )}
                    {strongCount > 0 && (
                        <span className="yrc-stat yrc-stat-strong">
                            ✦ {strongCount} strong
                        </span>
                    )}
                </div>
            </div>

            {/* Source citation */}
            <div className="yrc-sources-banner">
                <span className="yrc-sources-label">Sources:</span>
                <span className="yrc-sources-text">
                    Hatha Yoga Pradipika · Gheranda Samhita · Siva Samhita · Sat Chakra Nirupana
                </span>
            </div>

            {/* Planet Cards */}
            <div className="yrc-cards-list">
                {remedies.map((remedy, i) => (
                    <PlanetRemedyCard key={i} remedy={remedy} />
                ))}
            </div>

            {/* Paywall Popup */}
            {showPaywall && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: 440, background: '#0a0d14', borderRadius: '22px 22px 0 0', padding: '28px 24px 48px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🌿</div>
                        <h3 style={{ fontFamily: 'Cinzel, serif', color: '#ffd700', margin: '0 0 8px', fontSize: '1.3rem' }}>21-Day Yoga Transformation</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 20 }}>Your personalised plan based on your exact Kundli. 3 phases, 21 days, curated from classical texts.</p>
                        <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#f1f5f9', fontFamily: 'Cinzel, serif', marginBottom: 4 }}>₹199</div>
                        <p style={{ color: '#475569', fontSize: '0.75rem', marginBottom: 24 }}>one-time · instant access · offline</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', textAlign: 'left' }}>
                            {['✓ Personalised for your exact birth chart', '✓ Asanas, pranayamas and bija mantras per day', '✓ 3-phase transformation programme', '✓ Based on 4 classical yoga texts'].map((b, i) => (
                                <li key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: '0.85rem' }}>{b}</li>
                            ))}
                        </ul>
                        <button onClick={handlePayment} style={{ width: '100%', padding: 16, background: 'linear-gradient(135deg, #d97706, #b45309)', border: 'none', borderRadius: 14, color: '#fff', fontSize: '1rem', fontWeight: 700, fontFamily: 'Cinzel, serif', cursor: 'pointer', boxShadow: '0 8px 24px rgba(217,119,6,0.4)', marginBottom: 12 }}>Unlock for ₹199</button>
                        <button onClick={() => setShowPaywall(false)} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '0.85rem', cursor: 'pointer' }}>Maybe later</button>
                    </div>
                </div>
            )}

            {/* Footer note */}
            <p className="yrc-footer-note">
                Practice these remedies consistently for 40 days (Mandala Kala) for lasting transformation.
                Consult a qualified yoga teacher for advanced practices like Sirshasana and Khechari Mudra.
            </p>

            {/* Unlock 21-Day Plan Button */}
            <button className="yrc-unlock-btn" onClick={handleUnlockClick}>
                <span className="yrc-unlock-icon">🗓</span>
                <div className="yrc-unlock-text">
                    <span className="yrc-unlock-title">Unlock Your 21-Day Yoga Plan</span>
                    <span className="yrc-unlock-sub">{TEST_MODE ? 'Free (Test Mode)' : '₹199 · Personalised for your Kundli'}</span>
                </div>
                <span className="yrc-unlock-arrow">›</span>
            </button>
        </div>
    );
};

export default YogaRemediesCard;
