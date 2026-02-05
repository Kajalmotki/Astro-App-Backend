import React, { useState } from 'react';
import ChakraYogaPage from './pages/ChakraYogaPage';
import './ChakraEnergy.css';

const ChakraEnergy = () => {
    const [selectedChakra, setSelectedChakra] = useState(null);

    const chakras = [
        { name: 'Sahasrara', color: '#D6A2E8', rgb: '214, 162, 232', symbol: 'ॐ', petals: 1000, description: 'Crown Chakra - Divine consciousness, enlightenment, and spiritual connection' }, // Light Purple
        { name: 'Ajna', color: '#9A7FD1', rgb: '154, 127, 209', symbol: 'ॐ', petals: 2, description: 'Third Eye Chakra - Intuition, wisdom, and inner vision' }, // Light Indigo
        { name: 'Vishuddha', color: '#63CAFF', rgb: '99, 202, 255', symbol: 'हं', petals: 16, description: 'Throat Chakra - Communication, self-expression, and truth' }, // Light Blue
        { name: 'Anahata', color: '#7BED9F', rgb: '123, 237, 159', symbol: 'यं', petals: 12, description: 'Heart Chakra - Love, compassion, and emotional balance' }, // Light Green
        { name: 'Manipura', color: '#FFE159', rgb: '255, 225, 89', symbol: 'रं', petals: 10, description: 'Solar Plexus Chakra - Personal power, confidence, and transformation' }, // Light Yellow
        { name: 'Svadhisthana', color: '#FFC078', rgb: '255, 192, 120', symbol: 'वं', petals: 6, description: 'Sacral Chakra - Creativity, passion, and emotional flow' }, // Light Orange
        { name: 'Muladhara', color: '#FF7979', rgb: '255, 121, 121', symbol: 'लं', petals: 4, description: 'Root Chakra - Grounding, stability, and survival instincts' } // Light Red
    ];

    const renderPetals = (petalCount, color) => {
        // For Sahasrara (1000 petals), use a radial effect instead
        if (petalCount === 1000) {
            return <div className="thousand-petals-glow"></div>;
        }

        const petals = [];
        const angleStep = 360 / petalCount;

        for (let i = 0; i < petalCount; i++) {
            const angle = i * angleStep;
            petals.push(
                <div
                    key={i}
                    className="chakra-petal"
                    style={{
                        '--petal-angle': `${angle}deg`,
                        '--petal-color': color
                    }}
                ></div>
            );
        }

        return petals;
    };

    return (
        <>
            <div className="chakra-energy-container">
                {/* Vertical energy line with smoke */}
                <div className="energy-line">
                    <div className="smoke-particle smoke-1"></div>
                    <div className="smoke-particle smoke-2"></div>
                    <div className="smoke-particle smoke-3"></div>
                    <div className="smoke-particle smoke-4"></div>
                    <div className="smoke-particle smoke-5"></div>
                </div>

                {/* Chakras */}
                <div className="chakras-container">
                    {chakras.map((chakra, index) => (
                        <div
                            key={chakra.name}
                            className="chakra-item interactive"
                            style={{
                                '--chakra-color': chakra.color,
                                '--chakra-rgb': chakra.rgb,
                                '--delay': `${index * 0.2}s`
                            }}
                            onClick={() => setSelectedChakra(chakra)}
                        >
                            <div className="chakra-petals-container">
                                {renderPetals(chakra.petals, chakra.color)}
                            </div>
                            <div className="chakra-circle">
                                <div className="chakra-inner">
                                    <span className="chakra-symbol">{chakra.symbol}</span>
                                </div>
                            </div>
                            <div className="chakra-tooltip">
                                <h4>{chakra.name}</h4>
                                <p>{chakra.description}</p>
                                <span className="click-hint">Click for Yoga & Music 🎵</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Yoga Modal */}
            <ChakraYogaPage
                isOpen={!!selectedChakra}
                onClose={() => setSelectedChakra(null)}
                chakra={selectedChakra}
            />
        </>
    );
};

export default ChakraEnergy;
