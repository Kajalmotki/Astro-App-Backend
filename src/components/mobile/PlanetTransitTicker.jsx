import React, { useEffect, useState } from 'react';
import { getPlanetaryNews } from '../../services/planetNewsService';
import './PlanetTransitTicker.css';

const PlanetTransitTicker = () => {
    const [newsItems, setNewsItems] = useState([]);

    useEffect(() => {
        // Fetch news on mount
        const news = getPlanetaryNews();
        setNewsItems(news);
    }, []);

    if (newsItems.length === 0) return null;

    return (
        <div className="planet-ticker-container">
            <div className="ticker-label">
                <span className="live-dot"></span>
                COSMOS LIVE
            </div>
            <div className="ticker-wrapper">
                <div className="ticker-content">
                    {/* Duplicate list for seamless infinite scroll */}
                    {[...newsItems, ...newsItems, ...newsItems].map((item, index) => (
                        <span key={index} className="ticker-item-text">
                            {item} <span className="ticker-separator">✦</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlanetTransitTicker;
