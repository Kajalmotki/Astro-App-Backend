const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

// Config
// Config
const BASE_URL = 'http://127.0.0.1:5173';
const AUDIO_PATH = 'C:\\Users\\Siddharth\\Downloads\\SKORN_Ultra_Slowed.mp3';
const OUTPUT_FILE = 'marketing_video.mp4';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

// Timestamps for transitions (Estimated for "Ultra Slowed" bass/kick patterns ~60BPM / 2s per bar)
// Adjust these to match the exact bass drops!
const TIMESTAMPS = [
    0,    // Start
    2.5,  // Drop 1
    5.0,  // Drop 2
    7.5,  // Drop 3
    10.0, // Drop 4
    12.5, // Drop 5
    15.0, // Drop 6
    17.5, // Drop 7
    20.0, // Drop 8
    22.5, // ...
    25.0,
    27.5,
    30.0,
    32.5,
    35.0,
    37.5,
    40.0
];

const PAGES = [
    { url: '/mobile/home', name: '01_home' },
    { url: '/mobile/horoscope', name: '02_horoscope' },
    // {
    //     url: '/mobile/tarot-reveal', name: '03_tarot_reveal', setup: async (page) => {
    //         // Navigate to home, scroll to tarot, click card
    //         await page.goto(`${BASE_URL}/mobile/home`);
    //         await page.waitForSelector('.tarot-card-wrapper');
    //         await page.click('.tarot-card-wrapper'); // Click first card
    //         await new Promise(r => setTimeout(r, 2000)); // Wait for transition
    //     }
    // },
    { url: '/mobile/major-arcana', name: '04_major_arcana' },
    { url: '/mobile/chat', name: '05_chat' },
    { url: '/mobile/reports', name: '06_reports' },
    { url: '/mobile/profile', name: '07_profile' },
    { url: '/mobile/order-history', name: '09_order_history' },
    { url: '/mobile/chat-history', name: '10_chat_history' },
    { url: '/mobile/settings/language', name: '11_language' },
    { url: '/mobile/help-support', name: '12_help_support' },
    { url: '/mobile/settings/privacy', name: '13_privacy' },
    { url: '/mobile/compatibility', name: '08_compatibility' } // Fallback if exists? Or repeat home/hero
];

// Ensure dir exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR);
}

async function captureScreenshots() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: { width: 412, height: 915, isMobile: true }
    });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

    console.log('Capturing screenshots...');

    // We will cycle through PAGES to fill the video length manually or loop them
    // Let's create specific images for each timestamp interval + overlap

    // Actually, let's just capture the 8 unique screens first
    for (const p of PAGES) {
        console.log(`Processing ${p.name}...`);
        try {
            if (p.setup) {
                await p.setup(page);
            } else {
                await page.goto(`${BASE_URL}${p.url}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
            }
            // Wait a bit for animations (e.g. stars, fan) to settle or play a bit
            await new Promise(r => setTimeout(r, 4000));

            await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${p.name}.png`) });
            console.log(`Saved ${p.name}.png`);
        } catch (e) {
            console.error(`Error capturing ${p.name}:`, e.message);
        }
    }

    await browser.close();
    console.log('Screenshots captured.');
}

async function createVideo() {
    console.log('Generating video...');

    // We need to create a complex filter graph to sequence images at specific times
    // Or, simpler: create an image slideshow with specified durations.
    // Since we want "bass match", durations are variable.

    // Let's create a temporary input file for the concat demuxer
    const fileListPath = path.join(__dirname, 'images.txt');
    let fileContent = '';

    // Strategy: Loop through screenshots and assign them to timestamp intervals
    // const images = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png')).map(f => path.join(SCREENSHOT_DIR, f));
    // Hardcoded order for flow
    const imageOrder = [
        '01_home.png', /* '03_tarot_reveal.png', */ '02_horoscope.png', '04_major_arcana.png',
        '05_chat.png', '06_reports.png', '07_profile.png', '01_home.png'
    ];

    let imageIndex = 0;

    for (let i = 0; i < TIMESTAMPS.length - 1; i++) {
        const start = TIMESTAMPS[i];
        const end = TIMESTAMPS[i + 1];
        const duration = end - start;
        const imgName = imageOrder[imageIndex % imageOrder.length];
        const imgPath = path.join(SCREENSHOT_DIR, imgName).replace(/\\/g, '/');

        fileContent += `file '${imgPath}'\n`;
        fileContent += `duration ${duration}\n`;

        imageIndex++;
    }
    // Add last image padding
    const lastImg = imageOrder[imageIndex % imageOrder.length];
    fileContent += `file '${path.join(SCREENSHOT_DIR, lastImg).replace(/\\/g, '/')}'\n`;
    fileContent += `duration 5\n`; // End padding

    fs.writeFileSync(fileListPath, fileContent);

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(fileListPath)
            .inputOptions(['-f concat', '-safe 0'])
            .input(AUDIO_PATH)
            // Add Shake Effect (Vibration)
            // 'geq' filter or 'crop/scale'
            // We'll use a subtle zoom/shake: zoom in 1.0 to 1.05 quickly then crop
            .complexFilter([
                // Simple shake: x=random(5), y=random(5) is too chaotic/continuous.
                // We want "on beat" shake. Complex to do fully in ffmpeg without strict keyframing.
                // Fallback: Constant "Handheld" shake or "Heartbeat" zoom?
                // Visual "vibration": rapid x/y offset changes.
                // `crop=w=iw-10:h=ih-10:x='(iw-ow)/2+((random(1)-0.5)*10)':y='(ih-oh)/2+((random(1)-0.5)*10)'`
                `crop=w=iw-20:h=ih-20:x='(iw-ow)/2+((random(1)-0.5)*20)':y='(ih-oh)/2+((random(1)-0.5)*20)'`
            ])
            .outputOptions([
                '-c:v libx264',
                '-pix_fmt yuv420p',
                '-shortest', // Stop when audio ends (or images end)
                '-map 0:v',
                '-map 1:a'
            ])
            .on('start', (cmd) => console.log('FFmpeg command:', cmd))
            .on('stderr', (stderrLine) => console.log('Stderr output: ' + stderrLine))
            .on('end', () => {
                console.log('Video created successfully: ' + OUTPUT_FILE);
                resolve();
            })
            .on('error', (err) => {
                console.error('Error creating video:', err);
                reject(err);
            })
            .save(OUTPUT_FILE);
    });
}

(async () => {
    try {
        await captureScreenshots();
        await createVideo();
    } catch (e) {
        console.error(e);
    }
})();
