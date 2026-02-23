import React, { useState } from 'react';
import { Play, Pause, Activity, Info, X, Music, CheckCircle } from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';
import './AsanaPlayWindow.css';

const getGeneratedImageForAsana = (name) => {
    if (!name) return null;
    const map = {
        'Pavanamuktasana': 'muladhara_pavanamuktasana.png',
        'Vajrasana': 'muladhara_vajrasana.png',
        'Malasana': 'muladhara_malasana.png',
        'Tadasana': 'muladhara_tadasana.png',
        'Janu Sirshasana': 'muladhara_janusirsasana.png',
        'Baddha Konasana': 'svadhisthana_baddhakonasana.png',
        'Bharadvajasana': 'svadhisthana_bharadvajasana.png',
        'Bhujangasana': 'anahata_bhujangasana.png', // Reused
        'Trikonasana': 'svadhisthana_trikonasana.png',
        'Viparita Karani': 'svadhisthana_viparitakarani.png',
        'Upavistha Konasana': 'svadhisthana_upavisthakonasana.png',
        'Eka Pada Rajakapotasana': 'svadhisthana_ekapadarajakapotasana.png',
        'Navasana': 'manipura_navasana.png',
        'Dhanurasana': 'manipura_dhanurasana.png',
        'Ardha Matsyendrasana': 'manipura_ardhamatsyendrasana.png',
        'Paschimottanasana': 'manipura_paschimottanasana.png',
        'Surya Namaskar': 'manipura_suryanamaskar.png',
        'Sun Salutation (12 steps)': 'manipura_suryanamaskar.png',
        'Ustrasana': 'anahata_ustrasana.png',
        'Matsyasana': 'vishuddha_matsyasana.png', // Reused
        'Gomukhasana': 'anahata_gomukhasana.png',
        'Setu Bandhasana': 'anahata_setubandhasana.png',
        'Garudasana': 'ajna_garudasana.png', // Reused
        'Chakrasana': 'anahata_chakrasana.png',
        'Sarvangasana': 'vishuddha_sarvangasana.png',
        'Halasana': 'vishuddha_halasana.png',
        'Ujjayi Pranayama (as Asana)': 'sahasrara_padmasana.png', // Reused seated
        'Marjariasana': 'vishuddha_marjariasana.png',
        'Balasana': 'ajna_balasana.png',
        'Shashankasana': 'ajna_balasana.png', // Reused
        'Padmasana': 'sahasrara_padmasana.png',
        'Siddhasana': 'sahasrara_padmasana.png', // Reused
        'Sirshasana': 'sahasrara_sirsasana.png',
        'Trataka (as Asana-Meditation)': 'ajna_trataka.png',
        'Prasarita Padottanasana': 'ajna_prasarita.png',
        'Nadi Shodhana Flow': 'ajna_nadishodhana.png',
        'Savasana': 'sahasrara_savasana.png',
        'Shavasana (Extended)': 'sahasrara_savasana.png',
        'Shavasana with Moonlight Meditation': 'sahasrara_savasana.png',
        'Yoga Nidra (lying)': 'sahasrara_savasana.png',
        'Yoga Nidra': 'sahasrara_savasana.png'
    };
    for (const key in map) {
        if (name.includes(key)) return map[key];
    }
    return null;
};

const AsanaPlayWindow = ({ asana, color = '#10b981', onClose, onComplete }) => {
    const [viewMode, setViewMode] = useState('practice'); // 'practice' or 'details'
    const [showAmbienceTray, setShowAmbienceTray] = useState(false);

    // Connect to global Music Context for ambience
    const { isPlaying: isMusicPlaying, togglePlay: toggleMusic, currentTrack, playTrack, tracks } = useMusic();

    // Premium background gradient fallback
    const abstractBg = `radial-gradient(circle at 40% 30%, ${color}40 0%, #000000 80%)`;

    const handleComplete = () => {
        if (isMusicPlaying) toggleMusic(); // Stop ambience when exiting
        if (onComplete) onComplete();
        onClose();
    };

    const hasImage = getGeneratedImageForAsana(asana.name);

    return (
        <div className="apw-overlay">
            <div className="apw-modal" style={{ '--theme-color': color }}>
                {/* Header Actions */}
                <div className="apw-top-bars">
                    <div /> {/* Empty spacer */}
                    <button className="apw-close" onClick={handleComplete}><X size={24} /></button>
                </div>

                {/* Hero Top Section */}
                <div
                    className="apw-hero"
                    style={{
                        backgroundImage: hasImage ? `url(/images/yoga/${hasImage})` : abstractBg,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 20%'
                    }}
                >
                    {!hasImage && <div className="apw-hero-icon">{asana.emoji || '🧘'}</div>}
                    <div className="apw-hero-text">
                        <span className="apw-category-badge">{asana.category || 'practice'}</span>
                        <h2 className="apw-title">{asana.name}</h2>
                        <p className="apw-sanskrit">{asana.sanskrit || asana.name}</p>
                    </div>
                    {/* View Toggle */}
                    <div className="apw-view-toggles">
                        <button
                            className={`apw-toggle-btn ${viewMode === 'practice' ? 'active' : ''}`}
                            onClick={() => setViewMode('practice')}
                        >
                            <Activity size={14} /> Practice
                        </button>
                        <button
                            className={`apw-toggle-btn ${viewMode === 'details' ? 'active' : ''}`}
                            onClick={() => setViewMode('details')}
                        >
                            <Info size={14} /> Details
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="apw-body">
                    {viewMode === 'practice' ? (
                        <div className="apw-steps-view animate-fade-in">
                            <div className="apw-step-display" style={{ marginTop: '16px' }}>
                                <h3 className="apw-step-counter" style={{ color: color, margin: 0 }}>
                                    Cosmic Focus
                                </h3>
                                <p className="apw-benefit-focus">
                                    {asana.why || asana.description}
                                </p>
                            </div>

                            {/* Ambience Controls */}
                            <div className="apw-ambience-container">
                                {showAmbienceTray ? (
                                    <div className="apw-ambience-tray animate-pop">
                                        <div className="apw-tray-header">
                                            <span>Select Ambience</span>
                                            <button onClick={() => setShowAmbienceTray(false)}><X size={16} /></button>
                                        </div>
                                        <div className="apw-tray-grid">
                                            {tracks && tracks.map(t => (
                                                <button
                                                    key={t.id}
                                                    className={`apw-tray-btn ${currentTrack?.id === t.id && isMusicPlaying ? 'active' : ''}`}
                                                    onClick={() => {
                                                        playTrack(t);
                                                        setShowAmbienceTray(false);
                                                    }}
                                                    style={{ '--theme-color': color }}
                                                >
                                                    <span className="tray-icon">{t.icon}</span>
                                                    <span className="tray-name">{t.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className={`apw-ambience-toggle ${isMusicPlaying ? 'playing' : ''}`}
                                        onClick={() => {
                                            if (!isMusicPlaying) {
                                                toggleMusic();
                                            } else {
                                                setShowAmbienceTray(true);
                                            }
                                        }}
                                        style={{ '--btn-color': color }}
                                    >
                                        <div className="apw-ambience-icon">
                                            {isMusicPlaying ? <Music size={24} color="#000" /> : <Play size={24} color="#fff" style={{ marginLeft: '4px' }} />}
                                        </div>
                                        <span>{isMusicPlaying ? `Playing: ${currentTrack?.name}` : 'Ambience Music'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="apw-benefits-view animate-fade-in">
                            {asana.steps && (
                                <div className="apw-info-card">
                                    <h4><Activity size={16} /> Steps</h4>
                                    <ul className="apw-compact-steps">
                                        {asana.steps.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {asana.healthBenefits && (
                                <div className="apw-health-list" style={{ marginTop: '16px' }}>
                                    <h4><Info size={16} /> Health Uplift</h4>
                                    <ul>
                                        {asana.healthBenefits.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <button className="apw-complete-btn animate-pop" onClick={handleComplete} style={{ alignSelf: 'center', marginTop: '16px' }}>
                        <CheckCircle size={20} /> Complete Practice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AsanaPlayWindow;
