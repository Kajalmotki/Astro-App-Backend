import React, { useState, useEffect, useRef } from 'react';
import BirthDetailsForm from './BirthDetailsForm';
import AstroPremiumWorkflow from './AstroPremiumWorkflow';

const KNOWLEDGE_BASE = {
    'love': {
        prediction: "The alignment of Venus in your 11th house suggests a significant emotional shift within the next 45 days. A connection from your past or a social circle may re-emerge.",
        remedy: "Wear a silver ring on your little finger or offer white flowers at a temple on Fridays to strengthen your Venus energy.",
        mantra: "Om Shum Shukraya Namaha"
    },
    'marriage': {
        prediction: "Jupiter's transit over your natal Moon indicates a highly auspicious window starting June 2026. This is the ideal time for finalizing alliances.",
        remedy: "Donate yellow lentils or bananas on Thursdays and seek blessings from elders in your family.",
        mantra: "Om Brim Brihaspataye Namaha"
    },
    'career': {
        prediction: "Saturn is testing your persistence in the current role. A major breakthrough is visible after the next solar eclipse, specifically in technical or managerial fields.",
        remedy: "Light a mustard oil lamp under a Peepal tree on Saturday evenings to appease Shani and remove obstacles.",
        mantra: "Om Sham Shanaishcharaya Namaha"
    },
    'money': {
        prediction: "Your financial stability is tied to Mercury's strength. While immediate gains are modest, a long-term investment made now will yield 3x returns by year-end.",
        remedy: "Keep a green handkerchief in your pocket and feed green grass to a cow on Wednesdays.",
        mantra: "Om Bum Budhaya Namaha"
    }
};

const ChatInterface = ({ initialQuestion }) => {
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
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (initialQuestion) {
            handleSend(initialQuestion.text, initialQuestion.category.toLowerCase());
        }
    }, [initialQuestion]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping, showBirthForm]);

    const getPrediction = (category, query) => {
        const defaultResponse = {
            prediction: `Analyzing your Chart... The planetary configuration for "${query}" shows a transitionary phase. You are currently under the influence of a minor Mahadasha.`,
            remedy: "Meditate for 10 minutes daily and keep a copper coin in your workspace to ground your energy.",
            mantra: "Om Namah Shivaya"
        };

        const key = Object.keys(KNOWLEDGE_BASE).find(k => category.includes(k) || query.toLowerCase().includes(k));
        return KNOWLEDGE_BASE[key] || defaultResponse;
    };

    const handleSend = async (text = inputValue, category = 'general') => {
        if (!text.trim()) return;

        if (text === inputValue) {
            setMessages(prev => [...prev, { id: Date.now(), type: 'user', text }]);
            setInputValue('');
        } else {
            setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: `Question: ${text}` }]);
        }

        setIsTyping(true);

        setTimeout(() => {
            const response = getPrediction(category, text);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                isPrediction: true,
                text: response.prediction,
                remedy: response.remedy,
                mantra: response.mantra
            }]);
            setIsTyping(false);
        }, 1200);
    };

    const handleBirthDetailsSubmit = (data) => {
        setShowBirthForm(false);
        setIsTyping(true);

        // Simulate finding the chart
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
            <div className="chat-header">
                <div className="bot-status">
                    <div className="status-dot"></div>
                    <span>AstroAI Live Guidance</span>
                </div>
                <div className="chart-info">AstroRevo Engine v2.1</div>
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
                                    <p className="payment-instruction">Scan to pay with any UPI app</p>
                                    <div className="qr-container">
                                        <img src="/payment_qr.jpg" alt="UPI QR Code" className="payment-qr" />
                                        <p className="upi-id">siddharth.vadhel-1@okaxis</p>
                                    </div>
                                    <button className="pay-btn" onClick={() => handlePaymentSuccess(m.kundliData, m.id)}>
                                        I have paid ₹99 - Get My Chart
                                    </button>
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
                                    <strong>🕉️ Mantra:</strong>
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
