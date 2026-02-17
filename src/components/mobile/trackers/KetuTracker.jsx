import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Check, Anchor, EyeOff, PauseCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../SaturnTracker.css';
import { useAuth } from '../../AuthModal';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_KETU_HABITS = [
    { id: 1, name: "Digital Detox (1h)", completed: [true, true, true, false, true, true, true] },
    { id: 2, name: "Meditation / Silence", completed: [true, false, true, true, true, false, false] },
    { id: 3, name: "Declutter Room", completed: [false, true, false, true, false, false, false] },
    { id: 4, name: "Fast / Light Eating", completed: [true, true, false, false, true, false, false] },
    { id: 5, name: "Study Astrology/Occult", completed: [false, false, true, false, false, true, true] }
];

const KetuTracker = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [habits, setHabits] = useState(DEFAULT_KETU_HABITS);
    const [zenScore, setZenScore] = useState(0);
    const [streak, setStreak] = useState(3);
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
                const docRef = doc(db, 'users', user.uid, 'trackers', 'ketu');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setHabits(docSnap.data().habits || DEFAULT_KETU_HABITS);
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
                const docRef = doc(db, 'users', user.uid, 'trackers', 'ketu');
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
        setZenScore(points);
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
        <div className="saturn-page-container" style={{ background: 'radial-gradient(circle at top, #78350f 0%, #000 100%)' }}>
            <div className="saturn-header" style={{ borderColor: 'rgba(217, 119, 6, 0.2)' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="#d97706" />
                </button>
                <div className="header-titles">
                    <h2 className="page-title" style={{ color: '#d97706', fontFamily: 'Cinzel, serif' }}>Ketu Zen</h2>
                    <span className="page-subtitle" style={{ color: '#f59e0b' }}>Detachment & Moksha</span>
                </div>
                <div className="karma-badge" style={{ background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)', boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)' }}>
                    <span className="karma-value" style={{ color: '#fff' }}>{zenScore}</span>
                    <span className="karma-label" style={{ color: '#fff' }}>VOID</span>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card streak" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(217, 119, 6, 0.2)' }}><EyeOff size={20} color="#d97706" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{streak} Days</span>
                        <span className="stat-label">Zen Streak</span>
                    </div>
                </div>
                <div className="stat-card discipline" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(217, 119, 6, 0.2)' }}><Anchor size={20} color="#d97706" /></div>
                    <div className="stat-info">
                        <span className="stat-value">Mystic</span>
                        <span className="stat-label">Rank</span>
                    </div>
                </div>
            </div>

            <div className="tracker-container" style={{ border: '1px solid rgba(217, 119, 6, 0.1)' }}>
                <div className="week-header">
                    <div className="col-habit">Letting Go</div>
                    {DAYS.map((day, i) => (
                        <div key={i} className="col-day">{day}</div>
                    ))}
                    <div className="col-progress">Void</div>
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
                                            <span className="checkmark" style={isChecked ? { backgroundColor: '#d97706', borderColor: '#d97706', boxShadow: '0 0 8px rgba(217, 119, 6, 0.4)' } : {}}>
                                                {isChecked && <Check size={10} strokeWidth={4} color="#fff" />}
                                            </span>
                                        </label>
                                    </div>
                                ))}

                                <div className="progress-cell">
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${progress}%`, background: progress === 100 ? '#fff' : '#d97706' }}
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
                            placeholder="Enter new detachment..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            autoFocus
                        />
                        <button className="confirm-add-btn" onClick={addHabit} style={{ background: '#d97706', color: '#fff' }}><Check size={20} /></button>
                        <button className="cancel-add-btn" onClick={() => setIsAdding(false)}><Trash2 size={20} /></button>
                    </div>
                ) : (
                    <button className="add-habit-btn" onClick={() => setIsAdding(true)} style={{ borderColor: 'rgba(217, 119, 6, 0.3)', color: '#d97706' }}>
                        <Plus size={20} />
                        <span>Add New Detachment</span>
                    </button>
                )}
            </div>

            <div className="saturn-footer-quote">
                "In emptiness, there is fullness. Let go to received."
                <span className="author" style={{ color: '#d97706' }}>- Ketu Dev</span>
            </div>
        </div>
    );
};

export default KetuTracker;
