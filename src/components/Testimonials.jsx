import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([
        {
            id: 1,
            name: "Aravind Sharma",
            role: "Business Consultant",
            text: "AstroRevo has completely changed how I look at my career path. The insights are incredibly accurate and personalized.",
            avatar: "https://i.pravatar.cc/150?u=aravind"
        },
        {
            id: 2,
            name: "Priya Patel",
            role: "Yoga Instructor",
            text: "The AI assistant is like having a personal guru in my pocket. It helps me align my daily activities with cosmic rhythms.",
            avatar: "https://i.pravatar.cc/150?u=priya"
        },
        {
            id: 3,
            name: "Michael Chen",
            role: "Software Engineer",
            text: "I was skeptical at first, but the depth of the AstroRevo Chart is mind-blowing. It's much more than just a horoscope.",
            avatar: "https://i.pravatar.cc/150?u=michael"
        },
        {
            id: 4,
            name: "Sarah Jenkins",
            role: "Artist",
            text: "Beautifully designed and very intuitive. The readings resonate deeply with my creative process.",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        }
    ]);

    const [newTestimonial, setNewTestimonial] = useState({ name: '', text: '' });
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTestimonial.name && newTestimonial.text) {
            const testimonial = {
                id: Date.now(),
                name: newTestimonial.name,
                role: "New Seeker",
                text: newTestimonial.text,
                avatar: `https://i.pravatar.cc/150?u=${newTestimonial.name}`
            };
            setTestimonials([testimonial, ...testimonials]);
            setNewTestimonial({ name: '', text: '' });
            setShowForm(false);
        }
    };

    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <h2 className="section-title">What Our Seekers Say</h2>
                <div className="testimonials-grid">
                    {testimonials.map((t) => (
                        <div key={t.id} className="testimonial-card">
                            <div className="testimonial-header">
                                <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                                <div className="testimonial-info">
                                    <h3 className="testimonial-name">{t.name}</h3>
                                    <p className="testimonial-role">{t.role}</p>
                                </div>
                            </div>
                            <p className="testimonial-text">"{t.text}"</p>
                            <div className="testimonial-stars">
                                {Array(5).fill(0).map((_, i) => (
                                    <span key={i} className="star">★</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="testimonial-actions">
                    {!showForm ? (
                        <button className="add-testimonial-btn" onClick={() => setShowForm(true)}>
                            Share Your Experience
                        </button>
                    ) : (
                        <div className="testimonial-form-container">
                            <h3>Share Your Journey</h3>
                            <form onSubmit={handleSubmit} className="testimonial-form">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={newTestimonial.name}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="Tell us about your experience..."
                                    value={newTestimonial.text}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                    required
                                ></textarea>
                                <div className="form-buttons">
                                    <button type="submit" className="submit-btn">Post Testimonial</button>
                                    <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
