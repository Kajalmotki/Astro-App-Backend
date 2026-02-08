/**
 * choghadiyaUtils.js
 * Utilities for calculating Daily Choghadiya Muhurats (Vedic Timing)
 */

// Choghadiya Types and their Qualities
export const CHOGHADIYA_TYPES = {
    UDVEG: { name: 'Udveg', quality: 'Bad', color: '#EF4444', meaning: 'Anxiety (Sun)' },
    CHAL: { name: 'Chal', quality: 'Neutral', color: '#3B82F6', meaning: 'Motion (Venus)' },
    LABH: { name: 'Labh', quality: 'Good', color: '#10B981', meaning: 'Profit (Mercury)' },
    AMRIT: { name: 'Amrit', quality: 'Good', color: '#F59E0B', meaning: 'Nectar (Moon)' },
    KAAL: { name: 'Kaal', quality: 'Bad', color: '#000000', meaning: 'Death (Saturn)' },
    SHUBH: { name: 'Shubh', quality: 'Good', color: '#059669', meaning: 'Lucky (Jupiter)' },
    ROG: { name: 'Rog', quality: 'Bad', color: '#B91C1C', meaning: 'Disease (Mars)' }
};

// Fixed Sequences for Day (Sunrise to Sunset)
// Sunday (0) to Saturday (6)
const DAY_SEQUENCES = [
    ['UDVEG', 'CHAL', 'LABH', 'AMRIT', 'KAAL', 'SHUBH', 'ROG', 'UDVEG'], // Sunday
    ['AMRIT', 'KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAL', 'LABH', 'AMRIT'], // Monday
    ['ROG', 'UDVEG', 'CHAL', 'LABH', 'AMRIT', 'KAAL', 'SHUBH', 'ROG'],   // Tuesday
    ['LABH', 'AMRIT', 'KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAL', 'LABH'],   // Wednesday
    ['SHUBH', 'ROG', 'UDVEG', 'CHAL', 'LABH', 'AMRIT', 'KAAL', 'SHUBH'], // Thursday
    ['CHAL', 'LABH', 'AMRIT', 'KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAL'],  // Friday
    ['KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAL', 'LABH', 'AMRIT', 'KAAL']   // Saturday
];

// Fixed Sequences for Night (Sunset to Next Sunrise)
const NIGHT_SEQUENCES = [
    ['SHUBH', 'AMRIT', 'CHAL', 'ROG', 'KAAL', 'LABH', 'UDVEG', 'SHUBH'], // Sunday
    ['CHAL', 'ROG', 'KAAL', 'LABH', 'UDVEG', 'SHUBH', 'AMRIT', 'CHAL'],  // Monday
    ['KAAL', 'LABH', 'UDVEG', 'SHUBH', 'AMRIT', 'CHAL', 'ROG', 'KAAL'],   // Tuesday
    ['UDVEG', 'SHUBH', 'AMRIT', 'CHAL', 'ROG', 'KAAL', 'LABH', 'UDVEG'],  // Wednesday
    ['AMRIT', 'CHAL', 'ROG', 'KAAL', 'LABH', 'UDVEG', 'SHUBH', 'AMRIT'],  // Thursday
    ['ROG', 'KAAL', 'LABH', 'UDVEG', 'SHUBH', 'AMRIT', 'CHAL', 'ROG'],    // Friday
    ['LABH', 'UDVEG', 'SHUBH', 'AMRIT', 'CHAL', 'ROG', 'KAAL', 'LABH']    // Saturday
];

// Accurate Solar Calculation (NOAA Algorithm)
const rad = (deg) => (deg * Math.PI) / 180;
const deg = (rad) => (rad * 180) / Math.PI;

const getJulianDay = (date) => {
    return (date.getTime() / 86400000) + 2440587.5;
};

const getSolarTimes = (date, lat, lng) => {
    const jd = getJulianDay(date);
    const n = Math.ceil(jd - 2451545.0 + 0.0008);
    const j_star = n - (lng / 360);
    const M = (357.5291 + 0.98560028 * j_star) % 360;
    const C = (1.9148 * Math.sin(rad(M))) + (0.0200 * Math.sin(rad(2 * M))) + (0.0003 * Math.sin(rad(3 * M)));
    const lambda = (M + C + 182.9772 + 360) % 360;
    const J_transit = 2451545.0 + j_star + (0.0053 * Math.sin(rad(M))) - (0.0069 * Math.sin(rad(2 * lambda)));

    const sin_delta = Math.sin(rad(lambda)) * Math.sin(rad(23.44));
    const cos_omega = (Math.sin(rad(-0.833)) - Math.sin(rad(lat)) * sin_delta) / (Math.cos(rad(lat)) * Math.cos(Math.asin(sin_delta)));

    // Check if sun never rises/sets
    if (cos_omega > 1 || cos_omega < -1) return null;

    const omega = deg(Math.acos(cos_omega));
    const J_rise = J_transit - (omega / 360);
    const J_set = J_transit + (omega / 360);

    const jdToDate = (j) => new Date((j - 2440587.5) * 86400000);

    return {
        sunrise: jdToDate(J_rise),
        sunset: jdToDate(J_set)
    };
};

export const getSunTimes = (date, lat = 23.0225, lng = 72.5714) => { // Default to Ahmedabad (Drik Panchang Ref)
    // 1. Calculate Today's Sunrise/Sunset
    let times = getSolarTimes(date, lat, lng);

    // Correction: Adjust for Timezone offset (IST is UTC+5.5)
    // The algo returns UTC. We need to preserve that point in time.
    // JS Date objects handle timezone automatically if constructed from UTC timestamp.
    // However, the input 'date' usually has local midnight.

    // Let's ensure we are calculating for the input date.

    // 2. Calculate Next Day's Sunrise (for Night Choghadiya)
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    const nextTimes = getSolarTimes(nextDay, lat, lng);

    return {
        sunrise: times.sunrise,
        sunset: times.sunset,
        nextSunrise: nextTimes.sunrise
    };
};

export const calculateChoghadiya = (date = new Date(), lat, lng) => {
    const dayOfWeek = date.getDay(); // 0 = Sunday
    const { sunrise, sunset, nextSunrise } = getSunTimes(date, lat, lng);

    // Calculate Duration of Each Choghadiya (Day)
    const dayDurationMs = sunset - sunrise;
    const daySegmentMs = dayDurationMs / 8;

    const dayChoghadiyas = DAY_SEQUENCES[dayOfWeek].map((key, index) => {
        const start = new Date(sunrise.getTime() + (index * daySegmentMs));
        const end = new Date(start.getTime() + daySegmentMs);
        return {
            ...CHOGHADIYA_TYPES[key],
            start,
            end,
            period: 'Day'
        };
    });

    // Calculate Duration of Each Choghadiya (Night)
    const nightDurationMs = nextSunrise - sunset;
    const nightSegmentMs = nightDurationMs / 8;

    const nightChoghadiyas = NIGHT_SEQUENCES[dayOfWeek].map((key, index) => {
        const start = new Date(sunset.getTime() + (index * nightSegmentMs));
        const end = new Date(start.getTime() + nightSegmentMs);
        return {
            ...CHOGHADIYA_TYPES[key],
            start,
            end,
            period: 'Night'
        };
    });

    return {
        day: dayChoghadiyas,
        night: nightChoghadiyas,
        sunrise,
        sunset
    };
};

export const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
