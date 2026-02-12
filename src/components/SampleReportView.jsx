import React from 'react';
import './SampleReportView.css';
import './mobile/MobilePremiumDashboard.css'; // Reusing premium styles

const SampleReportView = () => {
    // HARDCODED SAMPLE DATA - "Historic" Depth
    const sampleData = {
        profile: {
            name: "Rahul Sharma",
            dob: "14 August 1995",
            time: "10:30 AM",
            place: "New Delhi, India",
            ascendant: "Libra",
            moonSign: "Aquarius",
            nakshatra: "Shatabhisha"
        },
        planets: [
            { name: "Sun", sign: "Cancer", house: "10th", degree: "27° 15'", nak: "Ashlesha", dignity: "Friendly" },
            { name: "Moon", sign: "Aquarius", house: "5th", degree: "12° 40'", nak: "Shatabhisha", dignity: "Neutral" },
            { name: "Mars", sign: "Virgo", house: "12th", degree: "05° 22'", nak: "Uttara Phalguni", dignity: "Enemy" },
            { name: "Mercury", sign: "Leo", house: "11th", degree: "18° 10'", nak: "Purva Phalguni", dignity: "Friendly" },
            { name: "Jupiter", sign: "Scorpio", house: "2nd", degree: "02° 55'", nak: "Vishakha", dignity: "Friendly" },
            { name: "Venus", sign: "Leo", house: "11th", degree: "22° 15'", nak: "Purva Phalguni", dignity: "Enemy" },
            { name: "Saturn", sign: "Pisces", house: "6th", degree: "08° 30'", nak: "Uttara Bhadra", dignity: "Neutral" },
            { name: "Rahu", sign: "Libra", house: "1st", degree: "04° 15'", nak: "Chitra", dignity: "Neutral" },
            { name: "Ketu", sign: "Aries", house: "7th", degree: "04° 15'", nak: "Ashwini", dignity: "Neutral" }
        ],
        vargaCharts: [
            { code: 'D-1', name: 'Rashi', purpose: 'Root / Destiny', deity: 'Parameshwara', strength: 95 },
            { code: 'D-9', name: 'Navamsa', purpose: 'Marriage & Dharma', deity: 'Vishnu', strength: 88 },
            { code: 'D-10', name: 'Dasamsa', purpose: 'Career & Status', deity: 'Indra', strength: 92 },
            { code: 'D-2', name: 'Hora', purpose: 'Wealth', deity: 'Kubera', strength: 75 },
            { code: 'D-4', name: 'Chaturthamsa', purpose: 'Property', deity: 'Brahma', strength: 82 },
            { code: 'D-7', name: 'Saptamsa', purpose: 'Progeny', deity: 'Shiva', strength: 70 },
            { code: 'D-12', name: 'Dwadasamsa', purpose: 'Parents', deity: 'Ganesha', strength: 65 },
            { code: 'D-16', name: 'Shodashamsa', purpose: 'Vehicles', deity: 'Sukra', strength: 85 },
            { code: 'D-20', name: 'Vimsamsa', purpose: 'Spirituality', deity: 'Kali', strength: 90 },
            { code: 'D-24', name: 'Chaturvimsamsa', purpose: 'Knowledge', deity: 'Saraswati', strength: 88 },
            { code: 'D-30', name: 'Trimsamsa', purpose: 'Misfortune', deity: 'Yama', strength: 60 },
            { code: 'D-60', name: 'Shashtiamsa', purpose: 'Past Life', deity: 'Brahman', strength: 94 },
        ],
        predictions: [
            { title: "Career & Ambition", icon: "💼", text: "With Sun in the 10th House in Cancer, your career path is emotionally connected to leadership and public service. You possess a natural authority that is nurturing rather than domineering. The 10th lord Moon in the 5th house creates a powerful Raj Yoga, suggesting success through creative intelligence or speculation. Expect a major elevation in status around the age of 32." },
            { title: "Financial Prosperity", icon: "💰", text: "Jupiter in the 2nd House creates a strong Dhana Yoga. Your speech (Vaak) will be your greatest asset in accumulating wealth. However, Mars in the 12th house suggests expenses on foreign travel or medical issues. Investment in land (4th house connection) will yield high returns after 2028." },
            { title: "Marriage & Relationships", icon: "❤️", text: "Venus in Leo in the 11th house indicates a partner from a wealthy or influential background. However, Ketu in the 7th house brings some detachment or spirituality into the marriage. You need a partner who gives you space. Navamsa (D-9) strength confirms a stable, long-term union, likely after age 27." },
            { title: "Health & Vitality", icon: "🏥", text: "Saturn in the 6th house is excellent for fighting diseases and enemies. You have strong resistance. However, Libra Ascendant with Rahu can make you prone to allergies or kidney-related minor issues. Drink plenty of water and avoid excessive sugar." }
        ],
        dasha: [
            { name: "Jupiter Mahadasha", start: "2018", end: "2034", status: "Current", color: "#FFD700" },
            { name: "Saturn Mahadasha", start: "2034", end: "2053", status: "Upcoming", color: "#888" },
            { name: "Mercury Mahadasha", start: "2053", end: "2070", status: "Future", color: "#4FD1C5" }
        ]
    };

    return (
        <div className="sample-report-container">
            {/* BACKGROUND VIDEO */}
            <div className="sample-video-bg">
                <video autoPlay loop muted playsInline className="sample-video-element">
                    <source src="/videos/night_sky_timelapse.mp4" type="video/mp4" />
                </video>
                <div className="sample-video-overlay"></div>
            </div>

            {/* HERO SECTION */}
            <div className="sample-hero">
                <div className="sample-profile-badge">
                    <img src="https://i.pravatar.cc/300?img=11" alt="Profile" className="sample-avatar" />
                    <div className="sample-badge-icon">ॐ</div>
                </div>
                <h1 className="sample-name">{sampleData.profile.name}</h1>
                <p className="sample-details">
                    {sampleData.profile.dob} • {sampleData.profile.time} <br />
                    {sampleData.profile.place}
                </p>
                <div className="sample-tags">
                    <span className="sample-tag">{sampleData.profile.ascendant} Ascendant</span>
                    <span className="sample-tag">{sampleData.profile.moonSign} Moon</span>
                </div>
            </div>

            {/* CHART VISUALIZATION (Static Representation) */}
            <div className="sample-section">
                <h3 className="sample-section-title">✨ Rashi Chart (D-1)</h3>
                <div className="chart-visual-placeholder">
                    {/* Simplified South Indian Style Grid CSS Visual */}
                    <div className="si-grid">
                        <div className="si-box b1">Pisces<br />Saturn</div>
                        <div className="si-box b2">Aries<br />Ketu</div>
                        <div className="si-box b3">Taurus</div>
                        <div className="si-box b4">Gemini</div>
                        <div className="si-box b5">Aquarius<br />Moon</div>
                        <div className="si-box bCenter">
                            <span className="center-om">ॐ</span>
                            <span className="center-txt">Lagna<br />Libra</span>
                        </div>
                        <div className="si-box b6">Cancer<br />Sun</div>
                        <div className="si-box b7">Capricorn</div>
                        <div className="si-box b8">Leo<br />Mer, Ven</div>
                        <div className="si-box b9">Sagittarius</div>
                        <div className="si-box b10">Scorpio<br />Jup</div>
                        <div className="si-box b11">Libra<br />Rahu</div>
                    </div>
                </div>
            </div>

            {/* PLANETARY TABLE */}
            <div className="sample-section">
                <h3 className="sample-section-title">🌍 Planetary Details</h3>
                <div className="sample-transit-table">
                    {sampleData.planets.map((p, i) => (
                        <div key={i} className="st-row">
                            <div className="st-planet">
                                <span className="stp-name">{p.name}</span>
                                <span className="stp-deg">{p.degree}</span>
                            </div>
                            <div className="st-mid">
                                <span className="stp-sign">{p.sign}</span>
                                <span className="stp-house">{p.house} House</span>
                            </div>
                            <div className="st-end">
                                <span className="stp-nak">{p.nak}</span>
                                <span className={`stp-dignity ${p.dignity.toLowerCase()}`}>{p.dignity}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DETAILED PREDICTIONS */}
            <div className="sample-section">
                <h3 className="sample-section-title">🔮 Life Predictions</h3>
                <div className="sample-predictions-grid">
                    {sampleData.predictions.map((pred, i) => (
                        <div key={i} className="sp-card">
                            <div className="sp-icon">{pred.icon}</div>
                            <div className="sp-content">
                                <h4>{pred.title}</h4>
                                <p>{pred.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DASHA TIMELINE */}
            <div className="sample-section">
                <h3 className="sample-section-title">⏳ Vimshottari Dasha</h3>
                <div className="sample-dasha-timeline">
                    {sampleData.dasha.map((d, i) => (
                        <div key={i} className="sd-item" style={{ borderLeftColor: d.color }}>
                            <div className="sd-dot" style={{ background: d.color }}></div>
                            <div className="sd-info">
                                <span className="sd-period">{d.name}</span>
                                <span className="sd-date">{d.start} — {d.end}</span>
                            </div>
                            <span className="sd-status">{d.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* DEEP SHODASHVARGA */}
            <div className="sample-section">
                <h3 className="sample-section-title">🔢 Shodashvarga Strength</h3>
                <div className="mobile-varga-grid">
                    {sampleData.vargaCharts.map((v, i) => (
                        <div key={i} className="mobile-varga-item" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div className="mv-header">
                                <h4>{v.code} {v.name}</h4>
                                <span className="mv-score" style={{ color: '#ffd700' }}>{v.strength}%</span>
                            </div>
                            <p style={{ marginBottom: '5px' }}>{v.purpose}</p>
                            <p style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase' }}>Deity: <span style={{ color: '#fff' }}>{v.deity}</span></p>
                            <div className="mv-bar">
                                <div className="mv-fill" style={{ width: `${v.strength}%`, background: '#ffd700' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TOP 21 QUESTIONS SECTION (REPLACED COMPATIBILITY) */}
            <div className="sample-section">
                <h3 className="sample-section-title">✨ The 21 Vital Answers</h3>
                <p className="section-subtitle">Direct answers to the most critical questions asked to astrologers.</p>

                <div className="qa-grid-21">
                    {[
                        { q: "Do I have Pitru Dosh?", a: "No", status: "positive" },
                        { q: "Do I have Kaal Sarp Dosh?", a: "No", status: "positive" },
                        { q: "Do I have Manglik Dosh?", a: "Partial", status: "neutral" },
                        { q: "Which Gemstone for me?", a: "Blue Sapphire (Neelam)", status: "highlight" },
                        { q: "What weight (carat)?", a: "5.25 Ratti / 4.8 Carats", status: "neutral" },
                        { q: "Which metal to wear?", a: "Silver or White Gold", status: "neutral" },
                        { q: "My Lucky Color?", a: "Royal Blue & Black", status: "highlight" },
                        { q: "My Lucky Number?", a: "8 (Eight)", status: "highlight" },
                        { q: "When will my 'Good Time' start?", a: "After Oct 2026 (Saturn Transit)", status: "highlight" },
                        { q: "Is current Dasha good?", a: "Jupiter Dasha is Excellent", status: "positive" },
                        { q: "Business or Job?", a: "Business suits you best", status: "neutral" },
                        { q: "When will I get married?", a: "Forecast: Late 2027", status: "neutral" },
                        { q: "Is my partner faithful?", a: "Yes, Jupiter ensures loyalty", status: "positive" },
                        { q: "Will I settle abroad?", a: "Short travels indicated, not settlement", status: "neutral" },
                        { q: "Do I have Raj Yoga?", a: "Yes, Gajakesari Yoga present", status: "positive" },
                        { q: "Do I have Dhana Yoga?", a: "Strong wealth combination in 2nd House", status: "positive" },
                        { q: "How is my Health?", a: "Watch digestion, otherwise robust", status: "neutral" },
                        { q: "Will I have children?", a: "Yes, clear promise of progeny", status: "positive" },
                        { q: "Should I buy property?", a: "Wait until 2028 for best deal", status: "neutral" },
                        { q: "Do I have hidden enemies?", a: "Saturn in 6th suppresses enemies", status: "positive" },
                        { q: "What is my Life Purpose?", a: "Service to humanity & Teaching", status: "highlight" },
                    ].map((item, i) => (
                        <div key={i} className={`qa-card ${item.status}`}>
                            <div className="qa-q">{i + 1}. {item.q}</div>
                            <div className="qa-a">{item.a}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sample-footer">
                <p>This is a sample of the premium insights you unlock with AstroRevo.</p>
                <button className="cta-btn pulse-glow">Get Your Full Report Now</button>
            </div>
        </div>
    );
};

export default SampleReportView;
