import knowledgeSources from '../data/books/astrology/brihat_parashara_hora_shastra.json' // Temporary mock to ensure build works

/**
 * AstroRevo Universal Knowledge Search Engine
 * Dynamically loads and searches all Vedic Astrology and Yoga JSON files.
 */

// Load all parsed book JSONs dynamically
const astrologyModules = import.meta.glob('../data/books/astrology/*.json', { eager: true });
const yogaModules = import.meta.glob('../data/books/yoga/*.json', { eager: true });
const vedasModules = import.meta.glob('../data/books/vedas/*.json', { eager: true });

export const KNOWLEDGE_BASE = {
    astrology: Object.values(astrologyModules).map(mod => mod.default || mod),
    yoga: Object.values(yogaModules).map(mod => mod.default || mod),
    vedas: Object.values(vedasModules).map(mod => mod.default || mod)
};

/**
 * Searches the entire Vedic knowledge base for specific keywords.
 * @param {string} query - The search query (e.g., "Saturn in 7th house", "Muladhara asana")
 * @param {string} category - "astrology" | "yoga" | "all"
 * @param {number} limit - Max number of results to return
 * @returns {Array} List of matching verses/chunks with metadata
 */
export const searchKnowledgeBase = (query, category = 'all', limit = 10) => {
    if (!query || query.trim() === '') return [];

    // Normalize query
    const searchTerms = query.toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(' ')
        .filter(term => term.length > 2); // ignore small words like "in", "to"

    if (searchTerms.length === 0) return [];

    let booksToSearch = [];
    if (category === 'all' || category === 'astrology') booksToSearch.push(...KNOWLEDGE_BASE.astrology);
    if (category === 'all' || category === 'yoga') booksToSearch.push(...KNOWLEDGE_BASE.yoga);
    if (category === 'all' || category === 'vedas') booksToSearch.push(...KNOWLEDGE_BASE.vedas);

    let results = [];

    // Brute force keyword matching across all extracted chunks
    booksToSearch.forEach(book => {
        if (!book || !book.chapters) return;

        book.chapters.forEach(chapter => {
            chapter.verses.forEach(verse => {
                const text = (verse.translation || '') + ' ' + (verse.sanskrit || '');
                const textLower = text.toLowerCase();

                // Calculate match score based on how many terms are found
                let score = 0;
                let exactMatches = 0;

                // Exact phrase match gets highest priority
                if (textLower.includes(query.toLowerCase())) {
                    score += 50;
                }

                searchTerms.forEach(term => {
                    const regex = new RegExp(`\\b${term}\\b`, 'g');
                    const matches = (textLower.match(regex) || []).length;
                    if (matches > 0) {
                        exactMatches++;
                        score += (matches * 2); // +2 for every occurrence 
                    }
                });

                // Only include if at least one meaningful term matched
                if (score > 0) {
                    // Extract a smaller snippet around the first matching term to conserve AI tokens
                    const firstTermIndex = textLower.indexOf(searchTerms[0]);
                    let startIdx = Math.max(0, firstTermIndex - 50);
                    let endIdx = Math.min(text.length, firstTermIndex + 150);

                    let snippet = text.substring(startIdx, endIdx);
                    if (startIdx > 0) snippet = '...' + snippet;
                    if (endIdx < text.length) snippet = snippet + '...';

                    results.push({
                        bookTitle: book.title || 'Unknown Text',
                        bookAuthor: book.author || 'Unknown Author',
                        category: book.category || category,
                        sectionTitle: chapter.name || `Section ${chapter.number}`,
                        verseNumber: verse.number,
                        score: score + (exactMatches * 10), // Boost for matching multiple different terms
                        snippet: snippet.trim(),
                        fullText: text.trim()
                    });
                }
            });
        });
    });

    // Sort by relevance score descending
    results.sort((a, b) => b.score - a.score);

    // Return top N results
    return results.slice(0, limit);
};

export const getAvailableBooks = () => {
    return {
        astrology: KNOWLEDGE_BASE.astrology.map(b => ({ title: b.title, author: b.author })),
        yoga: KNOWLEDGE_BASE.yoga.map(b => ({ title: b.title, author: b.author })),
        vedas: KNOWLEDGE_BASE.vedas.map(b => ({ title: b.title, author: b.author }))
    };
};
