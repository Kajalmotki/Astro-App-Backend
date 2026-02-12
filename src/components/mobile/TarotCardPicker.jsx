import React, { useState } from 'react';
import WhyAstroRevo from '../WhyAstroRevo';
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
    { name: 'The Emperor', numeral: 'IV', meaning: 'Authority, structure, and fatherhood. Take control of your life.', emoji: '👑' },
    { name: 'The Hermit', numeral: 'IX', meaning: 'Soul-searching, introspection, and being alone. Look within for answers.', emoji: '🕯️' },
    { name: 'The Chariot', numeral: 'VII', meaning: 'Control, willpower, and victory. Assert yourself and conquer.', emoji: '🐎' },
    { name: 'Strength', numeral: 'VIII', meaning: 'Strength, courage, and persuasion. You have inner power.', emoji: '🦁' },
    { name: 'Justice', numeral: 'XI', meaning: 'Justice, fairness, and truth. Cause and effect are at play.', emoji: '⚖️' },
];

const minorArcana = [
    { name: 'Ace of Swords', numeral: 'A', meaning: 'Breakthroughs, clarity, and new ideas.', emoji: '⚔️' },
    { name: 'Ace of Cups', numeral: 'A', meaning: 'New love, overflowing emotions, and creativity.', emoji: '🏆' },
    { name: 'Ace of Pentacles', numeral: 'A', meaning: 'New opportunities, prosperity, and stability.', emoji: '💰' },
    { name: 'Ace of Wands', numeral: 'A', meaning: 'Inspiration, new passion, and bold energy.', emoji: '🔥' },
    { name: 'King of Cups', numeral: 'K', meaning: 'Emotional balance, compassion, and diplomacy.', emoji: '👑' },
    { name: 'Queen of Wands', numeral: 'Q', meaning: 'Confidence, determination, and social grace.', emoji: '💃' },
    { name: 'Knight of Pentacles', numeral: 'Kn', meaning: 'Efficiency, routine, and conservatism.', emoji: '🐴' },
    { name: 'Page of Swords', numeral: 'P', meaning: 'Curiosity, restlessness, and mental energy.', emoji: '🗡️' },
];

const TiltCard = ({ card, index, isFlipped, isDimmed, isShuffling, totalCards, onClick }) => {
    const handleMouseMove = (e) => {
        if (isFlipped || isDimmed || isShuffling) return;
        const cardRect = e.currentTarget.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;

        const rotateX = (mouseY / (cardRect.height / 2)) * -20; // Max tilt 20deg
        const rotateY = (mouseX / (cardRect.width / 2)) * 20;

        e.currentTarget.style.setProperty('--rotateX', `${rotateX}deg`);
        e.currentTarget.style.setProperty('--rotateY', `${rotateY}deg`);
        e.currentTarget.style.setProperty('--scale', '1.15');
        e.currentTarget.style.setProperty('--hover-y', '-20px');
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.setProperty('--rotateX', '0deg');
        e.currentTarget.style.setProperty('--rotateY', '0deg');
        e.currentTarget.style.setProperty('--scale', '1');
        e.currentTarget.style.setProperty('--hover-y', '0px');
    };

    const middleIndex = Math.floor(totalCards / 2);
    const offset = index - middleIndex;
    const rotation = offset * 12;
    const translateX = offset * 28;
    const translateY = Math.abs(offset) * 8;

    return (
        <div
            className={`tarot-card-wrapper ${isFlipped ? 'flipped' : ''} ${isDimmed ? 'dimmed' : ''} ${isShuffling ? 'shuffling' : ''}`}
            style={{
                '--base-rotation': `${rotation}deg`,
                '--translateX': `${translateX}px`,
                '--translateY': `${translateY}px`,
                '--delay': `${index * 0.08}s`,
                zIndex: isFlipped ? 100 : totalCards - Math.abs(offset),
            }}
            onClick={() => onClick(index)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
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
};

const TarotCardPicker = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [isShuffling, setIsShuffling] = useState(false);

    // Helper to get random cards
    const getRandomCards = () => {
        const fullDeck = [...majorArcana, ...minorArcana];
        return fullDeck.sort(() => Math.random() - 0.5).slice(0, 5);
    };

    const [displayCards, setDisplayCards] = useState(getRandomCards());

    const handleCardClick = (index) => {
        if (flippedIndex !== null || isShuffling) return; // Already revealed or shuffling
        setFlippedIndex(index);
        setSelectedCard(displayCards[index]);
    };

    const handleReset = () => {
        // Start shuffle animation
        setIsShuffling(true);
        setFlippedIndex(null);
        setSelectedCard(null);

        // Wait for "gather" animation, then swap cards and fan out
        setTimeout(() => {
            setDisplayCards(getRandomCards());
            setTimeout(() => {
                setIsShuffling(false);
            }, 100); // Slight delay to ensure DOM update before removing class
        }, 600); // 600ms match CSS transition
    };

    return (
        <section className="tarot-picker-section">


            {/* Replaced Subtitle with Why AstroRevo Button */}
            <div className="tarot-picker-action-area">
                <WhyAstroRevo />
            </div>

            <div className="tarot-fan-container">
                {displayCards.map((card, index) => (
                    <TiltCard
                        key={`${index}-${isShuffling ? 'shuffle' : 'static'}`} // Force re-render if needed, but class change is usually enough
                        card={card}
                        index={index}
                        isFlipped={flippedIndex === index}
                        isDimmed={flippedIndex !== null && flippedIndex !== index}
                        isShuffling={isShuffling}
                        totalCards={displayCards.length}
                        onClick={handleCardClick}
                    />
                ))}
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
