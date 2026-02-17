import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Check, Award, Flame, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SaturnTracker.css';
import { useAuth } from '../AuthModal';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_HABITS = [
    { id: 1, name: "Wake up at 05:00", completed: [true, true, true, true, true, false, false] },
    { id: 2, name: "Meditation (20m)", completed: [true, false, true, true, false, false, false] },
    { id: 3, name: "Deep Work (4h)", completed: [true, true, true, true, true, true, false] },
    { id: 4, name: "No Sugar", completed: [false, true, false, true, true, false, false] },
    { id: 5, name: "Read Astrology", completed: [true, true, true, false, true, true, true] }
];

const SaturnTracker = () => {
    const { user } = useAuth();
    const [habits, setHabits] = useState(DEFAULT_HABITS);
    const [karmaPoints, setKarmaPoints] = useState(0);
    const [streak, setStreak] = useState(12); // Mock streak for demo
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
                const docRef = doc(db, 'users', user.uid, 'trackers', 'saturn');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setHabits(docSnap.data().habits || DEFAULT_HABITS);
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
                const docRef = doc(db, 'users', user.uid, 'trackers', 'saturn');
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

    // Calculate totals
    useEffect(() => {
        let points = 0;
        habits.forEach(habit => {
            points += habit.completed.filter(Boolean).length * 10;
        });
        setKarmaPoints(points);
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
        <div className="saturn-page-container">
            {/* Header */}
            <div className="saturn-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="#C0C0C0" />
                </button>
                <div className="header-titles">
                    <h2 className="page-title">Saturnian Discipline</h2>
                    <span className="page-subtitle">Master Your Karma</span>
                </div>
                <div className="karma-badge">
                    <span className="karma-value">{karmaPoints}</span>
                    <span className="karma-label">KP</span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-card streak">
                    <div className="stat-icon"><Flame size={20} color="#FF9F1C" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{streak} Days</span>
                        <span className="stat-label">Current Streak</span>
                    </div>
                </div>
                <div className="stat-card discipline">
                    <div className="stat-icon"><Zap size={20} color="#FFD700" /></div>
                    <div className="stat-info">
                        <span className="stat-value">Top 1%</span>
                        <span className="stat-label">Discipline Tier</span>
                    </div>
                </div>
            </div>

            {/* Tracker Grid */}
            <div className="tracker-container">
                <div className="week-header">
                    <div className="col-habit">Habit</div>
                    {DAYS.map((day, i) => (
                        <div key={i} className="col-day">{day}</div>
                    ))}
                    <div className="col-progress">Progress</div>
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
                                            <span className="checkmark">
                                                {isChecked && <Check size={10} strokeWidth={4} />}
                                            </span>
                                        </label>
                                    </div>
                                ))}

                                <div className="progress-cell">
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${progress}%`, background: progress === 100 ? '#4CAF50' : '#FFD700' }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{progress}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Habit Button */}
            <div className="add-habit-section">
                {isAdding ? (
                    <div className="add-input-row">
                        <input
                            type="text"
                            className="habit-input"
                            placeholder="Enter new habit..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            autoFocus
                        />
                        <button className="confirm-add-btn" onClick={addHabit}><Check size={20} /></button>
                        <button className="cancel-add-btn" onClick={() => setIsAdding(false)}><Trash2 size={20} /></button>
                    </div>
                ) : (
                    <button className="add-habit-btn" onClick={() => setIsAdding(true)}>
                        <Plus size={20} />
                        <span>Add New Discipline</span>
                    </button>
                )}

            </div>

            {/* Saturn Quote */}
            <div className="saturn-footer-quote">
                "Discipline is the bridge between goals and accomplishment."
                <span className="author">- Lord Shani</span>
            </div>
        </div>
    );
};

export default SaturnTracker;
