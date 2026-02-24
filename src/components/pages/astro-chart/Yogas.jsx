import React from 'react';

const Yogas = ({ chartData }) => {
    const planets = chartData?.math?.planets || [];

    if (!planets.length) {
        return <div style={{ color: 'var(--k-w40)', padding: '20px', textAlign: 'center' }}>Yoga analysis unavailable.</div>;
    }

    const getPlanet = (name) => planets.find(p => p.name === name);
    const jupiter = getPlanet('Jupiter');
    const moon = getPlanet('Moon');
    const mars = getPlanet('Mars');
    const mercury = getPlanet('Mercury');
    const venus = getPlanet('Venus');
    const saturn = getPlanet('Saturn');
    const sun = getPlanet('Sun');

    const activeYogas = [];
    const KENDRA = [1, 4, 7, 10];

    // Gajakesari Yoga: Jupiter in Kendra from Moon
    if (jupiter && moon) {
        const diff = (jupiter.house - moon.house + 12) % 12 + 1;
        if (KENDRA.includes(diff)) {
            activeYogas.push({ name: 'Gajakesari Yoga', planetInvolved: 'Jupiter & Moon', effect: 'Brings eloquence, intelligence, and a lasting reputation. Success in education and administration.', strength: 'High' });
        }
    }

    // Panch Mahapurusha Yogas (Kendra from Lagna + Own/Exalted)
    if (mars && KENDRA.includes(mars.house) && ['Aries', 'Scorpio', 'Capricorn'].includes(mars.sign)) {
        activeYogas.push({ name: 'Ruchaka Yoga', planetInvolved: 'Mars', effect: 'Grants courage, physical strength, land ownership, and high positions in police, military, or sports.', strength: 'High' });
    }
    if (mercury && KENDRA.includes(mercury.house) && ['Gemini', 'Virgo'].includes(mercury.sign)) {
        activeYogas.push({ name: 'Bhadra Yoga', planetInvolved: 'Mercury', effect: 'Brings exceptional intellect, communication skills, business acumen, and a youthful appearance.', strength: 'High' });
    }
    if (jupiter && KENDRA.includes(jupiter.house) && ['Sagittarius', 'Pisces', 'Cancer'].includes(jupiter.sign)) {
        activeYogas.push({ name: 'Hamsa Yoga', planetInvolved: 'Jupiter', effect: 'Bestows wisdom, a pure heart, religious inclination, and respect in society.', strength: 'High' });
    }
    if (venus && KENDRA.includes(venus.house) && ['Taurus', 'Libra', 'Pisces'].includes(venus.sign)) {
        activeYogas.push({ name: 'Malavya Yoga', planetInvolved: 'Venus', effect: 'Grants marital happiness, luxury, artistic talents, vehicles, and a charismatic personality.', strength: 'High' });
    }
    if (saturn && KENDRA.includes(saturn.house) && ['Capricorn', 'Aquarius', 'Libra'].includes(saturn.sign)) {
        activeYogas.push({ name: 'Sasha Yoga', planetInvolved: 'Saturn', effect: 'Results in authority, patience, success over enemies, and long-term political or leadership gains.', strength: 'Moderate' });
    }

    // Example combination yogas
    if (sun && mercury && sun.house === mercury.house) {
        activeYogas.push({ name: 'Budhaditya Yoga', planetInvolved: 'Sun & Mercury', effect: 'Confers quick learning, analytical skills, and success in business or communication.', strength: 'High' });
    }
    if (moon && mars && moon.house === mars.house) {
        activeYogas.push({ name: 'Chandra Mangal Yoga', planetInvolved: 'Moon & Mars', effect: 'Creates a passionate, driven nature with potential for wealth accumulation, often through bold actions.', strength: 'Moderate' });
    }

    return (
        <div className="yogas-section">
            <div className="sec-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--k-w90)' }}>Auspicious Planetary Yogas</h3>
                <div className="sub">Positive combinations active in your chart</div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
                {activeYogas.length > 0 ? activeYogas.map((yoga, index) => (
                    <div key={index} className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--k-w90)', margin: 0 }}>{yoga.name}</h4>
                            <span className={`pill ${yoga.strength === 'High' ? 'pill-pos' : 'pill-hi'} `} style={{ fontSize: '0.45rem' }}>
                                {yoga.strength} Strength
                            </span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--k-w40)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '6px' }}>
                            FORMING PLANETS: <span style={{ color: 'var(--k-w80)' }}>{yoga.planetInvolved}</span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--k-w60)', lineHeight: '1.5', margin: 0 }}>
                            {yoga.effect}
                        </p>
                    </div>
                )) : (
                    <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ color: 'var(--k-w60)', fontSize: '0.85rem' }}>No major combinations detected. This does not mean lack of potential, just that different planetary influences guide your path.</p>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '20px', padding: '12px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--k-w40)', fontStyle: 'italic' }}>
                    Note: The manifestation of Yogas depends on the active Mahadasha and planetary degrees.
                </p>
            </div>
        </div>
    );
};

export default Yogas;
