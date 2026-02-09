import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BirthDetailsForm from './BirthDetailsForm';
import FullCustomerChart from './FullCustomerChart';
import { Star, ChevronLeft, Lock } from 'lucide-react';
import './mobile/MobileLayout.css'; // Use shared mobile styles

const SampleChart = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('intro'); // intro, form, payment, paid
    const [userInfo, setUserInfo] = useState(null);

    const handleBirthSubmit = (data) => {
        setUserInfo({
            name: data.name,
            place: data.place,
            date: `${data.day}/${data.month}/${data.year}`,
            time: `${data.hour}:${data.min}:${data.sec}`
        });
        setView('payment');
    };

    const handlePaymentSuccess = () => {
        setView('paid');
    };

    return (
        <div className="mobile-page-container bg-cosmic">
            {/* Custom Header for this flow */}
            <header className="page-header-simple">
                <button onClick={() => view === 'intro' ? navigate('/mobile/reports') : setView('intro')} className="back-btn">
                    <ChevronLeft size={24} />
                </button>
                <span className="header-title">AstroRevo Chart</span>
            </header>

            <main className="content-area">
                {view === 'intro' && (
                    <div className="intro-view">
                        <div className="video-hero">
                            <video className="hero-video" autoPlay loop muted playsInline>
                                <source src="/videos/ocean_waves.mp4" type="video/mp4" />
                            </video>
                            <div className="hero-overlay"></div>
                            <div className="hero-content">
                                <Star size={48} className="hero-icon pulse-gold" />
                                <h1>Your Cosmic Blueprint</h1>
                                <p>Discover the celestial map created at your exact moment of birth.</p>
                                <button className="cta-btn-premium" onClick={() => setView('form')}>
                                    Create My Chart
                                </button>
                            </div>
                        </div>

                        <div className="features-grid">
                            <div className="feature-item">
                                <span className="feature-icon">✨</span>
                                <div>
                                    <h4>Precise Calculations</h4>
                                    <p>Vedic algorithms for exact planetary positions.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🔮</span>
                                <div>
                                    <h4>Deep Insight</h4>
                                    <p>Understand your nature, destiny, and path.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'form' && (
                    <div className="form-view-container">
                        <h2 className="step-title">Enter Birth Details</h2>
                        <p className="step-sub">Accuracy ensures precision.</p>
                        <div className="form-card glass-panel">
                            <BirthDetailsForm onSubmit={handleBirthSubmit} title="" submitLabel="Generate Chart" />
                        </div>
                    </div>
                )}

                {view === 'payment' && (
                    <div className="payment-view-container">
                        <div className="payment-card glass-panel">
                            <Lock size={32} className="lock-icon" />
                            <h2>Unlock Full Analysis</h2>
                            <p>Get detailed D1 Lagna, D9 Navamsa, and Planetary Periods for <strong>{userInfo?.name}</strong>.</p>

                            <div className="price-display">
                                <span className="currency">₹</span>
                                <span className="amount">99</span>
                            </div>

                            <button className="pay-btn" onClick={handlePaymentSuccess}>
                                Pay Securely
                            </button>
                            <p className="secure-note">Payments secured by Razorpay</p>
                        </div>
                    </div>
                )}

                {view === 'paid' && (
                    <div className="result-view-container">
                        <FullCustomerChart userInfo={userInfo} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default SampleChart;
