import { Origin, Horoscope } from 'circular-natal-horoscope-js/dist/index.js';

const TITHI_NAMES = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

const YOGA_NAMES = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
    "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
    "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
    "Indra", "Vaidhriti"
];

const KARAN_NAMES = [
    "Bava", "Balava", "Kaulava", "Taitila",
    "Gara", "Vanija", "Vishti"
];

const FIXED_KARANS = {
    0: "Kintughna",  // 1st half of Shukla Pratipada
    57: "Shakuni",   // 2nd half of Krishna Chaturdashi
    58: "Chatushpada",// 1st half of Amavasya
    59: "Naga"       // 2nd half of Amavasya
};

const VAR_NAMES = [
    { name: "Ravivar", english: "Sunday", lord: "Sun Lord", icon: "☀️", color: "#FFD700" },
    { name: "Somvar", english: "Monday", lord: "Moon Lord", icon: "🌙", color: "#C0C0C0" },
    { name: "Mangalvar", english: "Tuesday", lord: "Mars Lord", icon: "♂️", color: "#FF6347" },
    { name: "Budhvar", english: "Wednesday", lord: "Mercury Lord", icon: "☿️", color: "#32CD32" },
    { name: "Guruvar", english: "Thursday", lord: "Jupiter Lord", icon: "♃", color: "#DAA520" },
    { name: "Shukravar", english: "Friday", lord: "Venus Lord", icon: "♀️", color: "#FF69B4" },
    { name: "Shanivar", english: "Saturday", lord: "Saturn Lord", icon: "♄", color: "#4682B4" }
];

const MASA_NAMES = [
    "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
    "Ashvin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"
];

const YOGA_MEANINGS = {
    "Vishkumbha": "Door bolt / Obstacle", "Priti": "Love / Affection", "Ayushman": "Long-lived",
    "Saubhagya": "Good Fortune", "Shobhana": "Splendor", "Atiganda": "Great Danger",
    "Sukarma": "Good Deeds", "Dhriti": "Steadfastness", "Shula": "Spear / Pain",
    "Ganda": "Danger", "Vriddhi": "Growth", "Dhruva": "Constant",
    "Vyaghata": "Beating / Fierce", "Harshana": "Joy", "Vajra": "Diamond / Strong",
    "Siddhi": "Success", "Vyatipata": "Calamity", "Variyan": "Comfort",
    "Parigha": "Obstruction", "Shiva": "Auspicious", "Siddha": "Accomplished",
    "Sadhya": "Amenable", "Shubha": "Auspicious", "Shukla": "Bright / Pure",
    "Brahma": "Creator / Truth", "Indra": "Chief", "Vaidhriti": "Poor Support"
};

const KARAN_MEANINGS = {
    "Bava": "Sweet / Auspicious", "Balava": "Strong", "Kaulava": "Noble",
    "Taitila": "Luminous", "Gara": "Poisonous / Difficult", "Vanija": "Merchant / Trade",
    "Vishti": "Bhadra / Inauspicious", "Kintughna": "Unpredictable / Mixed",
    "Shakuni": "Bird / Omen", "Chatushpada": "Four-footed", "Naga": "Serpent / Warning"
};


export const getLahiriAyanamsha = (date) => {
    const tJ2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
    const daysSinceJ2000 = (date.getTime() - tJ2000) / (1000 * 60 * 60 * 24);
    return 23.8564 + (daysSinceJ2000 * 0.000038246);
};

export const getLivePanchangData = (date = new Date(), lat = 23.0225, lng = 72.5714) => {
    try {
        const origin = new Origin({
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
            date: date.getUTCDate(),
            hour: date.getUTCHours(),
            minute: date.getUTCMinutes(),
            latitude: lat,
            longitude: lng,
            timeZone: 0
        });

        const horoscope = new Horoscope({
            origin,
            houseSystem: "placidus",
            zodiac: "tropical",
            aspectPoints: ["bodies"],
            aspectWithPoints: ["bodies"],
            aspectTypes: ["major"],
            customOrbs: {},
            language: "en"
        });

        const ayanamsha = getLahiriAyanamsha(date);

        let moonLong = horoscope.CelestialBodies.moon.ChartPosition.Ecliptic.DecimalDegrees - ayanamsha;
        if (moonLong < 0) moonLong += 360;

        let sunLong = horoscope.CelestialBodies.sun.ChartPosition.Ecliptic.DecimalDegrees - ayanamsha;
        if (sunLong < 0) sunLong += 360;

        // Tithi Calculation (0-29 index)
        let tithiVal = Math.floor((moonLong - sunLong) / 12);
        if (tithiVal < 0) tithiVal = Math.floor((moonLong - sunLong + 360) / 12);

        const paksha = tithiVal < 15 ? "Shukla Paksha" : "Krishna Paksha";
        const tithiNum = (tithiVal % 15) + 1;
        const tithiName = TITHI_NAMES[tithiVal];

        // Yoga Calculation (0-26 index)
        let yogaVal = Math.floor((moonLong + sunLong) / 13.333333);
        if (yogaVal >= 27) yogaVal %= 27;
        const yogaName = YOGA_NAMES[yogaVal];
        const yogaMeaning = YOGA_MEANINGS[yogaName];

        // Karan Calculation (0-59 index)
        let karanVal = Math.floor((moonLong - sunLong) / 6);
        if (karanVal < 0) karanVal = Math.floor((moonLong - sunLong + 360) / 6);

        let karanName = "";
        if (FIXED_KARANS[karanVal]) {
            karanName = FIXED_KARANS[karanVal];
        } else {
            // Movable Karans: index 1 to 56 repeats 7 karans (indices 0 to 6)
            karanName = KARAN_NAMES[(karanVal - 1) % 7];
        }
        const karanMeaning = KARAN_MEANINGS[karanName];

        // Var Calculation
        const varIndex = date.getDay();
        const varData = VAR_NAMES[varIndex];

        // Masa Calculation (Simplified via Sun's Sidereal Position)
        // 0-30 Aries -> Vaishakha (Index 1)
        // 330-360 Pisces -> Chaitra (Index 0)
        const sunSignIndex = Math.floor(sunLong / 30);
        const masaIndex = (sunSignIndex + 1) % 12;
        const masaName = MASA_NAMES[masaIndex];
        const masaNum = masaIndex + 1;

        // Moon Phase (0-100% illuminated)
        // Elongation: Moon - Sun. 
        // 0 = New Moon (0%), 180 = Full Moon (100%), 360 = New Moon (0%)
        let elongation = moonLong - sunLong;
        if (elongation < 0) elongation += 360;

        let illumination = 0;
        if (elongation <= 180) {
            illumination = (elongation / 180) * 100;
        } else {
            illumination = ((360 - elongation) / 180) * 100;
        }

        const moonSignNames = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const moonSign = moonSignNames[Math.floor(moonLong / 30)];

        return {
            tithi: { name: tithiName, num: tithiNum, paksha },
            yoga: { name: yogaName, meaning: yogaMeaning },
            karan: { name: karanName, meaning: karanMeaning },
            var: varData,
            masa: { name: masaName, num: masaNum },
            moonPhase: { illumination: Math.round(illumination), sign: moonSign, phaseName: paksha }
        };

    } catch (error) {
        console.error("Error calculating live Panchang:", error);
        return null;
    }
};

const formatAmPm = (dateObj) => {
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
};

export const getLiveTimings = (date = new Date()) => {
    // simplified: assume 6:00am sunrise, 6:00pm sunset locally for offset logic for now
    // True panchang timings depend on local sunrise/sunset which requires complex calculations.
    // We will simulate them based on a 6:00 to 18:00 fixed window for smooth UI demo that is ~accurate.

    // Day length ~ 12 hours (720 min). 1/8th of day = 90 mins (1.5h)

    // Abhijit is 8th Muhurat out of 15 (middle of the day, roughly 11:36 - 12:24)
    const noon = new Date(date);
    noon.setHours(12, 0, 0, 0);
    const abhijitStart = new Date(noon.getTime() - 24 * 60000);
    const abhijitEnd = new Date(noon.getTime() + 24 * 60000);

    // Brahma Muhurat: exactly 1.5 hours before sunrise. Assume sunrise 6:00am.
    const brahmaStart = new Date(date);
    brahmaStart.setHours(4, 30, 0, 0);
    const brahmaEnd = new Date(date);
    brahmaEnd.setHours(5, 18, 0, 0);

    // Rahukaal varies day by day
    // Sun=16:30, Mon=7:30, Tue=15:00, Wed=12:00, Thu=13:30, Fri=10:30, Sat=9:00 (Starts, 1.5h duration)
    const rahuStarts = [16.5, 7.5, 15, 12, 13.5, 10.5, 9];
    const rahuStartHour = Math.floor(rahuStarts[date.getDay()]);
    const rahuStartMin = (rahuStarts[date.getDay()] % 1) * 60;

    const rahuStart = new Date(date);
    rahuStart.setHours(rahuStartHour, rahuStartMin, 0, 0);
    const rahuEnd = new Date(rahuStart.getTime() + 90 * 60000);

    // Yamaganda: Sun=12:00, Mon=10:30, Tue=9:00, Wed=7:30, Thu=6:00, Fri=15:00, Sat=13:30
    const yamaStarts = [12, 10.5, 9, 7.5, 6, 15, 13.5];
    const yamaStartHour = Math.floor(yamaStarts[date.getDay()]);
    const yamaStartMin = (yamaStarts[date.getDay()] % 1) * 60;

    const yamaStart = new Date(date);
    yamaStart.setHours(yamaStartHour, yamaStartMin, 0, 0);
    const yamaEnd = new Date(yamaStart.getTime() + 90 * 60000);

    return {
        abhijit: `${formatAmPm(abhijitStart)} – ${formatAmPm(abhijitEnd)}`,
        brahma: `${formatAmPm(brahmaStart)} – ${formatAmPm(brahmaEnd)}`,
        rahukaal: `${formatAmPm(rahuStart)} – ${formatAmPm(rahuEnd)}`,
        yamaganda: `${formatAmPm(yamaStart)} – ${formatAmPm(yamaEnd)}`,
    };
};
