import React, { useState, useRef } from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './ChakraYogaPage.css';

import BCAAnalysis from '../BCAAnalysis';

const ChakraYogaPage = ({ isOpen, onClose, chakra }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBcaOpen, setIsBcaOpen] = useState(false);
    const audioRef = useRef(null);

    // If no chakra is selected, don't render content (modal won't be visible anyway)
    if (!chakra) return null;

    const chakraData = {
        'Muladhara': {
            sanskrit: 'मूलाधार',
            meaning: 'Root Support',
            frequency: '396 Hz',
            frequencyName: 'Liberation of Guilt and Fear',
            yogaPoses: [
                { name: 'Tadasana', english: 'Mountain Pose', desc: 'Connects you to the earth, building stability and grounding.', duration: 'Hold for 1-3 minutes (breathing deeply)', image: 'muladhara_tadasana.png' },
                { name: 'Vrikshasana', english: 'Tree Pose', desc: 'Develops balance and focus, strengthening your roots.', duration: 'Hold for 30-60 seconds per leg', image: 'muladhara_vrikshasana.png' },
                { name: 'Virabhadrasana I', english: 'Warrior I', desc: 'Builds determination and connection to the ground.', duration: 'Hold for 30-60 seconds per side', image: 'muladhara_virabhadrasana.png' }
            ],
            color: '#E74C3C',
            mantra: 'LAM'
        },
        'Svadhisthana': {
            sanskrit: 'स्वाधिष्ठान',
            meaning: 'Sweetness / One\'s Own Place',
            frequency: '417 Hz',
            frequencyName: 'Undoing Situations and Facilitating Change',
            yogaPoses: [
                { name: 'Baddha Konasana', english: 'Bound Angle Pose', desc: 'Opens the hips and releases emotional tension.', duration: 'Hold for 3-5 minutes (gentle stretch)', image: 'svadhisthana_baddhakonasana.png' },
                { name: 'Upavistha Konasana', english: 'Wide-Angle Seated Forward Bend', desc: 'Stimulates flow and creativity.', duration: 'Hold for 2-4 minutes', image: 'svadhisthana_upavisthakonasana.png' },
                { name: 'Eka Pada Rajakapotasana', english: 'Pigeon Pose', desc: 'Deep hip opener to release stored emotions.', duration: 'Hold for 2-3 minutes per side', image: 'svadhisthana_ekapadarajakapotasana.png' }
            ],
            color: '#E67E22',
            mantra: 'VAM'
        },
        'Manipura': {
            sanskrit: 'मणिपूर',
            meaning: 'City of Jewels',
            frequency: '528 Hz',
            frequencyName: 'Transformation and Miracles (DNA Repair)',
            yogaPoses: [
                { name: 'Navasana', english: 'Boat Pose', desc: 'Strengthens the core and ignites inner fire (Agni).', duration: 'Hold for 30-60 seconds (repeat 3x)', image: 'manipura_navasana.png' },
                { name: 'Dhanurasana', english: 'Bow Pose', desc: 'Stimulates the solar plexus and digestive organs.', duration: 'Hold for 20-30 seconds (repeat 2x)', image: 'manipura_dhanurasana.png' },
                { name: 'Surya Namaskar', english: 'Sun Salutations', desc: 'Builds heat and honors the source of all power.', duration: 'Perform 5-10 rounds (flowing pace)', image: 'manipura_suryanamaskar.png' }
            ],
            color: '#F1C40F',
            mantra: 'RAM'
        },
        'Anahata': {
            sanskrit: 'अनाहत',
            meaning: 'Unstruck / Unhurt',
            frequency: '639 Hz',
            frequencyName: 'Connecting/Relationships',
            yogaPoses: [
                { name: 'Ustrasana', english: 'Camel Pose', desc: 'Deep backbend that opens the heart center.', duration: 'Hold for 30-60 seconds', image: 'anahata_ustrasana.png' },
                { name: 'Bhujangasana', english: 'Cobra Pose', desc: 'Gentle heart opener allowing love to flow.', duration: 'Hold for 30-45 seconds (repeat 2x)', image: 'anahata_bhujangasana.png' },
                { name: 'Chakrasana', english: 'Wheel Pose', desc: 'Full expression of an open heart and vulnerability.', duration: 'Hold for 15-30 seconds (if comfortable)', image: 'anahata_chakrasana.png' }
            ],
            color: '#2ECC71',
            mantra: 'YAM'
        },
        'Vishuddha': {
            sanskrit: 'विशुद्ध',
            meaning: 'Especially Pure',
            frequency: '741 Hz',
            frequencyName: 'Expression/Solutions',
            yogaPoses: [
                { name: 'Sarvangasana', english: 'Shoulder Stand', desc: 'Stimulates the thyroid and throat area.', duration: 'Hold for 1-3 minutes', image: 'vishuddha_sarvangasana.png' },
                { name: 'Matsyasana', english: 'Fish Pose', desc: 'Opens the throat for clear communication.', duration: 'Hold for 30-60 seconds (counter-pose)', image: 'vishuddha_matsyasana.png' },
                { name: 'Halasana', english: 'Plow Pose', desc: 'Releases tension in the neck and shoulders.', duration: 'Hold for 1-2 minutes', image: 'vishuddha-1.png' }
            ],
            color: '#3498DB',
            mantra: 'HAM'
        },
        'Ajna': {
            sanskrit: 'आज्ञा',
            meaning: 'Command',
            frequency: '852 Hz',
            frequencyName: 'Returning to Spiritual Order',
            yogaPoses: [
                { name: 'Balasana', english: 'Child\'s Pose', desc: 'Connects the third eye to the earth, calming the mind.', duration: 'Hold for 3-5 minutes (resting)', image: 'ajna-3.png' },
                { name: 'Garudasana', english: 'Eagle Pose', desc: 'Requires intense focus and single-pointed concentration.', duration: 'Hold for 30-60 seconds per side', image: 'ajna-3.png' },
                { name: 'Padmasana', english: 'Lotus Pose', desc: 'The ultimate pose for meditation and inner vision.', duration: 'Sit for 5-10 minutes (meditation)', image: 'ajna-3.png' }
            ],
            color: '#6C5CE7',
            mantra: 'OM'
        },
        'Sahasrara': {
            sanskrit: 'सहस्रार',
            meaning: 'Thousand Petaled',
            frequency: '963 Hz',
            frequencyName: 'Awakening Perfect State',
            yogaPoses: [
                { name: 'Sirsasana', english: 'Headstand', desc: 'Directs energy to the crown, reversing gravity\'s flow.', duration: 'Hold for 1-5 minutes (advanced)', image: 'ajna-3.png' },
                { name: 'Savasana', english: 'Corpse Pose', desc: 'Total surrender to the divine and cosmic consciousness.', duration: 'Rest for 5-10 minutes', image: 'ajna-3.png' },
                { name: 'Padmasana', english: 'Lotus Pose', desc: 'Meditation for enlightenment and connection.', duration: 'Sit for 10-20 minutes (silent focus)', image: 'ajna-3.png' }
            ],
            color: '#9B59B6',
            mantra: 'OM' // Or Silence
        }
    };

    const currentChakra = chakraData[chakra.name] || chakraData['Muladhara'];

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <>
            <FullScreenOverlay isOpen={isOpen} onClose={onClose} title={isBcaOpen ? "" : `${chakra.name} Chakra Yoga & Healing`} variant="cool">
                <div className="chakra-yoga-container" style={{ '--accent-color': currentChakra.color }}>
                    {/* Header Section */}
                    <div className="chakra-header">
                        <div className="chakra-symbol-large">{chakra.symbol}</div>
                        <div className="chakra-info">
                            <h2>{chakra.name} <span className="sanskrit">{currentChakra.sanskrit}</span></h2>
                            <p className="meaning">"{currentChakra.meaning}"</p>
                            <p className="description">{chakra.description}</p>
                        </div>
                    </div>

                    {/* Music Player Section */}
                    <div className="music-player-section">
                        <div className="frequency-display">
                            <span className="freq-value">{currentChakra.frequency}</span>
                            <span className="freq-name">{currentChakra.frequencyName}</span>
                        </div>

                        <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
                            {isPlaying ? '⏸' : '▶'}
                        </button>
                        <p className="player-status">{isPlaying ? 'Healing Frequency Playing...' : 'Play Healing Frequency'}</p>

                        <audio ref={audioRef} loop>
                            <source src={`/audio/chakra-${chakra.name.toLowerCase()}.mp3`} type="audio/mp3" />
                        </audio>
                    </div>

                    {/* Yoga Section */}
                    <h3 className="section-title">🧘 Yoga for {chakra.name}</h3>
                    <div className="yoga-grid">
                        {currentChakra.yogaPoses.map((pose, index) => (
                            <div key={pose.name} className="yoga-card" style={{ '--delay': `${index * 0.1}s` }}>
                                <div className="yoga-image-container">
                                    <img
                                        src={pose.image ? `/images/yoga/${pose.image}` : `/images/yoga/${chakra.name.toLowerCase()}-${index + 1}.png`}
                                        alt={pose.name}
                                        className="yoga-pos-img"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="yoga-fallback">
                                        <span className="pose-icon">🧘</span>
                                    </div>
                                </div>
                                <div className="yoga-details">
                                    <h4>{pose.name}</h4>
                                    <span className="english-name">{pose.english}</span>
                                    <p className="pose-duration">⏱ {pose.duration}</p>
                                    <p>{pose.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* BCA Guide Button */}
                    <div style={{ textAlign: 'center', margin: '40px 0' }}>
                        <button
                            className="bca-guide-btn"
                            onClick={() => setIsBcaOpen(true)}
                            style={{
                                background: 'linear-gradient(135deg, #FF6B6B, #556270)',
                                color: 'white',
                                padding: '15px 30px',
                                border: 'none',
                                borderRadius: '30px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
                                transition: 'transform 0.2s',
                            }}
                        >
                            Start BCA Composition Analysis Guide
                        </button>
                    </div>

                    {/* Mantra Section */}
                    <div className="mantra-section">
                        <h4>Beej Mantra</h4>
                        <div className="mantra-circle">
                            {currentChakra.mantra}
                        </div>
                        <p>Chant <strong>{currentChakra.mantra}</strong> while focusing on the chakra location.</p>
                    </div>
                </div>

            </FullScreenOverlay>
            <BCAAnalysis isOpen={isBcaOpen} onClose={() => setIsBcaOpen(false)} />
        </>
    );
};

export default ChakraYogaPage;
