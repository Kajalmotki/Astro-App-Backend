const fs = require('fs');
const path = require('path');

// 1. Search Knowledge Base natively
function searchBase(query) {
    const dir = path.join(__dirname, '..', 'src', 'data', 'books', 'astrology');
    const books = fs.readdirSync(dir)
        .filter(f => f.endsWith('.json'))
        .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));

    let res = [];
    const qTerms = query.toLowerCase().replace(/[^\w\s]/gi, '').split(' ').filter(t => t.length > 2);

    books.forEach(b => {
        if (!b.chapters) return;
        b.chapters.forEach(c => {
            if (!c.verses) return;
            c.verses.forEach(v => {
                const t = (v.translation || '').toLowerCase();
                let exactMatched = 0;
                let score = 0;
                qTerms.forEach(term => {
                    const regex = new RegExp(`\\b${term}\\b`, 'g');
                    const matches = (t.match(regex) || []).length;
                    if (matches > 0) {
                        exactMatched++;
                        score += matches * 2;
                    }
                });
                if (score > 0) {
                    res.push({
                        bookTitle: b.title,
                        score: score + (exactMatched * 10),
                        snippet: (v.translation || '').substring(0, 300) + '...',
                    });
                }
            });
        });
    });

    res.sort((a, b) => b.score - a.score);
    return res.slice(0, 5);
}

async function testPrompt() {
    console.log("Searching Database...");
    const msg = "what does my sun in pisces in 11th house predict about my income?";
    const searchResults = searchBase(msg);

    let contextData = "CLASSICAL TEXT REFERENCES TO CONSIDER FOR THIS QUESTION:\n\n" +
        searchResults.map(m => `Source: ${m.bookTitle}\nRule: ${m.snippet}`).join('\n\n');

    console.log("CONTEXT DATA INJECTED:", contextData.substring(0, 200) + "...\n");

    const enrichedQuestion = `${msg}\n\n[SYSTEM CONTEXT: ${contextData}]`;

    const mockPreviousChart = `
Lagna: Taurus
Planets:
Sun | Pisces 15°00' | House 11
Moon | Aries 10°00' | House 12
    `.trim();

    const prompt = `You are a strict Vedic Astrologer. You have already computed the D1 chart for TestUser.

Previously generated chart context:
${mockPreviousChart}

The user now asks: "${enrichedQuestion}"

Answer strictly based on the planetary placements in the chart above. Use BPHS and Saravali rules.
Be precise, engaging, and direct. 
CRITICAL RULES FOR YOUR RESPONSE:
1. Provide a concise, high-level answer.
2. Provide logical, well-reasoned answers based on the classic Vedic rules (BPHS, Saravali).
3. Do NOT list out all the house lords, detailed placements, or step-by-step astrological workings. Keep your internal calculations hidden.
4. Just give the final synthesized insight and precise timing based on the current Dasha.
5. Do not hallucinate planetary positions.`;

    console.log("Calling OpenRouter with classical contexts...");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer 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`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();
    if (data.error) {
        console.error("API ERROR:", data.error);
        return;
    }
    console.log("\n=================== AI RESPONSE ===================");
    console.log(data.choices[0].message.content);
}

testPrompt();
