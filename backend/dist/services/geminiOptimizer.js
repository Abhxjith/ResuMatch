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
exports.optimizeResume = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const generative_ai_1 = require("@google/generative-ai");
const resumeOptimizerPrompt_1 = require("../prompts/resumeOptimizerPrompt");
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const optimizeResume = (parsedResumeJson, jobTitle, jobDescription) => __awaiter(void 0, void 0, void 0, function* () {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing in the environment variables.');
    }
    // Single Gemini call — keyword analysis is baked into the system prompt itself
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
            temperature: 0.2, // low = consistent, deterministic, fast
        }
    });
    const prompt = (0, resumeOptimizerPrompt_1.getResumeOptimizerPrompt)(parsedResumeJson, jobTitle, jobDescription);
    try {
        const result = yield model.generateContent(prompt);
        let responseText = yield result.response.text();
        // Strip any accidental markdown fencing
        responseText = responseText.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '').trim();
        return JSON.parse(responseText);
    }
    catch (error) {
        console.error('Error in AI Optimization:', error);
        throw new Error('Failed to optimize resume with Gemini: ' + error.message);
    }
});
exports.optimizeResume = optimizeResume;
