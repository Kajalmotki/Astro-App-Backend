import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './BCAAnalysis.css';

const BCAAnalysis = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('INTRO'); // INTRO, FORM, RESULT, JOURNEY
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        height: '', // cm
        weight: '', // kg
        neck: '', // cm
        shoulder: '', // cm (X-frame)
        chest: '', // cm (New)
        waist: '', // cm (at navel)
        abdomen: '', // cm (often distinct from waist)
        hip: '', // cm (females only)
        bicep: '', // cm (New)
        forearm: '', // cm (New/renamed from wrist for clarity but wrist is bone) - keeping wrist for frame
        thigh: '', // cm (New)
        calf: '', // cm (New - good for symmetry but keeping simple for now? let's stick to core request)
        wrist: '', // cm (Frame size)
        ankle: '', // cm (Symmetry)
        activityLevel: 'moderate' // sedentary, moderate, active, very_active
    });
    const [result, setResult] = useState(null);
    const [notificationTime, setNotificationTime] = useState('07:00');
    const [isNotifActive, setIsNotifActive] = useState(false);

    // Reset to INTRO when opened
    useEffect(() => {
        if (isOpen) {
            setStep('INTRO');
        }
    }, [isOpen]);

    // --- ROUTINE PLAYER STATE (Moved to Top) ---
    const [activeRoutine, setActiveRoutine] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);

    // --- UTILS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const fillRandomData = () => {
        const isMale = Math.random() > 0.5;
        setFormData({
            age: Math.floor(Math.random() * (40 - 20) + 20),
            gender: isMale ? 'male' : 'female',
            height: Math.floor(Math.random() * (185 - 160) + 160),
            weight: Math.floor(Math.random() * (90 - 55) + 55),
            neck: Math.floor(Math.random() * (42 - 32) + 32),
            shoulder: Math.floor(Math.random() * (130 - 100) + 100),
            chest: Math.floor(Math.random() * (110 - 85) + 85),
            waist: Math.floor(Math.random() * (100 - 65) + 65),
            abdomen: Math.floor(Math.random() * (100 - 65) + 65), // usually similar to waist
            hip: Math.floor(Math.random() * (110 - 85) + 85),
            bicep: Math.floor(Math.random() * (40 - 25) + 25),
            thigh: Math.floor(Math.random() * (65 - 45) + 45),
            wrist: Math.floor(Math.random() * (19 - 15) + 15),
            ankle: 22,
            activityLevel: 'moderate'
        });
    };

    const generate21DayPlan = (profile) => {
        const plan = [];
        const { cidShape, yogaPrescription, chakras } = profile;

        // Loop 21 days
        for (let i = 1; i <= 21; i++) {
            let focus = "";
            let routine = [];

            // --- PHASES ---
            if (i <= 7) {
                // Phase 1: Cleansing & Foundation (Root/Sacral)
                focus = "Detox & Foundation";
                const asana = i % 2 !== 0 ? "Surya Namaskar (Sun Salutation)" : (yogaPrescription[0]?.name || "Balasana");

                routine = [
                    { time: "5 min", activity: "Joint Release (Pawanmuktasana Series)", type: "warmup" },
                    { time: "5 min", activity: "Cat-Cow & Child's Pose Flow", type: "yoga" },
                    { time: "8 min", activity: `${asana} - 5 Rounds Slow`, type: "yoga" },
                    { time: "7 min", activity: cidShape === 'C' ? "Brisk Walk / Spot Jogging" : "Malasana (Squat) & Lunges", type: "workout" },
                    { time: "5 min", activity: "Pranayama (Kapalbhati - Skull Shining)", type: "mind" }
                ];

            } else if (i <= 14) {
                // Phase 2: Fire & Strength (Solar/Heart)
                focus = "Igniting the Fire";
                const asana = yogaPrescription[1]?.name || "Warrior II";

                routine = [
                    { time: "5 min", activity: "Active Warmup (Jumping Jacks/High Knees)", type: "warmup" },
                    { time: "5 min", activity: "Boat Pose (Navasana) Intervals", type: "yoga" },
                    { time: "8 min", activity: `${asana} & Reverse Warrior Flow`, type: "yoga" },
                    { time: "7 min", activity: cidShape === 'D' ? "Pushups & Plank Holds" : "Burpees (Modified) & Climbers", type: "workout" },
                    { time: "5 min", activity: "Breath of Fire (Bhastrika)", type: "mind" }
                ];

            } else {
                // Phase 3: Flow & Expansion (Throat/Third Eye/Crown)
                focus = "Flow & Integration";
                const asana = yogaPrescription[2]?.name || "Tree Pose";

                routine = [
                    { time: "5 min", activity: "Neck & Shoulder Opening", type: "warmup" },
                    { time: "5 min", activity: "Tree Pose (Vrikshasana) Balance", type: "yoga" },
                    { time: "10 min", activity: `Vinyasa Flow focusing on ${asana}`, type: "yoga" },
                    { time: "5 min", activity: "Inversion Prep (Bridge/Shoulder Stand)", type: "workout" },
                    { time: "5 min", activity: "Nadi Shodhana (Alt Nostril Breathing)", type: "mind" }
                ];
            }

            // Rest Days (Day 4, 11, 18)
            if (i === 4 || i === 11 || i === 18) {
                focus = "Restoration";
                routine = [
                    { time: "5 min", activity: "Gentle Spinal Twists", type: "warmup" },
                    { time: "10 min", activity: "Legs Up The Wall (Viparita Karani)", type: "yoga" },
                    { time: "5 min", activity: "Supta Baddha Konasana (Reclined Bound Angle)", type: "yoga" },
                    { time: "5 min", activity: "Deep Belly Breathing", type: "mind" },
                    { time: "5 min", activity: "Gratitude Journaling", type: "mind" }
                ];
            }

            plan.push({ day: i, focus, routine });
        }
        return plan;
    };


    const calculateBCA = () => {
        const heightCm = parseFloat(formData.height);
        const weightKg = parseFloat(formData.weight);
        const waistCm = parseFloat(formData.waist);
        const shoulderCm = parseFloat(formData.shoulder);
        const chestCm = parseFloat(formData.chest) || shoulderCm * 0.85; // Fallback
        const neckCm = parseFloat(formData.neck);
        const hipCm = parseFloat(formData.hip) || (waistCm * 1.05);
        const abdomenCm = parseFloat(formData.abdomen) || waistCm;
        const bicepCm = parseFloat(formData.bicep) || (chestCm * 0.35); // Approx fallback
        const thighCm = parseFloat(formData.thigh) || (waistCm * 0.6); // Approx fallback
        const wristCm = parseFloat(formData.wrist);

        if (!heightCm || !weightKg) return;

        // --- 1. BASIC METRICS ---
        const bmi = (weightKg / ((heightCm / 100) ** 2)).toFixed(1);
        let frameSize = "Medium";
        const r = wristCm ? heightCm / wristCm : 0;
        if (formData.gender === 'male') { if (r > 10.4) frameSize = "Small"; else if (r < 9.6) frameSize = "Large"; }
        else { if (r > 11.0) frameSize = "Small"; else if (r < 10.1) frameSize = "Large"; }

        // --- 2. 7-CHAKRA ANALYSIS (Holistic Logic) ---
        // 1. Root (Muladhara): Linked to Bone/Structure & Adrenals. (Wrist/Ankle robustness)
        const rootScore = Math.min(100, (wristCm / 16) * 85);

        // 2. Sacral (Swadhisthana): Linked to Water/Fluids & Hips. (Hip/Waist Ratio)
        const wbr = waistCm / (hipCm || waistCm);
        const sacralScore = Math.max(20, 100 - (Math.abs(0.85 - wbr) * 100)); // Ideal 0.85

        // 3. Solar Plexus (Manipura): Digestion/Visceral Fat. (Abdomen)
        const visceralLevel = (abdomenCm / heightCm * 20).toFixed(0);
        const solarScore = Math.max(10, 100 - (visceralLevel * 6));

        // 4. Heart (Anahata): Circulation/Chest. (Shoulder width proxy for chest expansion)
        const heartScore = Math.min(100, (shoulderCm / waistCm) * 60);

        // 5. Throat (Vishuddha): Thyroid/Metabolism. (Neck circumference sweet spot)
        const idealNeck = formData.gender === 'male' ? 38 : 33;
        const neckDiff = Math.abs(neckCm - idealNeck);
        const throatScore = Math.max(30, 100 - (neckDiff * 5));

        // 6. Third Eye (Ajna): Sleep/Stress (Inferred from Age & Activity).
        const thirdEyeScore = 85; // Placeholder

        // 7. Crown (Sahasrara): Overall Harmony (Golden Ratio proximity).
        const shoulderToWaist = (shoulderCm / waistCm);
        const ratioDiff = Math.abs(1.618 - shoulderToWaist);
        const crownScore = Math.max(40, 100 - (ratioDiff * 200));

        const chakras = [
            { name: "Root", score: rootScore, icon: "🔴", desc: "Foundation & Stability" },
            { name: "Sacral", score: sacralScore, icon: "🟠", desc: "Fluidity & Creation" },
            { name: "Solar Plexus", score: solarScore, icon: "🟡", desc: "Energy & Digest" },
            { name: "Heart", score: heartScore, icon: "🟢", desc: "Balance & Flow" },
            { name: "Throat", score: throatScore, icon: "🔵", desc: "Metabolism" },
            { name: "Third Eye", score: thirdEyeScore, icon: "🟣", desc: "Clarity" },
            { name: "Crown", score: crownScore, icon: "⚪", desc: "Harmony" }
        ];

        // --- 3. YOGA PRESCRIPTION ---
        let yogaPrescription = [];
        const weakestChakra = [...chakras].sort((a, b) => a.score - b.score)[0];

        if (weakestChakra.name === "Solar Plexus") {
            yogaPrescription = [
                { name: "Navasana (Boat)", purpose: "Ignite Agni (Fire)", icon: "🔥" },
                { name: "Paschimottanasana", purpose: "Compress Abdomen", icon: "🧘" },
                { name: "Kapalabhati", purpose: "Detox Breath", icon: "💨" }
            ];
        } else if (weakestChakra.name === "Root") {
            yogaPrescription = [
                { name: "Vrikshasana (Tree)", purpose: "Grounding", icon: "🌳" },
                { name: "Warrior I", purpose: "Leg Stability", icon: "⚔️" },
                { name: "Malasana (Squat)", purpose: "Earth Connection", icon: "🐸" }
            ];
        } else {
            yogaPrescription = [
                { name: "Surya Namaskar", purpose: "Total Flow", icon: "☀️" },
                { name: "Trikonasana", purpose: "Balance", icon: "🔺" },
                { name: "Shavasana", purpose: "Integration", icon: "✨" }
            ];
        }

        // --- 4. COMPOSITION & SHAPE ---
        // Simple Body Fat (Navy)
        let bodyFatPercentage = formData.gender === 'male'
            ? 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450
            : 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
        bodyFatPercentage = Math.max(2, Math.min(60, bodyFatPercentage));

        const fatMass = (weightKg * (bodyFatPercentage / 100));
        const leanBodyMass = weightKg - fatMass;
        const ffmi = (leanBodyMass / ((heightCm / 100) ** 2)).toFixed(1);

        let cidShape = "I"; // Balanced
        if (bodyFatPercentage > 25) cidShape = "C"; // Higher Fat
        else if (ffmi > 22) cidShape = "D"; // Muscular

        // --- 5. ANTHROPOMETRIC RATIOS (New Standards) ---
        const ratios = [];

        // Helper to evaluate ratio
        const checkRatio = (name, current, ideal, desc) => {
            const deviation = Math.abs(1 - (current / ideal)); // % diff from ideal
            let status = "Perfect";
            if (deviation > 0.15) status = "Needs Work";
            else if (deviation > 0.05) status = "Good";

            return { name, current: current.toFixed(2), ideal: ideal.toString(), status, desc };
        };

        if (formData.gender === 'male') {
            ratios.push(checkRatio(
                "Shoulder-to-Waist (Adonis)",
                shoulderCm / waistCm,
                1.618,
                "The 'Golden Ratio' for male aesthetics. Broad shoulders and tight waist."
            ));
            ratios.push(checkRatio(
                "Chest-to-Waist",
                chestCm / waistCm,
                1.4,
                "Indicates upper body muscularity relative to core."
            ));
            ratios.push(checkRatio(
                "Waist-to-Hip",
                waistCm / hipCm,
                0.9,
                "Key health indicator. Lower is generally better for metabolism."
            ));
            ratios.push(checkRatio(
                "Bicep-to-Wrist",
                bicepCm / wristCm,
                2.5,
                "Arm size relative to frame. >2.5 indicates significant muscle mass."
            ));
        } else {
            ratios.push(checkRatio(
                "Waist-to-Hip (Hourglass)",
                waistCm / hipCm,
                0.7,
                "The classic indicator of feminine curves and metabolic health."
            ));
            ratios.push(checkRatio(
                "Shoulder-to-Waist",
                shoulderCm / waistCm,
                1.4,
                "Athletic and balanced upper body structure."
            ));
            ratios.push(checkRatio(
                "Thigh-to-Waist",
                thighCm / waistCm,
                0.8,
                "Lower body power and curve proportion."
            ));
        }

        // Common Ratio
        ratios.push(checkRatio(
            "Waist-to-Height",
            waistCm / heightCm,
            0.45,
            "General health marker. Keep below 0.5 for longevity."
        ));


        // --- 6. GENERATE 21-DAY PLAN ---
        const plan21Day = generate21DayPlan({ cidShape, yogaPrescription, chakras });

        // Macros
        const bmr = 10 * weightKg + 6.25 * heightCm - 5 * formData.age + (formData.gender === 'male' ? 5 : -161);
        const tdee = Math.round(bmr * 1.375);

        setResult({
            frameSize,
            shoulderToWaist: shoulderToWaist.toFixed(3),
            bf: bodyFatPercentage.toFixed(1),
            ffmi,
            visceralLevel,
            idealWeightStr: `${(heightCm - 105).toFixed(1)} - ${(heightCm - 95).toFixed(1)} kg`,
            scoreWeight: 50,
            scoreSMM: cidShape === 'D' ? 80 : 50,
            scoreFat: cidShape === 'C' ? 80 : 40,
            smm: (leanBodyMass * 0.5).toFixed(1),
            fatMass: fatMass.toFixed(1),
            chakras,
            yogaPrescription,
            plan21Day,
            tdee,
            macros: { p: Math.round(weightKg * 1.8), f: Math.round(weightKg), c: Math.round((tdee - (weightKg * 1.8 * 4 + weightKg * 9)) / 4) },
            cidShape,
            ratios // Pass ratios to result
        });
        setStep('RESULT');
    };

    // --- RENDERERS ---

    // --- ROUTINE PLAYER STATE ---
    // (Moved to top)

    // Audio Helper
    const speak = (text) => {
        if (isMuted || !window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // Stop previous
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        // Try to pick a calm voice if available (usually female voices sound calmer in browser defaults)
        const voices = window.speechSynthesis.getVoices();
        const calmVoice = voices.find(v => v.name.includes("Female") || v.name.includes("Google US English"));
        if (calmVoice) utterance.voice = calmVoice;
        window.speechSynthesis.speak(utterance);
    };

    // Parse time string to seconds (e.g. "5 min" -> 300)
    const parseSeconds = (timeStr) => {
        const min = parseInt(timeStr.split(' ')[0]);
        return min * 60;
    };

    const startRoutine = (day) => {
        const activities = day.routine;
        setActiveRoutine({
            day: day.day,
            focus: day.focus,
            activities,
            currentIdx: 0
        });
        setTimer(parseSeconds(activities[0].time));
        setShowPlayer(true);
        setIsPlaying(true);
        speak(`Day ${day.day}. ${day.focus}. Let's begin with ${activities[0].activity}`);
    };

    const handleNextActivity = () => {
        if (!activeRoutine) return;
        const nextIdx = activeRoutine.currentIdx + 1;

        if (nextIdx < activeRoutine.activities.length) {
            setActiveRoutine(prev => ({ ...prev, currentIdx: nextIdx }));
            const nextAct = activeRoutine.activities[nextIdx];
            setTimer(parseSeconds(nextAct.time));
            speak(`Next up. ${nextAct.activity}. ${nextAct.time}`);
        } else {
            // Finished
            setIsPlaying(false);
            speak("Routine complete. Great job aligning your energy today.");
            // Optional: Close player after short delay or show summary screen
            setTimeout(() => setShowPlayer(false), 5000);
        }
    };

    const handlePrevActivity = () => {
        if (!activeRoutine || activeRoutine.currentIdx === 0) return;
        const prevIdx = activeRoutine.currentIdx - 1;
        setActiveRoutine(prev => ({ ...prev, currentIdx: prevIdx }));
        setTimer(parseSeconds(activeRoutine.activities[prevIdx].time));
    };

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => {
        const newMute = !isMuted;
        setIsMuted(newMute);
        if (newMute) window.speechSynthesis.cancel();
    };

    // Timer Logic (Moved Effect Logic here)
    useEffect(() => {
        let interval = null;
        if (isPlaying && timer > 0) {
            interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
        } else if (isPlaying && timer === 0) {
            // Auto-advance
            handleNextActivity();
        }
        return () => clearInterval(interval);
    }, [isPlaying, timer]); // Note hooks are moved, but function refs might need review if strict mode.
    // Actually, simply moving this useEffect to top might issue 'handleNextActivity' not defined if called inside useeffect synchronously (it's not).
    // HOWEVER to be safe, I'd rather define handleNextActivity via useCallback or keep it here but ensure useEffect is DECLARED at top.

    // WAIT. If I move useEffect to top, 'handleNextActivity' is const defined BELOW.
    // In React function components, consts defined below are NOT accessible in code above (TDZ), even in callbacks if the callback was invoked immediately.
    // useEffect invokes callback AFTER render. By then, the consts are assigned.
    // So it IS safe.


    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const renderRoutinePlayer = () => {
        if (!showPlayer || !activeRoutine) return null;
        const currentAct = activeRoutine.activities[activeRoutine.currentIdx];
        const progress = activeRoutine.currentIdx / activeRoutine.activities.length * 100;

        return (
            <div className="routine-overlay">
                <div className="routine-player-card">
                    <button className="player-close" onClick={() => { setShowPlayer(false); setIsPlaying(false); window.speechSynthesis.cancel(); }}>&times;</button>

                    <div className="player-header">
                        <span className="player-day">Day {activeRoutine.day} — {activeRoutine.focus}</span>
                        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
                    </div>

                    <div className="player-main">
                        <div className="timer-circle">
                            <span className="timer-val">{formatTime(timer)}</span>
                            <span className="timer-label">Remaining</span>
                        </div>

                        <div className="active-item-display">
                            {currentAct.image && (
                                <div className="routine-img-container">
                                    <img
                                        src={currentAct.image.includes('/') ? currentAct.image : `/images/yoga/${currentAct.image}`}
                                        onError={(e) => e.target.style.display = 'none'}
                                        alt={currentAct.activity}
                                        className="routine-img"
                                    />
                                </div>
                            )}
                            <span className="act-type-badge">{currentAct.type}</span>
                            <h3 className="act-name-lg">{currentAct.activity}</h3>
                            <p className="act-instruction">Focus on your breath. Align your movement.</p>
                        </div>
                    </div>

                    <div className="player-controls">
                        <button className="ctrl-btn sm" onClick={handlePrevActivity} disabled={activeRoutine.currentIdx === 0}>⏮</button>
                        <button className="ctrl-btn lg" onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</button>
                        <button className="ctrl-btn sm" onClick={handleNextActivity}>⏭</button>
                        <button className="ctrl-btn vol" onClick={toggleMute}>{isMuted ? '🔇' : '🔊'}</button>
                    </div>

                    {activeRoutine.currentIdx < activeRoutine.activities.length - 1 && (
                        <div className="up-next-bar">
                            <span>Up Next: </span>
                            <strong style={{ color: '#fff' }}>{activeRoutine.activities[activeRoutine.currentIdx + 1].activity}</strong>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- RENDERERS ---

    const toggleNotification = () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications");
        } else if (Notification.permission === "granted") {
            setIsNotifActive(!isNotifActive);
            if (!isNotifActive) {
                new Notification("Holistic Journey Reminder", { body: `Great! We'll remind you daily at ${notificationTime} to align your energy.` });
            }
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    setIsNotifActive(true);
                    new Notification("Holistic Journey Reminder", { body: "Notifications enabled!" });
                }
            });
        }
    };

    // --- CALENDAR & JOURNEY LOGIC ---
    const [selectedDay, setSelectedDay] = useState(null);

    const renderCalendar = () => {
        const plan = result?.plan21Day || [];

        return (
            <div className="bca-journey-view full-page" style={{ zIndex: 2147483647 }}>
                {renderRoutinePlayer()}
                {selectedDay && renderDayDetail(selectedDay)}

                <div className="journey-container">
                    <div className="journey-header">
                        <h2 className="journey-title">21-Day Transformation</h2>
                        <p className="journey-sub">Consistent action creates cellular memory. Tap a day to begin.</p>
                        <button className="bca-close-btn" onClick={onClose} style={{ top: 20, right: 20 }}>&times;</button>
                    </div>

                    {/* NOTIFICATION */}
                    <div className="notification-bar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🔔</span>
                            <div>
                                <p className="notif-text" style={{ fontSize: '0.95rem' }}>Daily Reminder</p>
                                <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>Commit to your practice.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="time"
                                className="notif-time-input"
                                value={notificationTime}
                                onChange={(e) => setNotificationTime(e.target.value)}
                            />
                            <button
                                className={`notif-btn ${isNotifActive ? 'active' : ''}`}
                                onClick={toggleNotification}
                            >
                                {isNotifActive ? 'On' : 'Set'}
                            </button>
                        </div>
                    </div>

                    {/* CALENDAR GRID */}
                    <div className="calendar-grid">
                        {plan.map((day) => {
                            const isRest = day.focus.includes("Restoration");
                            const isMilestone = day.day % 7 === 0;
                            // Helper for quick status visualization
                            let statusClass = "normal";
                            if (isRest) statusClass = "rest-day";
                            if (isMilestone) statusClass = "milestone-day";

                            return (
                                <button
                                    key={day.day}
                                    className={`cal-day-btn ${statusClass}`}
                                    onClick={() => setSelectedDay(day)}
                                >
                                    <span className="cal-day-num">{day.day}</span>
                                    {isMilestone && <span className="cal-badge">★</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderDayDetail = (day) => {
        const isRest = day.focus.includes("Restoration");

        return (
            <div className="day-detail-overlay" onClick={() => setSelectedDay(null)}>
                <div className={`day-detail-card ${isRest ? 'rest-theme' : ''}`} onClick={e => e.stopPropagation()}>
                    <button className="detail-close" onClick={() => setSelectedDay(null)}>&times;</button>

                    <div className="detail-header">
                        <span className="detail-day-label">Day {day.day}</span>
                        <h3 className="detail-focus">{day.focus}</h3>
                    </div>

                    <div className="detail-content">
                        <div className="detail-routine-list">
                            <h4 style={{ color: '#A0AEC0', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '15px' }}>
                                Today's Sequence
                            </h4>
                            {day.routine.map((item, idx) => (
                                <div key={idx} className="detail-routine-item">
                                    <div className="detail-time-badge">{item.time}</div>
                                    <span className="detail-act-name">{item.activity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="detail-actions">
                        <button className="start-routine-btn" onClick={() => { setSelectedDay(null); startRoutine(day); }}>
                            <span style={{ marginRight: '8px' }}>▶</span> Start Guided Session
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderIntro = () => (
        <div className="bca-intro">
            <h2 className="bca-title">Holistic Body Blueprint</h2>
            <p className="bca-subtitle">
                Discover the harmony between your physical structure and vital energy centers.
                Designed for lifelong wellness (Ages 15-85).
            </p>
            <div className="bca-benefits">
                <span className="benefit-pill">✨ 7 Chakra Analysis</span>
                <span className="benefit-pill">🌿 21-Day Journey</span>
                <span className="benefit-pill">🧬 Body Standards</span>
            </div>
            <button className="bca-action-btn" onClick={() => setStep('FORM')}>Begin Healing</button>
        </div>
    );

    const renderForm = () => (
        <div className="bca-form-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 className="bca-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Biometrics</h2>
                <button onClick={fillRandomData} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#81E6D9', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}>⚡ Auto-Fill</button>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Age</label><input name="age" type="number" value={formData.age} onChange={handleInputChange} /></div>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Gender</label><select name="gender" value={formData.gender} onChange={handleInputChange}><option value="male">Male</option><option value="female">Female</option></select></div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Height (cm)</label><input name="height" type="number" value={formData.height} onChange={handleInputChange} /></div>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Weight (kg)</label><input name="weight" type="number" value={formData.weight} onChange={handleInputChange} /></div>
            </div>

            <h4 style={{ color: '#81E6D9', marginTop: '10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Circumferences (cm)</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Neck</label><input name="neck" type="number" value={formData.neck} onChange={handleInputChange} /></div>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Waist (Navel)</label><input name="waist" type="number" value={formData.waist} onChange={handleInputChange} /></div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Shoulder</label><input name="shoulder" type="number" value={formData.shoulder} onChange={handleInputChange} /></div>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Chest</label><input name="chest" type="number" value={formData.chest} onChange={handleInputChange} /></div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Bicep</label><input name="bicep" type="number" value={formData.bicep} onChange={handleInputChange} /></div>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Wrist</label><input name="wrist" type="number" value={formData.wrist} onChange={handleInputChange} /></div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Hips</label><input name="hip" type="number" value={formData.hip} onChange={handleInputChange} /></div>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Thigh</label><input name="thigh" type="number" value={formData.thigh} onChange={handleInputChange} /></div>
            </div>
            <div className="bca-input-group"><label>Abdomen (Visceral)</label><input name="abdomen" type="number" value={formData.abdomen} onChange={handleInputChange} /></div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="bca-action-btn" onClick={calculateBCA}>Analyze Energy</button>
            </div>
        </div>
    );

    const renderResult = () => (
        <div className="bca-results" style={{ zIndex: 2147483647 }}>
            {/* HEADER */}
            <div className="blueprint-header">
                <div>
                    <h2 className="blueprint-title">Energy & Body Blueprint</h2>
                    <p style={{ color: '#A0AEC0', marginTop: '5px' }}>Harmony Score: <strong style={{ color: '#fff' }}>{Math.round((result.chakras.reduce((a, b) => a + b.score, 0) / 7))}%</strong></p>
                </div>
                <button className="bca-close-btn" onClick={onClose} style={{ position: 'static', fontSize: '1rem', border: '1px solid #aaa', padding: '8px 15px', borderRadius: '20px' }}>New</button>
            </div>

            {/* SIDEBAR: RATIOS (Updated) */}
            <div className="result-sidebar">
                <span className="section-label">Composition</span>
                <div className="metric-block">
                    <span className="metric-title">Body Fat</span>
                    <span className="metric-value">{result.bf}%</span>
                    <span className="metric-sub">Visceral Lvl: {result.visceralLevel}</span>
                </div>
                <div className="deep-dive-card">
                    <div className="deep-dive-row"><span className="deep-dive-label">FFMI (Muscle)</span><span className="deep-dive-val">{result.ffmi}</span></div>
                    <span className="comparison-text" style={{ marginBottom: '15px' }}>Indicator of root strength.</span>
                    <div className="deep-dive-row"><span className="deep-dive-label">Frame</span><span className="deep-dive-val">{result.frameSize}</span></div>
                </div>

                {/* NEW: RATIO SUMMARY MINI */}
                <div style={{ marginTop: '20px' }}>
                    <span className="section-label">Symmetry Check</span>
                    {result.ratios.map((r, i) => (
                        <div key={i} className="mini-ratio-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: '#A0AEC0' }}>{r.name.split(' ')[0]}</span>
                                <span style={{ color: r.status === 'Perfect' ? '#48BB78' : '#F6AD55' }}>{r.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* MAIN: CHAKRAS & STANDARDS */}
            <div className="result-main">
                <div className="chart-container">

                    {/* 1. CHAKRA ENERGY */}
                    <div className="energy-panel" style={{ marginTop: 0 }}>
                        <div className="energy-title">
                            <span>7-Chakra Vitality Scan</span>
                            <span>Bio-Feedback</span>
                        </div>
                        <div className="chakra-grid">
                            {result.chakras.map((c, i) => (
                                <div key={i} className={`chakra-item ${c.score < 50 ? 'issue' : ''}`}>
                                    <span className="chakra-icon-sm">{c.icon}</span>
                                    <span className="chakra-name">{c.name}</span>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '10px 0' }}>
                                        <div style={{ width: `${c.score}%`, height: '100%', background: c.score < 50 ? '#F6AD55' : '#68D391', borderRadius: '2px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. BODY STANDARDS COMPARISON (New) */}
                    <div className="energy-panel">
                        <div className="energy-title">
                            <span>Anthropometric Standards</span>
                            <span>Golden Ratio Analysis</span>
                        </div>
                        <div className="ratios-grid">
                            {result.ratios.map((ratio, index) => (
                                <div key={index} className="ratio-card">
                                    <div className="ratio-header">
                                        <h4 className="ratio-name">{ratio.name}</h4>
                                        <span className={`ratio-badge ${ratio.status.replace(' ', '-').toLowerCase()}`}>{ratio.status}</span>
                                    </div>
                                    <div className="ratio-vis">
                                        <div className="ratio-bar-bg">
                                            {/* We normalize ideal to 60% of the bar for visualization */}
                                            <div className="ratio-ideal-marker" style={{ left: '60%' }} title={`Ideal: ${ratio.ideal}`}></div>
                                            <div
                                                className="ratio-fill"
                                                style={{
                                                    width: `${Math.min(100, (parseFloat(ratio.current) / parseFloat(ratio.ideal)) * 60)}%`,
                                                    background: ratio.status === 'Perfect' ? '#48BB78' : '#ECC94B'
                                                }}
                                            ></div>
                                        </div>
                                        <div className="ratio-nums">
                                            <span>You: {ratio.current}</span>
                                            <span>Ideal: {ratio.ideal}</span>
                                        </div>
                                    </div>
                                    <p className="ratio-desc">{ratio.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div style={{ marginTop: '30px' }}>
                        <span className="section-label">Correction Strategy (Yoga)</span>
                        <div className="yoga-prescription" style={{ marginTop: '15px' }}>
                            {result.yogaPrescription.map((y, i) => (
                                <div key={i} className="yoga-card-mini">
                                    <span className="yoga-icon">{y.icon}</span>
                                    <span className="yoga-name">{y.name}</span>
                                    <span className="yoga-for">{y.purpose}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: ACTIONS */}
            <div className="result-right">
                <span className="section-label">Nutrition & Path</span>
                <div className="metric-block">
                    <span className="metric-title">Daily Energy (TDEE)</span>
                    <span className="metric-value" style={{ color: '#81E6D9' }}>{result.tdee}</span>
                    <span className="metric-sub">kcal to maintain</span>
                </div>

                <div className="deep-dive-card" style={{ borderLeftColor: '#81E6D9' }}>
                    <div className="deep-dive-row"><span className="deep-dive-label">Protein</span><span className="deep-dive-val">{result.macros.p}g</span></div>
                    <div className="deep-dive-row" style={{ marginTop: '10px' }}><span className="deep-dive-label">Carbs</span><span className="deep-dive-val">{result.macros.c}g</span></div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <button className="bca-action-btn" onClick={() => setStep('JOURNEY')} style={{ width: '100%', textAlign: 'center' }}>
                        Reveal 21-Day Plan
                    </button>
                </div>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="bca-modal-overlay" onClick={onClose} style={{ zIndex: 2147483647 }}>
            <div className={`bca-modal-content ${step === 'INTRO' || step === 'FORM' ? '' : 'full-page'}`} onClick={e => e.stopPropagation()}>
                {(step === 'INTRO' || step === 'FORM') && <button className="bca-close-btn" onClick={onClose}>&times;</button>}

                {step === 'INTRO' && renderIntro()}
                {step === 'FORM' && renderForm()}
                {step === 'RESULT' && result && renderResult()}
                {step === 'JOURNEY' && result && renderCalendar()}
            </div>
        </div>,
        document.body
    );
};

export default BCAAnalysis;
