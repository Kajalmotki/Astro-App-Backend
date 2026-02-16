import { tarotPredictions, getRandomFallbackReading } from '../data/tarotPredictions';

/**
 * Generates a deterministic (but seemingly random) reading based on the card and question.
 * @param {string} userName - The name of the user
 * @param {string} question - The user's question
 * @param {string} cardName - The name of the drawn card
 * @param {string} cardMeaning - The basic meaning of the card
 * @returns {Promise<Object>} - The structured reading
 */
export const getLocalTarotReading = async (userName, question, cardName, cardMeaning) => {
    // Simulate a short network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    // normalize card name to match keys
    const normalizedCardName = Object.keys(tarotPredictions).find(key =>
        key.toLowerCase() === cardName.toLowerCase()
    );

    let prediction = tarotPredictions[normalizedCardName];

    if (!prediction) {
        // Fallback if card is not in our specific database yet
        // In a full app, we'd ensure all 78 are there.
        // For now, we use the passed 'cardMeaning' to generate a generic structure
        // or use the random fallback.
        console.warn(`Card ${cardName} not found in local DB. Using fallback.`);
        return {
            ...getRandomFallbackReading(),
            reading: `${cardMeaning} This card suggests that you should look deeper into your question: "${question}".`,
            key_advice: `Reflect on the energy of ${cardName}.`
        };
    }

    // Return the structured data
    return prediction;
};
