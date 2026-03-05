import * as dotenv from 'dotenv';
dotenv.config();

const pdf = require('pdf-parse');
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const parseResume = async (fileBuffer: Buffer) => {
  // 1. Extract text from the PDF
  const pdfData = await pdf(fileBuffer);
  const rawText = pdfData.text;

  if (!rawText || rawText.trim() === '') {
    throw new Error('Failed to extract any text from the provided PDF document.');
  }

  // 2. Convert the resume text into structured JSON using AI
  const prompt = `
        You are a highly accurate and professional Resume Parser. 
        Read the following raw text extracted from a PDF resume.
        Convert the raw text into the exact target JSON structure.
        
        Target JSON structure:
        {
          "name": "",
          "email": "",
          "phone": "",
          "summary": "",
          "skills": [],
          "experience": [
            {
              "company": "",
              "role": "",
              "startDate": "",
              "endDate": "",
              "bullets": []
            }
          ],
          "projects": [],
          "education": []
        }

        Important Rules:
        - Return ONLY valid JSON.
        - Do not include markdown formatting (like \`\`\`json).
        - If a field cannot be found, represent it as an empty string ("") or an empty array ([]).

        Raw Resume Text:
        ${rawText}
    `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    let responseText = await result.response.text();

    // Strip possible markdown blocks just in case
    responseText = responseText.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '').trim();

    const structuredData = JSON.parse(responseText);
    return structuredData;
  } catch (error: any) {
    console.error('Gemini Resume Parsing Error:', error);
    throw new Error('Error converting resume text to structured JSON: ' + error.message);
  }
};
