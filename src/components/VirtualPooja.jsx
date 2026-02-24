import React, { useState, useRef, useEffect } from 'react';
import './VirtualPooja.css';
import { ArrowLeft, X, Home, Compass, BookOpen, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VirtualPooja = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [selectedGod, setSelectedGod] = useState('shivling');
    const [japaCount, setJapaCount] = useState(0);
    const [isMantraPlaying, setIsMantraPlaying] = useState(false);
    const audioRef = useRef(null);

    const gods = [
        { id: 'shivling', name: 'Shiva', symbol: 'ॐ', mantra: 'Om Namah Shivaya', roman: 'oṃ namaḥ śivāya', meaning: 'I bow to the auspicious one', color: 'rgba(200, 230, 255, 0.4)' },
        { id: 'ganesh', name: 'Ganesh', symbol: '🐘', mantra: 'Om Gam Ganapataye Namaha', roman: 'oṃ gaṃ gaṇapataye namaḥ', meaning: 'Salutations to the remover of obstacles', color: 'rgba(255, 200, 150, 0.4)' },
        { id: 'durga', name: 'Durga', symbol: '🌸', mantra: 'Om Dum Durgayei Namaha', roman: 'oṃ duṃ durgāyai namaḥ', meaning: 'Salutations to the invincible one', color: 'rgba(255, 100, 150, 0.4)' },
        { id: 'lakshmi', name: 'Lakshmi', symbol: '🪷', mantra: 'Om Shreem Mahalakshmiyei Namaha', roman: 'oṃ śrīṃ mahālakṣmyai namaḥ', meaning: 'Adoration to the Goddess of Wealth', color: 'rgba(255, 200, 100, 0.4)' }
    ];

    const currentGod = gods.find(g => g.id === selectedGod) || gods[0];

    // SAMAGRI - SACRED OFFERINGS
    const offerings = [
        { id: 'jal', label: 'Jal', icon: '💧' },
        { id: 'pushpa', label: 'Pushpa', icon: '🌸' },
        { id: 'deepa', label: 'Deepa', icon: '🪔' },
        { id: 'madhu', label: 'Madhu', icon: '🏺' },
        { id: 'dugdha', label: 'Dugdha', icon: '🥛' },
        { id: 'tulsi', label: 'Tulsi', icon: '🌿' }
    ];
    const [activeOfferings, setActiveOfferings] = useState([]);

    const toggleOffering = (id) => {
        setActiveOfferings(prev =>
            prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
        );
    };

    const handleJapaInc = () => {
        if (japaCount < 1080) setJapaCount(prev => prev + 1);
    };

    const handleJapaDec = () => {
        if (japaCount > 0) setJapaCount(prev => prev - 1);
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
        <div className="virtual-pooja-overlay">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="pooja-video-bg"
                style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1
                }}
            >
                <source src="/videos/night_sky_timelapse.mp4" type="video/mp4" />
            </video>

            <div className="pooja-video-overlay" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 3, 13, 0.6)', zIndex: 0
            }}></div>

            {/* Main Screen Container matching Glass template */}
            <div className="sc-container">
                {/* Topbar */}
                <div className="topbar">
                    <div className="back-btn" onClick={() => navigate('/mobile/home')}>
                        <ArrowLeft size={14} /> Back
                    </div>
                    <div className="topbar-title">VIRTUAL POOJA</div>
                    <div className="close-btn" onClick={onClose}><X size={14} /></div>
                </div>

                <div className="scroll">
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--vp-w90)' }}>पूजा</div>
                        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--vp-w50)', marginTop: '4px' }}>Sacred Digital Worship</div>
                    </div>

                    {/* Deity Tabs */}
                    <div className="deity-tabs" style={{ marginBottom: '24px' }}>
                        {gods.map(god => (
                            <div
                                key={god.id}
                                className={`d-tab ${selectedGod === god.id ? 'on' : ''}`}
                                onClick={() => setSelectedGod(god.id)}
                            >
                                <div className="dt-ico">{god.symbol}</div>
                                <div className="dt-lbl">{god.name.toUpperCase()}</div>
                            </div>
                        ))}
                    </div>

                    {/* Deity Hero */}
                    <div className="deity-hero" style={{ height: '180px', marginBottom: '8px' }}>
                        <div className="dh-ring1"></div>
                        <div className="dh-ring2"></div>
                        <div className="dh-ring3"></div>
                        <div className="dh-symbol" style={{ filter: `drop-shadow(0 0 18px ${currentGod.color})` }}>{currentGod.symbol}</div>
                        <div className="dh-name" style={{ fontSize: '0.75rem' }}>{currentGod.id === 'shivling' ? 'SHIVLING' : currentGod.name.toUpperCase()}</div>
                    </div>

                    {/* Mantra Panel */}
                    <div className="mantra-panel" style={{ background: 'transparent', border: 'none', textAlign: 'center', padding: '16px 0', marginBottom: '8px' }}>
                        <div className="mantra-main" style={{ fontSize: '1.2rem' }}>ॐ नमः शिवाय</div>
                        <div className="mantra-roman" style={{ fontSize: '0.85rem' }}>{currentGod.mantra}</div>
                        <div className="mantra-meaning" style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>{currentGod.meaning}</div>
                    </div>

                    {/* Offerings Grid */}
                    <div className="offerings-label" style={{ textAlign: 'center' }}>SAMAGRI · SACRED OFFERINGS</div>
                    <div className="offerings-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', padding: '0 16px', marginBottom: '24px' }}>
                        {offerings.map(offer => (
                            <div
                                key={offer.id}
                                className={`offer-item ${activeOfferings.includes(offer.id) ? 'on' : ''}`}
                                onClick={() => toggleOffering(offer.id)}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                    background: activeOfferings.includes(offer.id) ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 0', cursor: 'pointer',
                                    transition: 'all 0.2s', minWidth: '45px'
                                }}
                            >
                                <div className="offer-ico" style={{ fontSize: '1.2rem' }}>{offer.icon}</div>
                                <div className="offer-lbl" style={{ fontSize: '0.55rem', letterSpacing: '0.05em', color: 'var(--vp-w60)' }}>{offer.label.toUpperCase()}</div>
                            </div>
                        ))}
                    </div>

                    {/* Japa Counter */}
                    <div className="japa-panel" style={{ padding: '20px', borderRadius: '24px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--vp-w50)', marginBottom: '4px' }}>JAPA COUNT</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--vp-w90)', lineHeight: '1' }}>{japaCount}</div>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--vp-w40)', marginTop: '4px' }}>OF 1080 ROUNDS</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                    onClick={handleJapaDec}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--vp-w60)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    -
                                </button>
                                <button
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--vp-w60)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    ↺
                                </button>
                                <button
                                    onClick={handleJapaInc}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--vp-w60)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            {[108, 216, 540, 1080].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setJapaCount(val)}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'var(--vp-w60)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.65rem', cursor: 'pointer'
                                    }}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status Strip */}
                    <div className="status-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '0 16px', marginBottom: '24px' }}>
                        <div className="stat-cell" style={{ background: 'transparent', padding: '0', alignItems: 'center', textAlign: 'center' }}>
                            <div className="stat-val" style={{ fontSize: '1rem' }}>✓ 3/5</div>
                            <div className="stat-lbl" style={{ fontSize: '0.6rem' }}>TODAY'S POOJA</div>
                        </div>
                        <div className="stat-cell" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)', background: 'transparent', padding: '0', alignItems: 'center', textAlign: 'center', borderRadius: '0' }}>
                            <div className="stat-val" style={{ fontSize: '1rem', color: '#fca5a5' }}>🔥 14</div>
                            <div className="stat-lbl" style={{ fontSize: '0.6rem' }}>DAY STREAK</div>
                        </div>
                        <div className="stat-cell" style={{ background: 'transparent', padding: '0', alignItems: 'center', textAlign: 'center' }}>
                            <div className="stat-val" style={{ fontSize: '1rem', color: '#fde047' }}>⭐ 2.3K</div>
                            <div className="stat-lbl" style={{ fontSize: '0.6rem' }}>KARMA PTS</div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ padding: '0 16px', marginBottom: '32px', display: 'flex', gap: '12px' }}>
                        <button style={{
                            flex: '2',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            padding: '16px',
                            borderRadius: '24px',
                            color: 'white',
                            fontFamily: 'var(--font-ui)',
                            letterSpacing: '0.1em',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            ✦ BEGIN POOJA
                        </button>
                        <button style={{
                            flex: '1',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '16px',
                            borderRadius: '24px',
                            color: 'var(--vp-w50)',
                            fontFamily: 'var(--font-ui)',
                            letterSpacing: '0.1em',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}>
                            SCHEDULE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualPooja;
