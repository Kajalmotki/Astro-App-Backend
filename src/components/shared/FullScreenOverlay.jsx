import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import CosmicBackground from './CosmicBackground';
import './FullScreenOverlay.css';

const FullScreenOverlay = ({ isOpen, onClose, title, children, variant = 'default', fullBleed = false }) => {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            /* Prevent body scroll when modal is open */
            document.body.style.overflow = 'hidden';
            return () => {
                window.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={`fs-overlay ${fullBleed ? 'fs-full-bleed' : ''}`}>
            <div className={`fs-modal ${fullBleed ? 'fs-modal-full' : ''}`}>
                {/* Cosmic animated background */}
                <CosmicBackground variant={variant} />

                <button className={`fs-close-btn ${fullBleed ? 'fs-close-full' : ''}`} onClick={onClose}>×</button>
                {!fullBleed && <h2 className="fs-title">{title}</h2>}

                <div className={`fs-content ${fullBleed ? 'fs-content-full' : ''}`}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default FullScreenOverlay;
