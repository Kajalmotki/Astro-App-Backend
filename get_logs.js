const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('BROWSER ERROR:', msg.text());
            const location = msg.location();
            console.log('Location:', location.url, 'Line:', location.lineNumber);
        }
    });

    page.on('pageerror', error => {
        console.log('PAGE ERROR STR:', error.toString());
        console.log('PAGE ERROR STACK:', error.stack);
    });

    try {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 10000 });
    } catch (e) {
        console.log('Navigation error:', e.message);
    }

    // Wait a bit to let React render and crash
    await new Promise(r => setTimeout(r, 2000));

    await browser.close();
})();
