import * as dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import { RESUME_OPTIMIZER_SYSTEM_PROMPT, getUserMessage } from '../prompts/resumeOptimizerPrompt';

const apiKey = (process.env.GEMINI_API_KEY || '').trim();
const genAI = new GoogleGenerativeAI(apiKey);

export const optimizeResume = async (parsedResumeJson: any, jobTitle: string, jobDescription: string) => {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing in the environment variables.');
    }

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: RESUME_OPTIMIZER_SYSTEM_PROMPT,
        generationConfig: {
            temperature: 0.2,
        }
    });

    const prompt = getUserMessage(parsedResumeJson, jobTitle, jobDescription);

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
