import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageCircle, FileText, Heart, Sun } from 'lucide-react';
import './MobileHome.css';

const MobileHome = () => {
    const navigate = useNavigate();
    const userName = "Seeker"; // TODO: Get from auth context

    return (
        <div className="mobile-home-container">
            {/* Header Section */}
            <header className="mobile-header">
                <div className="greeting-container">
                    <h1 className="greeting-text">Namaste, {userName}</h1>
                    <p className="greeting-sub">The stars align for you today.</p>
                </div>
                <div className="header-actions">
                    {/* Notification icon could go here */}
                </div>
            </header>

            {/* Hero / Daily Insight Card */}
            <section className="daily-insight-card">
                <div className="insight-content">
                    <div className="insight-icon-wrapper">
                        <Sun size={32} color="#FFD700" />
                    </div>
                    <div className="insight-text">
                        <h3>Daily Cosmic Pulse</h3>
                        <p>Moon in Taurus suggests grounding energy today. Focus on stability.</p>
                    </div>
                </div>
                <button className="insight-action-btn">Read More</button>
            </section>

            {/* Quick Actions Grid */}
            <section className="quick-actions-grid">
                <div className="action-card" onClick={() => navigate('/mobile/chat')}>
                    <div className="action-icon chat-icon">
                        <MessageCircle size={28} />
                    </div>
                    <span>Ask AI</span>
                </div>

                <div className="action-card" onClick={() => navigate('/mobile/full-kundli')}>
                    <div className="action-icon kundli-icon">
                        <Star size={28} />
                    </div>
                    <span>Kundli</span>
                </div>

                <div className="action-card" onClick={() => navigate('/mobile/matchmaking')}>
                    <div className="action-icon match-icon">
                        <Heart size={28} />
                    </div>
                    <span>Match</span>
                </div>

                <div className="action-card" onClick={() => navigate('/mobile/reports')}>
                    <div className="action-icon reports-icon">
                        <FileText size={28} />
                    </div>
                    <span>Reports</span>
                </div>
            </section>

            {/* Trending / Services Preview */}
            <section className="section-header">
                <h2>Explore Services</h2>
            </section>

            <div className="services-scroll-container">
                {/* Placeholder for horizontally scrolling services */}
                <div className="service-chip">Career Analysis</div>
                <div className="service-chip">Relationship Guide</div>
                <div className="service-chip">Gemstone Suggestion</div>
                <div className="service-chip">Pooja Services</div>
            </div>

        </div>
    );
};

export default MobileHome;
