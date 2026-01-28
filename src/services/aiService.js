import { GoogleGenerativeAI } from '@google/generative-ai';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Use environment variable for the API key for better security
// You can get a Gemini API Key from https://aistudio.google.com/
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDeROxeSW1DiT1NRGAck1VS-1BxD38k370';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const getAIResponse = async (userMessage, userId, userBirthData = null, userName = 'Seeker') => {
    try {
        console.log('Fetching AI Response for:', userMessage);

        // Debug API Key (do not log full key in production)
        if (!GEMINI_API_KEY) console.error("CRITICAL: No Gemini API Key found!");
        else console.log("API Key loaded:", GEMINI_API_KEY.substring(0, 5) + "..." + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 4));

        // LIST AVAILABLE MODELS (Debug Step)
        try {
            const modelList = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; // Hacky check doesn't list models directly in client SDK mostly.
            // Client SDK doesn't expose listModels easily in v0.x
            // We will rely on the 404 message from the loop if it fails.
        } catch (e) {
            console.log("Model check skipped");
        }

        let birthDataText = '';
        let userContext = `User Name: ${userName}`;

        // 1. Try to fetch from Firestore (users/uid/...)
        if (userId) {
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

        if (!birthDataText) {
            birthDataText = 'Birth data not available. General inquiry.';
        }

        console.log('AI Context:', birthDataText);

        const prompt = `You are AstroAI, an enlightened and personalized Vedic astrology engine.

User Profile:
- Name: ${userName}
- Natal Details: ${birthDataText}

User's Query: "${userMessage}"

Instructions:
0. If the user's query is not related to astrology, respond with a general Vedic wisdom. but first greet them with their name and ask what they need help with if they says hii or hello.
1. Analyze the query based on the user's birth details (if available) or provide general Vedic wisdom.
2. Tone: Spiritual, empathetic, professional, and mysterious.
3. Address the user by name if appropriate.
4. Output MUST be a valid JSON object. Do not include markdown code blocks or additional text.

Required JSON Structure:
{
  "prediction": "Your personalized astrological insight (2-3 sentences).",
  "remedy": "A specific practical remedy (e.g., 'Feed birds on Wednesday' or 'Wear silver').",
  "mantra": "A relevant Sanskrit mantra in English transliteration."
}`;

        // EXCLUSIVE: Using ONLY gemini-2.5-flash as requested
        const modelsToTry = ["gemini-3-flash-preview"];
        let responseText = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting to generate with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                responseText = response.text();

                if (responseText) {
                    console.log(`Success with ${modelName}`);
                    break; // Success!
                }
            } catch (modelError) {
                // Log detailed error info
                console.warn(`Failed with ${modelName}:`);
                if (modelError.response) {
                    console.warn(`Status: ${modelError.response.status}`);
                    console.warn(`Body: ${JSON.stringify(modelError.response.data || await modelError.response.text())}`);
                } else {
                    console.warn(modelError.message || modelError);
                }
                // Continue to next model
            }
        }

        if (!responseText) {
            throw new Error("All Gemini models failed to generate a response. Check console logs for details.");
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
