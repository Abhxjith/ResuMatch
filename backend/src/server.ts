import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { parseResume } from './services/resumeParser';
import { optimizeResume } from './services/geminiOptimizer';
import { generateLatex } from './services/latexGenerator';
import { updateResumeSession, getSession } from './services/resumeSessionService';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ---------- POST /generate-resume ----------
// Full orchestration: upload PDF + job info → parse → Gemini optimize → (optional) LaTeX → save session
app.post('/generate-resume', upload.single('resume'), async (req, res) => {
    try {
        const { jobTitle, jobDescription } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: 'No resume PDF uploaded.' });
        if (!jobDescription) return res.status(400).json({ success: false, message: 'Job description is required.' });

        // 1. Parse the PDF into structured JSON (uses Gemini for text→JSON)
        const parsedJson = await parseResume(req.file.buffer);

        // 2. Optimize with Gemini in a single API call (keyword analysis + rewrite merged)
        const optimizedJson = await optimizeResume(parsedJson, jobTitle || '', jobDescription);

        // 3. Try to generate LaTeX and compile PDF — graceful degradation if pdflatex not installed
        let latexSource: string | null = null;
        let pdfPath: string | null = null;
        try {
            const latex = await generateLatex(optimizedJson);
            latexSource = latex.latexSource;
            pdfPath = latex.pdfPath;
        } catch (latexErr: any) {
            console.warn('[generate-resume] LaTeX compilation skipped (pdflatex may not be installed):', latexErr.message);
        }

        // 4. Persist session to DB so /download-resume/:id can serve the PDF
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const session = await prisma.resumeSession.create({
            data: {
                optimizedJson: JSON.stringify(optimizedJson),
                latexSource: latexSource || '',
                pdfPath: pdfPath || '',
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                sessionId: session.id,
                parsedJson,
                optimizedJson,
                latexSource,
                pdfPath,
                pdfAvailable: !!pdfPath
            }
        });
    } catch (err: any) {
        console.error('[generate-resume] Error:', err);
        return res.status(500).json({ success: false, message: err.message, stack: err.stack });
    }
});


// ---------- PATCH /update-resume ----------
app.patch('/update-resume', async (req, res) => {
    try {
        const { id, updatedResumeJson, latexSource } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Missing id.' });
        }

        let finalLatexSource = latexSource;
        let pdfPath: string | null = null;

        const { compileLatexSource } = require('./services/latexGenerator');

        try {
            if (latexSource) {
                // If the user directly edited the LaTeX via the frontend
                const latexResult = await compileLatexSource(latexSource);
                finalLatexSource = latexResult.latexSource;
                pdfPath = latexResult.pdfPath;
            } else if (updatedResumeJson) {
                // If they edited JSON
                const latexResult = await generateLatex(updatedResumeJson);
                finalLatexSource = latexResult.latexSource;
                pdfPath = latexResult.pdfPath;
            }
        } catch (latexErr: any) {
            console.warn('[update-resume] LaTeX compilation skipped:', latexErr.message);
        }

        await updateResumeSession(id, updatedResumeJson || {}, finalLatexSource, pdfPath);
        return res.status(200).json({
            success: true,
            data: { id, updatedResumeJson, latexSource: finalLatexSource, pdfPath, pdfAvailable: !!pdfPath }
        });
    } catch (err: any) {
        console.error('[update-resume] Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// ---------- GET /download-resume/:id ----------
app.get('/download-resume/:id', async (req, res) => {
    try {
        const session = await getSession(req.params.id);
        if (!session || !session.pdfPath) {
            return res.status(404).json({ success: false, message: 'Session or PDF not found.' });
        }
        if (!fs.existsSync(session.pdfPath)) {
            return res.status(404).json({ success: false, message: 'PDF file no longer exists on disk.' });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="resume_${req.params.id}.pdf"`);
        fs.createReadStream(session.pdfPath).pipe(res);
    } catch (err: any) {
        console.error('[download-resume] Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// ---------- GET /history ----------
app.get('/history', async (_req, res) => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const sessions = await prisma.resumeSession.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    return res.json({ success: true, data: sessions });
});

// ---------- Health ----------
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ResuMatch backend running on http://localhost:${PORT}`));
