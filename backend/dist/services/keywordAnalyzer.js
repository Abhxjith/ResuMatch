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
exports.analyzeKeywords = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const analyzeKeywords = (parsedResumeJson, jobDescription) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract a flat string of skills from the parsed resume to compare
    const resumeSkillsText = (parsedResumeJson.skills || []).map((s) => {
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
        const result = yield model.generateContent(prompt);
        let responseText = yield result.response.text();
        responseText = responseText.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '').trim();
        return JSON.parse(responseText);
    }
    catch (error) {
        console.error('Keyword Analysis Error:', error);
        // Fallback or throw
        return { matchedKeywords: [], missingKeywords: [] };
    }
});
exports.analyzeKeywords = analyzeKeywords;
