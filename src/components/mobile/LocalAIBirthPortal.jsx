import React, { useState, useCallback, useRef } from 'react';
import { searchCities, getTimezoneForLocation } from '../../services/geoService';
import './LocalAIBirthPortal.css';

const STEPS = ['Name', 'Date', 'Time', 'Place', 'Confirm'];

const LocalAIBirthPortal = ({ onSubmit }) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '', gender: 'Male',
        day: '', month: '', year: '',
        hour: '', min: '', sec: '00',
        cityName: '', lat: null, lng: null,
        timezone: null, timezoneAbbr: '', zoneName: ''
    });
    const [cityQuery, setCityQuery] = useState('');
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isResolvingTZ, setIsResolvingTZ] = useState(false);
    const [ampm, setAmpm] = useState('AM');
    const [error, setError] = useState('');
    const searchTimeout = useRef(null);

    const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleCityInput = useCallback(async (e) => {
        const val = e.target.value;
        setCityQuery(val);
        update('cityName', val);
        update('lat', null);
        update('lng', null);
        update('timezone', null);

        clearTimeout(searchTimeout.current);
        if (val.length < 2) { setCitySuggestions([]); return; }

        searchTimeout.current = setTimeout(async () => {
            setIsSearching(true);
            const results = await searchCities(val);
            setCitySuggestions(results);
            setIsSearching(false);
        }, 400);
    }, []);

    const handleCitySelect = async (city) => {
        setCityQuery(city.displayName);
        setCitySuggestions([]);
        setIsResolvingTZ(true);
        setError('');

        const tz = await getTimezoneForLocation(city.lat, city.lng);
        setFormData(prev => ({
            ...prev,
            cityName: `${city.name}, ${city.country}`,
            lat: city.lat,
            lng: city.lng,
            timezone: tz.gmtOffset,
            timezoneAbbr: tz.abbreviation,
            zoneName: tz.zoneName
        }));
        setIsResolvingTZ(false);
    };

    const canNext = () => {
        if (step === 0) return formData.name.trim().length > 1;
        if (step === 1) return formData.day && formData.month && formData.year && formData.year > 1900;
        if (step === 2) return formData.hour !== '' && formData.min !== '';
        if (step === 3) return formData.lat !== null && formData.lng !== null;
        return true;
    };

    const handleNext = () => {
        if (!canNext()) { setError('Please fill all required fields.'); return; }
        setError('');
        setStep(s => s + 1);
    };

    const handleSubmit = () => {
        // Convert 12h → 24h
        let hour24 = parseInt(formData.hour) || 0;
        if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;

        const finalData = {
            ...formData,
            hour: hour24,
            date: `${String(formData.day).padStart(2, '0')}/${String(formData.month).padStart(2, '0')}/${formData.year}`,
            time: `${String(hour24).padStart(2, '0')}:${String(formData.min).padStart(2, '0')}`
        };
        onSubmit(finalData);
    };

    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="birth-portal-container">
            {/* Progress Bar */}
            <div className="portal-progress">
                {STEPS.map((s, i) => (
                    <div key={s} className={`portal-step-dot ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                        <span className="dot-label">{s}</span>
                    </div>
                ))}
            </div>

            {/* Step 0: Name */}
            {step === 0 && (
                <div className="portal-step-card">
                    <div className="cosmic-icon">☽</div>
                    <h3 className="portal-step-title">Who seeks the stars?</h3>
                    <p className="portal-step-sub">Tell me your name to begin the reading.</p>
                    <input
                        className="portal-input"
                        type="text"
                        placeholder="Your full name..."
                        value={formData.name}
                        onChange={e => update('name', e.target.value)}
                    />
                    <div className="gender-row">
                        {['Male', 'Female', 'Other'].map(g => (
                            <button
                                key={g}
                                className={`gender-btn ${formData.gender === g ? 'active' : ''}`}
                                onClick={() => update('gender', g)}
                            >
                                {g === 'Male' ? '♂' : g === 'Female' ? '♀' : '⚬'} {g}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 1: Date */}
            {step === 1 && (
                <div className="portal-step-card">
                    <div className="cosmic-icon">☀</div>
                    <h3 className="portal-step-title">Date of Birth</h3>
                    <p className="portal-step-sub">The Sun's orbital position at your birth</p>
                    <div className="date-select-row">
                        <div className="date-select-group">
                            <label>Day</label>
                            <select className="portal-select" value={formData.day} onChange={e => update('day', e.target.value)}>
                                <option value="">DD</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d =>
                                    <option key={d} value={d}>{String(d).padStart(2, '0')}</option>)}
                            </select>
                        </div>
                        <div className="date-select-group">
                            <label>Month</label>
                            <select className="portal-select" value={formData.month} onChange={e => update('month', e.target.value)}>
                                <option value="">MM</option>
                                {MONTHS.map((m, i) =>
                                    <option key={i} value={i + 1}>{m}</option>)}
                            </select>
                        </div>
                        <div className="date-select-group">
                            <label>Year</label>
                            <input className="portal-input" type="number" placeholder="YYYY"
                                value={formData.year} onChange={e => update('year', e.target.value)}
                                min="1900" max="2100" />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Time */}
            {step === 2 && (
                <div className="portal-step-card">
                    <div className="cosmic-icon">⏱</div>
                    <h3 className="portal-step-title">Time of Birth</h3>
                    <p className="portal-step-sub">Earth's rotation angle — determines your Lagna</p>

                    {/* AM / PM toggle */}
                    <div className="ampm-row">
                        {['AM', 'PM'].map(p => (
                            <button
                                key={p}
                                className={`ampm-btn ${ampm === p ? 'active' : ''}`}
                                onClick={() => setAmpm(p)}
                            >
                                {p === 'AM' ? '🌅 AM' : '🌙 PM'}
                            </button>
                        ))}
                    </div>

                    <div className="time-row">
                        <div className="date-select-group">
                            <label>Hour (1–12)</label>
                            <select className="portal-select" value={formData.hour} onChange={e => update('hour', e.target.value)}>
                                <option value="">HH</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(h =>
                                    <option key={h} value={h}>{String(h).padStart(2, '0')}</option>)}
                            </select>
                        </div>
                        <div className="date-select-group">
                            <label>Minute</label>
                            <select className="portal-select" value={formData.min} onChange={e => update('min', e.target.value)}>
                                <option value="">MM</option>
                                {Array.from({ length: 60 }, (_, i) => i).map(m =>
                                    <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
                            </select>
                        </div>
                        <div className="date-select-group">
                            <label>Second</label>
                            <select className="portal-select" value={formData.sec} onChange={e => update('sec', e.target.value)}>
                                {Array.from({ length: 60 }, (_, i) => i).map(s =>
                                    <option key={s} value={s}>{String(s).padStart(2, '0')}</option>)}
                            </select>
                        </div>
                    </div>
                    <p className="portal-note">⚠ Even 4 minutes difference shifts the Ascendant by ~1°. Be as precise as possible.</p>
                </div>
            )}

            {/* Step 3: Place */}
            {step === 3 && (
                <div className="portal-step-card">
                    <div className="cosmic-icon">🌍</div>
                    <h3 className="portal-step-title">Place of Birth</h3>
                    <p className="portal-step-sub">Exact latitude & longitude sets your sky orientation</p>
                    <div className="city-search-box">
                        <input
                            className="portal-input"
                            type="text"
                            placeholder="Search any city worldwide..."
                            value={cityQuery}
                            onChange={handleCityInput}
                        />
                        {isSearching && <div className="search-loading">🔍 Searching...</div>}
                        {citySuggestions.length > 0 && (
                            <div className="city-results">
                                {citySuggestions.map((c, i) => (
                                    <div key={i} className="city-result-item" onClick={() => handleCitySelect(c)}>
                                        <span className="city-result-name">📍 {c.name}, {c.state}{c.state ? ', ' : ''}{c.country}</span>
                                        <span className="city-result-coords">{c.lat.toFixed(4)}°, {c.lng.toFixed(4)}°</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {isResolvingTZ && <div className="tz-loading">⏳ Resolving timezone...</div>}
                    {formData.lat && (
                        <div className="geo-resolved-card">
                            <p>✅ Location Resolved</p>
                            <p>📍 {formData.cityName}</p>
                            <p>Lat: {formData.lat.toFixed(6)}° | Lng: {formData.lng.toFixed(6)}°</p>
                            <p>🕐 Timezone: {formData.zoneName} (UTC{formData.timezone >= 0 ? '+' : ''}{formData.timezone}) [{formData.timezoneAbbr}]</p>
                        </div>
                    )}
                </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
                <div className="portal-step-card">
                    <div className="cosmic-icon">✨</div>
                    <h3 className="portal-step-title">Birth Profile Ready</h3>
                    <div className="confirm-data-card">
                        <div className="confirm-row"><span>Name</span><strong>{formData.name} ({formData.gender})</strong></div>
                        <div className="confirm-row"><span>Date</span><strong>{String(formData.day).padStart(2, '0')}/{String(formData.month).padStart(2, '0')}/{formData.year}</strong></div>
                        <div className="confirm-row"><span>Time</span><strong>{String(formData.hour).padStart(2, '0')}:{String(formData.min).padStart(2, '0')}:{String(formData.sec).padStart(2, '0')}</strong></div>
                        <div className="confirm-row"><span>Place</span><strong>{formData.cityName}</strong></div>
                        <div className="confirm-row"><span>Latitude</span><strong>{formData.lat?.toFixed(4)}°</strong></div>
                        <div className="confirm-row"><span>Longitude</span><strong>{formData.lng?.toFixed(4)}°</strong></div>
                        <div className="confirm-row"><span>Timezone</span><strong>{formData.zoneName} (UTC{formData.timezone >= 0 ? '+' : ''}{formData.timezone})</strong></div>
                    </div>
                </div>
            )}

            {error && <p className="portal-error">{error}</p>}

            {/* Navigation */}
            <div className="portal-nav">
                {step > 0 && (
                    <button className="portal-btn secondary" onClick={() => { setStep(s => s - 1); setError(''); }}>
                        ← Back
                    </button>
                )}
                {step < 4 ? (
                    <button className="portal-btn primary" onClick={handleNext} disabled={!canNext()}>
                        Next →
                    </button>
                ) : (
                    <button className="portal-btn golden full-width" onClick={handleSubmit}>
                        ✨ Lock & Generate Kundli
                    </button>
                )}
            </div>
        </div>
    );
};

export default LocalAIBirthPortal;
