import * as dotenv from 'dotenv';
dotenv.config();

if (process.env.VERCEL && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:/tmp/dev.db';
} else if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { randomUUID } from 'crypto';

import { parseResume } from './services/resumeParser';
import { optimizeResume } from './services/geminiOptimizer';
import { generateLatex } from './services/latexGenerator';
import { updateResumeSession, getSession, createSession } from './services/resumeSessionService';

const { PrismaClient } = require('@prisma/client');
const globalPrisma = new PrismaClient();

if (process.env.VERCEL) {
    globalPrisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ResumeSession" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "parsedJson" TEXT,
            "optimizedJson" TEXT,
            "latexSource" TEXT,
            "pdfPath" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL
        )
    `).then(() => {
        console.log('Database initialized in Vercel /tmp directory');
    }).catch((err: any) => {
        console.error('Failed to initialize db in Vercel:', err);
    });
}

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const log = (msg: string, ...args: any[]) => {
    const ts = new Date().toISOString();
    console.log(`[${ts}] ${msg}`, ...args);
};

// ---------- POST /generate-resume ----------
// Async flow: parse → optimize → PDF → DB (uses pdf-lib, no Chrome)
app.post('/generate-resume', upload.single('resume'), async (req, res) => {
    const start = Date.now();
    try {
        const { jobTitle, jobDescription } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: 'No resume PDF uploaded.' });
        if (!jobDescription) return res.status(400).json({ success: false, message: 'Job description is required.' });

        log('[generate-resume] START');

        // 1. Parse (async)
        const t1 = Date.now();
        const parsedJson = await parseResume(req.file.buffer);
        log('[generate-resume] Parse done', Date.now() - t1, 'ms');

        // 2. Optimize (async)
        const t2 = Date.now();
        const optimizedJson = await optimizeResume(parsedJson, jobTitle || '', jobDescription);
        log('[generate-resume] Optimize done', Date.now() - t2, 'ms');

        // 3. Generate PDF (async, pdf-lib, no Chrome)
        let latexSource: string | null = null;
        let pdfPath: string | null = null;
        try {
            const latex = await generateLatex(optimizedJson);
            latexSource = latex.latexSource;
            pdfPath = latex.pdfPath;
        } catch (latexErr: any) {
            log('[generate-resume] PDF generation failed:', (latexErr as Error).message);
        }
        log('[generate-resume] PDF done', pdfPath ? 'ok' : 'skipped');

        const sessionId = randomUUID();

        // 4. Persist to DB (local storage for now; add cloud storage later)
        const session = await createSession({
            id: sessionId,
            optimizedJson: JSON.stringify(optimizedJson),
            latexSource: latexSource || '',
            pdfPath: pdfPath || '',
        });

        const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
        const downloadUrl = pdfPath ? `${baseUrl}/download-resume/${sessionId}` : null;

        log('[generate-resume] DONE total', Date.now() - start, 'ms');

        return res.status(200).json({
            success: true,
            data: {
                sessionId: session.id,
                parsedJson,
                optimizedJson,
                latexSource,
                pdfPath: downloadUrl || pdfPath,
                pdfAvailable: !!pdfPath,
            }
        });
    } catch (err: any) {
        log('[generate-resume] ERROR', err.message, Date.now() - start, 'ms');
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

        let finalLatexSource = latexSource || '';
        let pdfPath: string | null = null;

        const { compileLatexSource } = require('./services/latexGenerator');

        try {
            if (updatedResumeJson) {
                const latexResult = await generateLatex(updatedResumeJson);
                finalLatexSource = latexResult.latexSource;
                pdfPath = latexResult.pdfPath;
            }
        } catch (latexErr: any) {
            console.warn('[update-resume] PDF generation skipped:', (latexErr as Error).message);
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
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found.' });
        }
        if (!session.pdfPath) {
            return res.status(404).json({ success: false, message: 'PDF not found.' });
        }
        if (!fs.existsSync(session.pdfPath)) {
            return res.status(404).json({ success: false, message: 'PDF file no longer exists on disk.' });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="resume_${req.params.id}.pdf"`);
        fs.createReadStream(session.pdfPath).pipe(res);
    } catch (err: any) {
        console.error('[download-resume] Error:', err);
        return res.status(500).json({ success: false, message: (err as Error).message });
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
