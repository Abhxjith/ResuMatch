import { analyzeKeywords } from './services/keywordAnalyzer';
import { optimizeResume } from './services/geminiOptimizer';
import { generateLatex } from './services/latexGenerator';

async function run() {
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
    const analysis = await analyzeKeywords(parsedResumeJson, jobDescription);
    console.log("Analysis Result:\n", analysis);

    console.log("\n--- 2. Testing Gemini Optimizer (Rewrite) ---");
    const optimized = await optimizeResume(parsedResumeJson, jobTitle, jobDescription);
    console.log("Optimized JSON Result:\n", JSON.stringify(optimized, null, 2));

    console.log("\n--- 3. Testing LaTeX PDF Generator ---");
    const latexResult = await generateLatex(optimized);
    console.log("Generated .tex saved and compiled! Source snippet:\n");
    console.log(latexResult.latexSource.substring(0, 300) + "\n...");
    console.log("\nPDF successfully saved at:", latexResult.pdfPath);

    console.log("\n✅ Test completed successfully!");
}

run().catch(error => {
    console.error("Test failed:", error);
});
