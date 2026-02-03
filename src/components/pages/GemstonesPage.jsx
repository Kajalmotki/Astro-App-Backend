import React, { useState } from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './GemstonesPage.css';

const GemstonesPage = ({ isOpen, onClose }) => {
    const [selectedGem, setSelectedGem] = useState(null);

    const gems = [
        {
            name: "Ruby",
            sanskrit: "माणिक्य (Manikya)",
            planet: "Sun (Surya)",
            planetSymbol: "☉",
            color: "#dc2626",
            gradient: "linear-gradient(135deg, #dc2626, #991b1b, #7f1d1d)",
            benefits: [
                "Enhances leadership qualities",
                "Boosts confidence and vitality",
                "Improves circulation and digestion",
                "Brings fame and recognition"
            ],
            whoShouldWear: "Those with weak Sun in birth chart, seeking authority positions, or facing low self-esteem.",
            caution: "Avoid if Sun is malefic or in 6th, 8th, or 12th house without proper analysis.",
            finger: "Ring finger",
            metal: "Gold"
        },
        {
            name: "Pearl",
            sanskrit: "मोती (Moti)",
            planet: "Moon (Chandra)",
            planetSymbol: "☽",
            color: "#e5e5e5",
            gradient: "linear-gradient(135deg, #f5f5f5, #e5e5e5, #d4d4d4)",
            benefits: [
                "Soothes emotions and reduces anger",
                "Promotes mental peace and clarity",
                "Enhances intuition and creativity",
                "Supports maternal health"
            ],
            whoShouldWear: "Cancer ascendants, those with emotional instability, or weak Moon in horoscope.",
            caution: "Should be natural, cultured pearls may not provide astrological benefits.",
            finger: "Little finger",
            metal: "Silver"
        },
        {
            name: "Red Coral",
            sanskrit: "मूंगा (Moonga)",
            planet: "Mars (Mangal)",
            planetSymbol: "♂",
            color: "#ea580c",
            gradient: "linear-gradient(135deg, #ea580c, #c2410c, #9a3412)",
            benefits: [
                "Boosts courage and energy",
                "Overcomes fear and lethargy",
                "Supports bone and blood health",
                "Enhances determination"
            ],
            whoShouldWear: "Those in defense, sports, or facing Mangal Dosha. Aries and Scorpio ascendants.",
            caution: "Consult astrologer if Mars is in enemy signs or afflicted.",
            finger: "Ring finger",
            metal: "Gold or Copper"
        },
        {
            name: "Emerald",
            sanskrit: "पन्ना (Panna)",
            planet: "Mercury (Budh)",
            planetSymbol: "☿",
            color: "#059669",
            gradient: "linear-gradient(135deg, #059669, #047857, #065f46)",
            benefits: [
                "Sharpens intellect and memory",
                "Enhances communication skills",
                "Supports business and negotiations",
                "Brings emotional balance"
            ],
            whoShouldWear: "Writers, speakers, students, and those in commerce. Gemini and Virgo ascendants.",
            caution: "Natural emeralds with minor inclusions are preferred for astrological use.",
            finger: "Little finger",
            metal: "Gold"
        },
        {
            name: "Yellow Sapphire",
            sanskrit: "पुखराज (Pukhraj)",
            planet: "Jupiter (Guru)",
            planetSymbol: "♃",
            color: "#eab308",
            gradient: "linear-gradient(135deg, #eab308, #ca8a04, #a16207)",
            benefits: [
                "Bestows wisdom and knowledge",
                "Attracts wealth and prosperity",
                "Enhances spiritual growth",
                "Supports marital harmony"
            ],
            whoShouldWear: "Sagittarius and Pisces ascendants, teachers, judges, and spiritual seekers.",
            caution: "Must be natural and untreated. Ceylon sapphires are highly valued.",
            finger: "Index finger",
            metal: "Gold"
        },
        {
            name: "Diamond",
            sanskrit: "हीरा (Heera)",
            planet: "Venus (Shukra)",
            planetSymbol: "♀",
            color: "#a5b4fc",
            gradient: "linear-gradient(135deg, #ffffff, #e0e7ff, #c7d2fe)",
            benefits: [
                "Attracts love and luxury",
                "Enhances artistic abilities",
                "Improves marital relationships",
                "Brings financial prosperity"
            ],
            whoShouldWear: "Taurus and Libra ascendants, artists, and those seeking romantic fulfillment.",
            caution: "Ensure diamond is flawless. Even small defects can cause negative effects.",
            finger: "Middle or ring finger",
            metal: "Platinum or Gold"
        },
        {
            name: "Blue Sapphire",
            sanskrit: "नीलम (Neelam)",
            planet: "Saturn (Shani)",
            planetSymbol: "♄",
            color: "#1e40af",
            gradient: "linear-gradient(135deg, #1e40af, #1e3a8a, #172554)",
            benefits: [
                "Brings rapid wealth and success",
                "Provides discipline and focus",
                "Protects against misfortune",
                "Aids career advancement"
            ],
            whoShouldWear: "Capricorn and Aquarius ascendants, or those under Sade-Sati with favorable Saturn.",
            caution: "MUST be tested first. Wear for 3 days before committing. Can have strong effects.",
            finger: "Middle finger",
            metal: "Silver or Gold"
        },
        {
            name: "Hessonite",
            sanskrit: "गोमेद (Gomed)",
            planet: "Rahu (North Node)",
            planetSymbol: "☊",
            color: "#92400e",
            gradient: "linear-gradient(135deg, #b45309, #92400e, #78350f)",
            benefits: [
                "Removes confusion and fear",
                "Success in politics and law",
                "Protects from hidden enemies",
                "Helps overcome addictions"
            ],
            whoShouldWear: "Those with Rahu Mahadasha or Rahu in favorable positions.",
            caution: "Should be worn only after proper horoscope analysis of Rahu's position.",
            finger: "Middle finger",
            metal: "Silver"
        },
        {
            name: "Cat's Eye",
            sanskrit: "लहसुनिया (Lehsunia)",
            planet: "Ketu (South Node)",
            planetSymbol: "☋",
            color: "#84cc16",
            gradient: "linear-gradient(135deg, #84cc16, #65a30d, #4d7c0f)",
            benefits: [
                "Enhances spiritual insight",
                "Provides protection from negativity",
                "Develops intuition and psychic ability",
                "Guards against hidden enemies"
            ],
            whoShouldWear: "Spiritual seekers, mystics, and those with Ketu Mahadasha.",
            caution: "Strong gem with sudden effects. Test thoroughly before permanent wear.",
            finger: "Middle or little finger",
            metal: "Silver or Gold"
        }
    ];

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="नवरत्न - The Nine Sacred Gems" variant="default">
            <div className="gemstones-container">
                <p className="gems-intro">
                    In Vedic astrology, the Navaratna (nine gems) harness the cosmic energies of the nine planets.
                    Each gemstone is believed to amplify positive influences or neutralize negative effects in your horoscope.
                </p>

                <div className="gems-grid">
                    {gems.map((gem, index) => (
                        <div
                            key={gem.name}
                            className={`gem-card ${selectedGem === index ? 'expanded' : ''}`}
                            onClick={() => setSelectedGem(selectedGem === index ? null : index)}
                            style={{ '--gem-color': gem.color, '--gem-gradient': gem.gradient }}
                        >
                            <div className="gem-visual">
                                <div className="gem-stone">
                                    <div className="gem-facet"></div>
                                    <div className="gem-shine"></div>
                                </div>
                            </div>

                            <div className="gem-header">
                                <span className="gem-planet-symbol">{gem.planetSymbol}</span>
                                <div className="gem-titles">
                                    <h3 className="gem-name">{gem.name}</h3>
                                    <span className="gem-sanskrit">{gem.sanskrit}</span>
                                </div>
                            </div>

                            <div className="gem-planet">
                                <span>Planet: {gem.planet}</span>
                            </div>

                            <div className="gem-details">
                                <div className="gem-benefits">
                                    <h4>Benefits</h4>
                                    <ul>
                                        {gem.benefits.map((benefit, i) => (
                                            <li key={i}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="gem-meta">
                                    <div className="meta-item">
                                        <span className="meta-label">Finger</span>
                                        <span className="meta-value">{gem.finger}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">Metal</span>
                                        <span className="meta-value">{gem.metal}</span>
                                    </div>
                                </div>

                                <div className="gem-who">
                                    <h4>Who Should Wear</h4>
                                    <p>{gem.whoShouldWear}</p>
                                </div>

                                <div className="gem-caution">
                                    <span className="caution-icon">⚠️</span>
                                    <p>{gem.caution}</p>
                                </div>
                            </div>

                            <div className="gem-expand-hint">
                                {selectedGem === index ? 'Click to collapse' : 'Click for details'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="gems-footer">
                    <p>💎 Always consult a qualified astrologer before wearing any gemstone for remedial purposes.</p>
                </div>
            </div>
        </FullScreenOverlay>
    );
};

export default GemstonesPage;
