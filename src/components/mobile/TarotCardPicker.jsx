import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { majorArcana, minorArcana } from '../../utils/tarotData';
import './TarotCardPicker.css?v=9';

/* ── Tilt Card ── */
const TiltCard = ({ card, index, isFlipped, isDimmed, isShuffling, totalCards, onClick }) => {
    const handleMouseMove = (e) => {
        if (isFlipped || isDimmed || isShuffling) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rx = ((e.clientY - cy) / (rect.height / 2)) * -20;
        const ry = ((e.clientX - cx) / (rect.width / 2)) * 20;
        e.currentTarget.style.setProperty('--rotateX', `${rx}deg`);
        e.currentTarget.style.setProperty('--rotateY', `${ry}deg`);
        e.currentTarget.style.setProperty('--scale', '1.15');
        e.currentTarget.style.setProperty('--hover-y', '-20px');
    };
    const handleMouseLeave = (e) => {
        e.currentTarget.style.setProperty('--rotateX', '0deg');
        e.currentTarget.style.setProperty('--rotateY', '0deg');
        e.currentTarget.style.setProperty('--scale', '1');
        e.currentTarget.style.setProperty('--hover-y', '0px');
    };

    const offset = index - (totalCards - 1) / 2;
    const rotation = offset * 3.5;
    const translateX = offset * 3.5;
    const translateY = Math.abs(offset) * 2;

    return (
        <div
            className={`tarot-card-wrapper ${isFlipped ? 'flipped' : ''} ${isDimmed ? 'dimmed' : ''} ${isShuffling ? 'shuffling' : ''}`}
            style={{
                '--base-rotation': `${rotation}deg`,
                '--translateX': `${translateX}px`,
                '--translateY': `${translateY}px`,
                '--delay': `${index * 0.08}s`,
                zIndex: isFlipped ? 100 : index,
            }}
            onClick={() => onClick(index)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="tarot-card-inner">
                <div className="tarot-card-face tarot-card-back">
                    <div className="card-static-bg" />
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
                <div className="tarot-card-face tarot-card-front">
                    <span className="card-numeral">{card.numeral}</span>
                    <span className="card-emoji">{card.emoji}</span>
                    <span className="card-name">{card.name}</span>
                </div>
            </div>
        </div>
    );
};

/* ── Reveal Overlay ── */
const RevealOverlay = ({ card, onDone }) => {
    const [phase, setPhase] = useState('enter'); // enter → show → exit

    useEffect(() => {
        // Phase 1: full-screen card slides in (600ms)
        const t1 = setTimeout(() => setPhase('show'), 600);
        // Phase 2: hold for a beat (700ms)
        const t2 = setTimeout(() => setPhase('exit'), 1300);
        // Phase 3: navigate after fade-out (500ms)
        const t3 = setTimeout(() => onDone(), 1800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    return (
        <div className={`tarot-reveal-overlay tarot-reveal-${phase}`}>
            <div className="tarot-reveal-bg" />
            <div className="tarot-reveal-particles">
                {[...Array(12)].map((_, i) => (
                    <span key={i} className="tarot-reveal-particle" style={{ '--i': i }} />
                ))}
            </div>
            <div className="tarot-reveal-card">
                <div className="tarot-reveal-card-inner">
                    <span className="tarot-reveal-numeral">{card.numeral}</span>
                    <span className="tarot-reveal-emoji">{card.emoji}</span>
                    <span className="tarot-reveal-name">{card.name}</span>
                </div>
            </div>
            <p className="tarot-reveal-hint">Your card is revealed…</p>
        </div>
    );
};

/* ── Main Component ── */
const TarotCardPicker = forwardRef((props, ref) => {
    const navigate = useNavigate();
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [revealCard, setRevealCard] = useState(null); // triggers overlay

    const getRandomCards = () => {
        const fullDeck = [...majorArcana, ...minorArcana];
        return fullDeck.sort(() => Math.random() - 0.5).slice(0, 22);
    };
    const [displayCards, setDisplayCards] = useState(getRandomCards);

    const triggerReveal = (card) => {
        setRevealCard(card);
    };

    const handleCardClick = (index) => {
        if (flippedIndex !== null || isShuffling || revealCard) return;
        setFlippedIndex(index);
        // Short lift animation, then overlay
        setTimeout(() => {
            triggerReveal(displayCards[index]);
            setFlippedIndex(null);
        }, 400);
    };

    const handleReset = () => {
        if (revealCard) return;
        setIsShuffling(true);
        setFlippedIndex(null);
        setTimeout(() => {
            setDisplayCards(getRandomCards());
            setTimeout(() => setIsShuffling(false), 800);
        }, 400);
    };

    const handleRevealRandom = () => {
        if (isShuffling || flippedIndex !== null || revealCard) return;
        const randomIndex = Math.floor(Math.random() * displayCards.length);
        setFlippedIndex(randomIndex);
        setTimeout(() => {
            triggerReveal(displayCards[randomIndex]);
            setFlippedIndex(null);
        }, 400);
    };

    const handleOverlayDone = () => {
        const card = revealCard;
        setRevealCard(null);
        navigate('/mobile/tarot-reveal', { state: { card } });
    };

    useImperativeHandle(ref, () => ({
        shuffle: handleReset,
        revealRandom: handleRevealRandom,
    }));

    return (
        <>
            <section className="tarot-picker-section">
                <div className="tarot-fan-container">
                    {displayCards.map((card, index) => (
                        <TiltCard
                            key={`${index}-${isShuffling ? 'shuffle' : 'static'}`}
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

            {revealCard && (
                <RevealOverlay card={revealCard} onDone={handleOverlayDone} />
            )}
        </>
    );
});

TarotCardPicker.displayName = 'TarotCardPicker';
export default TarotCardPicker;
