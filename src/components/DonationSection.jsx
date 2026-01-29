import React, { useState, useEffect } from 'react';
import { processDonation } from '../services/razorpayService';
import './DonationSection.css';

const DonationSection = () => {
    const [amount, setAmount] = useState(100);
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Load Razorpay script if not already loaded
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleDonate = async () => {
        if (amount < 10) {
            setStatus('Minimum donation is ₹10');
            return;
        }

        try {
            setStatus('Initializing payment...');
            const response = await processDonation(amount);
            setStatus('Thank you for your generous donation! 🙏');
            console.log('Payment Successful:', response);
        } catch (error) {
            setStatus('Payment failed or cancelled.');
            console.error('Payment Error:', error);
        }
    };

    return (
        <section className="donation-section">
            <div className="donation-container glass-card">
                <div className="donation-content">
                    <h2 className="gold-text">Support AstroRevo's Evolution</h2>
                    <p className="donation-description">
                        We are building a new, more powerful version of the AstroRevo engine.
                        Your contribution helps us cover API costs and development resources to keep
                        the stars accessible to everyone.
                    </p>

                    <div className="donation-controls">
                        <div className="amount-input-wrapper">
                            <span>₹</span>
                            <input
                                type="number"
                                min="10"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder="Amount"
                                className="amount-input"
                            />
                        </div>
                        <button className="donate-btn pulse-glow" onClick={handleDonate}>
                            Contribute Now
                        </button>
                    </div>

                    {status && <p className="donation-status">{status}</p>}

                    <div className="donation-tiers">
                        <button onClick={() => setAmount(10)} className="tier-btn">₹10</button>
                        <button onClick={() => setAmount(101)} className="tier-btn">₹101</button>
                        <button onClick={() => setAmount(501)} className="tier-btn">₹501</button>
                        <button onClick={() => setAmount(1001)} className="tier-btn">₹1001</button>
                    </div>

                    <p className="min-donation-note">Minimum contribution: ₹10</p>
                </div>
            </div>
        </section>
    );
};

export default DonationSection;
