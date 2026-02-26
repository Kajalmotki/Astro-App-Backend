import React, { useState, useImperativeHandle, forwardRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { majorArcana, minorArcana } from '../../utils/tarotData';
import './TarotCardPicker.css?v=10';

/* ── Tilt Card ── */
const TiltCard = ({ card, index, isDrawingOut, isDimmed, isShuffling, totalCards, onClick }) => {
    const handleMouseMove = (e) => {
        if (isDrawingOut || isDimmed || isShuffling) return;
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
            className={`tarot-card-wrapper ${isDrawingOut ? 'drawing-out' : ''} ${isDimmed ? 'dimmed' : ''} ${isShuffling ? 'shuffling' : ''}`}
            style={{
                '--base-rotation': `${rotation}deg`,
                '--translateX': `${translateX}px`,
                '--translateY': `${translateY}px`,
                '--delay': `${index * 0.08}s`,
                zIndex: isDrawingOut ? 100 : index,
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

/* ── Ad Interstitial ── */
const AdInterstitial = ({ onClose }) => {
    const [secondsLeft, setSecondsLeft] = useState(6);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [secondsLeft]);

    return createPortal(
        <div className="ad-interstitial-overlay">
            <div className="ad-interstitial-bg" />
            <div className="ad-interstitial-content">
                <button className="ad-interstitial-close" onClick={onClose}>✕</button>
                <div className="ad-interstitial-badge">AD</div>
                <div className="ad-interstitial-placeholder">
                    <div className="ad-placeholder-icon">✦</div>
                    <p className="ad-placeholder-text">Your ad here</p>
                    <p className="ad-placeholder-subtext">Premium placement</p>
                </div>
                {secondsLeft > 0 && (
                    <span className="ad-interstitial-timer">{secondsLeft}s</span>
                )}
            </div>
        </div>,
        document.body
    );
};

/* ── Reveal Overlay ── */
const RevealOverlay = ({ card, onDone }) => {
    const [phase, setPhase] = useState('enter'); // enter → show → exit

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('show'), 600);
        const t2 = setTimeout(() => setPhase('exit'), 1300);
        const t3 = setTimeout(() => onDone(), 1800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    return createPortal(
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
        </div>,
        document.body
    );
};

/* ── Main Component ── */
const TarotCardPicker = forwardRef((props, ref) => {
    const navigate = useNavigate();
    const [drawingOutIndex, setDrawingOutIndex] = useState(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [revealCard, setRevealCard] = useState(null);
    const [pendingCard, setPendingCard] = useState(null);

    const getRandomCards = () => {
        const fullDeck = [...majorArcana, ...minorArcana];
        return fullDeck.sort(() => Math.random() - 0.5).slice(0, 22);
    };
    const [displayCards, setDisplayCards] = useState(getRandomCards);

    const handleCardClick = (index) => {
        if (drawingOutIndex !== null || isShuffling || showAd || revealCard) return;
        setDrawingOutIndex(index);
        setPendingCard(displayCards[index]);
        // After draw-out animation (1s), show ad
        setTimeout(() => {
            setShowAd(true);
        }, 1000);
    };

    const handleAdClose = useCallback(() => {
        setShowAd(false);
        // Show reveal overlay
        setRevealCard(pendingCard);
        setDrawingOutIndex(null);
    }, [pendingCard]);

    const handleOverlayDone = () => {
        const card = revealCard;
        setRevealCard(null);
        setPendingCard(null);
        navigate('/mobile/tarot-reveal', { state: { card } });
    };

    const handleReset = () => {
        if (revealCard || showAd) return;
        setIsShuffling(true);
        setDrawingOutIndex(null);
        setTimeout(() => {
            setDisplayCards(getRandomCards());
            setTimeout(() => setIsShuffling(false), 800);
        }, 400);
    };

    const handleRevealRandom = () => {
        if (isShuffling || drawingOutIndex !== null || showAd || revealCard) return;
        const randomIndex = Math.floor(Math.random() * displayCards.length);
        handleCardClick(randomIndex);
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
                            isDrawingOut={drawingOutIndex === index}
                            isDimmed={drawingOutIndex !== null && drawingOutIndex !== index}
                            isShuffling={isShuffling}
                            totalCards={displayCards.length}
                            onClick={handleCardClick}
                        />
                    ))}
                </div>
            </section>

            {showAd && (
                <AdInterstitial onClose={handleAdClose} />
            )}

            {revealCard && (
                <RevealOverlay card={revealCard} onDone={handleOverlayDone} />
            )}
        </>
    );
});

TarotCardPicker.displayName = 'TarotCardPicker';
export default TarotCardPicker;
