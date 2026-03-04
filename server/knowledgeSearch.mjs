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

const safeLoadJson = (relativePath) => {
  try {
    return loadJsonRelative(relativePath);
  } catch (e) {
    console.warn(`Knowledge base file not found, skipping: ${relativePath}`);
    return null;
  }
};

// Astrology books
const brihatParashara = safeLoadJson('src/data/books/astrology/brihat_parashara_hora_shastra.json');
const saravali = safeLoadJson('src/data/books/astrology/saravali.json');
const brihatJataka = safeLoadJson('src/data/books/astrology/brihat_jataka.json');
const phaladeepika = safeLoadJson('src/data/books/astrology/phaladeepika.json');
const jatakaParijata = safeLoadJson('src/data/books/astrology/jataka_parijata.json');
const suryaSiddhanta = safeLoadJson('src/data/books/astrology/surya_siddhanta.json');

// Yoga books
const satChakraNirupana = safeLoadJson('src/data/books/yoga/sat_chakra_nirupana.json');
const sivaSamhita = safeLoadJson('src/data/books/yoga/siva_samhita.json');
const asanaPranayamaMudraBandha = safeLoadJson('src/data/books/yoga/asana_pranayama_mudra_bandha.json');
const hathaYogaPradipika = safeLoadJson('src/data/books/yoga/hatha_yoga_pradipika.json');

// Vedas
const vedas_atharva = safeLoadJson('src/data/books/vedas/atharvaveda.json');
const vedas_rig = safeLoadJson('src/data/books/vedas/rigveda.json');
const vedas_sama = safeLoadJson('src/data/books/vedas/samaveda.json');
const vedas_yajur = safeLoadJson('src/data/books/vedas/yajurveda.json');

export const KNOWLEDGE_BASE = {
  astrology: [brihatParashara, saravali, brihatJataka, phaladeepika, jatakaParijata, suryaSiddhanta].filter(Boolean),
  yoga: [satChakraNirupana, sivaSamhita, asanaPranayamaMudraBandha, hathaYogaPradipika].filter(Boolean),
  vedas: [vedas_atharva, vedas_rig, vedas_sama, vedas_yajur].filter(Boolean)
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
  if (category === 'all' || category === 'vedas') booksToSearch.push(...KNOWLEDGE_BASE.vedas);

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
          const startIdx = Math.max(0, firstTermIndex - 50);
          const endIdx = Math.min(text.length, firstTermIndex + 150);

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

