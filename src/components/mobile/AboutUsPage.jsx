import React from 'react';
import './AboutUsPage.css';

const AboutUsPage = () => {
    return (
        <div className="about-us-container">
            <div className="about-header">
                <h1 className="about-title">AstroRevo</h1>
                <p className="about-subtitle">Navigating Destiny with Precision & Purpose</p>
            </div>

            {/* Vision Section */}
            <div className="about-section-card">
                <h2 className="about-section-title">
                    <span className="about-section-icon">🔭</span>
                    Our Vision
                </h2>
                <p className="about-section-text">
                    To seamlessly bridge the ancient, mathematically perfect science of Vedic Astrology with
                    next-generation artificial intelligence, making profound spiritual insights accessible,
                    actionable, and deeply personalized for everyone, anywhere in the universe.
                </p>
            </div>

            {/* Mission Section */}
            <div className="about-section-card">
                <h2 className="about-section-title">
                    <span className="about-section-icon">🎯</span>
                    Our Mission
                </h2>
                <p className="about-section-text">
                    AstroRevo is committed to stripping away the generic horoscopes and replacing them with
                    deterministic, ephemeris-backed calculations. We aim to provide humans not just with their
                    cosmic blueprint, but with the precise remedies, psychological frameworks, and daily planetary
                    trackers needed to master their own karma. From accurate Vimshottari period tracking to
                    transformative 21-Day Yoga Plans tailored to their unique Lagna.
                </p>
            </div>

            {/* Founder Section */}
            <div className="about-section-card founder-card">
                <div className="founder-profile">
                    <div className="founder-avatar-placeholder">S</div>
                    <div>
                        <h3 className="founder-name">Siddharth Vadhel</h3>
                        <p className="founder-role">Creator & Founder</p>
                    </div>
                </div>

                <p className="about-section-text">
                    Siddharth envisioned AstroRevo as more than just an app; it is a holistic sanctuary for the modern seeker.
                    Realizing that true astrology requires flawless celestial mechanics, he engineered a platform that doesn't just
                    guess—it calculates.
                </p>

                <blockquote className="founder-quote">
                    "The stars do not force our hand; they illuminate the board. True enlightenment comes when we stop
                    reacting to our fate, and begin orchestrating it. AstroRevo was built to give you the conductor's baton."
                </blockquote>

                <div className="founder-signature">
                    — Siddharth
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b', fontSize: '0.8rem' }}>
                <p>AstroRevo © 2026. All rights reserved.</p>
                <p>Calculations powered by Swiss Ephemeris & Local AI Engine.</p>
            </div>
        </div>
    );
};

export default AboutUsPage;
