/**
 * AstroRevo Chat Automation Service (Mock API)
 * Handles the logic for the automated customer support assistant.
 */

const DELAY_MS = 1500; // Simulated typing/network delay

/**
 * Process the user's message and determine the next step and bot response.
 * @param {number} currentStep - The current step of the conversation (0, 1, 2...)
 * @param {string} userText - The text the user just sent
 * @returns {Promise<{nextStep: number, response: string}>}
 */
export const processUserMessage = (currentStep, userText) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let response = "";
            let nextStep = currentStep;

            switch (currentStep) {
                case 0: // Init -> User sent Query
                    response = getRandomResponse('query_acknowledgement');
                    nextStep = 1; // Move to Outcome Clarification
                    break;

                case 1: // User sent Clarification
                    if (userText.length < 3) {
                        // Fallback if input is too short
                        response = "Could you please elaborate a bit more so I can accurately categorize your request?";
                        nextStep = 1; // Stay on this step
                    } else {
                        response = getRandomResponse('empathy_and_technical_check');
                        nextStep = 2; // Move to Birth Data Check
                    }
                    break;

                case 2: // User sent Birth Data confirmation
                    response = getRandomResponse('forwarding_confirmation');
                    nextStep = 3; // End State
                    break;

                default:
                    response = "Your case is currently in the queue for our Senior Astrologers. If you have additional urgent details, please add them here.";
                    nextStep = 3;
                    break;
            }

            resolve({ nextStep, response });
        }, DELAY_MS);
    });
};

/**
 * Dictionary of professional responses
 */
const responseDictionary = {
    query_acknowledgement: [
        "I have logged your initial query. To ensure our astrologers look at the right chart factors, could you clarify: What is the specific outcome you are hoping for in this situation?",
        "Thank you for sharing. To assist you better, could you specificy: Are you looking for a timing prediction (when will this happen) or a remedial solution (how to fix this)?",
        "I understand. Before I proceed, could you narrow down your focus? Is your main concern related to the immediate future (next 3 months) or a long-term pattern?"
    ],
    empathy_and_technical_check: [
        "I understand completely. These periods can be transformative. One final technical check: Is your birth time accurate to the minute, or is it an estimate? This affects the D-9 chart analysis.",
        "That makes sense. We want to be precise. Please confirm: Is the birth time you provided from a hospital record, or is it an approximate time?",
        "Noted. This context is very helpful. Lastly, please verify: Are you 100% certain of the birth time provided? Even a 5-minute difference can change the divisional charts."
    ],
    forwarding_confirmation: [
        "Thank you. I have compiled your query, context, and time verification. Your specialized ticket has been forwarded to our Senior Developer & Astrologer. You will receive a detailed notification shortly.",
        "Perfect. Your case file is now complete. I have prioritized this message to our expert team. They will analyze the planetary transits and get back to you with a comprehensive report.",
        "Acknowledged. Your request has been successfully tokenized and forwarded to the core astrology team. Expect a detailed response regarding your query soon."
    ]
};

const getRandomResponse = (key) => {
    const options = responseDictionary[key];
    if (!options) return "I processed that.";
    return options[Math.floor(Math.random() * options.length)];
};
