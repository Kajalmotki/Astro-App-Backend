import React, { useRef, useEffect, useState } from 'react';
import './ScrollingTicker.css';

const ScrollingTicker = () => {
    const scrollContainerRef = useRef(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const autoScrollIntervalRef = useRef(null);

    const services = [
        {
            name: "Chart",
            image: "/images/chart_service_icon_1770112346404.png"
        },
        {
            name: "Matchmaking",
            image: "/images/matchmaking_service_icon_1770112368976.png"
        },
        {
            name: "Panchang",
            image: "/images/panchang_service_icon_1770112387075.png"
        },
        {
            name: "Virtual Pooja",
            image: "/images/virtual_pooja_icon_1770112405454.png"
        },
        {
            name: "Vedas",
            image: "/images/vedas_service_icon_1770112425093.png"
        },
        {
            name: "Upnishads",
            image: "/images/upnishads_service_icon_1770112444878.png"
        },
        {
            name: "Horoscope",
            image: "/images/horoscope_service_icon_1770112466948.png"
        },
        {
            name: "Gemstones",
            image: "/images/gemstones_service_icon_1770112487772.png"
        },
        {
            name: "Karmic Reading",
            image: "/images/karmic_reading_icon_1770112558312.png"
        },
        {
            name: "Numerology",
            image: "/images/numerology_service_icon_1770112507398.png"
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

    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div
                className="ticker-container"
                ref={scrollContainerRef}
                onTouchStart={handleUserInteraction}
                onWheel={handleUserInteraction}
            >
                <div className="ticker-track">
                    {displayServices.map((service, index) => (
                        <div key={`${service.name}-${index}`} className="ticker-card">
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
    );
};

export default ScrollingTicker;
