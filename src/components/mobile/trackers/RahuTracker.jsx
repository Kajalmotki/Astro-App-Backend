import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Check, Globe, TrendingUp, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../SaturnTracker.css';
import { useAuth } from '../../AuthModal';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_RAHU_HABITS = [
    { id: 1, name: "Cold Outreach (5 people)", completed: [true, false, true, true, false, true, false] },
    { id: 2, name: "Research New Tech", completed: [true, true, true, true, true, true, true] },
    { id: 3, name: "Break a Rule (Safe)", completed: [false, true, false, true, false, false, false] },
    { id: 4, name: "Public Speaking / Video", completed: [true, true, false, false, true, false, false] },
    { id: 5, name: "Work on 'Big Idea'", completed: [false, false, true, false, false, true, false] }
];

const RahuTracker = () => {
    const { user } = useAuth();
    const [habits, setHabits] = useState(DEFAULT_RAHU_HABITS);
    const [conquestScore, setConquestScore] = useState(0);
    const [streak, setStreak] = useState(2);
    const [newHabitName, setNewHabitName] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load Data
    useEffect(() => {
        const loadTrackers = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, 'users', user.uid, 'trackers', 'rahu');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setHabits(docSnap.data().habits || DEFAULT_RAHU_HABITS);
                }
            } catch (e) {
                console.error("Error loading tracker:", e);
            } finally {
                setLoading(false);
            }
        };
        loadTrackers();
    }, [user]);

    // Save Data (Auto-save on change)
    useEffect(() => {
        if (!user || loading) return;

        const saveData = async () => {
            try {
                const docRef = doc(db, 'users', user.uid, 'trackers', 'rahu');
                await setDoc(docRef, {
                    habits,
                    lastUpdated: new Date().toISOString()
                }, { merge: true });
            } catch (e) {
                console.error("Error saving tracker", e);
            }
        };

        const timeoutId = setTimeout(saveData, 1000); // Debounce 1s
        return () => clearTimeout(timeoutId);
    }, [habits, user, loading]);

    useEffect(() => {
        let points = 0;
        habits.forEach(habit => {
            points += habit.completed.filter(Boolean).length * 10;
        });
        setConquestScore(points);
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
        <div className="saturn-page-container" style={{ background: 'radial-gradient(circle at top, #4c1d95 0%, #000 100%)' }}>
            <div className="saturn-header" style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="#8b5cf6" />
                </button>
                <div className="header-titles">
                    <h2 className="page-title" style={{ color: '#8b5cf6', fontFamily: 'Cinzel, serif' }}>Rahu Conquest</h2>
                    <span className="page-subtitle" style={{ color: '#c4b5fd' }}>Ambition & Illusion</span>
                </div>
                <div className="karma-badge" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }}>
                    <span className="karma-value" style={{ color: '#fff' }}>{conquestScore}</span>
                    <span className="karma-label" style={{ color: '#fff' }}>FAME</span>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card streak" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)' }}><Target size={20} color="#8b5cf6" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{streak} Days</span>
                        <span className="stat-label">Hustle Streak</span>
                    </div>
                </div>
                <div className="stat-card discipline" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)' }}><TrendingUp size={20} color="#8b5cf6" /></div>
                    <div className="stat-info">
                        <span className="stat-value">Mogul</span>
                        <span className="stat-label">Rank</span>
                    </div>
                </div>
            </div>

            <div className="tracker-container" style={{ border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                <div className="week-header">
                    <div className="col-habit">Ambition</div>
                    {DAYS.map((day, i) => (
                        <div key={i} className="col-day">{day}</div>
                    ))}
                    <div className="col-progress">Status</div>
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
                                            <span className="checkmark" style={isChecked ? { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6', boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)' } : {}}>
                                                {isChecked && <Check size={10} strokeWidth={4} color="#fff" />}
                                            </span>
                                        </label>
                                    </div>
                                ))}

                                <div className="progress-cell">
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${progress}%`, background: progress === 100 ? '#fff' : '#8b5cf6' }}
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
                            placeholder="Enter new goal..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            autoFocus
                        />
                        <button className="confirm-add-btn" onClick={addHabit} style={{ background: '#8b5cf6', color: '#fff' }}><Check size={20} /></button>
                        <button className="cancel-add-btn" onClick={() => setIsAdding(false)}><Trash2 size={20} /></button>
                    </div>
                ) : (
                    <button className="add-habit-btn" onClick={() => setIsAdding(true)} style={{ borderColor: 'rgba(139, 92, 246, 0.3)', color: '#8b5cf6' }}>
                        <Plus size={20} />
                        <span>Add New Conquest</span>
                    </button>
                )}
            </div>

            <div className="saturn-footer-quote">
                "The world belongs to those who dare to take it."
                <span className="author" style={{ color: '#8b5cf6' }}>- Rahu Dev</span>
            </div>
        </div>
    );
};

export default RahuTracker;
