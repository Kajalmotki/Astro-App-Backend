import React, { useState } from 'react';
import ChakraYogaPage from './pages/ChakraYogaPage';
import './ChakraEnergy.css';

const ChakraEnergy = () => {
    const [selectedChakra, setSelectedChakra] = useState(null);

    const chakras = [
        { name: 'Sahasrara', color: '#E9D8FD', rgb: '233, 216, 253', symbol: 'ॐ', description: 'Crown: Pure Consciousness', petals: 1000, yantra: 'circle' },
        { name: 'Ajna', color: '#B794F4', rgb: '183, 148, 244', symbol: 'ॐ', description: 'Third Eye: Intuition', petals: 2, yantra: 'circle' },
        { name: 'Vishuddha', color: '#63B3ED', rgb: '99, 179, 237', symbol: 'हं', description: 'Throat: Expression', petals: 16, yantra: 'circle' },
        { name: 'Anahata', color: '#68D391', rgb: '104, 211, 145', symbol: 'यं', description: 'Heart: Love & Balance', petals: 12, yantra: 'hexagram' },
        { name: 'Manipura', color: '#F6E05E', rgb: '246, 224, 94', symbol: 'रं', description: 'Solar Plexus: Power', petals: 10, yantra: 'triangle' },
        { name: 'Svadhisthana', color: '#F6AD55', rgb: '246, 173, 85', symbol: 'वं', description: 'Sacral: Creativity', petals: 6, yantra: 'crescent' },
        { name: 'Muladhara', color: '#FC8181', rgb: '252, 129, 129', symbol: 'लं', description: 'Root: Stability', petals: 4, yantra: 'square' }
    ];

    const renderYantra = (type, color) => {
        if (type === 'square') return <div className="yantra-square" style={{ borderColor: color }}></div>;
        if (type === 'triangle') return <div className="yantra-triangle" style={{ borderTopColor: color }}></div>;
        if (type === 'crescent') return <div className="yantra-crescent" style={{ boxShadow: `0 4px 0 0 ${color}` }}></div>;
        if (type === 'hexagram') return (
            <div className="yantra-hexagram">
                <div className="hex-tri up" style={{ borderBottomColor: color }}></div>
                <div className="hex-tri down" style={{ borderTopColor: color }}></div>
            </div>
        );
        return null; // Circles are default
    };

    const renderPetals = (count, color, name) => {
        if (count === 1000) return <div className="thousand-petals-aura"></div>;

        const petals = [];
        const step = 360 / count;

        // Organic Petal Sizing - Uniform for all chakras as requested
        const width = 12;
        const height = 20;

        for (let i = 0; i < count; i++) {
            // Center the element
            const marginLeft = -width / 2;
            const marginTop = -height / 2;

            // Radius: Push out so the base touches the orb (radius 22)
            // Visual correction: The petal center needs to be further out
            const radius = 22 + (height * 0.4);

            petals.push(
                <div
                    key={i}
                    className="lotus-petal"
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        marginLeft: `${marginLeft}px`,
                        marginTop: `${marginTop}px`,
                        // Rotation: Angle -> Move Out -> Un-tilt the diagonal leaf shape (-45deg so tip points out) (Actually 135deg? Let's try 45 correction)
                        // Leaf 100% 0 100% 0: Tips are TR/BL. 
                        // To point TR straight UP relative to the radial line: rotate(-45deg).
                        transform: `rotate(${i * step}deg) translateY(-${radius}px) rotate(-45deg)`,
                        '--petal-color': color
                    }}
                ></div>
            );
        }
        return <div className="petals-ring">{petals}</div>;
    };

    return (
        <>
            <div className="chakra-system-container">
                {/* Central Energy Channel (Sushumna Nadi) */}
                <div className="sushumna-channel">
                    <div className="energy-pulse"></div>
                </div>

                <div className="chakras-stack">
                    {chakras.map((chakra, index) => (
                        <div
                            key={chakra.name}
                            className="chakra-orb-container"
                            style={{
                                '--chakra-color': chakra.color,
                                '--chakra-glow': `rgba(${chakra.rgb}, 0.6)`,
                                '--delay': `${index * 0.15}s`
                            }}
                            onClick={() => setSelectedChakra(chakra)}
                            title={chakra.description} // Native tooltip is cleaner
                        >
                            {/* Outer Rotating Energy Ring */}
                            <div className="energy-ring"></div>

                            {/* Organic Lotus Petals */}
                            {renderPetals(chakra.petals, chakra.color, chakra.name)}

                            {/* Inner Pulsing Core with Yantra */}
                            <div className="chakra-core">
                                {renderYantra(chakra.yantra, chakra.color)}
                                <span className="veneer-glint"></span>
                                <span className="sanskrit-symbol">{chakra.symbol}</span>
                            </div>

                            {/* Hover Halo */}
                            <div className="hover-halo"></div>

                            {/* Tooltip (Restored) */}
                            <div className="chakra-tooltip">
                                <h4>{chakra.name}</h4>
                                <p>{chakra.description}</p>
                                <span className="click-hint">Click for Yoga & Music 🎵</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ChakraYogaPage
                isOpen={!!selectedChakra}
                onClose={() => setSelectedChakra(null)}
                chakra={selectedChakra}
            />
        </>
    );
};

export default ChakraEnergy;
