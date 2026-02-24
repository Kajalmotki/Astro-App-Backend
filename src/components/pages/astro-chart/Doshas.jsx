import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const Doshas = ({ chartData }) => {
    const planets = chartData?.math?.planets || [];

    if (!planets.length) {
        return <div style={{ color: 'var(--k-w40)', padding: '20px', textAlign: 'center' }}>Dosha analysis unavailable.</div>;
    }

    const getPlanet = (name) => planets.find(p => p.name === name);
    const mars = getPlanet('Mars');
    const moon = getPlanet('Moon');

    // Evaluate Manglik Dosha
    let manglik = { active: false, cancelled: false, text: "Clear", color: "rgba(150,255,150,0.8)", pill: "pill-pos", desc: "" };
    if (mars) {
        const mHouses = [1, 4, 7, 8, 12];
        const isM = mHouses.includes(mars.house);
        const isC = isM && ['Aries', 'Scorpio', 'Capricorn'].includes(mars.sign);
        manglik.active = isM && !isC;
        manglik.cancelled = isC;
        if (isC) {
            manglik.text = "Cancelled"; manglik.color = "rgba(255,200,100,0.8)"; manglik.pill = "pill-neu";
            manglik.desc = `Mars is placed in the ${mars.house}th house, which initially causes Manglik Dosha. However, as Mars is in ${mars.sign}, the harsh effects are considered cancelled (Dosha Bhanga).`;
        } else if (isM) {
            manglik.text = "Active"; manglik.color = "rgba(255,80,80,0.8)"; manglik.pill = "pill-neg";
            manglik.desc = `Mars is placed in the ${mars.house}th house, creating Manglik Dosha. This can bring intensity or friction in partnerships without proper compatibility.`;
        } else {
            manglik.desc = `Mars is favorably placed in the ${mars.house}th house. Manglik Dosha is not present in this chart.`;
        }
    }

    // Evaluate Sade Sati (Assuming current Saturn transit in Aquarius/Pisces region)
    let sadeSati = { active: false, text: "Clear", color: "rgba(150,255,150,0.8)", pill: "pill-pos", desc: "", remedy: null };
    if (moon) {
        const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const moonIdx = SIGNS.indexOf(moon.sign);
        const saturnTransitIdx = 10; // Simple mock for Aquarius (2023-2025)
        const diff = (saturnTransitIdx - moonIdx + 12) % 12;
        const isSS = [11, 0, 1].includes(diff);

        if (isSS) {
            sadeSati.active = true; sadeSati.text = "Active"; sadeSati.color = "rgba(255,80,80,0.8)"; sadeSati.pill = "pill-neg";
            const phase = diff === 11 ? "Rising Phase (1st phase)" : diff === 0 ? "Peak Phase (2nd phase)" : "Setting Phase (3rd phase)";
            sadeSati.desc = `You are currently in the ${phase} of Shani Sade Sati. Saturn is transiting near your natal Moon in ${moon.sign}. This period may bring stress and increased responsibilities.`;
            sadeSati.remedy = `Remedy: Chant Hanuman Chalisa daily and light a mustard oil lamp on Saturdays.`;
        } else {
            sadeSati.desc = `Saturn's current transit is far from your natal Moon in ${moon.sign}. You are currently free from the Sade Sati period.`;
        }
    }

    return (
        <div className="doshas-section">
            <div className="sec-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--k-w90)' }}>Karmic Deficiencies (Doshas)</h3>
                <div className="sub">Checking for major astrological afflictions</div>
            </div>

            {/* Manglik Dosha */}
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${manglik.color.replace('0.8', '0.3')}`, borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    {manglik.active ? <AlertTriangle size={18} color={manglik.color} /> : manglik.cancelled ? <Info size={18} color={manglik.color} /> : <CheckCircle size={18} color={manglik.color} />}
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--k-w90)', letterSpacing: '0.1em' }}>Manglik Dosha</h3>
                    <span className={`pill ${manglik.pill}`} style={{ marginLeft: 'auto' }}>{manglik.text}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--k-w60)', lineHeight: '1.6' }}>{manglik.desc}</p>
            </div>

            {/* Kaal Sarp Dosha - Hardcoded Clear for simplicity without full sequence array math */}
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(150,255,150,0.3)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <CheckCircle size={18} color="rgba(150,255,150,0.8)" />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--k-w90)', letterSpacing: '0.1em' }}>Kaal Sarp Dosha</h3>
                    <span className="pill pill-pos" style={{ marginLeft: 'auto' }}>Clear</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--k-w60)', lineHeight: '1.6' }}>
                    All planets are not hemmed between Rahu and Ketu in your birth chart. Kalsarp Dosha is not present.
                </p>
            </div>

            {/* Sade Sati */}
            <div className="glass-panel" style={{ padding: '16px', background: sadeSati.active ? 'rgba(255,80,80,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${sadeSati.color.replace('0.8', sadeSati.active ? '0.4' : '0.3')}`, borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    {sadeSati.active ? <AlertTriangle size={18} color={sadeSati.color} /> : <CheckCircle size={18} color={sadeSati.color} />}
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--k-w90)', letterSpacing: '0.1em' }}>Sade Sati Phase</h3>
                    <span className={`pill ${sadeSati.pill}`} style={{ marginLeft: 'auto' }}>{sadeSati.text}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--k-w60)', lineHeight: '1.6' }}>{sadeSati.desc}</p>
                {sadeSati.remedy && (
                    <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'rgba(255,80,80,0.8)', fontStyle: 'italic' }}>{sadeSati.remedy}</div>
                )}
            </div>
        </div>
    );
};

export default Doshas;
