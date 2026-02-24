import React, { useState, useEffect, useRef } from 'react';
import './BirthDetailsForm.css';

const BirthDetailsForm = ({ onSubmit, onClose, title = "Enter Your Birth Details", submitLabel = "GENERATE KUNDLI", hideSubmit = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        sex: 'Male',
        day: '18',
        month: '1',
        year: '2026',
        hour: '10',
        min: '21',
        sec: '00',
        place: ''
    });

    const [citySearch, setCitySearch] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const cityInputRef = useRef(null);

    // Comprehensive list of major Indian cities
    const indianCities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
        'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
        'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi',
        'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
        'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur',
        'Mysore', 'Bareilly', 'Aligarh', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal',
        'Thiruvananthapuram', 'Guntur', 'Bikaner', 'Noida', 'Jamshedpur',
        'Cuttack', 'Kochi', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela',
        'Kolhapur', 'Ajmer', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Siliguri', 'Jhansi',
        'Jammu', 'Mangalore', 'Erode', 'Belgaum', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon',
        'Udaipur', 'Kozhikode', 'Kurnool', 'Bokaro', 'Bellary',
        'Patiala', 'Agartala', 'Bhagalpur', 'Muzaffarnagar', 'Latur', 'Dhule', 'Tirupati',
        'Rohtak', 'Korba', 'Bhilwara', 'Muzaffarpur', 'Ahmednagar', 'Mathura', 'Kollam',
        'Sambalpur', 'Bilaspur', 'Shahjahanpur', 'Satara', 'Rampur', 'Shimla', 'Chandrapur', 'Junagadh',
        'Thrissur', 'Alwar', 'Bardhaman', 'Kakinada', 'Nizamabad', 'Tumkur',
        'Bihar Sharif', 'Panipat', 'Darbhanga', 'Dewas', 'Ichalkaranji', 'Karnal', 'Bathinda',
        'New Delhi', 'Gandhidham', 'Puducherry', 'Sikar', 'Thanjavur', 'Nadiad', 'Dindigul',
        'Shimla', 'Dibrugarh', 'Kharagpur', 'Munger', 'Panchkula', 'Port Blair'
    ];

    useEffect(() => {
        if (citySearch.length >= 2) {
            const filtered = indianCities.filter(city =>
                city.toLowerCase().includes(citySearch.toLowerCase())
            ).slice(0, 10);
            setFilteredCities(filtered);
            setShowDropdown(true);
        } else {
            setFilteredCities([]);
            setShowDropdown(false);
        }
    }, [citySearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cityInputRef.current && !cityInputRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCitySearch = (e) => {
        const value = e.target.value;
        setCitySearch(value);
        setFormData({ ...formData, place: value });
    };

    const handleCitySelect = (city) => {
        setCitySearch(city);
        setFormData({ ...formData, place: city });
        setShowDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="birth-form-container" style={{ position: 'relative' }}>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    ✕
                </button>
            )}

            {title && (
                <div className="sec-head" style={{ marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '1.2rem' }}>{title}</h2>
                    <div className="rule" style={{ marginBottom: '16px' }}></div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="birth-form">
                <div className="form-group">
                    <label className="flabel">FULL NAME</label>
                    <input
                        className="finput"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="flabel">GENDER</label>
                        <select className="fselect" name="sex" value={formData.sex} onChange={handleChange}>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="flabel">AYANAMSA</label>
                        <select className="fselect" name="ayanamsa" value={formData.ayanamsa || 'Lahiri'} onChange={handleChange}>
                            <option>Lahiri</option>
                            <option>Raman</option>
                            <option>KP</option>
                        </select>
                    </div>
                </div>

                <div className="form-group flex-1">
                    <label className="flabel">DATE OF BIRTH - DD / MM / YYYY</label>
                    <div className="frow">
                        <input className="finput" type="number" name="day" value={formData.day} onChange={handleChange} min="1" max="31" placeholder="DD" />
                        <input className="finput" type="number" name="month" value={formData.month} onChange={handleChange} min="1" max="12" placeholder="MM" />
                        <input className="finput" type="number" name="year" value={formData.year} onChange={handleChange} min="1900" max="2100" placeholder="YYYY" />
                    </div>
                </div>

                <div className="form-group flex-1">
                    <label className="flabel">TIME OF BIRTH - HH : MM : SS (24H)</label>
                    <div className="frow">
                        <input className="finput" type="number" name="hour" value={formData.hour} onChange={handleChange} min="0" max="23" placeholder="HH" />
                        <input className="finput" type="number" name="min" value={formData.min} onChange={handleChange} min="0" max="59" placeholder="MM" />
                        <input className="finput" type="number" name="sec" value={formData.sec} onChange={handleChange} min="0" max="59" placeholder="SS" />
                    </div>
                </div>

                <div className="form-group" ref={cityInputRef} style={{ position: 'relative' }}>
                    <label className="flabel">BIRTH CITY</label>
                    <input
                        className="finput"
                        type="text"
                        name="place"
                        placeholder="Search cities & villages.."
                        value={citySearch}
                        onChange={handleCitySearch}
                        onFocus={() => citySearch.length >= 2 && setShowDropdown(true)}
                        required
                        autoComplete="off"
                    />

                    {showDropdown && filteredCities.length > 0 && (
                        <div className="city-dropdown">
                            {filteredCities.map((city, index) => (
                                <div
                                    key={index}
                                    className="city-option"
                                    onClick={() => handleCitySelect(city)}
                                >
                                    📍 {city}
                                </div>
                            ))}
                        </div>
                    )}

                    {showDropdown && citySearch.length >= 2 && filteredCities.length === 0 && (
                        <div className="city-dropdown">
                            <div className="city-option" style={{ color: '#888', cursor: 'default' }}>
                                No cities found.
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="submit-btn" style={{ display: hideSubmit ? 'none' : 'block' }}>{submitLabel}</button>
            </form>
        </div>
    );
};

export default BirthDetailsForm;
