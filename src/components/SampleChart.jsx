import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QuestionChart from './QuestionChart';
import BirthDetailsForm from './BirthDetailsForm';
import FullCustomerChart from './FullCustomerChart';
import { loadRazorpayButton } from '../services/razorpayService';

const PaymentButtonLoader = ({ containerId, onSuccess, data }) => {
    useEffect(() => {
        loadRazorpayButton(containerId);
        // We simulate success for now as we don't have a real merchant link for automated detection here
    }, [containerId]);
    return null;
};

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
                                className="cta-btn large glow-on-hover"
                                style={{ padding: '20px 50px', fontSize: '1.2rem' }}
                                onClick={() => setView('details')}
                            >
                                ✨ Create Your AstroRevo Chart ✨
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

                            <div id="razorpay-sample-container" className="razorpay-container" style={{ minHeight: '60px' }}></div>
                            <PaymentButtonLoader containerId="razorpay-sample-container" />

                            <div style={{ marginTop: '20px' }}>
                                <button className="sim-btn" onClick={handlePaymentSuccess}>
                                    (Dev: Simulate Payment)
                                </button>
                            </div>
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
