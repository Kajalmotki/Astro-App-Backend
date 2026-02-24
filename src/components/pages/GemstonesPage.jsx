import React, { useState, useEffect } from 'react';
import './GemstonesPage.css';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const gemsData = [
    { name: 'Ruby', hindi: 'माणिक्य', planet: 'Sun', planetSanskrit: 'सूर्य', element: 'Fire', initial: '☉', status: 'RECOMMENDED', idealFor: 'Authority, Vitality', weight: '3-5 carats', wearOn: 'Ring finger', benefits: 'Success, Leadership', metal: 'Gold', origin: 'Myanmar, Thailand' },
    { name: 'Pearl', hindi: 'मोती', planet: 'Moon', planetSanskrit: 'चंद्र', element: 'Water', initial: '☽', status: 'RECOMMENDED', idealFor: 'Peace, Mind', weight: '2-3 carats', wearOn: 'Little finger', benefits: 'Calm, Clarity', metal: 'Silver', origin: 'Australia' },
    { name: 'Red Coral', hindi: 'प्रवाल', planet: 'Mars', planetSanskrit: 'मंगल', element: 'Fire', initial: '♂', status: 'RECOMMENDED', idealFor: 'Courage, Energy', weight: '3-5 carats', wearOn: 'Ring finger', benefits: 'Courage, Vitality', metal: 'Gold', origin: 'Mediterranean' },
    { name: 'Emerald', hindi: 'पन्ना', planet: 'Mercury', planetSanskrit: 'बुध', element: 'Air', initial: '☿', status: 'RECOMMENDED', idealFor: 'Communication', weight: '2-4 carats', wearOn: 'Little finger', benefits: 'Wisdom, Communication', metal: 'Gold/Silver', origin: 'Colombia' },
    { name: 'Yellow Sapphire', hindi: 'पुखराज', planet: 'Jupiter', planetSanskrit: 'गुरु', element: 'Earth', initial: '♃', status: 'RECOMMENDED', idealFor: 'Knowledge, Wealth', weight: '4-6 carats', wearOn: 'Index finger', benefits: 'Prosperity, Wisdom', metal: 'Gold', origin: 'Sri Lanka' },
    { name: 'Diamond', hindi: 'हीरा', planet: 'Venus', planetSanskrit: 'शुक्र', element: 'Air', initial: '♀', status: 'RECOMMENDED', idealFor: 'Luxury, Relationships', weight: '0.5-1 carat', wearOn: 'Ring finger', benefits: 'Love, Beauty', metal: 'White Gold', origin: 'South Africa' },
    { name: 'Blue Sapphire', hindi: 'नीलम', planet: 'Saturn', planetSanskrit: 'शनि', element: 'Air', initial: '♄', status: 'RECOMMENDED', idealFor: 'Discipline, Longevity', weight: '4-6 carats', wearOn: 'Middle finger', benefits: 'Protection, Discipline', metal: 'Gold/Silver', origin: 'Sri Lanka' },
    { name: 'Hessonite', hindi: 'गोमेद', planet: 'Rahu', planetSanskrit: 'राहु', element: 'Fire', initial: '◯', status: 'RECOMMENDED', idealFor: 'Success, Ambition', weight: '6-8 carats', wearOn: 'Middle finger', benefits: 'Success, Protection', metal: 'Silver', origin: 'Sri Lanka' },
    { name: 'Cat\'s Eye', hindi: 'लहसुनिया', planet: 'Ketu', planetSanskrit: 'केतु', element: 'Earth', initial: '◉', status: 'RECOMMENDED', idealFor: 'Spiritual Growth', weight: '4-6 carats', wearOn: 'Middle finger', benefits: 'Spirituality, Healing', metal: 'Silver', origin: 'Sri Lanka' }
];

const GemstonesPage = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [gems] = useState(gemsData);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedGemName, setSelectedGemName] = useState(gems.length > 0 ? gems[0].name : 'Ruby');

    const sunFamily = ['Sun', 'Mars', 'Jupiter', 'Ketu'];
    const moonFamily = ['Moon', 'Mercury', 'Venus', 'Saturn', 'Rahu'];

    const getFilteredGems = () => {
        if (activeFilter === 'sun_family') return gems.filter(g => sunFamily.includes(g.planet));
        if (activeFilter === 'moon_family') return gems.filter(g => moonFamily.includes(g.planet));
        // Mock 'My Rashi' by showing benefic/recommended gems, or a specific subset
        if (activeFilter === 'my_rashi') return gems.filter(g => g.status === 'RECOMMENDED');
        return gems;
    };

    const filteredGems = getFilteredGems();
    const currentGem = gems.find(g => g.name === selectedGemName) || filteredGems[0] || gems[0];

    useEffect(() => {
        // When filter changes, if the currently selected gem is not in the new list, select the first one
        if (filteredGems.length > 0 && !filteredGems.find(g => g.name === selectedGemName)) {
            setSelectedGemName(filteredGems[0].name);
        }
    }, [activeFilter]);

    const filters = [
        { id: 'all', label: 'ALL' },
        { id: 'sun_family', label: 'SUN FAMILY' },
        { id: 'moon_family', label: 'MOON FAMILY' },
        { id: 'my_rashi', label: 'MY RASHI' }
    ];

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
        <div className="gemstones-overlay">
            {/* Video Background */}
            <video
                autoPlay loop muted playsInline className="gemstones-video-bg"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
            >
                <source src="/videos/night_sky_timelapse.mp4" type="video/mp4" />
            </video>
            <div className="gemstones-video-overlay" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 3, 13, 0.6)', zIndex: 0
            }}></div>

            <div className="sc-container">
                <div className="topbar">
                    <div className="back-btn" onClick={() => navigate('/mobile/home')}>
                        <span style={{ fontSize: '1rem', marginRight: '4px' }}>←</span> Back
                    </div>
                    <div className="topbar-title">NAVARATNA</div>
                    <div className="close-btn" onClick={onClose}><X size={14} /></div>
                </div>

                <div className="scroll">
                    <div className="sec-head" style={{ marginTop: '16px', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.4rem' }}>नवरत्न</h2>
                        <div className="sub" style={{ fontSize: '0.65rem' }}>Nine Sacred Planetary Gems</div>
                    </div>

                    {/* Selected Gem Detail Card */}
                    <div style={{ margin: '0 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', backdropFilter: 'blur(10px)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--vp-w90)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
                                {currentGem.initial}
                            </div>
                            <div style={{ flex: '1' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--vp-w90)', letterSpacing: '0.05em' }}>
                                    {currentGem.name} · {currentGem.hindi}
                                </div>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--vp-w50)', letterSpacing: '0.05em', marginTop: '6px', marginBottom: '10px' }}>
                                    {currentGem.planet} · {currentGem.planetSanskrit} · {currentGem.element}
                                </div>
                                <div style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.55rem', fontFamily: 'var(--font-ui)', letterSpacing: '0.1em', color: 'var(--vp-w60)' }}>
                                    {currentGem.status}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>IDEAL FOR</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{currentGem.idealFor}</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>WEIGHT</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{currentGem.weight}</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>WEAR ON</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{currentGem.wearOn}</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>BENEFITS</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{currentGem.benefits}</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>METAL</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{currentGem.metal}</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: 'var(--vp-w40)', letterSpacing: '0.1em', marginBottom: '4px' }}>ORIGIN</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--vp-w80)' }}>{currentGem.origin}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '0 16px', margin: '24px 0', display: 'flex', gap: '8px', overflowX: 'auto' }}>
                        {filters.map(f => (
                            <div
                                key={f.id}
                                style={{
                                    border: '1px solid rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '16px',
                                    fontSize: '0.55rem', fontFamily: 'var(--font-ui)', letterSpacing: '0.1em', color: 'var(--vp-w60)',
                                    whiteSpace: 'nowrap', cursor: 'pointer',
                                    background: activeFilter === f.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                                    borderColor: activeFilter === f.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
                                }}
                                onClick={() => setActiveFilter(f.id)}
                            >
                                {f.label}
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '90px' }}>
                        {filteredGems.length > 0 ? filteredGems.map((gem) => (
                            <div
                                key={gem.name}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                                    background: selectedGemName === gem.name ? 'rgba(255,255,255,0.04)' : 'transparent',
                                    border: '1px solid', borderColor: selectedGemName === gem.name ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                    borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                onClick={() => setSelectedGemName(gem.name)}
                            >
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--vp-w80)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
                                    {gem.initial}
                                </div>
                                <div style={{ flex: '1' }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--vp-w90)' }}>
                                        {gem.name} · {gem.hindi}
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--vp-w50)', marginTop: '4px', marginBottom: '6px' }}>
                                        {gem.planet} · {gem.planetSanskrit} · {gem.element}
                                    </div>
                                    <div style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.45rem', fontFamily: 'var(--font-ui)', letterSpacing: '0.1em', color: 'var(--vp-w50)' }}>
                                        {gem.status}
                                    </div>
                                </div>
                                <div style={{ color: 'var(--vp-w30)', fontSize: '1.2rem' }}>›</div>
                            </div>
                        )) : (
                            <div style={{ color: 'var(--vp-w50)', textAlign: 'center', fontSize: '0.85rem', padding: '20px' }}>
                                No gems found for this filter.
                            </div>
                        )}
                    </div>

                    {/* Floating CTA */}
                    <div style={{ position: 'fixed', bottom: '24px', left: '16px', right: '16px', zIndex: 10 }}>
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
                            ✦ GET PERSONALISED RECOMMENDATION
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GemstonesPage;
