import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SlidingChartButton.css';

const SlidingChartButton = ({ isVisible }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!isVisible || !buttonRef.current) return;

        const createDroplet = () => {
            const droplet = document.createElement('div');
            droplet.className = 'water-droplet';

            // Random position across button width
            const randomX = Math.random() * 100;
            droplet.style.left = `${randomX}%`;
            droplet.style.setProperty('--delay', `${Math.random() * 0.5}s`);
            droplet.style.setProperty('--fall-duration', `${1.2 + Math.random() * 0.8}s`);

            buttonRef.current.appendChild(droplet);

            // Remove droplet after animation completes
            setTimeout(() => {
                droplet.remove();
            }, 2500);
        };

        // Create droplets periodically
        const interval = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(createDroplet, i * 150);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <Link
            ref={buttonRef}
            to="/sample"
            className={`sliding-chart-button ${isVisible ? 'visible' : ''}`}
            aria-label="View AstroRevo Chart Sample"
        >
            <span className="button-text">The AstroRevo Chart</span>
        </Link>
    );
};

export default SlidingChartButton;
