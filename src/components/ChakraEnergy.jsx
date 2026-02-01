import React from 'react';
import './ChakraEnergy.css';

const ChakraEnergy = () => {
    const chakras = [
        { name: 'Sahasrara', color: '#9B59B6', symbol: '☸' },
        { name: 'Ajna', color: '#6C5CE7', symbol: '◉' },
        { name: 'Vishuddha', color: '#3498DB', symbol: '✦' },
        { name: 'Anahata', color: '#2ECC71', symbol: '✿' },
        { name: 'Manipura', color: '#F1C40F', symbol: '▽' },
        { name: 'Svadhisthana', color: '#E67E22', symbol: '◬' },
        { name: 'Muladhara', color: '#E74C3C', symbol: '◼' }
    ];

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
                        <div className="chakra-circle">
                            <div className="chakra-inner">
                                <span className="chakra-symbol">{chakra.symbol}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChakraEnergy;
