import { Origin, Horoscope } from "circular-natal-horoscope-js/dist/index.js";
import { getCurrentDashas, getDashaString } from "./dashaEngine.js";
import { calculateChakraStrengths } from "./strengthEngine.js";
const OPENROUTER_API_KEY = "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";

// Standard Vedic Signs in order (for whole-sign house calculation)
const VEDIC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const RASHI_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
};

const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
    "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

/**
 * Calculates the exact astrological data deterministically using Swiss Ephemeris (via circular-natal-horoscope-js)
 * Guarantees mathematical perfection. The AI will only interpret, not calculate.
 */
export const precalculateChartData = (birthData) => {
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
            const absoluteDeg = body.ChartPosition.Ecliptic.DecimalDegrees;
            const deg = absoluteDeg % 30;
            const house = getWholeSignHouse(sign);

            const nakIndex = Math.floor(absoluteDeg / 13.33333333);
            const remainderDeg = absoluteDeg % 13.33333333;
            const pada = Math.floor(remainderDeg / 3.33333333) + 1;
            const nakshatra = NAKSHATRAS[nakIndex];

            return { name: planetMap[key], sign, deg: formatDeg(deg), house, absoluteDeg, nakshatra, pada };
        }).filter(p => p !== null);

        // Add Ketu (always opposite Rahu)
        const rahu = planetList.find(p => p.name === 'Rahu');
        if (!rahu) {
            console.warn('Rahu not found in planet list — skipping Ketu calculation. Points keys:', Object.keys(points));
        }
        const ketuSignIndex = rahu ? (VEDIC_SIGNS.findIndex(s => s.toLowerCase() === rahu.sign.toLowerCase()) + 6) % 12 : -1;
        if (rahu && ketuSignIndex !== -1) {
            const ketuAbsDeg = (rahu.absoluteDeg + 180) % 360;
            const knakIndex = Math.floor(ketuAbsDeg / 13.33333333);
            const kremainderDeg = ketuAbsDeg % 13.33333333;
            const kpada = Math.floor(kremainderDeg / 3.33333333) + 1;

            planetList.push({
                name: 'Ketu',
                sign: VEDIC_SIGNS[ketuSignIndex],
                deg: rahu.deg,
                house: (rahu.house + 6 - 1) % 12 + 1,
                absoluteDeg: ketuAbsDeg,
                nakshatra: NAKSHATRAS[knakIndex],
                pada: kpada
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

        return {
            dayOfWeek,
            rawText: generatedRawText,
            ascSign: ascSignStr,
            ascDeg: formatDeg(ascDeg),
            ascLord: RASHI_LORDS[ascSignStr] || "Unknown",
            planets: planetList,
            dashaString,
            chakras: chakraData,
            moonLong
        };
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
2. Provide logical, well-reasoned answers based on the classic Vedic rules (BPHS, Saravali).
3. Do NOT list out all the house lords, detailed placements, or step-by-step astrological workings. Keep your internal calculations hidden.
4. Just give the final synthesized insight and precise timing based on the current Dasha.
5. Do not hallucinate planetary positions.
6. AT THE VERY END OF YOUR RESPONSE, ALWAYS INCLUDE THIS EXACT TEXT: "\n\nYour exact 21-Day Personalized Yoga Transformation Plan based on your birth chart is ready and waiting for you in the Body Composition section under the Reports tab."`;
};

export const getLocalAIAstrologerResponse = async (message, userName, birthData, previousChart = null) => {
    // Pre-calculate chart data upfront so we can use it as fallback if API fails
    let mathData = null;
    if (!previousChart) {
        mathData = precalculateChartData(birthData);
        if (!mathData) {
            throw new Error("Local Math Engine failed to calculate planetary positions.");
        }
    }

    try {
        let prompt;
        if (previousChart) {
            prompt = getFollowUpPrompt(userName, message, previousChart);
        } else {
            // Step 2: Pass guaranteed data to LLM
            prompt = getInitialChartPrompt(userName, birthData, mathData);
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "AstroRevo"
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash",
                max_tokens: 1000,
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

        // FALLBACK: If API fails but we have locally calculated data, return it as chart data
        // This ensures the BeautifulD1Chart still renders with accurate planetary data
        if (!previousChart && mathData) {
            console.warn("OpenRouter API failed — falling back to offline chart data.");
            const offlineChart = {
                lagna: mathData.ascSign,
                dayOfBirth: mathData.dayOfWeek,
                planets: mathData.planets.map(p => ({
                    name: p.name,
                    sign: p.sign,
                    degree: p.deg,
                    house: p.house,
                    nakshatra: p.nakshatra,
                    pada: p.pada
                })),
                yogas: [],
                chakras: mathData.chakras,
                dashaTimeline: mathData.dashaString,
                dashaInsight: "⚠ AI interpretation unavailable (offline mode). Dasha data above is mathematically accurate."
            };
            return { isChartData: true, data: offlineChart };
        }

        throw error;
    }
};
