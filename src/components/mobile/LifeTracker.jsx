import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, ChevronLeft, ChevronRight, Dumbbell, Flame, Trash2 } from 'lucide-react';
import './LifeTracker.css';

const GOAL_CATEGORIES = [
    { emoji: '🎯', label: 'Custom', color: '#38bdf8' },
    { emoji: '💪', label: 'Fitness', color: '#ef4444' },
    { emoji: '🎓', label: 'Study', color: '#a855f7' },
    { emoji: '✈️', label: 'Travel', color: '#22c55e' },
    { emoji: '💍', label: 'Wedding', color: '#f59e0b' },
    { emoji: '💼', label: 'Career', color: '#6366f1' },
    { emoji: '🧘', label: 'Wellness', color: '#ec4899' },
    { emoji: '🎵', label: 'Hobby', color: '#14b8a6' },
    { emoji: '🏠', label: 'Home', color: '#f97316' },
    { emoji: '💰', label: 'Finance', color: '#eab308' },
];

const BODY_METRICS = [
    { key: 'weight', emoji: '⚖️', label: 'Weight', unit: 'kg' },
    { key: 'chest', emoji: '🫁', label: 'Chest', unit: 'in' },
    { key: 'arms', emoji: '💪', label: 'Arms', unit: 'in' },
    { key: 'waist', emoji: '📏', label: 'Waist', unit: 'in' },
    { key: 'shoulders', emoji: '🤸', label: 'Shoulders', unit: 'in' },
    { key: 'thighs', emoji: '🦵', label: 'Thighs', unit: 'in' },
];

const STORAGE_KEY = 'astrorevo_life_tracker';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const loadData = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) { console.error('Failed to load tracker data', e); }
    return { goals: [], bodyLogs: [], workoutDays: [], streak: 0 };
};

const saveData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { console.error('Failed to save tracker data', e); }
};

const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const LifeTracker = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('goals');
    const [data, setData] = useState(loadData);
    const [showModal, setShowModal] = useState(false);
    const [showBodyModal, setShowBodyModal] = useState(false);
    const [expandedGoal, setExpandedGoal] = useState(null);
    const [calendarMonth, setCalendarMonth] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });
    const [selectedDay, setSelectedDay] = useState(null);

    // New Goal Form State
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalCategory, setNewGoalCategory] = useState(0);
    const [newGoalDeadline, setNewGoalDeadline] = useState('');
    const [newMilestones, setNewMilestones] = useState([]);
    const [milestoneInput, setMilestoneInput] = useState('');

    // Body Log State
    const [bodyValues, setBodyValues] = useState({});

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showModal || showBodyModal) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [showModal, showBodyModal]);

    // Persist data on change
    useEffect(() => { saveData(data); }, [data]);

    // Calculate streak
    useEffect(() => {
        const today = new Date();
        let streak = 0;
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (data.workoutDays.includes(key)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        if (data.streak !== streak) {
            setData(prev => ({ ...prev, streak }));
        }
    }, [data.workoutDays]);

    // ── Goal Actions ──
    const addGoal = () => {
        if (!newGoalName.trim()) return;
        const cat = GOAL_CATEGORIES[newGoalCategory];
        const goal = {
            id: Date.now().toString(),
            name: newGoalName.trim(),
            emoji: cat.emoji,
            category: cat.label,
            color: cat.color,
            deadline: newGoalDeadline || null,
            milestones: newMilestones.map((m, i) => ({ id: `${Date.now()}_${i}`, text: m, done: false })),
            createdAt: getToday(),
        };
        setData(prev => ({ ...prev, goals: [...prev.goals, goal] }));
        setNewGoalName('');
        setNewGoalCategory(0);
        setNewGoalDeadline('');
        setNewMilestones([]);
        setMilestoneInput('');
        setShowModal(false);
    };

    const toggleMilestone = (goalId, milestoneId) => {
        setData(prev => ({
            ...prev,
            goals: prev.goals.map(g =>
                g.id === goalId
                    ? { ...g, milestones: g.milestones.map(m => m.id === milestoneId ? { ...m, done: !m.done } : m) }
                    : g
            ),
        }));
    };

    const deleteGoal = (goalId) => {
        setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== goalId) }));
        setExpandedGoal(null);
    };

    const getGoalProgress = (goal) => {
        if (!goal.milestones || goal.milestones.length === 0) return 0;
        const done = goal.milestones.filter(m => m.done).length;
        return Math.round((done / goal.milestones.length) * 100);
    };

    // ── Body Actions ──
    const logBody = () => {
        const entry = { date: getToday(), ...bodyValues };
        setData(prev => ({
            ...prev,
            bodyLogs: [...prev.bodyLogs.filter(l => l.date !== getToday()), entry],
        }));
        setBodyValues({});
        setShowBodyModal(false);
    };

    const logWorkout = () => {
        const today = getToday();
        setData(prev => ({
            ...prev,
            workoutDays: prev.workoutDays.includes(today)
                ? prev.workoutDays.filter(d => d !== today)
                : [...prev.workoutDays, today],
        }));
    };

    const getLatestBodyLog = () => data.bodyLogs[data.bodyLogs.length - 1] || {};
    const getPrevBodyLog = () => data.bodyLogs.length >= 2 ? data.bodyLogs[data.bodyLogs.length - 2] : {};

    const getBodyChange = (key) => {
        const latest = getLatestBodyLog()[key];
        const prev = getPrevBodyLog()[key];
        if (latest == null || prev == null) return null;
        return parseFloat((latest - prev).toFixed(1));
    };

    // ── Calendar Helpers ──
    const getCalendarDays = useCallback(() => {
        const { year, month } = calendarMonth;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days = [];

        // Previous month padding
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: daysInPrevMonth - i, otherMonth: true, date: null });
        }

        // Current month
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            days.push({ day: d, otherMonth: false, date: dateStr });
        }

        // Next month padding
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, otherMonth: true, date: null });
        }

        return days;
    }, [calendarMonth]);

    const getDayEvents = (dateStr) => {
        if (!dateStr) return [];
        const events = [];

        // Goals with matching deadline or milestones
        data.goals.forEach(g => {
            if (g.deadline === dateStr) events.push({ type: 'deadline', label: `${g.emoji} ${g.name} (Deadline)`, color: g.color });
            if (g.createdAt === dateStr) events.push({ type: 'start', label: `${g.emoji} ${g.name} (Started)`, color: g.color });
        });

        // Body logs
        if (data.bodyLogs.find(l => l.date === dateStr)) {
            events.push({ type: 'body', label: '📏 Body Measurements Logged', color: '#ef4444' });
        }

        // Workout
        if (data.workoutDays.includes(dateStr)) {
            events.push({ type: 'workout', label: '💪 Workout Completed', color: '#f97316' });
        }

        return events;
    };

    const getDayDots = (dateStr) => {
        if (!dateStr) return [];
        const dots = [];
        const hasGoalEvent = data.goals.some(g => g.deadline === dateStr || g.createdAt === dateStr);
        if (hasGoalEvent) dots.push('#38bdf8');
        if (data.bodyLogs.find(l => l.date === dateStr)) dots.push('#ef4444');
        if (data.workoutDays.includes(dateStr)) dots.push('#f97316');
        return dots.slice(0, 3);
    };

    const monthLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    const today = getToday();
    const todayLogged = data.workoutDays.includes(today);

    // ── Stats ──
    const totalGoals = data.goals.length;
    const completedGoals = data.goals.filter(g => getGoalProgress(g) === 100).length;
    const activeMilestones = data.goals.reduce((acc, g) => acc + g.milestones.filter(m => !m.done).length, 0);

    // ── Weekly streak days ──
    const getWeekDays = () => {
        const result = [];
        const todayDate = new Date();
        const dayOfWeek = todayDate.getDay();
        const monday = new Date(todayDate);
        monday.setDate(todayDate.getDate() - ((dayOfWeek + 6) % 7));

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            result.push({
                label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
                completed: data.workoutDays.includes(key),
                isToday: key === today,
            });
        }
        return result;
    };

    // ── RENDER ──
    return (
        <div className="life-tracker-page">
            {/* Header */}
            <div className="lt-header">
                <button className="lt-back-btn" onClick={() => navigate('/mobile/reports')}>
                    <ArrowLeft size={18} />
                </button>
                <div className="lt-header-text">
                    <h2>Life Tracker</h2>
                    <span>Plan · Track · Achieve</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="lt-tabs">
                <button className={`lt-tab ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>
                    <span className="tab-emoji">🎯</span>
                    Goals
                </button>
                <button className={`lt-tab ${activeTab === 'body' ? 'active body-tab' : ''}`} onClick={() => setActiveTab('body')}>
                    <span className="tab-emoji">💪</span>
                    Body
                </button>
                <button className={`lt-tab ${activeTab === 'calendar' ? 'active calendar-tab' : ''}`} onClick={() => setActiveTab('calendar')}>
                    <span className="tab-emoji">📅</span>
                    Calendar
                </button>
            </div>

            {/* ═══════════════ GOALS TAB ═══════════════ */}
            {activeTab === 'goals' && (
                <div className="lt-content" key="goals">
                    {/* Stats */}
                    <div className="lt-stats-row">
                        <div className="lt-stat-card">
                            <div className="lt-stat-value">{totalGoals}</div>
                            <div className="lt-stat-label">Total Goals</div>
                        </div>
                        <div className="lt-stat-card">
                            <div className="lt-stat-value">{completedGoals}</div>
                            <div className="lt-stat-label">Completed</div>
                        </div>
                        <div className="lt-stat-card">
                            <div className="lt-stat-value">{activeMilestones}</div>
                            <div className="lt-stat-label">Pending Steps</div>
                        </div>
                    </div>

                    {/* Goal List */}
                    {data.goals.length === 0 ? (
                        <div className="lt-empty">
                            <div className="lt-empty-emoji">🚀</div>
                            <h4>No goals yet</h4>
                            <p>Every big achievement starts with a single step. Create your first goal and break it into milestones!</p>
                        </div>
                    ) : (
                        <div className="lt-goals-list">
                            {data.goals.map(goal => {
                                const progress = getGoalProgress(goal);
                                const isExpanded = expandedGoal === goal.id;
                                return (
                                    <div
                                        key={goal.id}
                                        className="lt-goal-card"
                                        style={{ '--goal-color': goal.color }}
                                        onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                                    >
                                        <div className="lt-goal-top">
                                            <div className="lt-goal-emoji">{goal.emoji}</div>
                                            <div className="lt-goal-info">
                                                <div className="lt-goal-name">{goal.name}</div>
                                                <div className="lt-goal-category">{goal.category}</div>
                                            </div>
                                        </div>
                                        <div className="lt-goal-progress-bar">
                                            <div className="lt-goal-progress-fill" style={{ width: `${progress}%`, background: goal.color }} />
                                        </div>
                                        <div className="lt-goal-meta">
                                            <span className="lt-goal-percent" style={{ color: goal.color }}>{progress}%</span>
                                            {goal.deadline && <span className="lt-goal-date">Due: {formatDate(goal.deadline)}</span>}
                                        </div>

                                        {isExpanded && goal.milestones.length > 0 && (
                                            <div className="lt-milestones" onClick={e => e.stopPropagation()}>
                                                {goal.milestones.map(m => (
                                                    <div
                                                        key={m.id}
                                                        className={`lt-milestone ${m.done ? 'done' : ''}`}
                                                        onClick={() => toggleMilestone(goal.id, m.id)}
                                                    >
                                                        <div className="lt-milestone-check">{m.done ? '✓' : ''}</div>
                                                        <span className="lt-milestone-text">{m.text}</span>
                                                    </div>
                                                ))}
                                                <button className="lt-delete-btn" onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}>
                                                    <Trash2 size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                    Remove Goal
                                                </button>
                                            </div>
                                        )}
                                        {isExpanded && goal.milestones.length === 0 && (
                                            <div className="lt-milestones" onClick={e => e.stopPropagation()}>
                                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '8px 0' }}>
                                                    No milestones added for this goal.
                                                </p>
                                                <button className="lt-delete-btn" onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}>
                                                    <Trash2 size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                    Remove Goal
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <button className="lt-add-goal-btn" onClick={() => setShowModal(true)}>
                        <Plus size={18} /> Create New Goal
                    </button>
                </div>
            )}

            {/* ═══════════════ BODY TAB ═══════════════ */}
            {activeTab === 'body' && (
                <div className="lt-content" key="body">
                    {/* Streak */}
                    <div className="lt-streak-card">
                        <div className="lt-streak-fire">🔥</div>
                        <div className="lt-streak-count">{data.streak}</div>
                        <div className="lt-streak-label">Day Workout Streak</div>
                        <div className="lt-streak-days">
                            {getWeekDays().map((d, i) => (
                                <div key={i} className={`lt-streak-day ${d.completed ? 'completed' : ''} ${d.isToday ? 'today' : ''}`}>
                                    <span>{d.label}</span>
                                    <div className="lt-streak-day-dot" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Log Workout Button */}
                    <button
                        className={`lt-log-workout-btn ${todayLogged ? 'logged' : ''}`}
                        onClick={logWorkout}
                        style={{ marginTop: 14, marginBottom: 14 }}
                    >
                        {todayLogged ? (
                            <><Check size={18} /> Today's Workout Logged ✓</>
                        ) : (
                            <><Dumbbell size={18} /> Log Today's Workout</>
                        )}
                    </button>

                    {/* Body Measurements Card */}
                    <div className="lt-body-card">
                        <h4>📏 Body Measurements</h4>
                        <div className="lt-body-grid">
                            {BODY_METRICS.map(metric => {
                                const latest = getLatestBodyLog()[metric.key];
                                const change = getBodyChange(metric.key);
                                return (
                                    <div key={metric.key} className="lt-body-metric" onClick={() => setShowBodyModal(true)}>
                                        <div className="lt-body-metric-emoji">{metric.emoji}</div>
                                        <div className="lt-body-metric-value">
                                            {latest != null ? `${latest}` : '—'}
                                        </div>
                                        <div className="lt-body-metric-label">{metric.label} ({metric.unit})</div>
                                        {change !== null && (
                                            <div className={`lt-body-metric-change ${change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'}`}>
                                                {change > 0 ? `+${change}` : change} {metric.unit}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Log Body Button */}
                    <button className="lt-add-goal-btn" style={{ borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5', background: 'rgba(239,68,68,0.04)' }} onClick={() => setShowBodyModal(true)}>
                        <Plus size={18} /> Log Measurements
                    </button>

                    {/* Recent Logs */}
                    {data.bodyLogs.length > 0 && (
                        <div className="lt-body-card" style={{ marginTop: 14 }}>
                            <h4>📊 Recent Logs</h4>
                            <div className="lt-log-history">
                                {[...data.bodyLogs].reverse().slice(0, 5).map((log, i) => (
                                    <div key={i} className="lt-log-entry">
                                        <span className="lt-log-entry-date">{formatDate(log.date)}</span>
                                        <span className="lt-log-entry-value">
                                            {BODY_METRICS.filter(m => log[m.key] != null).map(m => `${m.emoji}${log[m.key]}${m.unit}`).join(' · ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════ CALENDAR TAB ═══════════════ */}
            {activeTab === 'calendar' && (
                <div className="lt-content" key="calendar">
                    <div className="lt-calendar">
                        <div className="lt-calendar-header">
                            <h4>📅 {monthLabel}</h4>
                            <div className="lt-calendar-nav">
                                <button onClick={() => setCalendarMonth(prev => {
                                    const d = new Date(prev.year, prev.month - 1);
                                    return { year: d.getFullYear(), month: d.getMonth() };
                                })}>
                                    <ChevronLeft size={14} />
                                </button>
                                <button onClick={() => setCalendarMonth(prev => {
                                    const d = new Date(prev.year, prev.month + 1);
                                    return { year: d.getFullYear(), month: d.getMonth() };
                                })}>
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="lt-calendar-weekdays">
                            {WEEKDAYS.map(w => <div key={w} className="lt-calendar-weekday">{w}</div>)}
                        </div>

                        <div className="lt-calendar-grid">
                            {getCalendarDays().map((d, i) => {
                                const dots = getDayDots(d.date);
                                const isToday = d.date === today;
                                const isSelected = d.date && d.date === selectedDay;
                                return (
                                    <button
                                        key={i}
                                        className={`lt-calendar-day ${d.otherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                                        onClick={() => d.date && setSelectedDay(isSelected ? null : d.date)}
                                    >
                                        <span>{d.day}</span>
                                        {dots.length > 0 && (
                                            <div className="lt-calendar-dots">
                                                {dots.map((color, j) => <div key={j} className="lt-calendar-dot" style={{ background: color }} />)}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Day Detail */}
                        {selectedDay && (
                            <div className="lt-day-detail">
                                <h5>{formatDate(selectedDay)}</h5>
                                {getDayEvents(selectedDay).length === 0 ? (
                                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>No events on this day.</p>
                                ) : (
                                    getDayEvents(selectedDay).map((ev, i) => (
                                        <div key={i} className="lt-day-event">
                                            <div className="lt-day-event-dot" style={{ background: ev.color }} />
                                            {ev.label}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                        {[{ color: '#38bdf8', label: 'Goals' }, { color: '#ef4444', label: 'Body Log' }, { color: '#f97316', label: 'Workout' }].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                                {l.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══════════════ NEW GOAL MODAL ═══════════════ */}
            {showModal && (
                <div className="lt-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="lt-modal" onClick={e => e.stopPropagation()}>
                        <div className="lt-modal-handle" />
                        <h3>🎯 Create New Goal</h3>

                        <div className="lt-input-group">
                            <label>Goal Name</label>
                            <input
                                className="lt-input"
                                placeholder="e.g. Vacation to Goa, Board Exams..."
                                value={newGoalName}
                                onChange={e => setNewGoalName(e.target.value)}
                                maxLength={60}
                            />
                        </div>

                        <div className="lt-input-group">
                            <label>Category</label>
                            <div className="lt-emoji-picker">
                                {GOAL_CATEGORIES.map((cat, i) => (
                                    <button
                                        key={i}
                                        className={`lt-emoji-option ${newGoalCategory === i ? 'selected' : ''}`}
                                        onClick={() => setNewGoalCategory(i)}
                                        title={cat.label}
                                    >
                                        {cat.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="lt-input-group">
                            <label>Deadline (optional)</label>
                            <input
                                className="lt-input"
                                type="date"
                                value={newGoalDeadline}
                                onChange={e => setNewGoalDeadline(e.target.value)}
                            />
                        </div>

                        <div className="lt-input-group">
                            <label>Milestones ({newMilestones.length} added)</label>
                            {newMilestones.map((m, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', flex: 1 }}>
                                        {i + 1}. {m}
                                    </span>
                                    <button
                                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.7rem' }}
                                        onClick={() => setNewMilestones(prev => prev.filter((_, j) => j !== i))}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <div className="lt-milestone-input-row">
                                <input
                                    className="lt-input"
                                    placeholder="Add a milestone step..."
                                    value={milestoneInput}
                                    onChange={e => setMilestoneInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && milestoneInput.trim()) {
                                            setNewMilestones(prev => [...prev, milestoneInput.trim()]);
                                            setMilestoneInput('');
                                        }
                                    }}
                                />
                                <button
                                    className="lt-milestone-add-btn"
                                    onClick={() => {
                                        if (milestoneInput.trim()) {
                                            setNewMilestones(prev => [...prev, milestoneInput.trim()]);
                                            setMilestoneInput('');
                                        }
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button className="lt-submit-btn" disabled={!newGoalName.trim()} onClick={addGoal}>
                            Create Goal 🚀
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════ BODY LOG MODAL ═══════════════ */}
            {showBodyModal && (
                <div className="lt-modal-overlay" onClick={() => setShowBodyModal(false)}>
                    <div className="lt-modal" onClick={e => e.stopPropagation()}>
                        <div className="lt-modal-handle" />
                        <h3>📏 Log Body Measurements</h3>
                        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
                            Today: {formatDate(getToday())}
                        </p>

                        {BODY_METRICS.map(metric => (
                            <div key={metric.key} className="lt-input-group">
                                <label>{metric.emoji} {metric.label} ({metric.unit})</label>
                                <input
                                    className="lt-input"
                                    type="number"
                                    step="0.1"
                                    placeholder={`e.g. ${metric.key === 'weight' ? '72.5' : '14.2'}`}
                                    value={bodyValues[metric.key] || ''}
                                    onChange={e => setBodyValues(prev => ({ ...prev, [metric.key]: e.target.value ? parseFloat(e.target.value) : undefined }))}
                                />
                            </div>
                        ))}

                        <button
                            className="lt-submit-btn"
                            style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)' }}
                            disabled={Object.values(bodyValues).filter(v => v != null).length === 0}
                            onClick={logBody}
                        >
                            Save Measurements 💪
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LifeTracker;
