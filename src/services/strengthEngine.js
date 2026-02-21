/**
 * AstroRevo Planetary Strength & Chakra Engine
 * Implements simplified Shadbala (Sthana Bala focused) and maps the 7 physical planets to Chakras.
 */

// Basic dignity mappings for Sthana Bala (Positional Strength)
// Using standard Vedic rules for Exaltation, Debilitation, Own, Moolatrikona
// Ranks: Exalted=100, Moolatrikona=85, Own=75, Friendly=60, Neutral=45, Enemy=25, Debilitated=10

const PLANET_DIGNITIES = {
    Sun: {
        exalted: 'Aries', debilitated: 'Libra', own: ['Leo'],
        moolatrikona: 'Leo', // 0-20 deg but simplified to sign level
        friends: ['Moon', 'Mars', 'Jupiter'],
        enemies: ['Venus', 'Saturn'],
        neutrals: ['Mercury']
    },
    Moon: {
        exalted: 'Taurus', debilitated: 'Scorpio', own: ['Cancer'],
        moolatrikona: 'Taurus',
        friends: ['Sun', 'Mercury'],
        enemies: [], // Moon evaluates no one as enemy natively, though others may evaluating Moon
        neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn']
    },
    Mars: {
        exalted: 'Capricorn', debilitated: 'Cancer', own: ['Aries', 'Scorpio'],
        moolatrikona: 'Aries',
        friends: ['Sun', 'Moon', 'Jupiter'],
        enemies: ['Mercury'],
        neutrals: ['Venus', 'Saturn']
    },
    Mercury: {
        exalted: 'Virgo', debilitated: 'Pisces', own: ['Gemini', 'Virgo'],
        moolatrikona: 'Virgo',
        friends: ['Sun', 'Venus'],
        enemies: ['Moon'],
        neutrals: ['Mars', 'Jupiter', 'Saturn']
    },
    Jupiter: {
        exalted: 'Cancer', debilitated: 'Capricorn', own: ['Sagittarius', 'Pisces'],
        moolatrikona: 'Sagittarius',
        friends: ['Sun', 'Moon', 'Mars'],
        enemies: ['Mercury', 'Venus'],
        neutrals: ['Saturn']
    },
    Venus: {
        exalted: 'Pisces', debilitated: 'Virgo', own: ['Taurus', 'Libra'],
        moolatrikona: 'Libra',
        friends: ['Mercury', 'Saturn'],
        enemies: ['Sun', 'Moon'],
        neutrals: ['Mars', 'Jupiter']
    },
    Saturn: {
        exalted: 'Libra', debilitated: 'Aries', own: ['Capricorn', 'Aquarius'],
        moolatrikona: 'Aquarius',
        friends: ['Mercury', 'Venus'],
        enemies: ['Sun', 'Moon', 'Mars'],
        neutrals: ['Jupiter']
    }
};

const PLANET_LORDS = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
    Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
};

const CHAKRA_MAP = {
    Mars: { name: 'Muladhara (Root)', color: '#ef4444', theme: 'Stability, Survival & Strength' },
    Jupiter: { name: 'Swadhisthana (Sacral)', color: '#f97316', theme: 'Pleasure & Creativity' },
    Venus: { name: 'Manipura (Solar Plexus)', color: '#eab308', theme: 'Power & Will' },
    Mercury: { name: 'Anahata (Heart)', color: '#22c55e', theme: 'Emotion & Compassion' },
    Saturn: { name: 'Vishuddha (Throat)', color: '#3b82f6', theme: 'Communication' },
    Sun: { name: 'Ajna (Third Eye)', color: '#8b5cf6', theme: 'Wisdom & Intuition' },
    Moon: { name: 'Sahasrara (Crown)', color: '#d946ef', theme: 'Higher Consciousness' }
};

const evaluateDignity = (planetName, signPlaced) => {
    // Only process the 7 physical planets
    const rules = PLANET_DIGNITIES[planetName];
    if (!rules) return { score: 50, label: 'Neutral' }; // Fallback for nodes

    if (rules.exalted === signPlaced) return { score: 100, label: 'Exalted' };
    if (rules.debilitated === signPlaced) return { score: 10, label: 'Debilitated' };
    if (rules.moolatrikona === signPlaced) return { score: 85, label: 'Moolatrikona' };
    if (rules.own.includes(signPlaced)) return { score: 75, label: 'Own Sign' };

    const signLord = PLANET_LORDS[signPlaced];
    if (rules.friends.includes(signLord)) return { score: 60, label: 'Friendly Sign' };
    if (rules.enemies.includes(signLord)) return { score: 25, label: 'Enemy Sign' };
    if (rules.neutrals.includes(signLord)) return { score: 45, label: 'Neutral Sign' };

    return { score: 50, label: 'Standard' };
};

/**
 * Main exposed function: converts the raw planet array from the chart generator
 * into a chakra mapping with percentages.
 * @param {Array} chartPlanets - Array of planet objects {name, sign, degree, house} 
 */
export const calculateChakraStrengths = (chartPlanets) => {
    const chakras = [];

    // Filter to only the 7 classical planets
    const physicalPlanets = chartPlanets.filter(p => CHAKRA_MAP[p.name]);

    physicalPlanets.forEach(p => {
        const dignity = evaluateDignity(p.name, p.sign);
        const chakraInfo = CHAKRA_MAP[p.name];

        let stateLabel = 'Balanced';
        if (dignity.score >= 80) stateLabel = 'Very Strong';
        else if (dignity.score >= 60) stateLabel = 'Strong';
        else if (dignity.score >= 40) stateLabel = 'Moderate';
        else if (dignity.score >= 20) stateLabel = 'Weak';
        else stateLabel = 'Very Weak';

        chakras.push({
            planet: p.name,
            chakra: chakraInfo.name,
            theme: chakraInfo.theme,
            color: chakraInfo.color,
            dignityLabel: dignity.label,
            strengthPercent: dignity.score,
            state: stateLabel
        });
    });

    // Sort by physiological order (Root to Crown) based on the new mapping
    const order = ['Mars', 'Jupiter', 'Venus', 'Mercury', 'Saturn', 'Sun', 'Moon'];
    chakras.sort((a, b) => order.indexOf(a.planet) - order.indexOf(b.planet));

    return chakras;
};
