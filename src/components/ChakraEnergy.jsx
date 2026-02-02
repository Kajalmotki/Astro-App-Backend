import React from 'react';
import './ChakraEnergy.css';

const ChakraEnergy = () => {
    const chakras = [
        { name: 'Sahasrara', color: '#9B59B6', symbol: 'ॐ', petals: 1000, description: 'Crown Chakra - Divine consciousness, enlightenment, and spiritual connection' },
        { name: 'Ajna', color: '#6C5CE7', symbol: 'ॐ', petals: 2, description: 'Third Eye Chakra - Intuition, wisdom, and inner vision' },
        { name: 'Vishuddha', color: '#3498DB', symbol: 'हं', petals: 16, description: 'Throat Chakra - Communication, self-expression, and truth' },
        { name: 'Anahata', color: '#2ECC71', symbol: 'यं', petals: 12, description: 'Heart Chakra - Love, compassion, and emotional balance' },
        { name: 'Manipura', color: '#F1C40F', symbol: 'रं', petals: 10, description: 'Solar Plexus Chakra - Personal power, confidence, and transformation' },
        { name: 'Svadhisthana', color: '#E67E22', symbol: 'वं', petals: 6, description: 'Sacral Chakra - Creativity, passion, and emotional flow' },
        { name: 'Muladhara', color: '#E74C3C', symbol: 'लं', petals: 4, description: 'Root Chakra - Grounding, stability, and survival instincts' }
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
                        className="chakra-item"
                        style={{
                            '--chakra-color': chakra.color,
                            '--delay': `${index * 0.2}s`
                        }}
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChakraEnergy;
