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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
if (process.env.VERCEL && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:/tmp/dev.db';
}
else if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./prisma/dev.db';
}
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const resumeParser_1 = require("./services/resumeParser");
const geminiOptimizer_1 = require("./services/geminiOptimizer");
const latexGenerator_1 = require("./services/latexGenerator");
const resumeSessionService_1 = require("./services/resumeSessionService");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
// ---------- POST /generate-resume ----------
// Full orchestration: upload PDF + job info → parse → Gemini optimize → (optional) LaTeX → save session
app.post('/generate-resume', upload.single('resume'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobTitle, jobDescription } = req.body;
        if (!req.file)
            return res.status(400).json({ success: false, message: 'No resume PDF uploaded.' });
        if (!jobDescription)
            return res.status(400).json({ success: false, message: 'Job description is required.' });
        // 1. Parse the PDF into structured JSON (uses Gemini for text→JSON)
        const parsedJson = yield (0, resumeParser_1.parseResume)(req.file.buffer);
        // 2. Optimize with Gemini in a single API call (keyword analysis + rewrite merged)
        const optimizedJson = yield (0, geminiOptimizer_1.optimizeResume)(parsedJson, jobTitle || '', jobDescription);
        // 3. Try to generate LaTeX and compile PDF — graceful degradation if pdflatex not installed
        let latexSource = null;
        let pdfPath = null;
        try {
            const latex = yield (0, latexGenerator_1.generateLatex)(optimizedJson);
            latexSource = latex.latexSource;
            pdfPath = latex.pdfPath;
        }
        catch (latexErr) {
            console.warn('[generate-resume] LaTeX compilation skipped (pdflatex may not be installed):', latexErr.message);
        }
        // 4. Persist session to DB so /download-resume/:id can serve the PDF
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const session = yield prisma.resumeSession.create({
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
    }
    catch (err) {
        console.error('[generate-resume] Error:', err);
        return res.status(500).json({ success: false, message: err.message, stack: err.stack });
    }
}));
// ---------- PATCH /update-resume ----------
app.patch('/update-resume', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, updatedResumeJson, latexSource } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Missing id.' });
        }
        let finalLatexSource = latexSource;
        let pdfPath = null;
        const { compileLatexSource } = require('./services/latexGenerator');
        try {
            if (latexSource) {
                // If the user directly edited the LaTeX via the frontend
                const latexResult = yield compileLatexSource(latexSource);
                finalLatexSource = latexResult.latexSource;
                pdfPath = latexResult.pdfPath;
            }
            else if (updatedResumeJson) {
                // If they edited JSON
                const latexResult = yield (0, latexGenerator_1.generateLatex)(updatedResumeJson);
                finalLatexSource = latexResult.latexSource;
                pdfPath = latexResult.pdfPath;
            }
        }
        catch (latexErr) {
            console.warn('[update-resume] LaTeX compilation skipped:', latexErr.message);
        }
        yield (0, resumeSessionService_1.updateResumeSession)(id, updatedResumeJson || {}, finalLatexSource, pdfPath);
        return res.status(200).json({
            success: true,
            data: { id, updatedResumeJson, latexSource: finalLatexSource, pdfPath, pdfAvailable: !!pdfPath }
        });
    }
    catch (err) {
        console.error('[update-resume] Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}));
// ---------- GET /download-resume/:id ----------
app.get('/download-resume/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield (0, resumeSessionService_1.getSession)(req.params.id);
        if (!session || !session.pdfPath) {
            return res.status(404).json({ success: false, message: 'Session or PDF not found.' });
        }
        if (!fs_1.default.existsSync(session.pdfPath)) {
            return res.status(404).json({ success: false, message: 'PDF file no longer exists on disk.' });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="resume_${req.params.id}.pdf"`);
        fs_1.default.createReadStream(session.pdfPath).pipe(res);
    }
    catch (err) {
        console.error('[download-resume] Error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}));
// ---------- GET /history ----------
app.get('/history', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const sessions = yield prisma.resumeSession.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    return res.json({ success: true, data: sessions });
}));
// ---------- Health ----------
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ResuMatch backend running on http://localhost:${PORT}`));
