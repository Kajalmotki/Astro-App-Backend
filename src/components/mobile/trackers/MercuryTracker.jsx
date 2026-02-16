import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Check, MessageCircle, Brain, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../SaturnTracker.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_MERCURY_HABITS = [
    { id: 1, name: "Read 10 Pages", completed: [true, false, true, true, false, true, false] },
    { id: 2, name: "Learn New Word", completed: [true, true, true, true, true, true, true] },
    { id: 3, name: "Solve Puzzle/Sudoku", completed: [false, true, false, true, false, false, false] },
    { id: 4, name: "Write 500 Words", completed: [true, true, false, false, true, false, false] },
    { id: 5, name: "Networking Call", completed: [false, false, true, false, false, true, false] }
];

const MercuryTracker = () => {
    const navigate = useNavigate();
    const [habits, setHabits] = useState(DEFAULT_MERCURY_HABITS);
    const [intellectScore, setIntellectScore] = useState(0);
    const [streak, setStreak] = useState(4);
    const [newHabitName, setNewHabitName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        let points = 0;
        habits.forEach(habit => {
            points += habit.completed.filter(Boolean).length * 10;
        });
        setIntellectScore(points);
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
        <div className="saturn-page-container" style={{ background: 'radial-gradient(circle at top, #064e3b 0%, #022c22 100%)' }}>
            <div className="saturn-header" style={{ borderColor: 'rgba(52, 211, 153, 0.2)' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="#34d399" />
                </button>
                <div className="header-titles">
                    <h2 className="page-title" style={{ color: '#34d399', fontFamily: 'Cinzel, serif' }}>Mercury Mind</h2>
                    <span className="page-subtitle" style={{ color: '#6ee7b7' }}>Intellect & Skill</span>
                </div>
                <div className="karma-badge" style={{ background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', boxShadow: '0 4px 15px rgba(52, 211, 153, 0.3)' }}>
                    <span className="karma-value" style={{ color: '#fff' }}>{intellectScore}</span>
                    <span className="karma-label" style={{ color: '#fff' }}>IQ</span>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card streak" style={{ borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.2)' }}><Brain size={20} color="#34d399" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{streak} Days</span>
                        <span className="stat-label">Smart Streak</span>
                    </div>
                </div>
                <div className="stat-card discipline" style={{ borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.2)' }}><BookOpen size={20} color="#34d399" /></div>
                    <div className="stat-info">
                        <span className="stat-value">Scholar</span>
                        <span className="stat-label">Rank</span>
                    </div>
                </div>
            </div>

            <div className="tracker-container" style={{ border: '1px solid rgba(52, 211, 153, 0.1)' }}>
                <div className="week-header">
                    <div className="col-habit">Learning</div>
                    {DAYS.map((day, i) => (
                        <div key={i} className="col-day">{day}</div>
                    ))}
                    <div className="col-progress">Growth</div>
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
                                            <span className="checkmark" style={isChecked ? { backgroundColor: '#34d399', borderColor: '#34d399', boxShadow: '0 0 8px rgba(52, 211, 153, 0.4)' } : {}}>
                                                {isChecked && <Check size={10} strokeWidth={4} color="#fff" />}
                                            </span>
                                        </label>
                                    </div>
                                ))}

                                <div className="progress-cell">
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${progress}%`, background: progress === 100 ? '#fff' : '#34d399' }}
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
                            placeholder="Enter new skill..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            autoFocus
                        />
                        <button className="confirm-add-btn" onClick={addHabit} style={{ background: '#34d399', color: '#fff' }}><Check size={20} /></button>
                        <button className="cancel-add-btn" onClick={() => setIsAdding(false)}><Trash2 size={20} /></button>
                    </div>
                ) : (
                    <button className="add-habit-btn" onClick={() => setIsAdding(true)} style={{ borderColor: 'rgba(52, 211, 153, 0.3)', color: '#34d399' }}>
                        <Plus size={20} />
                        <span>Add New Skill</span>
                    </button>
                )}
            </div>

            <div className="saturn-footer-quote">
                "Intellect is the sharpest sword. Keep it polished."
                <span className="author" style={{ color: '#34d399' }}>- Budh Dev</span>
            </div>
        </div>
    );
};

export default MercuryTracker;
