import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BirthDetailsForm from '../components/BirthDetailsForm';
import AstroPremiumWorkflow from '../components/AstroPremiumWorkflow';
import { useAuth } from '../components/AuthModal';
import { getAIResponse, saveBirthDataToFirestore } from '../services/aiService';
import { fetchUserBirthData, fetchSavedCharts, saveNewChart } from '../services/birthDataService';
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
    const [showSavedCharts, setShowSavedCharts] = useState(false);
    const [savedCharts, setSavedCharts] = useState([]);
    const [userBirthData, setUserBirthData] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch saved birth data when user logs in
    useEffect(() => {
        const loadInitialData = async () => {
            if (user?.uid) {
                try {
                    // Load primary birth data
                    const savedData = await fetchUserBirthData(user.uid);
                    // Load all saved charts
                    const charts = await fetchSavedCharts(user.uid);
                    setSavedCharts(charts);

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
        loadInitialData();
    }, [user]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping, showBirthForm, showSavedCharts]);

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
                // Save as primary if it's the first time
                if (!userBirthData) {
                    if (data.name) await updateProfile(user, { displayName: data.name });
                    await saveBirthDataToFirestore(user.uid, {
                        name: data.name,
                        place: data.place,
                        date: `${data.day}/${data.month}/${data.year}`,
                        time: `${data.hour}:${data.min}:${data.sec}`
                    });
                }

                // Always save to savedCharts collection
                await saveNewChart(user.uid, data);
                // Refresh saved charts list
                const charts = await fetchSavedCharts(user.uid);
                setSavedCharts(charts);

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

    const handleHeaderPlusClick = () => {
        if (savedCharts.length > 0) {
            setShowSavedCharts(true);
            setShowBirthForm(false);
        } else {
            setShowBirthForm(true);
            setShowSavedCharts(false);
        }
    };

    const selectChart = (chart) => {
        setUserBirthData(chart);
        setShowSavedCharts(false);
        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            text: ` switched context to ${chart.name}. Analyzing new coordinates...`,
            isSystem: true
        }]);
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
                        onClick={handleHeaderPlusClick}
                    >
                        <span className="icon">+</span>
                        <span className="item-text">Birth Details</span>
                    </button>

                    {savedCharts.length > 0 && (
                        <div className="saved-charts-list-sidebar">
                            <h4 className="sidebar-section-title">Saved Charts</h4>
                            {savedCharts.map(chart => (
                                <div key={chart.id} className="history-item" onClick={() => selectChart(chart)}>
                                    <span className="icon">👤</span>
                                    <div className="item-text">{chart.name}</div>
                                </div>
                            ))}
                        </div>
                    )}
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
                        <button className="header-tool-btn" onClick={handleHeaderPlusClick} title="New/Change Chart" style={{ marginRight: '10px' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>+</span>
                        </button>
                        <button className="header-tool-btn" onClick={() => navigate('/')} title="Exit Chat">✕</button>
                    </div>
                </header>



                <div className="messages-viewport">
                    <div className="messages-inner">
                        {messages.map((m) => (
                            <div key={m.id} className={`chat-message-row ${m.type} ${m.isSystem ? 'system-msg' : ''}`}>
                                {m.type === 'bot' && <div className="bot-min-avatar logo-avatar" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ॐ</div>}
                                <div className={`chat-bubble ${m.type} ${m.isPrediction ? 'prediction' : ''} ${m.isSystem ? 'system-bubble' : ''}`}>
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

                        {showSavedCharts && (
                            <div className="chat-message-row bot">
                                <div className="bot-min-avatar logo-avatar" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ॐ</div>
                                <div className="chat-bubble bot form-bubble saved-charts-bubble">
                                    <h3 className="gold-text">Select a Chart</h3>
                                    <div className="saved-charts-grid">
                                        {savedCharts.map(chart => (
                                            <div key={chart.id} className="saved-chart-card" onClick={() => selectChart(chart)}>
                                                <div className="chart-icon">👤</div>
                                                <div className="chart-info">
                                                    <span className="chart-name">{chart.name}</span>
                                                    <span className="chart-details">{chart.place}</span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="saved-chart-card new-chart-card" onClick={() => { setShowSavedCharts(false); setShowBirthForm(true); }}>
                                            <div className="chart-icon">+</div>
                                            <div className="chart-info">
                                                <span className="chart-name">Create New</span>
                                                <span className="chart-details">Add new birth details</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="close-bubble-btn"
                                        onClick={() => setShowSavedCharts(false)}
                                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
                                    >✕</button>
                                </div>
                            </div>
                        )}

                        {showBirthForm && (
                            <div className="chat-message-row bot">
                                <div className="bot-min-avatar logo-avatar" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ॐ</div>
                                <div className="chat-bubble bot form-bubble">
                                    <BirthDetailsForm
                                        onSubmit={handleBirthDetailsSubmit}
                                        onClose={() => setShowBirthForm(false)}
                                        compact={true}
                                    />
                                    {/* Removed old Cancel button as per request, now using onClose X in form */}
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
