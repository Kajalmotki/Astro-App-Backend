const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://192.168.31.224:5173'; // Force explicitly bound IP due to ERR_CONNECTION_REFUSED
const OUTPUT_DIR = path.join(__dirname, 'app-screenshots');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

const routes = [
    // Mobile Core Only
    { name: '05_Mobile_Home', url: '/mobile/home', isMobile: true },
    { name: '06_Mobile_Chat', url: '/mobile/chat', isMobile: true },
    { name: '07_Mobile_Reports', url: '/mobile/reports', isMobile: true },
    { name: '08_Mobile_Profile', url: '/mobile/profile', isMobile: true },

    // Astrology Reports
    { name: '09_Full_Kundli', url: '/mobile/full-kundli', isMobile: true },
    { name: '10_Matchmaking', url: '/mobile/matchmaking', isMobile: true },
    { name: '11_BCA_Analysis', url: '/mobile/bca', isMobile: true },
    { name: '12_Astro_Chart', url: '/mobile/astro-chart', isMobile: true },
    { name: '13_Panchang', url: '/mobile/panchang', isMobile: true },
    { name: '14_Virtual_Pooja', url: '/mobile/virtual-pooja', isMobile: true },
    { name: '15_Horoscope', url: '/mobile/horoscope', isMobile: true },
    { name: '16_Gemstones', url: '/mobile/gemstones', isMobile: true },
    { name: '17_Karmic_Reading', url: '/mobile/karmic-reading', isMobile: true },
    { name: '18_Numerology', url: '/mobile/numerology', isMobile: true },
    { name: '19_Western_Chart', url: '/mobile/western-chart', isMobile: true },
    { name: '20_Tarot_Reveal', url: '/mobile/tarot-reveal', isMobile: true },
    { name: '21_Major_Arcana', url: '/mobile/major-arcana', isMobile: true },

    // Trackers
    { name: '22_Planetary_Strength', url: '/mobile/planetary-strengthening', isMobile: true },
    { name: '23_Saturn_Tracker', url: '/mobile/saturn-tracker', isMobile: true },
    { name: '24_Sun_Tracker', url: '/mobile/tracker/sun', isMobile: true },
    { name: '25_Moon_Tracker', url: '/mobile/tracker/moon', isMobile: true },
    { name: '26_Mars_Tracker', url: '/mobile/tracker/mars', isMobile: true },
    { name: '27_Mercury_Tracker', url: '/mobile/tracker/mercury', isMobile: true },
    { name: '28_Jupiter_Tracker', url: '/mobile/tracker/jupiter', isMobile: true },
    { name: '29_Venus_Tracker', url: '/mobile/tracker/venus', isMobile: true },
    { name: '30_Rahu_Tracker', url: '/mobile/tracker/rahu', isMobile: true },
    { name: '31_Ketu_Tracker', url: '/mobile/tracker/ketu', isMobile: true },

    // Profile Sub-pages
    { name: '32_Order_History', url: '/mobile/order-history', isMobile: true },
    { name: '33_Chat_History', url: '/mobile/chat-history', isMobile: true },
    { name: '34_Language_Settings', url: '/mobile/settings/language', isMobile: true },
    { name: '35_Privacy_Security', url: '/mobile/settings/privacy', isMobile: true },
    { name: '36_Help_Support', url: '/mobile/help-support', isMobile: true },
    { name: '37_Ambience', url: '/mobile/ambience', isMobile: true },
    { name: '38_About_Us', url: '/mobile/about', isMobile: true },
    { name: '39_Case_Studies', url: '/mobile/case-studies', isMobile: true },
    { name: '40_Blogs', url: '/mobile/blogs', isMobile: true },
];

async function captureScreenshots() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    console.log(`Starting capture of ${routes.length} screens to ${OUTPUT_DIR}...`);

    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const targetUrl = `${BASE_URL}${route.url}`;
        const outputPath = path.join(OUTPUT_DIR, `${route.name}.png`);

        try {
            if (route.isMobile) {
                await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
                // Set mobile user agent to bypass any redirect logic
                await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1');
            } else {
                await page.setViewport({ width: 1440, height: 900 });
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36');
            }

            console.log(`[${i + 1}/${routes.length}] Capturing ${route.name} at ${targetUrl}...`);

            // Navigate and wait for network to be idle
            await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

            // Wait extra time for the Splash Screen animation to finish
            await new Promise(r => setTimeout(r, 5000));

            await page.screenshot({ path: outputPath, fullPage: true });
            console.log(`  -> Saved to ${outputPath}`);

        } catch (err) {
            console.error(`  -> ERROR capturing ${route.name}: ${err.message}`);
        }
    }

    await browser.close();
    console.log('\n✅ All screenshots complete!');
    console.log(`Check the folder: ${OUTPUT_DIR}`);
}

captureScreenshots();
