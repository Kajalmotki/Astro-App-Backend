/**
 * matchmakingUtils.js
 * Vedic Astrology Matchmaking (Ashtakoot Guna Milan)
 */

// --- Constants ---

const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
    "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const RASHIS = [
    "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
];

const RASHI_LORDS = {
    "Mesha": "Mars", "Vrishabha": "Venus", "Mithuna": "Mercury", "Karka": "Moon",
    "Simha": "Sun", "Kanya": "Mercury", "Tula": "Venus", "Vrishchika": "Mars",
    "Dhanu": "Jupiter", "Makara": "Saturn", "Kumbha": "Saturn", "Meena": "Jupiter"
};

// Varna (1 Point) - Order matters ( Brahmin > Kshatriya > Vaishya > Shudra)
const VARNA_ORDER = {
    "Brahmin": 4, "Kshatriya": 3, "Vaishya": 2, "Shudra": 1
};

// Vashya (2 Points) - Defined groups
const VASHYA_GROUPS = {
    "Chatushpada": ["Mesha", "Vrishabha", "Dhanu (Part 2)", "Makara (Part 1)"],
    "Manav": ["Mithuna", "Kanya", "Tula", "Dhanu (Part 1)", "Kumbha"],
    "Jalchar": ["Karka", "Meena", "Makara (Part 2)"],
    "Vanchar": ["Simha"],
    "Keeta": ["Vrishchika"]
};

// Yoni (4 Points) - Animal types
const YONI_PAIRS = {
    // Simplified Matrix (Self is 4, Enemy is 0/1/2, Friend is 3/4)
    // Detailed matrix implementation required for full accuracy
};

// Gana (6 Points) - Deva, Manushya, Rakshasa
const GANA_TYPE = {
    "Deva": ["Ashwini", "Mrigashira", "Punarvasu", "Pushya", "Hasta", "Swati", "Anuradha", "Shravana", "Revati"],
    "Manushya": ["Bharani", "Rohini", "Ardra", "Purva Phalguni", "Uttara Phalguni", "Purva Ashadha", "Uttara Ashadha", "Purva Bhadrapada", "Uttara Bhadrapada"],
    "Rakshasa": ["Krittika", "Ashlesha", "Magha", "Chitra", "Vishakha", "Jyeshtha", "Mula", "Dhanishta", "Shatabhisha"]
};

// Nadi (8 Points) - Vata, Pitta, Kapha (Adi, Madhya, Antya)
const NADI_TYPE = {
    "Adi": ["Ashwini", "Ardra", "Punarvasu", "Uttara Phalguni", "Hasta", "Jyeshtha", "Mula", "Shatabhisha", "Purva Bhadrapada"],
    "Madhya": ["Bharani", "Mrigashira", "Pushya", "Purva Phalguni", "Chitra", "Anuradha", "Purva Ashadha", "Dhanishta", "Uttara Bhadrapada"],
    "Antya": ["Krittika", "Rohini", "Ashlesha", "Magha", "Swati", "Vishakha", "Uttara Ashadha", "Shravana", "Revati"]
};

// --- Helper Functions ---

const getNakshatraFromMoonLong = (lon) => {
    // 360 degrees / 27 nakshatras = 13.333 deg per nakshatra
    const index = Math.floor(lon / 13.333333);
    return NAKSHATRAS[index];
};

const getRashiFromMoonLong = (lon) => {
    // 360 degrees / 12 rashis = 30 deg per rashi
    const index = Math.floor(lon / 30);
    return RASHIS[index];
};

// --- Main Calculation ---

export const calculateAshtakoot = (boyData, girlData) => {
    // Mock Calculation Logic for Demo (until backend integration)
    // In a real app, we need the exact moon longitude to determine Nakshatra/Rashi.
    // For now, we will hash the names/dates to pick a Nakshatra deterministically.

    const getHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const boyNakIndex = getHash(boyData.name + boyData.dob) % 27;
    const girlNakIndex = getHash(girlData.name + girlData.dob) % 27;

    const boyNak = NAKSHATRAS[boyNakIndex];
    const girlNak = NAKSHATRAS[girlNakIndex];

    const boyRashiIndex = Math.floor(boyNakIndex * 13.333 / 30);
    const girlRashiIndex = Math.floor(girlNakIndex * 13.333 / 30);

    // Scores
    let scores = {
        varna: 1, // Defaulting for demo
        vashya: 2,
        tara: 1.5, // Calc differences
        yoni: 2, // Animal match
        grahaMaitri: 3, // Planetary Friendships
        gana: 6, // If same group
        bhakoot: 7, // If 1/7, 3/11, 4/10 relationships
        nadi: 8 // If different Nadis
    };

    // Refine Logic based on data (Simulated accuracy)

    // Gana Check
    const getGana = (nak) => {
        if (GANA_TYPE.Deva.includes(nak)) return 'Deva';
        if (GANA_TYPE.Manushya.includes(nak)) return 'Manushya';
        return 'Rakshasa';
    };
    const boyGana = getGana(boyNak);
    const girlGana = getGana(girlNak);
    if (boyGana === girlGana) scores.gana = 6;
    else if ((boyGana === 'Deva' && girlGana === 'Manushya') || (girlGana === 'Deva' && boyGana === 'Manushya')) scores.gana = 5;
    else if (boyGana === 'Rakshasa' && girlGana === 'Rakshasa') scores.gana = 0; // Simplified
    else scores.gana = 1; // Mismatch

    // Nadi Check (Crucial)
    const getNadi = (nak) => {
        if (NADI_TYPE.Adi.includes(nak)) return 'Adi';
        if (NADI_TYPE.Madhya.includes(nak)) return 'Madhya';
        return 'Antya';
    };
    const boyNadi = getNadi(boyNak);
    const girlNadi = getNadi(girlNak);
    if (boyNadi === girlNadi) scores.nadi = 0; // Nadi Dosha!
    else scores.nadi = 8;

    // Bhakoot (Moon Sign Relationship)
    const diff = Math.abs(boyRashiIndex - girlRashiIndex);
    if ([2, 6, 8, 12].includes(diff)) scores.bhakoot = 0; // Bhakoot Dosha
    else scores.bhakoot = 7;

    return [
        { name: "Varna", sanskrit: "वर्ण", maxPoints: 1, obtained: scores.varna, description: "Spiritual compatibility", detail: "Acceptable match." },
        { name: "Vashya", sanskrit: "वश्य", maxPoints: 2, obtained: scores.vashya, description: "Mutual attraction", detail: "Good attraction indicated." },
        { name: "Tara", sanskrit: "तारा", maxPoints: 3, obtained: scores.tara, description: "Destiny", detail: "Average destiny match." },
        { name: "Yoni", sanskrit: "योनि", maxPoints: 4, obtained: scores.yoni, description: "Intimacy", detail: "Compatible nature." },
        { name: "Graha Maitri", sanskrit: "ग्रह मैत्री", maxPoints: 5, obtained: scores.grahaMaitri, description: "Friendship", detail: "Friendly temperaments." },
        { name: "Gana", sanskrit: "गण", maxPoints: 6, obtained: scores.gana, description: "Temperament", detail: `${boyGana} - ${girlGana} match.` },
        { name: "Bhakoot", sanskrit: "भकूट", maxPoints: 7, obtained: scores.bhakoot, description: "Emotional flow", detail: scores.bhakoot === 0 ? "Bhakoot Dosha present." : "Good emotional flow." },
        { name: "Nadi", sanskrit: "नाडी", maxPoints: 8, obtained: scores.nadi, description: "Genetics/Health", detail: scores.nadi === 0 ? "Nadi Dosha detected (Same Nadi)." : "Different Nadis (Healthy)." }
    ];
};
