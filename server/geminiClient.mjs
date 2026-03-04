import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Shared Gemini model instance for all backend AI routes.
 * Uses the server-side Gemini key from environment variables.
 */
export const getGeminiModel = () => {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is missing in environment for backend.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'google/gemini-3-flash-preview',
  });
};

