import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Check, Crown, Book, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../SaturnTracker.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_JUPITER_HABITS = [
    { id: 1, name: "Gratitude Journal (3 Things)", completed: [true, true, true, true, true, true, true] },
    { id: 2, name: "Spiritual Reading (15m)", completed: [true, false, true, true, true, false, false] },
    { id: 3, name: "Teach/Mentor Someone", completed: [false, true, false, true, false, true, false] },
    { id: 4, name: "Donation / Charity", completed: [true, true, false, false, true, false, false] },
    { id: 5, name: "Positive Affirmations", completed: [false, false, true, true, true, true, false] }
];

const JupiterTracker = () => {
    const navigate = useNavigate();
    const [habits, setHabits] = useState(DEFAULT_JUPITER_HABITS);
    const [wisdomScore, setWisdomScore] = useState(0);
    const [streak, setStreak] = useState(5);
    const [newHabitName, setNewHabitName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        let points = 0;
        habits.forEach(habit => {
            points += habit.completed.filter(Boolean).length * 10;
        });
        setWisdomScore(points);
    }, [habits]);

    const toggleDay = (habitId, dayIndex) => {
        setHabits(prevHabits => prevHabits.map(habit => {
            if (habit.id === habitId) {
                const newCompleted = [...habit.completed];
                newCompleted[dayIndex] = !newCompleted[dayIndex];
                return { ...habit, completed: newCompleted };
            }
            return habit;
        }));
    };

    const calculateProgress = (completedArray) => {
        const checked = completedArray.filter(Boolean).length;
        return Math.round((checked / 7) * 100);
    };

    const addHabit = () => {
        if (!newHabitName.trim()) return;
        const newHabit = {
            id: Date.now(),
            name: newHabitName,
            completed: [false, false, false, false, false, false, false]
        };
        setHabits([...habits, newHabit]);
        setNewHabitName("");
        setIsAdding(false);
    };

    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    return (
        <div className="saturn-page-container" style={{ background: 'radial-gradient(circle at top, #422006 0%, #000 100%)' }}>
            <div className="saturn-header" style={{ borderColor: 'rgba(234, 179, 8, 0.2)' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="#eab308" />
                </button>
                <div className="header-titles">
                    <h2 className="page-title" style={{ color: '#eab308', fontFamily: 'Cinzel, serif' }}>Guru's Grace</h2>
                    <span className="page-subtitle" style={{ color: '#fcd34d' }}>Wisdom & Expansion</span>
                </div>
                <div className="karma-badge" style={{ background: 'linear-gradient(135deg, #eab308 0%, #a16207 100%)', boxShadow: '0 4px 15px rgba(234, 179, 8, 0.3)' }}>
                    <span className="karma-value" style={{ color: '#fff' }}>{wisdomScore}</span>
                    <span className="karma-label" style={{ color: '#fff' }}>KARMA</span>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card streak" style={{ borderColor: 'rgba(234, 179, 8, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.2)' }}><Crown size={20} color="#eab308" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{streak} Days</span>
                        <span className="stat-label">Royal Streak</span>
                    </div>
                </div>
                <div className="stat-card discipline" style={{ borderColor: 'rgba(234, 179, 8, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.2)' }}><GraduationCap size={20} color="#eab308" /></div>
                    <div className="stat-info">
                        <span className="stat-value">Sage</span>
                        <span className="stat-label">Rank</span>
                    </div>
                </div>
            </div>

            <div className="tracker-container" style={{ border: '1px solid rgba(234, 179, 8, 0.1)' }}>
                <div className="week-header">
                    <div className="col-habit">Daily Acts</div>
                    {DAYS.map((day, i) => (
                        <div key={i} className="col-day">{day}</div>
                    ))}
                    <div className="col-progress">Grace</div>
                </div>

                <div className="habits-list">
                    {habits.map(habit => {
                        const progress = calculateProgress(habit.completed);
                        return (
                            <div key={habit.id} className="habit-row">
                                <div className="habit-name-cell">
                                    <span className="habit-name">{habit.name}</span>
                                    <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                {habit.completed.map((isChecked, i) => (
                                    <div key={i} className="checkbox-cell">
                                        <label className="custom-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleDay(habit.id, i)}
                                            />
                                            <span className="checkmark" style={isChecked ? { backgroundColor: '#eab308', borderColor: '#eab308', boxShadow: '0 0 8px rgba(234, 179, 8, 0.4)' } : {}}>
                                                {isChecked && <Check size={10} strokeWidth={4} color="#fff" />}
                                            </span>
                                        </label>
                                    </div>
                                ))}

                                <div className="progress-cell">
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${progress}%`, background: progress === 100 ? '#fff' : '#eab308' }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{progress}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="add-habit-section">
                {isAdding ? (
                    <div className="add-input-row">
                        <input
                            type="text"
                            className="habit-input"
                            placeholder="Enter new act..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            autoFocus
                        />
                        <button className="confirm-add-btn" onClick={addHabit} style={{ background: '#eab308', color: '#fff' }}><Check size={20} /></button>
                        <button className="cancel-add-btn" onClick={() => setIsAdding(false)}><Trash2 size={20} /></button>
                    </div>
                ) : (
                    <button className="add-habit-btn" onClick={() => setIsAdding(true)} style={{ borderColor: 'rgba(234, 179, 8, 0.3)', color: '#eab308' }}>
                        <Plus size={20} />
                        <span>Add New Act</span>
                    </button>
                )}
            </div>

            <div className="saturn-footer-quote">
                "Knowledge is power. Wisdom is liberation."
                <span className="author" style={{ color: '#eab308' }}>- Brihaspati Dev</span>
            </div>
        </div>
    );
};

export default JupiterTracker;
