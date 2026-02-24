import React from 'react';

const Overview = ({ userData }) => {
    return (
        <div className="overview-section">
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--k-w80)', marginBottom: '10px', letterSpacing: '0.1em' }}>Astrological Profile</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--k-w60)', lineHeight: '1.6' }}>
                    Based on your birth at {userData?.place}, you possess a strong, independent nature. Your Lagna signifies leadership and resilience, making you capable of overcoming significant obstacles. Intuitive and emotionally profound, you are highly attuned to the feelings of those around you.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--k-w80)', marginBottom: '10px', letterSpacing: '0.1em' }}>Career & Wealth</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--k-w60)', lineHeight: '1.6' }}>
                    The 10th house alignments suggest success in fields requiring strategic thinking and management. While initial phases of your career may present challenges, the mid-30s bring substantial stabilization and wealth accumulation through enduring investments.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--k-w80)', marginBottom: '10px', letterSpacing: '0.1em' }}>Love & Relationships</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--k-w60)', lineHeight: '1.6' }}>
                    You seek depth and authenticity in partnerships. The influence on the 7th house indicates a highly supportive spouse, though minor communication gaps should be managed with patience during early stages of the relationship.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--k-w80)', marginBottom: '10px', letterSpacing: '0.1em' }}>Health Insights</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--k-w60)', lineHeight: '1.6' }}>
                    Generally robust health, but the 6th house placements advise caution against stress-induced digestive issues. Incorporating regular meditation and a balanced diet is strongly recommended for sustained vitality.
                </p>
            </div>
        </div>
    );
};

export default Overview;
