import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QuestionChart from './QuestionChart';
import BirthDetailsForm from './BirthDetailsForm';
import FullCustomerChart from './FullCustomerChart';

const SampleChart = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('sample'); // 'sample', 'details', 'payment', 'paid'
    const [userInfo, setUserInfo] = useState(null);

    const handleQuestionSelect = (question) => {
        navigate('/chat', { state: { initialQuestion: question } });
    };

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
        <div className="sample-page bg-deep">
            <header className="header glass">
                <Link to="/" className="logo gold-text">AstroRevo</Link>
                <nav className="nav">
                    <Link to="/">Back to Home</Link>
                </nav>
            </header>

            <main className="sample-content" style={{ minHeight: '100vh', paddingBottom: '100px' }}>
                {view === 'sample' && (
                    <>
                        <div className="sample-intro" style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '100px' }}>
                            <h1 className="gold-text" style={{ fontSize: '3.5rem' }}>The AstroRevo Chart (Sample)</h1>
                            <p className="text-dim" style={{ fontSize: '1.2rem' }}>A diagnostic preview of how our AI Engine maps your destiny through cosmic pathways.</p>
                        </div>
                        <div className="sample-chart-matrix">
                            <QuestionChart onSelect={handleQuestionSelect} />
                        </div>
                        <div className="sample-cta-footer" style={{ marginTop: '60px', textAlign: 'center' }}>
                            <button
                                className="green-shine-btn"
                                onClick={() => setView('details')}
                            >
                                <video className="btn-video-bg" autoPlay loop muted playsInline>
                                    <source src="/videos/ocean_waves.mp4" type="video/mp4" />
                                </video>
                                <span style={{ position: 'relative', zIndex: 5 }}>✨ Create Your AstroRevo Chart ✨</span>
                            </button>
                        </div>
                    </>
                )}

                {view === 'details' && (
                    <div className="details-form-view" style={{ paddingTop: '120px', maxWidth: '600px', margin: '0 auto' }}>
                        <BirthDetailsForm onSubmit={handleBirthSubmit} />
                    </div>
                )}

                {view === 'payment' && (
                    <div className="payment-view" style={{ paddingTop: '150px', textAlign: 'center' }}>
                        <div className="payment-card glass-card" style={{ maxWidth: '400px', margin: '0 auto', padding: '40px' }}>
                            <h2 className="gold-text">Initialize Your Chart</h2>
                            <p className="text-dim" style={{ margin: '20px 0' }}>Unlock the full 52-pathway dashboard for <strong>{userInfo?.name}</strong>.</p>
                            <div className="price-tag" style={{ fontSize: '3rem', fontWeight: '800', color: '#FFD700', marginBottom: '30px' }}>₹99</div>

                            <button
                                className="cta-btn large pulse-glow"
                                style={{ width: '100%', padding: '16px', fontSize: '1.2rem', justifyContent: 'center', background: '#FFD700', color: '#000' }}
                                onClick={() => {
                                    const options = {
                                        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YourTestKeyHere",
                                        amount: 9900, // Amount in paise
                                        currency: "INR",
                                        name: "AstroRevo",
                                        description: "AstroRevo Chart Unlock",
                                        image: "/vite.svg",
                                        handler: function (response) {
                                            // Handle success
                                            handlePaymentSuccess();
                                        },
                                        prefill: {
                                            name: userInfo?.name || "",
                                            email: "user@example.com",
                                            contact: "9999999999"
                                        },
                                        theme: {
                                            color: "#FFD700"
                                        }
                                    };
                                    const rzp1 = new window.Razorpay(options);
                                    rzp1.open();
                                }}
                            >
                                Pay ₹99 to Unlock
                            </button>
                            <p style={{ marginTop: '15px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Secure payment via Razorpay</p>
                        </div>
                    </div>
                )}

                {view === 'paid' && (
                    <div className="full-chart-view" style={{ paddingTop: '100px' }}>
                        <FullCustomerChart userInfo={userInfo} />
                    </div>
                )}
            </main>

            <footer className="footer">
                <p>&copy; 2026 AstroRevo. Precise. Instant. Vedic.</p>
            </footer>
        </div>
    );
};

export default SampleChart;
