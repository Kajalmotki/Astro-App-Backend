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
    const [activeService, setActiveService] = useState(null);

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

    // Create a quadrupled list to ensure smooth infinite scrolling on ultra-wide screens
    // and to allow the CSS animation to have enough buffer
    const displayServices = [...services, ...services, ...services, ...services];

    const handleCardClick = (service) => {
        if (service.action) {
            service.action();
        }
    };

    const closeOverlay = () => setActiveService(null);

    return (
        <>
            <h2 className="ticker-title">Our Free Services</h2>
            <div className="ticker-container">
                <div className="ticker-track">
                    {displayServices.map((service, index) => (
                        <div
                            key={`${service.name}-${index}`}
                            className="ticker-card"
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

