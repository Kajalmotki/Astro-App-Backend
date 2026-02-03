import React, { useRef, useEffect, useState } from 'react';
import './ScrollingTicker.css';
import VirtualPooja from './VirtualPooja';
import AstroChartPage from './pages/AstroChartPage';
import MatchmakingPage from './pages/MatchmakingPage';
import PanchangPage from './pages/PanchangPage';
import VedasPage from './pages/VedasPage';
import UpnishadsPage from './pages/UpnishadsPage';
import HoroscopePage from './pages/HoroscopePage';
import GemstonesPage from './pages/GemstonesPage';
import KarmicReadingPage from './pages/KarmicReadingPage';
import NumerologyPage from './pages/NumerologyPage';

const ScrollingTicker = () => {
    const scrollContainerRef = useRef(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [activeService, setActiveService] = useState(null); // 'pooja', 'chart', 'matchmaking', etc.
    const autoScrollIntervalRef = useRef(null);

    const services = [
        {
            name: "Chart",
            image: "/images/chart_symbol.png",
            action: () => setActiveService('chart')
        },
        {
            name: "Matchmaking",
            image: "/images/matchmaking_symbol.png",
            action: () => setActiveService('matchmaking')
        },
        {
            name: "Panchang",
            image: "/images/panchang_symbol.png",
            action: () => setActiveService('panchang')
        },
        {
            name: "Virtual Pooja",
            image: "/images/virtual_pooja_symbol.png",
            action: () => setActiveService('pooja')
        },
        {
            name: "Vedas",
            image: "/images/vedas_symbol.png",
            action: () => setActiveService('vedas')
        },
        {
            name: "Upnishads",
            image: "/images/upnishads_symbol.png",
            action: () => setActiveService('upnishads')
        },
        {
            name: "Horoscope",
            image: "/images/horoscope_symbol.png",
            action: () => setActiveService('horoscope')
        },
        {
            name: "Gemstones",
            image: "/images/gemstones_symbol.png",
            action: () => setActiveService('gemstones')
        },
        {
            name: "Karmic Reading",
            image: "/images/karma_symbol.png",
            action: () => setActiveService('karmic')
        },
        {
            name: "Numerology",
            image: "/images/numerology_symbol.png",
            action: () => setActiveService('numerology')
        }
    ];

    // Duplicate services for seamless infinite scroll
    const displayServices = [...services, ...services];

    // Auto-scroll functionality
    useEffect(() => {
        const startAutoScroll = () => {
            if (!isUserInteracting && scrollContainerRef.current) {
                autoScrollIntervalRef.current = setInterval(() => {
                    if (scrollContainerRef.current) {
                        const container = scrollContainerRef.current;
                        const maxScroll = container.scrollWidth - container.clientWidth;

                        // Slow auto-scroll (1px every 50ms = 20px per second)
                        container.scrollLeft += 1;

                        // Reset to beginning when reaching the end for infinite effect
                        if (container.scrollLeft >= maxScroll / 2) {
                            container.scrollLeft = 0;
                        }
                    }
                }, 50);
            }
        };

        startAutoScroll();

        return () => {
            if (autoScrollIntervalRef.current) {
                clearInterval(autoScrollIntervalRef.current);
            }
        };
    }, [isUserInteracting]);

    // Pause auto-scroll on user interaction
    const handleUserInteraction = () => {
        setIsUserInteracting(true);
        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
        }

        // Resume auto-scroll after 3 seconds of no interaction
        setTimeout(() => {
            setIsUserInteracting(false);
        }, 3000);
    };

    const scroll = (direction) => {
        handleUserInteraction();
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollPosition = scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleCardClick = (service) => {
        if (service.action) {
            service.action();
        }
    };

    const closeOverlay = () => setActiveService(null);

    return (
        <>
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div
                    className="ticker-container"
                    ref={scrollContainerRef}
                    onTouchStart={handleUserInteraction}
                    onWheel={handleUserInteraction}
                >
                    <div className="ticker-track">
                        {displayServices.map((service, index) => (
                            <div
                                key={`${service.name}-${index}`}
                                className={`ticker-card clickable`}
                                onClick={() => handleCardClick(service)}
                            >
                                <div className="ticker-icon-wrapper">
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="ticker-icon-image"
                                        draggable="false"
                                    />
                                </div>
                                <div className="ticker-label">{service.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicators */}
                <button
                    className="scroll-indicator left"
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </button>
                <button
                    className="scroll-indicator right"
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </button>
            </div>

            {/* Feature Pages / Modals */}
            <VirtualPooja isOpen={activeService === 'pooja'} onClose={closeOverlay} />
            <AstroChartPage isOpen={activeService === 'chart'} onClose={closeOverlay} />
            <MatchmakingPage isOpen={activeService === 'matchmaking'} onClose={closeOverlay} />
            <PanchangPage isOpen={activeService === 'panchang'} onClose={closeOverlay} />
            <VedasPage isOpen={activeService === 'vedas'} onClose={closeOverlay} />
            <UpnishadsPage isOpen={activeService === 'upnishads'} onClose={closeOverlay} />
            <HoroscopePage isOpen={activeService === 'horoscope'} onClose={closeOverlay} />
            <GemstonesPage isOpen={activeService === 'gemstones'} onClose={closeOverlay} />
            <KarmicReadingPage isOpen={activeService === 'karmic'} onClose={closeOverlay} />
            <NumerologyPage isOpen={activeService === 'numerology'} onClose={closeOverlay} />
        </>
    );
};

export default ScrollingTicker;

