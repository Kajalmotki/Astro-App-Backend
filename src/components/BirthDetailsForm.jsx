import React, { useState, useEffect, useRef } from 'react';

const BirthDetailsForm = ({ onSubmit, title = "Enter Your Birth Details", submitLabel = "GENERATE KUNDLI" }) => {
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
        <div className="birth-form-container glass-card">
            <h2 className="form-title gold-text">{title}</h2>
            <form onSubmit={handleSubmit} className="birth-form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <select name="sex" value={formData.sex} onChange={handleChange}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group flex-1">
                        <label>Date (DD/MM/YYYY)</label>
                        <div className="date-inputs">
                            <input type="number" name="day" value={formData.day} onChange={handleChange} min="1" max="31" placeholder="DD" />
                            <input type="number" name="month" value={formData.month} onChange={handleChange} min="1" max="12" placeholder="MM" />
                            <input type="number" name="year" value={formData.year} onChange={handleChange} min="1900" max="2100" placeholder="YYYY" />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group flex-1">
                        <label>Time (24hr format)</label>
                        <div className="time-inputs">
                            <input type="number" name="hour" value={formData.hour} onChange={handleChange} min="0" max="23" placeholder="HH" />
                            <input type="number" name="min" value={formData.min} onChange={handleChange} min="0" max="59" placeholder="MM" />
                            <input type="number" name="sec" value={formData.sec} onChange={handleChange} min="0" max="59" placeholder="SS" />
                        </div>
                    </div>
                </div>

                <div className="form-group" ref={cityInputRef} style={{ position: 'relative' }}>
                    <label>Birth City</label>
                    <input
                        type="text"
                        name="place"
                        placeholder="Search cities..."
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

                <button type="submit" className="submit-btn">{submitLabel}</button>
            </form>
        </div>
    );
};

export default BirthDetailsForm;
