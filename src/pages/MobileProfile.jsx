import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Settings, ChevronRight, Star,
    LogOut, CreditCard, FileText,
    History, MessageSquare, HelpCircle, Globe, ShieldCheck, Music
} from 'lucide-react';
import { useAuth } from '../components/AuthModal';
import './MobileProfile.css?v=2'; // Force reload

import { useLanguage } from '../contexts/LanguageContext';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { processPayment } from '../services/razorpayService';
import { Wallet, X, Sparkles, Gem, Map } from 'lucide-react'; // Added icons for store
import '../pages/ChatPage.css'; // Reusing ChatPage styles for Wallet Modal

const MobileProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { language, getLanguageName, t } = useLanguage();
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [credits, setCredits] = useState(0);

    // Fetch Wallet Data
    React.useEffect(() => {
        const fetchWallet = async () => {
            if (user?.uid) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        setCredits(data.wallet?.credits || 0);
                    }
                } catch (err) {
                    console.error("Error loading wallet:", err);
                }
            }
        };
        fetchWallet();
    }, [user]);

    const handlePayment = async (planType, amount, description) => {
        try {
            const response = await processPayment(amount, description);
            if (response.razorpay_payment_id) {
                const userRef = doc(db, 'users', user.uid);
                const updates = { 'wallet.updatedAt': new Date().toISOString() };

                // Handle Fulfilment
                if (planType === 'CREDIT_5') updates['wallet.credits'] = increment(5);
                if (planType === 'CREDIT_10') updates['wallet.credits'] = increment(10);
                if (planType === 'CREDIT_20') updates['wallet.credits'] = increment(20);

                if (planType === 'CHART') updates['purchases.chart'] = true;

                if (planType === 'SUB_TRACKER') {
                    const nextYear = new Date();
                    nextYear.setFullYear(nextYear.getFullYear() + 1);
                    updates['subscription.trackers'] = { expiry: nextYear.toISOString() };
                }

                if (planType === 'BCA') updates['purchases.bca'] = true;

                if (planType === 'BUNDLE') {
                    updates['wallet.credits'] = increment(20);
                    updates['purchases.chart'] = true;
                    updates['purchases.bca'] = true;
                    const nextYear = new Date();
                    nextYear.setFullYear(nextYear.getFullYear() + 1);
                    updates['subscription.trackers'] = { expiry: nextYear.toISOString() };
                }

                await setDoc(userRef, updates, { merge: true });

                // Update local credit state if credits were added
                if (planType.includes('CREDIT') || planType === 'BUNDLE') {
                    const creditsToAdd = planType === 'BUNDLE' ? 20 : parseInt(planType.split('_')[1]);
                    setCredits(prev => prev + creditsToAdd);
                }

                setShowWalletModal(false);
                alert(`Payment successful! ${description} activated.`);
            }
        } catch (error) {
            console.error("Payment failed", error);
            alert("Payment failed. Please try again.");
        }
    };

    // Helper for old call
    const handleAddCredits = (amount, creditsToAdd, desc) => handlePayment(`CREDIT_${creditsToAdd}`, amount, desc);

    // Grouped Menu Structure
    const menuGroups = [
        {
            title: t("My Activity"),
            items: [
                { icon: <FileText size={20} />, label: t('My Reports'), sub: t('Chart Analysis & Predictions'), action: () => navigate('/mobile/reports') },
                { icon: <History size={20} />, label: t('Order History'), sub: t('Past Consultations & Purchases'), action: () => navigate('/mobile/order-history') },
                { icon: <MessageSquare size={20} />, label: t('Chat History'), sub: t('Conversations with Astrologers'), action: () => navigate('/mobile/chat-history') },
            ]
        },
        {
            title: t("App Settings"),
            items: [
                { icon: <Music size={20} />, label: t('Ambience & Music'), sub: t('Om, Rain, Cosmic Sounds'), action: () => navigate('/mobile/ambience') },
                { icon: <Globe size={20} />, label: t('Language'), sub: getLanguageName(language), action: () => navigate('/mobile/settings/language') },
                { icon: <ShieldCheck size={20} />, label: t('Privacy & Security'), sub: t('Manage your data'), action: () => navigate('/mobile/settings/privacy') },
                { icon: <HelpCircle size={20} />, label: t('Help & Support'), sub: t('FAQs & Contact Us'), action: () => navigate('/mobile/help-support') },
            ]
        }
    ];

    return (
        <div className="mobile-profile-container">
            {/* Premium Header */}
            <header className="profile-header">
                <div className="profile-avatar-container">
                    <div className="profile-avatar">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" />
                        ) : (
                            <User size={32} />
                        )}
                    </div>
                    <div className="avatar-ring"></div>
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">{user?.displayName || 'Cosmic Seeker'}</h2>
                    <span className="profile-badge">
                        <Star size={12} fill="black" /> {t('Premium Member')}
                    </span>
                    <p className="profile-membership-expiry">{t('Valid until')}: Dec 31, 2026</p>
                </div>
            </header>

            <div className="profile-content-scroll">
                {/* Wallet / Credits Card - High Priority for Business */}
                <section className="wallet-card">
                    <div className="wallet-info">
                        <span className="wallet-label">{t('Wallet Balance')}</span>
                        <h3 className="wallet-amount">{credits} Credits</h3>
                        <p className="wallet-sub">{t('Use for calls & chats')}</p>
                    </div>
                    <button className="add-money-btn" onClick={() => setShowWalletModal(true)}>
                        <CreditCard size={16} /> {t('Add Money')}
                    </button>
                </section>

                {/* Menu Groups */}
                {menuGroups.map((group, groupIdx) => (
                    <section key={groupIdx} className="menu-group">
                        <h3 className="group-title">{group.title}</h3>
                        <div className="menu-list">
                            {group.items.map((item, idx) => (
                                <div key={idx} className="menu-item" onClick={item.action}>
                                    <div className="menu-icon-box">{item.icon}</div>
                                    <div className="menu-text">
                                        <span className="menu-label">{item.label}</span>
                                        <span className="menu-sub">{item.sub}</span>
                                    </div>
                                    <ChevronRight size={18} className="menu-arrow" />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Settings & Logout */}
                <section className="menu-group">
                    <div className="menu-list">
                        <div className="menu-item" onClick={() => { }}>
                            <div className="menu-icon-box logout-icon"><LogOut size={20} /></div>
                            <div className="menu-text">
                                <span className="menu-label logout-text">{t('Log Out')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Version Info */}
                <footer className="profile-footer">
                    <p>AstroRevo v1.0.0</p>
                    <p className="footer-links">Terms • Privacy Policy</p>
                </footer>
            </div>

            {/* Bottom spacer for nav bar */}
            <div style={{ height: '100px' }}></div>

            {showWalletModal && (
                <div className="wallet-modal-overlay" style={{ zIndex: 9999 }}>
                    <div className="wallet-modal glass-card">
                        <button className="close-modal-btn" onClick={() => setShowWalletModal(false)}>
                            <X size={20} />
                        </button>
                        <h2 className="gold-text">Cosmic Credits</h2>

                        <div className="wallet-balance-section">
                            <span className="label">Your Balance</span>
                            <div className="balance-display">
                                <Wallet size={32} color="#ffd700" />
                                <span className="amount">{credits} Questions</span>
                            </div>
                        </div>

                        <div className="credit-packages">
                            {[
                                { id: 'CREDIT_5', credits: 5, price: 199, label: 'Standard Pack', tag: 'Starter' },
                                { id: 'CREDIT_10', credits: 10, price: 399, label: 'Premium Pack', tag: 'Recommended' },
                                { id: 'CREDIT_20', credits: 20, price: 699, label: 'Cosmic Value', tag: 'Best Value' }
                            ].map((pkg, idx) => (
                                <div key={idx} className="package-card active">
                                    <div className="package-header">
                                        <h3>{pkg.label}</h3>
                                        {pkg.tag && <span className="tag">{pkg.tag}</span>}
                                    </div>
                                    <div className="package-details">
                                        <p className="questions">{pkg.credits} Questions</p>
                                        <p className="price">₹{pkg.price}</p>
                                    </div>
                                    <button
                                        className="buy-btn"
                                        onClick={() => handleAddCredits(pkg.price, pkg.credits, `Purchase ${pkg.credits} Question Credits`)}
                                    >
                                        Recharge Now
                                    </button>
                                </div>
                            ))}

                            {/* PREMIUM STORE SECTION in Modal */}
                            <div className="store-separator" style={{ margin: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>
                            <h3 className="gold-text" style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Premium Upgrades</h3>

                            {/* Chart */}
                            <div className="package-card">
                                <div className="package-header">
                                    <h3>AstroRevo Chart</h3>
                                    <span className="tag" style={{ background: '#9C27B0', color: 'white' }}>Lifetime</span>
                                </div>
                                <div className="package-details">
                                    <p className="questions" style={{ fontSize: '1rem' }}>Full D1 Chart & Analysis</p>
                                    <p className="price">₹99</p>
                                </div>
                                <button className="buy-btn" onClick={() => handlePayment('CHART', 99, 'AstroRevo Premium Chart')}>Buy Chart</button>
                            </div>

                            {/* Subscription */}
                            <div className="package-card">
                                <div className="package-header">
                                    <h3>Tracker Access</h3>
                                    <span className="tag" style={{ background: '#2196F3', color: 'white' }}>1 Year</span>
                                </div>
                                <div className="package-details">
                                    <p className="questions" style={{ fontSize: '1rem' }}>All Planetary Trackers</p>
                                    <p className="price">₹99 <span style={{ fontSize: '0.8rem' }}>/yr</span></p>
                                </div>
                                <button className="buy-btn" onClick={() => handlePayment('SUB_TRACKER', 99, '1 Year Tracker Subscription')}>Subscribe</button>
                            </div>

                            {/* BCA Plan */}
                            <div className="package-card">
                                <div className="package-header">
                                    <h3>Body Blueprint</h3>
                                    <span className="tag" style={{ background: '#E91E63', color: 'white' }}>21 Days</span>
                                </div>
                                <div className="package-details">
                                    <p className="questions" style={{ fontSize: '1rem' }}>Transformation Plan</p>
                                    <p className="price">₹99</p>
                                </div>
                                <button className="buy-btn" onClick={() => handlePayment('BCA', 99, 'Body Composition 21 Day Plan')}>Unlock Plan</button>
                            </div>

                            {/* Bundle */}
                            <div className="package-card active" style={{ border: '1px solid #FFD700', boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)' }}>
                                <div className="package-header">
                                    <h3 style={{ color: '#FFD700' }}>Ultimate Bundle</h3>
                                    <span className="tag" style={{ background: 'linear-gradient(45deg, #FFD700, #FF5722)', color: 'black' }}>ULTIMATE</span>
                                </div>
                                <div className="package-details" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                                    <p className="questions" style={{ fontSize: '0.9rem' }}>• Lifetime Chart (₹99)</p>
                                    <p className="questions" style={{ fontSize: '0.9rem' }}>• 1 Yr Trackers (₹99)</p>
                                    <p className="questions" style={{ fontSize: '0.9rem' }}>• Body Plan (₹99)</p>
                                    <p className="questions" style={{ fontSize: '0.9rem', color: '#4CAF50' }}>• 20 AI Credits (₹700 Value)</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px', alignItems: 'flex-end' }}>
                                        <p className="price" style={{ fontSize: '1.8rem' }}>₹799</p>
                                        <span style={{ textDecoration: 'line-through', color: '#aaa' }}>₹3000+</span>
                                    </div>
                                </div>
                                <button className="buy-btn" style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)' }} onClick={() => handlePayment('BUNDLE', 799, 'Ultimate Cosmic Bundle')}>Get It All</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileProfile;
