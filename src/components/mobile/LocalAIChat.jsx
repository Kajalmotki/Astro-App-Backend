import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthModal';
import { getLocalAIAstrologerResponse } from '../../services/localAIApi';
import { getYogaRemedies } from '../../services/yogaRemediesEngine';
import LocalAIBirthPortal from './LocalAIBirthPortal';
import BeautifulD1Chart from './BeautifulD1Chart';
import YogaRemediesCard from './YogaRemediesCard';
import './LocalAIChat.css';

const LOADING_MESSAGES = [
    '🌌 Aligning with the cosmic grid...',
    '🔭 Mapping planetary longitudes...',
    '📐 Applying Lahiri Ayanamsa...',
    '🌍 Computing your Ascendant from the horizon...',
    '⚖️ Distributing planets across the 12 houses...',
    '☽ Tracing the Moon\'s nakshatra...',
    '♃ Evaluating Jupiter\'s aspect matrix...',
    '🪐 Locking Saturn\'s divisional position...',
    '🔮 Cross-referencing BPHS & Saravali rules...',
    '✨ Sealing the D1 chart calculations...',
];

const STORAGE_KEY = 'localai_birth_profile';

const LocalAIChat = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [view, setView] = useState('loading');
    const [birthProfile, setBirthProfile] = useState(null);
    const [chartContext, setChartContext] = useState(null); // Stores generated chart for follow-up Q&A
    const [computingMsg, setComputingMsg] = useState(LOADING_MESSAGES[0]);
    const msgIntervalRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Rotate loading messages while typing
    useEffect(() => {
        if (isTyping) {
            let idx = 0;
            msgIntervalRef.current = setInterval(() => {
                idx = (idx + 1) % LOADING_MESSAGES.length;
                setComputingMsg(LOADING_MESSAGES[idx]);
            }, 1800);
        } else {
            clearInterval(msgIntervalRef.current);
            setComputingMsg(LOADING_MESSAGES[0]);
        }
        return () => clearInterval(msgIntervalRef.current);
    }, [isTyping]);

    // On mount: load saved birth profile → show home screen to choose
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setBirthProfile(parsed);
                setView('home'); // Always show home screen on refresh
            } catch {
                setView('portal');
            }
        } else {
            setView('portal');
        }
    }, []);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [messages, isTyping]);

    const saveProfile = (profile) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    };

    const saveChart = (chartObj) => {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        saved.savedChart = chartObj;
        saved.savedAt = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    };

    const handleBirthSubmit = async (data) => {
        setBirthProfile(data);
        saveProfile(data);
        setView('chat');
        setMessages([{
            id: Date.now(), type: 'user', isRawData: false,
            text: `Birth profile set: ${data.name} | ${data.date} ${data.time} | ${data.cityName} | Lat ${data.lat?.toFixed(4)}°, Lng ${data.lng?.toFixed(4)}° | ${data.zoneName}`
        }]);
        await generateChart(data);
    };

    const generateChart = async (profile = birthProfile, question = null) => {
        const currentProfile = profile;
        if (!currentProfile?.lat) return;

        setIsTyping(true);
        try {
            const userName = currentProfile.name || user?.displayName || 'Seeker';
            // If question asked and chart exists, pass chart as context (stringify if it's an object)
            const contextArg = question && chartContext ?
                (typeof chartContext === 'object' ? JSON.stringify(chartContext) : chartContext)
                : null;

            const response = await getLocalAIAstrologerResponse(
                question || 'GENERATE_FULL_D1',
                userName,
                currentProfile,
                contextArg
            );

            // Initial Chart Generation (Returns Object {isChartData: true, data: {...}})
            if (!question && response.isChartData) {
                setChartContext(response.data);
                saveChart(response.data);

                setMessages(prev => [...prev,
                {
                    id: Date.now(), type: 'bot', isChartData: true, chartData: response.data
                },
                {
                    id: Date.now() + 2, type: 'bot', isRawData: false, followUpHint: true,
                    text: '✅ Chart generated and auto-saved to your profile!\n\n💾 Where to find it: This chart stays saved on this device. Next time you open Local AI, tap ✨ Use This Profile to instantly reload it without re-entering details.\n\n📌 You can now ask me specific questions like:\n• \'What does my 7th house say?\'\n• \'Tell me about my Moon placement\'\n• \'Which planets aspect my Lagna?\''
                }
                ]);
            } else {
                // Follow up QA
                setMessages(prev => [...prev, {
                    id: Date.now(), type: 'bot', isRawData: false, isChartData: false, text: response,
                    ...(question ? {} : { followUpHint: true })
                }]);
            }
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now(), type: 'bot', isRawData: false, isError: true,
                text: '⚠ Calculation engine error. Please try again.'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickGenerate = () => {
        setMessages(prev => prev.map(m => ({ ...m, showQuickGenerate: false })));
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: 'Generate D1 Kundli Chart' }]);
        generateChart();
    };

    const handleYogaRemedies = () => {
        if (!chartContext || !chartContext.chakras) return;
        const remedies = getYogaRemedies(chartContext.chakras);
        setMessages(prev => [
            ...prev,
            { id: Date.now(), type: 'user', text: '🌿 Show me Yoga Remedies for my chart' },
            { id: Date.now() + 1, type: 'bot', isYogaData: true, yogaData: remedies }
        ]);
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        const q = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: q }]);
        // Pass chart context if we have one (follow-up mode)
        if (chartContext) {
            await generateChart(birthProfile, q);
        } else {
            await generateChart(birthProfile, q);
        }
    };

    const handleClearProfile = () => {
        localStorage.removeItem(STORAGE_KEY);
        setBirthProfile(null);
        setMessages([]);
        setView('portal');
    };

    if (view === 'loading') {
        return (
            <div className="local-ai-chat-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: '#ffd700', fontSize: '2rem' }}>✨</div>
            </div>
        );
    }

    // Home screen: shown on refresh when saved profile exists
    if (view === 'home') {
        return (
            <div className="local-ai-chat-container">
                <header className="local-ai-header">
                    <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
                    <div className="header-center"><h2>Local AI — Vedic AI</h2></div>
                </header>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px', gap: '20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔮</div>
                        <h2 style={{ color: '#ffd700', fontFamily: 'Cinzel, serif', margin: 0, fontSize: '1.3rem' }}>Choose a Chart</h2>
                        <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: '0.9rem' }}>Start a new session</p>
                    </div>

                    {/* Saved profile card */}
                    {birthProfile && (
                        <div style={{ background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '16px', padding: '18px' }}>
                            <p style={{ color: '#ffd700', fontWeight: 'bold', margin: '0 0 10px', fontSize: '1rem' }}>📋 Saved Profile</p>
                            <p style={{ color: '#cbd5e1', margin: '4px 0', fontSize: '0.9rem' }}>👤 {birthProfile.name} ({birthProfile.gender})</p>
                            <p style={{ color: '#cbd5e1', margin: '4px 0', fontSize: '0.9rem' }}>📅 {birthProfile.date} · {birthProfile.time}</p>
                            <p style={{ color: '#cbd5e1', margin: '4px 0', fontSize: '0.9rem' }}>📍 {birthProfile.cityName}</p>
                            {birthProfile.savedAt && <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: '0.8rem' }}>Last saved: {birthProfile.savedAt}</p>}
                            <button
                                onClick={() => {
                                    setMessages([{ id: 1, type: 'bot', isRawData: false, text: `Profile loaded for ${birthProfile.name}. Tap below to generate your D1 Kundli.`, showQuickGenerate: true }]);
                                    setView('chat');
                                }}
                                style={{ width: '100%', marginTop: '14px', padding: '13px', background: 'linear-gradient(135deg, #ffd700, #f59e0b)', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Cinzel, serif' }}
                            >
                                ✨ Use This Profile
                            </button>
                        </div>
                    )}

                    {/* Create new */}
                    <button
                        onClick={() => { setBirthProfile(null); setMessages([]); setView('portal'); }}
                        style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer' }}
                    >
                        ＋ Create New Chart
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'portal') {
        return (
            <div className="local-ai-chat-container">
                <header className="local-ai-header">
                    <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
                    <h2>Local AI — Birth Portal</h2>
                </header>
                <div className="chat-messages-scroll-area" style={{ padding: 0 }}>
                    <LocalAIBirthPortal onSubmit={handleBirthSubmit} />
                </div>
            </div>
        );
    }

    return (
        <div className="local-ai-chat-container">
            <header className="local-ai-header">
                <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
                <div className="header-center">
                    <h2>D1 Kundli · Strict Vedic AI</h2>
                    {birthProfile && (
                        <p className="header-sub">{birthProfile.name} · {birthProfile.cityName}</p>
                    )}
                </div>
                <button className="reset-btn" onClick={handleClearProfile} title="Change Birth Details">✎</button>
            </header>

            <div className="chat-messages-scroll-area">
                {messages.map((m) => (
                    <div key={m.id} className={`message-wrapper ${m.type}`}>
                        {m.isChartData && m.chartData ? (
                            <BeautifulD1Chart data={m.chartData} />
                        ) : m.isYogaData && m.yogaData ? (
                            <YogaRemediesCard remedies={m.yogaData} />
                        ) : (
                            <div className={`message ${m.type === 'bot' ? (m.isRawData ? 'raw-data-card' : 'system-msg') : 'user-bg'} ${m.isError ? 'error-msg' : ''}`}>
                                {m.isRawData ? (
                                    <pre className="raw-response-text">{m.text}</pre>
                                ) : (
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
                                )}

                                {m.showQuickGenerate && (
                                    <button onClick={handleQuickGenerate} className="quick-gen-btn">
                                        ✨ Generate Accurate D1 Chart Now
                                    </button>
                                )}

                                {m.followUpHint && chartContext && chartContext.chakras && (
                                    <button
                                        onClick={handleYogaRemedies}
                                        className="quick-gen-btn"
                                        style={{
                                            marginTop: '10px',
                                            background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)'
                                        }}
                                    >
                                        🌿 Yoga Remedies for My Chart
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="message-wrapper bot">
                        <div className="message system-msg">
                            <div className="computing-indicator">
                                <span></span><span></span><span></span>
                                <span className="computing-text">{computingMsg}</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Ask about a specific house or planet..."
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="send-btn" disabled={isTyping || !inputValue.trim()}>
                    ➤
                </button>
            </div>
        </div>
    );
};

export default LocalAIChat;
