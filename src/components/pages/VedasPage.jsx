import React, { useState } from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './VedasPage.css';

const VedasPage = ({ isOpen, onClose }) => {
    const [selectedVeda, setSelectedVeda] = useState(null);

    const vedas = [
        {
            name: "Rig Veda",
            sanskrit: "ऋग्वेद",
            icon: "🔥",
            color: "#f97316",
            description: "The oldest and most important of the Vedas, containing 1,028 hymns (suktas) praising the cosmic deities.",
            composition: "~1500-1200 BCE",
            mandals: 10,
            hymns: 1028,
            contents: [
                "Hymns to Agni (fire god)",
                "Prayers to Indra (king of gods)",
                "Verses about Soma (sacred drink)",
                "Creation hymns (Nasadiya Sukta)"
            ],
            sampleShloka: {
                sanskrit: "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।\nहोतारं रत्नधातमम् ॥",
                transliteration: "Agnim īḷe purohitaṃ yajñasya devam ṛtvijam,\nhotāraṃ ratnadhātamam.",
                translation: "I praise Agni, the household priest, the divine minister of sacrifice, who bestows treasures."
            },
            significance: "Foundation of Vedic literature, containing the earliest spiritual insights of humanity about the cosmos, natural forces, and the divine."
        },
        {
            name: "Yajur Veda",
            sanskrit: "यजुर्वेद",
            icon: "🕉️",
            color: "#eab308",
            description: "The 'Veda of Sacrificial Formulas', providing prose mantras and instructions for performing Vedic rituals.",
            composition: "~1200-1000 BCE",
            branches: 2,
            contents: [
                "Ritual procedures (Shukla Yajurveda)",
                "Sacrificial formulas (Krishna Yajurveda)",
                "Construction of fire altars",
                "Chanting instructions for priests"
            ],
            sampleShloka: {
                sanskrit: "ॐ पूर्णमदः पूर्णमिदं पूर्णात् पूर्णमुदच्यते ।\nपूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥",
                transliteration: "Oṃ pūrṇam adaḥ pūrṇam idaṃ pūrṇāt pūrṇam udacyate,\npūrṇasya pūrṇam ādāya pūrṇam evāvaśiṣyate.",
                translation: "That is complete, this is complete. From completeness comes completeness. Taking completeness from completeness, completeness alone remains."
            },
            significance: "Essential guide for priests performing Vedic ceremonies, bridging knowledge and practice in spiritual rituals."
        },
        {
            name: "Sama Veda",
            sanskrit: "सामवेद",
            icon: "🎵",
            color: "#8b5cf6",
            description: "The 'Veda of Melodies', containing musical arrangements of Rig Vedic hymns set to melodic chants.",
            composition: "~1200-1000 BCE",
            verses: 1875,
            contents: [
                "Musical notation (svaras)",
                "Chanting melodies (samagana)",
                "Soma sacrifice songs",
                "Basis of Indian classical music"
            ],
            sampleShloka: {
                sanskrit: "उद्वयं तमसस्परि स्वः पश्यन्त उत्तरम् ।\nदेवं देवत्रा सूर्यमगन्म ज्योतिरुत्तमम् ॥",
                transliteration: "Ud vayaṃ tamasas pari svaḥ paśyanta uttaram,\ndevaṃ devatrā sūryam aganma jyotir uttamam.",
                translation: "Rising above darkness, we behold the highest light—the divine Sun, supreme among the gods."
            },
            significance: "Foundation of Indian music and devotional singing, demonstrating the power of sound in spiritual elevation."
        },
        {
            name: "Atharva Veda",
            sanskrit: "अथर्ववेद",
            icon: "🌿",
            color: "#22c55e",
            description: "The 'Veda of Daily Life', containing spells, charms, and practical wisdom for health, prosperity, and protection.",
            composition: "~1200-1000 BCE",
            hymns: 730,
            contents: [
                "Healing mantras and medicines",
                "Protection from evil",
                "Marriage and household rituals",
                "Philosophical speculations"
            ],
            sampleShloka: {
                sanskrit: "भद्रं कर्णेभिः शृणुयाम देवाः ।\nभद्रं पश्येमाक्षभिर्यजत्राः ॥",
                transliteration: "Bhadraṃ karṇebhiḥ śṛṇuyāma devāḥ,\nbhadraṃ paśyemākṣabhir yajatrāḥ.",
                translation: "O Gods, may we hear auspicious things with our ears, may we see auspicious things with our eyes."
            },
            significance: "Practical guide for daily life, combining spiritual wisdom with healing, protection, and worldly well-being."
        }
    ];

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="चतुर्वेद - The Four Vedas" variant="warm">
            <div className="vedas-container">
                <p className="vedas-intro">
                    The Vedas are the oldest scriptures of Hinduism, composed in Vedic Sanskrit over 3,000 years ago.
                    They form the foundation of all Hindu philosophy, rituals, and spiritual practices.
                </p>

                {!selectedVeda ? (
                    <div className="vedas-grid">
                        {vedas.map((veda, index) => (
                            <div
                                key={veda.name}
                                className="veda-card"
                                style={{ '--veda-color': veda.color, '--delay': `${index * 0.1}s` }}
                                onClick={() => setSelectedVeda(veda)}
                            >
                                <div className="veda-icon">{veda.icon}</div>
                                <h3 className="veda-name">{veda.name}</h3>
                                <span className="veda-sanskrit">{veda.sanskrit}</span>
                                <p className="veda-desc">{veda.description}</p>
                                <span className="veda-cta">Explore →</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="veda-detail">
                        <button className="back-btn" onClick={() => setSelectedVeda(null)}>
                            ← Back to Vedas
                        </button>

                        <div className="veda-header" style={{ '--veda-color': selectedVeda.color }}>
                            <span className="detail-icon">{selectedVeda.icon}</span>
                            <div>
                                <h2>{selectedVeda.name} <span>{selectedVeda.sanskrit}</span></h2>
                                <p>{selectedVeda.composition}</p>
                            </div>
                        </div>

                        <div className="veda-content">
                            <div className="content-section">
                                <h4>📜 Overview</h4>
                                <p>{selectedVeda.description}</p>
                                <p className="significance">{selectedVeda.significance}</p>
                            </div>

                            <div className="content-section">
                                <h4>📚 Contents</h4>
                                <ul className="contents-list">
                                    {selectedVeda.contents.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="shloka-section">
                                <h4>🕉️ Sample Shloka</h4>
                                <div className="shloka-card">
                                    <p className="sanskrit-text">{selectedVeda.sampleShloka.sanskrit}</p>
                                    <p className="transliteration">{selectedVeda.sampleShloka.transliteration}</p>
                                    <p className="translation">"{selectedVeda.sampleShloka.translation}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FullScreenOverlay>
    );
};

export default VedasPage;
