import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Origin, Horoscope } from "circular-natal-horoscope-js/dist/index.js";
import { getCurrentDashas, getDashaString } from "./dashaEngine.js";

export const getAIResponse = async (userMessage, userId, userBirthData = null, userName = 'Seeker') => {
    try {
        console.log('Fetching AI Response for:', userMessage);

        let birthDataText = '';
        let userContext = `User Name: ${userName}`;

        // 1. Try to fetch from Firestore (users/uid/...)
        if (userId && userId !== 'guest') {
            try {
                const userDocRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();

                    // Fetch stored name from Firestore if available
                    if (data.name || data.username) {
                        userName = data.name || data.username;
                    }

                    if (data.birthdate && data.birthtime && data.birthplace) {
                        birthDataText = `Born on ${data.birthdate} at ${data.birthtime} in ${data.birthplace}.`;
                    }
                }
            } catch (firestoreError) {
                console.warn('Failed to fetch user data from Firestore:', firestoreError);
            }
        }

        // 2. Fallback/Complement with provided state data
        if (!birthDataText && userBirthData) {
            // Check if it's the raw form data (day, month, year)
            if (userBirthData.day && userBirthData.month && userBirthData.year) {
                birthDataText = `Born on ${userBirthData.day}/${userBirthData.month}/${userBirthData.year} at ${userBirthData.hour}:${userBirthData.min} in ${userBirthData.place || 'Unknown City'}.`;
            } else if (userBirthData.date) {
                birthDataText = `Born on ${userBirthData.date} at ${userBirthData.time} in ${userBirthData.place}.`;
            }
        }

        let dashaContext = "";
        try {
            let dateToParse, timeToParse, latToParse = 0, lngToParse = 0;

            if (userBirthData && userBirthData.day && userBirthData.year) {
                dateToParse = `${userBirthData.day}/${userBirthData.month}/${userBirthData.year}`;
                timeToParse = `${userBirthData.hour}:${userBirthData.min}`;
                latToParse = parseFloat(userBirthData.lat || 0);
                lngToParse = parseFloat(userBirthData.lng || 0);
            } else if (userBirthData && userBirthData.date) {
                dateToParse = userBirthData.date;
                timeToParse = userBirthData.time;
                latToParse = parseFloat(userBirthData.lat || 0);
                lngToParse = parseFloat(userBirthData.lng || 0);
            } else if (birthDataText && birthDataText.includes('Born on')) {
                // Example: Born on 01/04/1991 at 09:45 in Ahmedabad.
                const match = birthDataText.match(/Born on (\d{2}\/\d{2}\/\d{4}) at (\d{1,2}:\d{2})/);
                if (match) {
                    dateToParse = match[1];
                    timeToParse = match[2];
                }
            }

            if (dateToParse && timeToParse) {
                const [day, month, year] = dateToParse.split(/[-/]/).map(Number);
                const [hour, minute] = timeToParse.split(':').map(Number);
                const origin = new Origin({
                    year, month: month - 1, date: day,
                    hour, minute,
                    latitude: latToParse, longitude: lngToParse
                });
                const horoscope = new Horoscope({
                    origin,
                    houseSystem: "placidus",
                    zodiac: "sidereal",
                    aspectPoints: ["bodies"],
                    aspectWithPoints: ["bodies"],
                    aspectTypes: [],
                    customOrbs: {},
                    language: "en"
                });
                const moonLong = horoscope.CelestialBodies.moon.ChartPosition.Ecliptic.DecimalDegrees;
                const jsDate = new Date(year, month - 1, day, hour, minute);
                const dashaTree = getCurrentDashas(jsDate, moonLong, new Date());
                dashaContext = `\n- Current Active Dasha (Mathematically Calculated, use this as absolute truth):\n${getDashaString(dashaTree)}`;
            }
        } catch (e) {
            console.warn("Could not calculate background dasha:", e);
        }

        console.log('AI Context:', birthDataText, dashaContext);

        const prompt = `You are AstroAI, an enlightened and personalized Vedic astrology engine.

User Profile:
- Name: ${userName}
- Natal Details: ${birthDataText}${dashaContext}

User's Query: "${userMessage}"

Instructions:
0. If the user's query is not related to astrology, respond with a general Vedic wisdom. but first greet them with their name and ask what they need help with if they says hii or hello.
1. Analyze the query based on the user's birth details (if available) or provide general Vedic wisdom.
2. Tone: Spiritual and empathetic, but strictly short and precise.
3. CRITICAL: Provide only short and precise answers. Answer strictly what is asked and do not hallucinate extra information or over-explain. If the user asks about their Dasha, refer to the mathematical Current Active Dasha provided in the profile. Keep the prediction under 2-3 short sentences.
4. Address the user by name if appropriate.
5. Do NOT provide a mantra unless the user explicitly asks for one. If not requested, leave the mantra field as an empty string "".
6. Output MUST be a valid JSON object. Do not include markdown code blocks or additional text.

Required JSON Structure:
{
  "prediction": "Your personalized astrological insight (2-3 sentences max).",
  "remedy": "A specific practical remedy (e.g., 'Feed birds on Wednesday' or 'Wear silver').",
  "mantra": "A relevant Sanskrit mantra ONLY IF specifically requested by the user, otherwise empty string ''."
}`;

        const OPENROUTER_API_KEY = "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";
        let responseText = null;

        try {
            console.log(`Attempting to generate with OpenRouter (google/gemini-2.5-flash)...`);
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.5-flash",
                    max_tokens: 1000,
                    messages: [
                        { role: "user", content: prompt }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`OpenRouter API error: ${response.status} ${errorData}`);
            }

            const data = await response.json();
            responseText = data.choices && data.choices[0] && data.choices[0].message.content;

            if (responseText) {
                console.log(`Success with OpenRouter`);
            }
        } catch (modelError) {
            console.warn(`Failed with OpenRouter:`, modelError);
        }

        if (!responseText) {
            throw new Error("OpenRouter failed to generate a response. Check console logs for details.");
        }

        console.log('Gemini Raw Response:', responseText);

        try {
            // Robust JSON extraction
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
            return JSON.parse(jsonStr);
        } catch (e) {
            console.warn('JSON Parse failed, attempting partial recovery', e);
            // If it's not JSON, return the raw text as prediction
            return {
                prediction: responseText.replace(/```json/g, '').replace(/```/g, ''),
                remedy: "Please focus on your breath and find your inner center.",
                mantra: "Om Shanti Shanti Shanti"
            };
        }
    } catch (error) {
        console.error('CRITICAL AI ERROR:', error);
        throw error;
    }
};

export const getAssistantResponse = async (userMessage, userId, userName = 'Seeker') => {
    try {
        console.log('Fetching Query Assistant Response for:', userMessage);

        const prompt = `You are the AstroRevo Query Assistant. 
        
        Your goals:
        1. Answer general queries about life, guidance, and AstroRevo services.
        2. Help users take notes or save important reminders.
        3. Provide helpful, efficient, and professional support.
        4. Greet the user by name (${userName}) if they say hi/hello.
        5. Important: Do NOT perform specific astrological birth-chart readings (Kundli). Focus on general guidance and support.

        User Name: ${userName}
        User's Query: "${userMessage}"

        If the user wants to take a note (e.g., "Take a note about..."), set "isNote" to true.
        
        Tone: High-standard, efficient, helpful, and professional.
        
        Output MUST be a valid JSON object. Do not include markdown code blocks.
        {
          "response": "Your helpful response string.",
          "isNote": true/false,
          "noteContent": "Extracted note if applicable, else null",
          "suggestedActions": ["Action 1", "Action 2"]
        }`;

        const OPENROUTER_API_KEY = "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";
        let responseText = null;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.5-flash",
                    max_tokens: 1000,
                    messages: [
                        { role: "user", content: prompt }
                    ]
                })
            });

            if (response.ok) {
                const data = await response.json();
                responseText = data.choices && data.choices[0] && data.choices[0].message.content;
            } else {
                console.warn(`Query Assistant OpenRouter Error: ${response.status}`);
            }
        } catch (err) {
            console.warn(`Query Assistant failed with OpenRouter`, err);
        }

        if (!responseText) throw new Error("Assistant engines exhausted");

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('Assistant Error:', error);
        return {
            response: "I am here to assist you with your queries and notes. How can I help you today?",
            isNote: false,
            noteContent: null,
            suggestedActions: ["What can you do?", "Save a note"]
        };
    }
};

export const generateTarotReading = async (userName, userQuestion, cardName, cardMeaning) => {
    try {
        console.log(`Generating Tarot Reading for ${userName}: ${cardName} - ${userQuestion}`);

        const prompt = `You are a mystical and intuitive Tarot Reader.
        
        Querent Name: ${userName}
        Question: "${userQuestion}"
        Selected Card: ${cardName}
        Traditional Meaning: ${cardMeaning}

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

        const OPENROUTER_API_KEY = "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";
        let text = null;

        try {
            const result = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.5-flash",
                    max_tokens: 1000,
                    messages: [
                        { role: "user", content: prompt }
                    ]
                })
            });

            if (result.ok) {
                const data = await result.json();
                text = data.choices && data.choices[0] && data.choices[0].message.content;
            } else {
                throw new Error("Failed to fetch from OpenRouter");
            }
        } catch (e) {
            throw new Error(`Tarot reading failed: ${e.message}`);
        }

        console.log("Tarot AI Response:", text);

        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : text;
            return JSON.parse(jsonStr);
        } catch (e) {
            console.warn("JSON Parse failed for Tarot reading, returning raw text", e);
            return {
                reading: text,
                emotion_analysis: "Mysterious",
                outcome_orientation: "Neutral",
                yes_no_verdict: "Uncertain",
                key_advice: "Trust your intuition."
            };
        }

    } catch (error) {
        console.error("Tarot AI Error:", error);
        throw error;
    }
};

export const saveBirthDataToFirestore = async (userId, birthData) => {
    try {
        console.log("saveBirthDataToFirestore called for:", userId, "with data:", birthData);
        if (!userId) return;
        const userDocRef = doc(db, 'users', userId);

        const updateData = {
            birthplace: birthData.place,
            birthdate: birthData.date,
            birthtime: birthData.time,
            updatedAt: new Date().toISOString()
        };

        // If name is provided in birth details, save it as the username/name
        if (birthData.name) {
            console.log("Adding name to updateData:", birthData.name);
            updateData.name = birthData.name;
            updateData.username = birthData.name; // Keep both for compatibility
        } else {
            console.warn("No name found in birthData!");
        }

        console.log("Saving to Firestore:", updateData);
        await setDoc(userDocRef, updateData, { merge: true });
        console.log("Firestore update successful");

        return true;
    } catch (error) {
        console.error('Error saving birth data to Firestore:', error);
        throw error;
    }
};
