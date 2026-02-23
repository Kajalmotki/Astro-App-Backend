import { tarotPredictions, getRandomFallbackReading } from '../data/tarotPredictions';

/* ─────────────────────────────────────────────────
   RICH READING TEMPLATES
   Used to dynamically build detailed readings from
   each card's element / planet / keywords / meaning
───────────────────────────────────────────────── */
const elementWisdom = {
    Fire: {
        energy: "fierce, transformative fire energy",
        advice: "Channel this blazing energy into purposeful action. Fire cards demand courage — they push you to act before doubt extinguishes your spark.",
        chakra: "Solar Plexus (Manipura) — your center of personal power and confidence",
        color: "red and gold"
    },
    Water: {
        energy: "fluid, intuitive water energy",
        advice: "Honor your emotions without drowning in them. Water cards ask you to flow, to feel deeply, and to trust what your heart already knows.",
        chakra: "Sacral (Svadhisthana) — your center of creativity, emotion, and flow",
        color: "deep blue and aquamarine"
    },
    Earth: {
        energy: "grounded, steady earth energy",
        advice: "Root yourself in the present moment. Earth cards ask for patience — great structures are built slowly, with intention and care.",
        chakra: "Root (Muladhara) — your center of security, stability, and groundedness",
        color: "forest green and rich brown"
    },
    Air: {
        energy: "sharp, communicative air energy",
        advice: "Let your mind be your compass. Air cards sharpen your perception and call you to speak, think, and listen with absolute clarity.",
        chakra: "Throat (Vishuddha) — your center of communication, truth, and expression",
        color: "sky blue and white"
    }
};

const planetWisdom = {
    Sun: "The Sun's radiant influence illuminates every corner of this situation, making it difficult to hide from the truth. Vitality, ego, and conscious will are all engaged here.",
    Moon: "The Moon governs the tides of emotion and the unseen. Its silver light reveals what hides in shadow — instincts, dreams, and long-buried feelings are rising to the surface.",
    Mercury: "Mercury, the messenger, activates your intellect and communication. Pay close attention to conversations, messages, and the stories you are telling yourself.",
    Venus: "Venus blesses this reading with her frequency of love and beauty. Relationships, values, and the things that bring you genuine pleasure are the true focus here.",
    Mars: "Mars charges this situation with raw drive and assertive energy. Action is required — but so is discipline to ensure that fire is directed, not scattered.",
    Jupiter: "Jupiter expands whatever it touches. Blessings, abundance, and opportunity are amplified — but so are excesses. Seek wisdom alongside good fortune.",
    Saturn: "Saturn, the great teacher, demands discipline and accountability. The lessons arriving now are not easy, but they are exactly what your soul signed up to learn.",
    Uranus: "Uranus, the cosmic rebel, is shaking your foundations to awaken greater freedom. Expect the unexpected; innovation and liberation are knocking at your door.",
    Neptune: "Neptune dissolves boundaries between the seen and unseen. Spiritual insight is flowing abundantly, but so are illusions — discern carefully what is real.",
    Pluto: "Pluto, the transformer, is at work in the deepest layers of this situation. Something must die so that something truer can be reborn. This is not the end — it is metamorphosis."
};

const buildDeepReading = (card, baseReading) => {
    const el = elementWisdom[card.element] || elementWisdom['Air'];
    const pl = planetWisdom[card.planet] || `The planetary energy of ${card.planet} adds a unique dimension to this reading.`;
    const kw = (card.keywords || []).join(', ');

    return [
        `${baseReading} The cosmos is sending a very specific signal through the archetype of ${card.name}: this card does not arrive by accident. Its appearance marks a pivotal moment where the universe has paused to whisper something important into your awareness.`,

        `${card.name} carries the ${el.energy} of the ${card.element} element. ${el.advice} ${pl} The core themes surfacing now — ${kw} — are not random; they are the exact vocabulary your soul needs to hear right now. Pay attention to where in your daily life these themes are already showing up.`,

        `On a deeper Vedic and karmic level, drawing this card suggests that your current circumstances are the outgrowth of seeds planted in a past cycle. Whether those seeds were sown in this lifetime or another, ${card.name} appears to help you consciously redirect the harvest. You are not powerless here — awareness itself is the first act of liberation. The patterns you recognise today are the patterns you can consciously choose to transform.`
    ].join('\n\n');
};

const buildSpiritualInsight = (card) => {
    const el = elementWisdom[card.element] || elementWisdom['Air'];
    return `The ${el.chakra} is the primary energy center activated by this reading. Work with the healing frequency of ${el.color} through meditation, visualisation, or simply wearing or surrounding yourself with these colours. When you quiet the mind and breathe into this energy center, you may receive direct intuitive guidance that words cannot fully convey.`;
};

const buildActionSteps = (card, baseAdvice) => {
    const el = elementWisdom[card.element] || elementWisdom['Air'];
    return [
        `Sit quietly for 5–10 minutes and meditate on the image of ${card.name}. Notice what emotions, memories, or insights arise spontaneously.`,
        `Journal your response to this question: "Where in my life am I resisting the energy of ${(card.keywords || ['change'])[0]}?" Write without filtering.`,
        `${el.advice}`,
        `${baseAdvice} Revisit this intention at the next full moon to evaluate what has shifted.`,
        `Share one honest truth with someone you trust — the energy of this card is activated through authentic communication and courageous vulnerability.`
    ];
};

const buildAffirmation = (card) => {
    const affirmations = {
        'The Fool': "I trust the universe and step forward with an open heart. Every new beginning is a gift.",
        'The Magician': "I am a powerful creator. All the resources I need are already within me.",
        'The High Priestess': "I trust my intuition. My inner wisdom guides me clearly and lovingly.",
        'The Empress': "I am abundant, creative, and worthy of all that nourishes my soul.",
        'The Emperor': "I lead my life with clarity, purpose, and loving authority.",
        'The Hierophant': "I honour tradition while remaining open to the wisdom that lies within.",
        'The Lovers': "I choose with my heart and align my actions with my deepest values.",
        'The Chariot': "I am focused, determined, and victorious. I overcome every obstacle with grace.",
        'Strength': "I meet every challenge with compassion and quiet inner power.",
        'The Hermit': "In stillness I find my light. My inner guidance is always available to me.",
        'Wheel of Fortune': "I embrace the cycles of life. Change brings opportunity and I flow with it.",
        'Justice': "I stand in my truth. Fairness and balance govern my path.",
        'The Hanged Man': "I willingly release what no longer serves me. Surrender opens new doors.",
        'Death': "I welcome transformation. Every ending reveals a beautiful new beginning.",
        'Temperance': "I find perfect balance in all things. Patience brings me to the highest outcome.",
        'The Devil': "I am free. I release every chain that binds me to fear and limitation.",
        'The Tower': "I am not the structures that fall. I am the light that remains after the storm.",
        'The Star': "I am guided, healed, and blessed. Hope is my natural state of being.",
        'The Moon': "I face my shadows with courage. My intuition lights the way through the dark.",
        'The Sun': "I radiate joy and vitality. Success and happiness are my birthright.",
        'Judgement': "I answer my soul\'s calling. I rise renewed, released from the weight of the past.",
        'The World': "I have arrived. I celebrate my wholeness and step fully into my power."
    };
    return affirmations[card.name] ||
        `I embrace the energy of ${card.name}. I am open, aware, and ready to receive its wisdom.`;
};

/* ─────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────── */
export const getLocalTarotReading = async (userName, question, cardName, cardMeaning, cardData) => {
    await new Promise(resolve => setTimeout(resolve, 900));

    const normalizedCardName = Object.keys(tarotPredictions).find(key =>
        key.toLowerCase() === cardName.toLowerCase()
    );

    const basePrediction = tarotPredictions[normalizedCardName] || {
        ...getRandomFallbackReading(),
        reading: `${cardMeaning}`,
        key_advice: `Reflect consciously on the archetype of ${cardName}.`
    };

    // Enrich with deep dynamic content if cardData is provided
    if (cardData) {
        return {
            ...basePrediction,
            deep_reading: buildDeepReading(cardData, basePrediction.reading),
            spiritual_insight: buildSpiritualInsight(cardData),
            action_steps: buildActionSteps(cardData, basePrediction.key_advice),
            affirmation: buildAffirmation(cardData)
        };
    }

    // Fallback when no cardData object available (uses card name from tarotData lookup)
    return {
        ...basePrediction,
        deep_reading: basePrediction.reading + ` The appearance of ${cardName} signals a moment of cosmic significance. Sit with this energy, reflect on where it is showing up in your daily life, and allow its deeper meaning to unfold through journaling and meditation.`,
        spiritual_insight: `Meditate on the archetypal energy of ${cardName}. Breathe deeply, close your eyes, and invite this card's wisdom to speak to you directly through sensation, imagery, or emotion.`,
        action_steps: [
            `Journal your immediate first reaction to drawing ${cardName} — what feelings, memories, or thoughts arose?`,
            `Reflect on: "What is this card telling me that I already know but have been avoiding?"`,
            basePrediction.key_advice,
            `Choose one small action today that honours the energy of this card.`,
            `Revisit this reading in 7 days and note what has changed in your situation.`
        ],
        affirmation: buildAffirmation({ name: cardName })
    };
};
