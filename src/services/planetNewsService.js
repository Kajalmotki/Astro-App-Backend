import { Origin, Horoscope } from "circular-natal-horoscope-js/dist/index.js";

/**
 * Generates "Breaking News" style updates about current planetary positions.
 * Uses the current date/time to calculate the "Chart of the Now".
 */
export const getPlanetaryNews = () => {
    const now = new Date();

    // Use a default location (Greenwich) for global transit logic
    // We strictly care about the Zodiac Sign placement, which is roughly global.
    const origin = new Origin({
        year: now.getFullYear(),
        month: now.getMonth(), // 0-indexed
        date: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        latitude: 51.5,
        longitude: 0,
    });

    try {
        const horoscope = new Horoscope({
            origin,
            houseSystem: "placidus",
            zodiac: "tropical",
            aspectPoints: ["bodies"],
            aspectWithPoints: ["bodies"],
            aspectTypes: [],
            customOrbs: {},
            language: "en"
        });

        const emojis = {
            'Sun': '☀️', 'Moon': '🌙', 'Mercury': '☿️', 'Venus': '♀️',
            'Mars': '♂️', 'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅',
            'Neptune': '♆', 'Pluto': '♇'
        };

        const celestialBodies = horoscope.CelestialBodies;
        const mainPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

        const newsItems = mainPlanets.map(planet => {
            const body = celestialBodies[planet.toLowerCase()];
            if (!body) return null;

            const sign = body.Sign.label;
            const emoji = emojis[planet] || '✨';

            // Randomize "News" templates for variety
            const templates = [
                `Update: ${emoji} ${planet} is currently transiting ${sign}`,
                `${emoji} ${planet} Energy: Now moving through ${sign}`,
                `Cosmic Alert: ${planet} is in ${sign} ${emoji}`,
                `Current Sky: ${planet} brings ${sign} vibes today`
            ];

            return templates[Math.floor(Math.random() * templates.length)];
        }).filter(Boolean);

        // Add some generic "Astrological Weather" items
        newsItems.push("✨ Mercury Retrograde Status: Direct Motion"); // Placeholder logic
        newsItems.push("🌑 Moon Phase: Waxing Crescent"); // Placeholder logic

        return newsItems;

    } catch (error) {
        console.error("Failed to calculate planetary news", error);
        return [
            "☀️ Sun is shining on you today",
            "🌙 Moon guides your intuition",
            "✨ The stars are aligning for success"
        ];
    }
};
