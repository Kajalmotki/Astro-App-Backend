import { Origin, Horoscope } from 'circular-natal-horoscope-js/dist/index.js';

const calculatePanchang = () => {
    const lat = 23.0225;
    const lng = 72.5714;
    const now = new Date();

    const origin = new Origin({
        year: now.getFullYear(),
        month: now.getMonth(),
        date: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        latitude: lat,
        longitude: lng,
        timeZone: -now.getTimezoneOffset() / 60
    });

    const horoscope = new Horoscope({
        origin,
        houseSystem: "placidus",
        zodiac: "sidereal",
        aspectPoints: ["bodies"],
        aspectWithPoints: ["bodies"],
        aspectTypes: ["major"],
        customOrbs: {},
        language: "en"
    });

    const moonLong = horoscope.CelestialBodies.moon.ChartPosition.Ecliptic.DecimalDegrees;
    const sunLong = horoscope.CelestialBodies.sun.ChartPosition.Ecliptic.DecimalDegrees;

    // Tithi
    let tithiVal = (moonLong - sunLong) / 12;
    if (tithiVal < 0) tithiVal += 30; // 360 / 12 = 30
    const tithiIndex = Math.floor(tithiVal) + 1; // 1 to 30

    // Yoga
    let yogaVal = (moonLong + sunLong) / 13.333333; // 13° 20' = 13.333333
    if (yogaVal >= 27) yogaVal %= 27;
    const yogaIndex = Math.floor(yogaVal) + 1; // 1 to 27

    // Karan
    let karanVal = (moonLong - sunLong) / 6;
    if (karanVal < 0) karanVal += 60; // 360 / 6 = 60
    const karanIndex = Math.floor(karanVal) + 1; // 1 to 60

    console.log("Moon:", moonLong);
    console.log("Sun:", sunLong);
    console.log("Tithi Index (1-30):", tithiIndex);
    console.log("Yoga Index (1-27):", yogaIndex);
    console.log("Karan Index (1-60):", karanIndex);
};

calculatePanchang();
