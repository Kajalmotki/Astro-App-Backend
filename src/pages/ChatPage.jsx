import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BirthDetailsForm from '../components/BirthDetailsForm';
import AstroPremiumWorkflow from '../components/AstroPremiumWorkflow';
import { useAuth } from '../components/AuthModal';
import { getAIResponse, saveBirthDataToFirestore } from '../services/aiService';
import { fetchUserBirthData } from '../services/birthDataService';
import { loadRazorpayButton } from '../services/razorpayService';
import { updateProfile } from 'firebase/auth';
import CalmMusicPlayer from '../components/CalmMusicPlayer';
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
            text: "Namaste! I am your AstroRevo Guide. I've been waiting for our cosmic paths to cross. To begin your journey, I'll need to create your sacred birth chart.",
            showFormLink: false
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showBirthForm, setShowBirthForm] = useState(false);
    const [userBirthData, setUserBirthData] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch saved birth data when user logs in
    useEffect(() => {
        const loadBirthData = async () => {
            if (user?.uid) {
                try {
                    const savedData = await fetchUserBirthData(user.uid);
                    if (savedData) {
                        setUserBirthData(savedData);
                        setMessages([
                            {
                                id: Date.now(),
                                type: 'bot',
                                text: `Namaste ${savedData.name || 'Seeker'}! I have successfully synchronized with your birth chart. The stars are aligned for revelation. What deep question brings you here today?`,
                                showFormLink: false
                            }
                        ]);
                    } else {
                        // No saved data, show form immediately
                        setShowBirthForm(true);
                    }
                } catch (error) {
                    console.error("Failed to load birth data:", error);
                }
            }
        };
        loadBirthData();
    }, [user]);

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
        const messageText = typeof text === 'string' ? text : inputValue;
        if (!messageText.trim()) return;

        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: messageText }]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await getAIResponse(messageText, user?.uid || 'guest', userBirthData, user?.displayName || userBirthData?.name || 'Seeker');

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
                text: "The celestial energies are shifting. Please ask your question again in a moment.",
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
                text: `Dhanyawad, ${data.name}. Your chart reveals a powerful destiny. I have prepared your personalized analysis.`,
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
                text: "Divine energy received. Here is your personalized AstroRevo Decision Workflow.",
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
                    <span className="logo-text">AstroRevo</span>
                </div>
                <nav className="history-list">
                    <div className="history-item active">
                        <span className="icon">✨</span>
                        <div className="item-text">New Cosmic Reading</div>
                    </div>
                    <button
                        className="sidebar-add-chart-btn"
                        onClick={() => setShowBirthForm(true)}
                    >
                        <span className="icon">+</span>
                        <span className="item-text">Birth Details</span>
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="back-btn" onClick={() => navigate('/')}>← Back Home</button>
                </div>
            </aside>

            <main className="chat-main-area">
                <header className="chat-page-header">
                    <div className="header-center">
                    </div>
                    <div className="header-right">
                        <div className="user-profile-mini">
                            <div className="user-info-text">
                                <span className="user-name-tag">{user?.displayName || userBirthData?.name || 'Guest'}</span>
                                <span className="user-status-tag"><span className="status-dot"></span> Online</span>
                            </div>
                        </div>
                        <button className="header-tool-btn" onClick={() => setShowBirthForm(true)} title="New/Change Chart" style={{ marginRight: '10px' }}>
                            <span style={{ fontSize: '1.2rem' }}>📝</span>
                        </button>
                        <button className="header-tool-btn" onClick={() => navigate('/')} title="Exit Chat">✕</button>
                    </div>
                </header>



                <div className="messages-viewport">
                    <div className="messages-inner">
                        {messages.map((m) => (
                            <div key={m.id} className={`chat-message-row ${m.type}`}>
                                {m.type === 'bot' && <div className="bot-min-avatar logo-avatar" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ॐ</div>}
                                <div className={`chat-bubble ${m.type} ${m.isPrediction ? 'prediction' : ''}`}>
                                    {m.text}

                                    {/* Removed 'Begin Your Analysis' button */}

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
                                            <h4>✨ Sacred Mantra</h4>
                                            <p><em>{m.mantra}</em></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {showBirthForm && (
                            <div className="chat-message-row bot">
                                <div className="bot-min-avatar logo-avatar" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ॐ</div>
                                <div className="chat-bubble bot form-bubble">
                                    <BirthDetailsForm onSubmit={handleBirthDetailsSubmit} compact={true} />
                                    <button className="cancel-bubble-btn" onClick={() => setShowBirthForm(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                        {isTyping && (
                            <div className="chat-message-row bot">
                                <div className="bot-min-avatar logo-avatar" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ॐ</div>
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
