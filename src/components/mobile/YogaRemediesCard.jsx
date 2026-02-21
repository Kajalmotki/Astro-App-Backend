import React, { useState } from 'react';
import './YogaRemediesCard.css';

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

const YogaRemediesCard = ({ remedies }) => {
    if (!remedies || remedies.length === 0) return null;

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

            {/* Footer note */}
            <p className="yrc-footer-note">
                Practice these remedies consistently for 40 days (Mandala Kala) for lasting transformation.
                Consult a qualified yoga teacher for advanced practices like Sirshasana and Khechari Mudra.
            </p>
        </div>
    );
};

export default YogaRemediesCard;
