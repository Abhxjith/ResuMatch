import * as dotenv from 'dotenv';
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    console.log("Success with gemini-1.5-pro");
}

/*
To list models, since the listModels method might not exist in this version:
We can make a direct fetch to the API.
*/
async function list() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.models.map((m: any) => m.name));
}

list().catch(console.error);
