// Server-side loader for astrology and yoga books
// Uses filesystem so it works across Node versions without import assertions.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadJsonRelative = (relativePath) => {
  const fullPath = path.resolve(__dirname, '..', relativePath);
  const raw = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(raw);
};

const atharvaVeda = loadJsonRelative('src/data/books/astrology/atharva_veda.json');
const vedangaJyotisha = loadJsonRelative('src/data/books/astrology/vedanga_jyotisha.json');
const saravali = loadJsonRelative('src/data/books/astrology/saravali.json');

const satChakraNirupana = loadJsonRelative('src/data/books/yoga/sat_chakra_nirupana.json');
const sivaSamhita = loadJsonRelative('src/data/books/yoga/siva_samhita.json');
const asanaPranayamaMudraBandha = loadJsonRelative(
  'src/data/books/yoga/asana_pranayama_mudra_bandha.json',
);

export const KNOWLEDGE_BASE = {
  astrology: [atharvaVeda, vedangaJyotisha, saravali],
  yoga: [satChakraNirupana, sivaSamhita, asanaPranayamaMudraBandha],
};

export const searchKnowledgeBaseServer = (query, category = 'all', limit = 10) => {
  if (!query || !query.trim()) return [];

  const searchTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter((term) => term.length > 2);

  if (searchTerms.length === 0) return [];

  let booksToSearch = [];
  if (category === 'all' || category === 'astrology') booksToSearch.push(...KNOWLEDGE_BASE.astrology);
  if (category === 'all' || category === 'yoga') booksToSearch.push(...KNOWLEDGE_BASE.yoga);

  const results = [];

  booksToSearch.forEach((book) => {
    if (!book || !book.chapters) return;

    book.chapters.forEach((chapter) => {
      chapter.verses.forEach((verse) => {
        const text = `${verse.translation || ''} ${verse.sanskrit || ''}`;
        const textLower = text.toLowerCase();

        let score = 0;
        let exactMatches = 0;

        if (textLower.includes(query.toLowerCase())) {
          score += 50;
        }

        searchTerms.forEach((term) => {
          const regex = new RegExp(`\\b${term}\\b`, 'g');
          const matches = (textLower.match(regex) || []).length;
          if (matches > 0) {
            exactMatches += 1;
            score += matches * 2;
          }
        });

        if (score > 0) {
          const firstTermIndex = textLower.indexOf(searchTerms[0]);
          const startIdx = Math.max(0, firstTermIndex - 100);
          const endIdx = Math.min(text.length, firstTermIndex + 300);

          let snippet = text.substring(startIdx, endIdx);
          if (startIdx > 0) snippet = `...${snippet}`;
          if (endIdx < text.length) snippet = `${snippet}...`;

          results.push({
            bookTitle: book.title || 'Unknown Text',
            bookAuthor: book.author || 'Unknown Author',
            category: book.category || category,
            sectionTitle: chapter.name || `Section ${chapter.number}`,
            verseNumber: verse.number,
            score: score + exactMatches * 10,
            snippet: snippet.trim(),
            fullText: text.trim(),
          });
        }
      });
    });
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
};

