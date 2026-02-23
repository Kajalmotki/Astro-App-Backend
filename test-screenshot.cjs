const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'app-screenshots');

async function capture() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const outputPath = path.join(OUTPUT_DIR, '01_Landing_Page.png');

    try {
        await page.setViewport({ width: 1440, height: 900 });
        console.log('Navigating...');
        await page.goto('http://192.168.31.224:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
        console.log('Waiting...');
        await new Promise(r => setTimeout(r, 1500));
        console.log('Taking screenshot...');
        await page.screenshot({ path: outputPath, fullPage: true });
        console.log('Screenshot taken!');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await browser.close();
    }
}

capture();
