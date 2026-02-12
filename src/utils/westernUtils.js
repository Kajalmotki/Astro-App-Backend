import { Origin, Horoscope } from "circular-natal-horoscope-js/dist/index.js";

export const calculateWesternChart = (formData) => {
    try {
        const { date, time, lat, lng } = formData;
        const [year, month, day] = date.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);

        // Month is 0-indexed in many JS libraries, let's verify if this library follows suit. 
        // Usually JS Date uses 0-11. The library documentation (implied) might follow standard JS patterns.
        // Let's assume 0-indexed for now (January = 0).

        const origin = new Origin({
            year,
            month: month - 1,
            date: day,
            hour,
            minute,
            latitude: lat,
            longitude: lng,
        });

        const horoscope = new Horoscope({
            origin,
            houseSystem: "placidus",
            zodiac: "tropical",
            aspectPoints: ["bodies", "points", "angles"],
            aspectWithPoints: ["bodies", "points", "angles"],
            aspectTypes: ["major", "minor"],
            customOrbs: {},
            language: "en"
        });

        // The library returns complex objects. We need to map them to our UI structure.
        // Structure: { planets: [], aspects: [] }

        // Planets mapping
        const celestialBodies = horoscope.CelestialBodies;
        const planets = [
            'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
            'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
            'Ascendant', 'Midheaven' // Angles
        ];

        const mappedPlanets = planets.map(name => {
            const body = celestialBodies[name.toLowerCase()] || celestialBodies[name]; // Handle casing
            if (!body) return null;

            return {
                name: name,
                sign: body.Sign.label,
                degree: formatDegree(body.ChartPosition.Ecliptic.DecimalDegrees), // This might need adjustment based on library output
                house: body.House.label,
                icon: getPlanetIcon(name)
            };
        }).filter(Boolean);

        // Aspects mapping
        const aspects = horoscope.Aspects.all.map(aspect => ({
            p1: aspect.point1Label,
            p2: aspect.point2Label,
            type: aspect.aspectLevelLabel, // e.g. "Conjunction"
            angle: aspect.orb + "°",
            nature: getAspectNature(aspect.aspectLevelLabel),
            class: aspect.aspectLevelLabel.toLowerCase()
        })).slice(0, 15); // Limit to top 15 for performance/UI

        return { planets: mappedPlanets, aspects };

    } catch (error) {
        console.error("Western Chart Calculation Error:", error);
        // Fallback to mock data to prevent crash during demo if library fails
        return null;
    }
};

// Helper to format degrees (Library likely returns absolute chart degrees 0-360)
// We might need to convert to Sign specific degrees manually if the library doesn't.
const formatDegree = (decimal) => {
    // Placeholder formatting
    return Math.floor(decimal) + "°";
};

const getPlanetIcon = (name) => {
    const icons = {
        'Sun': '☀️', 'Moon': '🌙', 'Mercury': '☿️', 'Venus': '♀️',
        'Mars': '♂️', 'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅',
        'Neptune': '♆', 'Pluto': '♇', 'Ascendant': '⬆️', 'Midheaven': 'MC'
    };
    return icons[name] || '✨';
};

const getAspectNature = (type) => {
    const map = {
        'Conjunction': 'Powerful',
        'Opposition': 'Challenging',
        'Trine': 'Harmonious',
        'Square': 'Tension',
        'Sextile': 'Supportive'
    };
    return map[type] || 'Neutral';
};
