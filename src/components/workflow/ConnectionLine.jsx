import React from 'react';

const ConnectionLine = ({ from, to, isActive }) => {
    // Calculate cubic bezier curve control points
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    // Horizontal curve for left-to-right flow
    const controlPoint1 = {
        x: from.x + dx * 0.5,
        y: from.y
    };
    const controlPoint2 = {
        x: to.x - dx * 0.5,
        y: to.y
    };

    const pathData = `M ${from.x} ${from.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${to.x} ${to.y}`;

    return (
        <g className="connection-line">
            {/* Shadow/glow layer */}
            <path
                d={pathData}
                fill="none"
                stroke={isActive ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#glow)"
            />
            {/* Main line */}
            <path
                d={pathData}
                fill="none"
                stroke={isActive ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 255, 255, 0.2)'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={isActive ? '0' : '5,5'}
            />
            {/* Arrow marker at end */}
            <circle
                cx={to.x}
                cy={to.y}
                r="4"
                fill={isActive ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 255, 255, 0.3)'}
            />

            {/* SVG filter for glow effect */}
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </g>
    );
};

export default ConnectionLine;
