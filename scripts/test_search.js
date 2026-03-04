import { searchKnowledgeBase } from '../src/services/bookSearchEngine.js';

async function test() {
    console.log("Searching for 'knowledge' in 'vedas'...");
    try {
        const results = await searchKnowledgeBase('knowledge', 'vedas');
        console.log(`Found ${results.length} results.`);

        let rigvedaCount = 0;
        let samavedaCount = 0;
        let yajurvedaCount = 0;
        let atharvavedaCount = 0;

        results.forEach(r => {
            if (r.bookTitle.toLowerCase().includes('rigveda')) rigvedaCount++;
            if (r.bookTitle.toLowerCase().includes('samaveda')) samavedaCount++;
            if (r.bookTitle.toLowerCase().includes('yajurveda')) yajurvedaCount++;
            if (r.bookTitle.toLowerCase().includes('atharvaveda')) atharvavedaCount++;
        });

        console.log(`Rigveda: ${rigvedaCount}`);
        console.log(`Samaveda: ${samavedaCount}`);
        console.log(`Yajurveda: ${yajurvedaCount}`);
        console.log(`Atharvaveda: ${atharvavedaCount}`);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
