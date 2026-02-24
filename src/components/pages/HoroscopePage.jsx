import React, { useState, useEffect } from 'react';
import './HoroscopePage.css';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HoroscopePage = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [selectedSign, setSelectedSign] = useState(null);
    const [activePeriod, setActivePeriod] = useState('daily');
    const [activePlanet, setActivePlanet] = useState('sun');

    const planets = [
        { id: 'sun', symbol: '☀️', name: 'SUN' },
        { id: 'moon', symbol: '🌙', name: 'MOON' },
        { id: 'mars', symbol: '🔴', name: 'MARS' },
        { id: 'mercury', symbol: '☿️', name: 'MERCURY' },
        { id: 'jupiter', symbol: '♃', name: 'JUPITER' },
        { id: 'venus', symbol: '♀️', name: 'VENUS' },
        { id: 'saturn', symbol: '♄', name: 'SATURN' }
    ];

    const zodiacSigns = [
        { name: "Aries", sanskrit: "मेष", symbol: "♈", dates: "Mar 21 - Apr 19", score: "88%" },
        { name: "Taurus", sanskrit: "वृषभ", symbol: "♉", dates: "Apr 20 - May 20", score: "72%" },
        { name: "Gemini", sanskrit: "मिथुन", symbol: "♊", dates: "May 21 - Jun 20", score: "94%" },
        { name: "Cancer", sanskrit: "कर्क", symbol: "♋", dates: "Jun 21 - Jul 22", score: "65%" },
        { name: "Leo", sanskrit: "सिंह", symbol: "♌", dates: "Jul 23 - Aug 22", score: "81%" },
        { name: "Virgo", sanskrit: "कन्या", symbol: "♍", dates: "Aug 23 - Sep 22", score: "79%" },
        { name: "Libra", sanskrit: "तुला", symbol: "♎", dates: "Sep 23 - Oct 22", score: "90%" },
        { name: "Scorpio", sanskrit: "वृश्चिक", symbol: "♏", dates: "Oct 23 - Nov 21", score: "85%" },
        { name: "Sagittarius", sanskrit: "धनु", symbol: "♐", dates: "Nov 22 - Dec 21", score: "70%" },
        { name: "Capricorn", sanskrit: "मकर", symbol: "♑", dates: "Dec 22 - Jan 19", score: "60%" },
        { name: "Aquarius", sanskrit: "कुम्भ", symbol: "♒", dates: "Jan 20 - Feb 18", score: "77%" },
        { name: "Pisces", sanskrit: "मीन", symbol: "♓", dates: "Feb 19 - Mar 20", score: "83%" }
    ];

    const getPrediction = (sign, period) => {
        return {
            overview: `Today brings positive energy for ${sign.name}. The cosmic alignment favors your endeavors. Trust your instincts.`,
            love: "Romance is in the air. Singles may meet someone special through work or social gatherings.",
            career: "Professional growth is indicated. A superior may notice your efforts. Avoid conflicts.",
            health: "Physical energy is high. Good day for starting a new fitness routine. Stay hydrated.",
            finance: "Financial gains are possible through wise investments. Avoid impulsive purchases.",
            loveMeter: 85,
            careerMeter: 90,
            healthMeter: 75
        };
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
        <div className="horoscope-overlay">
            {/* Video Background */}
            <video
                autoPlay loop muted playsInline className="horoscope-video-bg"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
            >
                <source src="/videos/night_sky_timelapse.mp4" type="video/mp4" />
            </video>
            <div className="horoscope-video-overlay" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 3, 13, 0.6)', zIndex: 0
            }}></div>

            {/* Main Screen Container matching Glass template */}
            <div className="sc-container">
                {/* Topbar */}
                <div className="topbar">
                    <div className="back-btn" onClick={() => selectedSign ? setSelectedSign(null) : navigate('/mobile/home')}>
                        <ArrowLeft size={14} /> Back
                    </div>
                    <div className="topbar-title">Daily Horoscope</div>
                    <div className="close-btn" onClick={onClose}><X size={14} /></div>
                </div>

                <div className="scroll">
                    {!selectedSign ? (
                        <>
                            <div className="sec-head">
                                <h2>Today's Transits</h2>
                                <div className="sub">Planetary influences across the zodiac</div>
                                <div className="rule"></div>
                            </div>

                            {/* Planet transit strip */}
                            <div className="planet-strip">
                                {planets.map(planet => (
                                    <div
                                        key={planet.id}
                                        className={`p-chip ${activePlanet === planet.id ? 'on' : ''}`}
                                        onClick={() => setActivePlanet(planet.id)}
                                    >
                                        <div className="p-ico">{planet.symbol}</div>
                                        <div className="p-nm">{planet.name}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Zodiac grid */}
                            <div className="zodiac-grid">
                                {zodiacSigns.map(sign => (
                                    <div
                                        key={sign.name}
                                        className="z-card"
                                        onClick={() => setSelectedSign(sign)}
                                    >
                                        <div className="z-sym">{sign.symbol}</div>
                                        <div className="z-name">{sign.name}</div>
                                        <div className="z-hin">{sign.sanskrit}</div>
                                        <div className="z-date">{sign.dates}</div>
                                        <div className="z-score">{sign.score} Match</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                            {/* Selected Sign Card (Top) */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(147, 51, 234, 0.2)', color: '#d8b4fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '1px solid rgba(147, 51, 234, 0.3)' }}>
                                    {selectedSign.symbol}
                                </div>
                                <div style={{ flex: '1' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--vp-w90)', letterSpacing: '0.1em' }}>
                                            {selectedSign.name.toUpperCase()} · {selectedSign.sanskrit}
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.5rem', fontFamily: 'var(--font-ui)', letterSpacing: '0.1em', color: 'var(--vp-w60)' }}>
                                            TODAY
                                        </div>
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--vp-w50)', marginTop: '4px' }}>
                                        {selectedSign.dates.replace(' - ', ' ')}
                                    </div>
                                </div>
                            </div>

                            {/* Prediction Text */}
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--vp-w80)', lineHeight: '1.6', letterSpacing: '0.02em' }}>
                                Today brings bold energy. Mars ignites your drive. Creative work flourishes in the evening. Trust your instincts — they are aligned with the cosmos.
                            </div>

                            {/* Meters */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { label: 'LOVE', val: 88, color: 'rgba(255, 215, 0, 0.8)' },
                                    { label: 'CAREER', val: 72, color: 'rgba(255, 215, 0, 0.5)' },
                                    { label: 'HEALTH', val: 65, color: 'rgba(255, 215, 0, 0.3)' },
                                    { label: 'FINANCE', val: 58, color: 'rgba(255, 215, 0, 0.2)' }
                                ].map(meter => (
                                    <div key={meter.label}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--vp-w50)', letterSpacing: '0.08em', marginBottom: '6px' }}>
                                            <span>{meter.label}</span>
                                            <span>{meter.val}</span>
                                        </div>
                                        <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${meter.val}%`, background: meter.color, borderRadius: '2px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Lucky Strip */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--vp-w50)' }}>LUCKY</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['NO. 7', 'RED', 'CORAL', 'TUESDAY'].map(tag => (
                                        <div key={tag} style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', padding: '4px 10px', borderRadius: '12px', fontSize: '0.55rem', fontFamily: 'var(--font-ui)', letterSpacing: '0.05em', color: 'var(--vp-w60)' }}>
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingBottom: '32px' }}>
                                <button style={{
                                    flex: '2',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    padding: '14px',
                                    borderRadius: '24px',
                                    color: 'var(--vp-w90)',
                                    fontFamily: 'var(--font-ui)',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}>
                                    ✦ FULL READING
                                </button>
                                <button style={{
                                    flex: '1',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    padding: '14px',
                                    borderRadius: '24px',
                                    color: 'var(--vp-w50)',
                                    fontFamily: 'var(--font-ui)',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer'
                                }}>
                                    SHARE
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HoroscopePage;
