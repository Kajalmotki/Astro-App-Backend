import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageCircle, Mail, ChevronDown } from 'lucide-react';
import './ProfilePages.css';

const HelpSupportPage = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { q: "How do I book a consultation?", a: "Go to the 'Ask AI' or Chat tab, select an astrologer, and choose a time slot or start a chat instantly." },
        { q: "Is my data safe?", a: "Yes, we use end-to-end encryption for all chats and store your birth details securely." },
        { q: "How can I request a refund?", a: "Please contact support within 24 hours of your transaction via the email option below." }
    ];

    return (
        <div className="profile-page-container">
            <header className="profile-page-header">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="profile-page-title">Help & Support</h2>
            </header>

            <div className="profile-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--surface2, linear-gradient(135deg, rgba(255,215,0,0.1), rgba(0,0,0,0)))' }}>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--theme-accent, #FFD700)' }}>Need help?</h3>
                <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '14px', marginBottom: '24px' }}>Our support team is available 24/7 to assist you.</p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button className="add-money-btn" style={{ width: 'auto', flex: 1, justifyContent: 'center' }}>
                        <MessageCircle size={18} /> WhatsApp
                    </button>
                    <button className="add-money-btn" style={{ width: 'auto', flex: 1, justifyContent: 'center', background: 'var(--surface, rgba(255,255,255,0.1))', border: '1px solid var(--border, rgba(255,255,255,0.2))' }}>
                        <Mail size={18} /> Email
                    </button>
                </div>
            </div>

            <h3 style={{ fontSize: '16px', margin: '24px 0 12px 12px', color: 'var(--text-secondary-new, #cbd5e1)' }}>Frequently Asked Questions</h3>

            <div className="profile-card" style={{ padding: 0, overflow: 'hidden' }}>
                {faqs.map((faq, index) => (
                    <div key={index} style={{ borderBottom: '1px solid var(--border, rgba(255,255,255,0.05))' }}>
                        <div
                            style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{faq.q}</span>
                            <ChevronDown size={16} style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                        </div>
                        {openIndex === index && (
                            <div style={{ padding: '0 16px 16px 16px', color: 'var(--text-muted, #94a3b8)', fontSize: '13px', lineHeight: '1.5' }}>
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HelpSupportPage;
