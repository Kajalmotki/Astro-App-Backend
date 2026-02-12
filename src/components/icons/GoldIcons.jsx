import React from 'react';

const IconWrapper = ({ children, size = 40, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFD700"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.3))' }}
    >
        {children}
    </svg>
);

export const KundliIcon = ({ size }) => (
    <IconWrapper size={size}>
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M2 2 L22 22" />
        <path d="M22 2 L2 22" />
        <path d="M12 2 L22 12 L12 22 L2 12 Z" />
    </IconWrapper>
);

export const MatchmakingIcon = ({ size }) => (
    <IconWrapper size={size}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        {/* Second interlocking heart effect - slightly offset or simplified */}
        <path d="M12 5.36L12.35 5C13.55 3.68 15.2 3 16.5 3c2.75 0 5.25 2.15 5.25 5.5 0 2.22-1.46 3.93-2.91 5.38" strokeOpacity="0.5" />
    </IconWrapper>
);

export const PanchangIcon = ({ size }) => (
    <IconWrapper size={size}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M12 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        <path d="M12 14c.5 0 1 .2 1.5.5.5-1 1-2.5 1-2.5" strokeOpacity="0" />
        {/* Crescent Moon approximation inside */}
        <path d="M10.5 15.5 A 2.5 2.5 0 0 0 13 18 A 2.5 2.5 0 1 1 10.5 15.5" fill="#FFD700" fillOpacity="0.1" stroke="none" />
        <path d="M14 16 A 2 2 0 1 1 11 16" strokeLinecap="round" />
    </IconWrapper>
);

export const PoojaIcon = ({ size }) => (
    <IconWrapper size={size}>
        {/* Diya Base */}
        <path d="M4 14 C4 18 8 20 12 20 C16 20 20 18 20 14 C20 12 16 13 12 13 C8 13 4 12 4 14 Z" />
        <path d="M2 14 C2 14 3 12 6 12" strokeOpacity="0" />
        {/* Flame */}
        <path d="M12 12 Q10 8 12 4 Q14 8 12 12 Z" fill="rgba(255, 215, 0, 0.2)" />
        <line x1="12" y1="12" x2="12" y2="13" />
    </IconWrapper>
);

export const HoroscopeIcon = ({ size }) => (
    <IconWrapper size={size}>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </IconWrapper>
);

export const GemstoneIcon = ({ size }) => (
    <IconWrapper size={size}>
        <path d="M6 3 L18 3 L22 9 L12 22 L2 9 L6 3 Z" />
        <path d="M12 22 L6 3" />
        <path d="M12 22 L18 3" />
        <path d="M2 9 L22 9" />
    </IconWrapper>
);

export const KarmicIcon = ({ size }) => (
    <IconWrapper size={size}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M12 8a2 2 0 1 1 0 4c0 1 0 1.5 1 2" /> {/* Question Mark Part */}
        <circle cx="13" cy="16" r="0.5" fill="currentColor" />
    </IconWrapper>
);

export const NumerologyIcon = ({ size }) => (
    <IconWrapper size={size}>
        <circle cx="8" cy="8" r="6" />
        <circle cx="16" cy="16" r="6" />
        <text x="5.5" y="10" fontSize="8" fill="#FFD700" stroke="none" fontFamily="sans-serif">01</text>
        <text x="13.5" y="18" fontSize="8" fill="#FFD700" stroke="none" fontFamily="sans-serif">10</text>
    </IconWrapper>
);

export default {
    KundliIcon,
    MatchmakingIcon,
    PanchangIcon,
    PoojaIcon,
    HoroscopeIcon,
    GemstoneIcon,
    KarmicIcon,
    NumerologyIcon
};
