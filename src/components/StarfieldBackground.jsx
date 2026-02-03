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
                background: 'var(--bg-gradient)',
                pointerEvents: 'none',
                zIndex: -2
            }}
        />
    );
};

export default StarfieldBackground;
