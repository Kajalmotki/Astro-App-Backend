import React, { useState, useEffect, useRef } from 'react';
import BirthDetailsForm from './BirthDetailsForm';
import AstroPremiumWorkflow from './AstroPremiumWorkflow';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useAuth } from './AuthModal';
import { getAIResponse, saveBirthDataToFirestore } from '../services/aiService';
import { fetchUserBirthData } from '../services/birthDataService';
import { loadRazorpayButton } from '../services/razorpayService';
import logo from '../assets/logo.png';

// Helper component to trigger script load
const PaymentButtonLoader = ({ containerId }) => {
    useEffect(() => {
        loadRazorpayButton(containerId);
    }, [containerId]);
    return null;
};

// AstroAI: Mock Knowledge Base removed. Systems now use live Gemini engine exclusively.

const ChatInterface = ({ initialQuestion, onLoginClick }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Namaste! I am AstroAI. To unlock the full power of your destiny, I need to create your AstroRevo Chart. Click below to enter your birth details.",
            showFormLink: true
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
                        console.log("Loaded saved birth data for ChatInterface:", savedData);

                        // Update initial message to welcome back instead of asking for details
                        setMessages([
                            {
                                id: Date.now(),
                                type: 'bot',
                                text: `Welcome back, ${savedData.name || 'Seeker'}. I have your chart ready. How can I guide you today?`,
                                showFormLink: false
                            }
                        ]);
                    }
                } catch (error) {
                    console.error("Failed to load birth data:", error);
                }
            }
        };
        loadBirthData();
    }, [user]);

    useEffect(() => {
        if (initialQuestion) {
            handleSend(initialQuestion.text, initialQuestion.category.toLowerCase());
        }
    }, [initialQuestion]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping, showBirthForm]);


    const handleSend = async (text = inputValue, category = 'general') => {
        if (!text.trim()) return;

        // Check authentication
        if (!user) {
            onLoginClick();
            return;
        }

        if (text === inputValue) {
            setMessages(prev => [...prev, { id: Date.now(), type: 'user', text }]);
            setInputValue('');
        } else {
            setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: `Question: ${text}` }]);
        }

        setIsTyping(true);

        try {
            // Call live Gemini AI service
            const response = await getAIResponse(text, user.uid, userBirthData, user.displayName || userBirthData?.name || 'Seeker');

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                isPrediction: true,
                text: response.prediction,
                remedy: response.remedy,
                mantra: response.mantra
            }]);
        } catch (error) {
            console.error('AI Service Failed:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "The AstroRevo engine is currently experiencing high load. Please try again in a moment, or check your birth details.",
                isError: true
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleBirthDetailsSubmit = async (data) => {
        console.log("handleBirthDetailsSubmit received data:", data);
        console.log("data.name specifically:", data.name);

        setShowBirthForm(false);
        setUserBirthData(data);
        setIsTyping(true);

        // Save to Firestore if user is logged in
        if (user) {
            try {
                // Update Firebase Auth Profile so name is available in valid session
                if (data.name) {
                    console.log("Updating user profile with displayName:", data.name);
                    await updateProfile(user, { displayName: data.name });
                }

                const birthDataToSave = {
                    name: data.name,
                    place: data.place,
                    date: `${data.day}/${data.month}/${data.year}`,
                    time: `${data.hour}:${data.min}:${data.sec}`
                };
                console.log("About to save to Firestore:", birthDataToSave);

                // Formatting data for the logic expecting place, date, time
                await saveBirthDataToFirestore(user.uid, birthDataToSave);
            } catch (error) {
                console.error('Error saving birth data:', error);
            }
        }

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'bot',
                text: "I have calculated your planetary positions. Your personalized AstroRevo Chart is ready! Unlock the full D1 Lagna Chart analysis for just ₹99.",
                showPayment: true,
                kundliData: data
            }]);
            setIsTyping(false);
        }, 1500);
    };

    const handlePaymentSuccess = (data, messageId) => {
        // Update the message that had the payment button to hide it
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, showPayment: false } : m));

        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            text: "Payment Confirmed! Processing your data through the AstroRevo Decision Workflow...",
            isTyping: true
        }]);

        setTimeout(() => {
            setMessages(prev => {
                const updated = prev.filter(msg => !msg.isTyping);
                return [...updated, {
                    id: Date.now(),
                    type: 'bot',
                    text: "Payment Successful! Here is your personalized AstroRevo Decision Workflow.",
                    isKundli: true,
                    kundliData: data
                }];
            });
        }, 2000);
    };

    return (
        <div className="chat-container glass-card">
            <div className="chat-header" style={{ justifyContent: 'center', position: 'relative', padding: '15px' }}>
                <div className="bot-status" style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <span className="logo-text" style={{ fontSize: '1.2rem' }}>AstroRevo</span>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((m) => (
                    <div key={m.id} className={`message-wrapper ${m.type}`}>
                        <div className={`message ${m.type === 'bot' ? 'glass' : 'user-bg'} ${m.isPrediction || m.isKundli ? 'prediction-card' : ''}`}>
                            {m.text}

                            {m.showFormLink && (
                                <button className="chat-action-btn" onClick={() => setShowBirthForm(true)}>
                                    Create Your AstroRevo Chart
                                </button>
                            )}

                            {m.showPayment && (
                                <div className="payment-offer">
                                    <div className="price-tag gold-text">₹99</div>
                                    <p className="payment-instruction">Secure Payment via Razorpay</p>

                                    {/* Razorpay Button Container */}
                                    <div
                                        id={`razorpay-container-${m.id}`}
                                        className="razorpay-container"
                                        style={{ margin: '20px auto', minHeight: '50px' }}
                                    ></div>

                                    {/* Script Loader Effect */}
                                    <PaymentButtonLoader containerId={`razorpay-container-${m.id}`} />

                                    <div style={{ marginTop: '15px', fontSize: '0.8rem', color: '#888' }}>
                                        <p>After completing payment, the chart will generate automatically.</p>
                                        <button
                                            className="search-btn"
                                            style={{ marginTop: '10px', background: 'transparent', border: '1px solid #444', color: '#aaa', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handlePaymentSuccess(m.kundliData, m.id)}
                                        >
                                            (Dev: Simulate Success)
                                        </button>
                                    </div>
                                </div>
                            )}

                            {m.isKundli && (
                                <div className="chat-kundli-display">
                                    <AstroPremiumWorkflow data={m.kundliData} />
                                    <div className="kundli-mini-analysis">
                                        <p>Premium AstroRevo Workflow generated for <strong>{m.kundliData.name}</strong>.</p>
                                    </div>
                                </div>
                            )}

                            {m.remedy && (
                                <div className="remedy-box">
                                    <strong>✨ Practical Remedy:</strong>
                                    <p>{m.remedy}</p>
                                </div>
                            )}
                            {m.mantra && (
                                <div className="mantra-box">
                                    <strong>✨ Mantra:</strong>
                                    <p><em>{m.mantra}</em></p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {showBirthForm && (
                    <div className="message-wrapper bot">
                        <div className="message glass form-message">
                            <BirthDetailsForm onSubmit={handleBirthDetailsSubmit} compact={true} />
                            <button className="cancel-form" onClick={() => setShowBirthForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {isTyping && (
                    <div className="message-wrapper bot">
                        <div className="message glass typing-indicator">
                            <span>●</span><span>●</span><span>●</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about love, career, or health..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={() => handleSend()} className="send-btn" disabled={isTyping}>
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
