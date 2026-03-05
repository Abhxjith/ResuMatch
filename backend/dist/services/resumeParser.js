"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResume = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pdf = require('pdf-parse');
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const parseResume = (fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Extract text from the PDF
    const pdfData = yield pdf(fileBuffer);
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
        const result = yield model.generateContent(prompt);
        let responseText = yield result.response.text();
        // Strip possible markdown blocks just in case
        responseText = responseText.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '').trim();
        const structuredData = JSON.parse(responseText);
        return structuredData;
    }
    catch (error) {
        console.error('Gemini Resume Parsing Error:', error);
        throw new Error('Error converting resume text to structured JSON: ' + error.message);
    }
});
exports.parseResume = parseResume;
