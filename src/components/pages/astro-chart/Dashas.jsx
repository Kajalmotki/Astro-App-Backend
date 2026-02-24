import React from 'react';

const Dashas = ({ chartData }) => {
    const dashaString = chartData?.math?.dashaString;

    if (!dashaString) {
        return <div style={{ color: 'var(--k-w40)', padding: '20px', textAlign: 'center' }}>Dasha timeline unavailable.</div>;
    }

    return (
        <div className="dashas-section">
            <div className="sec-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--k-w90)' }}>Vimshottari Dasha</h3>
                <div className="sub">Your 120-year planetary life cycles</div>
            </div>

            <div className="glass-panel" style={{ padding: '20px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--k-r-lg)', backdropFilter: 'blur(12px)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--k-w100)', marginBottom: '12px', letterSpacing: '0.05em' }}>Current Active Periods</h4>
                <div style={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: 'var(--k-w80)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    {dashaString}
                </div>
            </div>
        </div>
    );
};

export default Dashas;
