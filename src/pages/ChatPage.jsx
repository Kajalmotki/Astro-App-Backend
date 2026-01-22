import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BirthDetailsForm from '../components/BirthDetailsForm';
import AstroPremiumWorkflow from '../components/AstroPremiumWorkflow';
import { useAuth } from '../components/AuthModal';
import { getAIResponse, saveBirthDataToFirestore } from '../services/aiService';
import { loadRazorpayButton } from '../services/razorpayService';
import { updateProfile } from 'firebase/auth';
import './ChatPage.css';

const PaymentButtonLoader = ({ containerId }) => {
    useEffect(() => {
        loadRazorpayButton(containerId);
    }, [containerId]);
    return null;
};

const ChatPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Namaste! I am your AstroRevo Guide. I've been waiting for this cosmic connection. To begin our journey, I'll need to create your sacred birth chart. Shall we proceed?",
            showFormLink: true
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showBirthForm, setShowBirthForm] = useState(false);
    const [userBirthData, setUserBirthData] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping, showBirthForm]);

    useEffect(() => {
        if (location.state?.initialQuestion) {
            handleSend(location.state.initialQuestion.text);
        }
    }, [location.state]);

    const handleSend = async (text = inputValue) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text }]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await getAIResponse(text, user?.uid || 'guest', userBirthData, user?.displayName || userBirthData?.name || 'Seeker');

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: response.prediction,
                remedy: response.remedy,
                mantra: response.mantra,
                isPrediction: true
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "The stars are slightly obscured right now. Please try again in a moment.",
                isError: true
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleBirthDetailsSubmit = async (data) => {
        setShowBirthForm(false);
        setUserBirthData(data);
        setIsTyping(true);

        if (user) {
            try {
                if (data.name) await updateProfile(user, { displayName: data.name });
                await saveBirthDataToFirestore(user.uid, {
                    name: data.name,
                    place: data.place,
                    date: `${data.day}/${data.month}/${data.year}`,
                    time: `${data.hour}:${data.min}:${data.sec}`
                });
            } catch (e) { console.error(e); }
        }

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'bot',
                text: `Dhanyawad, ${data.name}. Your planetary alignment is unique. I have prepared your D1 Lagna Chart analysis.`,
                showPayment: true,
                kundliData: data
            }]);
            setIsTyping(false);
        }, 1500);
    };

    const handlePaymentSuccess = (data, messageId) => {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, showPayment: false } : m));
        setIsTyping(true);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'bot',
                text: "Payment Confirmed! Here is your personalized AstroRevo Decision Workflow.",
                isKundli: true,
                kundliData: data
            }]);
            setIsTyping(false);
        }, 2000);
    };

    return (
        <div className="chat-page-container">
            <aside className="chat-sidebar">
                <div className="sidebar-header">
                    <div className="logo-small">Astro<span>Revo</span></div>
                </div>
                <nav className="history-list">
                    <div className="history-item active">
                        <span className="icon">✨</span>
                        <div className="item-text">New Cosmic Reading</div>
                    </div>
                </nav>
                <div className="sidebar-footer">
                    <button className="back-btn" onClick={() => navigate('/')}>← Exit to Home</button>
                </div>
            </aside>

            <main className="chat-main-area">
                <header className="chat-page-header">
                    <div className="header-bot-info">
                        <div className="bot-avatar-container">
                            <div className="bot-avatar">🕉️</div>
                            <div className="online-indicator"></div>
                        </div>
                        <div className="header-text">
                            <h3>AstroRevo AI</h3>
                            <span>Ancient Wisdom, Instant Clarity</span>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="header-tool-btn">⚙️</button>
                    </div>
                </header>

                <div className="messages-viewport">
                    <div className="messages-inner">
                        {messages.map((m) => (
                            <div key={m.id} className={`chat-message-row ${m.type}`}>
                                {m.type === 'bot' && <div className="bot-min-avatar">🕉️</div>}
                                <div className={`chat-bubble ${m.type} ${m.isPrediction ? 'prediction' : ''}`}>
                                    {m.text}

                                    {m.showFormLink && (
                                        <button className="chat-cta-btn" onClick={() => setShowBirthForm(true)}>
                                            Begin Your Analysis
                                        </button>
                                    )}

                                    {m.showPayment && (
                                        <div className="chat-payment-card">
                                            <div className="price">₹99</div>
                                            <p>Unlock Your Full D1 Lagna Chart & Premium Workflow</p>
                                            <div id={`razorpay-container-${m.id}`} className="razorpay-box"></div>
                                            <PaymentButtonLoader containerId={`razorpay-container-${m.id}`} />
                                            <button className="sim-btn" onClick={() => handlePaymentSuccess(m.kundliData, m.id)}>
                                                (Simulate Payment)
                                            </button>
                                        </div>
                                    )}

                                    {m.isKundli && (
                                        <div className="chat-workflow-embed">
                                            <AstroPremiumWorkflow data={m.kundliData} />
                                        </div>
                                    )}

                                    {m.remedy && (
                                        <div className="remedy-section">
                                            <h4>✨ Divine Remedy</h4>
                                            <p>{m.remedy}</p>
                                        </div>
                                    )}
                                    {m.mantra && (
                                        <div className="mantra-section">
                                            <h4>🕉️ Sacred Mantra</h4>
                                            <p><em>{m.mantra}</em></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {showBirthForm && (
                            <div className="chat-message-row bot">
                                <div className="bot-min-avatar">🕉️</div>
                                <div className="chat-bubble bot form-bubble">
                                    <BirthDetailsForm onSubmit={handleBirthDetailsSubmit} compact={true} />
                                    <button className="cancel-bubble-btn" onClick={() => setShowBirthForm(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                        {isTyping && (
                            <div className="chat-message-row bot">
                                <div className="bot-min-avatar">🕉️</div>
                                <div className="chat-bubble bot typing">
                                    <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <footer className="chat-page-input-area">
                    <div className="input-container-inner">
                        <input
                            type="text"
                            placeholder="Ask the cosmos anything..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="chat-send-action" onClick={() => handleSend()}>
                            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default ChatPage;
