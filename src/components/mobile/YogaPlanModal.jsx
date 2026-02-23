import React, { useState } from 'react';
import { Play } from 'lucide-react';
import AsanaPlayWindow from './AsanaPlayWindow';
import './YogaPlanModal.css';

const PLANET_ICONS = {
    Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿',
    Jupiter: '♃', Venus: '♀', Saturn: '♄', All: '🕉'
};

const PHASE_COLORS = {
    1: { from: '#16a34a', to: '#15803d', label: 'Awakening' },
    2: { from: '#2563eb', to: '#1d4ed8', label: 'Integration' },
    3: { from: '#d97706', to: '#b45309', label: 'Transformation' }
};

const DayDetailPanel = ({ day, onClose, onPlayAsana }) => (
    <div className="ydp-detail-overlay" onClick={onClose}>
        <div className="ydp-detail-panel" onClick={e => e.stopPropagation()}>
            <button className="ydp-detail-close" onClick={onClose}>✕</button>

            {/* Header */}
            <div className="ydp-detail-header" style={{ borderColor: day.color }}>
                <div className="ydp-detail-day-badge" style={{ background: day.color }}>
                    Day {day.day}
                </div>
                <h3 className="ydp-detail-title">{day.sanskritName} Divas</h3>
                <p className="ydp-detail-phase">{day.phaseEmoji} {day.phaseName} Phase</p>
            </div>

            {/* Planet & Theme */}
            <div className="ydp-detail-planet-row">
                <div className="ydp-planet-orb-lg" style={{ background: day.color }}>
                    <span>{PLANET_ICONS[day.planet] || '✦'}</span>
                </div>
                <div>
                    <p className="ydp-detail-planet-name">{day.planet}</p>
                    <p className="ydp-detail-chakra">{day.chakra}</p>
                    <p className="ydp-detail-theme-text">{day.theme}</p>
                </div>
                <div className="ydp-detail-duration">{day.duration}</div>
            </div>

            {/* Bija Mantra */}
            <div className="ydp-mantra-highlight" style={{ borderColor: day.color }}>
                <span className="ydp-mantra-label">Today's Bija Mantra</span>
                <span className="ydp-mantra-val" style={{ color: day.color }}>{day.bijaMantra}</span>
            </div>

            {/* Practice breakdown */}
            <div className="ydp-detail-practices">
                <div className="ydp-practice-row ydp-asana-row" onClick={() => onPlayAsana(day.asanaObj, day.color)}>
                    <span className="ydp-practice-icon">🧘</span>
                    <div style={{ flex: 1 }}>
                        <span className="ydp-practice-label">Asana (Tap to Play)</span>
                        <p className="ydp-practice-val">{day.asana}</p>
                    </div>
                    <button className="ydp-play-asana-btn" style={{ background: day.color }}>
                        <Play size={16} color="#000" />
                    </button>
                </div>
                <div className="ydp-practice-row">
                    <span className="ydp-practice-icon">🌬</span>
                    <div>
                        <span className="ydp-practice-label">Pranayama</span>
                        <p className="ydp-practice-val">{day.pranayama}</p>
                    </div>
                </div>
                <div className="ydp-practice-row">
                    <span className="ydp-practice-icon">🤲</span>
                    <div>
                        <span className="ydp-practice-label">Mudra</span>
                        <p className="ydp-practice-val">{day.mudra}</p>
                    </div>
                </div>
                <div className="ydp-practice-row">
                    <span className="ydp-practice-icon">🕉</span>
                    <div>
                        <span className="ydp-practice-label">Meditation</span>
                        <p className="ydp-practice-val">{day.meditation}</p>
                    </div>
                </div>
            </div>

            <p className="ydp-detail-note">
                Practice at the same time each morning for maximum benefit.
                Consistency creates cellular memory.
            </p>
        </div>
    </div>
);

const YogaPlanModal = ({ plan, onClose }) => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [playingAsana, setPlayingAsana] = useState(null);
    const [playingColor, setPlayingColor] = useState('#10b981');
    const [completedDays, setCompletedDays] = useState(new Set());
    const [activePhase, setActivePhase] = useState(null); // null = all phases

    if (!plan) return null;

    const toggleComplete = (dayNum, e) => {
        e.stopPropagation();
        setCompletedDays(prev => {
            const next = new Set(prev);
            if (next.has(dayNum)) next.delete(dayNum);
            else next.add(dayNum);
            return next;
        });
    };

    const filteredDays = activePhase
        ? plan.days.filter(d => d.phase === activePhase)
        : plan.days;

    const progressPercent = Math.round((completedDays.size / 21) * 100);

    return (
        <div className="ydp-overlay">
            <div className="ydp-container">

                {/* Header */}
                <div className="ydp-header">
                    <button className="ydp-close-btn" onClick={onClose}>✕</button>
                    <div className="ydp-header-glow" />
                    <div className="ydp-title-row">
                        <span className="ydp-icon">✨</span>
                        <div>
                            <h2 className="ydp-title">21-Day Transformation</h2>
                            <p className="ydp-subtitle">Consistent action creates cellular memory. Tap a day to begin.</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="ydp-progress-row">
                        <span className="ydp-progress-label">{completedDays.size}/21 days complete</span>
                        <span className="ydp-progress-pct">{progressPercent}%</span>
                    </div>
                    <div className="ydp-progress-bg">
                        <div className="ydp-progress-fill" style={{ width: `${progressPercent}%` }} />
                    </div>

                    {/* Weak planets summary */}
                    <div className="ydp-meta-row">
                        <span className="ydp-meta-tag">
                            🌿 Focussing: {plan.meta.weakPlanets}
                        </span>
                        <span className="ydp-meta-tag">
                            📅 {plan.meta.generatedAt}
                        </span>
                    </div>
                </div>

                {/* Phase filter tabs */}
                <div className="ydp-phase-tabs">
                    <button
                        className={`ydp-phase-tab ${!activePhase ? 'ydp-tab-active' : ''}`}
                        onClick={() => setActivePhase(null)}
                    >
                        All 21
                    </button>
                    {[1, 2, 3].map(p => (
                        <button
                            key={p}
                            className={`ydp-phase-tab ${activePhase === p ? 'ydp-tab-active' : ''}`}
                            onClick={() => setActivePhase(p === activePhase ? null : p)}
                            style={activePhase === p ? { background: PHASE_COLORS[p].from } : {}}
                        >
                            {plan.phases[p].emoji} {plan.phases[p].name}
                        </button>
                    ))}
                </div>

                {/* 21-Day Grid */}
                <div className="ydp-grid">
                    {filteredDays.map(day => {
                        const isDone = completedDays.has(day.day);
                        const phaseClr = PHASE_COLORS[day.phase];
                        return (
                            <button
                                key={day.day}
                                className={`ydp-day-tile ${isDone ? 'ydp-done' : ''} ydp-phase-${day.phase}`}
                                onClick={() => setSelectedDay(day)}
                                style={{
                                    '--tile-clr': day.color,
                                    '--phase-from': phaseClr.from
                                }}
                            >
                                {/* Completion dot */}
                                <span
                                    className={`ydp-done-dot ${isDone ? 'ydp-dot-filled' : ''}`}
                                    onClick={e => toggleComplete(day.day, e)}
                                    title="Mark complete"
                                >
                                    {isDone ? '✓' : '○'}
                                </span>

                                {/* Day number */}
                                <span className="ydp-tile-num">{day.day}</span>

                                {/* Planet Name instead of symbol */}
                                <span className="ydp-tile-planet-name"
                                    style={{ color: day.color, fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px', marginTop: '6px' }}>
                                    {day.planetName || day.planet.toUpperCase()}
                                </span>

                                {/* Phase dot */}
                                <span className="ydp-tile-phase-dot"
                                    style={{ background: phaseClr.from }} />
                            </button>
                        );
                    })}
                </div>

                {/* Phase legend */}
                <div className="ydp-legend">
                    {[1, 2, 3].map(p => (
                        <div key={p} className="ydp-legend-item">
                            <span className="ydp-legend-dot" style={{ background: PHASE_COLORS[p].from }} />
                            <span>{plan.phases[p].name}: Days {plan.phases[p].days[0]}–{plan.phases[p].days[1]}</span>
                        </div>
                    ))}
                </div>

                <p className="ydp-footer">
                    🔔 Practice at sunrise daily for 21 days for lasting transformation
                </p>
            </div>

            {/* Day Detail Popup */}
            {selectedDay && !playingAsana && (
                <DayDetailPanel
                    day={selectedDay}
                    onClose={() => setSelectedDay(null)}
                    onPlayAsana={(asanaObj, color) => {
                        setPlayingAsana(asanaObj);
                        setPlayingColor(color);
                    }}
                />
            )}

            {/* Asana Playback Window */}
            {playingAsana && (
                <AsanaPlayWindow
                    asana={playingAsana}
                    color={playingColor}
                    onClose={() => setPlayingAsana(null)}
                    onComplete={() => {
                        if (selectedDay) {
                            toggleComplete(selectedDay.day, { stopPropagation: () => { } });
                        }
                    }}
                />
            )}
        </div>
    );
};

export default YogaPlanModal;
