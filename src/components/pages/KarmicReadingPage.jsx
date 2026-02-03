import React, { useState } from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './KarmicReadingPage.css';

const KarmicReadingPage = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [birthDate, setBirthDate] = useState('');

    const karmaTypes = [
        {
            name: "Sanchita Karma",
            sanskrit: "सञ्चित कर्म",
            icon: "📚",
            description: "The accumulated storehouse of all karmas from countless past lives. This is the total reserve of past actions waiting to bear fruit.",
            analogy: "Like seeds stored in a granary—collected over lifetimes, waiting for the right conditions to sprout."
        },
        {
            name: "Prarabdha Karma",
            sanskrit: "प्रारब्ध कर्म",
            icon: "🎯",
            description: "The portion of Sanchita karma that has ripened and is ready to manifest in this current life. This determines your birth circumstances, body, and major life events.",
            analogy: "Like seeds already planted in the field—they must grow and bear fruit in this lifetime."
        },
        {
            name: "Kriyamana Karma",
            sanskrit: "क्रियमाण कर्म",
            icon: "✨",
            description: "The karma you're creating right now through present actions. This is where your free will operates, shaping your future destiny.",
            analogy: "Like seeds in your hand—you choose which ones to plant and how to nurture them."
        }
    ];

    const lifeLessons = [
        { area: "Relationships", lesson: "Learning to balance giving and receiving, developing healthy boundaries while staying open to love." },
        { area: "Career", lesson: "Finding work that aligns with your soul purpose, not just material success." },
        { area: "Health", lesson: "Understanding the mind-body connection and healing patterns from past lives." },
        { area: "Spirituality", lesson: "Awakening to your higher self and reconnecting with cosmic consciousness." }
    ];

    const remedies = [
        { name: "Charity (Daan)", icon: "🙏", desc: "Giving to those in need neutralizes negative karmas." },
        { name: "Mantra Japa", icon: "🕉️", desc: "Repetition of sacred mantras purifies the mind and soul." },
        { name: "Seva (Service)", icon: "🤝", desc: "Selfless service burns karmic debts and elevates the spirit." },
        { name: "Meditation", icon: "🧘", desc: "Deep meditation dissolves karmic impressions (samskaras)." },
        { name: "Pilgrimage", icon: "🛕", desc: "Visiting sacred places cleanses accumulated negative energies." },
        { name: "Fasting (Vrata)", icon: "🌙", desc: "Conscious fasting on auspicious days purifies body and mind." }
    ];

    const handleExplore = (e) => {
        e.preventDefault();
        if (birthDate) setStep(2);
    };

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="कर्म विश्लेषण - Karmic Reading" variant="warm">
            <div className="karmic-container">
                {step === 1 && (
                    <>
                        <p className="karmic-intro">
                            Karma is the universal law of cause and effect. Every action creates a ripple that returns to us.
                            Understanding your karmic patterns helps you break free from cycles and consciously create your destiny.
                        </p>

                        {/* Three Types of Karma */}
                        <div className="karma-types-section">
                            <h3>🔄 The Three Types of Karma</h3>
                            <div className="karma-types-grid">
                                {karmaTypes.map((karma, index) => (
                                    <div key={karma.name} className="karma-type-card" style={{ '--delay': `${index * 0.15}s` }}>
                                        <span className="karma-icon">{karma.icon}</span>
                                        <h4>{karma.name}</h4>
                                        <span className="karma-sanskrit">{karma.sanskrit}</span>
                                        <p className="karma-desc">{karma.description}</p>
                                        <p className="karma-analogy">"{karma.analogy}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Section */}
                        <div className="explore-section">
                            <h3>🌟 Explore Your Karmic Patterns</h3>
                            <form className="explore-form" onSubmit={handleExplore}>
                                <div className="form-group">
                                    <label>Enter your birth date to receive karmic insights</label>
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="gold-btn">
                                    Reveal My Karmic Insights
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <div className="insights-view">
                        <button className="back-btn" onClick={() => setStep(1)}>← Back</button>

                        {/* Karma Wheel Visual */}
                        <div className="karma-wheel-section">
                            <div className="karma-wheel">
                                <div className="wheel-ring outer"></div>
                                <div className="wheel-ring middle"></div>
                                <div className="wheel-ring inner"></div>
                                <div className="wheel-center">
                                    <span>🕉️</span>
                                </div>
                                <div className="wheel-spoke s1"></div>
                                <div className="wheel-spoke s2"></div>
                                <div className="wheel-spoke s3"></div>
                            </div>
                            <p className="wheel-note">The wheel of karma turns eternally. Every action creates a reaction.</p>
                        </div>

                        {/* Life Lessons */}
                        <div className="lessons-section">
                            <h3>📖 Your Life Lessons</h3>
                            <div className="lessons-grid">
                                {lifeLessons.map((lesson) => (
                                    <div key={lesson.area} className="lesson-card">
                                        <h4>{lesson.area}</h4>
                                        <p>{lesson.lesson}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Remedies */}
                        <div className="remedies-section">
                            <h3>🙏 Karmic Remedies</h3>
                            <p className="remedies-intro">
                                While Prarabdha karma must be experienced, these practices help neutralize negative patterns
                                and create positive Kriyamana karma for the future.
                            </p>
                            <div className="remedies-grid">
                                {remedies.map((remedy) => (
                                    <div key={remedy.name} className="remedy-card">
                                        <span className="remedy-icon">{remedy.icon}</span>
                                        <h4>{remedy.name}</h4>
                                        <p>{remedy.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wisdom Quote */}
                        <div className="wisdom-card">
                            <p className="wisdom-quote">
                                "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"
                            </p>
                            <p className="wisdom-translation">
                                "You have the right to work only, but never to its fruits."
                            </p>
                            <span className="wisdom-source">— Bhagavad Gita 2.47</span>
                        </div>
                    </div>
                )}
            </div>
        </FullScreenOverlay>
    );
};

export default KarmicReadingPage;
