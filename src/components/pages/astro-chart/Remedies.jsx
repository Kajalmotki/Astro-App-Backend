import React from 'react';

const Remedies = ({ chartData }) => {
    const lagna = chartData?.math?.ascSign;

    if (!lagna) {
        return <div style={{ color: 'var(--k-w40)', padding: '20px', textAlign: 'center' }}>Remedies unavailable without Ascendant data.</div>;
    }

    const SIGN_DATA = {
        Aries: { lord: 'Mars', gem: 'Red Coral (Moonga)', color: 'rgba(255,100,100,0.9)', border: 'rgba(255,100,100,0.6)', mantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namah', deity: 'Hanuman', donate: 'Red lentils, jaggery, and copper' },
        Taurus: { lord: 'Venus', gem: 'Diamond or Opal', color: 'rgba(255,255,255,0.9)', border: 'rgba(255,255,255,0.6)', mantra: 'Om Dram Dreem Droum Sah Shukraya Namah', deity: 'Goddess Lakshmi', donate: 'Rice, milk, and white clothes' },
        Gemini: { lord: 'Mercury', gem: 'Emerald (Panna)', color: 'rgba(100,255,100,0.9)', border: 'rgba(100,255,100,0.6)', mantra: 'Om Bram Breem Broum Sah Budhaya Namah', deity: 'Lord Ganesha', donate: 'Green moong dal and green clothes' },
        Cancer: { lord: 'Moon', gem: 'Pearl (Moti)', color: 'rgba(200,220,255,0.9)', border: 'rgba(200,220,255,0.6)', mantra: 'Om Shram Shreem Shroum Sah Chandraya Namah', deity: 'Lord Shiva', donate: 'Milk, rice, and silver' },
        Leo: { lord: 'Sun', gem: 'Ruby (Manik)', color: 'rgba(255,150,50,0.9)', border: 'rgba(255,150,50,0.6)', mantra: 'Om Hram Hreem Hroum Sah Suryaya Namah', deity: 'Lord Vishnu/Surya', donate: 'Wheat, jaggery, and copper' },
        Virgo: { lord: 'Mercury', gem: 'Emerald (Panna)', color: 'rgba(100,255,100,0.9)', border: 'rgba(100,255,100,0.6)', mantra: 'Om Bram Breem Broum Sah Budhaya Namah', deity: 'Lord Ganesha', donate: 'Green grass to cows, green clothes' },
        Libra: { lord: 'Venus', gem: 'Diamond or Opal', color: 'rgba(255,255,255,0.9)', border: 'rgba(255,255,255,0.6)', mantra: 'Om Dram Dreem Droum Sah Shukraya Namah', deity: 'Goddess Lakshmi', donate: 'White sweets, camphor, and curd' },
        Scorpio: { lord: 'Mars', gem: 'Red Coral (Moonga)', color: 'rgba(255,100,100,0.9)', border: 'rgba(255,100,100,0.6)', mantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namah', deity: 'Hanuman', donate: 'Red clothes and red lentils' },
        Sagittarius: { lord: 'Jupiter', gem: 'Yellow Sapphire (Pukhraj)', color: 'rgba(255,255,100,0.9)', border: 'rgba(255,255,100,0.6)', mantra: 'Om Gram Greem Groum Sah Gurave Namah', deity: 'Lord Vishnu', donate: 'Chana dal, turmeric, yellow clothes' },
        Capricorn: { lord: 'Saturn', gem: 'Blue Sapphire (Neelam)', color: 'rgba(100,150,255,0.9)', border: 'rgba(100,150,255,0.6)', mantra: 'Om Pram Preem Proum Sah Shanaischaraya Namah', deity: 'Lord Shiva/Bhairav', donate: 'Black sesame, mustard oil, black clothes' },
        Aquarius: { lord: 'Saturn', gem: 'Blue Sapphire (Neelam)', color: 'rgba(100,150,255,0.9)', border: 'rgba(100,150,255,0.6)', mantra: 'Om Pram Preem Proum Sah Shanaischaraya Namah', deity: 'Lord Shiva/Bhairav', donate: 'Iron items, black gram, serving the needy' },
        Pisces: { lord: 'Jupiter', gem: 'Yellow Sapphire (Pukhraj)', color: 'rgba(255,255,100,0.9)', border: 'rgba(255,255,100,0.6)', mantra: 'Om Gram Greem Groum Sah Gurave Namah', deity: 'Lord Vishnu', donate: 'Yellow sweets, books, and chana dal' }
    };

    const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

    // Find matching signs
    const lagnaData = SIGN_DATA[lagna] || SIGN_DATA["Aries"];
    const bhagyaIndex = (SIGNS.indexOf(lagna) + 8) % 12; // 9th House is index + 8
    const bhagyaSign = SIGNS[bhagyaIndex];
    const bhagyaData = SIGN_DATA[bhagyaSign];

    return (
        <div className="remedies-section">
            <div className="sec-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--k-w90)' }}>Prescriptive Remedies</h3>
                <div className="sub">Astrological guidance to balance your energy</div>
            </div>

            {/* Gemstones Recommendation */}
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--k-w80)', marginBottom: '12px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>💎</span> Gemstone Recommendations
                </h3>

                <div style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 'var(--k-r-sm)', borderLeft: `3px solid ${lagnaData.border}` }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'var(--k-w90)', marginBottom: '4px' }}>Life Stone (Lagna): <span style={{ color: lagnaData.color }}>{lagnaData.gem}</span></div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--k-w60)' }}>Enhances vitality, courage, and overcomes obstacles. Ruled by {lagnaData.lord}.</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 'var(--k-r-sm)', borderLeft: `3px solid ${bhagyaData.border}` }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'var(--k-w90)', marginBottom: '4px' }}>Lucky Stone (Bhagya): <span style={{ color: bhagyaData.color }}>{bhagyaData.gem}</span></div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--k-w60)' }}>Attracts wealth, wisdom, and auspiciousness. Ruled by {bhagyaData.lord}.</div>
                    </div>
                </div>
            </div>

            {/* Mantras */}
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--k-w80)', marginBottom: '12px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>📿</span> Powerful Mantras
                </h3>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: 'var(--k-r-sm)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--k-w40)', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>FOR {lagnaData.lord} (LAGNA RULER)</div>
                    <div style={{ fontFamily: 'var(--font-deco)', fontSize: '1rem', color: 'var(--k-w90)', marginBottom: '6px' }}>{lagnaData.mantra}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--k-w50)', fontStyle: 'italic' }}>Chant 108 times daily to seek blessings from {lagnaData.deity}.</div>
                </div>
            </div>

            {/* Donations / Fasting */}
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--k-w80)', marginBottom: '12px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🌾</span> Charity & Daan
                </h3>

                <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--k-r-sm)', borderLeft: '2px solid rgba(255,255,255,0.2)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--k-w60)', lineHeight: '1.5', margin: 0 }}>
                        <span style={{ color: 'var(--k-w90)' }}>Donate:</span> {lagnaData.donate} to harmonize planetary vibrations and attract positive karma.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Remedies;
