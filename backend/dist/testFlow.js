"use strict";
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
const keywordAnalyzer_1 = require("./services/keywordAnalyzer");
const geminiOptimizer_1 = require("./services/geminiOptimizer");
const latexGenerator_1 = require("./services/latexGenerator");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting test flow...");
        const parsedResumeJson = {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "123-456-7890",
            summary: "Software Engineer with 3 years of experience.",
            skills: ["JavaScript", "React", "Node.js"],
            experience: [
                {
                    company: "Tech Corp",
                    role: "Frontend Developer",
                    startDate: "Jan 2020",
                    endDate: "Present",
                    bullets: [
                        "Developed web applications using React.",
                        "Collaborated with backend teams."
                    ]
                }
            ],
            projects: [],
            education: []
        };
        const jobTitle = "Full Stack Engineer";
        const jobDescription = "Looking for a Full Stack Engineer proficient in JavaScript, React, Node.js, and TypeScript. Extensive experience with GraphQL and PostgreSQL is required. You will be building scalable, highly concurrent systems from scratch and managing large data schemas.";
        console.log("\n--- 1. Testing Keyword Analyzer ---");
        const analysis = yield (0, keywordAnalyzer_1.analyzeKeywords)(parsedResumeJson, jobDescription);
        console.log("Analysis Result:\n", analysis);
        console.log("\n--- 2. Testing Gemini Optimizer (Rewrite) ---");
        const optimized = yield (0, geminiOptimizer_1.optimizeResume)(parsedResumeJson, jobTitle, jobDescription);
        console.log("Optimized JSON Result:\n", JSON.stringify(optimized, null, 2));
        console.log("\n--- 3. Testing LaTeX PDF Generator ---");
        const latexResult = yield (0, latexGenerator_1.generateLatex)(optimized);
        console.log("Generated .tex saved and compiled! Source snippet:\n");
        console.log(latexResult.latexSource.substring(0, 300) + "\n...");
        console.log("\nPDF successfully saved at:", latexResult.pdfPath);
        console.log("\n✅ Test completed successfully!");
    });
}
run().catch(error => {
    console.error("Test failed:", error);
});
