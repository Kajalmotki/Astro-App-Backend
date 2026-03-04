import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
// Shared Gemini client for all backend AI routes
import { getGeminiModel } from './geminiClient.mjs';
// Firebase Admin for server-side Firestore access
import { getAdminDb } from './firebaseAdmin.mjs';

// Reuse existing precise math engine from frontend services
import { precalculateChartData } from '../src/services/localAIApi.js';
import { searchKnowledgeBaseServer } from './knowledgeSearch.mjs';

const app = express();
const PORT = process.env.PORT || 5175;

app.use(cors());
app.use(express.json());

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
        birthDataText = `Born on ${birthData.day}/${birthData.month}/${birthData.year} at ${birthData.hour}:${birthData.min} in ${birthData.place || 'Unknown City'
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
                `"${r.snippet}" (Source: ${r.bookTitle}, Section: ${r.sectionTitle || 'N/A'}, Verse: ${r.verseNumber || 'N/A'
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

/**
 * POST /api/veda-ai/assistant
 * Backend version of the general Query Assistant.
 * Body: {
 *   message: string,
 *   userId?: string,
 *   userName?: string
 * }
 */
app.post('/api/veda-ai/assistant', async (req, res) => {
  try {
    const { message, userId, userName = 'Seeker' } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const prompt = `You are the AstroRevo Query Assistant. 
        
        Your goals:
        1. Answer general queries about life, guidance, and AstroRevo services.
        2. Help users take notes or save important reminders.
        3. Provide helpful, efficient, and professional support.
        4. Greet the user by name (${userName}) if they say hi/hello.
        5. Important: Do NOT perform specific astrological birth-chart readings (Kundli). Focus on general guidance and support.

        User Name: ${userName}
        User's Query: "${message}"

        If the user wants to take a note (e.g., "Take a note about..."), set "isNote" to true.
        
        Tone: High-standard, efficient, helpful, and professional.
        
        Output MUST be a valid JSON object. Do not include markdown code blocks.
        {
          "response": "Your helpful response string.",
          "isNote": true/false,
          "noteContent": "Extracted note if applicable, else null",
          "suggestedActions": ["Action 1", "Action 2"]
        }`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
    const parsed = JSON.parse(jsonStr);
    return res.json(parsed);
  } catch (error) {
    console.error('Backend /api/veda-ai/assistant error:', error);
    return res.status(500).json({
      response:
        'I am here to assist you with your queries and notes. How can I help you today?',
      isNote: false,
      noteContent: null,
      suggestedActions: ['What can you do?', 'Save a note'],
    });
  }
});

/**
 * POST /api/veda-ai/tarot
 * Backend Tarot reading endpoint.
 * Body: {
 *   userName: string,
 *   question: string,
 *   card: string,
 *   meaning: string
 * }
 */
app.post('/api/veda-ai/tarot', async (req, res) => {
  try {
    const { userName = 'Seeker', question, card, meaning } = req.body || {};

    if (!question || !card || !meaning) {
      return res
        .status(400)
        .json({ error: 'Missing question, card, or meaning' });
    }

    const prompt = `You are a mystical and intuitive Tarot Reader.
        
        Querent Name: ${userName}
        Question: "${question}"
        Selected Card: ${card}
        Traditional Meaning: ${meaning}

        Interpret this card specifically in the context of the user's question.
        - Analyze the "emotion" behind the question.
        - Determine if this card indicates a positive, negative, or neutral outcome for this specific query.
        - Provide a clear "Yes", "No", or "Uncertain" verdict if applicable to the question.
        - Provide a deep, descriptive reading that connects the card's symbolism to the user's situation.

        Output MUST be a valid JSON object:
        {
            "reading": "A detailed, 3-4 sentence interpretation of the card for this specific question.",
            "emotion_analysis": "Brief analysis of the question's emotion (e.g., 'Anxious longing', 'Hopeful career ambition').",
            "outcome_orientation": "Positive / Negative / Neutral / Complex",
            "yes_no_verdict": "Yes / No / Uncertain",
            "key_advice": "One sentence of direct advice based on this reading."
        }`;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const parsed = JSON.parse(jsonStr);
      return res.json(parsed);
    } catch (e) {
      console.warn(
        'Backend Tarot JSON parse failed, returning recovered payload:',
        e,
      );
      return res.json({
        reading: text,
        emotion_analysis: 'Mysterious',
        outcome_orientation: 'Neutral',
        yes_no_verdict: 'Uncertain',
        key_advice: 'Trust your intuition.',
      });
    }
  } catch (error) {
    console.error('Backend /api/veda-ai/tarot error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/ask-ai
 * Backwards-compatible Veda AI entrypoint used by localBackendApi.js.
 * Body: {
 *   question: string,
 *   userId?: string,
 *   userName?: string,
 *   birthData?: {...}
 * }
 */
app.post('/api/ask-ai', async (req, res) => {
  try {
    const { question, userId, userName: rawUserName, birthData } = req.body || {};

    if (!question) {
      return res.status(400).json({ error: 'Missing question' });
    }

    // Reuse /api/veda-ai logic by mapping fields
    req.body = {
      message: question,
      userId,
      userName: rawUserName,
      birthData,
    };

    // Delegate by calling the handler logic directly
    return app._router.handle(
      { ...req, url: '/api/veda-ai', method: 'POST' },
      res,
      () => { },
    );
  } catch (error) {
    console.error('Backend /api/ask-ai error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ===================================================================
// User Data Routes  (/api/user/*)
// ===================================================================

/**
 * GET /api/user/birth-data?userId=...
 * Fetch user's saved birth data from Firestore.
 */
app.get('/api/user/birth-data', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const db = getAdminDb();
    if (!db) return res.status(503).json({ error: 'Firebase Admin not configured' });

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.json({ birthData: null });
    }

    const data = userDoc.data();

    if (data.birthdate && data.birthtime && data.birthplace) {
      const birthData = {
        name: data.name || data.username || '',
        place: data.birthplace,
        date: data.birthdate,
        time: data.birthtime,
      };

      // Parse date (DD/MM/YYYY)
      if (data.birthdate) {
        const dp = data.birthdate.split('/');
        if (dp.length === 3) {
          birthData.day = dp[0];
          birthData.month = dp[1];
          birthData.year = dp[2];
        }
      }
      // Parse time (HH:MM or HH:MM:SS)
      if (data.birthtime) {
        const tp = data.birthtime.split(':');
        if (tp.length >= 2) {
          birthData.hour = tp[0];
          birthData.min = tp[1];
          birthData.sec = tp[2] || '00';
        }
      }

      return res.json({ birthData });
    }

    return res.json({ birthData: null });
  } catch (error) {
    console.error('/api/user/birth-data GET error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/user/birth-data
 * Save / update user birth data.
 * Body: { userId, name, birthdate, birthtime, birthplace }
 */
app.post('/api/user/birth-data', async (req, res) => {
  try {
    const { userId, name, birthdate, birthtime, birthplace } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const db = getAdminDb();
    if (!db) return res.status(503).json({ error: 'Firebase Admin not configured' });

    await db.collection('users').doc(userId).set(
      {
        name: name || '',
        birthdate: birthdate || '',
        birthtime: birthtime || '',
        birthplace: birthplace || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('/api/user/birth-data POST error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/user/membership?userId=...
 * Check whether the user has an active membership.
 */
app.get('/api/user/membership', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const db = getAdminDb();
    if (!db) return res.status(503).json({ error: 'Firebase Admin not configured' });

    const userDoc = await db.collection('users').doc(userId).get();
    const isActive = userDoc.exists && userDoc.data()?.membership?.status === 'active';

    return res.json({ active: isActive });
  } catch (error) {
    console.error('/api/user/membership error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/user/wallet?userId=...
 * Get wallet / credits balance.
 */
app.get('/api/user/wallet', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const db = getAdminDb();
    if (!db) return res.status(503).json({ error: 'Firebase Admin not configured' });

    const userDoc = await db.collection('users').doc(userId).get();
    const credits = userDoc.exists ? userDoc.data()?.wallet?.credits ?? 0 : 0;

    return res.json({ credits });
  } catch (error) {
    console.error('/api/user/wallet error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/user/wallet/deduct
 * Deduct credits from the user's wallet (internal use).
 * Body: { userId, amount }
 */
app.post('/api/user/wallet/deduct', async (req, res) => {
  try {
    const { userId, amount } = req.body || {};
    if (!userId || amount == null) {
      return res.status(400).json({ error: 'Missing userId or amount' });
    }

    const db = getAdminDb();
    if (!db) return res.status(503).json({ error: 'Firebase Admin not configured' });

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const currentCredits = userDoc.exists ? userDoc.data()?.wallet?.credits ?? 0 : 0;

    if (currentCredits < amount) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    await userRef.set(
      { wallet: { credits: currentCredits - amount }, updatedAt: new Date().toISOString() },
      { merge: true },
    );

    return res.json({ success: true, remaining: currentCredits - amount });
  } catch (error) {
    console.error('/api/user/wallet/deduct error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ===================================================================
// Payment Routes  (/api/payments/*)
// ===================================================================

/**
 * POST /api/payments/create-order
 * Create a Razorpay order that the frontend can use to open the checkout.
 * Body: { amount (in INR), currency?, receipt?, notes? }
 */
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(503).json({ error: 'Razorpay credentials not configured' });
    }

    const { default: Razorpay } = await import('razorpay');
    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const { amount, currency = 'INR', receipt, notes } = req.body || {};
    if (!amount) return res.status(400).json({ error: 'Missing amount' });

    const order = await instance.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('/api/payments/create-order error:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * POST /api/payments/verify
 * Verify Razorpay payment signature (client-side checkout callback).
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId }
 */
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification params' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(503).json({ error: 'Razorpay secret not configured' });

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Activate membership if userId provided
    if (userId) {
      const db = getAdminDb();
      if (db) {
        await db.collection('users').doc(userId).set(
          {
            membership: {
              status: 'active',
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              amount: 999,
              currency: 'INR',
              purchasedAt: new Date().toISOString(),
              expiresAt: null, // lifetime
            },
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }
    }

    return res.json({ verified: true });
  } catch (error) {
    console.error('/api/payments/verify error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
});

/**
 * POST /api/payments/webhook
 * Razorpay webhook — verifies HMAC signature and auto-activates membership.
 */
app.post('/api/payments/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(503).send('Webhook secret not configured');
    }

    const signature = req.headers['x-razorpay-signature'];
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSig) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;

    if (event === 'payment.captured' && payment) {
      const userId = payment.notes?.userId;
      if (userId) {
        const db = getAdminDb();
        if (db) {
          await db.collection('users').doc(userId).set(
            {
              membership: {
                status: 'active',
                paymentId: payment.id,
                amount: payment.amount / 100,
                currency: payment.currency,
                purchasedAt: new Date().toISOString(),
                expiresAt: null,
              },
              updatedAt: new Date().toISOString(),
            },
            { merge: true },
          );
          console.log(`Webhook: Membership activated for user ${userId}`);
        }
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('/api/payments/webhook error:', error);
    return res.status(500).send('Webhook processing failed');
  }
});

// ===================================================================
// Geocoding & Timezone Routes  (/api/geo/*)
// ===================================================================

/**
 * Rough UTC offset from longitude (15° = 1 hour), rounded to 0.5h.
 */
function calculateOffsetFromLng(lng) {
  const raw = lng / 15;
  return Math.round(raw * 2) / 2;
}

/**
 * GET /api/geo/search-cities?q=...
 * Proxy to Nominatim (OpenStreetMap) — same response shape as frontend searchCities().
 */
app.get('/api/geo/search-cities', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=8`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'AstroRevo-Vedic/1.0 (astrology app)',
      },
    });
    const data = await response.json();

    const cities = data
      .map((item) => ({
        name:
          item.address?.city ||
          item.address?.town ||
          item.address?.village ||
          item.address?.municipality ||
          item.display_name.split(',')[0],
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        country: item.address?.country || '',
        state: item.address?.state || item.address?.county || '',
      }))
      .filter((c) => c.lat && c.lng);

    return res.json(cities);
  } catch (error) {
    console.error('/api/geo/search-cities error:', error);
    return res.json([]);
  }
});

/**
 * GET /api/geo/timezone?lat=...&lng=...
 * Multi-fallback timezone lookup — same shape as frontend getTimezoneForLocation().
 */
app.get('/api/geo/timezone', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Invalid lat/lng' });
    }

    // --- Method 1: timeapi.io (free, no key, accepts lat/lng) ---
    try {
      const url = `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lng}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.timeZone) {
          const offsetH = data.currentUtcOffset?.hours ?? null;
          const offsetM = data.currentUtcOffset?.minutes ?? 0;
          const totalOffset =
            offsetH !== null
              ? parseFloat(offsetH) + (offsetM >= 0 ? offsetM / 60 : -Math.abs(offsetM) / 60)
              : calculateOffsetFromLng(lng);
          return res.json({
            zoneName: data.timeZone,
            gmtOffset: totalOffset,
            abbreviation: data.timeZone.split('/').pop().replace(/_/g, ' '),
          });
        }
      }
    } catch (e) {
      console.warn('timeapi.io failed:', e.message);
    }

    // --- Method 2: Abstract API (free tier) ---
    try {
      const url = `https://timezone.abstractapi.com/v1/current_time/?api_key=7bfbe63a3b9b4f8e8b14929a58571c12&location=${lat},${lng}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.timezone_offset !== undefined) {
          return res.json({
            zoneName: data.timezone_name || 'Unknown',
            gmtOffset: data.timezone_offset,
            abbreviation: data.timezone_abbreviation || 'UTC',
          });
        }
      }
    } catch (e) {
      console.warn('Abstract API failed:', e.message);
    }

    // --- Fallback: longitude estimate ---
    const estimated = calculateOffsetFromLng(lng);
    const sign = estimated >= 0 ? '+' : '';
    return res.json({
      zoneName: `Estimated/UTC${sign}${estimated}`,
      gmtOffset: estimated,
      abbreviation: `UTC${sign}${estimated}`,
    });
  } catch (error) {
    console.error('/api/geo/timezone error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ===================================================================
// Server bootstrap
// ===================================================================

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
