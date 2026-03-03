import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Trash2, ChevronDown, ChevronRight, Clock, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ProfilePages.css';

const SAVED_CHATS_KEY = 'astrorevo_saved_chats';

const ChatHistoryPage = () => {
    const navigate = useNavigate();
    const [savedChats, setSavedChats] = useState([]);
    const [expandedChat, setExpandedChat] = useState(null);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(SAVED_CHATS_KEY) || '[]');
            setSavedChats(stored);
        } catch (e) {
            console.error('Failed to load saved chats:', e);
        }
    }, []);

    const deleteChat = (chatId, e) => {
        e.stopPropagation();
        const updated = savedChats.filter(c => c.id !== chatId);
        setSavedChats(updated);
        localStorage.setItem(SAVED_CHATS_KEY, JSON.stringify(updated));
        if (expandedChat === chatId) setExpandedChat(null);
    };

    const formatDate = (isoStr) => {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="profile-page-container">
            <header className="profile-page-header">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="profile-page-title">Saved Chats</h2>
            </header>

            {savedChats.length === 0 ? (
                <div className="profile-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <MessageSquare size={48} color="var(--text-muted, #64748b)" style={{ marginBottom: '12px' }} />
                    <h4 style={{ color: 'var(--text-primary, #f0f0f0)', marginBottom: '8px', fontFamily: 'var(--font-display, Outfit, sans-serif)' }}>No saved chats yet</h4>
                    <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                        Tap the <strong>bookmark icon</strong> in the chat header to save remarkable conversations forever.
                    </p>
                    <button
                        className="add-money-btn"
                        style={{ margin: '16px auto 0', width: 'auto' }}
                        onClick={() => navigate('/mobile/chat')}
                    >
                        Start a Chat
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 16px' }}>
                    {savedChats.map(chat => {
                        const isExpanded = expandedChat === chat.id;
                        return (
                            <div key={chat.id} className="profile-card" style={{ padding: 0, overflow: 'hidden' }}>
                                {/* Header */}
                                <div
                                    onClick={() => setExpandedChat(isExpanded ? null : chat.id)}
                                    style={{
                                        padding: '14px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '14px',
                                        background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(168,85,247,0.1))',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.1rem', flexShrink: 0,
                                    }}>
                                        ✨
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '0.85rem', color: '#f0f0f0',
                                            fontFamily: 'var(--font-display, Outfit, sans-serif)',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                            {chat.title}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={10} /> {formatDate(chat.savedAt)}
                                            </span>
                                            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>
                                                · {chat.messageCount} messages
                                            </span>
                                            {chat.birthData?.name && (
                                                <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    · <User size={9} /> {chat.birthData.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => deleteChat(chat.id, e)}
                                        style={{
                                            background: 'rgba(239,68,68,0.08)',
                                            border: '1px solid rgba(239,68,68,0.15)',
                                            color: '#f87171',
                                            width: '32px', height: '32px',
                                            borderRadius: '10px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', flexShrink: 0,
                                        }}
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    {isExpanded ? <ChevronDown size={16} color="rgba(255,255,255,0.4)" /> : <ChevronRight size={16} color="rgba(255,255,255,0.4)" />}
                                </div>

                                {/* Expanded: Full Chat */}
                                {isExpanded && (
                                    <div style={{
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                        padding: '12px 16px 16px',
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        background: 'rgba(0,0,0,0.15)',
                                    }}>
                                        {chat.messages.map((m, idx) => (
                                            <div
                                                key={m.id || idx}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: m.type === 'user' ? 'flex-end' : 'flex-start',
                                                    marginBottom: '8px',
                                                }}
                                            >
                                                <div style={{
                                                    maxWidth: '85%',
                                                    padding: '10px 14px',
                                                    borderRadius: m.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                    background: m.type === 'user'
                                                        ? 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(56,189,248,0.08))'
                                                        : 'rgba(255,255,255,0.04)',
                                                    border: `1px solid ${m.type === 'user' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.06)'}`,
                                                    fontSize: '0.8rem',
                                                    color: 'rgba(255,255,255,0.8)',
                                                    lineHeight: '1.5',
                                                }}>
                                                    {m.type === 'bot' && m.isPrediction ? (
                                                        <ReactMarkdown>{m.text}</ReactMarkdown>
                                                    ) : (
                                                        m.text
                                                    )}
                                                    {m.remedy && (
                                                        <div style={{ marginTop: '8px', padding: '8px 10px', background: 'rgba(52,211,153,0.06)', borderRadius: '10px', borderLeft: '3px solid rgba(52,211,153,0.4)' }}>
                                                            <div style={{ fontSize: '0.6rem', color: '#34d399', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>REMEDY</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{m.remedy}</div>
                                                        </div>
                                                    )}
                                                    {m.mantra && (
                                                        <div style={{ marginTop: '6px', padding: '8px 10px', background: 'rgba(234,179,8,0.06)', borderRadius: '10px', borderLeft: '3px solid rgba(234,179,8,0.4)' }}>
                                                            <div style={{ fontSize: '0.6rem', color: '#eab308', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>MANTRA</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>{m.mantra}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChatHistoryPage;
