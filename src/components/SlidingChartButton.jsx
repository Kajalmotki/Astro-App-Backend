import React from 'react';
import { Link } from 'react-router-dom';
import './SlidingChartButton.css';

const SlidingChartButton = ({ isVisible }) => {
    return (
        <Link
            to="/sample"
            className={`sliding-chart-button ${isVisible ? 'visible' : ''}`}
            aria-label="View AstroRevo Chart Sample"
        >
            <span className="button-text">AstroRevo Chart</span>
            <span className="button-arrow">→</span>
        </Link>
    );
};

export default SlidingChartButton;
