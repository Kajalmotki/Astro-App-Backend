import React, { useState, useEffect, useRef } from 'react';

const BirthDetailsForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        sex: 'Male',
        day: '18',
        month: '1',
        year: '2026',
        hour: '10',
        min: '21',
        sec: '58',
        place: ''
    });

    const [citySearch, setCitySearch] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const cityInputRef = useRef(null);

    // Comprehensive list of major Indian cities
    const indianCities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
        'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
        'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi',
        'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
        'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli-Dharwad',
        'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal',
        'Mira-Bhayandar', 'Thiruvananthapuram', 'Bhiwandi', 'Saharanpur', 'Guntur', 'Amravati', 'Bikaner', 'Noida', 'Jamshedpur', 'Bhilai',
        'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded',
        'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar',
        'Jammu', 'Sangli-Miraj & Kupwad', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon',
        'Udaipur', 'Maheshtala', 'Davanagere', 'Kozhikode', 'Kurnool', 'Rajpur Sonarpur', 'Rajahmundry', 'Bokaro', 'South Dumdum', 'Bellary',
        'Patiala', 'Gopalpur', 'Agartala', 'Bhagalpur', 'Muzaffarnagar', 'Bhatpara', 'Panihati', 'Latur', 'Dhule', 'Tirupati',
        'Rohtak', 'Korba', 'Bhilwara', 'Berhampur', 'Muzaffarpur', 'Ahmednagar', 'Mathura', 'Kollam', 'Avadi', 'Kadapa',
        'Kamarhati', 'Sambalpur', 'Bilaspur', 'Shahjahanpur', 'Satara', 'Bijapur', 'Rampur', 'Shivamogga', 'Chandrapur', 'Junagadh',
        'Thrissur', 'Alwar', 'Bardhaman', 'Kulti', 'Kakinada', 'Nizamabad', 'Parbhani', 'Tumkur', 'Khammam', 'Ozhukarai',
        'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas', 'Ichalkaranji', 'Karnal', 'Bathinda', 'Jalna',
        'Eluru', 'Kirari Suleman Nagar', 'Barasat', 'Purnia', 'Satna', 'Mau', 'Sonipat', 'Farrukhabad', 'Sagar', 'Rourkela',
        'Durg', 'Imphal', 'Ratlam', 'Hapur', 'Arrah', 'Karimnagar', 'Anantapur', 'Etawah', 'Ambernath', 'North Dumdum',
        'Bharatpur', 'Begusarai', 'New Delhi', 'Gandhidham', 'Baranagar', 'Tiruvottiyur', 'Puducherry', 'Sikar', 'Thoothukudi', 'Raurkela Industrial Township',
        'Nagercoil', 'Thanjavur', 'Murwara', 'Naihati', 'Sambhal', 'Nadiad', 'Yamunanagar', 'English Bazar', 'Carlsbad', 'Dindigul',
        'Raichur', 'Raiganj', 'Tiruppur', 'Khora', 'Ghazipur', 'Raniganj', 'Shimla', 'Titagarh', 'Dibrugarh', 'Latur',
        'Kharagpur', 'Dindigul', 'Munger', 'Panchkula', 'Port Blair', 'Daman', 'Silvassa', 'Kavaratti'
    ];

    useEffect(() => {
        if (citySearch.length >= 2) {
            const filtered = indianCities.filter(city =>
                city.toLowerCase().includes(citySearch.toLowerCase())
            ).slice(0, 10); // Limit to 10 results
            setFilteredCities(filtered);
            setShowDropdown(true);
        } else {
            setFilteredCities([]);
            setShowDropdown(false);
        }
    }, [citySearch]);

    // Close dropdown when clicking outside
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
            <h2 className="form-title gold-text">Enter Your Birth Details</h2>
            <form onSubmit={handleSubmit} className="birth-form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Sex</label>
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
                            <input type="number" name="day" value={formData.day} onChange={handleChange} min="1" max="31" />
                            <input type="number" name="month" value={formData.month} onChange={handleChange} min="1" max="12" />
                            <input type="number" name="year" value={formData.year} onChange={handleChange} min="1900" max="2100" />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group flex-1">
                        <label>Time (24 hours format)</label>
                        <div className="time-inputs">
                            <input type="number" name="hour" value={formData.hour} onChange={handleChange} min="0" max="23" />
                            <input type="number" name="min" value={formData.min} onChange={handleChange} min="0" max="59" />
                            <input type="number" name="sec" value={formData.sec} onChange={handleChange} min="0" max="59" />
                        </div>
                    </div>
                </div>

                <div className="form-group" ref={cityInputRef} style={{ position: 'relative' }}>
                    <label>Birth City</label>
                    <input
                        type="text"
                        name="place"
                        placeholder="Search Indian cities..."
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
                                No cities found. Try a different search.
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="submit-btn">GENERATE KUNDLI</button>
            </form>
        </div>
    );
};

export default BirthDetailsForm;
