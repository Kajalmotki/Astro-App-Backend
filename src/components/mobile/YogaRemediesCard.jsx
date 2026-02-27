import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import AsanaPlayWindow from './AsanaPlayWindow';
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

const PlanetRemedyCard = ({ remedy, onPlayAsana }) => {
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
                                        <div key={i} className="yrc-practice-item yrc-playable" onClick={() => onPlayAsana(a, remedy.color)} style={{ position: 'relative', cursor: 'pointer' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <p className="yrc-practice-name">{a.name}</p>
                                                    <p className="yrc-practice-desc">{a.description || a.why}</p>
                                                </div>
                                                <button className="yrc-play-btn" style={{ background: remedy.color, border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                                    <Play size={16} color="#000" style={{ marginLeft: '2px' }} />
                                                </button>
                                            </div>
                                            {a.healthBenefits && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px', marginBottom: '4px' }}>
                                                    {a.healthBenefits.slice(0, 2).map((hb, ib) => (
                                                        <span key={ib} style={{ background: 'rgba(255,255,255,0.1)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', color: '#cbd5e1' }}>✨ {hb.substring(0, 30)}...</span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="yrc-source" style={{ marginTop: '8px' }}>📖 {a.source}</p>
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
    const navigate = useNavigate();
    const [playingAsana, setPlayingAsana] = useState(null);
    const [playingColor, setPlayingColor] = useState('#10b981');

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
                    Asana Pranayama Mudra Bandha · Hatha Yoga Pradipika · Gheranda Samhita · Siva Samhita · Sat Chakra Nirupana
                </span>
            </div>

            {/* Planet Cards */}
            <div className="yrc-cards-list">
                {remedies.map((remedy, i) => (
                    <PlanetRemedyCard
                        key={i}
                        remedy={remedy}
                        onPlayAsana={(asana, color) => {
                            setPlayingAsana(asana);
                            setPlayingColor(color);
                        }}
                    />
                ))}
            </div>

            {/* Footer CTA */}
            <div className="yrc-footer-section">
                <div className="yrc-cta-box" onClick={() => navigate('/mobile/reports', { state: { openBCA: true } })}>
                    <div className="yrc-cta-icon">✨</div>
                    <div className="yrc-cta-text">
                        <span className="yrc-cta-title">Want a full schedule?</span>
                        <span className="yrc-cta-sub">Reveal your personalized 21-Day Yoga Plan →</span>
                    </div>
                </div>
            </div>

            {/* Asana Playback Window Override */}
            {playingAsana && (
                <AsanaPlayWindow
                    asana={playingAsana}
                    color={playingColor}
                    onClose={() => setPlayingAsana(null)}
                />
            )}
        </div>
    );
};

export default YogaRemediesCard;
