import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rigvedaPath = path.join(__dirname, '..', 'src', 'data', 'books', 'vedas', 'rigveda.json');

let rigvedaData;
try {
    const content = fs.readFileSync(rigvedaPath, 'utf-8');
    rigvedaData = JSON.parse(content);
} catch (err) {
    console.error("Error reading rigveda file:", err);
    process.exit(1);
}

const boilerplateRegEx = /RIG VEDA - THE (FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH) BOOK This free e-book has been download from www.holybooks.com: http:\/\/www.holybooks.com\/rig-veda\/ Find more similar books on www.holybooks.com /g;

let modifiedCount = 0;

rigvedaData.chapters.forEach(chapter => {
    chapter.verses.forEach(verse => {
        if (boilerplateRegEx.test(verse.translation)) {
            verse.translation = verse.translation.replace(boilerplateRegEx, '');
            modifiedCount++;
        }
    });
});

console.log(`Removed boilerplate from ${modifiedCount} verses.`);

try {
    fs.writeFileSync(rigvedaPath, JSON.stringify(rigvedaData, null, 2));
    console.log("Successfully updated rigveda.json");
} catch (err) {
    console.error("Error writing updated rigveda.json:", err);
}
