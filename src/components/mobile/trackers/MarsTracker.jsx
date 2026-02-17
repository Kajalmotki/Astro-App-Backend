import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Check, Zap, Dumbbell, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../SaturnTracker.css'; // Reusing Saturn styles for layout foundation
import { useAuth } from '../../AuthModal';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Default Mars Habits (Bodybuilding focused)
const DEFAULT_MARS_HABITS = [
    { id: 1, name: "Heavy Lifting (Gym)", completed: [true, false, true, true, false, true, false] },
    { id: 2, name: "Protein Goal (180g)", completed: [true, true, true, true, true, true, true] },
    { id: 3, name: "Creatine Intake", completed: [true, true, false, true, true, false, false] },
    { id: 4, name: "8 Hours Sleep", completed: [false, true, false, true, false, false, false] },
    { id: 5, name: "Sprints / Cardio", completed: [false, false, true, false, false, true, false] }
];

const MarsTracker = () => {
    const { user } = useAuth();
    const [habits, setHabits] = useState(DEFAULT_MARS_HABITS);
    const [strengthScore, setStrengthScore] = useState(0);
    const [streak, setStreak] = useState(5);
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
                const docRef = doc(db, 'users', user.uid, 'trackers', 'mars');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setHabits(docSnap.data().habits || DEFAULT_MARS_HABITS);
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
                const docRef = doc(db, 'users', user.uid, 'trackers', 'mars');
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

    // Calculate Strength Score
    useEffect(() => {
        let points = 0;
        habits.forEach(habit => {
            points += habit.completed.filter(Boolean).length * 15; // Mars gives more points for hard work!
        });
        setStrengthScore(points);
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
        <div className="saturn-page-container" style={{ background: 'radial-gradient(circle at top, #2b0a0a 0%, #000 100%)' }}>
            {/* Header */}
            <div className="saturn-header" style={{ borderColor: 'rgba(255, 69, 0, 0.2)' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="#C0C0C0" />
                </button>
                <div className="header-titles">
                    <h2 className="page-title" style={{ color: '#FF4500' }}>The Iron Mars</h2>
                    <span className="page-subtitle">Body & Willpower</span>
                </div>
                <div className="karma-badge" style={{ background: 'linear-gradient(135deg, #FF4500 0%, #8B0000 100%)', boxShadow: '0 4px 15px rgba(255, 69, 0, 0.3)' }}>
                    <span className="karma-value" style={{ color: '#fff' }}>{strengthScore}</span>
                    <span className="karma-label" style={{ color: '#fff' }}>POWER</span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-card streak" style={{ borderColor: 'rgba(255, 69, 0, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(255, 69, 0, 0.2)' }}><Activity size={20} color="#FF4500" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{streak} Days</span>
                        <span className="stat-label">Iron Streak</span>
                    </div>
                </div>
                <div className="stat-card discipline" style={{ borderColor: 'rgba(255, 69, 0, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(255, 69, 0, 0.2)' }}><Dumbbell size={20} color="#FF4500" /></div>
                    <div className="stat-info">
                        <span className="stat-value">Warrior</span>
                        <span className="stat-label">Rank</span>
                    </div>
                </div>
            </div>

            {/* Tracker Grid */}
            <div className="tracker-container" style={{ border: '1px solid rgba(255, 69, 0, 0.1)' }}>
                <div className="week-header">
                    <div className="col-habit">Training</div>
                    {DAYS.map((day, i) => (
                        <div key={i} className="col-day">{day}</div>
                    ))}
                    <div className="col-progress">Gain</div>
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
                                            <span className="checkmark" style={isChecked ? { backgroundColor: '#FF4500', borderColor: '#FF4500', boxShadow: '0 0 8px rgba(255, 69, 0, 0.4)' } : {}}>
                                                {isChecked && <Check size={10} strokeWidth={4} color="#fff" />}
                                            </span>
                                        </label>
                                    </div>
                                ))}

                                <div className="progress-cell">
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${progress}%`, background: progress === 100 ? '#4CAF50' : '#FF4500' }}
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
                            placeholder="Enter new exercise..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            autoFocus
                        />
                        <button className="confirm-add-btn" onClick={addHabit}><Check size={20} /></button>
                        <button className="cancel-add-btn" onClick={() => setIsAdding(false)}><Trash2 size={20} /></button>
                    </div>
                ) : (
                    <button className="add-habit-btn" onClick={() => setIsAdding(true)} style={{ borderColor: 'rgba(255, 69, 0, 0.3)', color: '#aaa' }}>
                        <Plus size={20} />
                        <span>Add New Challenge</span>
                    </button>
                )}

            </div>

            {/* Mars Quote */}
            <div className="saturn-footer-quote">
                "Strength does not come from winning. Your struggles develop your strengths."
                <span className="author" style={{ color: '#FF4500' }}>- Mangal Dev</span>
            </div>
        </div>
    );
};

export default MarsTracker;
