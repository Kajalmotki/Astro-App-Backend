import React, { useState } from 'react';
import './TarotCardPicker.css';

const majorArcana = [
    { name: 'The Fool', numeral: '0', meaning: 'New beginnings, spontaneity, and a free spirit. Trust the journey ahead.', emoji: '🌟' },
    { name: 'The Magician', numeral: 'I', meaning: 'Manifestation, resourcefulness, and power. You have all the tools you need.', emoji: '✨' },
    { name: 'The High Priestess', numeral: 'II', meaning: 'Intuition, sacred knowledge, and the subconscious mind. Trust your inner voice.', emoji: '🌙' },
    { name: 'The Empress', numeral: 'III', meaning: 'Abundance, nurturing, and fertility. Nature and beauty surround you.', emoji: '🌺' },
    { name: 'The Star', numeral: 'XVII', meaning: 'Hope, faith, and rejuvenation. A guiding light shines upon your path.', emoji: '⭐' },
    { name: 'The Sun', numeral: 'XIX', meaning: 'Joy, success, and vitality. Positivity radiates around you today.', emoji: '☀️' },
    { name: 'The Moon', numeral: 'XVIII', meaning: 'Illusion, fear, and the subconscious. Look beyond the surface.', emoji: '🌕' },
    { name: 'The World', numeral: 'XXI', meaning: 'Completion, achievement, and travel. A cycle reaches its fulfillment.', emoji: '🌍' },
    { name: 'Wheel of Fortune', numeral: 'X', meaning: 'Change, cycles, and inevitable fate. The wheel turns in your favor.', emoji: '🎡' },
    { name: 'The Lovers', numeral: 'VI', meaning: 'Love, harmony, and relationships. Alignment of values and choices.', emoji: '💕' },
];

const TarotCardPicker = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [displayCards] = useState(() => {
        // Pick 5 random cards from the pool
        const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 5);
    });

    const handleCardClick = (index) => {
        if (flippedIndex !== null) return; // Already revealed
        setFlippedIndex(index);
        setSelectedCard(displayCards[index]);
    };

    const handleReset = () => {
        setFlippedIndex(null);
        setSelectedCard(null);
    };

    return (
        <section className="tarot-picker-section">
            <h3 className="tarot-picker-title">✨ Choose Your Card</h3>
            <p className="tarot-picker-subtitle">Tap a card to reveal your cosmic message</p>

            <div className="tarot-fan-container">
                {displayCards.map((card, index) => {
                    const totalCards = displayCards.length;
                    const middleIndex = Math.floor(totalCards / 2);
                    const offset = index - middleIndex;
                    const rotation = offset * 12;
                    const translateX = offset * 28;
                    const translateY = Math.abs(offset) * 8;
                    const isFlipped = flippedIndex === index;

                    return (
                        <div
                            key={index}
                            className={`tarot-card-wrapper ${isFlipped ? 'flipped' : ''} ${flippedIndex !== null && !isFlipped ? 'dimmed' : ''}`}
                            style={{
                                '--rotation': `${rotation}deg`,
                                '--translateX': `${translateX}px`,
                                '--translateY': `${translateY}px`,
                                '--delay': `${index * 0.08}s`,
                                zIndex: isFlipped ? 10 : totalCards - Math.abs(offset),
                            }}
                            onClick={() => handleCardClick(index)}
                        >
                            <div className="tarot-card-inner">
                                {/* Card Back */}
                                <div className="tarot-card-face tarot-card-back">
                                    <div className="card-back-design">
                                        <div className="card-back-border">
                                            <div className="card-back-pattern">
                                                <span className="card-back-star">★</span>
                                                <span className="card-back-symbol">☽</span>
                                                <span className="card-back-star bottom">★</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Card Front */}
                                <div className="tarot-card-face tarot-card-front">
                                    <span className="card-numeral">{card.numeral}</span>
                                    <span className="card-emoji">{card.emoji}</span>
                                    <span className="card-name">{card.name}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Revealed Reading */}
            {selectedCard && (
                <div className="tarot-reading-reveal">
                    <div className="reading-card-name">
                        <span className="reading-emoji">{selectedCard.emoji}</span>
                        <span>{selectedCard.name}</span>
                    </div>
                    <p className="reading-meaning">{selectedCard.meaning}</p>
                    <button className="tarot-reset-btn" onClick={handleReset}>
                        Draw Again
                    </button>
                </div>
            )}
        </section>
    );
};

export default TarotCardPicker;
