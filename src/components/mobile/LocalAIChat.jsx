import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthModal';
import { getLocalAIAstrologerResponse, precalculateChartData } from '../../services/localAIApi';
import { getYogaRemedies } from '../../services/yogaRemediesEngine';
import LocalAIBirthPortal from './LocalAIBirthPortal';
import BeautifulD1Chart from './BeautifulD1Chart';
import BeautifulTransitChart from './BeautifulTransitChart';
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

const renderFormattedText = (text) => {
    if (typeof text !== 'string') return JSON.stringify(text, null, 2);
    const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);
    return (
        <span style={{ whiteSpace: 'pre-wrap' }}>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} style={{ fontWeight: 700, color: '#000' }}>{part.slice(2, -2)}</strong>;
                }
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};

const LocalAIChat = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [view, setView] = useState('loading');
    const [birthProfiles, setBirthProfiles] = useState([]);
    const [activeProfile, setActiveProfile] = useState(null); // The one currently in context during chat session
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

    // On mount: load saved birth profiles array → show home screen to choose
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Handle legacy migration: if objects were saved instead of arrays
                let profilesArray = [];
                if (Array.isArray(parsed)) {
                    profilesArray = parsed;
                } else if (parsed && typeof parsed === 'object') {
                    profilesArray = [parsed];
                }
                setBirthProfiles(profilesArray);
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
        setBirthProfiles(prev => {
            let updated = [...prev];
            // If we have 2 already, remove the oldest one (index 0) to keep max 2
            if (updated.length >= 2) {
                updated.shift();
            }
            updated.push(profile);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const saveChart = (chartObj, currentProfile) => {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        let profilesArray = Array.isArray(saved) ? saved : (saved ? [saved] : []);

        // Find the profile we are currently active on and update its savedChart
        const nowStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        const updatedArray = profilesArray.map(p => {
            // Use unique matching traits; simplistic match here assumes name + date match
            if (p.name === currentProfile.name && p.date === currentProfile.date) {
                return { ...p, savedChart: chartObj, savedAt: nowStr };
            }
            return p;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArray));
        setBirthProfiles(updatedArray); // Sync state back
    };

    const handleBirthSubmit = async (data) => {
        setActiveProfile(data);
        saveProfile(data);
        setView('chat');
        setMessages([{
            id: Date.now(), type: 'user', isRawData: false,
            text: `Birth profile set: ${data.name} | ${data.date} ${data.time} | ${data.cityName} | Lat ${data.lat?.toFixed(4)}°, Lng ${data.lng?.toFixed(4)}° | ${data.zoneName}`
        }]);
        await generateChart(data);
    };

    const generateChart = async (profile = activeProfile, question = null) => {
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
                saveChart(response.data, currentProfile);

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
        } catch (err) {
            console.error('Chart generation error:', err);
            const errMsg = err?.message || '';
            const isNetworkErr = errMsg.includes('OpenRouter') || errMsg.includes('fetch') || errMsg.includes('network');
            setMessages(prev => [...prev, {
                id: Date.now(), type: 'bot', isRawData: false, isError: true,
                text: isNetworkErr
                    ? '⚠ AI connection error. Check your internet and try again.'
                    : '⚠ Calculation engine error. Please try again.'
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

    const handleTransitChart = async () => {
        if (!activeProfile) return;
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: '🪐 Generate Live Transit Chart' }]);
        setIsTyping(true);
        setComputingMsg('Calculating live cosmic transit frequencies...');

        // Artificial delay for effect
        await new Promise(res => setTimeout(res, 2000));

        try {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
            const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }); // HH:MM

            const transitInput = {
                ...activeProfile,
                date: dateStr,
                time: timeStr
            };

            const mathData = precalculateChartData(transitInput);
            if (!mathData) throw new Error("Could not calculate transit.");

            // Format for BeautifulTransitChart
            const transitChartData = {
                date: dateStr,
                time: timeStr,
                lagna: mathData.ascSign,
                planets: mathData.planets
            };

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                isTransitData: true,
                transitData: transitChartData
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1, type: 'bot', isRawData: false, isError: true,
                text: '⚠ Could not calculate live transit data.'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        const q = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: q }]);
        // Pass chart context if we have one (follow-up mode)
        if (chartContext) {
            await generateChart(activeProfile, q);
        } else {
            await generateChart(activeProfile, q);
        }
    };

    const handleClearProfile = () => {
        // We do *not* wipe all profiles from storage here; we just exit to portal to make a new one.
        // User can add up to 2 profiles. Overwrites happen automatically in saveProfile.
        setActiveProfile(null);
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
                    {/* Saved profile cards map up to 2 */}
                    {birthProfiles.map((p, index) => (
                        <div key={index} style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', padding: '18px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <p style={{ color: '#111827', fontWeight: 'bold', margin: '0 0 10px', fontSize: '1rem' }}>📋 Saved Profile {index + 1}</p>
                            <p style={{ color: '#374151', margin: '4px 0', fontSize: '0.9rem' }}>👤 {p.name} ({p.gender})</p>
                            <p style={{ color: '#374151', margin: '4px 0', fontSize: '0.9rem' }}>📅 {p.date} · {p.time}</p>
                            <p style={{ color: '#374151', margin: '4px 0', fontSize: '0.9rem' }}>📍 {p.cityName}</p>
                            {p.savedAt && <p style={{ color: '#6b7280', margin: '8px 0 0', fontSize: '0.8rem' }}>Last saved: {p.savedAt}</p>}
                            <button
                                onClick={() => {
                                    setActiveProfile(p);
                                    setMessages([{ id: 1, type: 'bot', isRawData: false, text: `Profile loaded for ${p.name}. Tap below to generate your D1 Kundli.`, showQuickGenerate: true }]);
                                    setView('chat');
                                }}
                                style={{ width: '100%', marginTop: '14px', padding: '13px', background: 'linear-gradient(135deg, #ffd700, #f59e0b)', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Cinzel, serif' }}
                            >
                                ✨ Use This Profile
                            </button>
                        </div>
                    ))}

                    {/* Create new button */}
                    <button
                        onClick={() => { setActiveProfile(null); setMessages([]); setView('portal'); }}
                        style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#1f2937', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}
                    >
                        {birthProfiles.length >= 2 ? '⚠️ Create new (Replaces Profile 1)' : '＋ Create New Chart'}
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
                    <div className="header-center"><h2>Local AI — Birth Portal</h2></div>
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
                    {activeProfile && (
                        <p className="header-sub">{activeProfile.name} · {activeProfile.cityName}</p>
                    )}
                </div>
                <button className="reset-btn" onClick={handleClearProfile} title="Change Birth Details">✎</button>
            </header>

            <div className="chat-messages-scroll-area">
                {messages.map((m) => (
                    <div key={m.id} className={`message-wrapper ${m.type}`}>
                        {m.type === 'bot' && (
                            <div className="bot-avatar-local">ॐ</div>
                        )}
                        {m.isChartData && m.chartData ? (
                            <BeautifulD1Chart data={m.chartData} />
                        ) : m.isYogaData && m.yogaData ? (
                            <YogaRemediesCard remedies={m.yogaData} />
                        ) : m.isTransitData && m.transitData ? (
                            <BeautifulTransitChart data={m.transitData} />
                        ) : (
                            <div className={`message ${m.type === 'bot' ? (m.isRawData ? 'raw-data-card' : 'system-msg') : 'user-bg'} ${m.isError ? 'error-msg' : ''}`}>
                                {m.isRawData ? (
                                    <pre className="raw-response-text">{typeof m.text === 'object' ? JSON.stringify(m.text, null, 2) : m.text}</pre>
                                ) : (
                                    <p style={{ margin: 0 }}>{renderFormattedText(m.text)}</p>
                                )}

                                {m.showQuickGenerate && (
                                    <button onClick={handleQuickGenerate} className="quick-gen-btn">
                                        ✨ Generate Accurate D1 Chart Now
                                    </button>
                                )}

                                {m.followUpHint && chartContext && chartContext.chakras && (
                                    <>
                                        <button
                                            onClick={handleTransitChart}
                                            className="quick-gen-btn"
                                            style={{
                                                marginTop: '10px',
                                                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
                                                marginBottom: '8px'
                                            }}
                                        >
                                            🪐 Live Transit Chart with Nakshatras
                                        </button>
                                        <button
                                            onClick={handleYogaRemedies}
                                            className="quick-gen-btn"
                                            style={{
                                                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)'
                                            }}
                                        >
                                            🌿 Yoga Remedies for My Chart
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="message-wrapper bot">
                        <div className="bot-avatar-local">ॐ</div>
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
                <div className="chat-input-pill">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Ask about a specific house or planet..."
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="send-btn" disabled={isTyping || !inputValue.trim()}>
                        <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor', transform: 'translateX(1px)' }}>
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocalAIChat;
