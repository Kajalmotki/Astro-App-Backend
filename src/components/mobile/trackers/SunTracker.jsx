import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Check, Sun, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../SaturnTracker.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_SUN_HABITS = [
    { id: 1, name: "Wake up at Sunrise", completed: [true, true, true, true, true, true, true] },
    { id: 2, name: "Surya Namaskar (12x)", completed: [true, false, true, true, true, false, false] },
    { id: 3, name: "Leadership Action", completed: [false, true, true, true, false, true, false] },
    { id: 4, name: "10m Visualization", completed: [true, true, false, true, true, false, false] },
    { id: 5, name: "No Complaining", completed: [false, false, true, true, false, true, false] }
];

const SunTracker = () => {
    const navigate = useNavigate();
    const [habits, setHabits] = useState(DEFAULT_SUN_HABITS);
    const [radianceScore, setRadianceScore] = useState(0);
    const [streak, setStreak] = useState(7);
    const [newHabitName, setNewHabitName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        let points = 0;
        habits.forEach(habit => {
            points += habit.completed.filter(Boolean).length * 10;
        });
        setRadianceScore(points);
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
        <div className="saturn-page-container" style={{ background: 'radial-gradient(circle at top, #3a2a00 0%, #000 100%)' }}>
            <div className="saturn-header" style={{ borderColor: 'rgba(255, 215, 0, 0.2)' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="#FFD700" />
                </button>
                <div className="header-titles">
                    <h2 className="page-title" style={{ color: '#FFD700', fontFamily: 'Cinzel, serif' }}>Solar Radiance</h2>
                    <span className="page-subtitle" style={{ color: '#FDB813' }}>Soul & Vitality</span>
                </div>
                <div className="karma-badge" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)' }}>
                    <span className="karma-value" style={{ color: '#000' }}>{radianceScore}</span>
                    <span className="karma-label" style={{ color: '#000' }}>SHINE</span>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card streak" style={{ borderColor: 'rgba(255, 215, 0, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(255, 215, 0, 0.2)' }}><Zap size={20} color="#FFD700" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{streak} Days</span>
                        <span className="stat-label">Sun Streak</span>
                    </div>
                </div>
                <div className="stat-card discipline" style={{ borderColor: 'rgba(255, 215, 0, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(255, 215, 0, 0.2)' }}><Crown size={20} color="#FFD700" /></div>
                    <div className="stat-info">
                        <span className="stat-value">King</span>
                        <span className="stat-label">Rank</span>
                    </div>
                </div>
            </div>

            <div className="tracker-container" style={{ border: '1px solid rgba(255, 215, 0, 0.1)' }}>
                <div className="week-header">
                    <div className="col-habit">Daily Ritual</div>
                    {DAYS.map((day, i) => (
                        <div key={i} className="col-day">{day}</div>
                    ))}
                    <div className="col-progress">Light</div>
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
                                            <span className="checkmark" style={isChecked ? { backgroundColor: '#FFD700', borderColor: '#FFD700', boxShadow: '0 0 8px rgba(255, 215, 0, 0.5)' } : {}}>
                                                {isChecked && <Check size={10} strokeWidth={4} color="#000" />}
                                            </span>
                                        </label>
                                    </div>
                                ))}

                                <div className="progress-cell">
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${progress}%`, background: progress === 100 ? '#fff' : '#FFD700' }}
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
                            placeholder="Enter new ritual..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            autoFocus
                        />
                        <button className="confirm-add-btn" onClick={addHabit} style={{ background: '#FFD700', color: '#000' }}><Check size={20} /></button>
                        <button className="cancel-add-btn" onClick={() => setIsAdding(false)}><Trash2 size={20} /></button>
                    </div>
                ) : (
                    <button className="add-habit-btn" onClick={() => setIsAdding(true)} style={{ borderColor: 'rgba(255, 215, 0, 0.3)', color: '#FFD700' }}>
                        <Plus size={20} />
                        <span>Add New Ritual</span>
                    </button>
                )}
            </div>

            <div className="saturn-footer-quote">
                "The Sun does not shine for a few, but for all. Be the light."
                <span className="author" style={{ color: '#FFD700' }}>- Surya Dev</span>
            </div>
        </div>
    );
};

export default SunTracker;
