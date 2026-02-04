import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthModal';
import { getAssistantResponse } from '../services/aiService';

const AstroAssistant = ({ onLoginClick }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Welcome to AstroRevo. I am your AI Assistant. I can help you with your queries, take notes, or guide you through our features. How can I assist you today?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [notes, setNotes] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Only scroll when messages change, not on initial mount
        if (messages.length > 1) {
            scrollToBottom();
        }
    }, [messages, isTyping]);

    const handleSend = async (text = inputValue) => {
        if (!text.trim()) return;

        if (!user) {
            onLoginClick();
            return;
        }

        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text }]);
        setInputValue('');
        setIsTyping(true);

        try {
            const data = await getAssistantResponse(text, user.uid, user.displayName || 'Client');

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: data.response,
                suggestedActions: data.suggestedActions
            }]);

            if (data.isNote && data.noteContent) {
                setNotes(prev => [...prev, { id: Date.now(), content: data.noteContent }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "I'm having trouble processing that request at the moment. Please try again."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="assistant-container glass-card">
            <div className="assistant-header">
                <div className="bot-info">
                    <div className="bot-status-ring">
                        <div className="status-dot-green"></div>
                    </div>
                    <div>
                        <h3 style={{ color: '#FFFFFF' }}>AstroRevo AI Assistant</h3>
                        <span className="text-dim">Query Assistant</span>
                    </div>
                </div>
            </div>

            <div className="assistant-chat-view">
                <div className="assistant-messages">
                    {messages.map((m) => (
                        <div key={m.id} className={`assistant-msg-row ${m.type}`}>
                            <div className={`assistant-bubble ${m.type}`}>
                                {m.text}
                                {m.suggestedActions && m.suggestedActions.length > 0 && (
                                    <div className="suggested-actions">
                                        {m.suggestedActions.map((action, i) => (
                                            <button
                                                key={i}
                                                className="action-pill"
                                                onClick={() => handleSend(action)}
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="assistant-msg-row bot">
                            <div className="assistant-bubble bot typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {notes.length > 0 && (
                    <div className="assistant-sidebar-notes">
                        <h4 className="gold-text">Saved Notes</h4>
                        <div className="notes-list">
                            {notes.map(note => (
                                <div key={note.id} className="note-item">
                                    {note.content}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="assistant-input-gate">
                <div className="input-wrap">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your query or 'Take a note: ...'"
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={() => handleSend()} className="assistant-send-btn" disabled={isTyping}>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AstroAssistant;
