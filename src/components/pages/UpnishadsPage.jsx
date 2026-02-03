import React, { useState } from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './UpnishadsPage.css';

const UpnishadsPage = ({ isOpen, onClose }) => {
    const [expandedCard, setExpandedCard] = useState(null);

    const upanishads = [
        {
            name: "Isha Upanishad",
            sanskrit: "ईशोपनिषद्",
            veda: "Shukla Yajurveda",
            verses: 18,
            theme: "The Divine in All",
            keyTeaching: "The entire universe is pervaded by the Lord. Renounce attachment and enjoy through renunciation.",
            quote: {
                sanskrit: "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।",
                translation: "All this—whatever exists in this changing universe—should be covered by the Lord."
            }
        },
        {
            name: "Kena Upanishad",
            sanskrit: "केनोपनिषद्",
            veda: "Sama Veda",
            verses: 35,
            theme: "The Unknown Brahman",
            keyTeaching: "Brahman is beyond the reach of speech and mind, yet it is the power behind all perception.",
            quote: {
                sanskrit: "यद्वाचानभ्युदितं येन वागभ्युद्यते ।",
                translation: "That which cannot be expressed by speech, but by which speech is expressed—know that alone to be Brahman."
            }
        },
        {
            name: "Katha Upanishad",
            sanskrit: "कठोपनिषद्",
            veda: "Krishna Yajurveda",
            verses: 119,
            theme: "Death and Immortality",
            keyTeaching: "The dialogue between Nachiketa and Yama reveals the secret of death and the immortal Self.",
            quote: {
                sanskrit: "उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत ।",
                translation: "Arise! Awake! And stop not until the goal is reached."
            }
        },
        {
            name: "Mandukya Upanishad",
            sanskrit: "माण्डूक्योपनिषद्",
            veda: "Atharva Veda",
            verses: 12,
            theme: "States of Consciousness",
            keyTeaching: "Analysis of OM and the four states of consciousness: waking, dreaming, deep sleep, and Turiya.",
            quote: {
                sanskrit: "ओमित्येतदक्षरमिदं सर्वम् ।",
                translation: "OM—this syllable is all this. All that is past, present, and future is OM."
            }
        },
        {
            name: "Taittiriya Upanishad",
            sanskrit: "तैत्तिरीयोपनिषद्",
            veda: "Krishna Yajurveda",
            verses: 31,
            theme: "Five Sheaths of Self",
            keyTeaching: "Describes the five koshas (sheaths) and the joyful exclamation of Self-realization.",
            quote: {
                sanskrit: "सत्यं वद । धर्मं चर ।",
                translation: "Speak the truth. Practice righteousness."
            }
        },
        {
            name: "Chandogya Upanishad",
            sanskrit: "छान्दोग्योपनिषद्",
            veda: "Sama Veda",
            verses: 627,
            theme: "Tat Tvam Asi",
            keyTeaching: "Contains the famous teaching 'Tat Tvam Asi' (That Thou Art), revealing the identity of Atman and Brahman.",
            quote: {
                sanskrit: "तत्त्वमसि ।",
                translation: "That thou art. (You are That—the ultimate reality.)"
            }
        },
        {
            name: "Brihadaranyaka Upanishad",
            sanskrit: "बृहदारण्यकोपनिषद्",
            veda: "Shukla Yajurveda",
            verses: 435,
            theme: "The Great Forest Teaching",
            keyTeaching: "The largest Upanishad, covering creation, self-knowledge, and the famous 'Neti Neti' method.",
            quote: {
                sanskrit: "असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ।",
                translation: "Lead me from unreal to real, from darkness to light."
            }
        },
        {
            name: "Mundaka Upanishad",
            sanskrit: "मुण्डकोपनिषद्",
            veda: "Atharva Veda",
            verses: 64,
            theme: "Two Types of Knowledge",
            keyTeaching: "Distinguishes between higher knowledge (Brahma-vidya) and lower knowledge (worldly sciences).",
            quote: {
                sanskrit: "सत्यमेव जयते नानृतम् ।",
                translation: "Truth alone triumphs, not falsehood."
            }
        }
    ];

    const concepts = [
        { name: "Brahman", description: "The ultimate, unchanging reality—the cosmic principle underlying all existence." },
        { name: "Atman", description: "The individual self or soul, which is ultimately identical with Brahman." },
        { name: "Maya", description: "The illusion that veils the true nature of reality, making the world appear diverse." },
        { name: "Moksha", description: "Liberation from the cycle of rebirth, achieved through Self-knowledge." }
    ];

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="उपनिषद् - The Upanishads" variant="warm">
            <div className="upanishads-container">
                <p className="upanishads-intro">
                    The Upanishads are philosophical texts that form the concluding part of the Vedas.
                    They explore the nature of reality, consciousness, and the path to liberation through profound dialogues and teachings.
                </p>

                {/* Core Concepts */}
                <div className="concepts-section">
                    <h3>🕉️ Core Concepts</h3>
                    <div className="concepts-grid">
                        {concepts.map((concept) => (
                            <div key={concept.name} className="concept-card">
                                <h4>{concept.name}</h4>
                                <p>{concept.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upanishads List */}
                <h3 className="section-title">📜 Principal Upanishads</h3>
                <div className="upanishads-grid">
                    {upanishads.map((upanishad, index) => (
                        <div
                            key={upanishad.name}
                            className={`upanishad-card ${expandedCard === index ? 'expanded' : ''}`}
                            style={{ '--delay': `${index * 0.05}s` }}
                            onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                        >
                            <div className="upanishad-header">
                                <div className="upanishad-title">
                                    <h4>{upanishad.name}</h4>
                                    <span className="sanskrit">{upanishad.sanskrit}</span>
                                </div>
                                <span className="verse-count">{upanishad.verses} verses</span>
                            </div>

                            <div className="upanishad-meta">
                                <span className="veda-source">{upanishad.veda}</span>
                                <span className="theme">{upanishad.theme}</span>
                            </div>

                            <div className="upanishad-details">
                                <p className="key-teaching">{upanishad.keyTeaching}</p>

                                <div className="quote-box">
                                    <p className="quote-sanskrit">{upanishad.quote.sanskrit}</p>
                                    <p className="quote-translation">"{upanishad.quote.translation}"</p>
                                </div>
                            </div>

                            <span className="expand-hint">
                                {expandedCard === index ? 'Click to collapse' : 'Click to read more'}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="upanishads-footer">
                    <p>🙏 "Knowledge is the eye of all." — Aitareya Upanishad</p>
                </div>
            </div>
        </FullScreenOverlay>
    );
};

export default UpnishadsPage;
