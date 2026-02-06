import React, { useState } from 'react';
import './VedicInfoSection.css';

const VedicInfoSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            number: '1️⃣',
            title: 'ṚG VEDA (Rigveda)',
            subtitle: 'FOUNDATIONAL SOURCE',
            image: '/rigveda_cosmic_scene_1770047373611.png',
            content: {
                intro: 'Jyotiṣa is the "Eye of the Veda" (Veda Chakshu), originating from the Rigveda to harmonize human life with the eternal cosmic order (Ritam).',
                why: 'It provides the celestial blueprint:',
                points: [
                    'The earliest definition of the 360° Zodiac & Solar Path',
                    'Specific mantras connecting Planets (Grahas) to Deities',
                    'The 27 Nakṣatras described as the celestial abodes of Soma',
                    'The concept of Ṛta (Cosmic Truth) as the root of Karma',
                    'Precise time-keeping for Vedic Yajñas (Sacrifices)'
                ],
                concepts: [
                    { name: 'Ṛta (Cosmic Order)', role: 'The foundation of Destiny & Karma' },
                    { name: 'Adityas (12 Suns)', role: 'Prototypes for the 12 Zodiac Signs' },
                    { name: 'Sūrya (Sun)', role: 'Atman (Soul), Time, King of Grahas' },
                    { name: 'Soma (Moon)', role: 'Manas (Mind), Emotions, Fluidity' },
                    { name: 'Nakṣatra Devatās', role: 'Deities ruling psychological patterns' },
                    { name: 'Brihaspati', role: 'Guru, Wisdom, Expansion (Jupiter)' }
                ],
                highlight: '👉 The Rigveda is not just scripture; it is the source code of Vedic Astrology.'
            }
        },
        {
            id: 2,
            number: '2️⃣',
            title: 'Vedāṅga Jyotiṣa',
            subtitle: 'The Bridge Text',
            image: '/vedanga_jyotisa_astronomy_1770047395143.png',
            content: {
                intro: 'Jyotiṣa is one of the six Vedāṅgas (auxiliary sciences of the Vedas).',
                provides: [
                    'Mathematical structure of time',
                    'Tithi, Vara, Nakṣatra, Yoga, Karaṇa',
                    'Calendar & predictive timing'
                ],
                purpose: 'Not prediction originally — but correct timing of Vedic rituals, which later evolved into life predictions.'
            }
        },
        {
            id: 3,
            number: '3️⃣',
            title: 'YAJUR VEDA',
            subtitle: 'Applied & Ritual Timing',
            image: '/yajur_veda_ritual_1770047415934.png',
            content: {
                contribution: [
                    'Muhūrta (auspicious timing)',
                    'Planetary worship context',
                    'Karma-based action results'
                ],
                usage: [
                    'Event timing',
                    'Life-stage transitions',
                    'Action vs destiny balance'
                ]
            }
        },
        {
            id: 4,
            number: '4️⃣',
            title: 'ATHARVA VEDA',
            subtitle: 'Psychological & Karmic Layer',
            image: '/atharva_veda_meditation_1770047434201.png',
            content: {
                contribution: [
                    'Mind patterns',
                    'Fear, anxiety, obstacles',
                    'Health & suffering symbolism'
                ],
                importance: [
                    'Mental stress analysis',
                    'Disease indicators',
                    'Hidden karmas'
                ]
            }
        },
        {
            id: 5,
            number: '5️⃣',
            title: 'Summary & Conclusion',
            subtitle: 'The Complete Picture',
            image: '/vedic_summary_conclusion_1770048627245.png',
            content: {
                type: 'summary',
                table: [
                    { veda: 'Rigveda', role: 'Grahas, Nakṣatras, Cosmic Law', stars: 5 },
                    { veda: 'Yajurveda', role: 'Muhūrta, Karma timing', stars: 4 },
                    { veda: 'Atharvaveda', role: 'Mind, suffering, disease', stars: 3 },
                    { veda: 'Samaveda', role: 'Vibrational philosophy', stars: 1 }
                ],
                clarification: '⚠️ Most predictive rules you experience today are NOT directly from the Vedas themselves, but from classical Jyotiṣa Saṁhitās composed later by Ṛṣis — based on Vedic worldview.',
                framework: ['The Vedas give the cosmic framework', 'The sages gave the operational rules'],
                conclusion: [
                    'Jyotiṣa is Vedic in spirit',
                    'Rigveda is its backbone',
                    'Other Vedas support karma, timing, and psychology',
                    'Predictive precision comes from later classical synthesis'
                ],
                finalMessage: 'This is why Jyotiṣa works even today 🌙✨'
            }
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section className="vedic-info-section">
            <div className="vedic-container">
                {/* Main Header */}
                <div className="vedic-main-header">
                    <h1 className="vedic-title">The Codex from Astronomy</h1>
                </div>

                {/* Carousel */}
                <div className="vedic-carousel">
                    <button className="carousel-nav prev" onClick={prevSlide} aria-label="Previous">
                        ←
                    </button>

                    <div className="carousel-track">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`carousel-card ${index === currentSlide ? 'active' : ''}`}
                                style={{ display: index === currentSlide ? 'grid' : 'none' }}
                            >
                                <div className="card-image-container">
                                    <img src={slide.image} alt={slide.title} className="card-image" />
                                    <div className="card-overlay"></div>
                                </div>
                                <div className="card-content">
                                    <div className="card-header">
                                        <span className="card-subtitle">{slide.subtitle}</span>
                                        <h2 className="card-title">{slide.title}</h2>
                                    </div>

                                    {slide.id === 1 && (
                                        <>
                                            <p className="card-intro">{slide.content.intro}</p>
                                            <h3>Why Rigveda?</h3>
                                            <p>{slide.content.why}</p>
                                            <ul className="card-list">
                                                {slide.content.points.map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))}
                                            </ul>
                                            <h3>📌 Key Rigvedic Concepts used in Jyotiṣa</h3>
                                            <table className="concepts-table">
                                                <thead>
                                                    <tr>
                                                        <th>Concept</th>
                                                        <th>Role in Astrology</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {slide.content.concepts.map((concept, i) => (
                                                        <tr key={i}>
                                                            <td>{concept.name}</td>
                                                            <td>{concept.role}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="highlight-callout">
                                                <p>{slide.content.highlight}</p>
                                            </div>
                                        </>
                                    )}

                                    {slide.id === 2 && (
                                        <>
                                            <p className="card-intro">{slide.content.intro}</p>
                                            <h3>🔑 Vedāṅga Jyotiṣa provides:</h3>
                                            <ul className="card-list">
                                                {slide.content.provides.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                            <h3>📌 Purpose</h3>
                                            <p className="purpose-text">{slide.content.purpose}</p>
                                        </>
                                    )}

                                    {slide.id === 3 && (
                                        <div className="two-col-content">
                                            <div>
                                                <h3>Contribution:</h3>
                                                <ul className="card-list">
                                                    {slide.content.contribution.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h3>Used heavily in:</h3>
                                                <ul className="card-list">
                                                    {slide.content.usage.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {slide.id === 4 && (
                                        <div className="two-col-content">
                                            <div>
                                                <h3>Contribution:</h3>
                                                <ul className="card-list">
                                                    {slide.content.contribution.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h3>Important for:</h3>
                                                <ul className="card-list">
                                                    {slide.content.importance.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {slide.id === 5 && (
                                        <>
                                            <h3>🧾 Summary Table — Vedas & Jyotiṣa</h3>
                                            <table className="concepts-table">
                                                <thead>
                                                    <tr>
                                                        <th>Veda</th>
                                                        <th>Role in Astrology</th>
                                                        <th>Importance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {slide.content.table.map((row, i) => (
                                                        <tr key={i}>
                                                            <td><strong>{row.veda}</strong></td>
                                                            <td>{row.role}</td>
                                                            <td className="stars">{'⭐'.repeat(row.stars)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            <div className="clarification-inline">
                                                <h3>🕯️ Important Clarification</h3>
                                                <p className="warning-text">{slide.content.clarification}</p>
                                                <div className="framework-inline">
                                                    {slide.content.framework.map((item, i) => (
                                                        <div key={i} className="framework-point">
                                                            <strong>{item}</strong>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="conclusion-inline">
                                                <h3>🌟 Final Conclusion</h3>
                                                <ul className="card-list">
                                                    {slide.content.conclusion.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                                <p className="final-msg">{slide.content.finalMessage}</p>
                                            </div>
                                        </>
                                    )}

                                    <button className="read-more-btn">Read More</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-nav next" onClick={nextSlide} aria-label="Next">
                        →
                    </button>

                    {/* Pagination Dots */}
                    <div className="carousel-pagination">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                className={`pagination-dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                        <span className="pagination-text">{currentSlide + 1}/{slides.length}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VedicInfoSection;
