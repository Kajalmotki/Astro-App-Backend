import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthModal';
import { loadRazorpayButton, checkMembershipStatus } from '../services/razorpayService';

const MembershipModal = ({ isOpen, onClose }) => {
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
                    <h2 className="gold-text">Join AstroRevo Premium</h2>
                    <p className="membership-subtitle">Unlock Your Cosmic Potential</p>

                    <div className="membership-price">
                        <span className="price-amount">₹11</span>
                        <span className="price-period">Monthly Access</span>
                    </div>

                    <div className="membership-features">
                        <h3>Premium Benefits:</h3>
                        <ul>
                            <li>✨ Unlimited AI Astrology Consultations</li>
                            <li>🔮 Advanced Birth Chart Analysis</li>
                            <li>📊 Personalized AstroRevo Workflows</li>
                            <li>🎯 Priority Support</li>
                            <li>🌟 Exclusive Vedic Remedies</li>
                            <li>📈 Monthly Predictions & Insights</li>
                        </ul>
                    </div>

                    {/* Razorpay Payment Button Container */}
                    <div id="razorpay-button-container" style={{ marginTop: '20px' }}></div>

                    <p className="membership-note">
                        Optional - You can continue using AstroRevo for free
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MembershipModal;
