import React from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './PanchangPage.css';

const PanchangPage = ({ isOpen, onClose }) => {
    // Get current date info


    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="Today's Panchāng" variant="warm">
            <div className="panchang-container" style={{ padding: 0, height: '100%', overflow: 'hidden' }}>
                <iframe
                    src="https://www.drikpanchang.com/muhurat/choghadiya.html"
                    title="Drik Panchang"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '0 0 20px 20px' // Match parent radius if needed
                    }}
                />
            </div>
        </FullScreenOverlay>
    );
};

export default PanchangPage;
