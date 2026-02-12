import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthModal';

const ConsultationModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [step, setStep] = useState('payment'); // payment, schedule, confirmation
    const [selectedSlot, setSelectedSlot] = useState(null);

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
        '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
    ];

    useEffect(() => {
        if (isOpen && step === 'payment') {
            loadRazorpayConsultation();
        }
    }, [isOpen, step]);

    const loadRazorpayConsultation = () => {
        const containerId = 'razorpay-consultation-container';
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
        // Using a placeholder or the provided info for 249 payment
        // Note: For real integration, we'd need the specific button ID for 249
        script.setAttribute('data-payment_button_id', 'pl_S5KX1tjut1BoNu'); // Placeholder, user might need to provide 249 ID
        script.async = true;

        const form = document.createElement('form');
        form.appendChild(script);
        container.appendChild(form);

        // Simulated success listener (since we can't easily hook into Razorpay button success here without webhook)
        // In a real app, we'd use Razorpay standard checkout for better control
        window.addEventListener('message', (e) => {
            if (e.data && typeof e.data === 'string' && e.data.includes('payment.success')) {
                setStep('schedule');
            }
        });
    };

    const handleSchedule = () => {
        if (!selectedSlot) return;
        setStep('confirmation');
    };

    const openWhatsApp = () => {
        const message = `Hello AstroRevo, I have scheduled an astrology consultation for ${selectedSlot}. My name is ${user?.displayName || 'Seeker'}.`;
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/919662083318?text=${encoded}`, '_blank');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="membership-modal-overlay" onClick={onClose}>
            <div className="membership-modal glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <button onClick={onClose} className="auth-close">×</button>

                <div className="membership-content">
                    {step === 'payment' && (
                        <>
                            <h2 className="gold-text">Astrologer Consultation</h2>
                            <p className="membership-subtitle">Book a private session for deep insights</p>
                            <div className="membership-price">
                                <span className="price-amount">₹249</span>
                                <span className="price-period">One-on-One Session</span>
                            </div>
                            <div className="membership-features">
                                <ul>
                                    <li>📞 30-Minute Voice/Chat Call</li>
                                    <li>📜 Deep Birth Chart Analysis</li>
                                    <li>🔮 Specific Queston Resolution</li>
                                    <li>💎 Gemstone & Remedy Advice</li>
                                </ul>
                            </div>
                            <div id="razorpay-consultation-container" style={{ marginTop: '20px' }}></div>

                            {import.meta.env.VITE_PAYMENT_TEST_MODE === 'true' && (
                                <p className="membership-note" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setStep('schedule')}>
                                    (Test Mode: Skip Payment)
                                </p>
                            )}
                        </>
                    )}

                    {step === 'schedule' && (
                        <>
                            <h2 className="gold-text">Pick Your Slot</h2>
                            <p className="membership-subtitle">Choose a time between 9:00 AM and 8:00 PM</p>

                            <div className="schedule-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '15px',
                                marginTop: '25px',
                                maxHeight: '350px',
                                overflowY: 'auto',
                                padding: '15px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '20px'
                            }}>
                                {timeSlots.map(slot => (
                                    <button
                                        key={slot}
                                        className={`cta-btn ${selectedSlot === slot ? 'golden-highlight pulse-glow' : 'secondary'}`}
                                        onClick={() => setSelectedSlot(slot)}
                                        style={{
                                            fontSize: '11px',
                                            padding: '12px 5px',
                                            border: selectedSlot === slot ? 'none' : '1px solid rgba(255,215,0,0.1)',
                                            background: selectedSlot === slot ? '' : 'rgba(255,255,255,0.05)',
                                            color: '#fff'
                                        }}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="cta-btn golden-highlight"
                                style={{ width: '100%', marginTop: '30px' }}
                                onClick={handleSchedule}
                                disabled={!selectedSlot}
                            >
                                Confirm Schedule
                            </button>
                        </>
                    )}

                    {step === 'confirmation' && (
                        <>
                            <h2 className="gold-text">Schedule Confirmed!</h2>
                            <p className="membership-subtitle">Your session for {selectedSlot} is locked.</p>

                            <div style={{ margin: '40px 0', padding: '20px', background: 'rgba(255,215,0,0.05)', borderRadius: '15px', border: '1px dashed var(--primary)' }}>
                                <p style={{ fontSize: '0.9rem', color: '#fff' }}>
                                    To finalize and receive updates, please contact us on WhatsApp now.
                                </p>
                            </div>

                            <button
                                className="cta-btn"
                                style={{ width: '100%', background: '#25D366', color: '#fff' }}
                                onClick={openWhatsApp}
                            >
                                💬 Notify via WhatsApp
                            </button>

                            <p className="membership-note" style={{ marginTop: '20px' }}>
                                Our astrologer will be notified via +919662083318
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsultationModal;
