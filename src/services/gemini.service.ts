import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';

const ai = new GoogleGenAI({
    apiKey: env.geminiApiKey
});

export async function askAI(message: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: message,
});

  return response.text;
}