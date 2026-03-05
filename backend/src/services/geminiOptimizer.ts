import * as dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getResumeOptimizerPrompt } from '../prompts/resumeOptimizerPrompt';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const optimizeResume = async (parsedResumeJson: any, jobTitle: string, jobDescription: string) => {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing in the environment variables.');
    }

    // Single Gemini call — keyword analysis is baked into the system prompt itself
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
            temperature: 0.2,   // low = consistent, deterministic, fast
        }
    });

    const prompt = getResumeOptimizerPrompt(parsedResumeJson, jobTitle, jobDescription);

    try {
        const result = await model.generateContent(prompt);
        let responseText = await result.response.text();

        // Strip any accidental markdown fencing
        responseText = responseText.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '').trim();

        return JSON.parse(responseText);
    } catch (error: any) {
        console.error('Error in AI Optimization:', error);
        throw new Error('Failed to optimize resume with Gemini: ' + error.message);
    }
};
