import React, { useState } from 'react';

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

                <div className="form-group">
                    <label>Place (Min. 3 characters)</label>
                    <input
                        type="text"
                        name="place"
                        placeholder="Type your birth city"
                        value={formData.place}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">GENERATE KUNDLI</button>
            </form>
        </div>
    );
};

export default BirthDetailsForm;
