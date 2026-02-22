import { Origin, Horoscope } from "circular-natal-horoscope-js/dist/index.js";
import { getCurrentDashas, getDashaString } from "./dashaEngine.js";
import { calculateChakraStrengths } from "./strengthEngine.js";
const OPENROUTER_API_KEY = "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";

// Standard Vedic Signs in order (for whole-sign house calculation)
const VEDIC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

/**
 * Calculates the exact astrological data deterministically using Swiss Ephemeris (via circular-natal-horoscope-js)
 * Guarantees mathematical perfection. The AI will only interpret, not calculate.
 */
const precalculateChartData = (birthData) => {
    try {
        const { date, time } = birthData;
        // Ensure lat/lng are numbers (localStorage stores them as strings)
        const lat = parseFloat(birthData.lat);
        const lng = parseFloat(birthData.lng);
        const [day, month, year] = date.split('/').map(Number); // DD/MM/YYYY
        const [hour, minute] = time.split(':').map(Number);

        // Get day of the week
        const jsDate = new Date(year, month - 1, day, hour, minute);
        const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(jsDate);

        // The library expects standard calendar format (1-indexed day, 0-indexed month)
        const origin = new Origin({
            year, month: month - 1, date: day,
            hour, minute,
            latitude: lat, longitude: lng
        });

        // "placidus" is required for browser compat — houses are computed via Whole Sign manually below
        const horoscope = new Horoscope({
            origin,
            houseSystem: "placidus",
            zodiac: "sidereal",
            aspectPoints: ["bodies", "points", "angles"],
            aspectWithPoints: ["bodies", "points", "angles"],
            aspectTypes: ["major", "minor"],
            customOrbs: {},
            language: "en"
        });

        const bodies = horoscope.CelestialBodies;
        const points = horoscope.CelestialPoints;
        const angles = horoscope.Angles;

        // Ascendant details
        const ascSignStr = angles.ascendant.Sign.label;
        const ascDeg = angles.ascendant.ChartPosition.Ecliptic.DecimalDegrees % 30;
        const ascSignIndex = VEDIC_SIGNS.findIndex(s => s.toLowerCase() === ascSignStr.toLowerCase());

        const formatDeg = (deg) => {
            const d = Math.floor(deg);
            const m = Math.floor((deg - d) * 60);
            return `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'`;
        };

        // Calculate Whole Sign house placement for a body
        const getWholeSignHouse = (planetSignStr) => {
            const pIndex = VEDIC_SIGNS.findIndex(s => s.toLowerCase() === planetSignStr.toLowerCase());
            return ((pIndex - ascSignIndex + 12) % 12) + 1;
        };

        const planetsToExtract = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'northnode'];
        const planetMap = { 'sun': 'Sun', 'moon': 'Moon', 'mars': 'Mars', 'mercury': 'Mercury', 'jupiter': 'Jupiter', 'venus': 'Venus', 'saturn': 'Saturn', 'northnode': 'Rahu' };

        let generatedRawText = `Day of Birth: ${dayOfWeek}\nLagna (Ascendant): ${ascSignStr} ${formatDeg(ascDeg)}\n\n`;

        // Helper to find a body from either CelestialBodies or CelestialPoints,
        // trying multiple common key casings used by circular-natal-horoscope-js
        const findBody = (key) => {
            // Try direct key in bodies first
            if (bodies[key]) return bodies[key];
            // For northnode, try multiple casings in points (library version may differ)
            if (key === 'northnode') {
                return points['northnode'] || points['northNode'] || points['NorthNode'] || points['north_node'] || null;
            }
            return points[key] || null;
        };

        const planetList = planetsToExtract.map(key => {
            const body = findBody(key);
            if (!body || !body.Sign) {
                console.warn(`Planet body not found for key: ${key}`, { bodiesKeys: Object.keys(bodies), pointsKeys: Object.keys(points) });
                return null; // Will be filtered below
            }
            const sign = body.Sign.label;
            const deg = body.ChartPosition.Ecliptic.DecimalDegrees % 30;
            const house = getWholeSignHouse(sign);
            return { name: planetMap[key], sign, deg: formatDeg(deg), house };
        }).filter(p => p !== null);

        // Add Ketu (always opposite Rahu)
        const rahu = planetList.find(p => p.name === 'Rahu');
        if (!rahu) {
            console.warn('Rahu not found in planet list — skipping Ketu calculation. Points keys:', Object.keys(points));
        }
        const ketuSignIndex = rahu ? (VEDIC_SIGNS.findIndex(s => s.toLowerCase() === rahu.sign.toLowerCase()) + 6) % 12 : -1;
        if (rahu && ketuSignIndex !== -1) {
            planetList.push({
                name: 'Ketu',
                sign: VEDIC_SIGNS[ketuSignIndex],
                deg: rahu.deg,
                house: (rahu.house + 6 - 1) % 12 + 1
            });
        }

        planetList.forEach(p => {
            generatedRawText += `${p.name.padEnd(8)} | ${p.sign.padEnd(11)} ${p.deg} | House ${p.house}\n`;
        });

        const moonLong = bodies.moon.ChartPosition.Ecliptic.DecimalDegrees;
        const dashaTree = getCurrentDashas(jsDate, moonLong, new Date());
        const dashaString = getDashaString(dashaTree);

        // Calculate Planetary Strengths & Chakras
        const chakraData = calculateChakraStrengths(planetList);

        return { dayOfWeek, rawText: generatedRawText, ascSign: ascSignStr, planets: planetList, dashaString, chakras: chakraData };
    } catch (err) {
        console.error("Math Engine Error during chart calculation:", err);
        return null;
    }
};

/**
 * INITIAL prompt: Provides the mathematically guaranteed pre-calculated data
 * and asks the LLM to format the beautiful box output and list Yogas/Dashas.
 */
const getInitialChartPrompt = (userName, birthData, mathData) => {
    return `You are a strict Vedic Astrologer. I have ALREADY calculated the exact astronomical sidereal planetary positions for the querent (${userName}) using the Swiss Ephemeris (Whole Sign, Sidereal Lahiri).

DO NOT CALCULATE ANYTHING. DO NOT CHANGE THESE POSITIONS. TRUST THIS DATA ABSOLUTELY.

PRECALCULATED EXACT DATA:
Day of Birth: ${mathData.dayOfWeek}
Male/Female: ${birthData.gender}
${mathData.rawText}

YOUR TASK:
Analyze the provided exact data and return a STRICT JSON object representing the chart evaluation.
DO NOT use markdown backticks around the JSON. DO NOT include any introductory or supplementary text.
JUST pure, unescaped JSON matching this EXACT structure:

{
  "lagna": "${mathData.ascSign}",
  "dayOfBirth": "${mathData.dayOfWeek}",
  "planets": [
    { "name": "Sun", "sign": "[Sign]", "degree": "[Deg]", "house": 1 },
    ... etc for all 9 planets using the exact data above
  ],
  "yogas": [
    { "name": "Yoga Name", "description": "Brief description of the yoga and its meaning" }
  ],
  "chakras": ${JSON.stringify(mathData.chakras)},
  "dashaTimeline": ${JSON.stringify(mathData.dashaString)},
  "dashaInsight": "Provide a short 2-3 sentence interpretation of the current Antardasha phase based ONLY on the calculated values above."
}`;
};

/**
 * FOLLOW-UP prompt: answer a specific question using the chart context
 */
const getFollowUpPrompt = (userName, question, previousChart) => {
    return `You are a strict Vedic Astrologer. You have already computed the D1 chart for ${userName}.

Previously generated chart context:
${previousChart}

The user now asks: "${question}"

Answer strictly based on the planetary placements in the chart above. Use BPHS and Saravali rules.
Be precise, engaging, and direct. 
CRITICAL RULES FOR YOUR RESPONSE:
1. Provide a concise, high-level answer.
2. If discussing remedies, wellness, struggles, or yoga, PROACTIVELY TELL THEM: "Your exact 21-Day Personalized Yoga Transformation Plan based on your birth chart is ready and waiting for you in the Body Composition section under the Reports tab."
3. Do NOT list out all the house lords, detailed placements, or step-by-step astrological workings. Keep your internal calculations hidden.
4. Just give the final synthesized insight and precise timing based on the current Dasha.
5. Do not hallucinate planetary positions.`;
};

export const getLocalAIAstrologerResponse = async (message, userName, birthData, previousChart = null) => {
    try {
        let prompt;
        if (previousChart) {
            prompt = getFollowUpPrompt(userName, message, previousChart);
        } else {
            // Step 1: Deterministic Ephemeris Calculation (Browser Side)
            const mathData = precalculateChartData(birthData);
            if (!mathData) {
                throw new Error("Local Math Engine failed to calculate planetary positions.");
            }
            // Step 2: Pass guaranteed data to LLM
            prompt = getInitialChartPrompt(userName, birthData, mathData);
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                max_tokens: previousChart ? 800 : 1500,
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`OpenRouter error: ${response.status} ${err}`);
        }

        const data = await response.json();
        const responseText = data.choices?.[0]?.message?.content;
        if (!responseText) throw new Error("No response from AI.");

        // If it's the initial chart generation, parse the JSON
        if (!previousChart) {
            try {
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
                const parsedChart = JSON.parse(jsonStr);
                return { isChartData: true, data: parsedChart };
            } catch (err) {
                console.error("Failed to parse AI JSON chart response:", err, responseText);
                return { isChartData: true, error: true, data: responseText };
            }
        }

        // Otherwise return normal text string for followups
        return responseText;
    } catch (error) {
        console.error("Local AI Error:", error);
        throw error;
    }
};
