import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WhyAstroRevo from '../WhyAstroRevo';
import { majorArcana, minorArcana } from '../../utils/tarotData';
import './TarotCardPicker.css?v=8';



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
    const rotation = offset * 5; // Wider rotation to match the fanned reference
    const translateX = offset * 5; // Tight overlap at the base
    const translateY = (Math.abs(offset) * 2); // Natural lift for the fan shape

    return (
        <div
            className={`tarot-card-wrapper ${isFlipped ? 'flipped' : ''} ${isDimmed ? 'dimmed' : ''} ${isShuffling ? 'shuffling' : ''}`}
            style={{
                '--base-rotation': `${rotation}deg`,
                '--translateX': `${translateX}px`,
                '--translateY': `${translateY}px`,
                '--delay': `${index * 0.08}s`,
                zIndex: isFlipped ? 100 : index, // Linear stacking (right on top of left) matches reference
            }}
            onClick={() => onClick(index)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="tarot-card-inner">
                {/* Card Back */}
                <div className="tarot-card-face tarot-card-back">
                    {/* Static Background */}
                    <div className="card-static-bg"></div>

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
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState(null);
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [isShuffling, setIsShuffling] = useState(false);

    // Helper to get random cards
    const getRandomCards = () => {
        const fullDeck = [...majorArcana, ...minorArcana];
        // Taking 22 cards for a full fan look (like Major Arcana count)
        return fullDeck.sort(() => Math.random() - 0.5).slice(0, 22);
    };

    const [displayCards, setDisplayCards] = useState(getRandomCards());

    const handleCardClick = (index) => {
        if (flippedIndex !== null || isShuffling) return; // Already revealed or shuffling

        const card = displayCards[index];
        setFlippedIndex(index);
        setSelectedCard(card);

        // Delay navigation to allow flip animation to start/complete locally if desired, 
        // or navigate immediately. Let's wait a small moment for visual feedback.
        setTimeout(() => {
            navigate('/mobile/tarot-reveal', { state: { card } });
            // Reset state after navigation so if they come back it's reset (optional)
            setFlippedIndex(null);
            setSelectedCard(null);
        }, 800);
    };

    const handleReset = () => {
        // Start shuffle animation
        setIsShuffling(true);
        setFlippedIndex(null);
        setSelectedCard(null);

        // Visual Shuffle Delay
        setTimeout(() => {
            setDisplayCards(getRandomCards());

            // Stop shuffling after new cards are set
            setTimeout(() => {
                setIsShuffling(false);
            }, 800); // Allow animation to play for a bit
        }, 400);
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

        </section>
    );
};

export default TarotCardPicker;
