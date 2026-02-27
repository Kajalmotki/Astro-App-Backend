const fs = require('fs');
const path = require('path');

const YOGA_DIR = path.join(__dirname, '..', 'src', 'data', 'books', 'yoga');

const files = fs.readdirSync(YOGA_DIR).filter(f => f.endsWith('.json'));

for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(YOGA_DIR, file), 'utf8'));
    if (!data.chapters) continue;

    for (const chapter of data.chapters) {
        if (!chapter.verses) continue;
        for (const verse of chapter.verses) {
            const rawText = verse.translation || '';
            const strippedText = rawText.replace(/\s+/g, '').toLowerCase();

            // "Prior to everything, asana is spoken of as the first part of hatha yoga"
            // "Having done asana, one attains steadiness of body and mind... lightness"

            if (strippedText.includes("firstpart") && strippedText.includes("lightness")) {
                console.log(`\n=================================================`);
                console.log(`✅ EXACT MATCH FOUND IN: ${data.title}`);
                console.log(`=================================================`);

                const idx = rawText.toLowerCase().indexOf("prior to everything");
                console.log(rawText.substring(Math.max(0, idx - 50), idx + 250));
            }
        }
    }
}
