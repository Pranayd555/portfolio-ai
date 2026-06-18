import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const originsString = process.env.ALLOWED_ORIGINS || 'http://localhost:4200';
export const ALLOWED_ORIGINS_ARRAY = originsString.split(',').map(origin => origin.trim());

export const env = {
  port: process.env.PORT || 3000,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: ALLOWED_ORIGINS_ARRAY || ['http://pranay.presmistique.in'],
};