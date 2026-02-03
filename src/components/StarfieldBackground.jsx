import React from 'react';

const StarfieldBackground = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #0a1628 0%, #1a2744 50%, #0d1a2d 100%)',
                pointerEvents: 'none',
                zIndex: -2
            }}
        />
    );
};

export default StarfieldBackground;
