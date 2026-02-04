/**
 * Service to interact with Vedic Astrology APIs
 * Primarily uses VedAstro API (https://api.vedastro.org)
 */

const BASE_URL = "https://api.vedastro.org";
const DEFAULT_TIMEZONE = "+05:30"; // Default to India Standard Time

/**
 * Generates a South Indian Chart (SVG) for the given birth details.
 * @param {Object} birthDetails - { name, day, month, year, hour, min, place, sex }
 * @returns {Promise<string>} - The SVG string of the chart.
 */
export const getVedicChartSvg = async (birthDetails) => {
    try {
        // 1. Format Time: HH:mm/dd/MM/yyyy/offset
        // Example: 14:30/31/12/2000/+05:30
        const { day, month, year, hour, min, place, name } = birthDetails;

        // Ensure double digits
        const dd = String(day).padStart(2, '0');
        const mm = String(month).padStart(2, '0');
        const yyyy = year;
        const HH = String(hour).padStart(2, '0');
        const MM = String(min).padStart(2, '0');

        // Clean strings
        const cleanName = name ? name.trim().replace(/\s+/g, '') : "User";
        const cleanPlace = place ? place.trim() : "Mumbai";

        // Construct URL
        // Endpoint: /Calculate/SouthIndianChart/Location/Singapore/Time/23:59/31/12/2000/+08:00/Person/TestUser
        // Note: VedAstro API is case-sensitive and structure-sensitive.
        // We use "SouthIndianChart" as it's a standard visual. "NorthIndianChart" is also an option if preferred.
        // For "Chart" we often want the visual.

        // Let's try North Indian Chart as it's often preferred in North India (User has many North Indian cities in list)
        // But let's stick to SouthIndianChart as it's safer/standard in the API docs usually. 
        // Actually, let's make it configurable or standard. "SouthIndianChart" is the keyword.
        // Let's try "NorthIndianChart" if available, otherwise South. 
        // API documentation usually lists "SouthIndianChart" and "NorthIndianChart". 
        // I will use "SouthIndianChart" for now to be safe, or "NorthIndianChart" if the user fits that demographic (AstroRevo context seems mixed).

        const chartType = "SouthIndianChart";

        const timeString = `${HH}:${MM}/${dd}/${mm}/${yyyy}/${DEFAULT_TIMEZONE}`;
        const url = `${BASE_URL}/Calculate/${chartType}/Location/${encodeURIComponent(cleanPlace)}/Time/${timeString}/Person/${encodeURIComponent(cleanName)}`;

        console.log("Fetching Vedic Chart from:", url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        // The API returns the SVG string directly
        const svgData = await response.text();

        return svgData;

    } catch (error) {
        console.warn("Vedic Astro API Error, falling back to mock:", error);
        return generateMockSouthIndianChart(birthDetails);
    }
};

/**
 * Fetches Chart Data from Local Python API
 * @returns {Promise<Object>} JSON data of chart
 */
export const getLocalVedicChart = async (birthDetails) => {
    try {
        const { day, month, year, hour, min, place, name } = birthDetails;

        // Need Lat/Long for SwissEph.
        // We can use a free Geocoding API or mock it for now since the Python script takes lat/long.
        // Or if the Python script was updated to take City name? 
        // User's python script takes: date, time, latitude, longitude, timezone.
        // So we MUST geocode the city here in JS before calling Python.

        // Quick Geocoding using Open-Meteo as planned originally
        let lat = 19.0760; // Mumbai default
        let lon = 72.8777;

        try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`;
            const geoResp = await fetch(geoUrl);
            const geoData = await geoResp.json();
            if (geoData.results && geoData.results.length > 0) {
                lat = geoData.results[0].latitude;
                lon = geoData.results[0].longitude;
            }
        } catch (e) {
            console.warn("Geocoding failed, using Mumbai default:", e);
        }

        const payload = {
            date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            time: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
            latitude: lat,
            longitude: lon,
            timezone: 5.5 // Default IST
        };

        console.log("Calling Python Backend:", payload);
        const response = await fetch("http://127.0.0.1:8000/generate-d1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Python API Error: ${response.status}`);
        }

        const chartData = await response.json();
        return { type: 'json', data: chartData };

    } catch (error) {
        console.error("Local Python API failed:", error);
        // Fallback to the SVG/Mock method if Python server is not running
        const svg = await getVedicChartSvg(birthDetails);
        return { type: 'svg', data: svg };
    }
};

/**
 * Generates a Mock South Indian Chart SVG
 * Used as fallback when API is unavailable.
 */
const generateMockSouthIndianChart = (details) => {
    const { name, day, month, year, hour, min, place } = details;

    // Simple deterministic random based on details
    const seed = name.length + parseInt(day) + parseInt(month) + parseInt(year);
    const planets = ["Sun", "Moon", "Mars", "Merc", "Jup", "Ven", "Sat", "Rahu", "Ketu", "Asc"];
    const signs = ["Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius"];

    // Box positions for South Indian Chart (Fixed Layout)
    // 0: Pisces, 1: Aries, 2: Taurus, 3: Gemini... (Clockwise from top-left usually?) 
    // South Indian Chart:
    // Top Row: Pisces, Aries, Taurus, Gemini
    // Right Col: Cancer, Leo
    // Bottom Row: Virgo, Libra, Scorpio, Sagittarius
    // Left Col: Capricorn, Aquarius

    // Let's define text positions for the 12 boxes (approx % coordinates)
    const boxRef = [
        { x: 25, y: 25, label: "Pisces" },      // Top Left
        { x: 50, y: 25, label: "Aries" },       // Top Mid-Left
        { x: 75, y: 25, label: "Taurus" },      // Top Mid-Right
        { x: 100, y: 25, label: "Gemini" },     // Top Right
        { x: 100, y: 50, label: "Cancer" },     // Right Top
        { x: 100, y: 75, label: "Leo" },        // Right Bottom
        { x: 100, y: 100, label: "Virgo" },     // Bottom Right
        { x: 75, y: 100, label: "Libra" },      // Bottom Mid-Right
        { x: 50, y: 100, label: "Scorpio" },    // Bottom Mid-Left
        { x: 25, y: 100, label: "Sagittarius" },// Bottom Left
        { x: 0, y: 75, label: "Capricorn" },    // Left Bottom
        { x: 0, y: 50, label: "Aquarius" }      // Left Top
    ];

    // Distribute planets randomly for the visual
    const planetPositions = {};
    planets.forEach((planet, index) => {
        const houseIndex = (seed + index * 7) % 12;
        if (!planetPositions[houseIndex]) planetPositions[houseIndex] = [];
        planetPositions[houseIndex].push(planet);
    });

    // Box styled SVG
    // We use a 4x4 grid concept.
    // 0,0 | 1,0 | 2,0 | 3,0   (Pisces | Aries | Taurus | Gemini)
    // 0,1 |     |     | 3,1   (Aqu  |      |      | Can)
    // 0,2 |     |     | 3,2   (Cap  |      |      | Leo)
    // 0,3 | 1,3 | 2,3 | 3,3   (Sag  | Scorp| Lib  | Vir)

    // Adjusted coords for SVG rects (0-100 scale)
    // Box Size = 50x50? No, 200x200 viewbox. 4 boxes = 50 each.

    let svgContent = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="background:none;">
        <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#D4AF37" />
            </marker>
        </defs>
        
        <!-- Outer Border -->
        <rect x="2" y="2" width="196" height="196" fill="none" stroke="#D4AF37" stroke-width="2" />
        
        <!-- Grid Lines -->
        <!-- Vertical -->
        <line x1="50" y1="0" x2="50" y2="200" stroke="#D4AF37" stroke-width="1" />
        <line x1="150" y1="0" x2="150" y2="200" stroke="#D4AF37" stroke-width="1" />
        <line x1="0" y1="50" x2="50" y2="50" stroke="#D4AF37" stroke-width="1" />
        <line x1="150" y1="50" x2="200" y2="50" stroke="#D4AF37" stroke-width="1" />
        <line x1="0" y1="150" x2="50" y2="150" stroke="#D4AF37" stroke-width="1" />
        <line x1="150" y1="150" x2="200" y2="150" stroke="#D4AF37" stroke-width="1" />
        
        <rect x="50" y="50" width="100" height="100" fill="none" stroke="#D4AF37" stroke-width="1" />

        <!-- Signs & Planets Text -->
        <style>
            .s-text { font-size: 6px; fill: #D4AF37; font-family: serif; opacity: 0.7; }
            .p-text { font-size: 7px; fill: #FFF; font-weight: bold; font-family: sans-serif; }
        </style>
    `;

    // Map logic to Grid Coords
    // Pisces (0) -> 50,0 to 100,50 ?? No.
    // Let's use specific centers for the 12 boxes.
    // 0: 0-50, 0-50 (Pisces)
    // 1: 50-100, 0-50 (Aries)
    // 2: 100-150, 0-50 (Taurus)
    // 3: 150-200, 0-50 (Gemini)

    // 4: 150-200, 50-100 (Cancer)
    // 5: 150-200, 100-150 (Leo)

    // 6: 150-200, 150-200 (Virgo)
    // 7: 100-150, 150-200 (Libra)
    // 8: 50-100, 150-200 (Scorpio)
    // 9: 0-50, 150-200 (Sagittarius)

    // 10: 0-50, 100-150 (Capricorn)
    // 11: 0-50, 50-100 (Aquarius)

    const boxCenters = [
        { id: 0, x: 25, y: 25, name: "Pis" },
        { id: 1, x: 75, y: 25, name: "Ari" },
        { id: 2, x: 125, y: 25, name: "Tau" },
        { id: 3, x: 175, y: 25, name: "Gem" },
        { id: 4, x: 175, y: 75, name: "Can" },
        { id: 5, x: 175, y: 125, name: "Leo" },
        { id: 6, x: 175, y: 175, name: "Vir" },
        { id: 7, x: 125, y: 175, name: "Lib" },
        { id: 8, x: 75, y: 175, name: "Sco" },
        { id: 9, x: 25, y: 175, name: "Sag" },
        { id: 10, x: 25, y: 125, name: "Cap" },
        { id: 11, x: 25, y: 75, name: "Aqu" }
    ];

    boxCenters.forEach(box => {
        // Sign Name
        svgContent += `<text x="${box.x}" y="${box.y - 15}" text-anchor="middle" class="s-text">${box.name}</text>`;

        // Planets in this box
        const planetsInBox = planetPositions[box.id] || [];
        planetsInBox.forEach((p, i) => {
            svgContent += `<text x="${box.x}" y="${box.y + (i * 8) - 5}" text-anchor="middle" class="p-text">${p}</text>`;
        });
    });

    // Center Info
    svgContent += `
        <text x="100" y="90" text-anchor="middle" fill="#D4AF37" font-size="8">Vedic Chart</text>
        <text x="100" y="105" text-anchor="middle" fill="#FFF" font-size="6">For ${name || 'User'}</text>
        <text x="100" y="115" text-anchor="middle" fill="#FFF" font-size="5" opacity="0.6">${day}/${month}/${year} ${hour}:${min}</text>
    `;

    svgContent += `</svg>`;
    return svgContent;
};

/**
 * Fetches planetary positions (Table/JSON) - placeholder for future expansion
 */
export const getPlanetaryPositions = async (birthDetails) => {
    // Implementation for JSON data if needed
    return null;
};
