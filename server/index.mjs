import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Reuse existing precise math engine from frontend services
import { precalculateChartData } from '../src/services/localAIApi.js';
import { searchKnowledgeBaseServer } from './knowledgeSearch.mjs';

const app = express();
const PORT = process.env.PORT || 5175;

app.use(cors());
app.use(express.json());

const getGeminiModel = () => {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is missing in environment for backend.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
};

// --- Local AI (Feature "a") helpers ---

const getInitialChartPrompt = (userName, birthData, mathData) => {
  return `You are a strict Vedic Astrologer. I have ALREADY calculated the exact astronomical sidereal planetary positions for the querent (${userName}) using the Swiss Ephemeris (Whole Sign, Sidereal Lahiri).

DO NOT CALCULATE ANYTHING. DO NOT CHANGE THESE POSITIONS. TRUST THIS DATA ABSOLUTELY.

PRECALCULATED EXACT DATA:
Day of Birth: ${mathData.dayOfWeek}
Male/Female: ${birthData.gender}
${mathData.rawText}

YOUR TASK:
Analyze the provided exact data and return a STRICT JSON object representing the chart evaluation.
DO NOT use markdown backticks around the JSON. DO NOT include any introductory or supplementary text.
JUST pure, unescaped JSON matching this EXACT structure:

{
  "lagna": "${mathData.ascSign}",
  "dayOfBirth": "${mathData.dayOfWeek}",
  "planets": [
    { "name": "Sun", "sign": "[Sign]", "degree": "[Deg]", "house": 1 },
    ... etc for all 9 planets using the exact data above
  ],
  "yogas": [
    { "name": "Yoga Name", "description": "Brief description of the yoga and its meaning" }
  ],
  "chakras": ${JSON.stringify(mathData.chakras)},
  "dashaTimeline": ${JSON.stringify(mathData.dashaString)},
  "dashaInsight": "Provide a short 2-3 sentence interpretation of the current Antardasha phase based ONLY on the calculated values above."
}`;
};

const getFollowUpPrompt = (userName, question, previousChart) => {
  return `You are a strict Vedic Astrologer. You have already computed the D1 chart for ${userName}.

Previously generated chart context:
${previousChart}

The user now asks: "${question}"

Answer strictly based on the planetary placements in the chart above. Use BPHS and Saravali rules.
Be precise, engaging, and direct. 
CRITICAL RULES FOR YOUR RESPONSE:
1. Provide a concise, high-level answer.
2. Provide logical, well-reasoned answers based on the classic Vedic rules (BPHS, Saravali).
3. Do NOT list out all the house lords, detailed placements, or step-by-step astrological workings. Keep your internal calculations hidden.
4. Just give the final synthesized insight and precise timing based on the current Dasha.
5. ALWAYS format your answer using bullet points (pointers) for easy reading. Do NOT return large blocks of paragraphs.
6. Do not hallucinate planetary positions.
7. AT THE VERY END OF YOUR RESPONSE, ALWAYS INCLUDE THIS EXACT TEXT: "\\n\\nYour exact 21-Day Personalized Yoga Transformation Plan based on your birth chart is ready and waiting for you in the 21-Day Yoga Plan section under the Reports tab."`;
};

/**
 * POST /api/local-ai
 * Mirrors frontend Local AI behaviour using Gemini on the backend.
 * Body: {
 *   message: string,
 *   userName: string,
 *   birthData: {...},      // same shape as LocalAIChat profile
 *   previousChart?: string // JSON/stringified chart context for follow-ups
 * }
 */
app.post('/api/local-ai', async (req, res) => {
  const { message, userName = 'Seeker', birthData, previousChart } = req.body || {};

  if (!message || !birthData) {
    return res.status(400).json({ error: 'Missing message or birthData' });
  }

  let mathData = null;

  try {
    if (!previousChart) {
      mathData = precalculateChartData(birthData);
      if (!mathData) {
        return res.status(500).json({ error: 'Failed to calculate chart data' });
      }
    }

    let prompt;
    if (previousChart) {
      const kbResults = searchKnowledgeBaseServer(message, 'astrology', 5);
      const contextData =
        kbResults && kbResults.length > 0
          ? 'CLASSICAL TEXT REFERENCES TO CONSIDER FOR THIS QUESTION:\n\n' +
            kbResults
              .map((m) => `Source: ${m.bookTitle}\nRule: ${m.snippet}`)
              .join('\n\n')
          : '(No explicit matching rules found in local texts, rely on standard classic rules.)';

      const enrichedQuestion = `${message}\n\n[SYSTEM CONTEXT: ${contextData}]`;
      prompt = getFollowUpPrompt(userName, enrichedQuestion, previousChart);
    } else {
      prompt = getInitialChartPrompt(userName, birthData, mathData);
    }

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!previousChart) {
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
        const parsedChart = JSON.parse(jsonStr);
        return res.json({ isChartData: true, data: parsedChart });
      } catch (err) {
        console.error('Failed to parse AI JSON chart response (backend):', err, responseText);
        return res.json({ isChartData: true, error: true, data: responseText });
      }
    }

    return res.json({ isChartData: false, data: responseText });
  } catch (error) {
    console.error('Backend /api/local-ai error:', error);

    if (!previousChart && mathData) {
      const offlineChart = {
        lagna: mathData.ascSign,
        dayOfBirth: mathData.dayOfWeek,
        planets: mathData.planets.map((p) => ({
          name: p.name,
          sign: p.sign,
          degree: p.deg,
          house: p.house,
          nakshatra: p.nakshatra,
          pada: p.pada,
        })),
        yogas: [],
        chakras: mathData.chakras,
        dashaTimeline: mathData.dashaString,
        dashaInsight:
          '⚠ AI interpretation unavailable (offline mode). Dasha data above is mathematically accurate.',
      };
      return res.json({ isChartData: true, data: offlineChart });
    }

    if (previousChart) {
      return res.json({ isChartData: false, data: `⚠ AI Error: ${error.message}` });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/veda-ai
 * Backend version of Veda AI chat using Gemini.
 * Body: {
 *   message: string,
 *   userId?: string,
 *   userName?: string,
 *   birthData?: {...} // same as ChatPage birthData
 * }
 */
app.post('/api/veda-ai', async (req, res) => {
  try {
    const { message, userId, userName: rawUserName, birthData } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    let userName = rawUserName || 'Seeker';

    // Build simple birth data text from payload (backend is not reading Firestore directly)
    let birthDataText = '';
    if (birthData) {
      if (birthData.day && birthData.month && birthData.year) {
        birthDataText = `Born on ${birthData.day}/${birthData.month}/${birthData.year} at ${birthData.hour}:${birthData.min} in ${
          birthData.place || 'Unknown City'
        }.`;
      } else if (birthData.date) {
        birthDataText = `Born on ${birthData.date} at ${birthData.time} in ${birthData.place || 'Unknown City'}.`;
      }
      if (birthData.name && !rawUserName) {
        userName = birthData.name;
      }
    }

    // Optional dasha context via precalculated engine, if birth data present
    let dashaContext = '';
    try {
      if (birthData) {
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

        if (dateStr && timeStr) {
          const mathData = precalculateChartData({
            ...birthData,
            date: dateStr,
            time: timeStr,
          });
          if (mathData?.dashaString) {
            dashaContext = `\n- Current Active Dasha (Mathematically Calculated, use this as absolute truth):\n${mathData.dashaString}`;
          }
        }
      }
    } catch (e) {
      console.warn('Could not calculate backend dasha context:', e);
    }

    // Vedic text context using server-side knowledge base
    let vedicContext = '';
    try {
      const searchResults = searchKnowledgeBaseServer(message, 'vedas', 5);
      if (searchResults && searchResults.length > 0) {
        vedicContext =
          '\n\nRelevant Vedic Texts retrieved for context:\n' +
          searchResults
            .map(
              (r) =>
                `"${r.snippet}" (Source: ${r.bookTitle}, Section: ${r.sectionTitle || 'N/A'}, Verse: ${
                  r.verseNumber || 'N/A'
                })`,
            )
            .join('\n');
      }
    } catch (e) {
      console.warn('Failed to fetch Vedic context (backend):', e);
    }

    const prompt = `You are Veda AI, an enlightened and personalized Vedic intelligence engine.

User Profile:
- Name: ${userName}
- Natal Details: ${birthDataText}${dashaContext}${vedicContext}

User's Query: "${message}"

Instructions:
0. Answer any questions the user asks. If the query is related to the Vedas, use the provided Relevant Vedic Texts strongly to guide your answer. Greet them with their name if they say hi or hello.
1. Analyze the query based on the user's birth details (if available) or the provided Vedic wisdom.
2. Tone: Spiritual, highly knowledgeable, and deeply expansive.
3. FORMATTING: You must strictly answer using pointers/bullet lists with clear line breaks (\\n).
4. HIGHLIGHTING: You MUST boldly highlight key concepts, astrological names, or important words using double asterisks (e.g., **Jupiter** or **spiritual growth**). 
5. CITATIONS: If the user asks where something is written, explicitly cite the exact "Source", "Section", and "Verse" exactly as provided in the context (e.g., "According to the **Samaveda**, Part I, Verse 313...").
6. Address the user by name if appropriate.
7. Do NOT provide a mantra unless explicitly requested. If not requested, leave the mantra field empty "".
8. Output MUST be a valid JSON object. Do not include markdown code blocks or additional text outside the JSON.
9. KNOWLEDGE BASE: If the user asks about the source of your knowledge or what Vedas you know, explicitly state that your wisdom is drawn from all four sacred Vedas: the **Rigveda**, **Samaveda**, **Yajurveda**, and **Atharvaveda**.

Required JSON Structure:
{
  "prediction": "Your highly detailed answered formatted with bullet points, using \\n for newlines, and **bold** text for key highlighting.",
  "remedy": "A specific practical remedy.",
  "mantra": "A relevant Sanskrit mantra ONLY IF requested, otherwise ''."
}`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
      const parsed = JSON.parse(jsonStr);
      return res.json(parsed);
    } catch (e) {
      console.warn('Backend Veda AI JSON parse failed, returning recovered payload:', e);
      return res.json({
        prediction: responseText.replace(/```json/g, '').replace(/```/g, ''),
        remedy: 'Please focus on your breath and find your inner center.',
        mantra: 'Om Shanti Shanti Shanti',
      });
    }
  } catch (error) {
    console.error('Backend /api/veda-ai error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

if (process.env.VERCEL) {
  // If deployed to Vercel, don't listen locally, just export the app
  console.log('Running in Vercel Serverless environment');
} else {
  // Otherwise listen on PORT
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Local AstroRevo backend running on http://localhost:${PORT}`);
  });
}

export default app;

