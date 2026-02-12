import React, { useState } from 'react';

const questions = [
    { id: 1, category: 'Marriage', icon: '💍', text: 'When will I get married?' },
    { id: 2, category: 'Marriage', icon: '💑', text: 'Will my marriage be happy or troubled?' },
    { id: 3, category: 'Career', icon: '💼', text: 'When will I get a job?' },
    { id: 4, category: 'Career', icon: '📈', text: 'Will I get a promotion or growth?' },
    { id: 5, category: 'Career', icon: '🎯', text: 'Which career suits me best?' },
    { id: 6, category: 'Business', icon: '🚀', text: 'Will I be successful in business?' },
    { id: 7, category: 'Money', icon: '💰', text: 'When will my financial condition improve?' },
    { id: 8, category: 'Travel', icon: '✈️', text: 'Will I go abroad or settle overseas?' },
    { id: 9, category: 'Life', icon: '🔄', text: 'Why am I facing repeated failures?' },
    { id: 10, category: 'Dosha', icon: '⚠️', text: 'Is there any Dosha in my chart?' },
    { id: 11, category: 'Planets', icon: '🪐', text: 'Am I going through a bad planetary period?' },
    { id: 12, category: 'Life', icon: '🌅', text: 'When will my problems end?' },
    { id: 13, category: 'Children', icon: '👶', text: 'Will I have children?' },
    { id: 14, category: 'Marriage', icon: '⏰', text: 'Why is marriage getting delayed?' },
    { id: 15, category: 'Love', icon: '❤️', text: 'Is my partner loyal?' },
    { id: 16, category: 'Property', icon: '🏠', text: 'Will there be property or house gain?' },
    { id: 17, category: 'Health', icon: '🏥', text: 'Is my health safe in future?' },
    { id: 18, category: 'Luck', icon: '🍀', text: 'Why is my luck not supporting me?' },
    { id: 19, category: 'Legal', icon: '⚖️', text: 'Will legal or court issues resolve?' },
    { id: 20, category: 'Energy', icon: '🛡️', text: 'Is someone doing negative energy on me?' },
    { id: 21, category: 'Remedy', icon: '✨', text: 'What remedies should I do?' },
    { id: 22, category: 'Career', icon: '🔀', text: 'Should I change my job or stay?' },
    { id: 23, category: 'Business', icon: '💡', text: 'Should I start a startup or side business?' },
    { id: 24, category: 'Work', icon: '💻', text: 'Is freelancing or remote work good for me?' },
    { id: 25, category: 'Career', icon: '👔', text: 'Is this company or boss good for my future?' },
    { id: 26, category: 'Travel', icon: '🌍', text: 'Should I move to another country now?' },
    { id: 27, category: 'Digital', icon: '📱', text: 'Will I succeed in social media or online work?' },
    { id: 28, category: 'Finance', icon: '📊', text: 'Is crypto / stock market safe for me?' },
    { id: 29, category: 'Career', icon: '⏸️', text: 'Should I take a career break?' },
    { id: 30, category: 'Love', icon: '💕', text: 'Is love marriage better for me than arranged?' },
    { id: 31, category: 'Relationship', icon: '🔗', text: 'Is my relationship karmic or temporary?' },
    { id: 32, category: 'Marriage', icon: '💔', text: 'Will I remarry or have a second relationship?' },
    { id: 33, category: 'Marriage', icon: '⚡', text: 'Is divorce indicated in my chart?' },
    { id: 34, category: 'Relationship', icon: '🏡', text: 'Is live-in relationship suitable for me?' },
    { id: 35, category: 'Property', icon: '🏘️', text: 'When is the right time to buy a house?' },
    { id: 36, category: 'Finance', icon: '💎', text: 'Should I invest or wait?' },
    { id: 37, category: 'Life', icon: '🚧', text: 'Why do I feel stuck despite qualifications?' },
    { id: 38, category: 'Mental', icon: '🧠', text: 'Is my mental stress shown in my chart?' },
    { id: 39, category: 'Location', icon: '📍', text: 'Should I shift my city or location?' },
    { id: 40, category: 'Career', icon: '👑', text: 'Is my chart good for leadership or authority?' },
    { id: 41, category: 'Money', icon: '💸', text: 'Will I regain lost money?' },
    { id: 42, category: 'Life', icon: '🎲', text: 'Is this year safe for major decisions?' },
    { id: 43, category: 'Dosha', icon: '👻', text: 'Do I have Pitru Dosha?' },
    { id: 44, category: 'Dosha', icon: '🐍', text: 'Is Kaal Sarp Dosha affecting my life?' },
    { id: 45, category: 'Transit', icon: '🪐', text: 'Is Sade Sati good or bad for me?' },
    { id: 46, category: 'Remedy', icon: '💍', text: 'Which gemstone should I wear?' },
    { id: 47, category: 'Remedy', icon: '🎨', text: 'Which color is lucky for me?' },
    { id: 48, category: 'Remedy', icon: '🔢', text: 'Which number is lucky for me?' },
    { id: 49, category: 'Dasha', icon: '⏳', text: 'Is my Dasha favorable right now?' },
    { id: 50, category: 'Yoga', icon: '👑', text: 'Is my Raj Yoga active or blocked?' },
    { id: 51, category: 'Remedy', icon: '✅', text: 'Are remedies actually working for me?' },
    { id: 52, category: 'Planets', icon: '🌟', text: 'Which planet is causing maximum trouble?' }
];

const FullCustomerChart = ({ userInfo = {} }) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const handleUnlock = () => {
        setIsUnlocked(true);
        // Delay showing content slightly to allow button fade out (if needed) or just strictly swap
        setTimeout(() => setShowContent(true), 600);
    };

    return (
        <div className="full-customer-chart-container">
            {/* UNLOCK OVERLAY */}
            {!isUnlocked && (
                <div className="unlock-overlay-container">
                    <button className="cta-btn large glow-on-hover scale-pulse" onClick={handleUnlock}>
                        UNLOCK
                    </button>
                    <p className="unlock-subtext">Tap to Reveal Your Cosmic Blueprint</p>
                </div>
            )}

            {/* CHART CONTENT - Fades in */}
            <div className={`chart-content-wrapper ${showContent ? 'visible' : 'hidden'}`}>
                <div className="customer-header glass-card">
                    <div className="header-flex">
                        <div className="profile-badge pulse-border">
                            <span className="om-logo">ॐ</span>
                        </div>
                        <div className="customer-info">
                            <h2 className="gold-text">Personalized AstroRevo Chart</h2>
                            <p className="text-dim">Generated for: <span className="highlight-text">{userInfo?.name || 'Valued Seeker'}</span></p>
                            <p className="birth-summary">Birth Data: {userInfo?.date} | {userInfo?.time} | {userInfo?.place}</p>
                        </div>
                        <div className="engine-badge">
                            <span className="badge-text">PREMIUM ENGINE ACTIVE</span>
                        </div>
                    </div>
                </div>

                <div className="predictions-container">
                    {/* 1. General Overview */}
                    <div className="prediction-card glass-card">
                        <div className="card-header-gold">
                            <h3>General Overview</h3>
                            <div className="decorative-line"></div>
                        </div>
                        <p className="prediction-text">
                            You are a soul driven by <strong className="highlight-text">deep purpose and intuition</strong>. The planetary alignment at your birth suggests a life path focused on uncovering hidden truths and spiritual growth. Your <strong className="highlight-text">Sun in Leo</strong> gives you natural leadership qualities, while <strong className="highlight-text">Moon in Pisces</strong> bestows immense empathy. This year marks a significant transformation phase where old patterns will dissolve to make way for new opportunities.
                        </p>
                    </div>

                    {/* 2. Career & Finance */}
                    <div className="prediction-card glass-card">
                        <div className="card-header-gold">
                            <h3>Career & Finance</h3>
                            <div className="decorative-line"></div>
                        </div>
                        <p className="prediction-text">
                            A powerful <strong className="highlight-text">Dhana Yoga</strong> is forming in your chart, indicating potential for wealth accumulation through creative or intellectual pursuits. Mars in the 10th house fuels your ambition, but you must avoid impulsive decisions. Success is indicated in fields related to <strong className="highlight-text">technology, advisory roles, or creative arts</strong>. Financial stability strengthens post-October.
                        </p>
                    </div>

                    {/* 3. Love & Relationships */}
                    <div className="prediction-card glass-card">
                        <div className="card-header-gold">
                            <h3>Love & Relationships</h3>
                            <div className="decorative-line"></div>
                        </div>
                        <p className="prediction-text">
                            Venus gracing your 7th house suggests a partner who is not just a lover but a <strong className="highlight-text">soul companion</strong>. For singles, a meaningful connection is likely around mid-year. If committed, focus on communication to deepen your bond. Your aura naturally attracts harmony, but ensure you set healthy boundaries to protect your emotional well-being.
                        </p>
                    </div>

                    {/* 4. Health & Yoga Remedies */}
                    <div className="prediction-card glass-card yoga-section">
                        <div className="card-header-gold">
                            <h3>Health & Yoga Remedies</h3>
                            <div className="decorative-line"></div>
                        </div>
                        <p className="prediction-text">
                            Your energy centers (Chakras) show a need for grounding. The <strong className="highlight-text">Root Chakra</strong> requires attention to enhance stability and reduce anxiety.
                        </p>

                        {/* Yoga Image Placeholder */}
                        <div className="yoga-image-placeholder">
                            <span className="placeholder-text">Yoga Asana Visualization</span>
                        </div>

                        <p className="prediction-text" style={{ marginTop: '15px' }}>
                            <strong>Recommended Asana:</strong> Vrikshasana (Tree Pose) for balance and focus. Practice daily for 10 minutes to align your solar energy.
                        </p>
                    </div>
                </div>
            </div>
            {/* Removed old footer button as it's replaced by the initial unlock flow */}
        </div>
    );
};

export default FullCustomerChart;
