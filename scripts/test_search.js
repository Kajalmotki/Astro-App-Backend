import { searchKnowledgeBase } from '../services/bookSearchEngine';

console.log("Testing Vedic Search Engine...");

const results = searchKnowledgeBase("Saturn 7th house", "astrology", 3);
console.log(`\n\nFound ${results.length} matches for "Saturn 7th house":`);

results.forEach((res, i) => {
    console.log(`\n[${i + 1}] ${res.bookTitle} by ${res.bookAuthor} (Score: ${res.score})`);
    console.log(`Snippet: ${res.snippet}`);
});

const yogaResults = searchKnowledgeBase("pranayama heart", "yoga", 2);
console.log(`\n\nFound ${yogaResults.length} matches for "pranayama heart":`);

yogaResults.forEach((res, i) => {
    console.log(`\n[${i + 1}] ${res.bookTitle} by ${res.bookAuthor} (Score: ${res.score})`);
    console.log(`Snippet: ${res.snippet}`);
});
