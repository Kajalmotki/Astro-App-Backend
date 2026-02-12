import React, { useState } from 'react';
import { X, MapPin, Calendar, User, Clock, Search } from 'lucide-react';
import './WesternBirthForm.css';

// Simple list of major cities for offline search (Can be expanded)
const CITIES = [
    { name: "New York, USA", lat: 40.7128, lng: -74.0060 },
    { name: "London, UK", lat: 51.5074, lng: -0.1278 },
    { name: "Paris, France", lat: 48.8566, lng: 2.3522 },
    { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
    { name: "Mumbai, India", lat: 19.0760, lng: 72.8777 },
    { name: "Delhi, India", lat: 28.6139, lng: 77.2090 },
    { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093 },
    { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437 },
    { name: "Berlin, Germany", lat: 52.5200, lng: 13.4050 },
    { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708 },
    { name: "Singapore", lat: 1.3521, lng: 103.8198 },
    { name: "Toronto, Canada", lat: 43.6510, lng: -79.3470 },
    { name: "Bangalore, India", lat: 12.9716, lng: 77.5946 },
    { name: "Moscow, Russia", lat: 55.7558, lng: 37.6173 },
    { name: "Beijing, China", lat: 39.9042, lng: 116.4074 },
];

const WesternBirthForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        city: '',
        lat: null,
        lng: null
    });
    const [citySearch, setCitySearch] = useState('');
    const [showCityResults, setShowCityResults] = useState(false);

    const handleCityChange = (e) => {
        const val = e.target.value;
        setCitySearch(val);
        // Basic filtering for demo
        setShowCityResults(true);
        // Reset lat/lng if user types to ensure they pick a validated location
        if (formData.lat) setFormData(prev => ({ ...prev, lat: null, lng: null }));
    };

    const selectCity = (city) => {
        setFormData(prev => ({ ...prev, city: city.name, lat: city.lat, lng: city.lng }));
        setCitySearch(city.name);
        setShowCityResults(false);
    };

    const filteredCities = CITIES.filter(c =>
        c.name.toLowerCase().includes(citySearch.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation
        if (!formData.name || !formData.date || !formData.time) {
            alert("Please fill in Name, Date, and Time.");
            return;
        }
        if (!formData.lat) {
            alert("Please select a City from the list.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="western-form-overlay">
            <div className="western-form-card">
                <button className="close-btn" onClick={onClose}><X size={20} /></button>
                <div className="form-deco-circle"></div>

                <div className="western-form-header">
                    <h3>Create Chart</h3>
                    <p>Western Tropical Zodiac</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* NAME */}
                    <div className="form-group">
                        <label className="form-label">
                            <User size={12} style={{ marginRight: 5, display: 'inline' }} /> Name
                        </label>
                        <input
                            type="text"
                            className="trend-input"
                            placeholder="Enter Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* DATE & TIME grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="form-group">
                            <label className="form-label">
                                <Calendar size={12} style={{ marginRight: 5, display: 'inline' }} /> Date
                            </label>
                            <input
                                type="date"
                                className="trend-input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <Clock size={12} style={{ marginRight: 5, display: 'inline' }} /> Time
                            </label>
                            <input
                                type="time"
                                className="trend-input"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* LOCATION */}
                    <div className="form-group">
                        <label className="form-label">
                            <MapPin size={12} style={{ marginRight: 5, display: 'inline' }} /> Place of Birth
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="trend-input"
                                placeholder="Search City..."
                                value={citySearch}
                                onChange={handleCityChange}
                                onFocus={() => setShowCityResults(true)}
                            // blur handling can be tricky with click, often left to custom hooks
                            />
                            <Search size={16} style={{ position: 'absolute', right: 10, top: 12, color: '#aaa' }} />
                        </div>

                        {showCityResults && citySearch.length > 0 && (
                            <div className="city-results">
                                {filteredCities.length > 0 ? filteredCities.map((c, i) => (
                                    <div key={i} className="city-item" onClick={() => selectCity(c)}>
                                        {c.name}
                                    </div>
                                )) : (
                                    <div className="city-item" style={{ color: '#64748b' }}>No cities found</div>
                                )}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="generate-btn">
                        Generate Natal Chart
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '10px', color: '#64748b' }}>
                        *Uses 100+ precision astronomical algorithms.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default WesternBirthForm;
