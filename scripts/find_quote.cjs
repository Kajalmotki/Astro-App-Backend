const fs = require('fs');
const path = require('path');

const BOOKS_DIR = path.join(__dirname, '..', 'src', 'data', 'books');
const QUOTE1 = 'asana';
const QUOTE2 = ['disease', 'steady', 'mind', 'health'];

function searchForQuote() {
    let found = false;
    for (const category of ['astrology', 'yoga']) {
        const dir = path.join(BOOKS_DIR, category);
        if (!fs.existsSync(dir)) continue;

        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

        for (const file of files) {
            const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
            if (!data.chapters) continue;

            for (const chapter of data.chapters) {
                if (!chapter.verses) continue;
                for (const verse of chapter.verses) {
                    const text = (verse.translation || '').toLowerCase();

                    // Allow partial matches because extraction drops some punctuation/spaces
                    if (text.includes(QUOTE1) && QUOTE2.some(kw => text.includes(kw))) {
                        console.log(`\n=================================================`);
                        console.log(`✅ EXACT MATCH FOUND IN BOOK: ${data.title}`);
                        console.log(`   Author: ${data.author}`);
                        console.log(`   Category: ${data.category}`);
                        console.log(`=================================================`);

                        // Show snippet
                        const idx = text.indexOf('steadiness');
                        let snippet = (verse.translation || '').substring(Math.max(0, idx - 200), idx + 300);
                        console.log(`\n...${snippet}...\n`);
                        found = true;
                    }
                }
            }
        }
    }

    if (!found) {
        console.log("Quote not found with exact keywords. Extraction might have altered the words.");
    }
}

searchForQuote();
