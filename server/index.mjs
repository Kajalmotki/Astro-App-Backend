import express from 'express';
import cors from 'cors';

// Reuse existing precise math engine from frontend services
import { precalculateChartData } from '../src/services/localAIApi.js';
import { searchKnowledgeBaseServer } from './knowledgeSearch.mjs';

const app = express();
const PORT = process.env.PORT || 5175;

app.use(cors());
app.use(express.json());

/**
 * POST /api/ask-ai
 * Body: {
 *   question: string,
 *   birthData: {
 *     day, month, year, hour, min, sec?, lat, lng, place?, gender?
 *     // or { date: "DD/MM/YYYY", time: "HH:MM", lat, lng, ... }
 *   },
 *   userName: string
 * }
 */
app.post('/api/ask-ai', (req, res) => {
  try {
    const { question, birthData, userName = 'Seeker' } = req.body || {};

    if (!question || !birthData) {
      return res.status(400).json({ error: 'Missing question or birthData' });
    }

    // Normalize birthData into format expected by precalculateChartData
    let dateStr = birthData.date;
    let timeStr = birthData.time;

    if (!dateStr && birthData.day && birthData.month && birthData.year) {
      const dd = String(birthData.day).padStart(2, '0');
      const mm = String(birthData.month).padStart(2, '0');
      const yyyy = String(birthData.year);
      dateStr = `${dd}/${mm}/${yyyy}`;
    }

    if (!timeStr && birthData.hour != null && birthData.min != null) {
      const hh = String(birthData.hour).padStart(2, '0');
      const mm = String(birthData.min).padStart(2, '0');
      timeStr = `${hh}:${mm}`;
    }

    const enrichedBirthData = {
      ...birthData,
      date: dateStr,
      time: timeStr,
    };

    const mathData = precalculateChartData(enrichedBirthData);
    if (!mathData) {
      return res.status(500).json({ error: 'Failed to calculate chart data' });
    }

    // Build a simple textual description of key placements
    const keyPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    const planetSummaryLines = mathData.planets
      .filter((p) => keyPlanets.includes(p.name))
      .map((p) => `${p.name} in ${p.sign} (House ${p.house})`);

    const chartContextText = [
      `Lagna: ${mathData.ascSign} (${mathData.ascLord})`,
      `Day of Birth: ${mathData.dayOfWeek}`,
      ...planetSummaryLines,
    ].join('\n');

    // Use both the question and key placements when searching classical texts
    const searchQuery = `${question} ${planetSummaryLines.join(' ')}`;
    const kbResults = searchKnowledgeBaseServer(searchQuery, 'astrology', 6);

    // Construct a grounded response using only local data
    const topReference = kbResults[0];
    const additionalRefs = kbResults.slice(1, 3);

    let prediction = `Namaste ${userName}. Based on your chart, your ascendant is ${mathData.ascSign} with lord ${mathData.ascLord}. `;
    if (planetSummaryLines.length > 0) {
      prediction += `Key placements include: ${planetSummaryLines.slice(0, 3).join(', ')}. `;
    }

    if (topReference) {
      prediction += `Classical guidance from ${topReference.bookTitle}, ${topReference.sectionTitle} (verse ${topReference.verseNumber}) suggests:\n"${topReference.snippet}"`;
    } else {
      prediction +=
        'No direct verse was found in the local texts for your exact question, so interpret this as a general indication based on your planetary strengths.';
    }

    const remedy =
      'Use this as contemplative guidance only. Align your actions with dharma, maintain regular prayer or meditation, and consult a trusted human astrologer before major life decisions.';

    const responsePayload = {
      prediction,
      remedy,
      mantra: '',
      chartContext: chartContextText,
      sources: kbResults.map((r) => ({
        bookTitle: r.bookTitle,
        sectionTitle: r.sectionTitle,
        verseNumber: r.verseNumber,
      })),
    };

    return res.json(responsePayload);
  } catch (err) {
    console.error('Local /api/ask-ai error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Local AstroRevo backend running on http://localhost:${PORT}`);
});

