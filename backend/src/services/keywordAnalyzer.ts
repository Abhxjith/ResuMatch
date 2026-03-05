import * as dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeKeywords = async (
    parsedResumeJson: any,
    jobDescription: string
): Promise<{ matchedKeywords: string[], missingKeywords: string[] }> => {

    // Extract a flat string of skills from the parsed resume to compare
    const resumeSkillsText = (parsedResumeJson.skills || []).map((s: any) => {
        return typeof s === 'string' ? s : (s.name || s.title || '');
    }).join(', ');

    const prompt = `
        You are an expert technical recruiter and ATS keyword analyzer.
        
        Job Description:
        "${jobDescription}"
        
        Candidate's Current Skills:
        "${resumeSkillsText}"
        
        Task:
        1. Extract the most important hard skills, tools, and relevant keywords from the Job Description.
        2. Compare these keywords against the Candidate's Current Skills.
        3. Identify which keywords are already matched.
        4. Identify which important keywords are missing from the candidate's skills.
        
        Output MUST be in strictly valid JSON format matching this schema:
        {
          "matchedKeywords": ["...", "..."],
          "missingKeywords": ["...", "..."]
        }
        
        Do not explain. Return only the JSON without markdown code blocks.
    `;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { temperature: 0.1 } });
        const result = await model.generateContent(prompt);
        let responseText = await result.response.text();

        responseText = responseText.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '').trim();

        return JSON.parse(responseText);
    } catch (error: any) {
        console.error('Keyword Analysis Error:', error);
        // Fallback or throw
        return { matchedKeywords: [], missingKeywords: [] };
    }
};
