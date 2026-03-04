import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchAtharvaVeda() {
    console.log('Downloading Atharva Veda text...');

    // This is a direct raw text link from a GitHub repo compiling Vedic texts
    const textUrl = 'https://raw.githubusercontent.com/VedicTexts/AtharvaVeda/master/AtharvaVeda.txt';

    try {
        const response = await axios.get(textUrl, { timeout: 15000 });
        const rawText = response.data;
        const cleanText = rawText.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ');

        const words = cleanText.split(/\s+/);
        const verses = [];
        let currentChunk = [];
        let currentLen = 0;
        let number = 1;

        for (let word of words) {
            if (currentLen + word.length > 800 && currentChunk.length > 0) {
                verses.push({
                    number: number++,
                    translation: currentChunk.join(' '),
                    sanskrit: ""
                });
                currentChunk = [];
                currentLen = 0;
                if (verses.length >= 1000) break;
            }
            currentChunk.push(word);
            currentLen += word.length + 1;
        }

        if (currentChunk.length > 0 && verses.length < 1000) {
            verses.push({
                number: number++,
                translation: currentChunk.join(' '),
                sanskrit: ""
            });
        }

        const outputJson = {
            title: "AtharvaVeda",
            author: "Ancient Sages",
            category: "vedas",
            chapters: [
                {
                    name: "Entire Text",
                    number: 1,
                    verses: verses
                }
            ]
        };

        const outPath = path.join(__dirname, '..', 'src', 'data', 'books', 'vedas', 'atharvaveda.json');
        fs.writeFileSync(outPath, JSON.stringify(outputJson, null, 2));
        console.log(`Successfully wrote ${verses.length} verses to ${outPath}`);

    } catch (error) {
        console.error('Failed using GitHub raw text. Let us try a fallback...', error.message);

        // Fallback: Just insert a placeholder so Veda AI doesn't break, until OCR can be done
        const outputJson = {
            title: "AtharvaVeda",
            author: "Ancient Sages",
            category: "vedas",
            chapters: [
                {
                    name: "Entire Text",
                    number: 1,
                    verses: [
                        { number: 1, translation: "The Atharva Veda is the fourth Veda, dealing with everyday life, healing, spells, and practical knowledge.", sanskrit: "" },
                        { number: 2, translation: "It contains knowledge of medicine, rituals for peace and prosperity, and philosophical hymns.", sanskrit: "" },
                        { number: 3, translation: "Atharva Veda is known as the Veda of magical formulas and everyday procedures of life.", sanskrit: "" },
                        { number: 4, translation: "It consists of 20 kandas (books) and over 6000 suktas (hymns).", sanskrit: "" },
                        { number: 5, translation: "It provides insight into the daily lives, beliefs, and practices of the ancient Vedic people.", sanskrit: "" },
                        { number: 6, translation: "Key themes include healing diseases, ensuring long life, and protecting against enemies.", sanskrit: "" }
                    ]
                }
            ]
        };
        const outPath = path.join(__dirname, '..', 'src', 'data', 'books', 'vedas', 'atharvaveda.json');
        fs.writeFileSync(outPath, JSON.stringify(outputJson, null, 2));
        console.log(`Wrote fallback Atharvaveda summary data to ${outPath}`);
    }
}

fetchAtharvaVeda();
