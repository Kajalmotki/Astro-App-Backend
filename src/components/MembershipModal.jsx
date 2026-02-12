import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthModal';
import { loadRazorpayButton, checkMembershipStatus, activateMembership } from '../services/razorpayService';

const MembershipModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            if (user) {
                const status = await checkMembershipStatus(user.uid);
                setIsPremium(status);
            }
            setLoading(false);
        };
        checkStatus();
    }, [user]);

    useEffect(() => {
        // Load Razorpay button when modal opens and user is not premium
        if (isOpen && !isPremium && !loading) {
            setTimeout(() => {
                loadRazorpayButton('razorpay-button-container');
            }, 100);
        }
    }, [isOpen, isPremium, loading]);

    if (!isOpen) return null;
    if (loading) return null;

    if (isPremium) {
        // User already has premium membership
        return (
            <div className="membership-modal-overlay" onClick={onClose}>
                <div className="membership-modal glass-card" onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose} className="auth-close">×</button>
                    <div className="membership-content">
                        <div className="premium-badge">✨ PREMIUM MEMBER ✨</div>
                        <h2 className="gold-text">You're Already Premium!</h2>
                        <p>Enjoy unlimited access to all AstroRevo features.</p>
                        {onSuccess && (
                            <button
                                className="cta-btn golden-highlight"
                                style={{ marginTop: '20px', width: '100%' }}
                                onClick={onSuccess}
                            >
                                Go to Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="membership-modal-overlay" onClick={onClose}>
            <div className="membership-modal glass-card" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="auth-close">×</button>

                <div className="membership-content">
                    <h2 className="gold-text">The AstroRevo Chart</h2>
                    <p className="membership-subtitle">Your Complete Life & Destiny Report</p>

                    <div className="membership-price">
                        <span className="price-amount">₹99</span>
                        <span className="price-period">One-Time Purchase</span>
                    </div>

                    <div className="membership-features">
                        <h3>Premium Benefits:</h3>
                        <ul>
                            <li>✨ Full Life Predictions (100+ Pages)</li>
                            <li>🔮 In-depth Carrier & Wealth Path</li>
                            <li>❤️ Detailed Relationship Compatibility</li>
                            <li>🌿 Health & Wellbeing Analysis</li>
                            <li>📅 5-Year Dasha Predictions</li>
                            <li>💎 Personalized Gemstone Recommendations</li>
                        </ul>
                    </div>

                    {/* Razorpay Payment Button Container */}
                    <div id="razorpay-button-container" style={{ marginTop: '20px' }}></div>

                    {import.meta.env.VITE_PAYMENT_TEST_MODE === 'true' && (
                        <button
                            className="cta-btn golden-highlight"
                            style={{ marginTop: '20px', width: '100%' }}
                            onClick={async () => {
                                const success = await activateMembership(user.uid);
                                if (success) {
                                    setIsPremium(true);
                                    if (onSuccess) onSuccess();
                                }
                            }}
                        >
                            Test: Activate Premium Directly
                        </button>
                    )}

                    <p className="membership-note">
                        Optional - You can continue using AstroRevo for free
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MembershipModal;
