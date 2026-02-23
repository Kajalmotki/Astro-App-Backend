import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, User } from 'lucide-react';
import './ProfilePages.css';

const ChatHistoryPage = () => {
    const navigate = useNavigate();

    const chats = [
        { astrologer: 'Acharya Vinyak', date: 'Yesterday, 4:30 PM', duration: '15 mins', status: 'completed' },
        { astrologer: 'Tarot Anjali', date: 'Feb 10, 2026', duration: '22 mins', status: 'completed' },
    ];

    return (
        <div className="profile-page-container">
            <header className="profile-page-header">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="profile-page-title">Chat History</h2>
            </header>

            <div className="profile-card">
                {chats.map((chat, index) => (
                    <div key={index} className="profile-list-item">
                        <div className="item-icon" style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'var(--surface, rgba(255,255,255,0.1))', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginRight: '12px'
                        }}>
                            <User size={20} />
                        </div>
                        <div className="item-info">
                            <h4>{chat.astrologer}</h4>
                            <p>{chat.date}</p>
                        </div>
                        <div className="item-meta">
                            <span className="item-price">{chat.duration}</span>
                            <span className="item-status completed">Chat Ended</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="profile-card" style={{ marginTop: '20px', textAlign: 'center', padding: '30px' }}>
                <MessageSquare size={48} color="var(--text-muted, #64748b)" style={{ marginBottom: '10px' }} />
                <p style={{ color: 'var(--text-muted, #94a3b8)' }}>Start a new chat to gain more clarity.</p>
                <button className="add-money-btn" style={{ margin: '10px auto', width: 'auto' }} onClick={() => navigate('/mobile/chat')}>
                    Talk to Astrologer
                </button>
            </div>
        </div>
    );
};

export default ChatHistoryPage;
