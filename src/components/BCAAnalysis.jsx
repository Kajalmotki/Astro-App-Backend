import React, { useState } from 'react';
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
        waist: '', // cm (at navel)
        abdomen: '', // cm (often distinct from waist)
        hip: '', // cm (females only)
        shoulder: '', // cm (X-frame)
        wrist: '', // cm (Frame size)
        ankle: '', // cm (Symmetry)
        activityLevel: 'moderate' // sedentary, moderate, active, very_active
    });
    const [result, setResult] = useState(null);

    if (!isOpen) return null;

    // --- UTILS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const fillRandomData = () => {
        setFormData({
            age: Math.floor(Math.random() * (40 - 20) + 20),
            gender: 'male',
            height: Math.floor(Math.random() * (185 - 170) + 170),
            weight: Math.floor(Math.random() * (85 - 65) + 65),
            neck: Math.floor(Math.random() * (42 - 36) + 36),
            waist: Math.floor(Math.random() * (95 - 75) + 75),
            abdomen: Math.floor(Math.random() * (95 - 75) + 75),
            hip: 0,
            shoulder: Math.floor(Math.random() * (130 - 110) + 110),
            wrist: Math.floor(Math.random() * (19 - 16) + 16),
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
            let workout = "";
            let yoga = "";
            let mind = "";

            // --- PHASES ---
            if (i <= 7) {
                // Phase 1: Cleansing & Foundation (Root/Sacral)
                focus = "Detox & Foundation";
                yoga = i % 2 !== 0 ? "Surya Namaskar (5 Rounds)" : yogaPrescription[0]?.name || "Balasana";
                mind = "5 min Breath Awareness (Pranayama)";

                if (cidShape === 'C') workout = "Low Impact Cardio (30 mins)";
                else if (cidShape === 'D') workout = "Bodyweight Circuit (Pushups/Squats)";
                else workout = "Gentle Core Activation";

            } else if (i <= 14) {
                // Phase 2: Fire & Strength (Solar/Heart)
                focus = "Igniting the Fire";
                yoga = yogaPrescription[1]?.name || "Warrior II";
                mind = "Gratitude Journaling";

                if (cidShape === 'C') workout = "Interval Training (HIIT) 20 mins";
                else if (cidShape === 'D') workout = "Heavy Resistance (Gym/Weights)";
                else workout = "Dynamic Pilates/Calisthenics";

            } else {
                // Phase 3: Flow & Expansion (Throat/Third Eye/Crown)
                focus = "Flow & Integration";
                yoga = yogaPrescription[2]?.name || "Tree Pose";
                mind = "Visualization Meditation";

                if (cidShape === 'C') workout = "Endurance Walk/Run (45 mins)";
                else if (cidShape === 'D') workout = "Functional Compound Lifts";
                else workout = "Full Body Mobility Flow";
            }

            // Rest Days (Day 4, 11, 18)
            if (i === 4 || i === 11 || i === 18) {
                workout = "Active Rest (Nature Walk)";
                focus = "Restoration";
                mind = "Sleep Yoga (Nidra)";
            }

            plan.push({ day: i, focus, workout, yoga, mind });
        }
        return plan;
    };


    const calculateBCA = () => {
        const heightCm = parseFloat(formData.height);
        const weightKg = parseFloat(formData.weight);
        const waistCm = parseFloat(formData.waist);
        const shoulderCm = parseFloat(formData.shoulder);
        const neckCm = parseFloat(formData.neck);
        const hipCm = parseFloat(formData.hip) || (waistCm * 1.05); // Estimate for males if 0
        const abdomenCm = parseFloat(formData.abdomen) || waistCm;
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
        // Too thick (fat) or too thin (wasting) is bad. Ideal male ~38cm, female ~33cm.
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
        // Based on weakest link
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

        // Shape Logic (C-I-D)
        let cidShape = "I"; // Balanced
        if (bodyFatPercentage > 25) cidShape = "C"; // Higher Fat
        else if (ffmi > 22) cidShape = "D"; // Muscular

        // --- 5. GENERATE 21-DAY PLAN ---
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
            scoreWeight: 50, // simplified vis
            scoreSMM: cidShape === 'D' ? 80 : 50,
            scoreFat: cidShape === 'C' ? 80 : 40,
            smm: (leanBodyMass * 0.5).toFixed(1),
            fatMass: fatMass.toFixed(1),
            chakras,
            yogaPrescription,
            plan21Day,
            tdee,
            macros: { p: Math.round(weightKg * 1.8), f: Math.round(weightKg), c: Math.round((tdee - (weightKg * 1.8 * 4 + weightKg * 9)) / 4) },
            cidShape
        });
        setStep('RESULT');
    };

    // --- RENDERERS ---

    const [notificationTime, setNotificationTime] = useState('07:00');
    const [isNotifActive, setIsNotifActive] = useState(false);

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

    const renderJourney = () => (
        <div className="bca-results full-page">
            <div className="journey-container">
                <div className="journey-header">
                    <h2 className="journey-title">Your 21-Day Transformation</h2>
                    <p className="journey-sub">A holistic path to align your body with your energy centers. Consistent action creates cellular memory.</p>
                    <button className="bca-close-btn" onClick={onClose} style={{ top: 20, right: 20 }}>&times;</button>
                </div>

                {/* NOTIFICATION SCRIPT BAR */}
                <div className="notification-bar">
                    <span style={{ fontSize: '1.5rem' }}>🔔</span>
                    <div>
                        <p className="notif-text">Commit to consistency.</p>
                        <p style={{ fontSize: '0.8rem', color: '#CBD5E0', margin: 0 }}>Get daily reminders for your Yoga & Meditation.</p>
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
                            {isNotifActive ? 'Active' : 'Turn On'}
                        </button>
                    </div>
                </div>

                <div className="journey-grid">
                    {result.plan21Day.map((day) => {
                        const isRest = day.focus.includes("Restoration");
                        const isMilestone = day.day % 7 === 0;

                        return (
                            <div key={day.day} className={`day-card ${isRest ? 'rest' : ''} ${isMilestone ? 'milestone' : ''}`}>
                                <div className="day-num">
                                    <span>Day {day.day}</span>
                                    <div className="day-check" title="Mark Complete"></div>
                                </div>
                                <div className="day-focus">{day.focus}</div>

                                <div className="day-activity">
                                    <span className="act-icon">🧘</span>
                                    <span>{day.yoga}</span>
                                </div>
                                <div className="day-activity">
                                    <span className="act-icon">💪</span>
                                    <span>{day.workout}</span>
                                </div>
                                <div className="day-activity">
                                    <span className="act-icon">🧠</span>
                                    <span>{day.mind}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

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
                <span className="benefit-pill">🧬 Body Composition</span>
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
            {/* Same fields as before but styled by new CSS */}
            <div style={{ display: 'flex', gap: '15px' }}>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Height (cm)</label><input name="height" type="number" value={formData.height} onChange={handleInputChange} /></div>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Weight (kg)</label><input name="weight" type="number" value={formData.weight} onChange={handleInputChange} /></div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Age</label><input name="age" type="number" value={formData.age} onChange={handleInputChange} /></div>
                <div className="bca-input-group" style={{ flex: 1 }}><label>Gender</label><select name="gender" value={formData.gender} onChange={handleInputChange}><option value="male">Male</option><option value="female">Female</option></select></div>
            </div>

            <h4 style={{ color: '#81E6D9', marginTop: '10px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Circumferences (cm)</h4>
            <div style={{ display: 'flex', gap: '15px' }}><div className="bca-input-group" style={{ flex: 1 }}><label>Waist</label><input name="waist" type="number" value={formData.waist} onChange={handleInputChange} /></div><div className="bca-input-group" style={{ flex: 1 }}><label>Shoulder</label><input name="shoulder" type="number" value={formData.shoulder} onChange={handleInputChange} /></div></div>
            <div style={{ display: 'flex', gap: '15px' }}><div className="bca-input-group" style={{ flex: 1 }}><label>Neck</label><input name="neck" type="number" value={formData.neck} onChange={handleInputChange} /></div><div className="bca-input-group" style={{ flex: 1 }}><label>Wrist</label><input name="wrist" type="number" value={formData.wrist} onChange={handleInputChange} /></div></div>
            <div className="bca-input-group"><label>Abdomen (Visceral)</label><input name="abdomen" type="number" value={formData.abdomen} onChange={handleInputChange} /></div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="bca-action-btn" onClick={calculateBCA}>Analyze Energy</button>
            </div>
        </div>
    );

    const renderResult = () => (
        <div className="bca-results">
            {/* HEADER */}
            <div className="blueprint-header">
                <div>
                    <h2 className="blueprint-title">Energy & Body Blueprint</h2>
                    <p style={{ color: '#A0AEC0', marginTop: '5px' }}>Harmony Score: <strong style={{ color: '#fff' }}>{Math.round((result.chakras.reduce((a, b) => a + b.score, 0) / 7))}%</strong></p>
                </div>
                <button className="bca-close-btn" onClick={onClose} style={{ position: 'static', fontSize: '1rem', border: '1px solid #aaa', padding: '8px 15px', borderRadius: '20px' }}>New</button>
            </div>

            {/* SIDEBAR: RATIOS */}
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
            </div>

            {/* MAIN: CHAKRAS */}
            <div className="result-main">
                <div className="chart-container">
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
                                    <span className="chakra-status">{c.score < 50 ? "Needs Care" : "Balanced"}</span>
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

    return ReactDOM.createPortal(
        <div className="bca-modal-overlay" onClick={onClose}>
            <div className={`bca-modal-content ${step === 'INTRO' || step === 'FORM' ? '' : 'full-page'}`} onClick={e => e.stopPropagation()}>
                {(step === 'INTRO' || step === 'FORM') && <button className="bca-close-btn" onClick={onClose}>&times;</button>}

                {step === 'INTRO' && renderIntro()}
                {step === 'FORM' && renderForm()}
                {step === 'RESULT' && renderResult()}
                {step === 'JOURNEY' && renderJourney()}
            </div>
        </div>,
        document.body
    );
};

export default BCAAnalysis;
