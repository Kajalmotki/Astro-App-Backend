import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Check, Heart, Sparkles, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../SaturnTracker.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_VENUS_HABITS = [
    { id: 1, name: "Skin Care Routine", completed: [true, true, true, true, true, true, true] },
    { id: 2, name: "Dress Up / Grooming", completed: [true, false, true, true, true, false, false] },
    { id: 3, name: "Listen to Music", completed: [false, true, true, true, true, true, true] },
    { id: 4, name: "Create Art / Design", completed: [true, true, false, false, true, false, false] },
    { id: 5, name: "Romantic Gesture", completed: [false, false, true, false, false, true, false] }
];

const VenusTracker = () => {
    const navigate = useNavigate();
    const [habits, setHabits] = useState(DEFAULT_VENUS_HABITS);
    const [blissScore, setBlissScore] = useState(0);
    const [streak, setStreak] = useState(6);
    const [newHabitName, setNewHabitName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        let points = 0;
        habits.forEach(habit => {
            points += habit.completed.filter(Boolean).length * 10;
        });
        setBlissScore(points);
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
        <div className="saturn-page-container" style={{ background: 'radial-gradient(circle at top, #be185d 0%, #000 100%)' }}>
            <div className="saturn-header" style={{ borderColor: 'rgba(236, 72, 153, 0.2)' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="#ec4899" />
                </button>
                <div className="header-titles">
                    <h2 className="page-title" style={{ color: '#ec4899', fontFamily: 'Cinzel, serif' }}>Venusian Bliss</h2>
                    <span className="page-subtitle" style={{ color: '#fbcfe8' }}>Love & Beauty</span>
                </div>
                <div className="karma-badge" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)' }}>
                    <span className="karma-value" style={{ color: '#fff' }}>{blissScore}</span>
                    <span className="karma-label" style={{ color: '#fff' }}>ATTRACT</span>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card streak" style={{ borderColor: 'rgba(236, 72, 153, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.2)' }}><Heart size={20} color="#ec4899" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{streak} Days</span>
                        <span className="stat-label">Lovely Streak</span>
                    </div>
                </div>
                <div className="stat-card discipline" style={{ borderColor: 'rgba(236, 72, 153, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.2)' }}><Sparkles size={20} color="#ec4899" /></div>
                    <div className="stat-info">
                        <span className="stat-value">Muse</span>
                        <span className="stat-label">Rank</span>
                    </div>
                </div>
            </div>

            <div className="tracker-container" style={{ border: '1px solid rgba(236, 72, 153, 0.1)' }}>
                <div className="week-header">
                    <div className="col-habit">Self-Love</div>
                    {DAYS.map((day, i) => (
                        <div key={i} className="col-day">{day}</div>
                    ))}
                    <div className="col-progress">Glow</div>
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
                                            <span className="checkmark" style={isChecked ? { backgroundColor: '#ec4899', borderColor: '#ec4899', boxShadow: '0 0 8px rgba(236, 72, 153, 0.4)' } : {}}>
                                                {isChecked && <Check size={10} strokeWidth={4} color="#fff" />}
                                            </span>
                                        </label>
                                    </div>
                                ))}

                                <div className="progress-cell">
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${progress}%`, background: progress === 100 ? '#fff' : '#ec4899' }}
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
                            placeholder="Enter new self-care..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            autoFocus
                        />
                        <button className="confirm-add-btn" onClick={addHabit} style={{ background: '#ec4899', color: '#fff' }}><Check size={20} /></button>
                        <button className="cancel-add-btn" onClick={() => setIsAdding(false)}><Trash2 size={20} /></button>
                    </div>
                ) : (
                    <button className="add-habit-btn" onClick={() => setIsAdding(true)} style={{ borderColor: 'rgba(236, 72, 153, 0.3)', color: '#ec4899' }}>
                        <Plus size={20} />
                        <span>Add New Self-Care</span>
                    </button>
                )}
            </div>

            <div className="saturn-footer-quote">
                "Beauty begins the moment you decide to be yourself."
                <span className="author" style={{ color: '#ec4899' }}>- Shukra Dev</span>
            </div>
        </div>
    );
};

export default VenusTracker;
