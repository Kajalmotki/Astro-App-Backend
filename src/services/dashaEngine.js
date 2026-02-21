/**
 * AstroRevo Vimshottari Dasha Engine
 * Pure mathematical computation of all 6 classical Dasha levels based on Moon's longitude.
 */

const DASHA_YEARS = [
    { planet: 'Ketu', years: 7 },
    { planet: 'Venus', years: 20 },
    { planet: 'Sun', years: 6 },
    { planet: 'Moon', years: 10 },
    { planet: 'Mars', years: 7 },
    { planet: 'Rahu', years: 18 },
    { planet: 'Jupiter', years: 16 },
    { planet: 'Saturn', years: 19 },
    { planet: 'Mercury', years: 17 }
];

const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const DAYS_IN_YEAR = 365.2425;
const MS_PER_YEAR = DAYS_IN_YEAR * 24 * 60 * 60 * 1000;

/**
 * Calculate Nakshatra details from Moon Longitude
 * @param {number} moonLong - Absolute sidereal longitude of Moon (0-360)
 * @returns {object} Nakshatra specific info and Mahadasha balance
 */
export const getMoonNakshatra = (moonLong) => {
    const NAKSHATRA_ARC = 360 / 27; // 13.333333°
    const nakshatraIndex = Math.floor(moonLong / NAKSHATRA_ARC);
    const degreesWithin = moonLong % NAKSHATRA_ARC;
    const fractionElapsed = degreesWithin / NAKSHATRA_ARC;
    const fractionRemaining = 1 - fractionElapsed;

    const lordIndex = nakshatraIndex % 9;
    const lord = DASHA_YEARS[lordIndex];

    return {
        nakshatraName: NAKSHATRAS[nakshatraIndex],
        lordPlanet: lord.planet,
        lordIndex: lordIndex,
        fractionRemaining: fractionRemaining,
        balanceYears: fractionRemaining * lord.years
    };
};

const addYears = (date, years) => {
    return new Date(date.getTime() + years * MS_PER_YEAR);
};

const findSubLevel = (parentPlanetIndex, parentStart, parentEnd, targetDate) => {
    const parentDurationMs = parentEnd.getTime() - parentStart.getTime();

    let start = new Date(parentStart.getTime());
    for (let j = 0; j < 9; j++) {
        const subIdx = (parentPlanetIndex + j) % 9;
        const subPlanetData = DASHA_YEARS[subIdx];

        const subDurationMs = parentDurationMs * (subPlanetData.years / 120);
        const end = new Date(start.getTime() + subDurationMs);

        if (targetDate >= start && targetDate <= end) {
            return {
                planet: subPlanetData.planet,
                planetIndex: subIdx,
                start: start,
                end: end,
                durationMs: subDurationMs
            };
        }
        start = new Date(end.getTime());
    }
    // Fallback if math rounding causes issues at bounds
    return {
        planet: DASHA_YEARS[parentPlanetIndex].planet,
        planetIndex: parentPlanetIndex,
        start: parentStart,
        end: parentEnd,
        durationMs: parentDurationMs
    };
};

/**
 * Calculate the active Dashas across all 6 hierarchical levels for a specified date
 * @param {Date} birthDateObj - Birth Date & Time
 * @param {number} moonLong - Moon's Absolute Sidereal Longitude (0-360)
 * @param {Date} targetDateObj - The date for which to calculate dashas (defaults to Now)
 * @returns {object|null} The dasha tree levels or null if out of 120 years bounds
 */
export const getCurrentDashas = (birthDateObj, moonLong, targetDateObj = new Date()) => {
    const nakData = getMoonNakshatra(moonLong);

    let currentDate = new Date(birthDateObj.getTime());
    let mahadasha = null;
    let mdStartIndex = nakData.lordIndex;

    let mdStart = new Date(currentDate.getTime());
    let mdEnd = addYears(mdStart, nakData.balanceYears);

    let i = 0;
    while (i < 120) {
        const planetIdx = (mdStartIndex + i) % 9;
        const planetData = DASHA_YEARS[planetIdx];

        const durationYears = (i === 0) ? nakData.balanceYears : planetData.years;
        mdEnd = addYears(mdStart, durationYears);

        if (targetDateObj >= mdStart && targetDateObj <= mdEnd) {
            mahadasha = {
                planet: planetData.planet,
                planetIndex: planetIdx,
                start: mdStart,
                end: mdEnd,
                durationYears: durationYears
            };
            break;
        }

        mdStart = new Date(mdEnd.getTime());
        i++;
    }

    if (!mahadasha) return null;

    const antardasha = findSubLevel(mahadasha.planetIndex, mahadasha.start, mahadasha.end, targetDateObj);
    const pratyantar = findSubLevel(antardasha.planetIndex, antardasha.start, antardasha.end, targetDateObj);
    const sookshma = findSubLevel(pratyantar.planetIndex, pratyantar.start, pratyantar.end, targetDateObj);
    const prana = findSubLevel(sookshma.planetIndex, sookshma.start, sookshma.end, targetDateObj);
    const deha = findSubLevel(prana.planetIndex, prana.start, prana.end, targetDateObj);

    return {
        mahadasha,
        antardasha,
        pratyantar,
        sookshma,
        prana,
        deha
    };
};

/**
 * Format the 6 level Dasha tree into a readable multi-line string block
 * @param {object} levels - Result from getCurrentDashas()
 * @returns {string} Formatted string
 */
export const getDashaString = (levels) => {
    if (!levels) return "End of Dasha timeline or data missing.";

    const formatDt = (dt) => dt.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });

    return `Mahadasha:       ${levels.mahadasha.planet.padEnd(8)} (${formatDt(levels.mahadasha.start)} – ${formatDt(levels.mahadasha.end)})
Antardasha:      ${levels.antardasha.planet.padEnd(8)} (${formatDt(levels.antardasha.start)} – ${formatDt(levels.antardasha.end)})
Pratyantardasha: ${levels.pratyantar.planet.padEnd(8)} (${formatDt(levels.pratyantar.start)} – ${formatDt(levels.pratyantar.end)})
Sookshmadasha:   ${levels.sookshma.planet.padEnd(8)} (${formatDt(levels.sookshma.start)} – ${formatDt(levels.sookshma.end)})
Pranadasha:      ${levels.prana.planet.padEnd(8)} (${formatDt(levels.prana.start)} – ${formatDt(levels.prana.end)})
Dehadasha:       ${levels.deha.planet.padEnd(8)} (${formatDt(levels.deha.start)} – ${formatDt(levels.deha.end)})`;
};
