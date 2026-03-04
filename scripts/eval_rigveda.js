import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rigvedaPath = path.join(__dirname, '..', 'src', 'data', 'books', 'vedas', 'rigveda.json');

const content = fs.readFileSync(rigvedaPath, 'utf-8');
const rigvedaData = JSON.parse(content);

let knowledgeCount = 0;
rigvedaData.chapters.forEach(c => {
    c.verses.forEach(v => {
        if (v.translation.toLowerCase().includes('knowledge')) {
            knowledgeCount++;
        }
    });
});

console.log('Rigveda matches for "knowledge":', knowledgeCount);
